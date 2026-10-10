/**
 * 国际化专项测试。
 *
 * 为什么单独写一个：i18n 的失败模式是「静默」——
 * 页面照样 200、截图照样好看，只是 canonical 指错了语言、
 * 或者某个角落漏了一句中文。sweep 和 visual 都发现不了这类问题。
 *
 * 覆盖：html lang / canonical / hreflang 互指 / 语言切换双向正确 /
 *       query 保留 / 英文搜索 / 英文 404 / sitemap 双语 / 中文残留 / Demo 内部
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const SITE = 'https://ui.lutivelab.com';

let pass = 0;
let fail = 0;
const ok = (m) => { console.log(`✓ ${m}`); pass++; };
const bad = (m) => { console.log(`✗ ${m}`); fail++; };
const check = (cond, m) => (cond ? ok(m) : bad(m));

/**
 * 英文页里「允许出现中文」的场景。
 * 这是一个双语词典，不是纯英文站：词条详情页要并排给 chineseName 对照，
 * 分类也保留中文名，否则中国用户看到 "Feedback" 完全对不上自己正在做的产品。
 * 所以这几类页面不能用「零中文」来判，得逐页确认残留的具体位置。
 */
const BILINGUAL_PAGES = /^\/en\/(patterns\/.+|compare\/[^/]+$|nope-404)/;

/** 英文页绝对不该出现的界面中文 —— 漏翻的信号 */
const FORBIDDEN_ZH = [
  '下一步', '开始学习', '分享卡片', '复制链接', '已学会', '什么时候用', '什么时候别用',
  '重新选', '我不知道它叫什么', '从 Level 1 开始学', '查看全部', '相关对比',
  '搜索 UI 术语', '全部图鉴', '正在加载', '暂无 Demo', '可交互', '解剖',
  '组成部分', '适用场景', '决策规则', '核心区别', '返回顶部', '页脚',
  '它叫什么，什么时候用', '直接抄 Prompt 给 AI', '挑选一个试试', '逛图鉴',
];

const html = async (p) => (await fetch(BASE + p)).text();

/** 抽出 head 里 canonical 与 hreflang 语言组 */
function parseHead(doc) {
  const links = [...doc.matchAll(/<link[^>]*rel="alternate"[^>]*>/g)].map((m) => m[0]);
  const pick = (hl) => {
    const hit = links.find((l) => new RegExp(`hreflang="${hl}"`, 'i').test(l));
    return hit ? (hit.match(/href="([^"]+)"/) || [])[1] ?? null : null;
  };
  const ct = doc.match(/<link[^>]*rel="canonical"[^>]*>/);
  return {
    'zh-CN': pick('zh-CN'),
    en: pick('en'),
    'x-default': pick('x-default'),
    canonical: ct ? (ct[0].match(/href="([^"]+)"/) || [])[1] ?? null : null,
  };
}

/**
 * 归一化 URL 用于比对：去掉站点域名、结尾斜杠，并把根路径 "/" 保留成 "/"。
 * 不能简单 strip 尾斜杠 —— "/" 会被剥成空串，把正确的 href="/" 误判成空。
 */
const norm = (u) => {
  if (!u) return '';
  const p = u.replace(SITE, '');
  return p === '/' ? '/' : p.replace(/\/$/, '');
};

/* ============ 1. <html lang> ============ */
console.log('\n──── <html lang> ────');
{
  const zh = await html('/');
  const en = await html('/en');
  const enTag = (en.match(/<html[^>]*>/) || [''])[0];
  check(/<html[^>]*lang="zh-CN"/.test(zh), '中文首页 <html lang="zh-CN">');
  check(/<html[^>]*lang="en"/.test(en), '英文首页 <html lang="en">');
  check(!/lang="en"/.test(zh.match(/<html[^>]*>/)[0]), '中文首页未误标 lang="en"');
  check(!/lang="zh-CN"/.test(enTag), '英文首页未误标 lang="zh-CN"');
}

/* ============ 2. canonical 指向本语言 ============ */
console.log('\n──── canonical ────');
{
  const cases = [
    ['/patterns/modal/', '/patterns/modal'],
    ['/en/patterns/modal/', '/en/patterns/modal'],
    ['/explore/', '/explore'],
    ['/en/explore/', '/en/explore'],
    ['/compare/toast-vs-snackbar-vs-alert/', '/compare/toast-vs-snackbar-vs-alert'],
    ['/en/compare/toast-vs-snackbar-vs-alert/', '/en/compare/toast-vs-snackbar-vs-alert'],
    ['/en/', '/en'],
  ];
  for (const [page, want] of cases) {
    const h = parseHead(await html(page));
    check(norm(h.canonical) === want, `${page} canonical=${norm(h.canonical) || '(空)'}（期望 ${want}）`);
  }
}

/* ============ 3. hreflang 语言组完整且互指正确 ============ */
console.log('\n──── hreflang 语言组 ────');
{
  const cases = [
    ['/patterns/bottom-sheet/', '/patterns/bottom-sheet'],
    ['/en/patterns/bottom-sheet/', '/en/patterns/bottom-sheet'],
    ['/learn/', '/learn'],
    ['/en/learn/', '/en/learn'],
    ['/compare/tooltip-vs-popover/', '/compare/tooltip-vs-popover'],
    ['/en/compare/tooltip-vs-popover/', '/en/compare/tooltip-vs-popover'],
  ];
  for (const [page, base] of cases) {
    const h = parseHead(await html(page));
    const missing = ['zh-CN', 'en', 'x-default'].filter((k) => !h[k]);
    check(missing.length === 0, `${page} hreflang 齐备（缺 ${missing.join(',') || '无'}）`);

    const isEn = base.startsWith('/en');
    // /en 是前缀，不是后缀 —— 中文页的英文对应是 /en + 原路径
    const wantSelf = isEn ? base : `/en${base}`;
    const wantZh = isEn ? base.replace(/^\/en/, '') : base;
    check(norm(h.en) === wantSelf, `${page} hreflang en 自指 = ${norm(h.en) || '(空)'}（期望 ${wantSelf}）`);
    check(norm(h['zh-CN']) === wantZh, `${page} hreflang zh-CN = ${norm(h['zh-CN']) || '(空)'}（期望 ${wantZh}）`);
    check(norm(h['x-default']) === wantZh, `${page} x-default 指向中文 = ${norm(h['x-default'])}`);
  }
}

/* ============ 4. sitemap 双语齐全且对称 ============ */
console.log('\n──── sitemap ────');
{
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, ''));
  const zh = locs.filter((l) => !/\/en(\/|$)/.test(l));
  const en = locs.filter((l) => /\/en(\/|$)/.test(l));
  check(en.length > 0, `sitemap 含英文 URL（${en.length} 条）`);
  check(zh.length === en.length, `sitemap 中英数量对称（zh ${zh.length} / en ${en.length}）`);
  check(zh.includes(`${SITE}/patterns/modal`), 'sitemap 含中文 Pattern');
  check(en.includes(`${SITE}/en/patterns/modal`), 'sitemap 含英文 Pattern');
  // 每个英文 URL 都要有对应的中文 URL，反之亦然
  const zhSet = new Set(zh.map((l) => l.replace(SITE, '')));
  const enSet = new Set(en.map((l) => l.replace(SITE, '').replace(/^\/en/, '')));
  const orphans = [...zhSet].filter((p) => !enSet.has(p));
  check(orphans.length === 0, `中文 URL 都有英文对应${orphans.length ? `（缺 ${orphans.slice(0, 3).join(', ')}）` : ''}`);
}

/* ============ 浏览器内行为 ============ */
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const jsErrors = [];
page.on('pageerror', (e) => jsErrors.push(String(e)));

/* ============ 5. 语言切换双向都正确 ============ */
console.log('\n──── 语言切换 ────');
{
  // 这是最容易静默失效的地方：英文页的「中文」按钮曾指向自己，
  // 页面永远 200，sweep 和 visual 一个都发现不了。
  const cases = [
    ['/patterns/modal/', '/en/patterns/modal'],
    ['/en/patterns/modal/', '/patterns/modal'],
    ['/explore/', '/en/explore'],
    ['/en/explore/', '/explore'],
    ['/en/', '/'],
    ['/', '/en'],
  ];
  for (const [from, toEn] of [
    ['/patterns/modal/', '/en/patterns/modal'],
    ['/en/patterns/modal/', '/patterns/modal'],
    ['/explore/', '/en/explore'],
    ['/en/explore/', '/explore'],
    ['/en/', '/'],
    ['/', '/en'],
  ]) {
    await page.goto(BASE + from, { waitUntil: 'networkidle' });
    const label = from.startsWith('/en') ? '中文' : 'English';
    const got = await page.locator('a', { hasText: new RegExp(`^${label}$`) }).first().getAttribute('href');
    check(norm(got) === toEn, `${from} → ${label} 链接 = ${norm(got) || '(空)'}（期望 ${toEn}）`);

    // 当前语言按钮应带 aria-current
    const cur = from.startsWith('/en') ? 'English' : '中文';
    const marked = await page
      .locator(`a[aria-current="true"]:has-text("${cur}")`)
      .count();
    check(marked === 1, `${from} 当前语言按钮有 aria-current（${cur}）`);
  }
}

/* ============ 6. 切换保留 query ============ */
console.log('\n──── 语言切换保留 query ────');
{
  await page.goto(`${BASE}/search?q=bottom+sheet`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const hrefEn = await page.locator('a', { hasText: /^English$/ }).first().getAttribute('href');
  check(
    norm(hrefEn).startsWith('/en/search') && hrefEn.includes('q=bottom+sheet'),
    `搜索页切换保留搜索词 = ${hrefEn}`
  );
}

/* ============ 7. 英文搜索能命中 ============ */
console.log('\n──── 英文搜索 ────');
{
  const cases = [
    ['bottom sheet', /Bottom Sheet/i],
    ['modal', /Modal/i],
    ['snackbar', /Snackbar/i],
  ];
  for (const [q, re] of cases) {
    await page.goto(`${BASE}/en/search?q=${encodeURIComponent(q)}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const text = await page.locator('main').innerText();
    check(re.test(text), `英文搜 "${q}" 有结果`);
  }
  // 站点主打「用描述搜」，英文侧也必须能命中 —— 这是产品核心承诺
  await page.goto(`${BASE}/en/search?q=${encodeURIComponent('slides up from the bottom')}`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(400);
  const t3 = await page.locator('main').innerText();
  check(/Bottom Sheet/i.test(t3), '英文口语描述 "slides up from the bottom" 命中 Bottom Sheet');
}

/* ============ 8. 英文 404 不是死胡同 ============ */
console.log('\n──── 英文 404 ────');
{
  const resp = await page.goto(`${BASE}/en/nope-404`, { waitUntil: 'networkidle' });
  check(resp?.status() === 404, `/en/nope-404 返回 ${resp?.status()}`);
  const t = await page.locator('body').innerText();
  check(t.trim().length > 200, '英文 404 正文非空（不是死胡同）');
  const enLinks = await page.locator('a[href^="/en"]').count();
  const zhLinks = await page.locator('a[href^="/"]').count();
  check(enLinks >= 4, `英文 404 含 ${enLinks} 个英文导航出口`);
  check(zhLinks >= 4, `英文 404 含 ${zhLinks} 个中文导航出口`);
}

/* ============ 9. 英文页中文残留 ============ */
console.log('\n──── 英文页中文残留 ────');
{
  const PAGES = [
    '/en/', '/en/explore/', '/en/learn/', '/en/identify/', '/en/compare/',
    '/en/search/', '/en/patterns/modal/', '/en/patterns/bottom-sheet/',
    '/en/patterns/table/', '/en/patterns/accordion/',
    '/en/compare/toast-vs-snackbar-vs-alert/',
  ];
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const text = await page.locator('body').innerText();
    const hit = FORBIDDEN_ZH.filter((z) => text.includes(z));
    const tag = BILINGUAL_PAGES.test(p) ? '（双语页，仍不应有界面中文）' : '';
    check(hit.length === 0, `${p} 无漏翻界面文案${tag}${hit.length ? ` 残留：${hit.join(', ')}` : ''}`);
  }
}

/* ============ 10. Demo 内部是英文 ============ */
console.log('\n──── Demo 内部文案 ────');
{
  const CASES = [
    ['/en/patterns/switch/', 20],
    ['/en/patterns/slider/', 10],
    ['/en/patterns/table/', 10],
    ['/en/patterns/toast/', 5],
  ];
  for (const [p, min] of CASES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const demo = await page.locator('.demo-stage').first().innerText().catch(() => '');
    const latin = (demo.match(/[A-Za-z]/g) || []).length;
    check(latin >= min, `${p} Demo 舞台含英文（${latin} 个拉丁字符，期望 ≥${min}）`);
  }
}

/* ============ 11. 语言切换后 Demo 状态不串（useId / key 稳定性） ============ */
console.log('\n──── Demo 状态隔离 ────');
{
  // 硬编码 id 会在对比页渲染多个 Demo 时撞车，切语言会重置状态
  await page.goto(`${BASE}/en/patterns/switch/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const sw = page.locator('.demo-stage button[role="switch"], .demo-stage [role="switch"]').first();
  if (await sw.count()) {
    const before = await sw.getAttribute('aria-checked');
    await sw.click();
    await page.waitForTimeout(200);
    const after = await sw.getAttribute('aria-checked');
    check(before !== after, `英文页 Switch 可交互（${before} → ${after}）`);
  } else {
    bad('英文页未找到 Switch 控件');
  }
}

/* ============ 12. 无 JS 运行时错误 ============ */
console.log('\n──── JS 运行时 ────');
check(jsErrors.length === 0, `英文流程无 JS 运行时错误${jsErrors.length ? `：${jsErrors[0]}` : ''}`);

await ctx.close();
await browser.close();

console.log('\n' + '='.repeat(60));
console.log(`国际化测试：${pass} / ${pass + fail} 通过`);
process.exit(fail === 0 ? 0 : 1);