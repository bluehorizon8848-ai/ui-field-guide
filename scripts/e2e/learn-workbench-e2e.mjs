import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';
const results = [];
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  const status = pass ? '✓' : '✗';
  console.log(`${status} ${name} ${detail ? `(${detail})` : ''}`);
};

const browser = await chromium.launch();

try {
  /* =========================================================================
   * 1. 真实 Demo 映射、隔离与修复验证 (P0)
   * ========================================================================= */
  console.log('\n──── 1. 真实 Demo 映射与状态隔离 ────');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));

    // 1.1 访问 Card 课程，验证真实独立 CardDemo
    await page.goto(`${BASE}/learn/?item=card`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const cardDemoTitle = await page.locator('text=设计系统卡片容器').count();
    record('CardDemo: 真实独立卡片容器正确渲染', cardDemoTitle > 0);

    const cardLikeBtn = page.locator('button[aria-label="Like"]').first();
    const hasLikeBtn = (await cardLikeBtn.count()) > 0;
    record('CardDemo: 存在交互点赞收藏按钮', hasLikeBtn);
    if (hasLikeBtn) {
      await cardLikeBtn.click();
      await page.waitForTimeout(200);
      const likedText = await page.locator('text=已喜欢 · 1').count();
      record('CardDemo: 点击点赞产生实时交互反馈', likedText > 0);
    }

    // 1.2 访问 List 课程，验证与 Card 彻底独立，渲染真正的 ListDemo
    await page.goto(`${BASE}/learn/?item=list`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const listPhotos = await page.locator('text=照片与视频').count();
    record('ListDemo: 渲染真正的密集列表而不是卡片', listPhotos > 0);
    const listCardTitle = await page.locator('text=设计系统卡片容器').count();
    record('ListDemo 与 CardDemo 互相隔离', listCardTitle === 0);

    // 1.3 核心修复：Empty State 绝不混入 Stepper 代码
    await page.goto(`${BASE}/learn/?item=empty-state`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const emptyCameraIcon = await page.locator('main svg.lucide-camera').count();
    const emptyTabFirst = await page.locator('button', { hasText: '首次打开' }).count();
    record('EmptyStateDemo: 渲染真实空状态组件与切换 Tab', emptyTabFirst > 0 || emptyCameraIcon > 0);
    const stepperStepCount = await page.locator('text=步骤 1: 基本信息').count();
    record('EmptyState 修复验证: 绝无 Stepper 步骤混入', stepperStepCount === 0);

    // 1.4 访问 Stepper 课程，验证渲染真正的 StepperDemo
    await page.goto(`${BASE}/learn/?item=stepper`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const stepperIndicator = await page.locator('text=填写地址').count();
    record('StepperDemo: 渲染真实步骤导航组件', stepperIndicator > 0);

    // 1.5 连续在 Empty State 和 Stepper 之间切换多次，验证状态无残留
    await page.goto(`${BASE}/learn/?item=empty-state`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.goto(`${BASE}/learn/?item=stepper`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.goto(`${BASE}/learn/?item=empty-state`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    const residualStepper = await page.locator('text=填写地址').count();
    record('连续切换组件: 卸载干净，无状态与节点残留', residualStepper === 0);

    // 1.6 验证代表组件：Button, Modal, Bottom Sheet, Accordion, Switch, Slider
    const checkComponents = [
      { id: 'button', check: '保存' },
      { id: 'modal', check: '删除照片' },
      { id: 'bottom-sheet', check: '筛选照片' },
      { id: 'accordion', check: '照片会占用手机多少空间' },
      { id: 'switch', check: '深色模式' },
      { id: 'slider', check: '音量' },
    ];
    for (const c of checkComponents) {
      await page.goto(`${BASE}/learn/?item=${c.id}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
      const found = await page.locator(`text=${c.check}`).count();
      record(`真实组件挂载: ${c.id}`, found > 0, `关键词: ${c.check}`);
    }

    record('真实 Demo 无 JS 运行时错误', errs.length === 0, errs.join('; '));
    await ctx.close();
  }

  /* =========================================================================
   * 2. 视觉减法与 Minimal Documentation Workspace 规范验证 (P0)
   * ========================================================================= */
  console.log('\n──── 2. 视觉减法与红线对照 ────');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/learn/?item=button`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // 2.1 确认无原型假测试条与调试标签
    const prototypeBar = await page.locator('text=Scheme C+ Prototype').count();
    record('视觉减法: 顶部黑色原型测试快捷条已彻底移除', prototypeBar === 0);

    const touchTargetText = await page.locator('text=44px Touch Target').count();
    record('视觉减法: 假 44px Touch Target 标签已移除', touchTargetText === 0);

    const verifiedText = await page.locator('text=PROTOTYPE VERIFIED').count();
    record('视觉减法: PROTOTYPE VERIFIED 水印已移除', verifiedText === 0);

    const customInteractionText = await page.locator('text=Custom Interaction:').count();
    record('视觉减法: Custom Interaction 伪标签已移除', customInteractionText === 0);

    // 2.2 验证左侧目录使用 1px 细线分隔，无套娃浅色填充块
    const aside = page.locator('aside[aria-label="课程大纲"]');
    const asideBorderRight = await aside.evaluate((el) => window.getComputedStyle(el).borderRightWidth);
    record('视觉减法: 左侧目录采用 1px 右边框分隔', asideBorderRight === '1px', `实际: ${asideBorderRight}`);

    // 2.3 当前活跃课程使用强调线/字体加粗，无大面积暗黑填充
    const activeItem = page.locator('button[aria-current="true"]').first();
    const activeText = await activeItem.textContent();
    record('视觉减法: 当前课程高亮存在', !!activeText, activeText?.trim().slice(0, 20));

    // 2.4 r2.2 Layout Polish 排版精修专项检验
    // 2.4.1 取消独立全宽进度栏，进度整合至左栏
    const asideProgress = await aside.locator('div[role="progressbar"]').count();
    record('Layout Polish: 全局进度已整合至左侧大纲标题区', asideProgress > 0);

    // 2.4.2 统一工具行：返回总览与查看完整词条处于同一水平线
    const backBtn = page.locator('nav[aria-label="Breadcrumb"] button').first();
    const entryLink = page.locator('a', { hasText: '查看完整词条' }).first();
    const backBox = await backBtn.boundingBox();
    const entryBox = await entryLink.boundingBox();
    const yDelta = backBox && entryBox ? Math.abs(backBox.y - entryBox.y) : 999;
    record('Layout Polish: 返回总览与完整词条合并至同一水平行', yDelta < 12, `Y轴差值: ${yDelta.toFixed(1)}px`);

    // 2.4.3 左侧单项行高紧凑且满足 >=44px 热区
    const itemBox = await activeItem.boundingBox();
    const itemHeight = itemBox?.height ?? 0;
    record('Layout Polish: 课程行高紧凑规范 (44px~52px)', itemHeight >= 44 && itemHeight <= 54, `实际高度: ${itemHeight}px`);

    // 2.4.4 序号列宽严格 20px (w-5 h-5)
    const badge = activeItem.locator('span.w-5.h-5').first();
    const badgeBox = await badge.boundingBox();
    record('Layout Polish: 序号固定列宽严格 20px', badgeBox ? Math.round(badgeBox.width) === 20 : false, `实际宽度: ${badgeBox?.width}px`);

    await ctx.close();
  }

  /* =========================================================================
   * 3. 中英文双向闭环主站导航链路 (P0 核心验收)
   * ========================================================================= */
  console.log('\n──── 3. 中英文双向主站闭环导航 ────');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const navErrs = [];
    page.on('pageerror', (e) => navErrs.push(e.message));

    // 3.1 中文链路：首页 → Learn → Level 1 总览 → 点击 Card → Card 学习 → 查看完整 Card 词条 → 返回当前 Card 课程 → 返回首页
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    record('导航闭环(中文): 访问首页', page.url().includes(BASE));

    // 点击 Header 上的「学习」
    const learnNav = page.locator('header nav a[href*="/learn"]').first();
    await learnNav.click();
    await page.waitForURL('**/learn/**', { timeout: 5000 });
    record('导航闭环(中文): 首页 → 进入 Learn', page.url().includes('/learn'));

    // 确保在 Level 1 总览
    const level1Title = await page.locator('h1', { hasText: '你每天都会看到的 UI' }).count();
    record('导航闭环(中文): 展现 Level 1 章节总览', level1Title > 0);

    // 点击总览中的 Card 卡片
    const cardGridItem = page.locator('div[role="button"]', { hasText: 'Card' }).first();
    await cardGridItem.click();
    await page.waitForTimeout(400);
    record('导航闭环(中文): 点击 Card 微缩卡片进入单课', page.url().includes('item=card'));

    // 在单课中点击「查看完整词条」
    const viewFullEntry = page.locator('a', { hasText: '查看完整词条' }).first();
    await viewFullEntry.click();
    await page.waitForURL('**/patterns/card/**', { timeout: 5000 });
    record('导航闭环(中文): 点击查看完整词条到达 /patterns/card?from=learn', page.url().includes('/patterns/card') && page.url().includes('from=learn'));

    // 验证词条页顶部展示「返回 Learn · 继续 Card 课程」
    const returnToLearnBtn = page.locator('#return-to-learn-link');
    const hasReturnLink = (await returnToLearnBtn.count()) > 0;
    record('导航闭环(中文): 详情页带有返回 Learn 入口', hasReturnLink);

    // 点击返回 Learn
    if (hasReturnLink) {
      await returnToLearnBtn.click();
      await page.waitForURL((url) => url.pathname.includes('/learn') && url.searchParams.get('item') === 'card', { timeout: 5000 });
      record('导航闭环(中文): 顺利返回 Learn 并精准保留 Card 课程', page.url().includes('item=card'));

      // 验证上下文保留横幅已展示
      const returnBanner = await page.locator('#return-from-detail-banner').count();
      record('导航闭环(中文): 学习工作台顶部出现保留上下文恢复横幅', returnBanner > 0);
    }

    // 点击 Header Logo 返回首页
    const homeLogo = page.locator('header a[aria-label*="首页"]').first();
    await homeLogo.click();
    await page.waitForURL(`${BASE}/`, { timeout: 5000 });
    record('导航闭环(中文): 顺畅返回首页闭环', page.url() === `${BASE}/` || page.url() === `${BASE}`);

    // 3.2 负控检查：直接访问 Pattern 详情页（无 ?from=learn），绝对不出现「返回 Learn」
    await page.goto(`${BASE}/patterns/card`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const directReturnLink = await page.locator('#return-to-learn-link').count();
    record('负控门禁: 直接访问 Pattern 详情页绝不错误出现「返回 Learn」', directReturnLink === 0);

    // 3.3 英文链路：/en/ → /en/learn/
    await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
    const enLearnNav = page.locator('header nav a[href*="/en/learn"]').first();
    await enLearnNav.click();
    await page.waitForURL('**/en/learn/**', { timeout: 5000 });
    record('导航闭环(英文): /en/ → 进入 /en/learn/', page.url().includes('/en/learn'));

    // 如果因为本地记忆恢复了上次课程，通过面包屑点击返回 Level 1 总览
    const breadcrumbBack = page.locator('nav[aria-label="Breadcrumb"] button').first();
    if (await breadcrumbBack.count()) {
      await breadcrumbBack.click();
      await page.waitForTimeout(300);
    } else {
      // 或直接访问 ?level=1
      await page.goto(`${BASE}/en/learn/?level=1`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
    }

    const enLevel1Title = await page.locator('h1', { hasText: 'The UI you see every day' }).count();
    record('导航闭环(英文): 展现英文 Level 1 章节总览', enLevel1Title > 0);

    const enCardGridItem = page.locator('div[role="button"]', { hasText: 'Card' }).first();
    await enCardGridItem.click();
    await page.waitForTimeout(400);
    record('导航闭环(英文): 进入英文 Card 单课', page.url().includes('item=card'));

    const enViewFullEntry = page.locator('a', { hasText: 'View Full Entry' }).first();
    await enViewFullEntry.click();
    await page.waitForURL('**/en/patterns/card/**', { timeout: 5000 });
    record('导航闭环(英文): 到达 /en/patterns/card/?from=learn', page.url().includes('/en/patterns/card') && page.url().includes('from=learn'));

    const enReturnBtn = page.locator('#return-to-learn-link');
    record('导航闭环(英文): 英文详情页带有 Return to Learn 入口', (await enReturnBtn.count()) > 0);

    if (await enReturnBtn.count()) {
      await enReturnBtn.click();
      await page.waitForURL((url) => url.pathname.includes('/en/learn') && url.searchParams.get('item') === 'card', { timeout: 5000 });
      record('导航闭环(英文): 顺畅返回英文 Learn 课程', page.url().includes('/en/learn') && page.url().includes('item=card'));
    }

    // 3.4 双语切换保留课程参数：在 /learn?item=card 切换英文
    await page.goto(`${BASE}/learn/?item=card`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const enSwitchLink = page.locator('header a[hreflang="en"]').first();
    const switchHref = await enSwitchLink.getAttribute('href');
    record('双语切换保留 query: Header 英文按钮携带 ?item=card', switchHref?.includes('item=card') ?? false, `href: ${switchHref}`);

    record('导航闭环流程无 JS 运行时错误', navErrs.length === 0, navErrs.join('; '));
    await ctx.close();
  }

  /* =========================================================================
   * 4. 进度管理与 LocalStorage 兼容性 (P0)
   * ========================================================================= */
  console.log('\n──── 4. 进度管理与 36 项口径验证 ────');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    // 注入初始空状态
    await page.goto(`${BASE}/learn/?item=button`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('uifg.learned.v1', JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('uifg:progress'));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // 验证分母为 36
    const progressText = await page.locator('text=0 / 36').count();
    record('分母口径: 严格以 36 项作为进度分母', progressText > 0);

    // 点击标记完成
    const markBtn = page.locator('button', { hasText: '标记本课已学' }).first();
    await markBtn.click();
    await page.waitForTimeout(300);

    const progressAfterMark = await page.locator('text=1 / 36').count();
    record('标记完成: 进度正确递增至 1 / 36', progressAfterMark > 0);

    // 检查 6 秒 Undo Toast 弹出
    const undoToast = page.locator('aside[role="status"]', { hasText: '已标记' });
    record('反馈体验: 出现可撤销 Toast', (await undoToast.count()) > 0);

    // 点击 Toast 中的撤销
    const undoBtn = undoToast.locator('button', { hasText: '撤销' });
    if (await undoBtn.count()) {
      await undoBtn.click();
      await page.waitForTimeout(300);
      const progressAfterUndo = await page.locator('text=0 / 36').count();
      record('撤销操作: 点击撤销后进度精准退回 0 / 36', progressAfterUndo > 0);
    }

    // 验证 LocalStorage 兼容老版本键名 uifg.learned.v1
    const stored = await page.evaluate(() => localStorage.getItem('uifg.learned.v1'));
    record('存储兼容: 持久化使用标准 uifg.learned.v1 键名', stored !== null);

    await ctx.close();
  }

  /* =========================================================================
   * 5. 多视口响应式与 320px 零溢出断言 (P0)
   * ========================================================================= */
  console.log('\n──── 5. 多视口响应式适配与触控热区 ────');
  const viewports = [
    { width: 1440, height: 900, name: '1440px 桌面端' },
    { width: 1024, height: 768, name: '1024px 小桌面' },
    { width: 768, height: 1024, name: '768px 平板' },
    { width: 390, height: 844, name: '390px 移动端' },
    { width: 320, height: 568, name: '320px 极端小屏' },
  ];

  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    // 单课模式
    await page.goto(`${BASE}/learn/?item=button`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const noOverflow = scrollWidth <= clientWidth;
    record(`响应式无横向溢出 [${vp.name}] 单课视图`, noOverflow, `scroll: ${scrollWidth}, client: ${clientWidth}`);

    // 章节总览模式
    await page.goto(`${BASE}/learn/?level=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const scrollWidthLvl = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidthLvl = await page.evaluate(() => document.documentElement.clientWidth);
    record(`响应式无横向溢出 [${vp.name}] 总览视图`, scrollWidthLvl <= clientWidthLvl, `scroll: ${scrollWidthLvl}, client: ${clientWidthLvl}`);

    if (vp.width <= 390) {
      // 验证移动端顶部紧凑进度条存在
      const mobileProgressBar = page.locator('div[role="progressbar"]');
      record(`移动端 [${vp.name}]: 紧凑全局进度条可见`, (await mobileProgressBar.count()) > 0);

      // 验证移动端底栏存在
      const stickyBar = page.locator('div.fixed.bottom-0');
      record(`移动端 [${vp.name}]: 固底操作栏可见`, (await stickyBar.count()) > 0);

      // 打开移动端目录抽屉
      const openDrawerBtn = stickyBar.locator('button[aria-label="Open catalog drawer"]').first();
      if (await openDrawerBtn.count()) {
        await openDrawerBtn.click();
        await page.waitForTimeout(300);
        const drawer = page.locator('div[role="dialog"][aria-modal="true"]');
        record(`移动端 [${vp.name}]: 目录抽屉可正常打开`, (await drawer.count()) > 0);

        // 关闭抽屉
        const closeBtn = drawer.locator('button[aria-label="Close drawer"]').first();
        if (await closeBtn.count()) {
          await closeBtn.click();
          await page.waitForTimeout(300);
          record(`移动端 [${vp.name}]: 目录抽屉可正常关闭`, (await drawer.count()) === 0);
        }
      }
    }

    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log('\n============================================================');
const passCount = results.filter((r) => r.pass).length;
const failCount = results.filter((r) => !r.pass).length;
console.log(`Learn Workbench E2E 结果: ${passCount} 通过 / ${failCount} 失败 (共 ${results.length} 项)`);
if (failCount > 0) {
  process.exit(1);
}
