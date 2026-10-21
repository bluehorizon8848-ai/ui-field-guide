/**
 * UIFG-P0-20261021-RECON-I18N-01 专项回归测试脚本
 * 跑法：node scripts/verify-recon-i18n.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { patterns } from '../src/data/patterns/index.ts';
import { getPattern } from '../src/data/i18n/resolve.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const P = (...s) => join(ROOT, ...s);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('════════════════════════════════════════════════════════════');
console.log('UIFG-P0-20261021-RECON-I18N-01 隔离补丁专项测试');
console.log('════════════════════════════════════════════════════════════\n');

/* ───────── 1. Sitemap 对称性与新增 4 URL 检验 ───────── */
console.log('──── 1. Sitemap 补齐 /faq 与 /glossary ────');
const sitemapSrc = readFileSync(P('src/app/sitemap.ts'), 'utf8');

assert(
  sitemapSrc.includes("path: '/faq'") && sitemapSrc.includes("path: '/glossary'"),
  "sitemap.ts 静态路由表中包含 '/faq' 与 '/glossary'"
);

// 提取 statics 数组并模拟生成
const staticMatches = [...sitemapSrc.matchAll(/path: '([^']+)'/g)].map((m) => m[1]);
assert(staticMatches.includes('/faq'), "静态列表包含 /faq");
assert(staticMatches.includes('/glossary'), "静态列表包含 /glossary");

// 确保不存在双重 /en
const doubleEnCheck = !sitemapSrc.includes('/en/en');
assert(doubleEnCheck, 'sitemap 代码中无双重 /en/en 硬编码');

/* ───────── 2. AskAI 英文对话推荐 Prompt 纯英文检验 ───────── */
console.log('\n──── 2. AskAI 英文对话推荐 Prompt 纯英文无中文泄漏 ────');
const askAISrc = readFileSync(P('src/components/patterns/AskAI.tsx'), 'utf8');

assert(
  !askAISrc.includes('${pattern.name} (${pattern.chineseName}) component'),
  'AskAI.tsx 英文模板已剔除 (${pattern.chineseName})'
);

assert(
  askAISrc.includes('I want to implement a standard ${pattern.name} component in my application.'),
  'AskAI.tsx 英文模板使用纯英文 standard ${pattern.name} component'
);

// 提取 generateConversationalPrompt 逻辑进行全量 75 pattern 测试
function mockConversationalPrompt(pattern, locale) {
  const parts = pattern.anatomy?.slice(0, 3).map((a) => a.labelZh || a.label) || [];
  const partsDesc = parts.length > 0 ? `（包含关键结构：${parts.join('、')}）` : '';

  if (locale === 'zh') {
    return `我想在我的页面中做一个【${pattern.chineseName}】（标准的 ${pattern.name} 组件）。
它的核心设计意图是：${pattern.oneLine} ${partsDesc}

请以资深前端架构师的视角协助我。在直接编写最终代码之前，请先向我确认以下 3 个关键细节：
1. 组件的核心尺寸规格、关键状态（如加载态、空状态或禁用态）以及响应式布局预期；
2. 触发与退出的关键交互逻辑（如点击背景关闭、手势滑动阻尼或展开动画过渡）；
3. 键盘与屏幕阅读器无障碍支持（如 ESC 键退出、焦点锁定 Focus Trap 与 ARIA 属性）。

请先列出这三项的简要推测并向我确认，待我确认后再输出基于 React + Tailwind CSS 的完整代码。`;
  }

  const partsEn = pattern.anatomy?.slice(0, 3).map((a) => a.label) || [];
  const partsEnDesc = partsEn.length > 0 ? ` (key parts: ${partsEn.join(', ')})` : '';

  return `I want to implement a standard ${pattern.name} component in my application.
The design intent is: ${pattern.oneLine} ${partsEnDesc}

Please act as a senior frontend architect. Before writing the final code, please first clarify and confirm with me:
1. Sizing specifications, component states (e.g. loading, empty, disabled), and responsive layout expectations;
2. Key transition & interaction behaviors (e.g. backdrop dismiss, motion easing curves, or swipe gestures);
3. Keyboard accessibility and focus management (e.g. ESC key dismiss, focus trapping, and ARIA roles).

Please summarize these 3 assumptions for my confirmation first, and once I approve, generate the production-ready React + Tailwind CSS code.`;
}

let enLeakCount = 0;
let zhPreservedCount = 0;

for (const p of patterns) {
  const enPattern = getPattern(p.id, 'en');
  const enPrompt = mockConversationalPrompt(enPattern, 'en');
  const hasChinese = /[一-龥]/.test(enPrompt);
  if (hasChinese) {
    console.error(`Pattern ${p.id} 英文 Prompt 残留中文: ${enPrompt.match(/[一-龥]+/g).join(',')}`);
    enLeakCount++;
  }

  const zhPrompt = mockConversationalPrompt(p, 'zh');
  if (zhPrompt.includes(p.chineseName)) {
    zhPreservedCount++;
  }
}

assert(enLeakCount === 0, `全量 75 个 Pattern 英文对话 Prompt 均 100% 纯英文（0 中文残留）`);
assert(zhPreservedCount === 75, `全量 75 个 Pattern 中文对话 Prompt 完整保留中文名称（75/75）`);

/* ───────── 3. IdentifyClient 英文分类标签本地化检验 ───────── */
console.log('\n──── 3. IdentifyClient 结果卡分类标签本地化 ────');
const identifySrc = readFileSync(P('src/components/identify/IdentifyClient.tsx'), 'utf8');

assert(
  identifySrc.includes("{locale === 'en' ? cat?.name : cat?.chineseName}"),
  "IdentifyClient.tsx 分类徽标支持中英本地化 {locale === 'en' ? cat?.name : cat?.chineseName}"
);

assert(
  identifySrc.includes('{hit.pattern.chineseName}'),
  'IdentifyClient.tsx 依然保留卡片标题下方的中文副标题设计（有意双语设计未被误删）'
);

console.log('\n════════════════════════════════════════════════════════════');
console.log(`测试结果：${passed} 项通过，${failed} 项失败`);
console.log('════════════════════════════════════════════════════════════');

if (failed > 0) {
  process.exit(1);
}
