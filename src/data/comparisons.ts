import type { Comparison } from './types';

export const comparisons: Comparison[] = [
  {
    slug: 'dialog-vs-bottom-sheet-vs-drawer',
    title: 'Dialog vs Bottom Sheet vs Drawer',
    subtitle: '「弹一个东西出来」的三种说法',
    question: '我需要在当前页面上弹出一层界面，用哪个？',
    patterns: ['modal', 'bottom-sheet', 'drawer'],
    columns: [
      { key: 'anchor', label: '出现位置' },
      { key: 'blocking', label: '阻断用户' },
      { key: 'context', label: '底层页面' },
      { key: 'platform', label: '主要平台' },
    ],
    rows: [
      {
        pattern: 'modal',
        cells: ['屏幕中央', true, '完全遮蔽，灰掉', '全平台'],
        verdict: '要用户「必须决定」时用它',
      },
      {
        pattern: 'bottom-sheet',
        cells: ['屏幕底部', '部分阻断', '保留可见，可感知上下文', '移动端'],
        verdict: '移动端的选择面板首选',
      },
      {
        pattern: 'drawer',
        cells: ['屏幕侧边', '部分阻断', '保留大部分可见', '全平台'],
        verdict: '导航或筛选要占一整片区域时',
      },
    ],
    decision: [
      { if: '用户必须做出选择才能继续（删除确认、登录）', then: 'Dialog' },
      { if: '移动端要从几个选项里挑，或要展示一排操作', then: 'Bottom Sheet' },
      { if: '要放的东西比较多，像一个独立页面（导航、筛选）', then: 'Drawer' },
      { if: '只是想让用户知道一件事做成了', then: '哪个都别用，用 Toast' },
    ],
    takeaway:
      '三者最大的区别是「阻断感」。越强的阻断（Dialog）用于越必须的决定；越弱的阻断（Bottom Sheet / Drawer）用于用户可以随时跑掉的场景。',
    relatedComparisons: ['toast-vs-snackbar-vs-alert', 'tooltip-vs-popover'],
  },
  {
    slug: 'toast-vs-snackbar-vs-alert',
    title: 'Toast vs Snackbar vs Alert',
    subtitle: '「给个提示」的三种说法',
    question: '操作做完了，想告诉用户一声，用哪个？',
    patterns: ['toast', 'snackbar', 'alert'],
    columns: [
      { key: 'action', label: '能带操作' },
      { key: 'duration', label: '停留时间' },
      { key: 'blocking', label: '阻断用户' },
      { key: 'use', label: '典型场景' },
    ],
    rows: [
      {
        pattern: 'toast',
        cells: ['否', '2–3 秒自动消失', false, '「已保存」「已发送」'],
        verdict: '纯告知，没后續',
      },
      {
        pattern: 'snackbar',
        cells: ['是（撤销/重试）', '5–10 秒', false, '「已删除 · 撤销」'],
        verdict: '告诉用户「你可以反悔」',
      },
      {
        pattern: 'alert',
        cells: ['通常是', '持续显示', '可能（Alert Dialog）', '错误、风险、需处理'],
        verdict: '不处理不行的那种',
      },
    ],
    decision: [
      { if: '只是想确认成功', then: 'Toast' },
      { if: '希望用户能撤销刚才的操作', then: 'Snackbar' },
      { if: '用户必须处理这个问题（出错、有风险）', then: 'Alert（严重时用 Alert Dialog）' },
    ],
    takeaway:
      '最常被搞混的是 Toast 和 Snackbar。判断标准只有一条：需不需要用户点一下。如果不需要，那是 Toast。',
    relatedComparisons: ['dialog-vs-bottom-sheet-vs-drawer', 'spinner-vs-progress-bar-vs-skeleton'],
  },
  {
    slug: 'tabs-vs-segmented-control',
    title: 'Tabs vs Segmented Control',
    subtitle: '为什么它们长得像但不是一回事',
    question: '我有一组选项要切换，用 Tabs 还是 Segmented Control？',
    patterns: ['tabs', 'segmented-control'],
    columns: [
      { key: 'level', label: '切换什么' },
      { key: 'scope', label: '适用场景' },
      { key: 'url', label: 'URL / 状态关联' },
      { key: 'width', label: '控件形态' },
    ],
    rows: [
      {
        pattern: 'tabs',
        cells: ['不同板块的完整内容面板', '页面或模块级导航，内容结构差异大', '常映射独立 URL/query 便于深链分享，也可同页切换', '通栏或靠左排布，占据显著视觉区域'],
        verdict: '切换「不同维度的完整内容」',
      },
      {
        pattern: 'segmented-control',
        cells: ['同一内容的不同呈现模式', '局部数据过滤/模式切换，作用于同一数据集', '多为局部状态（可视需要同步参数），无需跳转页面', '紧凑胶囊状，宽度自适应或等分包裹'],
        verdict: '切换「同一数据的观察视角」',
      },
    ],
    decision: [
      { if: '切换的是不同板块的完整内容（如 资料 / 作品 / 喜欢），且可能需要单独分享或锚定', then: 'Tabs' },
      { if: '切换的是同一块内容的展现形态（如 列表 / 看板、日 / 周 / 月）', then: 'Segmented Control' },
      { if: '超过 5 个选项', then: '考虑用 Select 下拉或侧边导航，避免挤占空间' },
    ],
    takeaway:
      '最简判断：Tabs 承载的是「不同板块的内容面板」（侧重分区导航）；Segmented Control 承载的是「同一对象的视图模式」（侧重状态过滤）。两者都可以根据业务决定是否映射 URL，不要仅凭 URL 绝对划分。',
    relatedComparisons: ['pagination-vs-infinite-scroll', 'checkbox-vs-radio-vs-switch'],
  },
  {
    slug: 'checkbox-vs-radio-vs-switch',
    title: 'Checkbox vs Radio vs Switch',
    subtitle: '「选或不选」的三种勾选方式',
    question: '我需要让用户做一个选择，用哪个？',
    patterns: ['checkbox', 'radio', 'switch'],
    columns: [
      { key: 'multi', label: '能多选' },
      { key: 'effect', label: '何时生效' },
      { key: 'semantics', label: '表达的是' },
      { key: 'use', label: '典型场景' },
    ],
    rows: [
      {
        pattern: 'checkbox',
        cells: ['能', '提交表单时', '「我勾了这些」', '购物车多选、同意条款'],
        verdict: '收集多个选择',
      },
      {
        pattern: 'radio',
        cells: ['不能（互斥）', '点选即选中', '「我选其中一个」', '登录方式、方案选择'],
        verdict: '二选一或多选一',
      },
      {
        pattern: 'switch',
        cells: ['不适用', '立即生效', '「这个功能开/关」', '设置里的功能开关'],
        verdict: '开关一个状态',
      },
    ],
    decision: [
      { if: '可以同时选多个', then: 'Checkbox' },
      { if: '只能选一个，且要看到所有选项', then: 'Radio' },
      { if: '是「开/关」这个功能状态', then: 'Switch' },
      { if: '选了之后要「下一步做什么」', then: '那其实是个 Button，不是选择控件' },
    ],
    takeaway:
      'Radio 和 Switch 都长得像圆点/拨块，但一个是「一次性选择」，一个是「持续状态」。Checkbox 是「收集若干项」。选之前问自己：这个状态是「选一下」还是「一直开着」？',
    relatedComparisons: ['tabs-vs-segmented-control', 'toast-vs-snackbar-vs-alert'],
  },
  {
    slug: 'spinner-vs-progress-bar-vs-skeleton',
    title: 'Spinner vs Progress Bar vs Skeleton',
    subtitle: '「加载中」的三种表达',
    question: '数据在加载，我该怎么表示？',
    patterns: ['spinner', 'progress-bar', 'skeleton'],
    columns: [
      { key: 'progress', label: '能否量化' },
      { key: 'structure', label: '预览结构' },
      { key: 'time', label: '适合等待' },
      { key: 'use', label: '典型场景' },
    ],
    rows: [
      {
        pattern: 'spinner',
        cells: ['否', false, '短（<1s）', '按钮内、小部件'],
        verdict: '短等待的默认选择',
      },
      {
        pattern: 'progress-bar',
        cells: ['是（百分比）', false, '长且知道总量', '上传、下载、安装'],
        verdict: '知道要多久/多少',
      },
      {
        pattern: 'skeleton',
        cells: ['否（但暗示结构）', true, '中长（首次加载）', '列表、卡片、页面首屏'],
        verdict: '首次加载整个页面',
      },
    ],
    decision: [
      { if: '等待很短（点一下就回来）', then: 'Spinner 或甚至不加' },
      { if: '知道确切进度（上传到 40%）', then: 'Progress Bar' },
      { if: '在加载一个有固定结构的页面/列表', then: 'Skeleton' },
      { if: '等待可能超过 10 秒', then: '超过就加文案提示和「重试」' },
    ],
    takeaway:
      'Skeleton 的最大优势是「在等的时候已经在告诉用户页面长什么样」，感知等待会变短。但记住加一个「最短显示 300ms」，否则数据秒回时 Skeleton 一闪而过反而更糟。',
    relatedComparisons: ['toast-vs-snackbar-vs-alert', 'pagination-vs-infinite-scroll'],
  },
  {
    slug: 'tooltip-vs-popover',
    title: 'Tooltip vs Popover',
    subtitle: '「旁边弹个小东西」的两种',
    question: '我需要一个从某处浮出来的小浮层，用哪个？',
    patterns: ['tooltip', 'popover'],
    columns: [
      { key: 'trigger', label: '触发方式' },
      { key: 'content', label: '能放什么' },
      { key: 'interactive', label: '能点' },
      { key: 'use', label: '典型场景' },
    ],
    rows: [
      {
        pattern: 'tooltip',
        cells: ['悬停 / focus', '只有文字', '不能', '解释图标、缩写'],
        verdict: '「这玩意是干嘛的」',
      },
      {
        pattern: 'popover',
        cells: ['点击', '菜单、表单、任意内容', '能', '操作面板、选择器'],
        verdict: '「从这里选一个 / 填一下」',
      },
    ],
    decision: [
      { if: '只是想告诉用户这个名字/含义', then: 'Tooltip' },
      { if: '浮层里要能点、能选、能填', then: 'Popover' },
      { if: '移动端为主要平台', then: '别依赖 Tooltip（触屏难触发），用可见文字' },
    ],
    takeaway:
      '一句话区分：Tooltip 只能「看」，Popover 能「用」。如果你的浮层里出现任何可点的东西，那就不是 Tooltip。',
    relatedComparisons: ['dialog-vs-bottom-sheet-vs-drawer', 'button-vs-cta'],
  },
  {
    slug: 'pagination-vs-infinite-scroll',
    title: 'Pagination vs Infinite Scroll',
    subtitle: '「看不到尽头」还是「能翻回去」',
    question: '我的列表很长，该分页还是无限滚动？',
    patterns: ['pagination', 'infinite-scroll'],
    columns: [
      { key: 'control', label: '用户控制' },
      { key: 'locate', label: '能定位/分享' },
      { key: 'seo', label: 'SEO 友好' },
      { key: 'use', label: '典型场景' },
    ],
    rows: [
      {
        pattern: 'pagination',
        cells: ['是（主动翻页）', '能（?page=2）', '是', '搜索结果、订单、后台'],
        verdict: '需要能回去找的东西',
      },
      {
        pattern: 'infinite-scroll',
        cells: ['否（自动加载）', '不能', '差', '社交流、灵感、资讯'],
        verdict: '随便刷刷的探索型内容',
      },
    ],
    decision: [
      { if: '用户会想回到「第 N 页」或分享某一页', then: 'Pagination' },
      { if: '内容是「随便刷」没有终点（社交、灵感）', then: 'Infinite Scroll' },
      { if: '既想无限浏览又不想失去返回', then: 'Load More 按钮是中间解' },
    ],
    takeaway:
      '无限滚动不是「更高级的」分页，它是用「找不到位置」和「返回键失效」换来的连续感。内容有结构、要定位，就老老实实分页。',
    relatedComparisons: ['spinner-vs-progress-bar-vs-skeleton', 'tabs-vs-segmented-control'],
  },
  {
    slug: 'button-vs-cta',
    title: 'Button vs CTA',
    subtitle: '它们不是「两种按钮」',
    question: '我要加一个按钮，用普通 Button 还是 CTA？',
    patterns: ['button', 'cta'],
    columns: [
      { key: 'count', label: '一页有几个' },
      { key: 'role', label: '角色' },
      { key: 'visual', label: '视觉' },
      { key: 'use', label: '典型场景' },
    ],
    rows: [
      {
        pattern: 'button',
        cells: ['可以有很多', '触发一个动作', '常规大小', '保存、取消、删除、编辑'],
        verdict: '所有可点的统称',
      },
      {
        pattern: 'cta',
        cells: ['最多 1 个', '页面唯一的「下一步」', '更大/更显眼', '注册页、落地页、空状态'],
        verdict: '整页最重要的那个',
      },
    ],
    decision: [
      { if: '页面上有一件「用户最该做的事」', then: '把它做成 CTA（唯一、最显眼）' },
      { if: '只是普通操作', then: 'Button（可以有多个同样重）' },
      { if: '你发现页面上有 3 个「都最重要」的 CTA', then: '重新想清楚这页到底要用户做什么' },
    ],
    takeaway:
      'CTA 是一个角色而不是一种外观。一个页面可以有很多 Button，但只能有一个「你希望用户做的事」。视觉权重一旦平均，重点就消失了。',
    relatedComparisons: ['tabs-vs-segmented-control', 'checkbox-vs-radio-vs-switch'],
  },
];

export const comparisonMap: Record<string, Comparison> = Object.fromEntries(
  comparisons.map((c) => [c.slug, c])
);

export function getComparison(slug: string): Comparison | undefined {
  return comparisonMap[slug];
}

export const allComparisonSlugs = comparisons.map((c) => c.slug);
