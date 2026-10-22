import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3111';
const viewports = [
  { width: 1440, height: 900, name: '1440px 桌面宽屏' },
  { width: 1024, height: 768, name: '1024px 小桌面' },
  { width: 768, height: 1024, name: '768px 平板' },
  { width: 390, height: 844, name: '390px 移动端' },
  { width: 320, height: 568, name: '320px 极端小屏' },
];

const browser = await chromium.launch();
const report = [];

try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    // 访问单课
    await page.goto(`${BASE}/learn/?item=button`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const measurements = await page.evaluate((vpWidth) => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const overflow = scrollWidth - clientWidth;

      // 桌面端元素测量
      let sidebarBox = null;
      let sidebarTitleBox = null;
      let sidebarRowBox = null;
      let badgeBox = null;
      const aside = document.querySelector('aside[aria-label="课程大纲"]');
      if (aside && window.getComputedStyle(aside).display !== 'none') {
        sidebarBox = aside.getBoundingClientRect();
        const sTitle = aside.querySelector('h2');
        if (sTitle) sidebarTitleBox = sTitle.getBoundingClientRect();
        const sRow = aside.querySelector('button[aria-current="true"]');
        if (sRow) {
          sidebarRowBox = sRow.getBoundingClientRect();
          const badge = sRow.querySelector('span');
          if (badge) badgeBox = badge.getBoundingClientRect();
        }
      }

      // 顶部工具行测量
      const backBtn = document.querySelector('nav[aria-label="Breadcrumb"] button');
      const entryLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('查看完整词条'));
      let backBox = backBtn ? backBtn.getBoundingClientRect() : null;
      let entryBox = entryLink ? entryLink.getBoundingClientRect() : null;

      // 标题与 Demo 测量
      const h1 = document.querySelector('h1');
      const h1Box = h1 ? h1.getBoundingClientRect() : null;
      const demoSection = document.querySelector('section');
      const demoBox = demoSection ? demoSection.getBoundingClientRect() : null;

      // 移动端元素测量
      let mobileProgressBox = null;
      const mobileProg = document.querySelector('div.md\\:hidden div[role="progressbar"]');
      if (mobileProg) mobileProgressBox = mobileProg.getBoundingClientRect();

      return {
        vpWidth,
        scrollWidth,
        clientWidth,
        overflow,
        sidebarWidth: sidebarBox ? Math.round(sidebarBox.width) : 0,
        sidebarTop: sidebarTitleBox ? Math.round(sidebarTitleBox.top) : 0,
        sidebarRowHeight: sidebarRowBox ? Math.round(sidebarRowBox.height) : 0,
        badgeWidth: badgeBox ? Math.round(badgeBox.width) : 0,
        backBtnTop: backBox ? Math.round(backBox.top) : 0,
        entryLinkTop: entryBox ? Math.round(entryBox.top) : 0,
        toolRowYDelta: backBox && entryBox ? Math.abs(Math.round(backBox.top) - Math.round(entryBox.top)) : 0,
        h1Top: h1Box ? Math.round(h1Box.top) : 0,
        demoTop: demoBox ? Math.round(demoBox.top) : 0,
        hasMobileProgress: !!mobileProg,
      };
    }, vp.width);

    report.push({ name: vp.name, ...measurements });
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(report, null, 2));
