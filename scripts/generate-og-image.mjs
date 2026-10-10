import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'public');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const targetFile = join(outDir, 'og-image.png');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background-color: #FAF9F6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", sans-serif;
      color: #1A1917;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 72px 80px;
      position: relative;
      overflow: hidden;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E6E3DB;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #4A4740;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2C7355;
    }
    .title {
      font-size: 58px;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: #1A1917;
      margin-top: 24px;
    }
    .brand {
      color: #6E6A61;
      font-weight: 500;
    }
    .subtitle {
      font-size: 26px;
      line-height: 1.5;
      color: #4A4740;
      margin-top: 18px;
      max-width: 820px;
    }
    .metrics {
      display: flex;
      gap: 20px;
      margin-top: 36px;
    }
    .metric-card {
      background: #FFFFFF;
      border: 1px solid #E6E3DB;
      border-radius: 12px;
      padding: 14px 22px;
      display: flex;
      align-items: baseline;
      gap: 10px;
    }
    .metric-val {
      font-size: 24px;
      font-weight: 700;
      color: #1A1917;
      font-family: ui-monospace, Menlo, monospace;
    }
    .metric-lbl {
      font-size: 14px;
      color: #6E6A61;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #E6E3DB;
      padding-top: 24px;
      font-size: 16px;
      color: #6E6A61;
      font-family: ui-monospace, Menlo, monospace;
    }
  </style>
</head>
<body>
  <div>
    <div class="badge">
      <span class="badge-dot"></span>
      <span>LutiveLab Suite</span>
    </div>
    <h1 class="title">UI Field Guide <span class="brand">· LutiveLab</span></h1>
    <p class="subtitle">AI 独立开发者的 UI / UX 可视化词典。看示例、学名字、理解场景，然后直接告诉 AI。</p>
    
    <div class="metrics">
      <div class="metric-card">
        <span class="metric-val">63</span>
        <span class="metric-lbl">Interactive Patterns</span>
      </div>
      <div class="metric-card">
        <span class="metric-val">8</span>
        <span class="metric-lbl">Decision Comparisons</span>
      </div>
      <div class="metric-card">
        <span class="metric-val">3-Level</span>
        <span class="metric-lbl">AI Prompts</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>ui.lutivelab.com</span>
    <span>A LutiveLab Product</span>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: targetFile, type: 'png' });
await browser.close();
console.log('✓ Generated OG image at:', targetFile);
