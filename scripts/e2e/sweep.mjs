/**
 * 逐页浏览器冒烟测试：检查控制台错误、页面异常、关键内容是否存在。
 * 用法：node /tmp/sweep.mjs
 */
import { chromium } from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';

// 从 sitemap 拿全量 URL
const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/https?:\/\/[^/]+/, BASE));

// 追加关键页面
const extra = [
  `${BASE}/`,
  `${BASE}/identify`,
  `${BASE}/nope-404`,
];
const all = [...new Set([...urls, ...extra])].filter((u) => !u.endsWith('sitemap.xml'));

console.log(`共 ${all.length} 个页面待测\n`);

const browser = await chromium.launch();
let failCount = 0;
const failures = [];

for (const url of all) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', (r) => {
    const f = r.failure();
    if (f) {
      errors.push(`[requestfailed] ${r.url()} — ${f.errorText}`);
    }
  });

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
    const status = resp?.status() ?? 0;
    const is404 = url.includes('nope-404');
    const expected = is404 ? 404 : 200;

    // 关键内容检查
    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText.trim().length > 200;

    // 空 href 检查
    const emptyHrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href="#"], a[href=""], a:not([href])')].length
    );

    const problems = [];
    if (status !== expected) problems.push(`status ${status} != ${expected}`);
    if (!hasContent) problems.push('body 几乎为空');
    if (emptyHrefs > 0) problems.push(`${emptyHrefs} 个空链接`);
    // 404 测试页本身就会产生 404 资源日志，属预期
    if (!is404) problems.push(...errors);

    if (problems.length) {
      failCount++;
      failures.push({ url, problems });
      console.log(`✗ ${url.replace(BASE, '')}`);
      problems.forEach((p) => console.log(`    ${p}`));
    }
  } catch (e) {
    failCount++;
    failures.push({ url, problems: [e.message] });
    console.log(`✗ ${url.replace(BASE, '')}\n    ${e.message}`);
  }

  await ctx.close();
}

await browser.close();

console.log(`\n${'='.repeat(50)}`);
console.log(`结果：${all.length - failCount} / ${all.length} 通过`);
if (failCount) {
  console.log(`\n失败明细已记录（${failCount} 个页面）`);
}
process.exit(failCount ? 1 : 0);
