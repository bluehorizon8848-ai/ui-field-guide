import type { UIPattern } from '../types';

export const navigationPatterns: UIPattern[] = [
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    chineseName: '面包屑导航',
    aliases: ['路径导航', '面包屑', '层级导航', 'breadcrumb trail', '位置指示'],
    category: 'navigation',
    level: 1,
    appearance: ['always'],
    position: ['top'],
    job: ['navigate'],
    oneLine: '当页面层级比较深时，顶部显示一串「首页 › 设置 › 隐私」，告诉用户「我现在在哪一层」。',
    description:
      'Breadcrumb 是一串可点击的层级路径。它不负责让用户跳到任意地方（那是导航菜单的活），它只回答一个问题：我现在在哪里、怎么退回上一层。',
    looksLike:
      '你在相册 App 里点开一张照片的「详细信息」，页面顶部出现：‹ 相册 › 2024 › IMG_0231。点「2024」就回到上一级，这就是 Breadcrumb。',
    platforms: ['web', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '页面层级 ≥ 3 层', recommended: true },
      { situation: '用户可能想退回上一层', recommended: true },
      { situation: '内容型网站、后台管理系统', recommended: true },
      { situation: '只有一层结构的 App（首页 → 详情）', recommended: false },
      { situation: '移动端底部导航已经足够定位', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '层级只有一两层时，加面包屑只是噪音——直接给个返回按钮就够了。',
      '移动端竖屏空间紧张时，它经常被顶栏的返回箭头替代。',
    ],
    anatomy: [
      { label: 'Root / Home', labelZh: '根节点', note: '通常是首页或产品名' },
      { label: 'Ancestors', labelZh: '祖先层级', note: '中间各级，可点击回退' },
      { label: 'Current', labelZh: '当前页', note: '最后一段，不可点击' },
      { label: 'Separator', labelZh: '分隔符', note: '› / / / ›› 箭头' },
    ],
    similarPatterns: ['tabs', 'pagination', 'stepper', 'back-button'],
    compareWith: 'back-button',
    aiPrompt: {
      basic: '在详情页顶部加一个面包屑导航。',
      detailed:
        '在相册详情页顶部加 Breadcrumb：相册 › 2024 › IMG_0231。中间的「相册」「2024」可点击返回上级，最后一段当前页不可点击。',
      implementation:
        '在页面顶部渲染 Breadcrumb，数据来自路由层级数组 [{label:"相册",href:"/albums"},{label:"2024",href:"/albums/2024"},{label:"IMG_0231"}]。最后一项渲染为纯文本且 disabled，其余项为链接，hover 时加下划线。分隔符用 ›，颜色比文字浅一级。移动端（<640px）只保留最后两项和根节点，中间项用省略号折叠。',
    },
    badPrompt: '在顶部加个返回上面的东西。',
    betterPrompt:
      '在详情页顶部加 Breadcrumb：相册 › 2024 › IMG_0231。中间层级可点击返回，当前页不可点击。',
    fitsFor: '后台 · 内容站 · 深层页面',
    tags: ['层级', '定位', '返回'],
    comparisonSlug: 'pagination-vs-infinite-scroll',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    chineseName: '标签页',
    aliases: ['选项卡', '标签栏', 'tab bar', 'tabbed interface', '页签'],
    category: 'navigation',
    level: 1,
    appearance: ['always'],
    position: ['top'],
    job: ['navigate', 'select'],
    oneLine: '同一层级的几组内容并排放着，切换标签切换整块面板——适合平级内容分区，可同页切换也可深链独立 URL。',
    description:
      'Tabs 的关键是「平级分区 + 独立视窗/面板 + 保持页面上下文」。它承载的是同层不同板块的内容（如资料 / 作品 / 喜欢）。在 Web 上常映射独立 URL 或 query 参数以支持深链接与分享，在应用内也可纯本地状态切换。',
    looksLike:
      '小红书点进一个用户主页，顶部有「主页 / 视频 / 赞过 / 收藏」四个标签，点哪个下面就换成哪块内容——这就是 Tabs。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '2–5 个平级内容分区', recommended: true },
      { situation: '切换后仍停留在同一页面上下文', recommended: true },
      { situation: '需要承载结构差异较大、较重的内容面板', recommended: true },
      { situation: '内容有先后顺序（Stepper）', recommended: false },
      { situation: '选项仅为同一数据的轻量视图过滤（Segmented Control）', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '超过 5 个标签就该考虑用侧边导航或下拉菜单了。',
      '切换会导致用户丢失当前页面的编辑状态时，不要用 Tabs——用户会以为内容还在。',
    ],
    anatomy: [
      { label: 'Tab List', labelZh: '标签栏', note: '横向排布，底部有指示线' },
      { label: 'Active Indicator', labelZh: '选中指示', note: '下划线或色块标记当前项' },
      { label: 'Tab', labelZh: '标签', note: '短标签，1–4 字最佳' },
      { label: 'Panel', labelZh: '内容面板', note: '与标签一一对应的内容区' },
    ],
    similarPatterns: ['segmented-control', 'bottom-navigation', 'stepper', 'accordion'],
    compareWith: 'segmented-control',
    aiPrompt: {
      basic: '加几个标签页可以切换内容。',
      detailed:
        '在用户资料页加 Tabs：主页 / 作品 / 喜欢。点标签切换下方内容，选中项有下划线指示。',
      implementation:
        '用 Tabs 组件，items 为 [{key:"posts",label:"主页"},{key:"works",label:"作品"},{key:"likes",label:"喜欢"}]，defaultActiveKey="posts"。容器 role="tablist"，每个标签 role="tab" + aria-selected，内容区 role="tabpanel" + aria-labelledby。可根据需要同步 URL query（如 ?tab=works）支持浏览器前进后退与深链接分享，或仅作同页状态切换。选中指示用底部 2px 实线，颜色 #1A1917。移动端标签可横向滚动，隐藏滚动条。',
    },
    badPrompt: '上面加几个按钮可以切换下面。',
    betterPrompt:
      '在资料页加 Tabs（标签页），标签为 主页 / 作品 / 喜欢，选中项有底部指示线，支持平级面板切换（可选同步 URL query 以便分享）。',
    fitsFor: '资料页 · 内容分区 · 设置分组',
    tags: ['平级切换', '内容分区', '上下文'],
    comparisonSlug: 'tabs-vs-segmented-control',
  },
  {
    id: 'bottom-navigation',
    name: 'Bottom Navigation',
    chineseName: '底部导航栏',
    aliases: ['底部 tab 栏', '底部导航', 'bottom tab bar', 'bottom nav', 'dock'],
    category: 'navigation',
    level: 2,
    appearance: ['always'],
    position: ['bottom'],
    job: ['navigate'],
    oneLine: 'App 最底部那一排图标按钮，负责在 3–5 个顶级功能之间切换。',
    description:
      'Bottom Navigation 是移动 App 的「主菜单」。它的存在意义是：拇指可达、随时可回。它只放最高频的 3–5 个入口，深层页面要能盖住它。',
    looksLike:
      '微信底部的「聊天 / 通讯录 / 发现 / 我」，支付宝底部的「首页 / 消息 / 蚂蚁森林 / 我的 / 卡包」——都是底部导航。',
    platforms: ['mobile'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '移动 App 有 3–5 个平级主功能', recommended: true },
      { situation: '用户需要在功能间频繁往返', recommended: true },
      { situation: '单手握持、拇指可达性优先', recommended: true },
      { situation: '桌面端 Web 应用', recommended: 'mostly' },
      { situation: '有 6 个以上平级入口', recommended: false },
    ],
    whenNotToUse: [
      '入口多于 5 个时用户会开始乱点，应该收进「更多」或侧边栏。',
      '用户正在沉浸阅读或编辑时，底栏应该隐藏，把空间还给内容。',
    ],
    anatomy: [
      { label: 'Bar', labelZh: '容器', note: '贴底，含安全区 padding' },
      { label: 'Item', labelZh: '导航项', note: '图标 + 短标签' },
      { label: 'Active Item', labelZh: '选中态', note: '图标换色 + 标签加深' },
      { label: 'Badge', labelZh: '角标', note: '红点或数字，可选' },
    ],
    similarPatterns: ['navigation-rail', 'sidebar', 'tabs', 'fab'],
    compareWith: 'navigation-rail',
    aiPrompt: {
      basic: '底部加一排导航图标。',
      detailed:
        '在 App 底部加 Bottom Navigation，包含 首页 / 搜索 / 收藏 / 我的 四项，选中项图标和文字高亮。',
      implementation:
        '固定定位在屏幕底部，容器 role="navigation" aria-label="主导航"，每个项是 button 且 aria-current="page" 表示选中。高度 56px + env(safe-area-inset-bottom)。图标 24px，标签 10–11px。选中态用主色 #1A1917，未选中 #7A766D。点击后切换路由并保持每个 tab 各自的滚动位置。未读数量用绝对定位的 Badge 显示在图标右上角，数字 >99 显示 99+。',
    },
    badPrompt: '加个底部的菜单栏。',
    betterPrompt:
      '加 Bottom Navigation：首页 / 搜索 / 收藏 / 我的，选中态图标文字高亮并加底部安全区适配，未读项显示角标。',
    fitsFor: '移动 App · 多主功能',
    tags: ['主菜单', '拇指区', 'App'],
  },
  {
    id: 'navigation-rail',
    name: 'Navigation Rail',
    chineseName: '侧边导航栏',
    aliases: ['侧边栏导航', '导航轨', 'vertical nav', 'side rail', '竖向导航'],
    category: 'navigation',
    level: 2,
    appearance: ['always'],
    position: ['side'],
    job: ['navigate'],
    oneLine: '竖着放在页面左侧的一列导航项，适合纵向空间比横向空间多的场景。',
    description:
      'Navigation Rail 是底部导航的竖版孪生兄弟。它在平板、桌面和宽屏 Web 上取代 Bottom Navigation，容纳更多入口，并且可以展开显示文字标签。',
    looksLike:
      '你打开一个网页版后台或平板上的工具类 App，左边那列竖着的图标 + 文字导航就是 Navigation Rail；点汉堡按钮时它会展开成完整的侧边栏。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '平板 / 桌面 / 宽屏布局', recommended: true },
      { situation: '入口比 5 个更多', recommended: true },
      { situation: '需要常驻可见的全局导航', recommended: true },
      { situation: '手机竖屏小屏', recommended: false },
    ],
    whenNotToUse: [
      '在手机上它会吃掉宝贵宽度，不如用底部导航或汉堡菜单。',
      '入口只有 2 个时，一排文字链接就够了。',
    ],
    anatomy: [
      { label: 'Rail', labelZh: '导航轨容器', note: '竖向排列，可折叠' },
      { label: 'Destination', labelZh: '导航项', note: '图标 + 标签' },
      { label: 'FAB', labelZh: '浮动按钮位', note: '轨道顶部常放主操作' },
      { label: 'Collapse Toggle', labelZh: '折叠开关', note: '切换图标态 / 展开态' },
    ],
    similarPatterns: ['bottom-navigation', 'sidebar', 'drawer'],
    compareWith: 'sidebar',
    aiPrompt: {
      basic: '左边加一列导航。',
      detailed:
        '在平板布局左侧加 Navigation Rail，图标在上文字在下，包含 概览 / 媒体 / 相册 / 设置，可折叠成只有图标。',
      implementation:
        'Rail 宽 80px（图标态）/ 240px（展开态），垂直 flex。容器 role="navigation"，项为 button + aria-current="page"。折叠状态存 localStorage。切换宽度用 CSS transition 200ms，宽度 <840px 时自动退化为 Drawer（汉堡按钮唤起）。顶部预留 56px 区域放 FAB。',
    },
    badPrompt: '左边加个侧边栏菜单。',
    betterPrompt:
      '在左侧加 Navigation Rail：图标在上、文字在下，宽度 840px 以下自动折叠为汉堡按钮控制的 Drawer。',
    fitsFor: '平板 · 桌面 · 后台',
    tags: ['竖向导航', '宽屏', '可折叠'],
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    chineseName: '侧边栏',
    aliases: ['抽屉导航', '边栏', 'side panel nav', '侧边菜单'],
    category: 'navigation',
    level: 2,
    appearance: ['on-click', 'always'],
    position: ['side'],
    job: ['navigate'],
    oneLine: '贴着屏幕一侧的导航面板，可以常驻，也可以从汉堡按钮滑出来。',
    description:
      'Sidebar 是导航的容器形态：桌面端常驻左侧，移动端变成可滑出的面板。它和 Navigation Rail 的区别是——Sidebar 通常带文字标签和分组标题，是「展开态」的导航。',
    looksLike:
      'Notion 左边那一列页面树、GitHub 左侧的仓库菜单、你打开 Gmail 时从左边滑出的邮箱文件夹列表，都是 Sidebar。',
    platforms: ['web', 'desktop', 'mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '入口多且需要分组和文字标签', recommended: true },
      { situation: '桌面端希望导航常驻可见', recommended: true },
      { situation: '移动端需要容纳底部导航放不下的入口', recommended: true },
      { situation: '页面本身很短、入口只有 2–3 个', recommended: false },
    ],
    whenNotToUse: [
      '只有三四个入口却占掉 240px 宽度，是明显的空间浪费。',
      '移动端常驻 Sidebar 会让内容区变得很窄。',
    ],
    anatomy: [
      { label: 'Panel', labelZh: '面板', note: '固定在侧边，可滑动展开' },
      { label: 'Header', labelZh: '顶部区', note: 'Logo / 标题 / 关闭按钮' },
      { label: 'Nav Group', labelZh: '导航分组', note: '带小标题的一组入口' },
      { label: 'Item', labelZh: '导航项', note: '图标 + 文字，可嵌套子项' },
      { label: 'Scrim', labelZh: '遮罩', note: '移动端覆盖内容的半透明层' },
    ],
    similarPatterns: ['navigation-rail', 'drawer', 'bottom-navigation'],
    compareWith: 'drawer',
    aiPrompt: {
      basic: '加一个侧边栏菜单。',
      detailed:
        '加一个可从左侧滑出的 Sidebar，包含「工作区」和「个人」两个分组，移动端用汉堡按钮唤起，桌面端常驻。',
      implementation:
        '宽度 260px，桌面端（≥1024px）position: fixed 常驻；移动端 transform: translateX(-100%) 隐藏，点击汉堡按钮后加 .open 滑出，同时显示 rgba(0,0,0,0.4) 的 Scrim，点击 Scrim 或按 Esc 关闭。focus trap 住面板内元素，关闭后焦点返回汉堡按钮。导航项是 a 标签带 aria-current="page"，当前项背景用 #F2F0EB。',
    },
    badPrompt: '左边加个能滑出来的菜单。',
    betterPrompt:
      '加可滑出的 Sidebar（宽 260px）：桌面端常驻，移动端汉堡按钮唤起带遮罩，分组显示「工作区 / 个人」，Esc 可关闭。',
    fitsFor: '桌面端 · 大量入口 · 分组',
    tags: ['分组', '常驻', '可滑动'],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    chineseName: '分页',
    aliases: ['分页器', '翻页', '页码', 'pager', 'paging'],
    category: 'navigation',
    level: 2,
    appearance: ['on-click'],
    position: ['bottom'],
    job: ['navigate', 'select'],
    oneLine: '把长长的列表切成几页，底部放一排页码让你跳到其中一页。',
    description:
      'Pagination 的核心价值是「可定位」：用户能记住「第 3 页有东西」，也能直接跳回去。对内容型、翻页型数据（文章列表、搜索结果）它仍然是最稳的方案。',
    looksLike:
      '搜索结果底部那排「‹ 1 2 3 … 48 ›」，淘宝商品列表底部的页码条，都是 Pagination。',
    platforms: ['web', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '内容有明确顺序且用户会想回看', recommended: true },
      { situation: '总数有限、可以一次给出总数', recommended: true },
      { situation: 'URL 需要能定位到具体一页（SEO / 分享）', recommended: true },
      { situation: '无限下滑的社交信息流', recommended: false },
      { situation: '数据量巨大且用户不需要跳页', recommended: false },
    ],
    whenNotToUse: [
      '在手机上，每页 10 条 + 一排页码的操作成本很高，用户会不知道自己在第几页。',
      '当用户的目标是「一直往下刷」而不是「找到第 48 页」，分页就是阻碍。',
    ],
    anatomy: [
      { label: 'Prev / Next', labelZh: '上下页按钮', note: '首尾页时置灰禁用' },
      { label: 'Page Numbers', labelZh: '页码', note: '当前页高亮，两侧加省略号' },
      { label: 'Current', labelZh: '当前页', note: '加粗或换色' },
      { label: 'Total Info', labelZh: '总数信息', note: '「共 1,240 条」' },
    ],
    similarPatterns: ['infinite-scroll', 'stepper', 'load-more'],
    compareWith: 'infinite-scroll',
    aiPrompt: {
      basic: '列表下面加个分页。',
      detailed:
        '在列表底部加 Pagination，显示上一页/下一页和页码，当前页高亮，两侧溢出时用省略号。',
      implementation:
        '渲染 ‹ [1] 2 3 … 48 › 结构。首尾页时按钮 disabled + aria-disabled。当前页按钮加 aria-current="page" 且视觉高亮。窗口宽度 <480px 时只保留 ‹ 上一页 / 下一页 ›，隐藏数字页码。每页 10 条，翻页后滚动回列表顶部并聚焦列表标题（aria-live 播报「第 2 页，共 48 页」）。页码写入 URL ?page=2。',
    },
    badPrompt: '加个翻页的东西。',
    betterPrompt:
      '列表底部加 Pagination：‹ 1 2 3 … 48 ›，当前页高亮，首尾页禁用，手机上只留上一页/下一页，页码同步到 URL。',
    fitsFor: '搜索结果 · 文章列表 · 后台表格',
    tags: ['翻页', '可定位', 'URL 状态'],
    comparisonSlug: 'pagination-vs-infinite-scroll',
  },
  {
    id: 'stepper',
    name: 'Stepper',
    chineseName: '步骤条',
    aliases: ['步骤指示器', '向导步骤', 'step indicator', 'wizard steps', '流程步骤'],
    category: 'navigation',
    level: 2,
    appearance: ['always'],
    position: ['top'],
    job: ['navigate', 'status'],
    oneLine: '一个需要分几步完成的长流程，用一排编号节点告诉你「现在第几步、还剩几步」。',
    description:
      'Stepper 的价值是消解「不知道还有多久」的焦虑。它和 Tabs 的区别在于：Stepper 有先后顺序，步骤之间是流程关系；Tabs 是平行的内容切换。',
    looksLike:
      '电商下单的「购物车 › 填写地址 › 支付 › 完成」，或者注册账号时的「第 2 步 / 共 4 步」——都是 Stepper。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '任务必须按顺序完成（3–5 步最合适）', recommended: true },
      { situation: '步骤多到用户会担心「还有多久」', recommended: true },
      { situation: '允许回退到已完成步骤', recommended: true },
      { situation: '一步就能完成的任务', recommended: false },
      { situation: '步骤数量会动态变化', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '一步就能做完的事情硬拆成三步，是纯粹的用户伤害。',
      '超过 5 步时横向排布会挤爆，移动端应改成「第 2 步 / 共 5 步 + 进度条」。',
    ],
    anatomy: [
      { label: 'Step Node', labelZh: '步骤节点', note: '圆圈，内含序号或图标' },
      { label: 'Connector', labelZh: '连接线', note: '已完成部分染色' },
      { label: 'Label', labelZh: '步骤名', note: '已完成 / 当前 / 未开始三态' },
      { label: 'Current Step', labelZh: '当前步骤', note: '高亮 + 加粗' },
    ],
    similarPatterns: ['progress-bar', 'tabs', 'stepper', 'pagination'],
    compareWith: 'progress-bar',
    aiPrompt: {
      basic: '把流程做成几步，显示当前进度。',
      detailed:
        '把结算流程做成 Stepper，共 4 步：购物车 / 地址 / 支付 / 完成。当前步高亮，已完成步显示对勾，可点击回退到已完成步骤。',
      implementation:
        '渲染 steps 数组并用 flex 横向排列，节点间用 flex-1 的连接线。状态判定：index < current → completed（实心 + Check 图标）；index === current → active（描边加粗）；index > current → upcoming（灰色，disabled）。点击 completed 步骤可回退，upcoming 不可点击。移动端（<640px）隐藏 label 只显示圆点 + 进度文字「第 2 步 / 共 4 步」。容器加 aria-label="结算步骤"，当前步骤加 aria-current="step"。',
    },
    badPrompt: '加个进度提示让用户知道走到哪了。',
    betterPrompt:
      '结算流程用 Stepper 显示 4 步（购物车/地址/支付/完成）：已完成打勾、当前步高亮、可回退到已完成步骤，移动端改为「第 2 步 / 共 4 步」。',
    fitsFor: '结算 · 注册 · 上传流程',
    tags: ['流程', '顺序', '进度感知'],
  },
  {
    id: 'back-button',
    name: 'Back Button',
    chineseName: '返回按钮',
    aliases: ['返回箭头', 'back arrow', '返回导航', 'chevron left'],
    category: 'navigation',
    level: 1,
    appearance: ['always'],
    position: ['top'],
    job: ['navigate'],
    oneLine: '一个向左的箭头，把你带回刚才来的地方。',
    description:
      '返回按钮是移动端最基础也最重要的导航。它回答「我怎么回到刚才那个页面」，因此必须有——尤其在 iOS 上，页面左上角没有返回箭头是严重的使用问题。',
    looksLike:
      '微信聊天列表点进某个人的对话，左上角那个「‹ 名字」就是 Back Button——点它回到列表，并且保留你原来的滚动位置。',
    platforms: ['mobile', 'web'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '移动端进入下一级页面', recommended: true },
      { situation: '用户可能迷失、需要退回上一层', recommended: true },
      { situation: '浏览器历史可以依赖', recommended: true },
      { situation: '这是流程的第 1 步（无上一层可退）', recommended: false },
    ],
    whenNotToUse: [
      '首页的顶层 Tab 上不该有返回按钮——退无可退。',
      'Web 端如果浏览器自带返回，重复做一个往往显得笨重；但在 PWA / 独立 App 里是必须的。',
    ],
    anatomy: [
      { label: 'Icon', labelZh: '箭头图标', note: 'ChevronLeft，24px' },
      { label: 'Label', labelZh: '上一页名', note: '可选，通常是上一页标题' },
      { label: 'Hit Area', labelZh: '点击热区', note: '至少 44×44px' },
    ],
    similarPatterns: ['breadcrumb', 'drawer', 'icon-button'],
    compareWith: 'breadcrumb',
    aiPrompt: {
      basic: '加个返回按钮。',
      detailed:
        '在详情页左上角加 Back Button，向左箭头 + 上一页名称，点击后回到列表并恢复滚动位置。',
      implementation:
        'button 元素 + ChevronLeft 图标（20–24px）+ 上一页标题文字，aria-label="返回列表"。热区最小 44×44px，视觉上不额外加边框。点击调用 history.back()，若无历史记录则 router.push(默认首页)。返回后上一页需恢复 scrollTop（用路由缓存或 sessionStorage 存 scrollY）。在 iOS 上不要同时保留底部导航，改为进入即隐藏、返回才显示。',
    },
    badPrompt: '左上角加个能回去的按钮。',
    betterPrompt:
      '在详情页左上角加 Back Button：ChevronLeft 图标 + 上一页名称，aria-label="返回列表"，点击后退并恢复上一页滚动位置，热区 ≥44×44px。',
    fitsFor: '移动端 · 层级页面',
    tags: ['返回', '热区', '历史'],
  },
];
