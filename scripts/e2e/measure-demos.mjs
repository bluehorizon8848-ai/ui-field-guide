/**
 * 量测所有 Demo 在手机 / 桌面视口的实际展示高度。
 * 找出被压扁的 Demo，为「加大展示区域」提供数据。
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 },
];

const browser = await chromium.launch();

// 从 sitemap 拿全部 pattern 页面
const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const ids = [...xml.matchAll(/<loc>https:\/\/ui-field-guide\.pages\.dev\/patterns\/([^<]+)<\/loc>/g)].map(
  (m) => m[1]
);

console.log(`量测 ${ids.length} 个 Pattern 的 Demo 区域\n`);

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const rows = [];

  for (const id of ids) {
    await page.goto(`${BASE}/patterns/${id}/`, { waitUntil: 'domcontentloaded' });
    const m = await page.evaluate(() => {
      const stage = document.querySelector('.demo-stage');
      if (!stage) return null;
      const r = stage.getBoundingClientRect();
      const fig = stage.closest('figure');
      const fr = fig ? fig.getBoundingClientRect() : null;
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        figH: fr ? Math.round(fr.height) : 0,
        // 舞台内直接子元素的可视高度，判断内容是否被压缩
        childH: Math.round(
          [...stage.children].reduce((m2, c) => Math.max(m2, c.getBoundingClientRect().height), 0)
        ),
      };
    });
    if (m) rows.push({ id, ...m });
  }

  // 按舞台高度升序，最矮的排前面（最容易被压扁）
  rows.sort((a, b) => a.h - b.h);

  const heights = rows.map((r) => r.h);
  const narrow = rows.filter((r) => r.w < 260);
  const short = rows.filter((r) => r.h < 200);

  console.log(`━━━ ${vp.name} (${vp.width}px) ━━━`);
  console.log(`舞台宽 ${Math.min(...rows.map((r) => r.w))}~${Math.max(...rows.map((r) => r.w))}px`);
  console.log(`舞台高 ${Math.min(...heights)}~${Math.max(...heights)}px  中位 ${heights.sort((a, b) => a - b)[Math.floor(heights.length / 2)]}px`);
  console.log(`窄于 260px：${narrow.length} 个${narrow.length ? ` → ${narrow.slice(0, 8).map((r) => `${r.id}(${r.w}px)`).join(', ')}` : ''}`);
  console.log(`矮于 200px：${short.length} 个${short.length ? ` → ${short.slice(0, 12).map((r) => `${r.id}(${r.h}px)`).join(', ')}` : ''}`);

  const ratio = rows.map((r) => r.w / r.h);
  const worst = rows
    .map((r, i) => ({ id: r.id, w: r.w, h: r.h, ar: ratio[i].toFixed(2) }))
    .sort((a, b) => Number(a.ar) - Number(b.ar))
    .slice(0, 6);
  console.log(`最「扁」的：${worst.map((r) => `${r.id} ${r.w}×${r.h}(${r.ar})`).join(', ')}\n`);

  await ctx.close();
}

await browser.close();
