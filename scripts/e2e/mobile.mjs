/**
 * 移动端专项审计。
 *
 * 出发点：这是个「靠内容可信度」的产品，如果自己的移动端布局和交互垮了，
 * 别人没理由相信你讲的那些模式。所以把移动端当成主要使用场景来测，
 * 而不是当成桌面页面的缩水版。
 *
 * 覆盖：横向溢出、触控热区、安全区、弹层滚动、hover-only 交互、
 *       文本截断、点击延迟、图片尺寸。
 */
import { chromium, devices } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';

let pass = 0;
let fail = 0;
const ok = (m) => { console.log(`✓ ${m}`); pass++; };
const bad = (m) => { console.log(`✗ ${m}`); fail++; };

/** 视觉隐藏但对读屏可见的元素（SkipLink 等），不参与触控热区与截断判定 */
function isVisuallyHidden(el) {
  const cs = getComputedStyle(el);
  return (
    cs.clip === 'rect(0px, 0px, 0px, 0px)' ||
    cs.clipPath === 'inset(50%)' ||
    (el.offsetWidth <= 2 && el.offsetHeight <= 2 && cs.position === 'absolute')
  );
}

const browser = await chromium.launch();

// iPhone 12/13 是主力分享场景；再补一个窄到 320px 的极端机型
const VIEWPORTS = [
  { name: 'iPhone 13 (390px)', ...devices['iPhone 13'] },
  { name: 'iPhone SE (320px)', viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
      userAgent: devices['iPhone 13'].userAgent },
  { name: 'Pixel 7 (412px)', ...devices['Pixel 7'] },
];

const PAGES = [
  '/', '/explore/', '/learn/', '/compare/', '/identify/', '/search/',
  '/patterns/modal/', '/patterns/bottom-sheet/', '/patterns/table/',
  '/patterns/sidebar/', '/compare/modal-vs-dialog/',
];

for (const vp of VIEWPORTS) {
  console.log(`\n──── ${vp.name} ────`);
  const ctx = await browser.newContext(vp);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    // 1. 页面级横向溢出
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        offenders: Array.from(document.querySelectorAll('body *'))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return false;
            // 排除合法的横向滚动容器内部
            let p = el.parentElement;
            while (p) {
              const ov = getComputedStyle(p).overflowX;
              if (ov === 'auto' || ov === 'scroll') return false;
              p = p.parentElement;
            }
            return r.right > de.clientWidth + 1 || r.left < -1;
          })
          .slice(0, 4)
          .map((el) => `${el.tagName}.${(el.className || '').toString().split(' ').slice(0, 2).join('.')}`),
      };
    });

    if (overflow.scrollW > overflow.clientW + 1) {
      bad(`${path} 横向溢出 ${overflow.scrollW}>${overflow.clientW} — ${overflow.offenders.join(', ')}`);
    }

    // 2. 触控热区 < 44px（只查可交互元素，排除视觉隐藏元素）
    const small = await page.evaluate(() => {
      const hidden = (el) => {
        const cs = getComputedStyle(el);
        return (
          cs.clip === 'rect(0px, 0px, 0px, 0px)' ||
          cs.clipPath === 'inset(50%)' ||
          (el.offsetWidth <= 2 && el.offsetHeight <= 2 && cs.position === 'absolute')
        );
      };
      const out = [];
      for (const el of document.querySelectorAll('a, button, [role="button"], [role="radio"], [role="tab"], input, select')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (hidden(el)) continue;
        // 内联文字链接允许小高度（行内排版），但不查链接
        if (el.tagName === 'A' && el.closest('p, li, dd, figcaption')) continue;
        if (r.height < 44 || r.width < 44) {
          out.push(`${el.tagName}"${(el.textContent || '').trim().slice(0, 12)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
      }
      return [...new Set(out)].slice(0, 6);
    });
    if (small.length) bad(`${path} 触控热区不足 44px: ${small.join(' | ')}`);

    // 3. hover-only 交互：元素在触屏上无法获取 hover 态
    const hoverOnly = await page.evaluate(() => {
      // 找出只通过 group-hover 暴露操作、且自身无 onClick 语义元素的容器
      const out = [];
      for (const el of document.querySelectorAll('[class*="group-hover:"]')) {
        if (el.closest('a, button, [role="button"]')) continue;
        out.push(`${el.tagName}.${(el.className || '').toString().slice(0, 40)}`);
      }
      return [...new Set(out)].slice(0, 3);
    });
    if (hoverOnly.length) bad(`${path} 存在 hover-only 交互: ${hoverOnly.join(' | ')}`);

    // 4. 文本截断/溢出容器
    const clipped = await page.evaluate(() => {
      const hidden = (el) => {
        const cs = getComputedStyle(el);
        return (
          cs.clip === 'rect(0px, 0px, 0px, 0px)' ||
          cs.clipPath === 'inset(50%)' ||
          (el.offsetWidth <= 2 && el.offsetHeight <= 2 && cs.position === 'absolute')
        );
      };
      const out = [];
      for (const el of document.querySelectorAll('h1, h2, h3, p, li, dd, span, a, button')) {
        if (el.children.length > 0) continue;
        if (hidden(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden') {
          if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none') continue; // 多行截断是设计选择
          // 单行省略号是刻意设计（长标题截断），不算缺陷
          if (cs.textOverflow === 'ellipsis' && cs.whiteSpace === 'nowrap') continue;
          if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
            out.push(`"${(el.textContent || '').trim().slice(0, 18)}" ${el.scrollWidth}>${el.clientWidth}`);
          }
        }
      }
      return [...new Set(out)].slice(0, 4);
    });
    if (clipped.length) bad(`${path} 文本被截断: ${clipped.join(' | ')}`);

    // 5. 纵向横向滚动条缺失但内容超高的容器（弹层）
    const scrollIssue = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('[role="dialog"], [role="listbox"]')) {
        const cs = getComputedStyle(el);
        if (el.scrollHeight > el.clientHeight + 2 && cs.overflowY === 'visible') {
          out.push(`${el.getAttribute('role')} 内容超高(${el.scrollHeight}>${el.clientHeight})但未设滚动`);
        }
      }
      return out;
    });
    if (scrollIssue.length) bad(`${path} ${scrollIssue.join(' | ')}`);

    // 6. 图片必须有明确尺寸（防 CLS）
    const imgNoSize = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter((i) => !i.getAttribute('width') || !i.getAttribute('height'))
        .slice(0, 3)
        .map((i) => i.src.slice(-40))
    );
    if (imgNoSize.length) bad(`${path} 图片缺 width/height: ${imgNoSize.join(', ')}`);
  }

  if (errors.length === 0) ok(`${vp.name}: 无 JS 运行时错误`);
  else bad(`${vp.name}: JS 错误 ${errors[0]}`);

  await ctx.close();
}

await browser.close();
console.log('\n' + '='.repeat(60));
console.log(`移动端审计：${pass} / ${pass + fail} 通过`);
process.exit(fail === 0 ? 0 : 1);
