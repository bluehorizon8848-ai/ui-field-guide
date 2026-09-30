import type { UIPattern } from '../types';

export const generalPatterns: UIPattern[] = [
  {
    id: 'modal-stateful',
    name: 'Confirmation Dialog',
    chineseName: '二次确认框',
    aliases: ['确认框', 'confirmation dialog', '二次确认', '确认弹窗', 'confirm dialog', 'are you sure'],
    category: 'containers',
    level: 2,
    appearance: ['on-click'],
    position: ['center'],
    job: ['confirm'],
    oneLine: '在执行一个可能后悔的操作之前，弹窗问一句「你确定吗」。',
    description:
      '二次确认的价值不在于「拦截」，而在于「让用户看清后果」。好的确认框会写明具体影响（会删掉什么、无法恢复），而不是干巴巴地问「确定吗？」——后者训练出的是条件反射式的乱点。',
    looksLike:
      '点「删除照片」后弹出「删除 3 张照片？这些照片将移到最近删除，30 天后自动清除。」下面两个按钮：取消 / 删除。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '操作不可撤销且影响大', recommended: true },
      { situation: '误触代价高（删数据、注销、付费）', recommended: true },
      { situation: '同时提供 Snackbar 撤销作为替代', recommended: true },
      { situation: '操作频繁且容易恢复（清空输入框）', recommended: false },
      { situation: '可以改成 Undo 就不必拦（删除）', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '每个操作都弹确认框，用户会养成「看到弹窗就点第一个按钮」的习惯。',
      '如果能提供 Undo 退路，就别拦——让用户敢做，快速做事，然后给他反悔的机会。',
    ],
    anatomy: [
      { label: 'Title', labelZh: '标题', note: '写明后果，不写「提示」' },
      { label: 'Impact', labelZh: '影响说明', note: '「将删除 3 张照片」' },
      { label: 'Cancel', labelZh: '取消', note: '默认焦点' },
      { label: 'Confirm', labelZh: '确认', note: '动词 + 危险色' },
    ],
    similarPatterns: ['destructive-action', 'modal', 'snackbar', 'alert'],
    compareWith: 'destructive-action',
    aiPrompt: {
      basic: '删除前弹个确认。',
      detailed:
        '删除 3 张照片前弹确认框：标题「删除 3 张照片？」，正文「这些照片将移到最近删除，30 天后自动清除。」，取消为默认焦点，确认按钮红色。',
      implementation:
        'role="alertdialog" aria-modal。打开时 focus 默认放在「取消」上（安全默认，Esc 也等于取消）。确认按钮文案用动词「删除」而非「确定」，配色用 danger 红。确认执行后立即关闭并弹 Snackbar 提供撤销。窗口内避免 Esc 直接执行危险操作。批量操作时不逐项确认，改在操作前提示总量。',
    },
    badPrompt: '删除前弹个确认框。',
    betterPrompt:
      '删除前弹 alertdialog：标题写明后果「删除 3 张照片？」而非「确定吗」，默认焦点放「取消」，确认按钮用红色动词「删除」，执行后用 Snackbar 给撤销机会。',
    fitsFor: '删除 · 注销 · 付费 · 清空',
    tags: ['确认', '后果', '安全默认'],
  },
  {
    id: 'load-more',
    name: 'Load More',
    chineseName: '加载更多',
    aliases: ['加载更多', 'load more', '查看更多', '更多按钮', 'show more', '分页按钮'],
    category: 'navigation',
    level: 2,
    appearance: ['on-click'],
    position: ['bottom'],
    job: ['navigate'],
    oneLine: '在列表底部放一个「加载更多」按钮，点一下追加一批内容。',
    description:
      'Load More 是分页和无限滚动之间的折中：它保留了用户的控制权（不会被强制打断），又不打断浏览（不会跳到新页面）。缺点是用户可能永远不点它。',
    looksLike:
      '文章底部那个「阅读全文」按钮、评论区的「查看更多回复」、搜索结果底部的「加载更多结果」。',
    platforms: ['web', 'mobile'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '内容较长但不需跳页', recommended: true },
      { situation: '需要避免无限滚动的打断', recommended: true },
      { situation: '用户要自己控制加载节奏', recommended: true },
      { situation: '内容是线性阅读（文章、评论）', recommended: true },
      { situation: '数据量很大且需要定位到某页', recommended: false },
    ],
    whenNotToUse: [
      '内容很多时，「加载更多」可能永远不被点——那时不如直接无限滚动。',
      '加载后要保持滚动位置不跳动，否则用户会迷失。',
    ],
    anatomy: [
      { label: 'Trigger', labelZh: '触发按钮', note: '文字按钮，居中或通栏' },
      { label: 'Loading', labelZh: '加载态', note: '按钮内转圈' },
      { label: 'Append', labelZh: '追加', note: '内容接在末尾' },
      { label: 'End Note', labelZh: '到底提示', note: '「没有更多了」' },
    ],
    similarPatterns: ['pagination', 'infinite-scroll', 'button'],
    compareWith: 'infinite-scroll',
    aiPrompt: {
      basic: '列表下面加个加载更多。',
      detailed:
        '在列表底部加「加载更多」按钮：点击后按钮显示 loading 并禁用，追加 20 条内容，加载完滚动位置不跳动，加载完全部后显示「已经到底了」。',
      implementation:
        '按钮 loading 时加 loadingLock 防重复点击。加载后不改变页面高度导致的内容位置（因为是追加到末尾，之前的元素位置不变，但要确保 append 前后的滚动锚点不变）。加载完全部内容后把按钮替换为「没有更多了」的灰色文字。首次加载用 Skeleton 而非空列表。',
    },
    badPrompt: '底部加个加载更多的按钮。',
    betterPrompt:
      '列表底部加「加载更多」按钮：点击后 loading + 锁定防重复点击、追加内容且保持滚动位置不跳动、全部加载完时替换为「已经到底了」，首次加载用 Skeleton。',
    fitsFor: '文章 · 评论 · 长列表',
    tags: ['按需加载', '用户控制', '追加'],
  },
  {
    id: 'segmented-control',
    name: 'Segmented Control',
    chineseName: '分段控件',
    aliases: ['分段控件', 'segmented control', '分段按钮', '按钮组', 'segmented', '切换按钮组'],
    category: 'input',
    level: 2,
    appearance: ['always'],
    position: ['inline'],
    job: ['select'],
    oneLine: '一排挤在一起的小按钮，选中其中一个，像被「分段」了一样。',
    description:
      'Segmented Control 是一个紧凑的按钮组，选中项有填充色高亮。它的关键是：它和 Tabs 长得很像，但 Segmented 切换的是「同一块内容的小视图」，而不是「不同的页面」。',
    looksLike:
      'iOS 照片查看器底部的「日 / 周 / 月」、Mac 的合成分段按钮、地图App 的「列表 / 地图」切换。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '2–4 个视图之间的切换', recommended: true },
      { situation: '所有选项都很短（1–4 个字）', recommended: true },
      { situation: '希望控件宽度跟着内容而不是通栏', recommended: true },
      { situation: '每个选项需要一个独立 URL', recommended: false },
      { situation: '选项文字长短差异很大', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '如果每个视图要能单独分享/收藏（要有各自 URL），用 Tabs。',
      '文字长短不一会让分段宽度很怪——要么统一用图标，要么改用 Select。',
    ],
    anatomy: [
      { label: 'Track', labelZh: '外框', note: '浅灰底，包住所有分段' },
      { label: 'Segment', labelZh: '分段', note: '等分或按内容宽度' },
      { label: 'Selected', labelZh: '选中', note: '白色填充 + 阴影' },
      { label: 'Label', labelZh: '文字', note: '1–4 字最佳' },
    ],
    similarPatterns: ['tabs', 'radio', 'select', 'stepper'],
    compareWith: 'tabs',
    aiPrompt: {
      basic: '加一个可以切换的分段按钮。',
      detailed:
        '加一个 Segmented Control：日 / 周 / 月 三段，选中项白色填充并带轻微阴影，切换只影响同一块区域，不改 URL。',
      implementation:
        '外层 div 浅灰底 #F2F0EB 圆角 8px padding 3px，内含若干 button flex: 1。选中项白底 + box-shadow 0 1px 3px rgba(0,0,0,0.1) + 轻微放大。用 role="tablist" + role="tab" + aria-selected，或用 radio group 语义（若本质是选项）。切换动画：白色滑块用 transform 平移而非直接切换会更顺滑。',
    },
    badPrompt: '加几个按钮可以切换。',
    betterPrompt:
      '加 Segmented Control：浅灰外框内含 2–4 段，选中项白底加阴影，滑块用 transform 平移动画，用 role=tablist/tab + aria-selected 表达，不改变 URL。',
    fitsFor: '视图切换 · 时间范围 · 模式',
    tags: ['紧凑', '视图', '同页'],
    comparisonSlug: 'tabs-vs-segmented-control',
  },
  {
    id: 'stepper-input',
    name: 'Number Stepper',
    chineseName: '数字微调器',
    aliases: ['数字步进', 'number stepper', '数量选择器', '加减器', 'counter', '计数器'],
    category: 'input',
    level: 3,
    appearance: ['always'],
    position: ['inline'],
    job: ['input', 'select'],
    oneLine: '一个数字加减的控件，左右是两个按钮，中间是当前数量。',
    description:
      'Number Stepper 解决的是「小幅调整」：购物车数量 1→2→3。它和 Slider 的区别在于——Stepper 适合离散小步长且要精确，Slider 适合连续大幅调整。',
    looksLike:
      '购物车每行「− 1 +」的那个控件、外卖订单「份数」的加减。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '在小的整数范围内增减', recommended: true },
      { situation: '需要精确的数值（不能靠拖）', recommended: true },
      { situation: '数量有最小/最大值限制', recommended: true },
      { situation: '需要在大范围内调整', recommended: false },
      { situation: '需要连续的小数精度', recommended: false },
    ],
    whenNotToUse: [
      '减到 0 时要明确是「删除该行」还是「不可再减」。',
      '最小值和最大值应该在到达时禁用对应按钮，给出视觉反馈。',
    ],
    anatomy: [
      { label: 'Decrement', labelZh: '减号', note: '到最小值时禁用' },
      { label: 'Value', labelZh: '数值', note: '居中，可编辑' },
      { label: 'Increment', labelZh: '加号', note: '到最大值时禁用' },
      { label: 'Bounds', labelZh: '上下限', note: '受 min/max 限制' },
    ],
    similarPatterns: ['slider', 'select', 'button', 'pagination'],
    compareWith: 'slider',
    aiPrompt: {
      basic: '加个加减数量的控件。',
      detailed:
        '加一个数量选择器：左右加减按钮，中间显示数字，范围 1–99，减到 1 时减号禁用，加到 99 时加号禁用，中间数字可直接输入。',
      implementation:
        'flex 容器，左右两个 icon button（32×32），中间 input 只读或可输入。value 用 useState 管理，onClick 时 clamp 到 [min, max]。到达边界时按钮 disabled + 40% 透明度 + cursor: not-allowed。加减按钮热区至少 32×32（移动端建议 44×44）。数字用 tabular-nums 防跳动。',
    },
    badPrompt: '加个可以加减数字的。',
    betterPrompt:
      '加 Number Stepper：左右加减 icon button + 中间数字，值 clamp 到 [min,max]，到达边界时对应按钮禁用并降透明度，热区 ≥44×44，数字用 tabular-nums 防跳动。',
    fitsFor: '购物车 · 份数 · 数量',
    tags: ['小步长', '精确', '边界'],
  },
];
