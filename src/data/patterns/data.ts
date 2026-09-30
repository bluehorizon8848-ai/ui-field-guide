import type { UIPattern } from '../types';

export const dataPatterns: UIPattern[] = [
  {
    id: 'list',
    name: 'List',
    chineseName: '列表',
    aliases: ['列表', 'list', '列表项', 'list item', '行', 'feed'],
    category: 'data',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['inform', 'navigate'],
    oneLine: '一列一列排下来的信息，每一行是同一类东西。',
    description:
      'List 是信息展示的基本单位。它的关键决策是「一行里放多少信息」和「哪些行可点」。一行可点时，整行都要有 hover 反馈和热区。',
    looksLike:
      '微信聊天列表、设置里的功能列表、系统「设置」App 的每一行、邮件列表——左边头像右边标题再右边时间。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '同类内容有 3 项以上需要纵向浏览', recommended: true },
      { situation: '每项信息结构相同（标题+副标题+值）', recommended: true },
      { situation: '需要快速扫读', recommended: true },
      { situation: '需要对比各项的横向数值', recommended: false },
      { situation: '只有 1–2 项', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '行内塞了五个字段就成表格了——横向对比请用 Table。',
      '行与行之间必须有分隔线或留白，否则会看成一坨。',
    ],
    anatomy: [
      { label: 'Row / Item', labelZh: '列表行', note: '最小热区 48px，整行可点' },
      { label: 'Leading', labelZh: '前导', note: '头像 / 图标' },
      { label: 'Title', labelZh: '主标题', note: '一行截断' },
      { label: 'Subtitle', labelZh: '副标题', note: '次要色，一行' },
      { label: 'Trailing', labelZh: '尾部', note: '值 / 时间 / 箭头' },
      { label: 'Divider', labelZh: '分隔线', note: '与文字左对齐，不通栏' },
    ],
    similarPatterns: ['table', 'card', 'timeline', 'list'],
    compareWith: 'table',
    aiPrompt: {
      basic: '加个列表。',
      detailed:
        '加一个设置列表：每行左侧图标 + 标题 + 右侧当前值 + 箭头，整行可点，行间有细分隔线，分组之间有分组标题。',
      implementation:
        '<ul> + <li>，每行用 <button> 或 <a> 包裹以保证整行可点。行高最小 48px，padding 16px。分隔线用 li 内 ::after 绝对定位 left 从图标右侧开始（与文字左对齐，不通栏）。分组用 <h3> 标题 + 上下间距，不用分隔线。整行 hover 背景 #F2F0EB。有尾部文字（如「跟随系统」）时用次要色 14px。',
    },
    badPrompt: '加个列表显示数据。',
    betterPrompt:
      '加设置 List：每行用 button 包裹保证整行可点、高度 ≥48px、行左侧图标 + 标题 + 右侧值 + 箭头，分隔线与文字左对齐不通栏，分组用标题 + 间距而非分隔线。',
    fitsFor: '设置 · 消息 · 搜索结果',
    tags: ['纵向', '扫读', '可点行'],
  },
  {
    id: 'table',
    name: 'Table',
    chineseName: '表格',
    aliases: ['表格', 'table', '数据表', 'data grid', '表'],
    category: 'data',
    level: 2,
    appearance: ['always'],
    position: ['inline'],
    job: ['inform'],
    oneLine: '行列交叉，用来横向对比多个对象的多个属性。',
    description:
      'List 让人纵向扫，Table 让人横向比。当用户的问题是「谁最高」「哪一行超标了」，就该用表格。表格的代价是横向空间，所以必须有移动端降级方案。',
    looksLike:
      '后台的订单管理页面、Excel 里的数据区、日历和课表、财报里的数字对照表。',
    platforms: ['web', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '需要横向对比同一属性的多个值', recommended: true },
      { situation: '字段多且结构固定（订单、用户、日志）', recommended: true },
      { situation: '需要排序、筛选', recommended: true },
      { situation: '只是展示 3 个字段的少量数据', recommended: 'mostly' },
      { situation: '手机端窄屏', recommended: false },
    ],
    whenNotToUse: [
      '移动端表格必须降级为卡片列表，否则用户会左右拖到崩溃。',
      '别把表格的每一格都做成可点——用户会不知道哪些能操作。',
    ],
    anatomy: [
      { label: 'Header Row', labelZh: '表头', note: 'sticky 吸顶，带排序箭头' },
      { label: 'Cell', labelZh: '单元格', note: '左对齐文本，右对齐数字' },
      { label: 'Row Hover', labelZh: '行悬停', note: '整行高亮，提示可点' },
      { label: 'Column Resize', labelZh: '列宽调整', note: '拖拽表头边缘，可选' },
      { label: 'Empty Cell', labelZh: '空值', note: '显示「—」而不是空白' },
    ],
    similarPatterns: ['list', 'stat-card', 'timeline'],
    compareWith: 'list',
    aiPrompt: {
      basic: '加个表格显示数据。',
      detailed:
        '加一个订单数据表格：表头可点击排序，数字列右对齐，状态用彩色 Chip 展示，表格可横向滚动，表头吸顶。',
      implementation:
        '<table> + <thead> + <tbody>，数字列加 class 加 text-align: right + font-variant-numeric: tabular-nums。表头 th 做成 button 支持排序并加 aria-sort="ascending"。外层容器 overflow-x: auto。thead position: sticky; top: 0; z-index: 1。空值显示「—」而非空字符串。移动端（<768px）用 CSS 改造成卡片布局：每行 display: block，字段名用 data-label 属性通过 ::before 显示。',
    },
    badPrompt: '加个表格。',
    betterPrompt:
      '加数据 Table：表头 button 可排序并带 aria-sort，数字列右对齐 + tabular-nums，表头 sticky 吸顶，容器横向滚动，空值显示「—」，移动端降级为卡片布局并用 data-label 显示字段名。',
    fitsFor: '后台 · 数据 · 日志',
    tags: ['横向对比', '多字段', '排序'],
  },
  {
    id: 'badge',
    name: 'Badge',
    chineseName: '角标',
    aliases: ['角标', 'badge', '徽标', '小红点', '红点', 'notification badge'],
    category: 'data',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['status'],
    oneLine: '贴在图标角落的一个小标记，用来表示「有东西需要你看」。',
    description:
      'Badge 是「元信息中的元信息」：它自己不承载内容，只在某个元素上挂一个状态。最常见的是红点（未读）和数字（未读数）。它的滥用会造成「红点疲劳」。',
    looksLike:
      '微信底 tab 上的未读红点、App 图标右上角的「99+」、导航栏「消息」图标右上角的数字。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '表示有未读内容或新消息', recommended: true },
      { situation: '需要引起注意但不需要立即处理', recommended: true },
      { situation: '在图标右上角标记状态', recommended: true },
      { situation: '表示数量统计（购物车 3 件）', recommended: true },
      { situation: '表示一个「正常」状态', recommended: false },
    ],
    whenNotToUse: [
      '红点一旦到处都有，用户就会全部无视。宁可少用。',
      '99+ 的红点如果没有数字，用户会困惑「到底多少条」。',
    ],
    anatomy: [
      { label: 'Anchor', labelZh: '宿主元素', note: '图标或头像' },
      { label: 'Bubble', labelZh: '角标', note: '绝对定位在右上角' },
      { label: 'Count', labelZh: '数量', note: '>99 显示 99+' },
      { label: 'Dot', labelZh: '纯红点', note: '无数字，仅表示「有」' },
    ],
    similarPatterns: ['chip', 'alert', 'icon-button', 'badge'],
    compareWith: 'chip',
    aiPrompt: {
      basic: '图标上加个红点。',
      detailed:
        '在底部导航「消息」图标右上角加 Badge：未读 5 条时显示数字，超过 99 显示「99+」，0 条时隐藏，悬停时显示 Tooltip「5 条未读消息」。',
      implementation:
        'Badge 绝对定位在宿主右上角（top: -4px; right: -6px），最小宽 16px 高 16px，圆角全满，红底白字 10px。数字为 1 位时为圆形，2 位以上变成胶囊（padding 0 5px）。位置要跟随 safe-area。数量为 0 时 display: none。加 aria-label="5 条未读消息" 到宿主元素上。',
    },
    badPrompt: '给图标加个红点提示。',
    betterPrompt:
      '给图标加 Badge：绝对定位右上角、红底白字胶囊、>99 显示「99+」、0 时隐藏，宿主加 aria-label="N 条未读"，红点不可滥用避免视觉疲劳。',
    fitsFor: '未读 · 提醒 · 计数',
    tags: ['未读', '角标', '计数'],
  },
  {
    id: 'chip-display',
    name: 'Tag',
    chineseName: '内容标签',
    aliases: ['标签', 'tag', '内容标签', '分类标签', 'label', '状态标签'],
    category: 'data',
    level: 2,
    appearance: ['always'],
    position: ['inline'],
    job: ['status', 'inform'],
    oneLine: '贴在内容旁边表示分类或状态的小标签，点不了。',
    description:
      'Tag 是 Chip 的只读版本：它只用来标记「这是什么」，不能点。它的价值在于让用户快速扫读时就能分类——比如一列照片里哪些是「视频」哪些是「已收藏」。',
    looksLike:
      'GitHub Issue 上的彩色 label、博客文章顶部的「前端 / 性能」分类、照片库里的「视频」角标。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '标记内容的分类或状态', recommended: true },
      { situation: '帮助快速扫读时分清类型', recommended: true },
      { situation: '多个内容并排展示时区分属性', recommended: true },
      { situation: '点击后应触发筛选或导航', recommended: false },
      { situation: '需要用户选择它', recommended: false },
    ],
    whenNotToUse: [
      '颜色是 Tag 的主要信息通道——超过 6 种颜色后用户就无法凭颜色分类了。',
      'Tag 和 Badge 的区别：Tag 在内容上，Badge 在图标上。',
    ],
    anatomy: [
      { label: 'Pill', labelZh: '胶囊', note: '圆角全满，浅色底' },
      { label: 'Text', labelZh: '文字', note: '12px，同色系深色' },
      { label: 'Color', labelZh: '颜色', note: '代表语义，不是装饰' },
    ],
    similarPatterns: ['chip', 'badge'],
    compareWith: 'badge',
    aiPrompt: {
      basic: '加几个内容标签。',
      detailed:
        '在每张卡片底部加一个内容 Tag，用不同颜色表示类型（如「视频」蓝、「收藏」黄、「已编辑」灰），不可点击。',
      implementation:
        'span 元素，圆角全满，padding 2px 8px，12px 文字。颜色用「浅底 + 深字」同色系（如蓝 #EEF3F8 底 + #35618E 字），保证对比度 ≥4.5:1。最多定义 4–5 种语义色并全局统一。Tag 不加 hover 效果和 cursor: pointer，明确它是只读的。',
    },
    badPrompt: '给内容加个标签。',
    betterPrompt:
      '加内容 Tag：浅底深字同色系（保证 4.5:1 对比）、圆角全满 padding 2px 8px、最多 4–5 种语义色全局统一、不加 hover 和 pointer 以表明只读。',
    fitsFor: '分类 · 状态 · 类型',
    tags: ['分类', '颜色语义', '只读'],
  },
  {
    id: 'stat-card',
    name: 'Stat Card',
    chineseName: '统计卡片',
    aliases: ['统计卡', 'stat card', '数据卡片', '指标卡', 'metric card', 'kpi'],
    category: 'data',
    level: 2,
    appearance: ['always'],
    position: ['inline'],
    job: ['inform'],
    oneLine: '一个只装一个数字的小卡片，配上标签和变化趋势。',
    description:
      'Stat Card 回答的是「现在怎么样」。它必须包含：指标名（说清是什么）、数值（大的）、以及对比信息（比上期涨了多少）。少了第三项，这个卡就只是一个孤零零的数字。',
    looksLike:
      '后台首页顶部那几个并排的小卡片：「今日新增 1,284 ↑12%」「活跃用户 8,420 ↓3%」「转化率 4.2%」。',
    platforms: ['web', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '需要一眼看到几个核心指标', recommended: true },
      { situation: '指标有明确的对比基准（昨天、上周）', recommended: true },
      { situation: '数字比趋势更重要', recommended: true },
      { situation: '需要展示数字的变化过程', recommended: 'mostly' },
      { situation: '指标之间需要交叉分析', recommended: false },
    ],
    whenNotToUse: [
      '涨跌颜色要遵守习惯：国内用红涨绿跌，美股用绿涨红跌，别搞反。',
      '「↑12%」必须说清和什么比——和上个月比？同比？',
    ],
    anatomy: [
      { label: 'Label', labelZh: '指标名', note: '12px 次要色' },
      { label: 'Value', labelZh: '数值', note: '28px，tabular-nums' },
      { label: 'Delta', labelZh: '变化', note: '↑12% vs 上周' },
      { label: 'Context', labelZh: '基准', note: '说清对比对象' },
    ],
    similarPatterns: ['card', 'table', 'stat-card', 'progress-bar'],
    compareWith: 'card',
    aiPrompt: {
      basic: '加几个数据显示。',
      detailed:
        '加一组统计卡片：今日新增 1,284（较昨日 ↑12%）、活跃用户 8,420（↓3%）、转化率 4.2%（持平）。涨跌用红涨绿跌。',
      implementation:
        '网格布局，桌面 4 列平板 2 列手机 1 列。每卡 padding 16px。指标名 12px #7A766D，数值 28px medium + font-variant-numeric: tabular-nums，变化行 12px 带箭头图标。国内习惯用红涨绿跌：涨用 #A8342C 跌用 #2C7355（务必和用户确认习惯）。变化必须标注基准（如「较昨日」）。数值为 0 时显示「—」而不是「0」，避免误读。',
    },
    badPrompt: '加几个数据显示最近数据。',
    betterPrompt:
      '加统计卡片组：指标名 12px 次要色 + 数值 28px tabular-nums + 变化行（必须标注基准如「较昨日」），国内红涨绿跌，桌面 4 列平板 2 列手机 1 列，值为 0 时显示「—」避免误读。',
    fitsFor: '后台首页 · 仪表盘 · 概览',
    tags: ['指标', '对比', '扫读'],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    chineseName: '头像',
    aliases: ['头像', 'avatar', '用户头像', 'profile picture', '圆形头像'],
    category: 'data',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['inform'],
    oneLine: '代表一个人或一个实体的圆形小图。',
    description:
      'Avatar 帮用户在不看名字的情况下快速认出「这是谁」。它的降级方案极其重要：图片加载失败时显示姓名首字母（中文取姓氏），再失败显示通用人形图标。',
    looksLike:
      '聊天列表左边那个圆形人像、GitHub 用户名旁边的小圆图、评论区每一行的头像。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '需要区分不同的人或实体', recommended: true },
      { situation: '列表中有多个人物', recommended: true },
      { situation: '需要显示「当前是谁登录了」', recommended: true },
      { situation: '只有一个人且不会混淆', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '头像加载不出来还留一片灰，会让页面看起来像坏了——一定要有降级方案。',
      '头像不是点击目标，点击应该落在整行或名字上。',
    ],
    anatomy: [
      { label: 'Image', labelZh: '图片', note: '正方形裁切为圆形' },
      { label: 'Fallback', labelZh: '降级', note: '首字母 / 默认图标' },
      { label: 'Ring', labelZh: '描边', note: '在线状态或 VIP 标记' },
      { label: 'Size', labelZh: '尺寸', note: 'xs 16 / sm 24 / md 32 / lg 40 / xl 64' },
    ],
    similarPatterns: ['list', 'card', 'chip'],
    compareWith: 'list',
    aiPrompt: {
      basic: '加个头像。',
      detailed:
        '给列表每行加头像：28px 圆形，加载失败时降级为姓名首字母（中文取姓），再失败显示默认人形图标；在线用户加绿色描边。',
      implementation:
        '圆形用 border-radius: 9999px + overflow: hidden + object-fit: cover。img 加 onError 处理：第一次失败切换到首字母 span（背景用从名字哈希生成的柔和色），第二次失败切换到默认 SVG 图标。在线状态用 2px 绿边 + 2px 白边间隔（border: 2px solid #fff; box-shadow: 0 0 0 2px #2C7355）。alt 用用户真实姓名。尺寸档位 16/24/32/40/64。',
    },
    badPrompt: '加个用户头像。',
    betterPrompt:
      '加头像：圆形 + object-fit: cover，onError 降级链为「首字母（中文取姓）→ 默认人形图标」，背景色从名字哈希生成，在线状态用白边 + 绿描边，alt 用真实姓名。',
    fitsFor: '用户 · 评论者 · 成员',
    tags: ['识别', '降级', '圆形'],
  },
  {
    id: 'timeline',
    name: 'Timeline',
    chineseName: '时间线',
    aliases: ['时间线', 'timeline', '时间轴', '动态', '活动记录', 'feed'],
    category: 'data',
    level: 2,
    appearance: ['always'],
    position: ['inline'],
    job: ['inform'],
    oneLine: '按时间顺序排列的一条线，最新的在最上面。',
    description:
      'Timeline 是「带时间的列表」。它比普通 List 多了两件事：明确的时间戳，以及视觉上的连续性（一条竖线串起来）。它表达的是「发生过一串事」。',
    looksLike:
      '微信朋友圈、订单的物流轨迹、GitHub 的提交记录、系统更新的变更日志。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '事件有明确的时间顺序', recommended: true },
      { situation: '需要体现过程和进展（物流、状态变化）', recommended: true },
      { situation: '内容是「发生过的」而非「当前的」', recommended: true },
      { situation: '需要展示未来计划（时间倒计时）', recommended: 'mostly' },
      { situation: '内容没有时间属性', recommended: false },
    ],
    whenNotToUse: [
      '内容量大时，竖线会让页面很碎——考虑用 List 加时间戳。',
      '时间相同的多个事件要合并，不要出现两个相同时间点。',
    ],
    anatomy: [
      { label: 'Time Group', labelZh: '时间分组', note: '「今天」「昨天」' },
      { label: 'Item', labelZh: '条目', note: '头像 + 内容' },
      { label: 'Rail', labelZh: '时间轴', note: '左侧竖线，贯穿全部' },
      { label: 'Dot', labelZh: '节点', note: '轴上的小圆点' },
    ],
    similarPatterns: ['list', 'timeline'],
    compareWith: 'list',
    aiPrompt: {
      basic: '按时间显示记录。',
      detailed:
        '做一个时间线：按「今天 / 昨天 / 更早」分组，左侧一条竖线加节点，每条显示头像、内容和时间，新内容插在最上面。',
      implementation:
        '结构用 ol/li 或 div+role="list"。左侧固定 32px 宽的竖线（border-left），每条加一个绝对定位的圆点。头部加 sticky 的日期分组标题（背景与页面同色，避免透出内容）。新消息插入时用动画（高度过渡 + 轻微高亮后褪去）提示。虚拟列表场景下要处理滚动性能。',
    },
    badPrompt: '按时间顺序显示记录。',
    betterPrompt:
      '做 Timeline：按「今天/昨天/更早」分组、左侧竖线加节点圆点、sticky 日期分组标题、新条目插入时做高亮淡出动画、time 元素用 <time datetime> 便于语义。',
    fitsFor: '动态 · 物流 · 变更日志',
    tags: ['时序', '过程', '分组'],
  },
];
