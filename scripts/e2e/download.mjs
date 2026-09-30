import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const OUT = '/tmp/uifg-downloads';
fs.mkdirSync(OUT, { recursive: true });

let pass = 0;
let fail = 0;
const ok = (m) => { console.log(`✓ ${m}`); pass++; };
const bad = (m) => { console.log(`✗ ${m}`); fail++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

for (const [slug, ratio, label, expectW, expectH] of [
  ['modal', '3:4', '3:4', 900, 1200],
  ['toast', '1:1', '1:1', 1000, 1000],
]) {
  await page.goto(`${BASE}/patterns/${slug}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '生成分享卡片' }).first().click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });

  if (ratio !== '3:4') {
    await page.getByRole('radio', { name: new RegExp('1:1') }).click();
  }

  const dim = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    return c ? { w: c.width, h: c.height } : null;
  });
  if (dim && dim.w === expectW && dim.h === expectH) {
    ok(`${slug} ${label} canvas 尺寸 ${dim.w}×${dim.h}`);
  } else {
    bad(`${slug} ${label} canvas 尺寸异常 — ${JSON.stringify(dim)}，应为 ${expectW}×${expectH}`);
  }

  const dlPromise = page.waitForEvent('download', { timeout: 15000 });
  await page.getByRole('button', { name: /保存为 PNG/ }).click();
  const dl = await dlPromise;

  const fname = dl.suggestedFilename();
  if (fname === `${slug}-${ratio.replace(':', 'x')}.png`) {
    ok(`${slug} ${label} 下载文件名正确 — ${fname}`);
  } else {
    bad(`${slug} ${label} 下载文件名异常 — ${fname}`);
  }

  const saved = path.join(OUT, fname);
  await dl.saveAs(saved);
  const buf = fs.readFileSync(saved);
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (isPng) {
    ok(`${slug} ${label} 文件为合法 PNG — ${(buf.length / 1024).toFixed(1)} KB`);
  } else {
    bad(`${slug} ${label} 文件不是 PNG（magic=${buf.subarray(0, 4).toString('hex')}）`);
  }

  // 校验 PNG 实际像素尺寸
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  if (w === expectW && h === expectH) {
    ok(`${slug} ${label} PNG 实际像素 ${w}×${h}`);
  } else {
    bad(`${slug} ${label} PNG 实际像素异常 — ${w}×${h}`);
  }

  await page.getByRole('button', { name: '关闭' }).click();
  await page.getByRole('dialog').waitFor({ state: 'detached' });
}

if (errors.length === 0) ok('无 JS 运行时错误');
else bad(`有 JS 错误 — ${errors.join(' | ')}`);

await browser.close();
console.log('\n============================================================');
console.log(`分享卡片下载测试：${pass} / ${pass + fail} 通过`);
console.log(`文件保存在 ${OUT}`);
process.exit(fail === 0 ? 0 : 1);
