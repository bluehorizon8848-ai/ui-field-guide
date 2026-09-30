/**
 * 检查 Demo 内部元素在手机窄视口下的挤压情况。
 *
 * 区分两种情况：
 * - 真溢出：元素超出舞台边界且祖先没有 overflow-x-auto（页面会出现横向滚动）
 * - 横向挤压：flex row 容器内多个元素并排但单个过窄（需确认是否 flex-wrap）
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const WIDTH = Number(process.env.W ?? 375);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 812 } });
const page = await ctx.newPage();

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const ids = [...xml.matchAll(/<loc>https:\/\/ui-field-guide\.pages\.dev\/patterns\/([^<]+)<\/loc>/g)].map(
  (m) => m[1]
);

const results = [];

for (const id of ids) {
  await page.goto(`${BASE}/patterns/${id}/`, { waitUntil: 'domcontentloaded' });

  const r = await page.evaluate(() => {
    const stage = document.querySelector('.demo-stage');
    if (!stage) return null;
    const sr = stage.getBoundingClientRect();

    // 页面级横向滚动 = 真问题
    const pageOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;

    const inScrollable = (el) => {
      let p = el.parentElement;
      while (p && p !== stage) {
        const cs = getComputedStyle(p);
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll' || cs.overflow === 'auto') return true;
        p = p.parentElement;
      }
      return false;
    };

    const realOverflow = [];
    const scrollables = new Set();

    for (const c of stage.querySelectorAll('*')) {
      const cr = c.getBoundingClientRect();
      if (cr.width === 0 || cr.height === 0) continue;
      const over = Math.max(cr.right - sr.right, sr.left - cr.left);
      if (over <= 2) continue;
      if (inScrollable(c)) {
        scrollables.add(c.closest('[class*="overflow-x-auto"]') ? 'yes' : 'no');
      } else {
        realOverflow.push({
          tag: c.tagName,
          label: (c.textContent || '').trim().slice(0, 20),
          over: Math.round(over),
        });
      }
    }

    // 挤压：flex row 且不换行，且有多个可见子元素
    // 排除固定侧栏类布局：子元素带 shrink-0 且宽度是设计值（如 w-[60px]）
    const squeezed = [];
    for (const c of stage.children) {
      const cs = getComputedStyle(c);
      if (cs.display !== 'flex' || cs.flexDirection !== 'row') continue;
      if (cs.flexWrap !== 'nowrap') continue; // 允许换行 = 没问题

      const kids = [...c.children].filter((k) => k.getBoundingClientRect().width > 0);
      if (kids.length < 2) continue;

      // 侧栏 + 主内容区是刻意设计：第一个子元素 shrink-0 且有固定宽度
      const first = kids[0];
      const fcs = getComputedStyle(first);
      const isFixedSidebar =
        fcs.flexShrink === '0' && /w-\[/.test(first.className || '') && kids.length === 2;
      if (isFixedSidebar) continue;

      const minW = Math.min(...kids.map((k) => k.getBoundingClientRect().width));
      squeezed.push({ kids: kids.length, minW: Math.round(minW) });
    }

    return {
      pageOverflow,
      realOverflow,
      scrollCount: scrollables.size,
      squeezed,
      stageH: Math.round(sr.height),
    };
  });

  if (r) results.push({ id, ...r });
}

const bad = results.filter((r) => r.pageOverflow > 2 || r.realOverflow.length || r.squeezed.length);

console.log(`视口 ${WIDTH}px — ${bad.length} / ${results.length} 个 Demo 有问题\n`);

const pageOv = bad.filter((r) => r.pageOverflow > 2);
if (pageOv.length) {
  console.log(`━━ 页面级横向滚动（${pageOv.length} 个）━━`);
  for (const r of pageOv) console.log(`  ${r.id.padEnd(22)} 溢出 ${r.pageOverflow}px`);
  console.log('');
}

const realOv = bad.filter((r) => r.realOverflow.length);
if (realOv.length) {
  console.log(`━━ 元素真溢出（非滚动容器内）━━`);
  for (const r of realOv.slice(0, 12)) {
    const w = r.realOverflow.sort((a, b) => b.over - a.over)[0];
    console.log(`  ${r.id.padEnd(22)} ${r.realOverflow.length} 处，最深 ${w.over}px — ${w.tag} "${w.label}"`);
  }
  console.log('');
}

const sq = bad.filter((r) => r.squeezed.length);
if (sq.length) {
  console.log(`━━ flex nowrap 挤压（${sq.length} 个）━━`);
  for (const r of sq.slice(0, 14)) {
    const s = r.squeezed.sort((a, b) => a.minW - b.minW)[0];
    console.log(`  ${r.id.padEnd(22)} ${s.kids} 个并排 nowrap，最窄 ${s.minW}px`);
  }
}

// 高度统计（确认 min-height 生效）
const hs = results.map((r) => r.stageH).sort((a, b) => a - b);
console.log(`\n舞台高 ${Math.min(...hs)}~${Math.max(...hs)}px，中位 ${hs[Math.floor(hs.length / 2)]}px`);
console.log(`矮于 200px：${hs.filter((h) => h < 200).length} 个`);

await browser.close();
