/**
 * 搜索质量校验。
 *
 * 为什么值得单独一个脚本：搜索是「用描述换术语」这个核心承诺的唯一实现。
 * 漏一条口语映射不会报错、不会崩，只会让某个查询静默返回空结果 ——
 * 而这恰恰是用户最需要它的时刻。
 *
 * 同时校验中文口语映射仍然有效（i18n 改动容易误伤）。
 *
 * 跑法：npm run verify:search
 */
import { searchPatterns } from '../src/data/search';
import { patterns } from '../src/data/patterns';

let pass = 0;
let fail = 0;
const ok = (m) => { console.log(`✓ ${m}`); pass++; };
const bad = (m) => { console.log(`✗ ${m}`); fail++; };

/** 每条：[查询, 期望出现在前三名的词条关键词] */
const EN_CASES = [
  ['slides up from the bottom', 'Bottom Sheet'],
  ['pops up from the bottom', 'Bottom Sheet'],
  ['popup in the center', 'Modal'],
  ['something slides in from the side', 'Drawer'],
  ['small popup next to a button', 'Popover'],
  ['hint on hover', 'Tooltip'],
  ['message that disappears', 'Toast'],
  ['undo message', 'Snackbar'],
  ['stays on screen', 'Alert'],
  ['grey blocks', 'Skeleton'],
  ['gray blocks', 'Skeleton'],
  ['spinning circle', 'Spinner'],
  ['how far along', 'Progress'],
  ['fill in step by step', 'Stepper'],
  ['one step at a time', 'Stepper'],
  ['type here', 'Text Field'],
  ['long text input', 'Text Area'],
  ['tick a box', 'Checkbox'],
  ['pick one of several', 'Radio'],
  ['on and off', 'Switch'],
  ['drag to a value', 'Slider'],
  ['plus and minus', 'Stepper'],
  ['upload a file', 'File Upload'],
  ['choose a date', 'Date Picker'],
  ['switch tabs', 'Tabs'],
  ['menu at the bottom', 'Bottom Navigation'],
  ['narrow bar on the left', 'Navigation Rail'],
  ['side panel', 'Sidebar'],
  ['page numbers', 'Pagination'],
  ['keep loading as i scroll', 'Infinite Scroll'],
  ['button that scrolls', 'Load More'],
  ['where am i', 'Breadcrumb'],
  ['expand and collapse', 'Accordion'],
  ['nothing here yet', 'Empty State'],
  ['something went wrong', 'Error'],
  ['it worked', 'Success'],
  ['unread count', 'Badge'],
  ['round floating button', 'FAB'],
  ['big colorful button', 'CTA'],
  ['small icon only button', 'Icon Button'],
  ['dangerous delete', 'Destructive'],
  ['drag to reorder', 'Drag'],
  ['press and hold', 'Long Press'],
  ['right click menu', 'Context Menu'],
  ['pull down to refresh', 'Pull to Refresh'],
  ['swipe left', 'Swipe'],
  ['rows and columns', 'Table'],
  ['big number', 'Stat Card'],
  ['profile picture', 'Avatar'],
  ['vertical timeline', 'Timeline'],
  ['small tag', 'Chip'],
  ['loading placeholder', 'Skeleton'],
  ['empty list', 'Empty State'],
];

const ZH_CASES = [
  ['底下弹出来', 'Bottom Sheet'],
  ['弹窗', 'Modal'],
  ['转圈圈', 'Spinner'],
  ['骨架屏', 'Skeleton'],
  ['数据未到先显示灰块', 'Skeleton'],
  ['开和关', 'Switch'],
  ['滑动条', 'Slider'],
  ['长按', 'Long Press'],
  ['右键', 'Context Menu'],
  ['分步完成', 'Stepper'],
  ['分层展开', 'Accordion'],
  ['一步一步填写', 'Stepper'],
  ['页面太多分步操作', 'Stepper'],
  ['像拼贴一样的相册网格', 'Grid'],
  ['底部菜单', 'Bottom Navigation'],
  ['红点', 'Badge'],
];

function run(label, cases) {
  console.log(`\n──── ${label} ────`);
  for (const [q, want] of cases) {
    const r = searchPatterns(q, patterns);
    const top3 = r.slice(0, 3).map((h) => h.pattern.name);
    const hit = top3.some((n) => n.toLowerCase().includes(want.toLowerCase()));
    if (hit) ok(`"${q}" → ${top3[0]}`);
    else bad(`"${q}" → ${top3.join(', ') || '(无结果)'}   期望前三含 ${want}`);
  }
}

run('英文口语描述', EN_CASES);
run('中文口语描述', ZH_CASES);

// 精确词条名必须永远排第一（口语分刻意低于名字匹配分）
console.log('\n──── 精确名优先 ────');
for (const name of ['Bottom Sheet', 'Toast', 'Skeleton', 'Switch', 'Stepper']) {
  const r = searchPatterns(name, patterns);
  if (r[0]?.pattern.name === name) ok(`搜 "${name}" 首位即自身`);
  else bad(`搜 "${name}" 首位是 ${r[0]?.pattern.name || '(无)'}`);
}

// 边界
console.log('\n──── 边界 ────');
try {
  const a = searchPatterns('', patterns);
  const b = searchPatterns('   ', patterns);
  const c = searchPatterns('zzzzqqq', patterns);
  const d = searchPatterns('!!!', patterns);
  if (a.length === 0 && b.length === 0) ok('空查询返回空数组');
  else bad(`空查询返回了 ${a.length}/${b.length} 条`);
  if (c.length === 0) ok('无匹配查询返回空数组');
  else bad('无匹配查询返回了结果');
  if (d.length === 0) ok('纯符号查询不崩且返回空');
  else bad('纯符号查询返回了结果');
} catch (e) {
  bad(`边界查询抛异常：${e.message}`);
}

// 无关查询负控（Negative Controls）：确保不出现泛滥假阳性
console.log('\n──── 无关查询负控（Negative Controls） ────');
const NEGATIVE_CASES = [
  'random nonsense text',
  '量子波动速读',
  'apple pie recipe',
  'kubernetes deployment yaml',
  '明天天气预报下雨吗',
];
for (const q of NEGATIVE_CASES) {
  const r = searchPatterns(q, patterns);
  if (r.length === 0) ok(`负控 "${q}" → 0 命中（无假阳性）`);
  else bad(`负控 "${q}" 出现假阳性命中：${r.map((h) => h.pattern.id).join(', ')}`);
}

// 场景推荐理由双语与防御性回退校验
console.log('\n──── 场景推荐理由双语与回退 ────');
{
  // 1. 字典命中
  const bsHits = searchPatterns('bottom sheet', patterns);
  const bs = bsHits.find((h) => h.pattern.id === 'bottom-sheet');
  if (bs?.scenarioReason?.startsWith('推荐理由：') && bs?.scenarioReasonEn?.startsWith('Why this:')) {
    ok('字典命中：中英文均生成正确推荐理由');
  } else {
    bad(`字典命中异常：zh="${bs?.scenarioReason}" en="${bs?.scenarioReasonEn}"`);
  }

  // 2. 普通回退（非预置字典 Pattern 联动 fitsFor）
  const tlHits = searchPatterns('timeline', patterns);
  const tl = tlHits.find((h) => h.pattern.id === 'timeline');
  if (tl?.scenarioReason?.startsWith('适合场景：') && tl?.scenarioReasonEn?.startsWith('Best for:')) {
    ok('普通回退：未在字典的 Pattern 联动 fitsFor 生成规范回退理由');
  } else {
    bad(`普通回退异常：zh="${tl?.scenarioReason}" en="${tl?.scenarioReasonEn}"`);
  }

  // 3. 缺翻译防御：无英文 fitsFor 时，scenarioReasonEn 严格为 undefined，绝不能回退中文
  const dummyPattern = {
    id: 'dummy-no-trans',
    name: 'Dummy Component',
    chineseName: '测试组件',
    aliases: [],
    category: 'feedback',
    level: 1,
    fitsFor: '中文场景描述',
    tags: ['test'],
    oneLine: '测试',
    description: '测试',
    looksLike: '测试',
    difficulty: 'easy',
    whenToUse: [],
    whenNotToUse: [],
    similarPatterns: [],
    anatomy: [],
    aiPrompt: { basic: '', detailed: '', implementation: '' },
    badPrompt: '',
  };
  const dummyHits = searchPatterns('dummy', [dummyPattern]);
  const dummy = dummyHits[0];
  if (dummy?.scenarioReason === '适合场景：中文场景描述' && dummy?.scenarioReasonEn === undefined) {
    ok('缺翻译防御：无英文翻译时 scenarioReasonEn 严格为 undefined，零中文泄漏');
  } else {
    bad(`缺翻译防御失败：zh="${dummy?.scenarioReason}" en="${dummy?.scenarioReasonEn}"`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`搜索校验：${pass} / ${pass + fail} 通过`);
process.exit(fail === 0 ? 0 : 1);