import type { UIPattern } from '../types';

export const interactionPatterns: UIPattern[] = [
  {
    id: 'swipe-action',
    name: 'Swipe Action',
    chineseName: '滑动操作',
    aliases: ['滑动操作', 'swipe action', '左滑', '侧滑', 'swipe to reveal', '滑动手势'],
    category: 'interaction',
    level: 3,
    appearance: ['on-scroll'],
    position: ['inline'],
    job: ['confirm', 'create'],
    oneLine: '手指按住列表项往左一滑，底下露出「删除」「归档」这些按钮。',
    description:
      'Swipe Action 把「不常用但必要」的操作藏进了手势里。它极大提升了列表的整洁度，代价是发现性差——用户可能永远不知道可以左滑。对应的对策是：长按也能唤出同样的菜单。',
    looksLike:
      'iOS 邮件列表左滑出现「归档 / 标记 / 删除」、微信聊天列表左滑出现「删除 / 标记未读」、Todo App 左滑露出红色删除按钮。',
    platforms: ['mobile'],
    difficulty: 'hard',
    whenToUse: [
      { situation: '高频列表中的次要操作', recommended: true },
      { situation: '删除/归档这类可逆操作', recommended: true },
      { situation: '需要保持界面极简', recommended: true },
      { situation: '这是最常用的主操作', recommended: false },
      { situation: '桌面端鼠标环境', recommended: false },
    ],
    whenNotToUse: [
      '发现性是硬伤：一定要给长按/右键的替代入口。',
      '一次只能滑出一个菜单，同时出现两个菜单会让用户困惑。',
    ],
    anatomy: [
      { label: 'Swipe Threshold', labelZh: '触发阈值', note: '滑过 50% 宽度或 30px' },
      { label: 'Row', labelZh: '列表行', note: '跟随手指移动' },
      { label: 'Action Buttons', labelZh: '操作按钮', note: '底层露出，右侧对齐' },
      { label: 'Snap', labelZh: '吸附', note: '松手后吸附到开/关' },
      { label: 'Fallback', labelZh: '替代入口', note: '长按或右键唤出同一菜单' },
    ],
    similarPatterns: ['long-press', 'context-menu', 'pull-to-refresh', 'list'],
    compareWith: 'context-menu',
    aiPrompt: {
      basic: '列表项可以左滑。',
      detailed:
        '给列表项加左滑操作：滑过 50% 露出「置顶（蓝）/ 删除（红）」两个按钮，松手吸附展开，点空白收起。',
      implementation:
        '用 pointer 事件 + touchstart/touchmove/touchend 记录 dx。dx < -50px 时设置 state revealedId，row transform: translateX(-140px)，两个按钮 absolute 定位在右侧各 70px 宽。用 CSS transition 处理吸附动画。同一时刻只有一个 row 处于 revealed 状态。滑动中阻止垂直滚动（判断手势主方向）。必须补一个长按（500ms）唤出同样菜单的入口，否则桌面/无障碍用户无法使用。',
    },
    badPrompt: '列表可以左滑操作。',
    betterPrompt:
      '给列表项加 Swipe Action：左滑过 50% 露出「置顶/删除」按钮并吸附展开，点空白收起，同一时刻只允许一项展开，并提供长按作为替代入口。',
    fitsFor: '删除 · 归档 · 置顶',
    tags: ['手势', '隐藏操作', '需替代'],
  },
  {
    id: 'pull-to-refresh',
    name: 'Pull to Refresh',
    chineseName: '下拉刷新',
    aliases: ['下拉刷新', 'pull to refresh', '下拉', '刷新手势', '拉动刷新'],
    category: 'interaction',
    level: 2,
    appearance: ['on-scroll'],
    position: ['top'],
    job: ['navigate', 'status'],
    oneLine: '在列表顶部往下拉，松手后重新加载数据。',
    description:
      'Pull to Refresh 用一个「往下拉」的物理直觉替代了刷新按钮。它的最大问题是发现性——用户必须自己试出来。所以绝大多数 App 仍然在导航栏保留一个刷新按钮作为备份。',
    looksLike:
      '微信朋友圈下拉、邮件 App 下拉、几乎所有新闻 App 顶部下拉时出现的转圈箭头。',
    platforms: ['mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '移动端列表内容会随时间变化', recommended: true },
      { situation: '内容以「最新」为优先（动态、消息、新闻）', recommended: true },
      { situation: '用户主动想更新', recommended: true },
      { situation: '桌面端', recommended: false },
      { situation: '内容很少、一屏装得下', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '下拉的阈值（约 60–80px）和阻尼系数决定手感，抄别人的参数不会对。',
      '刷新时必须锁住列表不允许继续下拉，否则会出现多次刷新。',
    ],
    anatomy: [
      { label: 'Threshold', labelZh: '触发阈值', note: '约 64–80px' },
      { label: 'Indicator', labelZh: '指示器', note: '箭头随下拉旋转成圈' },
      { label: 'Refresh', labelZh: '刷新中', note: '锁定列表，禁用再次触发' },
      { label: 'Overscroll', labelZh: '阻尼', note: '越拉越沉，给出物理反馈' },
    ],
    similarPatterns: ['infinite-scroll', 'swipe-action', 'progress-bar'],
    compareWith: 'infinite-scroll',
    aiPrompt: {
      basic: '支持下拉刷新。',
      detailed:
        '给列表加下拉刷新：顶部下拉超过 72px 触发，指示器随拉动进度旋转，刷新中锁定列表，完成后回弹并更新内容。',
      implementation:
        'touchstart 记录起始 Y，touchmove 时计算 deltaY = startY - currentY，位移用 deltaY * 0.5 做阻尼（让手感更沉）。超过 72px 时把指示器从箭头切换为旋转。touchend 时若超过阈值则触发刷新并锁定（refreshLock = true），完成后回弹动画并解锁。移动端用 overscroll-behavior: contain 避免触发页面刷新。桌面端另配一个显式刷新按钮。',
    },
    badPrompt: '下拉可以刷新。',
    betterPrompt:
      '加 Pull to Refresh：touch 位移乘 0.5 做阻尼、超过 72px 触发并把指示器从箭头切成旋转、刷新中用 refreshLock 锁定列表防重复触发、完成后回弹、桌面端另配显式刷新按钮。',
    fitsFor: '动态 · 消息 · 新闻流',
    tags: ['手势', '刷新', '阻尼'],
  },
  {
    id: 'infinite-scroll',
    name: 'Infinite Scroll',
    chineseName: '无限滚动',
    aliases: ['无限滚动', 'infinite scroll', '无限加载', '自动加载', '瀑布流', 'feed'],
    category: 'navigation',
    level: 2,
    appearance: ['on-scroll'],
    position: ['inline'],
    job: ['navigate'],
    oneLine: '一直往下滑就自动加载下一页，没有「下一页」按钮。',
    description:
      'Infinite Scroll 让浏览变成连续的、无终点的探索。它适合「随便刷刷」的内容流，但会带来三个真实问题：找不到页脚、无法回到刚才的位置、浏览器前进后退失效。',
    looksLike:
      '微博、下滑的 Pinterest 瀑布流、知乎信息流——滑到底自动就开始加载下一批。',
    platforms: ['mobile', 'web'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '内容是「探索型」的，没有明确终点', recommended: true },
      { situation: '用户目的是随便刷（社交、灵感、资讯）', recommended: true },
      { situation: '浏览路径不需要定位和分享', recommended: true },
      { situation: '用户需要找到「第 N 页」', recommended: false },
      { situation: '内容有明确结构（订单、账单、日志）', recommended: false },
    ],
    whenNotToUse: [
      '无限滚动让浏览器的返回键失效——用户看完想回到列表却只能重新刷一遍。',
      'SEO 不友好：搜索引擎抓不到第 2 页之后的内容。',
      '一定要在到达底部时提供「已经到底了 + 回到顶部」按钮，否则用户不知道还能不能继续。',
    ],
    anatomy: [
      { label: 'Sentinel', labelZh: '哨兵元素', note: '用 IntersectionObserver 观察' },
      { label: 'Loading', labelZh: '加载中', note: '底部三个跳动小点' },
      { label: 'End Marker', labelZh: '到底提示', note: '「没有更多了」' },
      { label: 'Back to Top', labelZh: '回到顶部', note: '滑超过 3 屏后出现' },
    ],
    similarPatterns: ['pagination', 'load-more', 'pull-to-refresh'],
    compareWith: 'pagination',
    aiPrompt: {
      basic: '滑到底自动加载。',
      detailed:
        '列表滚动到底部时自动加载下一页：显示加载动画，加载完追加到列表末尾，加载完全部后显示「已经到底了」和「回到顶部」按钮。',
      implementation:
        '用 IntersectionObserver 观察列表末尾的 sentinel div（rootMargin: "200px" 提前触发），比监听 scroll 事件性能好得多。加载中加 loading 标志防重复请求。请求失败时在底部显示「加载失败 · 重试」而不是静默失败。每页 20 条，追加时保持滚动位置稳定。滑过 3 屏后右下角出现「回到顶部」FAB。',
    },
    badPrompt: '滑到底自动加载更多。',
    betterPrompt:
      '加 Infinite Scroll：用 IntersectionObserver 监听末尾 sentinel（rootMargin 200px）提前触发，加载中标志防重复请求，失败显示「重试」而非静默，加载完显示「已经到底了」+「回到顶部」按钮。',
    fitsFor: '信息流 · 灵感 · 社交',
    tags: ['自动加载', '探索型', 'SEO 弱'],
    comparisonSlug: 'pagination-vs-infinite-scroll',
  },
  {
    id: 'drag-and-drop',
    name: 'Drag & Drop',
    chineseName: '拖拽排序',
    aliases: ['拖拽', 'drag and drop', '拖放', '拖动排序', 'reorder', 'dnd'],
    category: 'interaction',
    level: 3,
    appearance: ['on-scroll'],
    position: ['inline'],
    job: ['create', 'select'],
    oneLine: '按住一个东西拖到另一个位置松手，就换过去了。',
    description:
      'Drag & Drop 让用户直接操作「顺序」和「归属」这两件抽象的事。它必须提供非拖拽的替代方式——因为拖拽对手部精细动作有要求，也不是每个人都知道能拖。',
    looksLike:
      '看板 Kanban 里拖动卡片换列、Trello 拖动便签、设计工具里拖动图层、Todo App 里拖动重新排序。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'hard',
    whenToUse: [
      { situation: '改变顺序或归属关系（看板、图层、排序）', recommended: true },
      { situation: '空间位置本身有含义', recommended: true },
      { situation: '提供「移动到…」的键盘替代', recommended: true },
      { situation: '仅为了美观排序（用户不在意顺序）', recommended: false },
      { situation: '单选一个（用点击就够）', recommended: false },
    ],
    whenNotToUse: [
      '拖拽的可用性成本很高：必须同时支持键盘（Space 拿起 → 方向键移动 → Space 放下）和「移到」菜单。',
      '移动端拖拽要处理自动滚动和手势冲突，是最难的交互之一。',
    ],
    anatomy: [
      { label: 'Drag Handle', labelZh: '拖拽把手', note: '显示 hover 光标 grab' },
      { label: 'Ghost', labelZh: '拖影', note: '半透明跟随指针' },
      { label: 'Drop Target', labelZh: '放置区', note: '高亮显示插入位置' },
      { label: 'Placeholder', labelZh: '占位', note: '原位置留空隙' },
      { label: 'Keyboard Alt', labelZh: '键盘替代', note: '方向键移动' },
    ],
    similarPatterns: ['swipe-action', 'list', 'stepper'],
    compareWith: 'swipe-action',
    aiPrompt: {
      basic: '可以拖动排序。',
      detailed:
        '支持拖拽重新排序：拖动时原位留空隙并显示插入指示线，松手后平滑移动到新位置，并同步更新数组顺序。',
      implementation:
        '用 HTML5 draggable 或 Pointer Events（推荐后者，触屏也能用）。onPointerDown 记录起点，move 超过 5px 阈值才进入拖拽态（避免和点击冲突）。拖拽中：源元素 opacity 0.4 变为 ghost 跟随指针，目标位置显示 2px 指示线。计算插入索引用指针位置与各项中点比较。松手后用 FLIP 动画让其他项平滑归位。必须补键盘方案：焦点在项目上按 Space 拿起、↑↓ 移动、Space 放下、Esc 取消。',
    },
    badPrompt: '支持拖动改变顺序。',
    betterPrompt:
      '实现拖拽排序：move 超过 5px 阈值才进入拖拽态避免和点击冲突，源元素半透明、目标位置显示插入指示线，落下后用 FLIP 动画平滑归位，并补 Space 拿起 / ↑↓ 移动 / 放下 / Esc 取消的键盘方案。',
    fitsFor: '看板 · 图层 · 排序',
    tags: ['顺序', '空间', '需键盘替代'],
  },
  {
    id: 'long-press',
    name: 'Long Press',
    chineseName: '长按',
    aliases: ['长按', 'long press', '长按手势', '按住', 'press and hold'],
    category: 'interaction',
    level: 3,
    appearance: ['on-scroll'],
    position: ['inline'],
    job: ['select', 'navigate'],
    oneLine: '手指按住不放半秒，弹出一排选项或者进入多选模式。',
    description:
      'Long Press 是「没有第二层屏幕时」的处理方式。它把低频操作藏进一个不显眼的时长里——但也带来了「我不知道要按多久」的困惑，所以必须有视觉和触觉反馈。',
    looksLike:
      'iOS 长按 App 图标弹出「删除 / 重命名 / 分享」，安卓长按图片弹出「保存 / 编辑 / 删除」，长按照片进入多选。',
    platforms: ['mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '需要有低频操作但不想占用界面空间', recommended: true },
      { situation: '需要进入多选模式', recommended: true },
      { situation: '需要拖拽但想限制误触', recommended: true },
      { situation: '这是主要操作', recommended: false },
      { situation: '用户不知道可以长按', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '长按的时长（通常 500ms）必须给反馈：震动 + 视觉变化，否则用户以为没点到。',
      '不要用长按承载唯一的关键操作。',
    ],
    anatomy: [
      { label: 'Hold Threshold', labelZh: '按住时长', note: '约 500ms' },
      { label: 'Feedback', labelZh: '反馈', note: '震动 + 高亮，必须有' },
      { label: 'Menu', labelZh: '弹出菜单', note: '或进入多选模式' },
      { label: 'Cancel', labelZh: '取消', note: '移开或松手即取消' },
    ],
    similarPatterns: ['context-menu', 'swipe-action', 'drag-and-drop'],
    compareWith: 'context-menu',
    aiPrompt: {
      basic: '长按弹出菜单。',
      detailed:
        '给列表项加长按：按住 500ms 后震动并弹出操作菜单（编辑/分享/删除），手指移动超过 10px 或提前松手则取消。',
      implementation:
        'pointerdown 启动 setTimeout(500)，pointermove 超过 10px 距离则 clearTimeout（避免和滚动冲突），pointerup / pointercancel 清除定时器。触发时调 navigator.vibrate(10)（需用户交互后才能用）并立即给该项加高亮背景作为视觉确认。菜单定位在长按点附近。移动超过 10px 的阈值很关键，否则用户想滚动列表却触发了菜单。',
    },
    badPrompt: '长按可以弹出菜单。',
    betterPrompt:
      '加 Long Press：pointerdown 启动 500ms 定时器，move 超过 10px 距离即清除（避免误触滚动），触发时震动 + 视觉高亮双重反馈，菜单定位在长按点附近，pointerup/cancel 清除定时器。',
    fitsFor: '多选 · 图标操作 · 隐藏菜单',
    tags: ['手势', '隐藏', '需反馈'],
  },
  {
    id: 'context-menu',
    name: 'Context Menu',
    chineseName: '上下文菜单',
    aliases: ['右键菜单', 'context menu', '快捷菜单', '次级菜单', 'right click menu'],
    category: 'interaction',
    level: 2,
    appearance: ['on-click'],
    position: ['floating'],
    job: ['select'],
    oneLine: '在某个东西上点右键（手机上长按），弹出的那排操作选项。',
    description:
      'Context Menu 是「只对这一个对象有效的操作」的集合。它的内容应该是上下文相关的——在图片上右键是「设为主图」，在文件名上右键是「重命名」。',
    looksLike:
      '浏览器里在链接上点右键弹出的菜单、桌面文件上右键的菜单、Notion 里选中一段文字右键的浮动格式菜单。',
    platforms: ['web', 'desktop', 'mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '操作只针对特定对象', recommended: true },
      { situation: '操作低频，放在主界面不划算', recommended: true },
      { situation: '需要腾出主界面空间', recommended: true },
      { situation: '这些操作是高频的', recommended: false },
      { situation: '这是移动端唯一入口', recommended: false },
    ],
    whenNotToUse: [
      '移动端没有右键，长按唤出的菜单在系统层可能和浏览器默认菜单冲突。',
      '菜单项超过 8 个就该考虑分组或换成别的形态。',
    ],
    anatomy: [
      { label: 'Trigger', labelZh: '触发点', note: '右键 / 长按' },
      { label: 'Menu', labelZh: '菜单容器', note: '定位在鼠标位置' },
      { label: 'Item', labelZh: '菜单项', note: '高 32px，含图标 + 文字' },
      { label: 'Separator', labelZh: '分隔线', note: '分组危险操作' },
      { label: 'Shortcut', labelZh: '快捷键', note: '右侧显示 ⌘C 等' },
    ],
    similarPatterns: ['long-press', 'popover', 'select'],
    compareWith: 'long-press',
    aiPrompt: {
      basic: '右键弹出菜单。',
      detailed:
        '在文件上点右键弹出菜单：复制 / 移动到… / 重命名 /（分隔线）/ 删除（红色，置底）。支持键盘上下移动。',
      implementation:
        '监听 contextmenu 事件并 preventDefault。用 Popover 定位到鼠标 clientX/clientY，注意视口边缘翻转。role="menu" + role="menuitem"。支持 ↑↓ 移动、Enter 执行、Esc 关闭。危险操作（删除）用分隔线隔开并放最后，文字用红色。每项右侧可显示快捷键（⌘C）。移动端用长按替代，但需 preventDefault 阻止系统默认菜单。',
    },
    badPrompt: '右键弹出菜单。',
    betterPrompt:
      '加 Context Menu：监听 contextmenu 并 preventDefault，Popover 定位到鼠标位置并做视口边缘翻转，role=menu/menuitem，↑↓/Enter/Esc 键盘可用，危险项用分隔线隔开并置底标红，右侧显示快捷键。',
    fitsFor: '文件 · 文本 · 画布对象',
    tags: ['右键', '对象级', '低频'],
  },
  {
    id: 'progressive-disclosure',
    name: 'Progressive Disclosure',
    chineseName: '渐进式呈现',
    aliases: ['渐进披露', 'progressive disclosure', '分层展示', '逐步展开', '分步揭示'],
    category: 'interaction',
    level: 3,
    appearance: ['on-click'],
    position: ['inline'],
    job: ['expand', 'inform'],
    oneLine: '默认只给用户最需要的东西，剩下的藏在「展开更多」后面。',
    description:
      'Progressive Disclosure 是一种「延迟满足」的策略：先给 80 分的信息，让用户决定要不要看剩下的 20 分。它解决的是「选择过载」——选项太多时，用户会僵住。',
    looksLike:
      '订单详情页只显示「总计 ¥128」+「展开明细」，用户点开才看到每一项；App 权限申请时先说「需要相机权限」而不是甩出一屏说明。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'hard',
    whenToUse: [
      { situation: '信息量很大但多数用户只用一小部分', recommended: true },
      { situation: '高级选项会吓跑新手', recommended: true },
      { situation: '可以按用户熟练度分层', recommended: true },
      { situation: '信息缺失会导致误用', recommended: false },
      { situation: '隐藏的内容恰好是安全相关的', recommended: false },
    ],
    whenNotToUse: [
      '把「删除」这种关键操作藏进「更多」是灾难性的。',
      '不要用它隐藏价格、费用、风险这类必须让用户看到的信息。',
    ],
    anatomy: [
      { label: 'Summary', labelZh: '摘要', note: '默认可见的 80 分信息' },
      { label: 'Trigger', labelZh: '展开触发', note: '「展开更多 ›」' },
      { label: 'Detail', labelZh: '详情', note: '隐藏的 20 分' },
      { label: 'State', labelZh: '状态记忆', note: '记住上次选择' },
    ],
    similarPatterns: ['accordion', 'collapsible', 'tabs', 'tooltip'],
    compareWith: 'accordion',
    aiPrompt: {
      basic: '先显示一部分，更多内容折叠。',
      detailed:
        '订单详情默认只显示总计和「查看明细」链接，展开后显示每一项的明细行；状态记住用户上次的展开选择。',
      implementation:
        '默认 collapsed。触发器是文字按钮（不是箭头图标，因为「更多」比「展开」更易理解），加 aria-expanded。展开后内容用 grid-template-rows 0fr→1fr 过渡。状态持久化到 localStorage：下次进入若上次是展开的就默认展开（记忆用户偏好）。但要注意：涉及安全和价格的信息不适用这个模式。',
    },
    badPrompt: '先只显示一部分，其他折叠起来。',
    betterPrompt:
      '实现 Progressive Disclosure：默认只显示摘要 + 「查看明细」文字按钮（aria-expanded），展开用 0fr→1fr 过渡，并把用户的展开选择存到 localStorage 以便下次保持——但价格、风险、安全信息不可隐藏。',
    fitsFor: '订单 · 高级选项 · 权限说明',
    tags: ['分层', '减负', '需记忆'],
  },
  {
    id: 'optimistic-ui',
    name: 'Optimistic UI',
    chineseName: '乐观更新',
    aliases: ['乐观更新', 'optimistic ui', 'optimistic update', '先做后问', '即时反馈'],
    category: 'interaction',
    level: 3,
    appearance: ['on-click'],
    position: ['inline'],
    job: ['status'],
    oneLine: '不等服务器回应，先把界面改成「已经成功了」，失败了再回滚。',
    description:
      'Optimistic UI 是体验的质变点：点「点赞」后图标立刻变实心，而不是转两秒圈。代价是必须处理失败回滚——你需要准备好「怎么撤销这次乐观更新」。',
    looksLike:
      '小红书点完赞图标瞬间点亮、微信发完消息立刻出现在列表里（发送中标记）、勾选 Todo 立刻划掉。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'hard',
    whenToUse: [
      { situation: '操作成功率高（>95%）', recommended: true },
      { situation: '失败可以回滚且回滚成本低', recommended: true },
      { situation: '用户会因为等待而感到卡顿', recommended: true },
      { situation: '操作不可逆（转账、支付）', recommended: false },
      { situation: '失败率较高', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '转账、支付这类不可逆操作必须等服务器确认。',
      '失败回滚要有提示：静默回滚会让用户以为「我的操作丢了」。',
    ],
    anatomy: [
      { label: 'Instant Apply', labelZh: '立即生效', note: 'UI 先改' },
      { label: 'Pending Marker', labelZh: '处理中标记', note: '半透明或小转圈' },
      { label: 'Rollback', labelZh: '回滚', note: '失败时还原' },
      { label: 'Error Toast', labelZh: '错误提示', note: '说明发生了什么' },
    ],
    similarPatterns: ['snackbar', 'toast', 'progress-bar'],
    compareWith: 'toast',
    aiPrompt: {
      basic: '先假装成功，失败再回滚。',
      detailed:
        '点点赞后立即点亮图标，若接口失败则回滚成未点赞并用 Toast 提示「操作失败，请重试」。',
      implementation:
        'onClick 时先 mutate 本地 state 立即更新 UI，同时记录 prevState 用于回滚，然后发请求。请求期间该元素加半透明或小 spinner 标记 pending 状态（防止重复点击）。catch 分支：还原 prevState + 弹 Toast「操作失败，请重试」+「重试」按钮。关键：回滚必须对用户可见，不能静默恢复。建议配合 Snackbar 撤销。',
    },
    badPrompt: '先更新界面，失败再回滚。',
    betterPrompt:
      '实现 Optimistic UI：先 mutate 本地 state 并记录 prevState，请求期间元素标记 pending 防重复点击，失败时还原 state + Toast「操作失败」+「重试」按钮，回滚必须对用户可见不能静默。',
    fitsFor: '点赞 · 收藏 · 发送 · 勾选',
    tags: ['即时', '回滚', '体验'],
  },
  {
    id: 'inline-validation',
    name: 'Inline Validation',
    chineseName: '即时校验',
    aliases: ['即时校验', 'inline validation', '实时校验', '输入校验', '即时反馈'],
    category: 'interaction',
    level: 3,
    appearance: ['on-click'],
    position: ['inline'],
    job: ['status', 'inform'],
    oneLine: '在用户输入的过程中就告诉他「这样填对不对」，而不是等他提交。',
    description:
      'Inline Validation 的时机选择是关键：在输入过程中（每敲一个键）报错是最烦人的；只在失焦和提交时校验才对。它和 Form Validation 的区别是「在哪里、什么时候」。',
    looksLike:
      '输入邮箱时，边打边显示「✓ 格式正确」；失焦时显示「请输入完整的邮箱地址」。密码框下方实时更新「密码强度：中」。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '输入有明确的格式约束', recommended: true },
      { situation: '错误可以自动检测并给出修正提示', recommended: true },
      { situation: '长表单（填写成本高）', recommended: true },
      { situation: '错误只有提交后才知道', recommended: 'mostly' },
      { situation: '每敲一键就报错的规则', recommended: false },
    ],
    whenNotToUse: [
      '不要在用户刚开始输入时就报红——先让他打完再判断。',
      '错误提示要告诉用户「怎么改」，不是「哪里错了」。',
    ],
    anatomy: [
      { label: 'Field', labelZh: '输入框', note: '错误态红边' },
      { label: 'Message', labelZh: '提示信息', note: '红/绿，说明怎么改' },
      { label: 'Icon', labelZh: '状态图标', note: '✓ / !，非唯一提示' },
      { label: 'Timing', labelZh: '时机', note: 'blur 或 submit，不在每键' },
    ],
    similarPatterns: ['alert', 'text-field', 'error-state', 'inline-validation'],
    compareWith: 'alert',
    aiPrompt: {
      basic: '输入时实时检查。',
      detailed:
        '邮箱输入框在失焦时校验格式：合法时显示绿色对勾 +「格式正确」，非法时红边 +「需要包含 @ 的完整邮箱地址」。',
      implementation:
        '校验时机：focus 时不校验，blur 时校验一次，之后用户再次输入时不校验直到下次 blur。不要在 onChange 里每键报错。错误态：边框 #A8342C + 下方 13px 红字 + aria-invalid="true" + aria-describedby 指向错误文本。错误文案要可操作：「需要包含 @」优于「格式错误」。正确时给绿色 ✓ 增强信心。提交时若无错误才 focus 第一个错误项。',
    },
    badPrompt: '输入的时候检查格式。',
    betterPrompt:
      '加 Inline Validation：只在 blur 和 submit 时校验（不在 onChange 每键报错），错误文案写成可操作的修正建议（如「需要包含 @」而非「格式错误」），配红边 + 错误文本 + aria-invalid + aria-describedby，正确时给绿色 ✓。',
    fitsFor: '表单 · 注册 · 密码强度',
    tags: ['校验', '时机', '可操作'],
  },
];
