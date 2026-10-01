/**
 * 国际化完整性校验。跑法：npm run verify（由 verify-content.mjs 调起，或单独跑）
 *
 * 中文内容是「真相」，英文是 overlay。TypeScript 只能保证类型对，保证不了：
 *  - 词条漏翻（overlay 缺 key）
 *  - 数组长度错位（英文 whenToUse 比中文多一行，表格就串位）
 *  - recommended 布尔值错位（英文把「不推荐」翻成「推荐」，语义反了但类型对）
 *  - 英文文案里残留中文（翻译漏了）
 *  - 译文太短（占位符式的空翻译）
 *
 * 这些全是静默失败，必须脚本兜。
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const P = (...s) => join(ROOT, ...s);

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/**
 * 数一段文本里有几个「字符串字面量」。
 * 不能直接数 ' —— 英文缩写（don't → don\'t）里的转义撇号会被算成引号。
 * 正确做法：只统计未被反斜杠转义的单引号，成对后除以 2。
 */
function countStrings(text) {
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "'" && (i === 0 || text[i - 1] !== '\\')) n++;
  }
  return Math.floor(n / 2);
}

/* ---------- 载入中文真相 ---------- */

const patternDir = P('src/data/patterns');
const patternFiles = readdirSync(patternDir).filter(
  (f) => f.endsWith('.ts') && f !== 'index.ts'
);

/** 从中文源文件里抽出每个词条的原始文本字段 */
const zhPatterns = new Map();
for (const f of patternFiles) {
  const src = readFileSync(join(patternDir, f), 'utf8');
  for (const block of src.split(/\n  \{\n/).slice(1)) {
    const id = block.match(/id: '([^']+)'/)?.[1];
    if (!id) continue;
    const anatomy = [...block.matchAll(/\{ label: '([^']*)', labelZh: '[^']*', note: '([^']*)'/g)];
    const whenToUse = [...block.matchAll(/\{ situation: '([^']*)', recommended: (true|false|'mostly')/g)];
    zhPatterns.set(id, {
      anatomy: anatomy.map((m) => ({ label: m[1], note: m[2] })),
      whenToUse: whenToUse.map((m) => ({ situation: m[1], recommended: m[2].replace(/'/g, '') })),
      whenNotToUse: [...block.matchAll(/whenNotToUse: \[([\s\S]*?)\n    \]/g)]
        .map((m) => (m[1].match(/'([^']*)'/g) || []).map((s) => s.slice(1, -1)))
        .pop() || [],
      description: block.match(/description:\s*\n?\s*'([^']*)'/)?.[1] ?? '',
      oneLine: block.match(/oneLine: '([^']*)'/)?.[1] ?? '',
    });
  }
}

const comparisonsSrc = readFileSync(P('src/data/comparisons.ts'), 'utf8');
const zhComparisons = new Map();
for (const block of comparisonsSrc.split(/\n  \{\n/).slice(1)) {
  const slug = block.match(/slug: '([^']+)'/)?.[1];
  if (!slug) continue;
  const colCount = block.match(/columns: \[([\s\S]*?)\]/)?.[1]?.match(/key:/g)?.length ?? 0;
  const rowsBlock = block.match(/rows: \[([\s\S]*?)\n    \],/)?.[1] ?? '';
  zhComparisons.set(slug, {
    colCount,
    rows: [...rowsBlock.matchAll(/cells: \[([\s\S]*?)\]/g)].map((m) => m[1]),
    decision: [...block.matchAll(/decision: \[([\s\S]*?)\n    \]/g)]
      .map((m) => [...m[1].matchAll(/\{ if: /g)].length)
      .pop() || 0,
  });
}

const categoriesSrc = readFileSync(P('src/data/categories.ts'), 'utf8');
const zhCategoryIds = [...categoriesSrc.matchAll(/^\s{4}id: '([^']+)'/gm)].map((m) => m[1]);

/* ---------- 载入英文 overlay ---------- */

const i18nDir = P('src/data/i18n');
const enPatternSrc = readFileSync(join(i18nDir, 'patterns.en.ts'), 'utf8');
const batchFiles = [...enPatternSrc.matchAll(/from '\.\/(patterns\.[^']+\.en)'/g)].map((m) => m[1]);

let enPatternsText = '';
for (const bf of batchFiles) {
  // patterns.en.ts 里的 import 路径不含 .ts 后缀，这里补回来
  enPatternsText += readFileSync(join(i18nDir, `${bf}.ts`), 'utf8');
}

const enPatternIds = new Set([...enPatternsText.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\{/gm)].map((m) => m[1]));

/* ---------- 1. 词条覆盖 ---------- */

const missing = [...zhPatterns.keys()].filter((id) => !enPatternIds.has(id));
const extra = [...enPatternIds].filter((id) => !zhPatterns.has(id));
for (const id of missing) fail(`i18n: 词条 "${id}" 没有英文翻译`);
for (const id of extra) fail(`i18n: 英文翻译里有中文不存在的词条 "${id}"`);

/* ---------- 2. 数组长度与语义对齐 ---------- */

// 逐词条切出英文块再解析，比正则全局匹配可靠
for (const [id, zh] of zhPatterns) {
  if (!enPatternIds.has(id)) continue;
  const block = enPatternsText.split(new RegExp(`^  '?${id}'?: \\{`, 'm'))[1]?.split(/^  '?[a-z0-9-]+'?: \{/m)[0];
  if (!block) continue;

  const enAnatomy = [...block.matchAll(/\{ label: '([^']*)', note: '([^']*)'/g)];
  if (enAnatomy.length !== zh.anatomy.length) {
    fail(`i18n:${id} anatomy 英文 ${enAnatomy.length} 项，中文 ${zh.anatomy.length} 项`);
  } else {
    // label 必须逐字一致（都是英文术语），错了说明串位了
    enAnatomy.forEach((m, i) => {
      if (m[1] !== zh.anatomy[i].label) {
        fail(`i18n:${id} anatomy[${i}].label 英文 "${m[1]}" ≠ 中文 "${zh.anatomy[i].label}"（错位）`);
      }
    });
  }

  const enWhen = [...block.matchAll(/\{ situation: '([^']*)', recommended: (true|false|'mostly')/g)];
  if (enWhen.length !== zh.whenToUse.length) {
    fail(`i18n:${id} whenToUse 英文 ${enWhen.length} 项，中文 ${zh.whenToUse.length} 项`);
  } else {
    enWhen.forEach((m, i) => {
      const enRec = m[2].replace(/'/g, '');
      if (enRec !== zh.whenToUse[i].recommended) {
        fail(
          `i18n:${id} whenToUse[${i}].recommended 英文 "${enRec}" ≠ 中文 "${zh.whenToUse[i].recommended}"（建议相反）`
        );
      }
    });
  }

  const enWhenNot = block.match(/whenNotToUse: \[([\s\S]*?)\n    \]/)?.[1];
  if (enWhenNot) {
    const n = countStrings(enWhenNot);
    if (zh.whenNotToUse.length && n !== zh.whenNotToUse.length) {
      fail(`i18n:${id} whenNotToUse 英文 ${n} 项，中文 ${zh.whenNotToUse.length} 项`);
    }
  }

  // 占位符式空翻译
  const desc = block.match(/description:\s*\n?\s*'([^']*)'/)?.[1] ?? '';
  if (desc.length < 40) fail(`i18n:${id} 英文 description 太短（${desc.length} < 40）`);
}

/* ---------- 3. 英文残留中文 ---------- */

// 只看「字符串字面量里的中文」。注释里的中文说明是允许的（甚至是必要的），
// 所以先剥掉注释再扫，否则每个文件的中文注释都会误报。
for (const f of readdirSync(i18nDir).filter((x) => x.endsWith('.en.ts'))) {
  let src = readFileSync(join(i18nDir, f), 'utf8');
  // 剥掉 /* */ 和 // 注释（不处理字符串内的 //，这个项目的数据文件里没有这种写法）
  src = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  for (const m of src.matchAll(/[一-龥]+/g)) {
    fail(`i18n:${f} 残留中文 "${m[0]}"`);
  }
}

/* ---------- 4. 对比页 ---------- */

const enCompSrc = readFileSync(join(i18nDir, 'comparisons.en.ts'), 'utf8');
const enCompSlugs = new Set([...enCompSrc.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\{/gm)].map((m) => m[1]));
for (const slug of zhComparisons.keys()) if (!enCompSlugs.has(slug)) fail(`i18n: 对比 "${slug}" 没有英文翻译`);
for (const slug of enCompSlugs) if (!zhComparisons.has(slug)) fail(`i18n: 英文对比 "${slug}" 中文不存在`);

for (const block of enCompSrc.split(/\n  '?[a-z0-9-]+'?: \{\n/).slice(1)) {
  const slug = block.match(/^\s*'?([a-z0-9-]+)'?:\s*\{/)?.[1] || block.match(/\n\s*'?([a-z0-9-]+)'?:\s*\{/)?.[1];
  const zh = zhComparisons.get(slug);
  if (!zh) continue;

  const enColCount = block.match(/columns: \[([\s\S]*?)\]/)?.[1]?.match(/key:/g)?.length ?? 0;
  if (enColCount !== zh.colCount) {
    fail(`i18n:${slug} columns 英文 ${enColCount} 个，中文 ${zh.colCount} 个`);
  }

  const rowsBlock = block.match(/rows: \[([\s\S]*?)\n    \],/)?.[1] ?? '';
  const enRows = [...rowsBlock.matchAll(/cells: \[([\s\S]*?)\]/g)];
  if (enRows.length !== zh.rows.length) {
    fail(`i18n:${slug} rows 英文 ${enRows.length} 行，中文 ${zh.rows.length} 行`);
  } else {
    enRows.forEach((m, i) => {
      const cells = countStrings(m[1]) + [...m[1].matchAll(/\b(true|false)\b/g)].length;
      if (cells !== zh.colCount) {
        fail(`i18n:${slug} 第 ${i + 1} 行 cells 英文 ${cells} 个，columns ${zh.colCount} 个`);
      }
    });
  }
}

/* ---------- 5. 分类与学习层级 ---------- */

const enCatSrc = readFileSync(join(i18nDir, 'categories.en.ts'), 'utf8');
const enCatIds = new Set([...enCatSrc.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\{/gm)].map((m) => m[1]));
for (const id of zhCategoryIds) if (!enCatIds.has(id)) fail(`i18n: 分类 "${id}" 没有英文 blurb`);
for (const id of enCatIds) if (!zhCategoryIds.includes(id)) fail(`i18n: 英文分类 "${id}" 中文不存在`);

const enLearnSrc = readFileSync(join(i18nDir, 'learning.en.ts'), 'utf8');
for (const lv of [1, 2, 3]) {
  if (!new RegExp(`^\\s{2}${lv}:\\s*\\{`, 'm').test(enLearnSrc)) fail(`i18n: 学习层级 ${lv} 没有英文翻译`);
}

/* ---------- 6. ui-strings 键集合一致 ---------- */

const uiSrc = readFileSync(P('src/lib/ui-strings.ts'), 'utf8');

/**
 * 切出 `const <name> ... = {` 到配对 `}` 之间的内容。
 * 不能用 indexOf('export type UIKey') 当终点——那个声明可能出现在 zh 块之前，
 * slice 会得到空串，然后所有 key 都报「英文缺失」，变成一个永远红的假警报。
 */
function extractObjectBlock(src, decl) {
  const at = src.indexOf(decl);
  if (at < 0) return null;
  const open = src.indexOf('{', at);
  if (open < 0) return null;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return null;
}

const zhBlock = extractObjectBlock(uiSrc, 'const zh =');
const enBlock = extractObjectBlock(uiSrc, 'const en');
if (zhBlock === null || enBlock === null) {
  fail('i18n: 无法在 ui-strings.ts 里定位 zh / en 词典块');
}
const zhKeys = [...(zhBlock ?? '').matchAll(/^  '([^']+)':/gm)].map((m) => m[1]);
const enKeys = new Set([...(enBlock ?? '').matchAll(/^  '([^']+)':/gm)].map((m) => m[1]));
for (const k of zhKeys) if (!enKeys.has(k)) fail(`i18n: ui-strings 英文缺 key "${k}"`);
for (const k of enKeys) if (!zhKeys.includes(k)) fail(`i18n: ui-strings 英文多了 key "${k}"`);
if (!zhKeys.length) fail('i18n: 无法从 ui-strings.ts 解析出中文 key');

/* ---------- 输出 ---------- */

console.log(
  `i18n: ${zhPatterns.size} 词条 / ${enPatternIds.size} 已译 · ` +
    `${zhComparisons.size} 对比 / ${enCompSlugs.size} 已译 · ` +
    `${zhCategoryIds.length} 分类 / ${enCatIds.size} 已译 · ${zhKeys.length} 界面文案键\n`
);

if (warnings.length) {
  console.log('⚠ i18n 警告');
  warnings.forEach((w) => console.log(`  ${w}`));
  console.log('');
}

if (errors.length) {
  console.log(`✗ i18n ${errors.length} 个错误`);
  [...new Set(errors)].slice(0, 60).forEach((e) => console.log(`  ${e}`));
  if (new Set(errors).size > 60) console.log(`  …另有 ${new Set(errors).size - 60} 条`);
  process.exit(1);
}

console.log('✓ 国际化完整性校验通过');