import type { UIPattern } from '../types';

export const containerPatterns: UIPattern[] = [
  {
    id: 'card',
    name: 'Card',
    chineseName: '卡片',
    aliases: ['卡片', 'card', '内容卡片', 'tile', '卡片容器'],
    category: 'containers',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['inform'],
    oneLine: '一个带圆角和边框的容器，把一条相关内容装在一起。',
    description:
      'Card 是最通用的布局单元。它本身不规定里面有什么——图片、标题、描述、按钮都行。它的价值是把一堆散落的信息切成可点击、可独立理解的块。',
    looksLike:
      'App 首页的一格格内容块、新闻网站的文章卡片、设置里每个功能一行的那种方块、搜索结果里的每一条。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '一组内容可以被独立点击或独立理解', recommended: true },
      { situation: '需要明显的点击边界（整卡可点）', recommended: true },
      { situation: '网格布局中的重复单元', recommended: true },
      { situation: '内容很短、只有一行文字', recommended: false },
      { situation: '把卡片再套卡片', recommended: false },
    ],
    whenNotToUse: [
      '卡片里再放卡片、按钮里再放按钮，是层级混乱的典型信号。',
      '如果只是分个组，Divider 就够了，不必每组都起一个盒子。',
    ],
    anatomy: [
      { label: 'Surface', labelZh: '卡片面', note: '白底 + 1px 边框 + 极轻阴影' },
      { label: 'Media', labelZh: '图片区', note: '可选，16:9 或 1:1' },
      { label: 'Title', labelZh: '标题', note: '2 行截断' },
      { label: 'Description', labelZh: '描述', note: '1–2 行，次级色' },
      { label: 'Action', labelZh: '操作区', note: '底部或整卡可点' },
    ],
    similarPatterns: ['list', 'stat-card'],
    compareWith: 'list',
    aiPrompt: {
      basic: '加几个卡片。',
      detailed:
        '加一个内容卡片列表：每张卡片有 16:9 封面、标题、描述和「查看详情」链接，整卡可点，悬停时轻微上移。',
      implementation:
        '<article> 作为容器，白底、1px #E6E3DB 边框、圆角 10px、overflow hidden。封面 aspect-ratio: 16/9 + object-fit: cover。标题 16px medium、line-clamp: 2。描述 14px #7A766D、line-clamp: 2。整卡可点：卡片本身是 <a> 或带 onClick 且 tabIndex=0 + Enter 键响应，内部不再放 <a>（避免嵌套交互元素）。hover: translateY(-2px) + shadow 提升。',
    },
    badPrompt: '加几个方块显示内容。',
    betterPrompt:
      '加卡片列表：白底 1px 边框圆角 10px，16:9 封面 + 标题(2 行截断) + 描述，整卡可点（内部不再嵌套链接），hover 上移 2px 并提升阴影。',
    fitsFor: '内容流 · 搜索结果 · 功能入口',
    tags: ['容器', '可点', '网格'],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    chineseName: '手风琴 / 折叠面板',
    aliases: ['手风琴', '折叠面板', 'accordion', '折叠菜单', 'expandable', '折叠列表'],
    category: 'containers',
    level: 1,
    appearance: ['on-click'],
    position: ['inline'],
    job: ['expand'],
    oneLine: '点一下标题，下面的内容就展开；再点一下，收起来。',
    description:
      'Accordion 的用途是「把很多信息压缩到更小的空间里」。它可以同时展开多个，也可以一次只开一个（后者严格说更接近 Collapsible）。经典场景是 FAQ。',
    looksLike:
      'FAQ 页面的问答列表、设置页的「关于本机 ›」分组、帮助中心的折叠条目——点标题下面就多出一段文字。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '内容多但可以压成小空间（FAQ）', recommended: true },
      { situation: '用户不需要同时看到所有内容', recommended: true },
      { situation: '条目长度不一、无法对齐成表格', recommended: true },
      { situation: '用户需要横向比较所有条目的内容', recommended: false },
      { situation: '内容只有两三行，直接显示即可', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '如果用户需要对比多个条目的细节，折叠起来反而增加了操作成本。',
      '在内容只有一条时用 Accordion 是纯粹的包装。',
    ],
    anatomy: [
      { label: 'Header', labelZh: '标题行', note: '整行可点，高度 ≥44px' },
      { label: 'Label', labelZh: '标题文字', note: '说明里面有什么' },
      { label: 'Chevron', labelZh: '箭头', note: '右向 → 下向，旋转 180°' },
      { label: 'Content', labelZh: '内容区', note: '展开后显示' },
      { label: 'Expanded State', labelZh: '展开态', note: '箭头旋转，内容可见' },
    ],
    similarPatterns: ['collapsible', 'tabs', 'progressive-disclosure'],
    compareWith: 'collapsible',
    aiPrompt: {
      basic: '加个可以展开收起的。',
      detailed:
        '加一个 FAQ 折叠面板：可同时展开多个条目，标题整行可点，右侧箭头在展开时旋转 180°，内容用网格行过渡动画。',
      implementation:
        '每条用 <button aria-expanded={open} aria-controls={id}> 作标题行（整行热区，padding 16px 20px，最小高 48px），内容区 <div id role="region" aria-labelledby>。展开动画用 grid-template-rows: 0fr → 1fr 过渡（250ms）比 max-height 方案更平滑，容器需 overflow: hidden。Chevron 图标用 transition: transform。允许多开时 openItems 是 Set。不要用 <details> 原生标签，因为无法控制动画和默认箭头样式。',
    },
    badPrompt: '加个点一下展开的东西。',
    betterPrompt:
      '加 FAQ Accordion：可多开，标题用 button[aria-expanded] 且整行热区 ≥48px，箭头展开时旋转 180°，内容用 grid-template-rows 0fr→1fr 过渡实现高度动画。',
    fitsFor: 'FAQ · 设置分组 · 帮助中心',
    tags: ['展开', '折叠', '省空间'],
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    chineseName: '单项折叠',
    aliases: ['折叠', 'collapsible', '单开折叠', 'expandable section', '可展开区块'],
    category: 'containers',
    level: 2,
    appearance: ['on-click'],
    position: ['inline'],
    job: ['expand'],
    oneLine: '一次只展开一个——展开新的，旧的自动收起。',
    description:
      'Collapsible 和 Accordion 是同一套机制的两种策略。Accordion 可以同时开多个，Collapsible 是「互斥」版本。看它们的区别主要看业务：需要对比就用 Accordion，一次看一个就用 Collapsible。',
    looksLike:
      '折叠面板里点开第二个，第一个自动合上——很多手风琴默认就是这个行为。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '一次只需要关注一个内容块', recommended: true },
      { situation: '内容较长，展开多个会撑爆页面', recommended: true },
      { situation: '选项之间有关联（选了 A 会影响 B）', recommended: true },
      { situation: '需要对比多个条目', recommended: false },
    ],
    whenNotToUse: [
      '如果用户的真实需求是「同时看两条」，互斥展开会不断打断他们。',
      '只有一条时用 Collapsible 是把一个简单问题复杂化。',
    ],
    anatomy: [
      { label: 'Trigger', labelZh: '触发器', note: '标题行 + 箭头' },
      { label: 'Panel', labelZh: '内容面板', note: '同一时刻只有一个可见' },
      { label: 'Indicator', labelZh: '状态指示', note: '箭头方向' },
    ],
    similarPatterns: ['accordion', 'progressive-disclosure', 'tabs'],
    compareWith: 'accordion',
    aiPrompt: {
      basic: '加个展开的，一次只能开一个。',
      detailed:
        '加一个单项折叠面板：点击当前展开项则收起，点击其他项则切换过去，任意时刻最多一项展开。',
      implementation:
        'state 用 openIndex: number | null。点击时：if (openIndex === i) setOpenIndex(null) else setOpenIndex(i)。当 openIndex 变化时，前一个面板做收起动画、新面板做展开动画（height 0fr→1fr 过渡 250ms）。注意两个动画不重叠会导致跳变，可让收起用 180ms、展开用 250ms。',
    },
    badPrompt: '加个折叠的，展开一个其他就关上。',
    betterPrompt:
      '加 Collapsible：state 存 openIndex（可为 null），点击已展开项收起、点击其他项切换，任意时刻最多一项展开，收起 180ms / 展开 250ms 高度过渡避免跳变。',
    fitsFor: '设置 · 分段内容 · 详情展开',
    tags: ['互斥', '单项', '展开'],
  },
  {
    id: 'modal',
    name: 'Modal',
    chineseName: '模态框 / 对话框',
    aliases: ['对话框', '弹窗', 'modal', 'dialog', '弹出窗口', '模态'],
    category: 'containers',
    level: 1,
    appearance: ['on-click'],
    position: ['center'],
    job: ['confirm', 'inform'],
    oneLine: '点了一下之后，屏幕中间冒出一个窗口，不处理它就别想继续用后面的页面。',
    description:
      'Modal 会「拦住」用户：底层页面变灰、不可点击、不响应滚动。它的正当用途只有两个——必须立即做决定，或者需要一个专注的输入环境。其余情况基本都能用非模态方案替代。',
    looksLike:
      '点「删除照片」后屏幕中间弹出的小窗、写评论时从屏幕中间展开的输入框、登录注册页那个居中的表单面板。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '必须立即做决定才能继续（二次确认）', recommended: true },
      { situation: '需要一个专注的输入环境（登录、评论）', recommended: true },
      { situation: '需要打断用户注意力的严重错误', recommended: true },
      { situation: '只是想展示一条信息', recommended: false },
      { situation: '承载多层任务（表单很长）', recommended: false },
    ],
    whenNotToUse: [
      '每点一次按钮就弹一个框，是最常见的体验灾难。',
      'Modal 里再放 Modal 是设计事故——改用 Breadcrumb 或 Stepper。',
    ],
    anatomy: [
      { label: 'Scrim', labelZh: '遮罩', note: '半透明黑，点击通常关闭' },
      { label: 'Dialog Surface', labelZh: '对话框', note: '白底，圆角 12px，max-width 480px' },
      { label: 'Title', labelZh: '标题', note: '写明后果而非「提示」' },
      { label: 'Body', labelZh: '内容', note: '不超过 3 行' },
      { label: 'Actions', labelZh: '操作区', note: '右对齐，取消 + 确认' },
      { label: 'Close', labelZh: '关闭', note: '右上角 ✕ 或按 Esc' },
    ],
    similarPatterns: ['bottom-sheet', 'drawer', 'popover', 'alert', 'destructive-action'],
    compareWith: 'bottom-sheet',
    aiPrompt: {
      basic: '点一下弹个框。',
      detailed:
        '点「删除」后弹出确认 Dialog：标题写明后果，正文不超过两行，底部右对齐「取消」和红色「删除」，支持 Esc 和点击遮罩关闭。',
      implementation:
        'role="dialog" aria-modal="true" aria-labelledby 指向标题。打开时给 body 加 overflow: hidden，并 focus 第一个可交互元素（或对话框本身）。focus trap：Tab 循环只在对话框内。Esc 关闭。遮罩 rgba(0,0,0,0.4)，点击遮罩关闭（破坏性操作例外）。宽度 min(480px, calc(100vw - 32px))，垂直居中。动画：opacity + scale(0.96→1) 150ms。关闭后焦点归还触发元素。',
    },
    badPrompt: '点一下弹个框出来。',
    betterPrompt:
      '弹出确认 Dialog（role=dialog aria-modal）：标题写明后果不用「提示」，正文 ≤2 行，底部右对齐「取消 + 红色删除」，Esc 和点击遮罩关闭，打开时 focus trap 并锁 body 滚动。',
    fitsFor: '确认 · 登录 · 必答输入',
    tags: ['阻断', '确认', '焦点'],
    comparisonSlug: 'dialog-vs-bottom-sheet-vs-drawer',
  },
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    chineseName: '底部弹出面板',
    aliases: ['底部弹窗', 'bottom sheet', '底部抽屉', '底部弹出层', 'action sheet', '底部面板'],
    category: 'containers',
    level: 2,
    appearance: ['on-click'],
    position: ['bottom'],
    job: ['select', 'expand', 'inform'],
    oneLine: '从屏幕底部往上滑出来的一块面板，停在那儿不占满全屏。',
    description:
      'Bottom Sheet 是移动端最讨喜的容器：它保留了「我还在原来的页面」的感觉，同时又能展开一个专注的操作区。最常见的两种形态是：固定高度的选择面板，和纯操作按钮列表（Action Sheet）。',
    looksLike:
      '照片 App 点「编辑」后从底部升起的编辑面板、地图 App 点搜索后的筛选面板、微信点「+」后弹出的「拍摄 / 从相册选 / 扫一扫」列表。',
    platforms: ['mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '移动端需要一个轻量的选择或操作面板', recommended: true },
      { situation: '想保留底层页面上下文（用户还能看到自己在哪）', recommended: true },
      { situation: '操作项在 3–8 个之间', recommended: true },
      { situation: '内容需要全屏深度（长表单、编辑器）', recommended: false },
      { situation: '桌面端 Web 界面', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '内容超过半屏时，Bottom Sheet 会让用户失去「页面」的锚点感，这时用全屏页面更稳。',
      '要严格「拦住」用户必须做决定时，Modal 的阻断感更强。',
    ],
    anatomy: [
      { label: 'Scrim', labelZh: '遮罩', note: '半透明黑，不完全遮蔽底层' },
      { label: 'Surface', labelZh: '面板', note: '顶部圆角 16px，从底部升起' },
      { label: 'Drag Handle', labelZh: '拖拽条', note: '顶部居中短横线，提示可拖' },
      { label: 'Title', labelZh: '标题', note: '可选，居中' },
      { label: 'Content', labelZh: '内容', note: '选项列表或表单' },
      { label: 'Handle / Grabber', labelZh: '抓手', note: '向下拖动可关闭' },
    ],
    similarPatterns: ['modal', 'drawer', 'popover', 'bottom-sheet'],
    compareWith: 'modal',
    aiPrompt: {
      basic: '从底部弹个东西出来。',
      detailed:
        '点击「筛选」后从屏幕底部打开 Bottom Sheet：高度根据内容自适应，最大不超过视口 70%，背景保留并加半透明遮罩，顶部有拖拽 Handle，向下拖动或点击遮罩关闭。',
      implementation:
        '容器 fixed inset-0 z-50，遮罩 rgba(0,0,0,0.4) 淡入。面板 fixed bottom-0，max-height: 70vh，圆角 16px 16px 0 0，transform: translateY(100%) → 0 过渡 280ms cubic-bezier(0.32,0.72,0,1)。顶部 12px 处放 36×4px 灰色 Drag Handle。关闭方式三选一以上：拖拽 Handle 下滑（跟手）、点击遮罩、点击取消按钮。打开时锁定 body 滚动 + Esc 关闭。高度用内容实测 max-height 限制，而非固定高度。',
    },
    badPrompt: '点一下从底下弹个东西出来。',
    betterPrompt:
      '点击「筛选」后打开 Bottom Sheet：高度按内容自适应、max-height 70vh、顶部圆角 16px + Drag Handle，背景加 40% 遮罩保留可见，可通过下滑/点遮罩/取消按钮/ESC 四种方式关闭。',
    fitsFor: '筛选 · 选项 · 分享操作',
    tags: ['底部', '滑出', '上下文'],
    comparisonSlug: 'dialog-vs-bottom-sheet-vs-drawer',
  },
  {
    id: 'drawer',
    name: 'Drawer',
    chineseName: '抽屉',
    aliases: ['抽屉', '侧边抽屉', 'drawer', '侧滑面板', '滑出面板', 'off-canvas'],
    category: 'containers',
    level: 2,
    appearance: ['on-click', 'on-scroll'],
    position: ['side'],
    job: ['navigate', 'select'],
    oneLine: '从屏幕边缘滑出来的一块面板，通常是侧面的，也可以是底部的。',
    description:
      'Drawer 的定义特征是「从边缘滑入 + 推开或遮住原页面」。底部滑出的 Drawer 往往就是 Bottom Sheet；真正有区别的是侧边 Drawer——它用来承载导航或筛选，不打断主流程。',
    looksLike:
      '点左上角汉堡按钮从左边滑出的菜单、购物车里从右侧滑出的「已选商品」面板、小红书侧滑出的设置。',
    platforms: ['mobile', 'web', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '移动端需要容纳底部导航放不下的入口', recommended: true },
      { situation: '筛选条件较多，需要一个完整面板承载', recommended: true },
      { situation: '主内容需要保持可见（对比筛选结果）', recommended: 'mostly' },
      { situation: '需要一次展示大量信息（帮助、详情）', recommended: false },
    ],
    whenNotToUse: [
      'Drawer 里如果再放 Tabs 和 Accordion，就已经是个页面了——不如直接导航过去。',
      '多个 Drawer 互相嵌套（抽屉里开抽屉）会让返回逻辑变得混乱。',
    ],
    anatomy: [
      { label: 'Overlay', labelZh: '遮罩层', note: '半透明黑，可点击关闭' },
      { label: 'Panel', labelZh: '面板', note: '侧边滑入，宽度 280–320px' },
      { label: 'Handle', labelZh: '边缘把手', note: '可选，提示可滑出' },
      { label: 'Content', labelZh: '内容', note: '导航项或表单' },
    ],
    similarPatterns: ['sidebar', 'bottom-sheet', 'modal', 'navigation-rail'],
    compareWith: 'bottom-sheet',
    aiPrompt: {
      basic: '从左边滑出个面板。',
      detailed:
        '加一个从左侧滑出的 Drawer，宽 300px，承载主导航；汉堡按钮唤起，遮罩点击或 Esc 关闭，关闭后焦点返回按钮。',
      implementation:
        '容器 fixed inset-0 z-50，遮罩 rgba(0,0,0,0.4)。面板 fixed left-0 top-0 h-full w-[300px]，transform: translateX(-100%) → 0 过渡 250ms。打开时锁定 body 滚动，focus trap 在面板内，Esc 关闭，关闭后焦点还给汉堡按钮。支持边缘右滑手势打开（touchstart/touchmove 检测起点 x<20px）。移动端固定，移动端以上（≥1024px）应该直接常驻显示而不是 Drawer。',
    },
    badPrompt: '加个能滑出来的侧边面板。',
    betterPrompt:
      '加左侧 Drawer（宽 300px）：汉堡按钮唤起、40% 遮罩、Esc 与点遮罩关闭、focus trap、关闭后焦点归还按钮、锁定背景滚动，≥1024px 时改为常驻 Sidebar。',
    fitsFor: '导航 · 筛选 · 详情面板',
    tags: ['侧滑', '导航', '遮罩'],
  },
  {
    id: 'popover',
    name: 'Popover',
    chineseName: '浮出层',
    aliases: ['气泡', 'popover', '浮层', '浮出面板', 'popover panel'],
    category: 'containers',
    level: 2,
    appearance: ['on-click', 'on-hover'],
    position: ['floating'],
    job: ['inform', 'select'],
    oneLine: '从某个元素旁边「冒」出来的小面板，贴着触发它的那个东西。',
    description:
      'Popover 的特征是「依附性」：它总是从触发元素附近长出来，指向它来自哪里。这让它和 Modal（屏幕中央）、Bottom Sheet（底部）在视觉上就能区分开。',
    looksLike:
      '点日历图标旁边弹出的月份选择器、点「更多」后浮出的小菜单、点颜色方块后浮出的调色板——都贴着自己的触发器。',
    platforms: ['web', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '内容需要和某个元素建立视觉关联', recommended: true },
      { situation: '内容较轻（菜单、选择器、小表单）', recommended: true },
      { situation: '需要保留底层页面可交互', recommended: true },
      { situation: '需要阻断用户完成当前操作', recommended: false },
      { situation: '内容很长、需要滚动很久', recommended: false },
    ],
    whenNotToUse: [
      'Popover 放长列表是常见错误——用户滚到底会失去「它从哪来」的线索。',
      '移动端 Popover 容易因为空间不足而飞出屏幕边缘，需要谨慎处理定位。',
    ],
    anatomy: [
      { label: 'Trigger', labelZh: '触发元素', note: '按下时加 active 背景' },
      { label: 'Surface', labelZh: '浮层本体', note: '白底 + 阴影提升悬浮感' },
      { label: 'Arrow', labelZh: '小箭头', note: '指向触发器，可选' },
      { label: 'Content', labelZh: '内容', note: '菜单项 / 表单 / 预览' },
    ],
    similarPatterns: ['tooltip', 'select', 'modal'],
    compareWith: 'tooltip',
    aiPrompt: {
      basic: '在某个东西旁边弹个小面板。',
      detailed:
        '点击「格式」按钮后，在按钮下方弹出一个 Popover，显示四种排版格式供选择，带小箭头指向触发按钮，Esc 和点击外部关闭。',
      implementation:
        '触发 button 加 aria-haspopup="menu" aria-expanded。浮层 role="menu"，选项 role="menuitem"。定位用 Floating UI 或手写：计算 trigger.getBoundingClientRect()，优先放在下方，底部空间不足时翻转到上方，左右对齐 trigger 左边缘，间距 6px。带一个 8px 旋转的白色小方块作为箭头。Esc 或点击外部关闭，关闭后焦点回触发器。',
    },
    badPrompt: '在这旁边弹个东西出来。',
    betterPrompt:
      '在触发按钮下方弹 Popover（role=menu），带小箭头指向触发器，用 Floating UI 定位并在空间不足时自动翻转到上方，Esc / 点外部关闭，焦点归还触发器。',
    fitsFor: '菜单 · 选择器 · 快速编辑',
    tags: ['依附', '轻量', '定位'],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    chineseName: '文字提示',
    aliases: ['提示', 'tooltip', '悬浮提示', '文字提示气泡', 'hover hint'],
    category: 'containers',
    level: 1,
    appearance: ['on-hover'],
    position: ['floating'],
    job: ['inform'],
    oneLine: '鼠标悬停时冒出来的一行小字，告诉用户这个图标是干什么的。',
    description:
      'Tooltip 只做一件事：命名和解释。它不能放按钮（那叫 Popover），也不能承载关键操作。它最大的限制是触屏设备上几乎无法使用，所以不能承载唯一信息。',
    looksLike:
      '把鼠标放在一个陌生图标上，旁边浮出一行「导出为 PDF」的小黑条——就是 Tooltip。',
    platforms: ['web', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: 'Icon Button 的含义不明确，需要解释', recommended: true },
      { situation: '补充说明某个数字或缩写（首字母缩写）', recommended: true },
      { situation: '被截断的文字需要看全文', recommended: true },
      { situation: '需要点击里面的按钮', recommended: false },
      { situation: '这是理解页面所必需的信息', recommended: false },
    ],
    whenNotToUse: [
      'Tooltip 在移动端基本无法触发，所以关键信息必须有第二处出口。',
      '延迟别太长（500ms 左右合适），否则会让页面显得迟钝。',
    ],
    anatomy: [
      { label: 'Trigger', labelZh: '触发元素', note: '通常 focusable' },
      { label: 'Bubble', labelZh: '气泡', note: '深色底白字，圆角 6px' },
      { label: 'Text', labelZh: '文字', note: '≤2 行，不换长句' },
      { label: 'Arrow', labelZh: '小箭头', note: '指向触发元素' },
    ],
    similarPatterns: ['popover', 'icon-button', 'inline-validation'],
    compareWith: 'popover',
    aiPrompt: {
      basic: '鼠标悬停时给个提示。',
      detailed:
        '给工具栏的 Icon Button 加 Tooltip：悬停 400ms 后显示图标名称，鼠标移开或按 Esc 立即消失，同时支持键盘 focus 时显示。',
      implementation:
        '触发元素加 aria-describedby 指向气泡 id，同时加 title="" 作为降级。气泡 position: absolute，出现在触发元素上方 8px 处，屏幕顶部时翻转到下方。深色背景 #1A1917、白色 12px 文字、圆角 6px、max-width 200px。显示延迟 400ms（hover enter），离开立即隐藏。支持 focus-visible 时也显示。文字不超过 2 行。',
    },
    badPrompt: '鼠标放上去给个提示文字。',
    betterPrompt:
      '给 Icon Button 加 Tooltip：hover 400ms 后显示图标名称、离开或 Esc 立即隐藏、支持键盘 focus 触发、加 aria-describedby、屏幕顶部时自动翻转到下方、文字 ≤2 行。',
    fitsFor: '图标命名 · 缩写解释 · 全文',
    tags: ['悬停', '命名', '键盘'],
  },
];
