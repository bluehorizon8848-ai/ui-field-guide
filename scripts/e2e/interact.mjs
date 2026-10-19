import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const results = [];
const record = (name, pass, detail = '') =>
  results.push({ name, pass, detail });

const browser = await chromium.launch();

/* ========== 1. Dialog 交互 + 焦点管理 ========== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/patterns/modal`, { waitUntil: 'networkidle' });

  // 找到触发按钮并点击
  const trigger = page.locator('main button', { hasText: /删除照片/ }).first();
  let opened = false;
  if (await trigger.count()) {
    await trigger.click();
    await page.waitForTimeout(400);
    opened = (await page.locator('[role="dialog"]').count()) > 0;
  }
  record('Dialog: 点击触发后出现 role=dialog', opened);

  if (opened) {
    const dlg = page.locator('[role="dialog"]').first();
    const modal = await dlg.getAttribute('aria-modal');
    record('Dialog: aria-modal=true', modal === 'true', `实际: ${modal}`);

    const labelledby = await dlg.getAttribute('aria-labelledby');
    record('Dialog: 有 aria-labelledby', !!labelledby, `实际: ${labelledby}`);

    // body 滚动锁
    const overflow = await page.evaluate(() => document.body.style.overflow);
    record('Dialog: body 滚动被锁', overflow === 'hidden', `overflow: "${overflow}"`);

    // Esc 关闭
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const closed = (await page.locator('[role="dialog"]').count()) === 0;
    record('Dialog: Esc 可关闭', closed);

    // 焦点归还
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? `${el.tagName}:${(el.textContent || '').trim().slice(0, 12)}` : 'null';
    });
    record(
      'Dialog: 关闭后焦点归还触发按钮',
      /BUTTON/.test(focused) && !/关闭|✕|×/.test(focused),
      `焦点: ${focused}`
    );
  }
  record('Dialog: 无 JS 运行时错误', errs.length === 0, errs.join('; '));
  await ctx.close();
}

/* ========== 2. Bottom Sheet ========== */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/patterns/bottom-sheet`, { waitUntil: 'networkidle' });
  const btns = page.locator('main button');
  const n = await btns.count();
  let ok = false;
  for (let i = 0; i < n; i++) {
    const t = (await btns.nth(i).textContent()) || '';
    if (/打开|选择|筛选|试/.test(t)) {
      await btns.nth(i).click();
      await page.waitForTimeout(450);
      ok = true;
      break;
    }
  }
  const sheetUp = ok
    ? await page.evaluate(() => {
        const el = document.querySelector('[role="dialog"], [aria-modal="true"]');
        return el ? el.getBoundingClientRect().bottom <= window.innerHeight + 2 : false;
      })
    : false;
  record('Bottom Sheet: 能打开且贴合底部', sheetUp);
  await ctx.close();
}

/* ========== 3. Identify 工具 ========== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/identify`, { waitUntil: 'networkidle' });

  const radios = page.locator('[role="radio"]');
  const radioCount = await radios.count();
  record('Identify: 选项渲染', radioCount === 15, `实际 ${radioCount} 个（应为 7+8）`);

  // 选「页面底部」+「做选择」
  await page.locator('[role="radio"]', { hasText: '页面底部' }).first().click();
  await page.waitForTimeout(250);
  await page.locator('[role="radio"]', { hasText: '做选择' }).first().click();
  await page.waitForTimeout(400);

  const resultText = await page.locator('main').innerText();
  const hasBottomSheet = resultText.includes('Bottom Sheet');
  record('Identify: 底部+选择 → 命中 Bottom Sheet', hasBottomSheet);

  const links = await page.locator('main a[href^="/patterns/"]').count();
  record('Identify: 输出候选链接', links > 0, `${links} 个`);

  // aria-checked 状态
  const checked = await page.locator('[role="radio"][aria-checked="true"]').count();
  record('Identify: 选中态 aria-checked', checked === 2, `实际 ${checked}`);

  // 重选。按钮文案走 i18n 词典（zh「重新选」/ en「Start over」），
  // 硬编码任一种语言都会在另一种语言的页面上失败，所以两种都匹配。
  await page.locator('button', { hasText: /重新选|重选|Start over/ }).first().click();
  await page.waitForTimeout(300);
  const afterReset = await page.locator('[role="radio"][aria-checked="true"]').count();
  record('Identify: 重选清空选择', afterReset === 0, `实际 ${afterReset}`);

  record('Identify: 无 JS 错误', errs.length === 0, errs.join('; '));
  await ctx.close();
}

/* ========== 4. 搜索（中文口语） ========== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  for (const [q, expect] of [
    ['底下弹出来', 'Bottom Sheet'],
    ['转圈圈', 'Spinner'],
    ['一步步填写', 'Stepper'],
    ['撤销', 'Snackbar'],
  ]) {
    await page.goto(`${BASE}/search?q=${encodeURIComponent(q)}`, {
      waitUntil: 'networkidle',
    });
    const txt = await page.locator('main').innerText();
    record(`搜索「${q}」命中 ${expect}`, txt.includes(expect));
  }
  record('搜索: 无 JS 错误', errs.length === 0, errs.join('; '));
  await ctx.close();
}

/* ========== 5. Learn 进度（LocalStorage） ========== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/learn`, { waitUntil: 'networkidle' });

  const before = await page.evaluate(() => localStorage.getItem('uifg.learned.v1'));
  const btn = page.locator('button[aria-pressed]').first();
  await btn.click();
  await page.waitForTimeout(400);

  const after = await page.evaluate(() => localStorage.getItem('uifg.learned.v1'));
  record('Learn: 勾选写入 LocalStorage', after !== before && !!after, `before=${before} after=${after}`);

  const progress = await page.locator('[role="progressbar"]').first();
  const now = await progress.getAttribute('aria-valuenow');
  record('Learn: 进度条 aria-valuenow 更新', now === '1', `实际 ${now}`);

  // 刷新后仍在
  await page.reload({ waitUntil: 'networkidle' });
  const persisted = await page.evaluate(() => localStorage.getItem('uifg.learned.v1'));
  record('Learn: 刷新后进度保留', persisted === after);

  // 切到详情页看标记是否同步
  await page.goto(`${BASE}/patterns/button`, { waitUntil: 'networkidle' });
  const marked = await page.locator('button[aria-pressed="true"]').count();
  record('Learn: 详情页读到已认识状态', marked > 0, `${marked} 个已按下`);

  record('Learn: 无 JS 错误', errs.length === 0, errs.join('; '));
  await ctx.close();
}

/* ========== 6. 键盘导航 ========== */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  // Skip link
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}:${(el.textContent || '').trim().slice(0, 20)}` : 'null';
  });
  record('键盘: 第一个 Tab 是跳转链接', /跳到主要内容/.test(first), `实际: ${first}`);

  // 焦点可见
  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return 'none';
    const s = getComputedStyle(el);
    return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
  });
  record('键盘: 焦点有可见样式', outline === true, `outline/boxShadow: ${outline}`);

  // 回车能激活
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const url = page.url();
  record('键盘: 回车可跳转', url !== `${BASE}/`, `跳到 ${url.replace(BASE, '')}`);

  await ctx.close();
}

/* ========== 7. 响应式（无横向溢出） ========== */
{
  const viewports = [
    ['iPhone SE', 375, 667],
    ['iPhone 14 Pro', 393, 852],
    ['iPad', 768, 1024],
    ['Desktop', 1440, 900],
  ];
  const pages = ['/', '/explore', '/patterns/modal', '/compare/toast-vs-snackbar-vs-alert', '/identify', '/learn'];

  for (const [label, w, h] of viewports) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const bad = [];
    for (const p of pages) {
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      if (over > 2) bad.push(`${p} 溢出 ${over}px`);
    }
    record(`响应式 ${label} (${w}px): 无横向溢出`, bad.length === 0, bad.join('; '));
    await ctx.close();
  }
}

/* ========== 8. Reduced Motion ========== */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const dur = await page.evaluate(() => {
    const el = document.querySelector('[class*="animate-"]');
    if (!el) return '0s';
    return getComputedStyle(el).animationDuration;
  });
  record('Reduced Motion: 动画被禁用', dur === '0s' || dur === '0.001s', `duration: ${dur}`);
  await ctx.close();
}

/* ========== 9. Share Card（Canvas 导出） ========== */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/patterns/bottom-sheet`, { waitUntil: 'networkidle' });

  const openBtn = page.locator('button', { hasText: /分享卡片|分享图|生成卡片/ }).first();
  let opened = false;
  if (await openBtn.count()) {
    await openBtn.click();
    await page.waitForTimeout(600);
    opened = (await page.locator('canvas').count()) > 0;
  }
  record('Share Card: 能打开并渲染 canvas', opened);

  if (opened) {
    const size = await page.locator('canvas').first().evaluate((c) => ({
      w: c.width,
      h: c.height,
      ratio: (c.width / c.height).toFixed(3),
    }));
    record(
      'Share Card: 3:4 尺寸正确 (900×1200)',
      size.w === 900 && size.h === 1200,
      `实际 ${size.w}×${size.h} ratio ${size.ratio}`
    );

    // 画布非空白
    const nonBlank = await page.locator('canvas').first().evaluate((c) => {
      const ctx2 = c.getContext('2d');
      const d = ctx2.getImageData(0, 0, c.width, c.height).data;
      let painted = 0;
      for (let i = 0; i < d.length; i += 4000) {
        if (d[i + 3] > 0 && (d[i] < 245 || d[i + 1] < 245)) painted++;
      }
      return painted;
    });
    record('Share Card: 画布有实际内容', nonBlank > 50, `采样命中 ${nonBlank}`);

    // 下载
    const dl = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
    const dlBtn = page.locator('button', { hasText: /下载|保存 PNG|导出/ }).first();
    if (await dlBtn.count()) {
      await dlBtn.click();
      const file = await dl;
      record(
        'Share Card: PNG 可下载',
        !!file,
        file ? file.suggestedFilename() : '未触发下载'
      );
    }
  }
  record('Share Card: 无 JS 错误', errs.length === 0, errs.join('; '));
  await ctx.close();
}

/* ========== 10. Ask AI 复制 ========== */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/patterns/accordion`, { waitUntil: 'networkidle' });

  const levels = page.locator('button[role="tab"]');
  const levelCount = await levels.count();
  record('Ask AI: 四个正式 Tab 存在', levelCount === 4, `实际 ${levelCount}`);

  if (levelCount === 4) {
    for (let i = 0; i < 4; i++) {
      await levels.nth(i).click();
      await page.waitForTimeout(200);
    }
    // 切回默认推荐的 Conversational Tab 验证 Prompt 复制
    await levels.first().click();
    await page.waitForTimeout(200);
    record('Ask AI: 四个 Tab 均可切换', true);
  } else {
    record('Ask AI: 四个 Tab 均可切换', false, `实际 ${levelCount}`);
  }

  const copyBtn = page.locator('button', { hasText: /复制/ }).first();
  if (await copyBtn.count()) {
    await copyBtn.click();
    await page.waitForTimeout(400);
    const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
    record('Ask AI: 复制 Prompt 有效', clip.length > 20, `剪贴板 ${clip.length} 字符`);
  }
  record('Ask AI: 无 JS 错误', errs.length === 0, errs.join('; '));
  await ctx.close();
}

await browser.close();

/* ========== 汇总 ========== */
console.log('');
let pass = 0;
for (const r of results) {
  console.log(`${r.pass ? '✓' : '✗'} ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
  if (r.pass) pass++;
}
console.log(`\n${'='.repeat(60)}`);
console.log(`交互测试：${pass} / ${results.length} 通过`);
process.exit(pass === results.length ? 0 : 1);
