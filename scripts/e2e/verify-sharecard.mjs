/**
 * 验证分享卡片是否真的用上了 Demo 截图，以及高度自适应是否生效。
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] ?? process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const OUT = '/tmp/uifg-card-check';
fs.mkdirSync(OUT, { recursive: true });

let pass = 0;
let fail = 0;
const ok = (m) => { console.log(`✓ ${m}`); pass++; };
const bad = (m) => { console.log(`✗ ${m}`); fail++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({
  acceptDownloads: true,
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

// 采样几个复杂度差异大的 Pattern
for (const slug of ['button', 'icon-button', 'bottom-sheet', 'skeleton', 'modal']) {
  await page.goto(`${BASE}/patterns/${slug}/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '生成分享卡片' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible' });

  // 等真实 Demo 截图生成完成（ready = 用上了真实截图，failed = 走了占位图）
  const state = await page
    .waitForFunction(
      () => {
        const d = document.querySelector('[role="dialog"]');
        const s = d?.getAttribute('data-shot-state');
        return s === 'ready' || s === 'failed' ? s : null;
      },
      { timeout: 15000 }
    )
    .then((h) => h.jsonValue())
    .catch(() => 'timeout');

  if (state !== 'ready') {
    bad(`${slug}: 截图状态 = ${state}（未使用真实 Demo 截图）`);
  } else {
    ok(`${slug}: 截图状态 = ready（真实 Demo 截图已注入）`);
  }
  await page.waitForTimeout(600);

  // 复刻 renderCard 的布局公式，精确采样截图区
  const stats = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return null;
    const ctx = c.getContext('2d', { willReadFrequently: true });

    // 3:4 卡片：W=900 H=1200
    const W = 900, H = 1200;
    const pad = Math.round(W * 0.085);
    const innerW = W - pad * 2;
    let y = pad;
    y += Math.round(W * 0.052) + Math.round(W * 0.055);
    y += Math.round(W * 0.108) * 1.16 + Math.round(W * 0.012);
    y += Math.round(W * 0.045) * 1.45 + Math.round(W * 0.026);
    y += Math.round(W * 0.032) + Math.round(W * 0.042);

    const dpr = c.width / W;
    const d = ctx.getImageData(
      Math.floor(pad * dpr), Math.floor(y * dpr),
      Math.floor(innerW * dpr), Math.floor((H - y) * 0.55 * dpr)
    ).data;

    const colors = new Set();
    let nonBg = 0, total = 0;
    for (let i = 0; i < d.length; i += 4) {
      colors.add(`${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`);
      total++;
      // 背景是 #F5F3EE / #FAF9F6，真实 Demo 会有更深的像素
      if (d[i] < 235 || d[i + 1] < 235 || d[i + 2] < 235) nonBg++;
    }
    return {
      colorBuckets: colors.size,
      nonBgRatio: nonBg / total,
      shotTop: Math.round(y),
    };
  });

  // 真实 Demo 截图：颜色分层明显（>=20 种，骨架屏等单色组件 >=8 种），且有可观的非背景像素（>=3%）
  const minColors = slug === 'skeleton' ? 8 : 20;
  const minRatio = slug === 'skeleton' ? 0.02 : 0.03;
  if (!stats) {
    bad(`${slug}: canvas 未渲染`);
  } else if (stats.colorBuckets < minColors || stats.nonBgRatio < minRatio) {
    bad(
      `${slug}: 截图区内容不足（${stats.colorBuckets} 种颜色，非背景 ${(stats.nonBgRatio * 100).toFixed(1)}%）`
    );
  } else {
    ok(
      `${slug}: 截图区有真实 Demo 内容（${stats.colorBuckets} 种颜色，非背景 ${(stats.nonBgRatio * 100).toFixed(1)}%）`
    );
  }

  // 下载并存盘，人工可查
  const dlP = page.waitForEvent('download', { timeout: 15000 });
  await page.getByRole('button', { name: /保存为 PNG/ }).click();
  const dl = await dlP;
  await dl.saveAs(`${OUT}/${slug}-3x4.png`);

  const buf = fs.readFileSync(`${OUT}/${slug}-3x4.png`);
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  if (isPng && w === 1800 && h === 2400) ok(`${slug}: PNG ${w}×${h}（2x DPR）`);
  else bad(`${slug}: PNG 异常 ${w}×${h} magic=${buf.subarray(0, 4).toString('hex')}`);

  await page.getByRole('button', { name: '关闭' }).click();
  await dialog.waitFor({ state: 'detached' });
}

// 1:1 比例回归：之前硬编码最小高度会导致底部溢出
await page.goto(`${BASE}/patterns/skeleton/`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: '生成分享卡片' }).first().click();
await page
  .waitForFunction(
    () => document.querySelector('[role="dialog"]')?.getAttribute('data-shot-state') !== 'loading',
    { timeout: 15000 }
  )
  .catch(() => {});

const ratios = await page.evaluate(() => {
  const out = [];
  const d = document.querySelector('[role="dialog"]');
  const btns = Array.from(d.querySelectorAll('[role="radio"]'));
  return btns.map((b) => b.textContent?.slice(0, 2));
});
console.log('\n可用比例:', ratios.join(' / '));

for (const r of ['1:1', '3:4']) {
  await page.getByRole('radio', { name: new RegExp(`^${r.replace(':', '[:x]')}`) }).click();
  await page.waitForTimeout(500);
  const fit = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    const ctx = c.getContext('2d', { willReadFrequently: true });
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    // 卡片最底行应该是背景色（#FAF9F6），若最底行有深色说明内容溢出
    const lastRows = [];
    for (let y = c.height - 4; y < c.height; y++) {
      let dark = 0;
      for (let x = 0; x < c.width; x += 4) {
        const i = (y * c.width + x) * 4;
        if (d[i] < 235) dark++;
      }
      lastRows.push(dark);
    }
    return { lastRows, w: c.width, h: c.height };
  });
  const overflow = fit.lastRows.reduce((a, b) => a + b, 0) > 0;
  if (overflow) bad(`${r}: 内容溢出到卡片底边`);
  else ok(`${r}: 内容未溢出（${fit.w}×${fit.h}）`);
}

await page.getByRole('button', { name: '关闭' }).click();
await page.waitForTimeout(300);

// 高度自适应检查
await page.goto(`${BASE}/patterns/icon-button/`, { waitUntil: 'networkidle' });
const heights = [];
for (const id of ['icon-button', 'badge', 'bottom-sheet', 'skeleton', 'timeline']) {
  await page.goto(`${BASE}/patterns/${id}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const h = await page.evaluate(() => {
    const s = document.querySelector('.demo-stage');
    return s ? Math.round(s.getBoundingClientRect().height) : 0;
  });
  heights.push({ id, h });
}
console.log('\n舞台高度（自适应后）:');
for (const x of heights) console.log(`  ${x.id.padEnd(16)} ${x.h}px`);

const allInRange = heights.every((x) => x.h >= 220 && x.h <= 640);
const allAbove200 = heights.every((x) => x.h > 200);
if (allAbove200 && allInRange) ok('高度自适应在合理区间（220~640px）');
else bad('高度自适应区间异常');

if (errors.length === 0) ok('无 JS 运行时错误');
else bad(`JS 错误: ${errors.slice(0, 2).join(' | ')}`);

await browser.close();
console.log('\n' + '='.repeat(60));
console.log(`分享卡片验证：${pass} / ${pass + fail} 通过，文件在 ${OUT}`);
process.exit(fail === 0 ? 0 : 1);
