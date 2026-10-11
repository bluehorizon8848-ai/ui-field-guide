import type { UIPattern } from '../types';

export const layoutPatterns: UIPattern[] = [
  {
    id: 'container',
    name: 'Container',
    chineseName: '版心',
    aliases: ['版心', 'container', '内容包裹区', 'max-width wrapper', '页面边距', '居中版心', 'content well'],
    category: 'layout',
    level: 1,
    appearance: ['always'],
    position: ['center', 'inline'],
    job: ['expand', 'inform'],
    oneLine: '限制页面最大宽度并居中，防止大屏文字过长散架、小屏横向溢出。',
    description:
      '版心的本质是可读性边界与留白秩序。如果没有版心约束，在宽屏显示器上一行文字会被拉伸到几千像素，人眼阅读时频繁串行断裂（违反 65ch 最佳阅读行宽法则）；而在小屏端，生硬的固定宽度又会引发横向滚动灾难。好的版心是自适应的弹性安全区。',
    looksLike:
      '无论屏幕是 13 寸笔记本还是 34 寸带鱼屏，网页的正文和主要卡片始终规矩地收拢在中间最舒适的 1200px 范围内，两侧留出呼吸感白边。',
    platforms: ['web', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '正文阅读、博客、长文本页面（限制 65ch~75ch）', recommended: true },
      { situation: 'SaaS 落地页、卡片网格的主内容区域', recommended: true },
      { situation: '表单、设置页、结账结算流程', recommended: true },
      { situation: '地图全景、仪表盘看板大屏、视频剪辑轨道', recommended: false },
      { situation: '某些全宽背景条（背景全宽，但内容仍在版心内）', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '全屏沉浸式应用（如地图、在线白板、视频播放器），强加版心会切碎沉浸感。',
      '把版心写死固定宽度（如 width: 1200px），这会导致手机端出现横向滚动条。',
    ],
    anatomy: [
      { label: 'Max-Width', labelZh: '最大宽度约束', note: '通常为 1080px~1280px (max-w-7xl)' },
      { label: 'Margin Auto', labelZh: '自动外边距', note: 'mx-auto 实现水平居中' },
      { label: 'Gutter / Padding', labelZh: '两侧防贴边安全留白', note: '移动端 px-4，桌面端 px-8' },
      { label: 'Content Well', labelZh: '内部正文井', note: '长文本嵌套 max-w-prose' },
    ],
    similarPatterns: ['full-bleed', 'sidebar-layout', 'hero', 'split-screen'],
    compareWith: 'full-bleed',
    aiPrompt: {
      basic: '页面内容居中，别全屏铺满。',
      detailed:
        '页面主体使用居中版心：最大宽度 1280px，水平居中，移动端两侧留 16px 边距，大屏留 32px 边距，正文区域不超过 65 字符行宽。',
      implementation:
        '最外层 section 宽度 full，内部包裹 div 使用 class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"。正文内容区进一步包裹 class="max-w-prose" (约 65ch) 保证阅读行长。禁止对 container 写死 px 宽度，防止移动端产生横向滚动条。媒体对象与卡片网格在版心内使用百分比或自适应 Grid。',
    },
    badPrompt: '页面宽度做 1200px 居中。',
    betterPrompt:
      '页面主体用自适应版心：max-w-7xl mx-auto px-4 sm:px-6 lg:px-8，文章正文用 max-w-prose 限制行宽，背景通栏而文字内容收在版心内。',
    fitsFor: '文章阅读 · SaaS 落地页 · 表单提交 · 内容列表',
    tags: ['版心', '自适应', '可读行宽', 'max-w'],
  },
  {
    id: 'hero',
    name: 'Hero Section',
    chineseName: '首屏焦点区',
    aliases: ['首屏', 'hero section', '首屏大图', '头图巨幅', 'hero banner', '主视觉区', '首屏焦点'],
    category: 'layout',
    level: 1,
    appearance: ['always'],
    position: ['top', 'center'],
    job: ['inform', 'expand'],
    oneLine: '页面首屏核心展示区，用大标语、副标题、行动按钮与主视觉锁定用户第一眼。',
    description:
      'Hero 是整个网站的「橱窗门面」。用户在 3 秒钟内就会根据 Hero 决定是继续浏览还是关闭标签页。一个优秀的 Hero 绝不是堆砌杂乱元素，而是清晰传达「我们是什么、为你解决什么问题、现在能做什么」，并以精准的视觉层级和强烈的行动号召（CTA）驱动转化。',
    looksLike:
      '打开官网第一屏：顶部一行醒目的宣传标语大字，下方两行清晰的价值解释，一个高亮的主按钮「免费开始」，右侧浮动着精致的软件界面预览截图。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '产品官网、SaaS 落地页、品牌宣传首页', recommended: true },
      { situation: '重磅功能发布或重大营销活动专题页', recommended: true },
      { situation: '个人作品集主页的第一屏定位介绍', recommended: true },
      { situation: '日常高频使用的后台管理系统内页（浪费垂直空间）', recommended: false },
      { situation: '纯工具型效率产品（打开就该直接展示输入框或工作台）', recommended: false },
    ],
    whenNotToUse: [
      '在日常高频工具或后台仪表盘里放巨大 Hero，强迫用户每次都往下滚动才能干活。',
      '死板写死 100vh 高度，这在移动端会被手机浏览器动态缩放的底栏遮挡主要 CTA。',
    ],
    anatomy: [
      { label: 'Eyebrow', labelZh: '眉标微徽章', note: '发布动态或分类小标签' },
      { label: 'Display H1', labelZh: '核心主标题', note: '大字号、一句话价值主张' },
      { label: 'Subtitle', labelZh: '副说明文案', note: '补充使用场景与解决的痛点' },
      { label: 'CTA Group', labelZh: '行动号召按钮组', note: '主操作高亮 + 次操作幽灵按钮' },
      { label: 'Visual Showcase', labelZh: '主视觉载体', note: '产品模型、截图或 3D 插画' },
    ],
    similarPatterns: ['container', 'split-screen', 'bento-grid', 'full-bleed'],
    compareWith: 'split-screen',
    aiPrompt: {
      basic: '首页顶部做个 Hero。',
      detailed:
        '构建首屏 Hero 区：H1 标题「5 分钟构建 AI 应用」，副标题两行解释核心优势，主 CTA「立即免费体验」高亮按钮配次 CTA「查看文档」，下方配产品半浮动深色预览图。',
      implementation:
        '使用 min-h-[80vh] flex flex-col items-center justify-center text-center。H1 使用 text-4xl sm:text-6xl font-extrabold tracking-tight。CTA 按钮组合使用 flex flex-wrap gap-4，主按钮添加微悬浮与阴影。产品预览图使用 rounded-xl border border-line shadow-2xl，顶部留出安全过渡间距。移动端自动折叠为紧凑排列，避免首屏遮挡。',
    },
    badPrompt: '首页顶部放个大图大字。',
    betterPrompt:
      '构建 SaaS 首屏 Hero：min-h-[85vh]，居中排列 eyebrow 徽章、紧凑 H1 (text-5xl tracking-tight)、灰阶副标题、主次 CTA 按钮组，底部配 1 度斜切视差产品截图。',
    fitsFor: 'SaaS 落地页 · 产品官网 · 品牌活动 · 开源项目主页',
    tags: ['首屏', 'Hero', '转化率', 'H1', 'CTA'],
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    chineseName: '便当盒网格',
    aliases: ['便当盒网格', 'bento grid', 'bento box', '苹果风格网格', '模块拼图网格', '不对称网格'],
    category: 'layout',
    level: 2,
    appearance: ['always'],
    position: ['center', 'inline'],
    job: ['inform', 'expand'],
    oneLine: '源自日式便当盒的非对称模块化网格，通过卡片高低宽窄的拼图组合展示特性。',
    description:
      'Bento Grid 打破了传统等宽等高卡片的死板感。它借鉴便当盒将主菜、配菜、米饭划分不同规格格子的思路，让最重要的核心卖点占据大尺寸格子（如 2x2 或 2x1），次要功能分布在周围小格子中，既有强烈的视觉节奏与聚焦，又保持了整体外轮廓的整齐划一。',
    looksLike:
      '苹果发布会或现代科技官网：左上一块大黑色卡片展示核心芯片架构，右上是两块小浅色卡片展示续航与接口，底部是一条横向长条卡片展示生态联动。',
    platforms: ['web', 'desktop', 'mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '产品核心功能与特性矩阵展示（Features Section）', recommended: true },
      { situation: '功能之间有明确的主次层级、权重差异', recommended: true },
      { situation: '需要呈现高端、现代、科技感的设计语言', recommended: true },
      { situation: '数据结构完全同构的大规模数据列表（更适合普通表格或分页列表）', recommended: false },
      { situation: '高度不定、动态自增的 UGC 用户评论或图片流（更适合瀑布流）', recommended: false },
    ],
    whenNotToUse: [
      '强行把 10 个权重完全相同的普通表单选项塞进便当盒，显得杂乱无章。',
      '在移动端未做单列折叠回退，导致小卡片在手机屏幕上被挤压变形字体重叠。',
    ],
    anatomy: [
      { label: 'Hero Tile', labelZh: '主角大卡片', note: '占据 2 列或 2 行的核心焦点' },
      { label: 'Supporting Tiles', labelZh: '辅助小卡片', note: '1x1 标准规格展示细节' },
      { label: 'Wide Tile', labelZh: '横向通栏卡片', note: '跨越整行展示全景或图表' },
      { label: 'Uniform Radius & Gap', labelZh: '统一圆角与间距', note: '外边缘整齐闭合的关键' },
    ],
    similarPatterns: ['masonry', 'hero', 'container', 'full-bleed'],
    compareWith: 'masonry',
    aiPrompt: {
      basic: '做个便当盒网格展示功能。',
      detailed:
        '使用 Bento Grid 布局展示 4 个功能：第 1 个是 2 列宽的核心卡片（带动态图表），第 2、3 个是 1 列的小卡片，第 4 个横向占满底部两列。统一圆角 16px、浅灰微描边。',
      implementation:
        '容器采用 display: grid, grid-template-columns: repeat(3, minmax(0, 1fr)), gap: 16px。第 1 项设置 md:col-span-2 md:row-span-2，其余项为标准 1 列，末项设置 md:col-span-3。小屏自动回退为 grid-cols-1。每个 Bento 卡片使用 overflow-hidden, rounded-2xl, border, p-6, 内部元素采用绝对定位或 Flex 排布。',
    },
    badPrompt: '排几个大小不一样的卡片。',
    betterPrompt:
      '用 Bento Grid 布局呈现特性：grid-cols-1 md:grid-cols-3 gap-4，核心亮点卡片设置 col-span-2 row-span-2 承载大截图，周边小卡承载指标与微图标，移动端折叠为单列。',
    fitsFor: 'SaaS 功能矩阵 · 苹果风硬件特性 · 个人作品集亮点 · 仪表盘核心指标',
    tags: ['Bento', '便当盒', 'CSS Grid', '非对称', '科技感'],
  },
  {
    id: 'masonry',
    name: 'Masonry Grid',
    chineseName: '瀑布流',
    aliases: ['瀑布流', 'masonry', 'waterfall', '小红书排版', 'pinterest grid', '不等高流式布局'],
    category: 'layout',
    level: 2,
    appearance: ['always', 'on-scroll'],
    position: ['center', 'inline'],
    job: ['inform', 'expand'],
    oneLine: '元素宽度一致、高度不等的错落多列流式布局，多用于富图片社区与图文卡片。',
    description:
      '瀑布流解决了「不同长宽比内容在传统对齐网格中造成大片底部空白」的难题。就像砌砖师傅砌砖墙一样，下一张卡片会自动插入到当前高度最短的那一列下方，消灭割裂的留白，形成极其紧凑、沉浸且引人不断往下滚动的视觉流动体验。',
    looksLike:
      '小红书或 Pinterest 首页：左边一张长图买家秀，右边是一张方形短卡片，右边卡片下方紧接着补上一张中等长度的美食图，两列底部错落有致但内部紧凑饱满。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '图片社区、摄影画廊、灵感收集站（小红书/Pinterest）', recommended: true },
      { situation: '用户生成内容（UGC）卡片，图片尺寸和文字长短不可控', recommended: true },
      { situation: '商品导购、买家秀穿搭瀑布流', recommended: true },
      { situation: '需要严格按行对比参数的规格参数表（极易导致阅读混淆）', recommended: false },
      { situation: '强因果顺序或强逻辑先后步骤的流程展示', recommended: false },
    ],
    whenNotToUse: [
      '用在需要逐行从左到右对比数据差异的场景中，错位的高度会严重打乱人眼的横向扫描线。',
      '未设置卡片内部防断裂（break-inside-avoid），导致一张卡片被浏览器硬生生切成上下两半跨列显示。',
    ],
    anatomy: [
      { label: 'Columns', labelZh: '自适应列数', note: '根据屏幕宽度划分 2~4 列' }
      , { label: 'Variable-Height Card', labelZh: '不定高卡片', note: '根据图片自然比例撑开高度' }
      , { label: 'Gutter Gap', labelZh: '列间与行间距', note: '列与行保持等距水槽' }
      , { label: 'Break Avoid', labelZh: '防断裂规则', note: 'CSS break-inside: avoid 防止卡片被腰斩' }
    ],
    similarPatterns: ['bento-grid', 'container', 'full-bleed', 'sidebar-layout'],
    compareWith: 'bento-grid',
    aiPrompt: {
      basic: '做个类似小红书的瀑布流。',
      detailed:
        '用 CSS 多列布局实现两列（手机端）到三列（桌面端）图片瀑布流：卡片圆角 12px，底部边距 16px，设置防断裂，卡片内包含图片、标题和点赞数。',
      implementation:
        '容器使用 CSS Multi-column 属性：class="columns-2 md:columns-3 lg:columns-4 gap-4"。内部卡片必须添加 class="break-inside-avoid mb-4 rounded-xl overflow-hidden bg-surface border border-line"。图片使用 w-full h-auto object-cover 防止拉伸。对于超大量图片推荐采用虚拟滚动或按列拆分数组渲染以优化重排性能。',
    },
    badPrompt: '做个高低不平的卡片列表。',
    betterPrompt:
      '实现响应式瀑布流：columns-2 sm:columns-3 lg:columns-4 gap-4，卡片应用 break-inside-avoid mb-4，图片采用自适应比例，避免重排闪烁。',
    fitsFor: '图片素材库 · UGC 社交流 · 电商买家秀 · 灵感看板',
    tags: ['瀑布流', 'Masonry', '小红书', 'Pinterest', '多列布局'],
  },
  {
    id: 'split-screen',
    name: 'Split Screen',
    chineseName: '双栏分屏',
    aliases: ['双栏分屏', 'split screen', '对半分屏', '50-50 split', '分屏布局', '左右对屏'],
    category: 'layout',
    level: 2,
    appearance: ['always'],
    position: ['center', 'side'],
    job: ['inform', 'input'],
    oneLine: '将屏幕水平切分为左右两半，一侧负责沉浸式品牌传达，另一侧承载核心交互。',
    description:
      '双栏分屏是兼顾「感性吸引」与「理性操作」的经典范式。它常用于登录注册、结账流程或两款核心产品的对决对比中：左半屏通常是高饱和度的品牌大图、动画或用户口碑（情绪侧），右半屏则是极简克制的输入表单或结账清单（任务侧），让用户在专注操作时始终感受到品牌安全感。',
    looksLike:
      '现代 SaaS 登录页：左边整整半屏是深色渐变与精美产品插画，滚动轮播用户好评；右边半屏是干净利落的白底账号密码输入框与第三方登录按钮。',
    platforms: ['web', 'desktop', 'mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '登录 / 注册 / 找回密码全屏页面', recommended: true },
      { situation: '双重选择分支（例如：“我是个人开发者” vs “我是企业团队”）', recommended: true },
      { situation: '结账流程（左侧品牌与商品回顾，右侧支付方式填写）', recommended: true },
      { situation: '移动端原生应用主流程（屏宽太窄，强行 50/50 会两边都挤爆）', recommended: false },
      { situation: '内容极多的大型数据报表（横向空间会被严重浪费）', recommended: false },
    ],
    whenNotToUse: [
      '在小屏幕或手机端依然坚持左右并排，导致两侧文字全部被挤压断行。',
      '移动端未做优雅降级：正确的做法是手机端隐藏左侧装饰图，只保留右侧核心表单。',
    ],
    anatomy: [
      { label: 'Brand Visual Pane', labelZh: '品牌视觉半屏', note: '情绪渲染、背景动效、用户证言' },
      { label: 'Interactive Pane', labelZh: '交互表单半屏', note: '任务输入、表单操作、主按钮' },
      { label: 'Central Divider', labelZh: '中分分割线', note: '平滑色彩交界或微妙描边' },
      { label: 'Mobile Collapse', labelZh: '移动端折叠规则', note: '小屏下单列折叠或隐藏背景侧' },
    ],
    similarPatterns: ['hero', 'sidebar-layout', 'container', 'full-bleed'],
    compareWith: 'sidebar-layout',
    aiPrompt: {
      basic: '做个左右对半切的登录页面。',
      detailed:
        '构建 50/50 分屏登录页：桌面端左侧半屏深蓝色背景，配产品插画和客户名言；右侧半屏居中显示干净的登录表单。移动端自动隐藏左侧视觉，右侧全屏展开。',
      implementation:
        '外层使用 min-h-screen grid grid-cols-1 lg:grid-cols-2。左侧面板使用 hidden lg:flex flex-col justify-between p-12 bg-ink text-surface，承载品牌标识与引言。右侧面板使用 flex items-center justify-center p-6 sm:p-12 bg-surface，内部包裹 max-w-md w-full 表单。表单元素居中且保留充足留白。',
    },
    badPrompt: '页面左边放大图右边放表单。',
    betterPrompt:
      '构建响应式双栏分屏登录页：min-h-screen lg:grid-cols-2，左侧情绪看板（大屏可见，深色品牌背景+引言），右侧极简表单（居中 max-w-md），移动端优雅降级单屏。',
    fitsFor: '用户登录/注册 · 结账结算 · 双向受众分支选择 · 产品对比',
    tags: ['分屏', 'Split', '登录页', '50/50', '响应式折叠'],
  },
  {
    id: 'sidebar-layout',
    name: 'Sidebar App Shell',
    chineseName: '应用侧栏架构',
    aliases: ['侧栏布局', 'sidebar layout', 'app shell', '仪表盘骨架', '左侧菜单右侧内容', '后台外壳'],
    category: 'layout',
    level: 2,
    appearance: ['always'],
    position: ['side', 'center'],
    job: ['navigate', 'expand'],
    oneLine: '左侧常驻导航侧栏、右侧主工作台独立滚动的现代桌面与 Web 应用骨架。',
    description:
      '应用侧栏架构（App Shell）是 SaaS、生产力工具与中后台系统的基石。与普通营销网页不同，应用外壳会锁死浏览器整屏高度（h-screen overflow-hidden），侧边栏常驻左侧保证工作上下文随时可切换，主内容区在右侧独立滚动。同时支持侧边栏收折为紧凑图标条（Rail），移动端自动转换为抽屉。',
    looksLike:
      'Notion、Linear 或飞书的桌面端：最左边是一列深灰色的工作空间树和菜单导航，右边是一片宽敞的主文档区，中间滚动时左侧菜单丝毫不动。',
    platforms: ['web', 'desktop', 'mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: 'SaaS 软件、管理后台、企业应用、CRM 仪表盘', recommended: true },
      { situation: '需要深度多层级页面切换且要求保持当前工作上下文', recommended: true },
      { situation: '开发者工具、文档知识库（带章节目录树）', recommended: true },
      { situation: '单页面营销落地页、短流程宣传站（浪费横向空间且增加认知负担）', recommended: false },
      { situation: '长篇小说沉浸式阅读页（容易分散注意力）', recommended: false },
    ],
    whenNotToUse: [
      '未做滚动隔离，侧栏和主页面一起随着鼠标滚轮滚走，导致用户想换菜单必须先滚回顶部。',
      '在移动端直接按桌面端硬挤侧栏，未提供汉堡按钮 + 抽屉（Drawer/Sheet）降级方案。',
    ],
    anatomy: [
      { label: 'Fixed Sidebar', labelZh: '固定侧边栏', note: '承载团队切换、导航树与个人设置' },
      { label: 'Collapsible Rail', labelZh: '紧凑折叠导轨', note: '收起后仅显示微图标节省空间' },
      { label: 'App Header / Breadcrumb', labelZh: '顶栏面包屑区', note: '当前路径、搜索框与快捷操作' },
      { label: 'Independent Canvas', labelZh: '独立主画布', note: 'overflow-y-auto 独立滚动区域' },
    ],
    similarPatterns: ['split-screen', 'container', 'drawer', 'sticky-bar'],
    compareWith: 'split-screen',
    aiPrompt: {
      basic: '做个左边菜单右边内容的后台骨架。',
      detailed:
        '使用 App Shell 架构：全屏视口高度，左侧侧栏宽度 260px 固定不滚动，右侧顶部面包屑导航，右侧主体区域独立纵向滚动，移动端侧栏收为抽屉。',
      implementation:
        '外层使用 h-screen flex overflow-hidden bg-canvas。左侧侧边栏使用 w-64 flex-shrink-0 flex flex-col border-r border-line bg-surface。右侧主体使用 flex-1 flex flex-col min-w-0。右侧顶部 Header 使用 h-14 border-b border-line flex items-center px-6。主内容区使用 flex-1 overflow-y-auto p-6。小屏下侧边栏添加 translate-x 动画配合遮罩层实现抽屉交互。',
    },
    badPrompt: '左边放侧边栏，右边放内容。',
    betterPrompt:
      '构建 SaaS 应用外壳 (App Shell)：h-screen flex overflow-hidden，左侧 260px 侧栏独立固定，右侧顶部 Header 配面包屑，主内容区 flex-1 overflow-y-auto，移动端提供 Drawer 抽屉切换。',
    fitsFor: 'SaaS 仪表盘 · 管理后台 · 生产力工具 · 文档知识库',
    tags: ['App Shell', '侧栏', '中后台', '滚动隔离', 'Notion风'],
  },
  {
    id: 'sticky-bar',
    name: 'Sticky Bar',
    chineseName: '粘性悬浮栏',
    aliases: ['吸顶栏', 'sticky bar', 'sticky header', '粘性导航', '吸底栏', '悬浮栏', 'sticky footer'],
    category: 'layout',
    level: 1,
    appearance: ['on-scroll', 'always'],
    position: ['top', 'bottom', 'floating'],
    job: ['navigate', 'confirm'],
    oneLine: '随页面滚动到阈值后自动吸附在视口顶部或底部的导航与操作条。',
    description:
      '粘性悬浮栏利用 position: sticky 保留了元素在自然文档流中的占位，当用户滚动页面离开初始视口时，它会优雅吸附在屏幕边缘。它既不会像 position: fixed 那样野蛮遮挡页面初始内容，又能在用户沉浸式浏览数屏长内容后，随时提供全局导航、搜索或关键购买行动（CTA）。',
    looksLike:
      '长文章向下滚动数屏后，网页顶栏半透明毛玻璃吸附在屏幕最顶端，里面带当前章节进度条；在手机电商页滑到底部时，底部的「立即购买」按钮牢牢吸在屏幕下方。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '长落地页中的核心全局导航栏（带毛玻璃背景）', recommended: true },
      { situation: '移动端电商商品详情页的底部常驻购买/加入购物车栏', recommended: true },
      { situation: '长表单或审批页底部的保存/提交确认条', recommended: true },
      { situation: '页面高度非常短、一屏就能看全的极简页面（纯属多余代码）', recommended: false },
      { situation: '父容器设置了 overflow: hidden（会导致 CSS sticky 吸附失效）', recommended: false },
    ],
    whenNotToUse: [
      '在祖先节点上设置了 overflow: hidden，导致 CSS sticky 彻底失效却排查半天。',
      '吸顶栏高度过大（比如超过 100px），在移动端占去近 1/4 的可视高度，让用户无法阅读正文。',
    ],
    anatomy: [
      { label: 'Sticky Anchor', labelZh: '粘性定位锚点', note: 'position: sticky; top: 0' },
      { label: 'Backdrop Blur', labelZh: '毛玻璃半透层', note: 'backdrop-blur-md 与半透明底色' },
      { label: 'Scroll Shadow', labelZh: '滚动感知微投影', note: '离开顶部时浮现微妙阴影' },
      { label: 'Action Elements', labelZh: '核心操作控件', note: 'Logo、快速导航或购买 CTA' },
    ],
    similarPatterns: ['sidebar-layout', 'hero', 'container', 'full-bleed'],
    compareWith: 'sidebar-layout',
    aiPrompt: {
      basic: '导航栏往下滚的时候固定在上面。',
      detailed:
        '制作吸顶毛玻璃导航条：在滚动时固定在顶部（sticky top-0），背景为 80% 白底配合 12px 高斯模糊，带 1px 浅灰底边，Z 轴层级高于正文。',
      implementation:
        '导航元素使用 class="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/80 border-b border-line transition-shadow"。检查所有父容器避免设置 overflow-hidden 以免失效。推荐配合简单的 IntersectionObserver 或 scroll 监听，离开初始位置后动态添加 shadow-sm 投影，增强与下层滚动内容的层次分离。',
    },
    badPrompt: '让菜单一直漂在上面。',
    betterPrompt:
      '使用 CSS sticky 实现吸顶导航：sticky top-0 z-40 w-full backdrop-blur-md bg-surface/85 border-b border-line/60，父容器保持 overflow-visible，滚动时呈现柔和微阴影。',
    fitsFor: '长页全局导航 · 电商底栏购买条 · 审批保存栏 · 文档目录吸顶',
    tags: ['Sticky', '吸顶', '毛玻璃', '常驻操作', '滚动吸附'],
  },
  {
    id: 'full-bleed',
    name: 'Full-Bleed Section',
    chineseName: '全宽通栏带',
    aliases: ['通栏', 'full-bleed', '全宽通栏', '突破版心', 'edge-to-edge', '全宽背景条', 'bleed-out'],
    category: 'layout',
    level: 1,
    appearance: ['always'],
    position: ['center', 'inline'],
    job: ['inform', 'expand'],
    oneLine: '背景横向铺满屏幕两端边缘，但内部文本与元素依然遵守版心收拢的对比型节段。',
    description:
      '全宽通栏带是现代网页打破单调节奏的「视觉重音」。如果整个页面从头到尾都在同一个版心里，容易产生视觉疲劳。通过插入一个全屏黑色背景的数据条、横向贯穿屏幕边缘的合作伙伴滚动墙、或整屏大图，能给页面带来强烈的空间呼吸感与节奏转换。',
    looksLike:
      '网页上下都是浅色居中内容，中间突然横切出一段深色通栏横条，横向铺满屏幕两侧边缘，里面整齐排列着几组白色的亮眼核心数据。',
    platforms: ['web', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '合作伙伴 Logo 墙或无限滚动走马灯（Marquee）', recommended: true },
      { situation: '强调型深色数据统计横条（如“已服务 100,000+ 团队”）', recommended: true },
      { situation: '页面底部的最终转化 CTA 呼吁大色块', recommended: true },
      { situation: '纯文字密集型的文档正文（正文若全宽会造成单行文字过长无法阅读）', recommended: false },
      { situation: '紧凑型移动端原生 App 列表', recommended: false },
    ],
    whenNotToUse: [
      '在通栏内部忘记二次包裹 Container 版心，导致里面的文字直接贴到 4K 屏幕左右最外边缘。',
      '使用错误的 CSS 技巧（如写死固定 vw 且未考虑滚动条宽度），引发横向出现水平滚动条。',
    ],
    anatomy: [
      { label: 'Edge-to-Edge Band', labelZh: '铺满视口通栏外壳', note: 'w-full 突破版心边界' },
      { label: 'Contrast Background', labelZh: '反差色彩底色', note: '反转深浅色调形成视觉重音' },
      { label: 'Inner Container', labelZh: '内部二次版心', note: 'max-w-7xl mx-auto 约束内容' },
      { label: 'Visual Rhythm', labelZh: '空间节奏呼吸', note: '为上下节段提供节奏缓冲' },
    ],
    similarPatterns: ['container', 'hero', 'bento-grid', 'split-screen'],
    compareWith: 'container',
    aiPrompt: {
      basic: '中间插一个铺满全屏的黑色条。',
      detailed:
        '在白色页面中间插入一个全宽通栏深色数据段：外层背景色横向切满屏幕两端边缘（w-full bg-ink），内层用 container 居中包裹 4 组核心统计数据，上下内边距 80px。',
      implementation:
        '采用外通栏、内版心的标准嵌套架构：<section className="w-full bg-ink text-surface py-20"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">...</div></section>。禁止给父容器加负外边距，通过干净的 Section 切分实现天然通栏。',
    },
    badPrompt: '把这一段拉大填满屏幕。',
    betterPrompt:
      '构建通栏数据统计带 (Full-Bleed Section)：外层 section w-full bg-ink py-20 text-surface，内层用 max-w-7xl mx-auto px-6 约束 4 列核心指标，打破单调版心节奏。',
    fitsFor: '数据统计条 · 合作伙伴 Logo 墙 · 终极 CTA 横幅 · 视频背景条',
    tags: ['通栏', 'Full-Bleed', '全宽', '视觉重音', '背景铺满'],
  },
];
