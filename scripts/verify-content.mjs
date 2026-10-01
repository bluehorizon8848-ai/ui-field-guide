/**
 * 内容完整性校验。跑法：npm run verify
 *
 * 校验四类问题：
 *  1. 交叉引用失效（similarPatterns / comparisons / learning / 口语映射 / demoIds）
 *  2. UIPattern 必填字段为空或过短
 *  3. Comparison 的 cells 长度与 columns 不一致
 *  4. demoIds 与 demoRegistry 不一致
 *
 * 这些问题 TypeScript 抓不到（都是 string），但会直接变成 404 死链或空白区块。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const P = (...s) => join(ROOT, ...s);

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

/* ---------- 读取源文件 ---------- */

const patternDir = P('src/data/patterns');
const patternFiles = readdirSync(patternDir).filter(
  (f) => f.endsWith('.ts') && f !== 'index.ts'
);

const sources = new Map();
for (const f of patternFiles) {
  sources.set(f, readFileSync(join(patternDir, f), 'utf8'));
}

const comparisonsSrc = readFileSync(P('src/data/comparisons.ts'), 'utf8');
const learningSrc = readFileSync(P('src/data/learning.ts'), 'utf8');
const searchSrc = readFileSync(P('src/data/search.ts'), 'utf8');
const demoIdsSrc = readFileSync(P('src/data/demoIds.ts'), 'utf8');
const registrySrc = readFileSync(P('src/components/demo/registry.ts'), 'utf8');

/* ---------- 1. 收集 id ---------- */

const ids = new Set();
for (const src of sources.values()) {
  for (const m of src.matchAll(/^\s{4}id: '([^']+)'/gm)) ids.add(m[1]);
}

const comparisonSlugs = new Set(
  [...comparisonsSrc.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1])
);

const demoIds = new Set(
  [...demoIdsSrc.matchAll(/^ {2}'([^']+)',/gm)].map((m) => m[1])
);

const registryIds = new Set(
  [...registrySrc.matchAll(/^ {2}'?([a-z0-9-]+)'?: [A-Z]/gm)].map((m) => m[1])
);

console.log(`Pattern: ${ids.size} 个`);
console.log(`Comparison: ${comparisonSlugs.size} 组`);
console.log(`Demo: ${demoIds.size} 个\n`);

/* ---------- 2. 交叉引用 ---------- */

const checkRef = (from, field, value, valid) => {
  if (!valid.has(value)) fail(`${from}.${field} 引用了不存在的 id: "${value}"`);
};

for (const [file, src] of sources) {
  for (const m of src.matchAll(/similarPatterns: \[([^\]]*)\]/g)) {
    for (const v of m[1].matchAll(/'([^']+)'/g))
      checkRef(file, 'similarPatterns', v[1], ids);
  }
  for (const m of src.matchAll(/compareWith: '([^']+)'/g))
    checkRef(file, 'compareWith', m[1], ids);
}

// learning.ts 里有两个数组：patternIds（词条 id）和 contrastCards（对比 slug）。
// 只校验 patternIds，别把 contrastCards 的 slug 当成词条 id。
const learnBlock = learningSrc.slice(
  learningSrc.indexOf('patternIds'),
  learningSrc.indexOf('export const contrastCards') > 0
    ? learningSrc.indexOf('export const contrastCards')
    : learningSrc.length
);
for (const m of learnBlock.matchAll(/'([a-z0-9-]+)'/g))
  checkRef('learning.ts', 'patternIds', m[1], ids);

const contrastBlock =
  learningSrc.indexOf('export const contrastCards') >= 0
    ? learningSrc.slice(learningSrc.indexOf('export const contrastCards'))
    : '';
for (const m of contrastBlock.matchAll(/slug: '([^']+)'/g))
  checkRef('learning.ts', 'contrastCards', m[1], comparisonSlugs);

for (const m of comparisonsSrc.matchAll(/patterns: \[([^\]]*)\]/g))
  for (const v of m[1].matchAll(/'([^']+)'/g))
    checkRef('comparisons.ts', 'patterns', v[1], ids);
for (const m of comparisonsSrc.matchAll(/relatedComparisons: \[([^\]]*)\]/g))
  for (const v of m[1].matchAll(/'([^']+)'/g))
    checkRef('comparisons.ts', 'relatedComparisons', v[1], comparisonSlugs);
for (const m of comparisonsSrc.matchAll(/pattern: '([^']+)'/g))
  checkRef('comparisons.ts', 'rows.pattern', m[1], ids);

/**
 * 口语映射表校验。
 *
 * 用「从声明处开始做花括号配对」来切块，不能用 indexOf 找下一个声明——
 * search.ts 里两张映射表之间还夹着 STOPWORDS 和 colloquialScore，
 * 按位置切片会把停用词数组当成映射表，把 'the'/'and' 当成不存在的 pattern id 报一堆假错。
 */
function extractObjectBlock(src, decl) {
  const start = src.indexOf(decl);
  if (start < 0) return '';
  const open = src.indexOf('{', start);
  if (open < 0) return '';
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  return '';
}

for (const [decl, label] of [
  ['const colloquialMap', 'colloquialMap'],
  ['const colloquialEn', 'colloquialEn'],
]) {
  const block = extractObjectBlock(searchSrc, decl);
  if (!block) {
    fail(`search.ts 里找不到 ${decl}`);
    continue;
  }
  for (const m of block.matchAll(/\[([^\]]+)\]/g))
    for (const v of m[1].matchAll(/'([^']+)'/g)) checkRef(label, '-', v[1], ids);
}

for (const id of demoIds) checkRef('demoIds', '-', id, ids);
for (const id of registryIds) checkRef('registry', '-', id, ids);

/* ---------- 3. demoIds ↔ registry 一致性 ---------- */

for (const id of demoIds) if (!registryIds.has(id)) fail(`demoIds 有 "${id}" 但 registry 没有`);
for (const id of registryIds) if (!demoIds.has(id)) fail(`registry 有 "${id}" 但 demoIds 没有`);

/* ---------- 4. Pattern 必填字段 ---------- */

const REQUIRED_SHORT = [
  ['oneLine', 8],
  ['description', 40],
  ['looksLike', 15],
  ['fitsFor', 4],
];

for (const [file, src] of sources) {
  for (const block of src.split(/\n  \{\n/).slice(1)) {
    const id = block.match(/id: '([^']+)'/)?.[1];
    if (!id) continue;

    for (const [field, min] of REQUIRED_SHORT) {
      const m = block.match(new RegExp(`${field}:\\s*\\n?\\s*'([^']*)'`));
      if (!m) {
        fail(`${file}:${id} 缺少 ${field}`);
      } else if (m[1].length < min) {
        fail(`${file}:${id} 的 ${field} 太短（${m[1].length} < ${min}）`);
      }
    }

    for (const field of ['aliases', 'tags', 'platforms', 'position', 'job', 'appearance']) {
      const m = block.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
      if (!m) fail(`${file}:${id} 缺少 ${field}`);
      else if (!m[1].trim()) fail(`${file}:${id} 的 ${field} 是空数组`);
    }

    for (const field of ['badPrompt', 'betterPrompt']) {
      const m = block.match(new RegExp(`${field}:\\s*\\n?\\s*'([^']*)'`));
      if (!m || !m[1].trim()) fail(`${file}:${id} 的 ${field} 为空`);
    }

    if (!/basic:\s*\n?\s*'[^']+/.test(block)) fail(`${file}:${id} 缺少 aiPrompt.basic`);
    if (!/detailed:\s*\n?\s*'[^']+/.test(block)) fail(`${file}:${id} 缺少 aiPrompt.detailed`);
    if (!/implementation:\s*\n?\s*'[^']+/.test(block))
      fail(`${file}:${id} 缺少 aiPrompt.implementation`);

    if (!/whenToUse:\s*\[/.test(block)) fail(`${file}:${id} 缺少 whenToUse`);
    if (!/whenNotToUse:\s*\[/.test(block)) fail(`${file}:${id} 缺少 whenNotToUse`);
    if (!/anatomy:\s*\[/.test(block)) fail(`${file}:${id} 缺少 anatomy`);
  }
}

/* ---------- 5. Comparison 结构 ---------- */

for (const block of comparisonsSrc.split(/\n  \{\n/).slice(1)) {
  const slug = block.match(/slug: '([^']+)'/)?.[1];
  if (!slug) continue;

  const colCount = block.match(/columns: \[([\s\S]*?)\]/)?.[1]?.match(/key:/g)?.length ?? 0;

  const rowsBlock = block.match(/rows: \[([\s\S]*?)\n    \],/)?.[1] ?? '';
  const rowMatches = [...rowsBlock.matchAll(/cells: \[([\s\S]*?)\]/g)];
  rowMatches.forEach((m, i) => {
    const len = m[1].match(/'/g)?.length / 2 ?? 0;
    const booleans = [...m[1].matchAll(/\b(true|false)\b/g)].length;
    const total = len + booleans;
    if (colCount && total !== colCount) {
      fail(`comparisons:${slug} 第 ${i + 1} 行 cells 有 ${total} 个值，columns 有 ${colCount} 个`);
    }
  });

  if (!/takeaway:/.test(block)) fail(`comparisons:${slug} 缺少 takeaway`);
  if (!/decision: \[/.test(block)) fail(`comparisons:${slug} 缺少 decision`);
}

/* ---------- 6. MiniPreview 覆盖 ---------- */

const miniSrc = existsSync(P('src/components/patterns/MiniPreview.tsx'))
  ? readFileSync(P('src/components/patterns/MiniPreview.tsx'), 'utf8')
  : '';
const previewIds = new Set(
  [...miniSrc.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\(/gm)].map((m) => m[1])
);
const missingPreview = [...ids].filter((id) => !previewIds.has(id));
if (missingPreview.length) {
  warn(
    `MiniPreview 缺少 ${missingPreview.length} 个示意图: ${missingPreview.slice(0, 12).join(', ')}${missingPreview.length > 12 ? ' …' : ''}`
  );
}

/* ---------- 输出 ---------- */

if (warnings.length) {
  console.log('⚠ 警告');
  warnings.forEach((w) => console.log(`  ${w}`));
  console.log('');
}

if (errors.length) {
  console.log(`✗ ${errors.length} 个错误\n`);
  errors.forEach((e) => console.log(`  ${e}`));
  process.exit(1);
}

console.log('✓ 内容完整性校验通过');
