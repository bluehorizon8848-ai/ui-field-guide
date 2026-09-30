import type { UIPattern } from '../types';

export const actionPatterns: UIPattern[] = [
  {
    id: 'button',
    name: 'Button',
    chineseName: '按钮',
    aliases: ['按钮', 'button', '普通按钮', 'push button', 'btn'],
    category: 'actions',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['create', 'confirm'],
    oneLine: '界面上最基础的可点击元素——用户一点，就会发生一件事。',
    description:
      'Button 是所有操作的起点。它本身没有特殊的视觉身份：可以有各种颜色和尺寸，但它永远是那个「按下去会触发某个动作」的东西。',
    looksLike:
      '登录页的「登录」、设置页的「保存」、对话框底部的「取消 / 确定」——这些触发具体动作的元素都是 Button。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '触发一个明确的动作（提交、删除、保存）', recommended: true },
      { situation: '动作是当前页面的下一步', recommended: true },
      { situation: '需要区分主次：Primary + Secondary', recommended: true },
      { situation: '只是导航到另一个页面且没有语义', recommended: 'mostly' },
      { situation: '一个页面里超过 3 个同权重主按钮', recommended: false },
    ],
    whenNotToUse: [
      '在页面顶部放一排文字链却都长得像按钮，会让主次消失。',
      '按钮文案用「确定」会让用户不安——写「删除照片」比「确定」友好得多。',
    ],
    anatomy: [
      { label: 'Container', labelZh: '容器', note: '最小热区 44×44px，圆角 8px' },
      { label: 'Label', labelZh: '文字', note: '动词开头，说明结果' },
      { label: 'Leading Icon', labelZh: '前置图标', note: '可选，仅在提升识别度时加' },
      { label: 'Loading State', labelZh: '加载态', note: '禁用点击并显示 spinner' },
      { label: 'Disabled State', labelZh: '禁用态', note: '降低对比但仍可读' },
    ],
    similarPatterns: ['cta', 'icon-button', 'fab', 'split-button'],
    compareWith: 'cta',
    aiPrompt: {
      basic: '加一个保存按钮。',
      detailed:
        '在编辑页底部加一组按钮：左侧次要按钮「取消」，右侧主按钮「保存」。保存中显示 loading 并禁用。',
      implementation:
        '两个 <button>，右侧为 Primary（背景 #1A1917，白色文字，圆角 8px，内边距 10px 20px，最小高度 44px），左侧为 Secondary（白底 + 1px 边框 #E6E3DB）。点击保存后：disabled=true、显示 16px spinner、aria-busy=true，成功后 600ms 内恢复。hover 时背景加深到 #35322C。焦点态用 2px outline + 2px offset。文案用动词，不用「确定」。',
    },
    badPrompt: '加个按钮。',
    betterPrompt:
      '加一组按钮：主按钮「保存照片」（深色实心）和次按钮「取消」（白底描边），主按钮点击后显示 loading 并禁用。',
    fitsFor: '提交 · 保存 · 删除 · 确认',
    tags: ['主操作', '动词', '热区'],
    comparisonSlug: 'button-vs-cta',
  },
  {
    id: 'cta',
    name: 'CTA',
    chineseName: '行动号召按钮',
    aliases: ['CTA 按钮', '行动召唤', 'call to action', '转化按钮', '主按钮', 'primary button'],
    category: 'actions',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['create', 'confirm'],
    oneLine: '整个页面里最重要的那一个按钮——它就是希望用户接下来要做的事。',
    description:
      'CTA 不是「长得不一样的按钮」，它是一个角色：当前页面的唯一主操作。次要按钮可以有五个，CTA 只能有一个。判断标准很简单——去掉它，用户还能不能完成任务？',
    looksLike:
      '注册页那个占满宽度的「免费开始使用」、落地页右上角高亮的「立即购买」——它们之所以显眼，是因为整页只有它在推动转化。',
    platforms: ['web', 'mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '页面有一个明确的、最希望用户完成的动作', recommended: true },
      { situation: '落地页 / 注册页 / 空状态页', recommended: true },
      { situation: '需要用视觉权重引导下一步', recommended: true },
      { situation: '页面里同时存在多个同等重要的主操作', recommended: false },
    ],
    whenNotToUse: [
      '把每个按钮都做成 CTA 等于没有 CTA——视觉权重一旦平均，重点就消失了。',
      '高频使用的工作台界面里，强行放 CTA 只会干扰。',
    ],
    anatomy: [
      { label: 'Container', labelZh: '容器', note: '更大内边距，通常通栏或显著加宽' },
      { label: 'Value Label', labelZh: '价值文案', note: '写收益不写功能：「免费开始」优于「注册」' },
      { label: 'Visual Weight', labelZh: '视觉权重', note: '页面上唯一的实心高亮按钮' },
      { label: 'Optional Hint', labelZh: '辅助说明', note: '按钮下方一行小字降低顾虑' },
    ],
    similarPatterns: ['button', 'fab', 'empty-state'],
    compareWith: 'button',
    aiPrompt: {
      basic: '加个明显的按钮。',
      detailed:
        '在注册页加一个通栏主 CTA「免费开始使用」，深色实心，通栏宽度，下方加一行小字「无需信用卡」。',
      implementation:
        'button 宽度 100%，高度 52px，背景 #1A1917，文字 17px medium，圆角 8px，hover 加深到 #35322C。它是页面上唯一的高实心按钮，次要链接（已有账号？登录）降级为文字按钮。按钮下方 8px 处放 13px 灰色说明文字。移动端保证底部安全区 padding-bottom: env(safe-area-inset-bottom)。',
    },
    badPrompt: '帮我加个按钮让用户点。',
    betterPrompt:
      '在注册页加唯一主 CTA：通栏、深色实心、文案「免费开始使用」（写收益不写功能），下方加 13px 灰字「无需信用卡」。',
    fitsFor: '落地页 · 注册 · 空状态引导',
    tags: ['主操作', '转化', '唯一'],
    comparisonSlug: 'button-vs-cta',
  },
  {
    id: 'icon-button',
    name: 'Icon Button',
    chineseName: '图标按钮',
    aliases: ['图标按钮', 'icon button', '纯图标按钮', 'symbol button'],
    category: 'actions',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['create'],
    oneLine: '只有一个图标、没有文字的按钮，必须配 Tooltip 才有意义。',
    description:
      'Icon Button 用空间换清晰度：它能塞进工具栏，但用户必须已经知道这个图标代表什么。所以它的存在前提是——图标足够通用，或者有 Tooltip 兜底。',
    looksLike:
      '编辑器右上角那一排小图标（加粗、斜体、对齐）、图片右下角的心形和下载键、聊天列表每行的删除叉——都是 Icon Button。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '工具栏里需要放很多个操作', recommended: true },
      { situation: '图标是业界通用符号（搜索、关闭、分享）', recommended: true },
      { situation: '空间极紧（如卡片右上角）', recommended: true },
      { situation: '首次出现的功能、图标含义不直观', recommended: false },
      { situation: '这是页面的主操作', recommended: false },
    ],
    whenNotToUse: [
      '一个需要被「发现」的功能（比如「导出」）不该只用图标——用户得先猜出图标含义。',
      '在中文界面里用单字汉字做图标可读性极差。',
    ],
    anatomy: [
      { label: 'Hit Area', labelZh: '热区', note: '视觉 32px，热区扩到 44×44px' },
      { label: 'Icon', labelZh: '图标', note: '20–24px，线宽 1.75px 保持一致' },
      { label: 'Tooltip', labelZh: '悬停提示', note: '必填，或加 aria-label' },
      { label: 'States', labelZh: '状态', note: 'hover / active / disabled 三态' },
    ],
    similarPatterns: ['button', 'fab', 'tooltip', 'badge'],
    compareWith: 'button',
    aiPrompt: {
      basic: '加个图标按钮。',
      detailed:
        '在编辑器工具栏右侧加一组 Icon Button：加粗 / 斜体 / 删除。删除用 danger 红色，悬停显示 Tooltip。',
      implementation:
        'button 内放 20px 图标（lucide），无文字。视觉尺寸 32×32px，但用伪元素把热区扩到 44×44px（::after absolute inset:-6px）。每个按钮加 aria-label="加粗" 和 Tooltip（悬停 400ms 出现、鼠标移开即消失、支持 Esc 关闭）。danger 按钮 hover 变 #A8342C。工具栏项之间用 4px 间隔，整组加 role="toolbar"。',
    },
    badPrompt: '加几个小图标可以点。',
    betterPrompt:
      '加一组 Icon Button（20px 图标、热区 44×44px），每个都有 aria-label 和悬停 Tooltip，删除用 danger 红色，整组包在 role="toolbar" 里。',
    fitsFor: '工具栏 · 卡片操作 · 通用符号',
    tags: ['工具栏', '热区', 'Tooltip'],
  },
  {
    id: 'fab',
    name: 'FAB',
    chineseName: '浮动操作按钮',
    aliases: ['悬浮按钮', '浮动按钮', 'FAB', 'floating action button', '悬浮操作'],
    category: 'actions',
    level: 2,
    appearance: ['always', 'on-scroll'],
    position: ['floating'],
    job: ['create'],
    oneLine: '一直浮在屏幕角落的那个圆形按钮，通常承载「新建」这个动作。',
    description:
      'FAB 的设计意图是「拇指随时可及的快捷入口」。它出现在 App 的右下角，好处是跳出层级、随时可用，代价是遮挡内容和持续占用视觉注意力。',
    looksLike:
      'Google Material 系应用右下角那个圆形带加号的按钮、小红书右下角的「+」发布按钮、备忘录右下角的铅笔——都是 FAB。',
    platforms: ['mobile', 'web'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '移动端有一个高频主操作（新建 / 拍摄 / 记一笔）', recommended: true },
      { situation: '该操作在多层页面下都应该可达', recommended: true },
      { situation: '页面是长列表滚动型', recommended: true },
      { situation: '工具栏里已经有一个主按钮', recommended: false },
      { situation: '主操作会遮挡底部关键内容', recommended: false },
    ],
    whenNotToUse: [
      '在 5 个以内的 Tab 布局里再加 FAB 会造成重复——「新建」通常该在 Bottom Navigation 里。',
      '它总是浮在最上层，位置太靠下会挡住底部列表的最后一行。',
    ],
    anatomy: [
      { label: 'Surface', labelZh: '圆形底', note: '56×56px，阴影提升悬浮感' },
      { label: 'Icon', labelZh: '图标', note: '24px，居中' },
      { label: 'Position', labelZh: '位置', note: '右下 16px + 安全区' },
      { label: 'Extended', labelZh: '展开态', note: '带文字的 Extended FAB' },
    ],
    similarPatterns: ['button', 'bottom-navigation', 'cta', 'drawer'],
    compareWith: 'bottom-navigation',
    aiPrompt: {
      basic: '右下角加个悬浮按钮。',
      detailed:
        '在移动端页面右下角加一个 FAB，圆形带加号图标，点击新建内容；滚动列表时保持固定，不随内容滚走。',
      implementation:
        'button position: fixed; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); width/height 56px; border-radius: 9999px; background #1A1917; box-shadow 0 4px 12px rgba(0,0,0,0.2); z-index 40。放 24px Plus 图标，aria-label="新建"。hover/active 用 scale(0.96)。若页面有底部导航，bottom 改为 导航高度 + 16px。滚动到底时保持可见（不做隐藏），避免用户找不到入口。',
    },
    badPrompt: '右下角放个加号。',
    betterPrompt:
      '在移动端右下角加 FAB：56px 圆形、深色实心、Plus 图标、shadow 提升，aria-label="新建"，bottom 需加上底部导航高度与安全区。',
    fitsFor: '新建 · 拍摄 · 快速记录',
    tags: ['悬浮', '主操作', '拇指区'],
  },
  {
    id: 'split-button',
    name: 'Split Button',
    chineseName: '分裂按钮',
    aliases: ['分裂按钮', 'split button', '主从按钮', '组合按钮', 'dropdown button combo'],
    category: 'actions',
    level: 3,
    appearance: ['always'],
    position: ['inline'],
    job: ['create', 'select'],
    oneLine: '左边是默认动作、右边是下拉箭头，点右边能看到同一动作的其他选项。',
    description:
      'Split Button 解决「默认动作 + 变体」这个具体问题：用户 90% 的时间点左边，10% 的时候点右边选变体。它比「一个按钮 + 旁边一个下拉」更紧凑，也比纯下拉更快。',
    looksLike:
      'Word 里的「粘贴 ▼」——点左边直接粘贴默认格式，点右边可以选择「保留源格式 / 只保留文本」。',
    platforms: ['web', 'desktop'],
    difficulty: 'hard',
    whenToUse: [
      { situation: '有一个默认动作，且存在 2–4 个常用变体', recommended: true },
      { situation: '默认动作使用率远高于变体', recommended: true },
      { situation: '工具栏空间紧张但又需要暴露变体', recommended: true },
      { situation: '所有选项使用率相当', recommended: false },
    ],
    whenNotToUse: [
      '变体超过 5 个时，右侧应该换成独立的 Menu 按钮。',
      '在移动端手指精度低，34px 宽的箭头区很难点中。',
    ],
    anatomy: [
      { label: 'Main Action', labelZh: '主动作区', note: '左侧，占约 70% 宽度' },
      { label: 'Divider', labelZh: '分隔线', note: '1px，与按钮同色或半透明' },
      { label: 'Toggle Zone', labelZh: '下拉触发区', note: '右侧，带 ChevronDown' },
      { label: 'Menu', labelZh: '弹出菜单', note: '点击后向下展开' },
    ],
    similarPatterns: ['select', 'button'],
    compareWith: 'button',
    aiPrompt: {
      basic: '按钮右边加个下拉箭头。',
      detailed:
        '做一个 Split Button：主区「粘贴」，右侧箭头展开菜单，含「保留源格式 / 只保留文本 / 纯文本」三项。',
      implementation:
        '外层 flex 容器包两个 button：主区 padding 8px 16px，箭头区 padding 8px 10px 且左边加 1px 分隔线。两个 button 共享 border-radius：主区左侧圆角、箭头区右侧圆角，外观连成一体。箭头区加 aria-haspopup="menu" + aria-expanded。菜单用 Popover 定位到按钮下方，Esc 关闭，点击外部关闭，方向键可在项间移动。当前项加 Check 图标。',
    },
    badPrompt: '按钮带个小箭头可以展开。',
    betterPrompt:
      '做 Split Button：左侧主动作「粘贴」，右侧 1px 分隔的箭头区（aria-haspopup="menu"）展开变体菜单，两区圆角拼成一个整体。',
    fitsFor: '工具栏 · 默认动作 + 变体',
    tags: ['工具栏', '主从', '变体'],
  },
  {
    id: 'destructive-action',
    name: 'Destructive Action',
    chineseName: '破坏性操作',
    aliases: ['危险操作', '删除操作', 'destructive action', '危险按钮', '二次确认'],
    category: 'actions',
    level: 3,
    appearance: ['on-click'],
    position: ['inline'],
    job: ['confirm', 'create'],
    oneLine: '一旦执行就难以撤销的操作——删除、清除、注销。它的按钮必须是红色的。',
    description:
      'Destructive Action 是设计模式而不是单一组件。它由三部分组成：视觉降级（平时不显眼）、触发时的确认（Dialog 二次确认）、提供退路（删除后给 Undo 机会）。',
    looksLike:
      '相册里的「删除照片」、设置最底部红色的「清除所有数据」、聊天列表左滑出现的「删除」——它们共同点是：都需要一次确认。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '操作不可撤销或撤销成本高', recommended: true },
      { situation: '误触代价大（删数据、注销、退款）', recommended: true },
      { situation: '危险按钮在页面中低频出现', recommended: true },
      { situation: '操作频繁且容易恢复（拖动排序、清空输入框）', recommended: false },
      { situation: '批量删除 100 张照片', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '每个危险操作都弹确认框会训练出「闭眼点确定」的习惯，反而降低安全性。',
      '真正的解法往往是提供 Undo，而不是拦住用户。',
    ],
    anatomy: [
      { label: 'De-emphasized', labelZh: '常态低调', note: '红色文字按钮，不抢视觉' },
      { label: 'Confirm Dialog', labelZh: '二次确认', note: '写明后果，不写「确定吗」' },
      { label: 'Impact Text', labelZh: '后果说明', note: '「将删除 12 张照片，无法恢复」' },
      { label: 'Undo Escape', labelZh: '撤销退路', note: '删除后 Snackbar 提供撤销' },
    ],
    similarPatterns: ['modal', 'button', 'snackbar', 'alert'],
    compareWith: 'button',
    aiPrompt: {
      basic: '加个删除按钮。',
      detailed:
        '加一个破坏性删除操作：常态是红色文字按钮，点击后弹 Dialog 二次确认，说明会删掉多少项；删除完成后用 Snackbar 提供「撤销」。',
      implementation:
        '常态：红色文字按钮 #A8342C，无边框，hover 加浅红背景 #FAEDEC。点击后打开 Dialog：标题「删除 12 张照片？」，正文「这些照片会移到最近删除，30 天后自动清除。」，按钮为「取消」(Secondary) + 「删除」(danger 红色实心)。执行后立即关闭 Dialog 并弹出 Snackbar「已删除 12 张照片」+「撤销」按钮，5 秒后自动消失，撤销则恢复数据。批量删除时不弹逐项确认，只在操作前提示一次。',
    },
    badPrompt: '加个红色的删除按钮。',
    betterPrompt:
        '危险操作用三件套：常态红色文字按钮（不抢视觉）→ 点击弹 Dialog 二次确认并写明后果（不是「确定吗」）→ 完成后 Snackbar 提供撤销。',
    fitsFor: '删除 · 清除 · 注销',
    tags: ['风险', '二次确认', '撤销'],
  },
];
