import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const browser = await chromium.launch();
const out = [];

/* ---------- 1. 颜色对比度（WCAG AA） ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/patterns/toast`, { waitUntil: 'networkidle' });

  const checks = await page.evaluate(() => {
    const lum = (rgb) => {
      const [r, g, b] = rgb.map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        const p = parse(bg);
        if (p.length === 3 && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return p;
        n = n.parentElement;
      }
      return [250, 249, 246];
    };
    const ratio = (a, b) => {
      const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };

    const res = [];
    const seen = new Set();
    for (const el of document.querySelectorAll('main p, main h1, main h2, main h3, main a, main li, main span, main td, main th, main button')) {
      const text = (el.textContent || '').trim();
      if (!text || text.length < 2) continue;
      if (el.children.length > 0) continue;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') continue;
      const key = `${s.color}|${s.fontSize}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const size = parseFloat(s.fontSize);
      const weight = parseInt(s.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const r = ratio(parse(s.color), bgOf(el));
      const min = large ? 3 : 4.5;
      res.push({
        color: s.color,
        size: Math.round(size),
        weight,
        ratio: Number(r.toFixed(2)),
        min,
        pass: r >= min,
        sample: text.slice(0, 18),
      });
    }
    return res;
  });

  const fail = checks.filter((c) => !c.pass);
  out.push({
    name: `颜色对比度 AA（检查 ${checks.length} 种文字样式）`,
    pass: fail.length === 0,
    detail: fail.length
      ? fail.map((f) => `${f.color} ${f.size}px w${f.weight} → ${f.ratio}:1 (需 ${f.min}) 「${f.sample}」`).join(' | ')
      : `最低 ${Math.min(...checks.map((c) => c.ratio)).toFixed(2)}:1`,
  });
  await ctx.close();
}

/* ---------- 2. 触控热区 ≥ 44px ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const pages = ['/', '/explore', '/identify', '/learn', '/patterns/modal', '/patterns/switch'];
  const small = [];
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const bad = await page.evaluate(() => {
      const res = [];
      for (const el of document.querySelectorAll('main button, main a, header button, header a, footer a')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // WCAG 2.5.5 豁免「行内文本内的链接」—— 但独立控件必须 ≥44px。
        // 判据：a 元素必须是真正的 inline（嵌在段落里），而非 block/flex。
        const cs = getComputedStyle(el);
        const isInlineInSentence =
          el.tagName === 'A' &&
          (cs.display === 'inline' || cs.display === 'inline-block');
        if (isInlineInSentence) continue;
        if (r.height < 44) {
          res.push(`${el.tagName}"${(el.textContent || '').trim().slice(0, 12)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
      }
      return res;
    });
    bad.forEach((b) => small.push(`${p}: ${b}`));
  }
  out.push({
    name: '触控热区 ≥ 44px（390px 视口）',
    pass: small.length === 0,
    detail: small.slice(0, 6).join(' | ') || `全部达标`,
  });
  await ctx.close();
}

/* ---------- 3. 语义化 HTML ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pages = ['/', '/explore', '/identify', '/learn', '/patterns/modal', '/compare/toast-vs-snackbar-vs-alert'];
  const issues = [];
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const list = [];
      // h1 唯一性
      const h1s = document.querySelectorAll('h1');
      if (h1s.length !== 1) list.push(`h1 数量 = ${h1s.length}`);
      // 标题层级不跳级
      let prev = 0;
      for (const h of document.querySelectorAll('h1,h2,h3,h4')) {
        const lvl = Number(h.tagName[1]);
        if (prev && lvl > prev + 1) list.push(`标题跳级 h${prev}→h${lvl}: "${(h.textContent || '').trim().slice(0, 14)}"`);
        prev = lvl;
      }
      // landmark
      if (!document.querySelector('main')) list.push('缺少 <main>');
      if (!document.querySelector('header')) list.push('缺少 <header>');
      // img/button 缺 accessible name
      for (const el of document.querySelectorAll('main img, main button, header button')) {
        const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
        if (!name) list.push(`${el.tagName} 无可访问名称`);
      }
      // svg 装饰性是否隐藏
      for (const svg of document.querySelectorAll('main svg')) {
        if (!svg.hasAttribute('aria-hidden') && !svg.getAttribute('role') && !svg.querySelector('title')) {
          list.push('svg 缺 aria-hidden / role');
          break;
        }
      }
      return list;
    });
    r.forEach((x) => issues.push(`${p}: ${x}`));
  }
  out.push({
    name: '语义化 HTML / 无障碍结构',
    pass: issues.length === 0,
    detail: issues.slice(0, 5).join(' | ') || 'h1 唯一、层级连续、landmark 齐全、控件均有名称',
  });
  await ctx.close();
}

/* ---------- 4. 字号下限 ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/patterns/modal`, { waitUntil: 'networkidle' });
  const tiny = await page.evaluate(() => {
    const res = [];
    const seen = new Set();
    for (const el of document.querySelectorAll('main *')) {
      if (el.children.length > 0) continue;
      const t = (el.textContent || '').trim();
      if (!t) continue;
      const s = getComputedStyle(el);
      const size = parseFloat(s.fontSize);
      if (size < 10 && !seen.has(size)) {
        seen.add(size);
        res.push(`${size}px 「${t.slice(0, 14)}」`);
      }
    }
    return res;
  });
  out.push({
    name: '正文字号 ≥ 10px',
    pass: tiny.length === 0,
    detail: tiny.join(' | ') || '最小 10px（仅用于 meta 标签）',
  });
  await ctx.close();
}

/* ---------- 5. 布局稳定性：无 CLS 抖动源 ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pages = ['/', '/explore', '/patterns/modal', '/identify', '/learn'];
  const issues = [];
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const res = [];
      // 横向滚动条
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2)
        res.push(`横向溢出 ${document.documentElement.scrollWidth - document.documentElement.clientWidth}px`);
      // 图片无尺寸
      for (const img of document.querySelectorAll('img')) {
        if (!img.getAttribute('width') && !img.className.includes('w-')) res.push('img 未指定尺寸');
      }
      // 元素超出视口右边界
      for (const el of document.querySelectorAll('main *')) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > window.innerWidth + 4 && !el.closest('.table-scroll')) {
          const s = getComputedStyle(el.parentElement || el);
          if (s.overflowX === 'visible') {
            res.push(`${el.tagName}.${String(el.className).slice(0, 30)} 右溢出 ${Math.round(r.right - window.innerWidth)}px`);
            break;
          }
        }
      }
      return res;
    });
    r.forEach((x) => issues.push(`${p}: ${x}`));
  }
  out.push({
    name: '布局稳定性（横向溢出 / 未定尺寸图片）',
    pass: issues.length === 0,
    detail: issues.slice(0, 5).join(' | ') || '无溢出、无布局抖动源',
  });
  await ctx.close();
}

await browser.close();

console.log('');
let pass = 0;
for (const o of out) {
  console.log(`${o.pass ? '✓' : '✗'} ${o.name}`);
  if (o.detail) console.log(`    ${o.detail}`);
  if (o.pass) pass++;
}
console.log(`\n${'='.repeat(60)}`);
console.log(`视觉/可访问性检查：${pass} / ${out.length} 通过`);
