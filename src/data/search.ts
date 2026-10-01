import type { UIPattern } from './types';

/** 中文口语 → 词条的映射。这是「我不知道它叫什么」的关键部分。 */
const colloquialMap: Record<string, string[]> = {
  底下弹出来: ['bottom-sheet', 'drawer'],
  从下面弹出: ['bottom-sheet', 'drawer'],
  从底部升起: ['bottom-sheet'],
  弹个东西出来: ['modal', 'bottom-sheet', 'popover', 'drawer'],
  弹窗: ['modal', 'alert'],
  对话框: ['modal', 'destructive-action'],
  确认一下: ['destructive-action', 'modal'],
  是不是真的: ['destructive-action'],
  一步步填写: ['stepper'],
  一步一步填写: ['stepper'],
  分步完成: ['stepper'],
  分几步: ['stepper', 'pagination'],
  我在哪一层: ['breadcrumb'],
  回到上一层: ['breadcrumb', 'back-button'],
  灰掉的提示: ['skeleton', 'spinner', 'progress-bar'],
  转圈圈: ['spinner', 'progress-bar'],
  骨架屏: ['skeleton'],
  加载中: ['spinner', 'skeleton', 'progress-bar'],
  百分之多少: ['progress-bar'],
  撤销: ['snackbar', 'destructive-action'],
  反悔: ['snackbar'],
  已保存: ['toast', 'snackbar'],
  提示一下: ['toast', 'alert', 'snackbar'],
  出错了: ['alert', 'error-state', 'inline-validation'],
  错误: ['alert', 'error-state', 'inline-validation'],
  红点: ['badge'],
  未读: ['badge'],
  几个字的小标签: ['chip', 'chip-display'],
  分类标签: ['chip', 'chip-display', 'chip-display'],
  筛选: ['chip', 'select', 'drawer', 'bottom-sheet'],
  排序: ['table', 'list'],
  表格式的: ['table', 'stat-card'],
  统计: ['stat-card', 'table'],
  数字: ['stat-card'],
  头像: ['avatar'],
  圆头像: ['avatar'],
  展开: ['accordion', 'collapsible', 'progressive-disclosure'],
  折叠: ['accordion', 'collapsible', 'progressive-disclosure'],
  展开收起: ['accordion', 'collapsible', 'progressive-disclosure'],
  收起来: ['accordion', 'collapsible', 'sidebar'],
  分层展开: ['accordion', 'progressive-disclosure', 'collapsible'],
  侧边: ['sidebar', 'drawer', 'navigation-rail'],
  左边: ['sidebar', 'navigation-rail', 'drawer'],
  底部导航: ['bottom-navigation'],
  底部菜单: ['bottom-navigation', 'bottom-sheet'],
  悬浮: ['fab', 'tooltip', 'popover'],
  圆形的按钮: ['fab', 'icon-button'],
  大圆按钮: ['fab'],
  打字: ['text-field', 'text-area'],
  输入框: ['text-field', 'search-field', 'text-area'],
  多行: ['text-area'],
  长文本: ['text-area'],
  搜索: ['search-field', 'select'],
  找东西: ['search-field'],
  勾选: ['checkbox', 'radio', 'switch'],
  打勾: ['checkbox'],
  圈里选: ['radio'],
  单选: ['radio'],
  多选: ['checkbox', 'chip'],
  开关: ['switch'],
  开和关: ['switch'],
  拖动: ['slider', 'drag-and-drop'],
  滑动条: ['slider'],
  调数值: ['slider', 'stepper-input'],
  加减: ['stepper-input'],
  数量: ['stepper-input'],
  翻页: ['pagination', 'infinite-scroll', 'load-more'],
  下一页: ['pagination', 'load-more', 'infinite-scroll'],
  到底: ['infinite-scroll', 'pagination', 'load-more'],
  标签页: ['tabs'],
  选项卡: ['tabs'],
  切换内容: ['tabs', 'segmented-control'],
  视图切换: ['segmented-control', 'tabs'],
  小按钮组: ['segmented-control', 'chip'],
  上传: ['file-upload'],
  传文件: ['file-upload'],
  日期: ['date-picker'],
  日历: ['date-picker', 'timeline'],
  鼠标放上去: ['tooltip'],
  悬停提示: ['tooltip'],
  图标说明: ['tooltip'],
  旁边弹出: ['popover', 'select'],
  空的: ['empty-state', 'error-state'],
  没有数据: ['empty-state', 'error-state'],
  第一次用: ['empty-state'],
  完成了: ['success-state', 'empty-state'],
  左边滑: ['swipe-action', 'drawer'],
  长按: ['long-press'],
  右键: ['context-menu'],
  拖动排序: ['drag-and-drop', 'list'],
  下拉: ['pull-to-refresh', 'select', 'bottom-navigation'],
  刷新: ['pull-to-refresh', 'progress-bar'],
  时间线: ['timeline', 'list'],
  列表: ['list', 'table', 'timeline'],
  主按钮: ['cta', 'button'],
  行动按钮: ['cta', 'button'],
  提交: ['button', 'destructive-action'],
  保存: ['button'],
  删除: ['destructive-action'],
  危险: ['destructive-action', 'alert'],
  工具栏: ['icon-button', 'split-button'],
  小图标按钮: ['icon-button'],
  危险操作: ['destructive-action'],
};

/**
 * 英文口语 → 词条。
 *
 * 为什么必须有：站点的核心承诺是「用你记得住的描述搜出术语」，
 * 这个承诺对英文用户同样成立。但词条的 looksLike / aliases 只有中文，
 * 英文用户搜 "slides up from the bottom" 一个都命中不了 —— 页面不报错、
 * 结果为空，看起来只是"没匹配上"。
 *
 * 匹配策略和中文不同：英文是多词短语，`includes` 整串比对要求用户
 * 输入和词条完全一致的词序，实践中几乎不可能命中。所以英文侧走
 * 分词 + 覆盖率：命中词数越多、覆盖率越高，分越高。
 * 详见 searchPatterns 里的 colloquialScore。
 */
const colloquialEn: Record<string, string[]> = {
  // 浮层类
  'slides up from the bottom': ['bottom-sheet'],
  'pops up from the bottom': ['bottom-sheet'],
  'comes up from the bottom': ['bottom-sheet'],
  'sheet from the bottom': ['bottom-sheet'],
  'popup in the center': ['modal'],
  'pops up in the middle': ['modal'],
  'blocking dialog': ['modal'],
  'confirm dialog': ['modal', 'destructive-action'],
  'something slides in from the side': ['drawer', 'swipe-action'],
  'panel from the side': ['drawer'],
  'floating box': ['popover'],
  'small popup next to a button': ['popover'],
  'little tooltip': ['tooltip'],
  'hint on hover': ['tooltip'],
  'fades away on its own': ['toast', 'snackbar'],
  'message that disappears': ['toast', 'snackbar'],
  'undo message': ['snackbar', 'destructive-action'],
  'stays on screen': ['alert', 'banner'],
  'full screen warning': ['alert'],

  // 加载类
  'grey blocks': ['skeleton'],
  'gray blocks': ['skeleton'],
  'placeholder while loading': ['skeleton'],
  'spinning circle': ['spinner'],
  'loading circle': ['spinner'],
  'how far along': ['progress-bar'],
  'bar that fills up': ['progress-bar'],

  // 表单类
  'fill in step by step': ['stepper'],
  'one step at a time': ['stepper'],
  'multiple steps': ['stepper'],
  'type here': ['text-field'],
  'single line input': ['text-field'],
  'long text input': ['text-area'],
  'multiple lines of text': ['text-area'],
  'tick a box': ['checkbox'],
  'check a box': ['checkbox'],
  'pick one of several': ['radio'],
  'circle to select': ['radio'],
  'on and off': ['switch'],
  'toggle': ['switch'],
  'drag to a value': ['slider'],
  'drag the handle': ['slider'],
  'plus and minus': ['stepper-input'],
  'increment and decrement': ['stepper-input'],
  'upload a file': ['file-upload'],
  'choose a date': ['date-picker'],
  'calendar picker': ['date-picker'],

  // 导航类
  'switch tabs': ['tabs'],
  'horizontal sections': ['tabs'],
  'bar with multiple screens': ['bottom-navigation'],
  'menu at the bottom': ['bottom-navigation'],
  'narrow bar on the left': ['navigation-rail'],
  'side panel': ['sidebar'],
  'page numbers': ['pagination'],
  'next page': ['pagination', 'load-more', 'infinite-scroll'],
  'scrolls forever': ['infinite-scroll'],
  'keep loading as i scroll': ['infinite-scroll'],
  'button that scrolls': ['load-more'],
  'where am i': ['breadcrumb'],
  'expand and collapse': ['accordion', 'collapsible'],
  'show more': ['progressive-disclosure', 'load-more'],

  // 反馈类
  'nothing here yet': ['empty-state'],
  'no data': ['empty-state', 'error-state'],
  'first time user': ['empty-state'],
  'something went wrong': ['error-state', 'alert'],
  'keep trying': ['error-state'],
  'it worked': ['success-state'],
  'all done': ['success-state'],
  'red dot': ['badge'],
  'unread count': ['badge'],

  // 动作类
  'round floating button': ['fab'],
  'floating circle button': ['fab'],
  'big colorful button': ['cta'],
  'primary action': ['cta', 'button'],
  'small icon only button': ['icon-button'],
  'split button': ['split-button'],
  'dangerous delete': ['destructive-action'],
  'delete confirmation': ['destructive-action', 'modal'],

  // 拖拽类
  'drag to reorder': ['drag-and-drop'],
  'reorder by dragging': ['drag-and-drop'],
  'long press': ['long-press'],
  'press and hold': ['long-press'],
  'right click menu': ['context-menu'],
  'pull down to refresh': ['pull-to-refresh'],
  'swipe to delete': ['swipe-action'],
  'swipe left': ['swipe-action'],

  // 数据展示
  'rows and columns': ['table'],
  'grid of data': ['table', 'stat-card'],
  'big number': ['stat-card'],
  'single number': ['stat-card'],
  'round avatar': ['avatar'],
  'profile picture': ['avatar'],
  'vertical timeline': ['timeline'],
  'small tag': ['chip', 'chip-display'],
  'filter chips': ['chip', 'drawer'],
  'filtering options': ['drawer', 'chip', 'select'],
  'sort the list': ['table', 'list'],
  'simple list': ['list'],
};

/** 英文停用词，匹配时剔除，否则 "on and off" 里的 on 会污染所有词条 */
const STOPWORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'it', 'is', 'as', 'and', 'or',
  'for', 'from', 'by', 'with', 'my', 'me', 'i', 'that', 'this', 'be',
]);

/**
 * 英文口语短语的匹配分。
 *
 * 不用 includes 整串比对：用户输入的词序几乎不会和词条完全一致
 * （"slides up from the bottom" vs "sheet from the bottom"）。
 * 改成「有多少个实义词出现在查询里」+ 覆盖率，命中一半词也能出结果。
 *
 * 返回 0 表示不命中。最高 9 分——刻意低于中文口语的 10 分上限，
 * 保证精确的词条名匹配永远排在模糊描述前面。
 */
function colloquialScore(query: string, patternId: string): number {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
  if (terms.length === 0) return 0;

  let best = 0;
  for (const [phrase, ids] of Object.entries(colloquialEn)) {
    const idx = ids.indexOf(patternId);
    if (idx < 0) continue;

    const phraseTerms = phrase.split(' ');
    let hit = 0;
    for (const term of terms) {
      if (phraseTerms.some((pt) => pt.includes(term) || term.includes(pt))) hit++;
    }
    if (hit === 0) continue;

    const coverage = hit / terms.length;
    if (coverage < 0.6) continue; // 只沾到一两个词不算命中

    // 基础分随覆盖率上升，同一条目内靠前优先
    let s = 5 + Math.round(coverage * 3) - idx * 0.5;

    // 查询的实义词和短语的实义词**逐词同序相同时**才大幅加权。
    // 关键在「同序 + 同长度」，不能只看个数相等：
    // 否则单词短语（toggle）和任意多词查询（expand and collapse）
    // 都会拿到同一档加权，排序退化、正确答案被挤掉。
    const phraseKeys = phraseTerms.filter((w) => !STOPWORDS.has(w));
    const sameOrder =
      terms.length === phraseKeys.length &&
      terms.every((w, i) => {
        const pt = phraseKeys[i];
        return pt.includes(w) || w.includes(pt);
      });
    if (sameOrder) s += 3;

    if (s > best) best = s;
  }
  return best;
}

/** 返回带命中原因的搜索结果 */
export interface SearchHit {
  pattern: UIPattern;
  score: number;
  matchedBy: string;
}

export function searchPatterns(query: string, list: UIPattern[] = []): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const source = list;

  const hits: SearchHit[] = [];

  for (const p of source) {
    let score = 0;
    let matchedBy = '';

    const fields: { value: string; weight: number; label: string }[] = [
      { value: p.name.toLowerCase(), weight: 12, label: '英文名' },
      { value: p.chineseName, weight: 12, label: '中文名' },
      { value: p.oneLine, weight: 4, label: '一句话解释' },
      { value: p.looksLike, weight: 3, label: '场景描述' },
      { value: p.description, weight: 2, label: '详细解释' },
      { value: p.tags.join(' '), weight: 5, label: '标签' },
      { value: p.aliases.join(' ').toLowerCase(), weight: 8, label: '别名' },
    ];

    for (const f of fields) {
      if (f.value.includes(q)) {
        // 前缀匹配权重更高
        const prefixBonus = f.value.startsWith(q) ? 3 : 0;
        const s = f.weight + prefixBonus;
        if (s > score) {
          score = s;
          matchedBy = f.label;
        }
      }
    }

    // 口语映射（中文：整串包含即可，中文查询通常就是那几个字）
    for (const [phrase, ids] of Object.entries(colloquialMap)) {
      if (phrase.includes(q) || q.includes(phrase)) {
        const idx = ids.indexOf(p.id);
        if (idx >= 0) {
          const s = 10 - idx;
          if (s > score) {
            score = s;
            matchedBy = '口语描述';
          }
        }
      }
    }

    // 口语映射（英文：分词覆盖率匹配，见 colloquialScore 的说明）
    if (/[a-z]/.test(q)) {
      const s = colloquialScore(q, p.id);
      if (s > score) {
        score = s;
        matchedBy = '口语描述';
      }
    }

    if (score > 0) {
      hits.push({ pattern: p, score, matchedBy });
    }
  }

  return hits.sort((a, b) => b.score - a.score);
}

/**
 * 「我不知道它叫什么」的分步规则。
 * 全部由 Pattern 自己的 position / job 字段推导，不维护第二份手工矩阵。
 */
export interface IdentifyOption {
  value: string;
  label: string;
  hint: string;
}

export const identifySteps: {
  position: IdentifyOption[];
  job: IdentifyOption[];
} = {
  position: [
    { value: 'top', label: '页面顶部', hint: '标题栏、标签栏那一带' },
    { value: 'bottom', label: '页面底部', hint: '贴着屏幕下边缘' },
    { value: 'center', label: '页面中间', hint: '内容区的正中央' },
    { value: 'floating', label: '悬浮在内容上', hint: '跟着某个元素飘着' },
    { value: 'overlay', label: '盖住整页', hint: '背后内容被遮住' },
    { value: 'side', label: '从侧面滑出', hint: '左边或右边' },
    { value: 'inline', label: '就在内容里', hint: '不是浮层，混在正文中间' },
  ],
  job: [
    { value: 'navigate', label: '跳到别处', hint: '换页面、换层级' },
    { value: 'select', label: '做选择', hint: '从几个里挑一个' },
    { value: 'input', label: '输入内容', hint: '打字、选日期' },
    { value: 'inform', label: '告诉用户', hint: '纯信息，不要求操作' },
    { value: 'expand', label: '展开内容', hint: '展开收起一段' },
    { value: 'status', label: '显示状态', hint: '加载中、成功、失败' },
    { value: 'create', label: '发起操作', hint: '提交、新建、开始' },
    { value: 'confirm', label: '确认或撤销', hint: '要用户点头' },
  ],
};

export interface IdentifyHit {
  pattern: UIPattern;
  /** 命中了几项选择 —— 越多越可能 */
  matchCount: number;
  reasons: string[];
}

/**
 * 按 position + job 过滤候选。
 * 单选时宽松匹配（只满足一项也返回，但排后），两项都选时要求同时满足。
 */
export function identifyCandidates(
  position: string | null,
  job: string | null,
  list: UIPattern[]
): IdentifyHit[] {
  const pool = list.length > 0 ? list : [];
  if (!pool.length) return [];

  const posLabel = identifySteps.position.find((s) => s.value === position)?.label;
  const jobLabel = identifySteps.job.find((s) => s.value === job)?.label;

  const hits: IdentifyHit[] = [];

  for (const p of pool) {
    const matchPosition = !!position && p.position.includes(position as never);
    const matchJob = !!job && p.job.includes(job as never);

    if (position && job) {
      if (!matchPosition || !matchJob) continue;
    } else if (position) {
      if (!matchPosition) continue;
    } else if (job) {
      if (!matchJob) continue;
    } else {
      continue;
    }

    const reasons: string[] = [];
    if (matchPosition) reasons.push(`位置：${posLabel}`);
    if (matchJob) reasons.push(`作用：${jobLabel}`);

    hits.push({ pattern: p, matchCount: reasons.length, reasons });
  }

  return hits
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return a.pattern.level - b.pattern.level;
    })
    .slice(0, 12);
}

