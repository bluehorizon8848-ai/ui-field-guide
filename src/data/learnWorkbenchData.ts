// Generated from Human-approved Scheme C+ r1.2.1 dataset
export interface WhenToUseItem {
  situation: string;
  recommended: boolean | 'mostly';
}

export interface AiPrompt {
  basic: string;
  detailed: string;
  implementation: string;
}

export interface LearnLessonItem {
  id: string;
  name: string;
  chineseName: string;
  category: string;
  level: 1 | 2 | 3;
  globalIndex: number;
  oneLineZh: string;
  oneLineEn: string;
  summaryZh?: string;
  summaryEn?: string;
  bestPracticesZh?: string[];
  bestPracticesEn?: string[];
  whenToUseZh: WhenToUseItem[];
  whenToUseEn: WhenToUseItem[];
  whenNotToUseZh: string[];
  whenNotToUseEn: string[];
  demoId: string;
  aiPromptZh: AiPrompt;
  aiPromptEn: AiPrompt;
  analogyBadgeZh: string;
  analogyBadgeEn: string;
  analogyDescZh: string;
  analogyDescEn: string;
  comparisonZh: string;
  comparisonEn: string;
  quizQuestionZh: string;
  quizQuestionEn: string;
  quizAnswerZh: string;
  quizAnswerEn: string;
  demoType?: string;
}

export interface LearnLevelGroup {
  level: 1 | 2 | 3;
  nameZh: string;
  nameEn: string;
  subtitle: string;
  descriptionZh: string;
  descriptionEn: string;
  patternIds: string[];
  items: LearnLessonItem[];
}

export interface LearnWorkbenchDataset {
  levels: LearnLevelGroup[];
}

export const learnWorkbenchData: LearnWorkbenchDataset = {
  "levels": [
    {
      "level": 1,
      "nameZh": "你每天都会看到的 UI",
      "nameEn": "The UI you see every day",
      "subtitle": "Level 1",
      "descriptionZh": "这几个词你在任何 App 里都见过，只是不知道名字。认全它们，你就能描述 80% 的界面了。",
      "descriptionEn": "You have already seen these words in every app, you just did not know the names. Learn them and you can describe 80% of any interface.",
      "patternIds": [
        "button",
        "cta",
        "card",
        "tabs",
        "modal",
        "toast",
        "text-field",
        "switch",
        "list",
        "icon-button"
      ],
      "items": [
        {
          "id": "button",
          "name": "Button",
          "chineseName": "按钮",
          "category": "actions",
          "oneLineZh": "界面上最基础的可点击元素——用户一点，就会发生一件事。",
          "oneLineEn": "The most basic clickable element in the interface — the user taps it and one thing happens.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "触发一个明确的动作（提交、删除、保存）",
              "recommended": true
            },
            {
              "situation": "动作是当前页面的下一步",
              "recommended": true
            },
            {
              "situation": "需要区分主次：Primary + Secondary",
              "recommended": true
            },
            {
              "situation": "只是导航到另一个页面且没有语义",
              "recommended": "mostly"
            },
            {
              "situation": "一个页面里超过 3 个同权重主按钮",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Triggering a clear action (submit, delete, save)",
              "recommended": true
            },
            {
              "situation": "The action is the next step on the current page",
              "recommended": true
            },
            {
              "situation": "You need to express hierarchy: Primary + Secondary",
              "recommended": true
            },
            {
              "situation": "It only navigates to another page with no semantics of its own",
              "recommended": "mostly"
            },
            {
              "situation": "More than 3 equally weighted primary buttons on one page",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "在页面顶部放一排文字链却都长得像按钮，会让主次消失。",
            "按钮文案用「确定」会让用户不安——写「删除照片」比「确定」友好得多。"
          ],
          "whenNotToUseEn": [
            "A row of text links at the top of the page that all look like buttons destroys the hierarchy.",
            "A label of \"OK\" makes users nervous — \"Delete photo\" is far friendlier than \"OK\"."
          ],
          "demoId": "button",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加一个保存按钮。",
            "detailed": "在编辑页底部加一组按钮：左侧次要按钮「取消」，右侧主按钮「保存」。保存中显示 loading 并禁用。",
            "implementation": "两个 <button>，右侧为 Primary（背景 #1A1917，白色文字，圆角 8px，内边距 10px 20px，最小高度 44px），左侧为 Secondary（白底 + 1px 边框 #E6E3DB）。点击保存后：disabled=true、显示 16px spinner、aria-busy=true，成功后 600ms 内恢复。hover 时背景加深到 #35322C。焦点态用 2px outline + 2px offset。文案用动词，不用「确定」。"
          },
          "aiPromptEn": {
            "basic": "Add a save button.",
            "detailed": "Add a pair of buttons at the bottom of the edit page: a secondary \"Cancel\" on the left and a primary \"Save\" on the right. While saving, show loading and disable it.",
            "implementation": "Two <button> elements: the right one is Primary (background #1A1917, white text, 8px radius, padding 10px 20px, min-height 44px), the left one is Secondary (white background + 1px border #E6E3DB). After clicking Save: set disabled=true, show a 16px spinner, aria-busy=true, and restore within 600ms on success. On hover, darken the background to #35322C. Focus state uses a 2px outline with 2px offset. Use a verb for the label, not \"OK\"."
          },
          "globalIndex": 0,
          "level": 1,
          "analogyBadgeZh": "生活类比: 墙壁开关与电梯按钮",
          "analogyBadgeEn": "Analogy: Wall Switch & Elevator Button",
          "analogyDescZh": "现实中就像电梯的楼层按键——按下后指示灯点亮，机械开始运转。在界面里它是动作的直接触发器。",
          "analogyDescEn": "Like an elevator floor button: you press it, the backlight ignites, and the elevator moves. It triggers immediate action.",
          "comparisonZh": "<strong>Button vs Link:</strong> Button 改变系统状态或提交数据；Link 用于在网页与路由之间转移页面。严禁把 Link 当作表单提交键使用。",
          "comparisonEn": "<strong>Button vs Link:</strong> Buttons alter system state or submit data; Links transfer between pages and routes. Never use a Link for form submission.",
          "quizQuestionZh": "场景思考：当一个表单页面同时有「提交订单」和「清空重填」时，应该如何设定两者的按钮样式与层级？",
          "quizQuestionEn": "Scenario: When a form has both Submit and Reset, how should their hierarchy be designed?",
          "quizAnswerZh": "「提交订单」是主动作，使用高对比度 Primary Button；「清空重填」具有高危险性且极少使用，绝不可用醒目按钮，建议使用低权重的 Secondary 或文字按钮，并增加二次确认。",
          "quizAnswerEn": "Submit is the primary action (Primary Button); Reset is destructive and rare, so make it a subtle text button or secondary with confirmation.",
          "demoType": "button"
        },
        {
          "id": "cta",
          "name": "CTA",
          "chineseName": "行动号召按钮",
          "category": "actions",
          "oneLineZh": "整个页面里最重要的那一个按钮——它就是希望用户接下来要做的事。",
          "oneLineEn": "The single most important button on the page — it is the one thing you want the user to do next.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "页面有一个明确的、最希望用户完成的动作",
              "recommended": true
            },
            {
              "situation": "落地页 / 注册页 / 空状态页",
              "recommended": true
            },
            {
              "situation": "需要用视觉权重引导下一步",
              "recommended": true
            },
            {
              "situation": "页面里同时存在多个同等重要的主操作",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The page has one clear action you most want the user to complete",
              "recommended": true
            },
            {
              "situation": "Landing pages, sign-up pages, and empty states",
              "recommended": true
            },
            {
              "situation": "You need visual weight to guide the next step",
              "recommended": true
            },
            {
              "situation": "Several equally important primary actions coexist on the page",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "把每个按钮都做成 CTA 等于没有 CTA——视觉权重一旦平均，重点就消失了。",
            "高频使用的工作台界面里，强行放 CTA 只会干扰。"
          ],
          "whenNotToUseEn": [
            "Making every button a CTA means there is no CTA — once visual weight is averaged out, the focus disappears.",
            "Forcing a CTA into a high-frequency workspace interface is just noise."
          ],
          "demoId": "cta",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个明显的按钮。",
            "detailed": "在注册页加一个通栏主 CTA「免费开始使用」，深色实心，通栏宽度，下方加一行小字「无需信用卡」。",
            "implementation": "button 宽度 100%，高度 52px，背景 #1A1917，文字 17px medium，圆角 8px，hover 加深到 #35322C。它是页面上唯一的高实心按钮，次要链接（已有账号？登录）降级为文字按钮。按钮下方 8px 处放 13px 灰色说明文字。移动端保证底部安全区 padding-bottom: env(safe-area-inset-bottom)。"
          },
          "aiPromptEn": {
            "basic": "Add a prominent button.",
            "detailed": "Add a full-width primary CTA to the sign-up page reading \"Start free trial\", dark and solid, with a line of small text underneath: \"No credit card required\".",
            "implementation": "button width 100%, height 52px, background #1A1917, text 17px medium, 8px radius, darkening to #35322C on hover. It is the only high-solidity button on the page; secondary links (already have an account? Log in) are demoted to text buttons. Place a 13px gray helper text 8px below the button. On mobile guarantee bottom padding-bottom: env(safe-area-inset-bottom)."
          },
          "globalIndex": 1,
          "level": 1,
          "analogyBadgeZh": "生活类比: 商场正门最显眼的主促销招牌",
          "analogyBadgeEn": "Analogy: Main Promo Banner at Mall Entrance",
          "analogyDescZh": "就像商场正中间红底金字的限时活动招牌，引导顾客直奔唯一的主目标，对比度极高且毫不掩饰。",
          "analogyDescEn": "Like the giant gold-on-red banner at the mall atrium directing shoppers to the flagship promotion with zero ambiguity.",
          "comparisonZh": "<strong>CTA vs Button:</strong> CTA 是唯一的转化之王（全屏通常仅设 1-2 处）；Button 则是通用操作元件，一屏内可以有多个次级操作。",
          "comparisonEn": "<strong>CTA vs Button:</strong> CTA is the single dominant conversion driver (1-2 per screen); regular Buttons are general utility elements.",
          "quizQuestionZh": "场景思考：落地页的首屏（Hero Section）为什么严禁放置 3 个以上同等醒目的主按钮？",
          "quizQuestionEn": "Scenario: Why must a Hero section avoid having 3+ equally prominent buttons?",
          "quizAnswerZh": "希克定律（Hick's Law）：选择越多，用户的决策犹豫时间成倍增加，导致转化率急剧暴跌。首屏必须有且仅有 1 个统领全局的主 CTA。",
          "quizAnswerEn": "Hick's Law: every additional choice increases decision latency and tanks conversion. Keep exactly one dominant CTA in the hero.",
          "demoType": "cta"
        },
        {
          "id": "card",
          "name": "Card",
          "chineseName": "卡片",
          "category": "containers",
          "oneLineZh": "一个带圆角和边框的容器，把一条相关内容装在一起。",
          "oneLineEn": "A rounded, bordered container that bundles one related piece of content — image, title, text — into a single self-contained unit.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "一组内容可以被独立点击或独立理解",
              "recommended": true
            },
            {
              "situation": "需要明显的点击边界（整卡可点）",
              "recommended": true
            },
            {
              "situation": "网格布局中的重复单元",
              "recommended": true
            },
            {
              "situation": "内容很短、只有一行文字",
              "recommended": false
            },
            {
              "situation": "把卡片再套卡片",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "A group of content can be clicked or understood on its own",
              "recommended": true
            },
            {
              "situation": "It needs a clear click boundary (the whole card is clickable)",
              "recommended": true
            },
            {
              "situation": "A repeated unit inside a grid layout",
              "recommended": true
            },
            {
              "situation": "The content is very short — a single line of text",
              "recommended": false
            },
            {
              "situation": "You would be nesting a card inside another card",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "卡片里再放卡片、按钮里再放按钮，是层级混乱的典型信号。",
            "如果只是分个组，Divider 就够了，不必每组都起一个盒子。"
          ],
          "whenNotToUseEn": [
            "Cards inside cards, or buttons inside buttons, are the classic symptom of a hierarchy that has lost control.",
            "If all you need is a bit of grouping, a divider is enough — no need to promote every group to a box."
          ],
          "demoId": "card",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加几个卡片。",
            "detailed": "加一个内容卡片列表：每张卡片有 16:9 封面、标题、描述和「查看详情」链接，整卡可点，悬停时轻微上移。",
            "implementation": "<article> 作为容器，白底、1px #E6E3DB 边框、圆角 10px、overflow hidden。封面 aspect-ratio: 16/9 + object-fit: cover。标题 16px medium、line-clamp: 2。描述 14px #7A766D、line-clamp: 2。整卡可点：卡片本身是 <a> 或带 onClick 且 tabIndex=0 + Enter 键响应，内部不再放 <a>（避免嵌套交互元素）。hover: translateY(-2px) + shadow 提升。"
          },
          "aiPromptEn": {
            "basic": "Add a few cards.",
            "detailed": "Add a list of content cards: each card has a 16:9 cover image, a title, a description and a \"View details\" link. The whole card is clickable and lifts slightly on hover.",
            "implementation": "<article> as the container, white background, 1px #E6E3DB border, border-radius 10px, overflow hidden. Cover image aspect-ratio: 16/9 + object-fit: cover. Title 16px medium, line-clamp: 2. Description 14px #7A766D, line-clamp: 2. Whole card clickable: the card itself is an <a>, or carries onClick with tabIndex=0 plus an Enter key handler, and no nested <a> inside (avoids nesting interactive elements). hover: translateY(-2px) + elevated shadow."
          },
          "globalIndex": 2,
          "level": 1,
          "analogyBadgeZh": "生活类比: 超市货架上独立包装的盒装商品",
          "analogyBadgeEn": "Analogy: Packaged Boxed Goods on Supermarket Shelves",
          "analogyDescZh": "每一盒商品都自成一体，拥有自己的封面图、配料表和价格条码，拿走一盒绝不影响旁边的商品。",
          "analogyDescEn": "Each product is self-contained with its own cover photo, ingredient list, and barcode. Picking one up leaves neighbors intact.",
          "comparisonZh": "<strong>Card vs List:</strong> Card 适合图文异构、独立可分离、横向探索的内容；List 适合结构高度同构、追求高效纵向滚动的海量条目。",
          "comparisonEn": "<strong>Card vs List:</strong> Cards suit visually rich, heterogeneous, browsable content; Lists suit homogeneous data optimized for rapid vertical scanning.",
          "quizQuestionZh": "场景思考：在电商搜索结果页中，什么时候适合用瀑布流卡片（Card），什么时候更适合紧凑列表（List）？",
          "quizQuestionEn": "Scenario: In e-commerce search, when are Cards preferred over compact Lists?",
          "quizAnswerZh": "当用户购买决策高度依赖视觉图片（如服装、家居、美妆）时用 Card；当用户更依赖快速比对参数、型号或价格（如电子元器件、图书、机票）时用 List。",
          "quizAnswerEn": "Use Cards when visuals drive purchase (fashion, home decor); use Lists when comparing specs, part numbers, or prices.",
          "demoType": "card"
        },
        {
          "id": "tabs",
          "name": "Tabs",
          "chineseName": "标签页",
          "category": "navigation",
          "oneLineZh": "同一层级的几组内容并排放着，切换标签就切换整块内容——而且每组都有自己的 URL。",
          "oneLineEn": "Several peer content sections sit side by side; switching tabs swaps the whole panel — and each one gets its own URL.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "2–5 个平级内容分区",
              "recommended": true
            },
            {
              "situation": "切换后仍停留在同一页面上下文",
              "recommended": true
            },
            {
              "situation": "每个分区内容都不为空",
              "recommended": true
            },
            {
              "situation": "内容有先后顺序（Stepper）",
              "recommended": false
            },
            {
              "situation": "两个选项需要「二选一」而不是「都看看」",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "2–5 peer content sections",
              "recommended": true
            },
            {
              "situation": "Switching keeps the user in the same page context",
              "recommended": true
            },
            {
              "situation": "Every section has real content",
              "recommended": true
            },
            {
              "situation": "The content has a required order (use a Stepper)",
              "recommended": false
            },
            {
              "situation": "Two options are mutually exclusive rather than \"both worth a look\"",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "超过 5 个标签就该考虑用侧边导航或下拉菜单了。",
            "切换会导致用户丢失当前页面的编辑状态时，不要用 Tabs——用户会以为内容还在。"
          ],
          "whenNotToUseEn": [
            "Past five tabs, switch to side navigation or a dropdown.",
            "Do not use tabs when switching discards the current edit state — users will assume the content is still there."
          ],
          "demoId": "tabs",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加几个标签页可以切换内容。",
            "detailed": "在用户资料页加 Tabs：主页 / 作品 / 喜欢。点标签切换下方内容，选中项有下划线指示。",
            "implementation": "用 Tabs 组件，items 为 [{key:\"posts\",label:\"主页\"},{key:\"works\",label:\"作品\"},{key:\"likes\",label:\"喜欢\"}]，defaultActiveKey=\"posts\"。容器 role=\"tablist\"，每个标签 role=\"tab\" + aria-selected，内容区 role=\"tabpanel\" + aria-labelledby。切换时同步 URL query（?tab=works）并支持浏览器前进后退。选中指示用底部 2px 实线，颜色 #1A1917。移动端标签可横向滚动，隐藏滚动条。"
          },
          "aiPromptEn": {
            "basic": "Add a few tabs that switch the content below.",
            "detailed": "Add tabs to the user profile page: Profile / Posts / Likes. Tapping a tab swaps the content below, and the active tab gets an underline indicator.",
            "implementation": "Use a Tabs component with items [{key:\"posts\",label:\"Profile\"},{key:\"works\",label:\"Posts\"},{key:\"likes\",label:\"Likes\"}] and defaultActiveKey=\"posts\". The container gets role=\"tablist\", each tab role=\"tab\" + aria-selected, and the content area role=\"tabpanel\" + aria-labelledby. On switch, sync the URL query (?tab=works) and support browser back/forward. The active indicator is a 2px solid bottom border in #1A1917. On mobile the tab list scrolls horizontally with the scrollbar hidden."
          },
          "globalIndex": 3,
          "level": 1,
          "analogyBadgeZh": "生活类比: 实体文件档案夹上方的彩色分类标签",
          "analogyBadgeEn": "Analogy: Color-coded Index Tabs on File Folders",
          "analogyDescZh": "手指捏住哪个标签拉开，看到的就是对应类目的文件，所有分类并列处于同一物理层级。",
          "analogyDescEn": "Pulling a specific tab reveals the corresponding documents. All categories exist parallel on the same hierarchical level.",
          "comparisonZh": "<strong>Tabs vs Segmented Control:</strong> Tabs 用于不同页面视图或独立信息模块的平级切换；Segmented Control 更多用于同一数据集内部的筛选或视图模式微调。",
          "comparisonEn": "<strong>Tabs vs Segmented Control:</strong> Tabs switch between distinct views or modules; Segmented Controls filter or modify the current view mode.",
          "quizQuestionZh": "场景思考：移动端顶部 Tabs 如果超过 5 个标签，最优雅的交互处理方式是什么？",
          "quizQuestionEn": "Scenario: How should mobile top tabs behave when exceeding 5 categories?",
          "quizAnswerZh": "允许横向滑动（Scrollable Tabs），并在边缘加入渐变遮罩提示更多内容，或者在右侧提供展开全部标签的抽屉下拉按钮。",
          "quizAnswerEn": "Enable horizontal scrolling with edge fade indicators, or provide a dropdown drawer button at the right edge.",
          "demoType": "tabs"
        },
        {
          "id": "modal",
          "name": "Modal",
          "chineseName": "模态框 / 对话框",
          "category": "containers",
          "oneLineZh": "点了一下之后，屏幕中间冒出一个窗口，不处理它就别想继续用后面的页面。",
          "oneLineEn": "Something pops up in the middle of the screen, and until you deal with it you cannot use the page underneath.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "必须立即做决定才能继续（二次确认）",
              "recommended": true
            },
            {
              "situation": "需要一个专注的输入环境（登录、评论）",
              "recommended": true
            },
            {
              "situation": "需要打断用户注意力的严重错误",
              "recommended": true
            },
            {
              "situation": "只是想展示一条信息",
              "recommended": false
            },
            {
              "situation": "承载多层任务（表单很长）",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "A decision is required before anything else can proceed (confirmation)",
              "recommended": true
            },
            {
              "situation": "The user needs a focused input environment (sign-in, comment)",
              "recommended": true
            },
            {
              "situation": "A serious error needs to interrupt the user",
              "recommended": true
            },
            {
              "situation": "You only want to display a piece of information",
              "recommended": false
            },
            {
              "situation": "It has to carry a multi-step task (a long form)",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "每点一次按钮就弹一个框，是最常见的体验灾难。",
            "Modal 里再放 Modal 是设计事故——改用 Breadcrumb 或 Stepper。"
          ],
          "whenNotToUseEn": [
            "Popping up a dialog on every button press is the most common experience disaster there is.",
            "A modal inside a modal is a design incident — use breadcrumbs or a stepper instead."
          ],
          "demoId": "modal",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "点一下弹个框。",
            "detailed": "点「删除」后弹出确认 Dialog：标题写明后果，正文不超过两行，底部右对齐「取消」和红色「删除」，支持 Esc 和点击遮罩关闭。",
            "implementation": "role=\"dialog\" aria-modal=\"true\" aria-labelledby 指向标题。打开时给 body 加 overflow: hidden，并 focus 第一个可交互元素（或对话框本身）。focus trap：Tab 循环只在对话框内。Esc 关闭。遮罩 rgba(0,0,0,0.4)，点击遮罩关闭（破坏性操作例外）。宽度 min(480px, calc(100vw - 32px))，垂直居中。动画：opacity + scale(0.96→1) 150ms。关闭后焦点归还触发元素。"
          },
          "aiPromptEn": {
            "basic": "Pop up a dialog when the user clicks.",
            "detailed": "After tapping \"Delete\", show a confirmation dialog: the title states the consequence, the body is no more than two lines, and the bottom right-aligns \"Cancel\" and a red \"Delete\" button. Both Esc and a scrim click dismiss it.",
            "implementation": "role=\"dialog\" aria-modal=\"true\", with aria-labelledby pointing at the title. On open, add overflow: hidden to body and move focus to the first interactive element (or to the dialog itself). Focus trap: Tab cycles only within the dialog. Esc closes. Scrim rgba(0,0,0,0.4); clicking the scrim closes it (except for destructive operations). Width min(480px, calc(100vw - 32px)), vertically centered. Animation: opacity + scale(0.96→1) over 150ms. On close, return focus to the trigger element."
          },
          "globalIndex": 4,
          "level": 1,
          "analogyBadgeZh": "生活类比: 海关安检通道与交通红灯",
          "analogyBadgeEn": "Analogy: Customs Inspection Gate & Traffic Red Light",
          "analogyDescZh": "当挡车杆落下时，你必须停下当前所有事情，出示证件或做出选择后，才能继续通行。",
          "analogyDescEn": "When the barrier descends, you must pause all activities, present documentation or make a choice before continuing.",
          "comparisonZh": "<strong>Modal vs Bottom Sheet:</strong> 桌面端居中 Modal 适合阻断式重要决策；移动端单手操作时，Bottom Sheet 比屏幕中央的 Modal 触控友好得多。",
          "comparisonEn": "<strong>Modal vs Bottom Sheet:</strong> Centered Modals work well on desktop; on mobile, Bottom Sheets offer far superior thumb-reach ergonomics.",
          "quizQuestionZh": "场景思考：为什么不应该把长篇的用户协议或复杂的五步注册表单塞进一个居中 Modal 里？",
          "quizQuestionEn": "Scenario: Why avoid putting long terms or multi-step onboarding inside a centered Modal?",
          "quizAnswerZh": "Modal 适合短小聚焦的决策。长内容会导致多层内部滚动条、弹窗尺寸超出视口，甚至引发移动端键盘遮挡，此时应使用独立全屏页面或抽屉。",
          "quizAnswerEn": "Modals suit concise focal decisions. Long flows cause nested scrollbars, viewport overflow, and keyboard collision.",
          "demoType": "modal"
        },
        {
          "id": "toast",
          "name": "Toast",
          "chineseName": "轻提示",
          "category": "feedback",
          "oneLineZh": "操作完成后屏幕角落飘出来的小提示，几秒后自己消失。",
          "oneLineEn": "A small confirmation that drifts into the corner of the screen after an action and disappears on its own a few seconds later.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "操作成功，需要一句确认",
              "recommended": true
            },
            {
              "situation": "不打断用户当前操作",
              "recommended": true
            },
            {
              "situation": "信息简单，无需用户做任何事",
              "recommended": true
            },
            {
              "situation": "需要用户做出选择（撤销 / 重试）",
              "recommended": false
            },
            {
              "situation": "传递严重错误",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "An action succeeded and needs a one-line confirmation",
              "recommended": true
            },
            {
              "situation": "You do not want to interrupt what the user is doing",
              "recommended": true
            },
            {
              "situation": "The information is simple and requires nothing from the user",
              "recommended": true
            },
            {
              "situation": "The user has to make a choice (undo / retry)",
              "recommended": false
            },
            {
              "situation": "You need to convey a serious error",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "Toast 里放「撤销」按钮那就变成 Snackbar 了，别混用。",
            "连续操作时会堆叠成一列 Toast，看起来像出了错。"
          ],
          "whenNotToUseEn": [
            "The moment you put an \"Undo\" button inside it, it has become a snackbar — do not mix the two.",
            "Repeated actions make toasts stack into a column, which reads like something has gone wrong."
          ],
          "demoId": "toast",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "保存后给个提示。",
            "detailed": "保存成功后显示 Toast「照片已保存」，深色底白字，带对勾图标，屏幕顶部居中，2.5 秒后自动淡出。",
            "implementation": "固定定位 top: 16px（或 bottom: 24px），水平居中，深色底 #1A1917 白字，圆角 8px，padding 10px 16px，图标 + 文案水平居中。动画 opacity + translateY(-10px) 淡入淡出各 200ms。3 秒后自动移除。连续触发时替换而非堆叠（同一个 key 的 toast 覆盖前一个）。role=\"status\" aria-live=\"polite\" 让屏幕阅读器也能读到。"
          },
          "aiPromptEn": {
            "basic": "Show a confirmation after saving.",
            "detailed": "After a successful save, show the toast \"Photo saved\" — dark background, white text, a checkmark icon, centered at the top of the screen, fading out automatically after 2.5 seconds.",
            "implementation": "Fixed position top: 16px (or bottom: 24px), horizontally centered, dark background #1A1917 with white text, border-radius 8px, padding 10px 16px, icon + message centered horizontally. Animate with opacity + translateY(-10px), 200ms in and 200ms out. Remove automatically after 3 seconds. When triggered repeatedly, replace rather than stack (a toast with the same key overwrites the previous one). role=\"status\" aria-live=\"polite\" so screen readers announce it too."
          },
          "globalIndex": 5,
          "level": 1,
          "analogyBadgeZh": "生活类比: 微波炉加热完毕时轻柔的「叮」一声",
          "analogyBadgeEn": "Analogy: Gentle Microwave Beep when Heating Finishes",
          "analogyDescZh": "它告诉你事情做完了，但绝不需要你特意跑过去按一个确认键，3秒钟后就悄然隐退。",
          "analogyDescEn": "It notifies you that an action completed without requiring you to acknowledge it, fading silently after 3 seconds.",
          "comparisonZh": "<strong>Toast vs Dialog:</strong> Toast 是非阻断的耳边轻语，无需交互自动消失；Dialog 是打断一切的强迫确认，必须点击确认才能继续。",
          "comparisonEn": "<strong>Toast vs Dialog:</strong> Toasts are non-blocking whispers that auto-dismiss; Dialogs interrupt all work demanding deliberate confirmation.",
          "quizQuestionZh": "场景思考：如果用户点击了「删除账号」这种不可逆破坏性操作，能不能只弹一个 Toast 提示？",
          "quizQuestionEn": "Scenario: Can an irreversible destructive action like Delete Account just use a Toast?",
          "quizAnswerZh": "绝对不能！Toast 是弱提示且会自动消失，用户可能根本没看清就关闭了。破坏性操作必须通过 Modal 对话框进行二次强确认。",
          "quizAnswerEn": "Never! Toasts disappear automatically and lack blocking friction. Destructive actions demand explicit Modal confirmation.",
          "demoType": "toast"
        },
        {
          "id": "text-field",
          "name": "Text Field",
          "chineseName": "文本输入框",
          "category": "input",
          "oneLineZh": "一个带边框的框，用户往里面打字。",
          "oneLineEn": "A bordered box the user types into — the most basic input control there is, and the one whose quality varies the most.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "需要用户输入自由文本",
              "recommended": true
            },
            {
              "situation": "输入内容长度可预知且较长",
              "recommended": true
            },
            {
              "situation": "需要格式校验（邮箱、手机号）",
              "recommended": true
            },
            {
              "situation": "选项少于 5 个时",
              "recommended": false
            },
            {
              "situation": "输入内容不应被记录/展示时",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The user needs to enter free-form text",
              "recommended": true
            },
            {
              "situation": "The expected input is long but its length is predictable",
              "recommended": true
            },
            {
              "situation": "The value needs format validation (email, phone number)",
              "recommended": true
            },
            {
              "situation": "There are fewer than 5 options",
              "recommended": false
            },
            {
              "situation": "What the user types should not be logged or displayed",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "密码输入框应该用专门的 Password Field，带显示 / 隐藏切换和强度提示。",
            "要求固定格式的数据（日期、选择）应该用专用组件，别让用户手打。"
          ],
          "whenNotToUseEn": [
            "Password entry belongs in a dedicated Password Field with a show/hide toggle and strength feedback.",
            "Data with a fixed format (dates, choices) should use a purpose-built control instead of making the user type it."
          ],
          "demoId": "text-field",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个输入框。",
            "detailed": "加一个邮箱输入框：上方 Label「邮箱」，下方常驻辅助文字「用于接收通知」，失焦时校验格式，错误时红边 + 下方红字说明。",
            "implementation": "<div> 内含 <label>（14px，#4A4740）+ <input type=\"email\">。输入框高 44px，边框 1px #E6E3DB，圆角 8px，padding 12px，focus 时边框变 #1A1917 且加 3px 半透明外发光。placeholder 用 #7A766D 且不可替代 label。校验在 blur 时触发，错误态：边框 #A8342C + 下方 13px 红字「请输入有效的邮箱地址」，并加 aria-invalid=\"true\" 与 aria-describedby 指向错误文本。"
          },
          "aiPromptEn": {
            "basic": "Add a text field.",
            "detailed": "Add an email field: a Label reading \"Email\" on top, always-on helper text \"Used to receive notifications\" below, format validation on blur, and on error a red border with red explanatory text underneath.",
            "implementation": "A <div> containing a <label> (14px, #4A4740) + <input type=\"email\">. The field is 44px tall with a 1px #E6E3DB border, 8px radius, and 12px padding; on focus the border turns #1A1917 and gains a 3px translucent outer glow. The placeholder is #7A766D and must not replace the label. Validation fires on blur; the error state is a #A8342C border plus 13px red text below reading \"Enter a valid email address\", together with aria-invalid=\"true\" and aria-describedby pointing at the error text."
          },
          "globalIndex": 6,
          "level": 1,
          "analogyBadgeZh": "生活类比: 纸质表格上留出的填空横线",
          "analogyBadgeEn": "Analogy: Fill-in Blank Lines on Paper Forms",
          "analogyDescZh": "给你一段空白区域和微弱提示文字，点击时光标开始闪烁，等待你填入具体信息。",
          "analogyDescEn": "A designated blank line with faint placeholder guidance; tap to start a blinking cursor waiting for specific input.",
          "comparisonZh": "<strong>Text Field vs Textarea:</strong> Text Field 专为单行短文本设计（如姓名、邮箱）；Textarea 用于多行可换行的长篇输入（如留言、评论、备注）。",
          "comparisonEn": "<strong>Text Field vs Textarea:</strong> Text Fields capture single-line short input (name, email); Textareas handle multi-line long-form text.",
          "quizQuestionZh": "场景思考：在移动端手机号输入框中，为什么必须把 `<input type>` 声明为 `tel` 或数字键盘？",
          "quizQuestionEn": "Scenario: Why must mobile phone inputs use type=\"tel\" or inputmode=\"numeric\"?",
          "quizAnswerZh": "唤起专门的数字大键位键盘可以减少用户切换键盘的摩擦成本，降低 50% 以上的输入错误率与跳出率。",
          "quizAnswerEn": "Bringing up a numeric keypad eliminates keyboard mode switching friction, cutting typing errors and abandonment by over 50%.",
          "demoType": "text-field"
        },
        {
          "id": "switch",
          "name": "Switch",
          "chineseName": "开关",
          "category": "input",
          "oneLineZh": "一个左右滑动的开关，一开一关，状态永远摆在明面上。",
          "oneLineEn": "A control that slides left and right, on or off, with the state always plainly visible.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "一个功能的开/关状态，切换立即生效",
              "recommended": true
            },
            {
              "situation": "状态需要一眼可见",
              "recommended": true
            },
            {
              "situation": "开关状态本身有意义（开=省电模式）",
              "recommended": true
            },
            {
              "situation": "需要用户「确认后才生效」",
              "recommended": false
            },
            {
              "situation": "这个勾选需要随表单一起提交",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "A feature is on or off and the change takes effect immediately",
              "recommended": true
            },
            {
              "situation": "The current state must be visible at a glance",
              "recommended": true
            },
            {
              "situation": "The state itself carries meaning (on = power-saving mode)",
              "recommended": true
            },
            {
              "situation": "The change should only take effect after confirmation",
              "recommended": false
            },
            {
              "situation": "The selection has to be submitted along with a form",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "Switch 不用解释「开」和「关」的意思——那说明它不适合用 Switch，改用 Checkbox + 明确文案。",
            "切换后有重要后果（关掉会丢数据）时，Switch 本身要配合确认或 Undo。"
          ],
          "whenNotToUseEn": [
            "A switch should not need a tooltip explaining what \"on\" and \"off\" mean — if it does, use a checkbox with explicit copy instead.",
            "When flipping it has serious consequences (turning it off loses data), pair the switch with a confirmation or an undo."
          ],
          "demoId": "switch",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个开关。",
            "detailed": "加一个设置项：左侧标题「深色模式」+ 一行说明，右侧 Switch。切换立即生效并显示 Toast 确认。",
            "implementation": "button role=\"switch\" aria-checked={on}，放在 label 文字右侧。轨道 44×26px 圆角全满，未开启 #D8D5CD，开启 #2C7355，滑块 22px 白色带 shadow，位移 18px。切换动画 180ms cubic-bezier。整行可点。切换时立即写系统设置并弹 Toast「已开启深色模式」；若切换会导致数据丢失，先弹确认 Dialog。禁用时整体降到 40% 不透明度并加 disabled。"
          },
          "aiPromptEn": {
            "basic": "Add a switch.",
            "detailed": "Add a settings row: the title \"Dark mode\" plus a line of description on the left, a switch on the right. Toggling takes effect immediately and confirms with a toast.",
            "implementation": "button role=\"switch\" aria-checked={on}, placed to the right of the label text. The track is 44×26px with a fully rounded radius, #D8D5CD when off and #2C7355 when on, with a 22px white thumb carrying a shadow and an 18px travel. The toggle animates over 180ms cubic-bezier. The whole row is tappable. On toggle, write the system setting immediately and show a toast reading \"Dark mode on\"; if the change would lose data, show a confirmation Dialog first. When disabled, drop the whole row to 40% opacity and add disabled."
          },
          "globalIndex": 7,
          "level": 1,
          "analogyBadgeZh": "生活类比: 墙壁上的电灯翘板开关",
          "analogyBadgeEn": "Analogy: Wall Rocker Light Switch",
          "analogyDescZh": "按下去灯立刻亮，拨回来灯立刻熄灭。结果实时生效，不需要另外按一个「保存」键。",
          "analogyDescEn": "Flip it and the light turns on immediately; flip back and it turns off. Zero save button required.",
          "comparisonZh": "<strong>Switch vs Checkbox:</strong> Switch 是立即生效的状态切换（如打开蓝牙）；Checkbox 则是多项选择或需要配合「保存」按钮统一提交的设置项。",
          "comparisonEn": "<strong>Switch vs Checkbox:</strong> Switches trigger instant state toggles (Bluetooth on); Checkboxes denote selections submitted via a form action.",
          "quizQuestionZh": "场景思考：表单最底部的「我已阅读并同意服务条款」，为什么通常用 Checkbox 而不用 Switch？",
          "quizQuestionEn": "Scenario: Why use a Checkbox instead of a Switch for \"I agree to Terms\"?",
          "quizAnswerZh": "同意条款是提交表单时的前置确认动作，不是立即改变系统运行状态的开关；Checkbox 符合法律契约签署的心理模型。",
          "quizAnswerEn": "Agreeing to terms is a prerequisite confirmation for form submission, not an instant hardware/system state toggle.",
          "demoType": "switch"
        },
        {
          "id": "list",
          "name": "List",
          "chineseName": "列表",
          "category": "data",
          "oneLineZh": "一列一列排下来的信息，每一行是同一类东西。",
          "oneLineEn": "A single column of stacked items, where every row is the same kind of thing and the whole row is one target.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "同类内容有 3 项以上需要纵向浏览",
              "recommended": true
            },
            {
              "situation": "每项信息结构相同（标题+副标题+值）",
              "recommended": true
            },
            {
              "situation": "需要快速扫读",
              "recommended": true
            },
            {
              "situation": "需要对比各项的横向数值",
              "recommended": false
            },
            {
              "situation": "只有 1–2 项",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Three or more similar items need vertical browsing",
              "recommended": true
            },
            {
              "situation": "Every item has the same structure (title + subtitle + value)",
              "recommended": true
            },
            {
              "situation": "Users need to scan quickly",
              "recommended": true
            },
            {
              "situation": "Users need to compare values horizontally across items",
              "recommended": false
            },
            {
              "situation": "There are only one or two items",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "行内塞了五个字段就成表格了——横向对比请用 Table。",
            "行与行之间必须有分隔线或留白，否则会看成一坨。"
          ],
          "whenNotToUseEn": [
            "Once a row carries five fields it has become a table — use a Table for horizontal comparison.",
            "Rows need a divider or vertical whitespace between them, otherwise they smear into one block."
          ],
          "demoId": "list",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个列表。",
            "detailed": "加一个设置列表：每行左侧图标 + 标题 + 右侧当前值 + 箭头，整行可点，行间有细分隔线，分组之间有分组标题。",
            "implementation": "<ul> + <li>，每行用 <button> 或 <a> 包裹以保证整行可点。行高最小 48px，padding 16px。分隔线用 li 内 ::after 绝对定位 left 从图标右侧开始（与文字左对齐，不通栏）。分组用 <h3> 标题 + 上下间距，不用分隔线。整行 hover 背景 #F2F0EB。有尾部文字（如「跟随系统」）时用次要色 14px。"
          },
          "aiPromptEn": {
            "basic": "Add a list.",
            "detailed": "Add a settings list: each row has a leading icon + title on the left, the current value + chevron on the right, the whole row is tappable, rows are separated by hairlines, and groups are separated by section headers.",
            "implementation": "<ul> + <li>, with each row wrapped in a <button> or <a> so the whole row is tappable. Row height minimum 48px, padding 16px. Render the divider as an absolutely positioned ::after inside the li whose left offset starts at the right edge of the icon (aligned to the text, not full-bleed). Use an <h3> heading plus vertical spacing for groups instead of dividers. Row hover background #F2F0EB. When there is trailing text (e.g. \"Follow System\"), use the secondary color at 14px."
          },
          "globalIndex": 8,
          "level": 1,
          "analogyBadgeZh": "生活类比: 手机通讯录清单或快递出库单",
          "analogyBadgeEn": "Analogy: Phone Contact Book & Delivery Manifest",
          "analogyDescZh": "按统一规律一排一排整齐列出的条目。每一行代表一个人或一件物品，左右两端通常有头像和操作箭头。",
          "analogyDescEn": "Neatly aligned rows sharing a strict uniform schema. Each row represents a record with avatar, title, and trailing action.",
          "comparisonZh": "<strong>List vs Card:</strong> List 强调高效紧凑与纵向连续扫读，适合数据量大、结构一致的场景；Card 强调独立封闭与视觉冲击，适合探索性浏览。",
          "comparisonEn": "<strong>List vs Card:</strong> Lists excel at dense vertical scanning of uniform items; Cards offer isolated visual containers for exploratory browsing.",
          "quizQuestionZh": "场景思考：当一个设置页有 20 个系统配置项时，为什么应该用带分割线的分组 List，而不是用 20 个大卡片？",
          "quizQuestionEn": "Scenario: Why use grouped Lists instead of 20 big Cards on a settings page?",
          "quizAnswerZh": "List 纵向占用空间小、扫读视线规律平直。如果换成 20 个卡片会产生巨大的视觉噪音和漫长的滚动距离，显著降低查找效率。",
          "quizAnswerEn": "Lists minimize vertical bulk and provide smooth eye-tracking. 20 cards create immense noise and scroll fatigue.",
          "demoType": "list"
        },
        {
          "id": "icon-button",
          "name": "Icon Button",
          "chineseName": "图标按钮",
          "category": "actions",
          "oneLineZh": "只有一个图标、没有文字的按钮，必须配 Tooltip 才有意义。",
          "oneLineEn": "A button with only an icon and no text, which is only meaningful when paired with a tooltip.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "工具栏里需要放很多个操作",
              "recommended": true
            },
            {
              "situation": "图标是业界通用符号（搜索、关闭、分享）",
              "recommended": true
            },
            {
              "situation": "空间极紧（如卡片右上角）",
              "recommended": true
            },
            {
              "situation": "首次出现的功能、图标含义不直观",
              "recommended": false
            },
            {
              "situation": "这是页面的主操作",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The toolbar needs to hold many actions",
              "recommended": true
            },
            {
              "situation": "The icon is an industry-standard symbol (search, close, share)",
              "recommended": true
            },
            {
              "situation": "Space is extremely tight (such as a card corner)",
              "recommended": true
            },
            {
              "situation": "A feature appearing for the first time, with a non-obvious icon",
              "recommended": false
            },
            {
              "situation": "It is the primary action of the page",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "一个需要被「发现」的功能（比如「导出」）不该只用图标——用户得先猜出图标含义。",
            "在中文界面里用单字汉字做图标可读性极差。"
          ],
          "whenNotToUseEn": [
            "A feature that needs to be discovered (say \"Export\") should not be icon-only — users would have to guess the meaning.",
            "Single Chinese characters used as icons are nearly unreadable in a Chinese UI."
          ],
          "demoId": "icon-button",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个图标按钮。",
            "detailed": "在编辑器工具栏右侧加一组 Icon Button：加粗 / 斜体 / 删除。删除用 danger 红色，悬停显示 Tooltip。",
            "implementation": "button 内放 20px 图标（lucide），无文字。视觉尺寸 32×32px，但用伪元素把热区扩到 44×44px（::after absolute inset:-6px）。每个按钮加 aria-label=\"加粗\" 和 Tooltip（悬停 400ms 出现、鼠标移开即消失、支持 Esc 关闭）。danger 按钮 hover 变 #A8342C。工具栏项之间用 4px 间隔，整组加 role=\"toolbar\"。"
          },
          "aiPromptEn": {
            "basic": "Add an icon button.",
            "detailed": "Add a group of icon buttons to the right of the editor toolbar: bold / italic / delete. Delete uses the danger red, and a tooltip appears on hover.",
            "implementation": "A button containing a 20px icon (lucide) with no text. Visual size 32×32px, but expand the hit area to 44×44px with a pseudo-element (::after absolute inset:-6px). Give every button an aria-label and a tooltip (appears after 400ms hover, disappears on mouse leave, closes with Esc). The danger button turns #A8342C on hover. Space items in the toolbar by 4px and wrap the whole group in role=\"toolbar\"."
          },
          "globalIndex": 9,
          "level": 1,
          "analogyBadgeZh": "生活类比: 汽车仪表盘或相机机身上的功能小按键",
          "analogyBadgeEn": "Analogy: Dedicated Hardware Buttons on Camera Body",
          "analogyDescZh": "上面没有文字，只印着快门、闪光灯或喇叭的国际通用符号，体积小巧且位置固定。",
          "analogyDescEn": "Compact buttons bearing universally recognized symbols (shutter, flash, horn) occupying minimal surface area.",
          "comparisonZh": "<strong>Icon Button vs Button:</strong> Icon Button 节省空间，仅适用于心形、放大镜、齿轮等心智极强的图标；歧义图标必须使用文字 Button。",
          "comparisonEn": "<strong>Icon Button vs Button:</strong> Icon Buttons save real estate for universally recognized metaphors; ambiguous actions require text labels.",
          "quizQuestionZh": "场景思考：在移动端界面中，Icon Button 的视觉图标只有 24x24px，如何保证用户的可点击触控体验？",
          "quizQuestionEn": "Scenario: If an Icon Button visual is 24x24px, how do you ensure touch compliance?",
          "quizAnswerZh": "视觉尺寸保持 24px，但外围必须通过 padding 或透明响应层扩展出至少 44x44px 的有效触控热区（Touch Target），防止点空。",
          "quizAnswerEn": "Keep visual icon at 24px, but expand the interactive touch target to at least 44x44px via padding or pseudo-elements.",
          "demoType": "icon-button"
        }
      ]
    },
    {
      "level": 2,
      "nameZh": "开始真正设计一个 App",
      "nameEn": "Actually designing an app",
      "subtitle": "Level 2",
      "descriptionZh": "从「能看」到「会选」。这一层的价值在于让你在多个可行方案里挑出对的那个。",
      "descriptionEn": "From recognising to choosing. This level is about picking the right one out of several workable options.",
      "patternIds": [
        "bottom-sheet",
        "drawer",
        "accordion",
        "segmented-control",
        "skeleton",
        "empty-state",
        "snackbar",
        "stepper",
        "bottom-navigation",
        "slider",
        "badge",
        "chip",
        "pagination",
        "tooltip"
      ],
      "items": [
        {
          "id": "bottom-sheet",
          "name": "Bottom Sheet",
          "chineseName": "底部弹出面板",
          "category": "containers",
          "oneLineZh": "从屏幕底部往上滑出来的一块面板，停在那儿不占满全屏。",
          "oneLineEn": "A panel that slides up from the bottom edge of the screen and rests there without taking over the whole display.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "移动端需要一个轻量的选择或操作面板",
              "recommended": true
            },
            {
              "situation": "想保留底层页面上下文（用户还能看到自己在哪）",
              "recommended": true
            },
            {
              "situation": "操作项在 3–8 个之间",
              "recommended": true
            },
            {
              "situation": "内容需要全屏深度（长表单、编辑器）",
              "recommended": false
            },
            {
              "situation": "桌面端 Web 界面",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Mobile needs a lightweight selection or action panel",
              "recommended": true
            },
            {
              "situation": "You want to keep the context of the page underneath (users still see where they are)",
              "recommended": true
            },
            {
              "situation": "There are between 3 and 8 actions",
              "recommended": true
            },
            {
              "situation": "The content needs full-screen depth (a long form, an editor)",
              "recommended": false
            },
            {
              "situation": "A desktop web interface",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "内容超过半屏时，Bottom Sheet 会让用户失去「页面」的锚点感，这时用全屏页面更稳。",
            "要严格「拦住」用户必须做决定时，Modal 的阻断感更强。"
          ],
          "whenNotToUseEn": [
            "Once the content passes half the screen, a bottom sheet costs the user their sense of \"page\" — a full screen is steadier there.",
            "When you need to strictly block the user until they decide, a modal interrupts far more forcefully."
          ],
          "demoId": "bottom-sheet",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "从底部弹个东西出来。",
            "detailed": "点击「筛选」后从屏幕底部打开 Bottom Sheet：高度根据内容自适应，最大不超过视口 70%，背景保留并加半透明遮罩，顶部有拖拽 Handle，向下拖动或点击遮罩关闭。",
            "implementation": "容器 fixed inset-0 z-50，遮罩 rgba(0,0,0,0.4) 淡入。面板 fixed bottom-0，max-height: 70vh，圆角 16px 16px 0 0，transform: translateY(100%) → 0 过渡 280ms cubic-bezier(0.32,0.72,0,1)。顶部 12px 处放 36×4px 灰色 Drag Handle。关闭方式三选一以上：拖拽 Handle 下滑（跟手）、点击遮罩、点击取消按钮。打开时锁定 body 滚动 + Esc 关闭。高度用内容实测 max-height 限制，而非固定高度。"
          },
          "aiPromptEn": {
            "basic": "Slide something up from the bottom.",
            "detailed": "After tapping \"Filters\", open a bottom sheet from the bottom of the screen: the height adapts to the content and never exceeds 70% of the viewport, the page behind stays visible under a translucent scrim, there is a drag handle at the top, and dragging down or tapping the scrim closes it.",
            "implementation": "Container fixed inset-0 z-50, scrim rgba(0,0,0,0.4) fading in. Panel fixed bottom-0, max-height: 70vh, border-radius 16px 16px 0 0, transform: translateY(100%) → 0 over 280ms with cubic-bezier(0.32,0.72,0,1). Place a 36×4px gray drag handle 12px from the top. Offer at least three ways to close: drag the handle down (tracking the finger), tap the scrim, tap the cancel button. Lock body scroll while open and close on Esc. Constrain the height with a measured max-height rather than a fixed height."
          },
          "globalIndex": 10,
          "level": 2,
          "analogyBadgeZh": "生活类比: 抽屉下层拉出的收纳托盘",
          "analogyBadgeEn": "Analogy: Slide-out Storage Tray from Bottom Drawer",
          "analogyDescZh": "从屏幕底部向上拉起的面板，单手大拇指触手可及，适合移动端承载操作选项或详情。",
          "analogyDescEn": "A panel sliding up from the bottom edge, comfortably resting within the thumb's natural sweep on mobile devices.",
          "comparisonZh": "<strong>Bottom Sheet vs Modal:</strong> 移动端 Bottom Sheet 触控舒适度远高于屏幕居中弹窗，符合现代手机单手大拇指下半屏操作习惯。",
          "comparisonEn": "<strong>Bottom Sheet vs Modal:</strong> Bottom Sheets hug the lower half of screens, offering vastly superior ergonomics over centered popups.",
          "quizQuestionZh": "场景思考：什么时候 Bottom Sheet 应该支持半屏与全屏两级展开（Half / Full expanded）？",
          "quizQuestionEn": "Scenario: When should a Bottom Sheet support half and full height snapping?",
          "quizAnswerZh": "当内容既有即时快速概览（如地图上的地点名片），又有深度长文（如用户评价与营业时间详情）时，支持向上拖拽全屏展开体验最佳。",
          "quizAnswerEn": "When users need quick preview (map POI summary) with optional deep dive (reviews and opening hours) via upward drag.",
          "demoType": "bottom-sheet"
        },
        {
          "id": "drawer",
          "name": "Drawer",
          "chineseName": "抽屉",
          "category": "containers",
          "oneLineZh": "从屏幕边缘滑出来的一块面板，通常是侧面的，也可以是底部的。",
          "oneLineEn": "A panel that slides in from the edge of the screen, usually from the side, sometimes from the bottom.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "移动端需要容纳底部导航放不下的入口",
              "recommended": true
            },
            {
              "situation": "筛选条件较多，需要一个完整面板承载",
              "recommended": true
            },
            {
              "situation": "主内容需要保持可见（对比筛选结果）",
              "recommended": "mostly"
            },
            {
              "situation": "需要一次展示大量信息（帮助、详情）",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Mobile needs room for entries that bottom navigation cannot fit",
              "recommended": true
            },
            {
              "situation": "There are many filter conditions that need a full panel to live in",
              "recommended": true
            },
            {
              "situation": "The main content needs to stay visible (to compare against filtered results)",
              "recommended": "mostly"
            },
            {
              "situation": "You need to show a large amount of information at once (help, details)",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "Drawer 里如果再放 Tabs 和 Accordion，就已经是个页面了——不如直接导航过去。",
            "多个 Drawer 互相嵌套（抽屉里开抽屉）会让返回逻辑变得混乱。"
          ],
          "whenNotToUseEn": [
            "Once a drawer holds tabs and accordions, it is a page wearing a disguise — just navigate there.",
            "Nesting drawers inside drawers turns the back behavior into a guessing game."
          ],
          "demoId": "drawer",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "从左边滑出个面板。",
            "detailed": "加一个从左侧滑出的 Drawer，宽 300px，承载主导航；汉堡按钮唤起，遮罩点击或 Esc 关闭，关闭后焦点返回按钮。",
            "implementation": "容器 fixed inset-0 z-50，遮罩 rgba(0,0,0,0.4)。面板 fixed left-0 top-0 h-full w-[300px]，transform: translateX(-100%) → 0 过渡 250ms。打开时锁定 body 滚动，focus trap 在面板内，Esc 关闭，关闭后焦点还给汉堡按钮。支持边缘右滑手势打开（touchstart/touchmove 检测起点 x<20px）。移动端固定，移动端以上（≥1024px）应该直接常驻显示而不是 Drawer。"
          },
          "aiPromptEn": {
            "basic": "Slide a panel in from the left.",
            "detailed": "Add a drawer that slides in from the left, 300px wide, carrying the primary navigation. A hamburger button opens it; a scrim click or Esc closes it, and focus returns to the button on close.",
            "implementation": "Container fixed inset-0 z-50, scrim rgba(0,0,0,0.4). Panel fixed left-0 top-0 h-full w-[300px], transform: translateX(-100%) → 0 over 250ms. Lock body scroll while open, trap focus inside the panel, close on Esc, and return focus to the hamburger button on close. Support an edge-swipe gesture to open (detect touchstart/touchmove starting at x<20px). Fixed on mobile; at mobile-and-up sizes (≥1024px) it should be permanently visible as a sidebar rather than a drawer."
          },
          "globalIndex": 11,
          "level": 2,
          "analogyBadgeZh": "生活类比: 书桌侧面的滑轨暗格",
          "analogyBadgeEn": "Analogy: Lateral Sliding Compartment on a Desk",
          "analogyDescZh": "平时藏在屏幕视口边缘之外，用手一拉就从侧面滑出，容纳全局导航或辅助筛选菜单。",
          "analogyDescEn": "Hidden outside the viewport edge until pulled out laterally to reveal global navigation or deep filters.",
          "comparisonZh": "<strong>Drawer vs Modal:</strong> Drawer 贴边滑出，具有明确的侧向层级感，更适合深度的目录树和过滤器；Modal 居中且聚焦独立事件。",
          "comparisonEn": "<strong>Drawer vs Modal:</strong> Drawers emerge from boundaries preserving spatial context for tree structures; Modals isolate a single event.",
          "quizQuestionZh": "场景思考：在桌面端宽屏设备中，侧边导航 Drawer 是否还需要在点击外部时自动收起并带遮罩？",
          "quizQuestionEn": "Scenario: On wide desktop screens, should a navigation Drawer auto-dismiss with backdrop overlay?",
          "quizAnswerZh": "在宽屏桌面端（如 >1200px），通常应将 Drawer 转为常驻固定的侧边栏（Persistent Sidebar），无需遮罩以提高操作效率。",
          "quizAnswerEn": "On wide desktops (>1200px), lock the Drawer into a permanent sidebar without dimming backdrops to preserve workflow speed.",
          "demoType": "drawer"
        },
        {
          "id": "accordion",
          "name": "Accordion",
          "chineseName": "手风琴 / 折叠面板",
          "category": "containers",
          "oneLineZh": "点一下标题，下面的内容就展开；再点一下，收起来。",
          "oneLineEn": "Click a heading and the content below it expands; click again and it collapses back out of the way.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "内容多但可以压成小空间（FAQ）",
              "recommended": true
            },
            {
              "situation": "用户不需要同时看到所有内容",
              "recommended": true
            },
            {
              "situation": "条目长度不一、无法对齐成表格",
              "recommended": true
            },
            {
              "situation": "用户需要横向比较所有条目的内容",
              "recommended": false
            },
            {
              "situation": "内容只有两三行，直接显示即可",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "There is a lot of content that can be compressed into a small space (FAQ)",
              "recommended": true
            },
            {
              "situation": "Users do not need to see everything at once",
              "recommended": true
            },
            {
              "situation": "Entries vary in length and cannot be aligned into a table",
              "recommended": true
            },
            {
              "situation": "Users need to compare the content of all entries side by side",
              "recommended": false
            },
            {
              "situation": "The content is only two or three lines — just show it directly",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "如果用户需要对比多个条目的细节，折叠起来反而增加了操作成本。",
            "在内容只有一条时用 Accordion 是纯粹的包装。"
          ],
          "whenNotToUseEn": [
            "If users need to compare details across several entries, hiding them behind clicks only adds work.",
            "Using an accordion when there is a single entry is pure packaging with no payoff."
          ],
          "demoId": "accordion",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个可以展开收起的。",
            "detailed": "加一个 FAQ 折叠面板：可同时展开多个条目，标题整行可点，右侧箭头在展开时旋转 180°，内容用网格行过渡动画。",
            "implementation": "每条用 <button aria-expanded={open} aria-controls={id}> 作标题行（整行热区，padding 16px 20px，最小高 48px），内容区 <div id role=\"region\" aria-labelledby>。展开动画用 grid-template-rows: 0fr → 1fr 过渡（250ms）比 max-height 方案更平滑，容器需 overflow: hidden。Chevron 图标用 transition: transform。允许多开时 openItems 是 Set。不要用 <details> 原生标签，因为无法控制动画和默认箭头样式。"
          },
          "aiPromptEn": {
            "basic": "Add something that expands and collapses.",
            "detailed": "Add an FAQ accordion: multiple entries can be open at the same time, the whole heading row is clickable, the chevron on the right rotates 180° when expanded, and the content uses a grid-row transition.",
            "implementation": "Each entry uses <button aria-expanded={open} aria-controls={id}> as the heading row (full-row hit area, padding 16px 20px, min-height 48px), with the content region as <div id role=\"region\" aria-labelledby>. Animate expansion with a grid-template-rows: 0fr → 1fr transition (250ms), which is smoother than the max-height approach; the container needs overflow: hidden. Animate the chevron with transition: transform. When multiple entries may be open, openItems is a Set. Do not use the native <details> element, because its animation and default arrow styling cannot be controlled."
          },
          "globalIndex": 12,
          "level": 2,
          "analogyBadgeZh": "生活类比: 乐器手风琴的风箱褶皱",
          "analogyBadgeEn": "Analogy: Pleated Bellows of an Accordion",
          "analogyDescZh": "折叠时只露出几个章节标题，点击某个标题就会像风箱一样展开正文，其余部分自动推移。",
          "analogyDescEn": "Collapsed states show clean headings; clicking expands details like accordion bellows while pushing down surrounding items.",
          "comparisonZh": "<strong>Accordion vs Tabs:</strong> Accordion 是纵向垂直堆叠与展开，适合 FAQ 问答和移动端篇幅压缩；Tabs 是横向平行视图切换。",
          "comparisonEn": "<strong>Accordion vs Tabs:</strong> Accordions stack vertically ideal for FAQs and mobile content pacing; Tabs offer lateral view parity.",
          "quizQuestionZh": "场景思考：FAQ 常见问题页中，手风琴是否应该支持同时展开多个问题？",
          "quizQuestionEn": "Scenario: In FAQ pages, should accordions support expanding multiple items simultaneously?",
          "quizAnswerZh": "通常支持多项同时展开更利于用户比对上下文答案；但在移动端空间极度紧张时，切换互斥展开可以避免页面被无限撑长。",
          "quizAnswerEn": "Multi-expansion helps cross-referencing answers; mutual exclusivity helps mobile screens avoid runaway page lengths.",
          "demoType": "accordion"
        },
        {
          "id": "segmented-control",
          "name": "Segmented Control",
          "chineseName": "分段控件",
          "category": "input",
          "oneLineZh": "一排挤在一起的小按钮，选中其中一个，像被「分段」了一样。",
          "oneLineEn": "A row of small buttons packed shoulder to shoulder, one of them selected, so the control looks \"segmented\".",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "2–4 个视图之间的切换",
              "recommended": true
            },
            {
              "situation": "所有选项都很短（1–4 个字）",
              "recommended": true
            },
            {
              "situation": "希望控件宽度跟着内容而不是通栏",
              "recommended": true
            },
            {
              "situation": "每个选项需要一个独立 URL",
              "recommended": false
            },
            {
              "situation": "选项文字长短差异很大",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Switching between two and four views",
              "recommended": true
            },
            {
              "situation": "All the options are very short (one to four words)",
              "recommended": true
            },
            {
              "situation": "You want the control to hug its content instead of spanning full width",
              "recommended": true
            },
            {
              "situation": "Each option needs its own URL",
              "recommended": false
            },
            {
              "situation": "The option labels vary a lot in length",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "如果每个视图要能单独分享/收藏（要有各自 URL），用 Tabs。",
            "文字长短不一会让分段宽度很怪——要么统一用图标，要么改用 Select。"
          ],
          "whenNotToUseEn": [
            "If each view needs to be shareable or bookmarkable (its own URL), use Tabs.",
            "Wildly different label lengths make the segments look broken — either use icons uniformly or switch to a Select."
          ],
          "demoId": "segmented-control",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加一个可以切换的分段按钮。",
            "detailed": "加一个 Segmented Control：日 / 周 / 月 三段，选中项白色填充并带轻微阴影，切换只影响同一块区域，不改 URL。",
            "implementation": "外层 div 浅灰底 #F2F0EB 圆角 8px padding 3px，内含若干 button flex: 1。选中项白底 + box-shadow 0 1px 3px rgba(0,0,0,0.1) + 轻微放大。用 role=\"tablist\" + role=\"tab\" + aria-selected，或用 radio group 语义（若本质是选项）。切换动画：白色滑块用 transform 平移而非直接切换会更顺滑。"
          },
          "aiPromptEn": {
            "basic": "Add a toggle button group.",
            "detailed": "Add a Segmented Control with three segments — Day / Week / Month — where the selected item has a white fill and a subtle shadow. Switching only affects the same region of the page and never changes the URL.",
            "implementation": "Outer div with a light gray background #F2F0EB, 8px radius and 3px padding, containing buttons with flex: 1. The selected item gets a white background plus box-shadow 0 1px 3px rgba(0,0,0,0.1) and a slight scale-up. Use role=\"tablist\" with role=\"tab\" and aria-selected, or radio group semantics if it is genuinely a choice. For the transition, translate the white pill with transform rather than swapping it instantly — it feels much smoother."
          },
          "globalIndex": 13,
          "level": 2,
          "analogyBadgeZh": "生活类比: 老式录音机上的机械排键",
          "analogyBadgeEn": "Analogy: Mechanical Interlocking Buttons on Old Radios",
          "analogyDescZh": "几个并排相连的按键包裹在一个外框里，按下其中一个时，其它按键自动弹起，永远保持单选状态。",
          "analogyDescEn": "Interconnected switches inside a shared chassis; pressing one instantly pops up the others to enforce single selection.",
          "comparisonZh": "<strong>Segmented Control vs Tabs:</strong> 分段控件更紧凑，常用于在同一组数据内切换展示形态（如周/月/年视图或地图/列表视图）。",
          "comparisonEn": "<strong>Segmented Control vs Tabs:</strong> Segmented controls are compact modifiers for the same data scope (e.g. Day/Week/Month).",
          "quizQuestionZh": "场景思考：分段控件最多适合容纳多少个选项？如果选项数量超过界限该用什么替代？",
          "quizQuestionEn": "Scenario: What is the optimal option limit for a Segmented Control?",
          "quizAnswerZh": "分段控件最佳选项数量为 2–4 项，文字必须简短；超过 5 项或文字较长时，应换用横向滑动 Tabs 或下拉菜单 (Select)。",
          "quizAnswerEn": "Keep it to 2-4 short options. Beyond 5 items, migrate to scrollable tabs or a dropdown select.",
          "demoType": "segmented-control"
        },
        {
          "id": "skeleton",
          "name": "Skeleton",
          "chineseName": "骨架屏",
          "category": "feedback",
          "oneLineZh": "数据没到之前，先用灰色块把未来的布局摆出来。",
          "oneLineEn": "Before the data arrives, lay out the future layout using grey blocks so the shape of the page is already on screen.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "首次加载一个有固定结构的页面",
              "recommended": true
            },
            {
              "situation": "等待超过 1 秒",
              "recommended": true
            },
            {
              "situation": "需要让用户提前理解页面结构",
              "recommended": true
            },
            {
              "situation": "分页加载更多（追加到列表底部）",
              "recommended": true
            },
            {
              "situation": "结构不固定（无限滚动未知内容）",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "First load of a page with a predictable structure",
              "recommended": true
            },
            {
              "situation": "The wait is longer than 1 second",
              "recommended": true
            },
            {
              "situation": "Users need to understand the page structure up front",
              "recommended": true
            },
            {
              "situation": "Pagination loads more items (appended to the bottom of the list)",
              "recommended": true
            },
            {
              "situation": "The structure is unpredictable (infinite scroll with unknown content)",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "如果数据 200ms 就回来了，Skeleton 的闪现本身就是干扰——加一个最短显示时长（如 300ms）。",
            "骨架的形状要真的和最终内容一致，否则用户会看到「形状变了」的抖动。"
          ],
          "whenNotToUseEn": [
            "If the data comes back in 200ms, the skeleton flashing by is itself a distraction — enforce a minimum display time (say 300ms).",
            "The skeleton shapes must match the real content exactly, otherwise users see the layout jump when it is replaced."
          ],
          "demoId": "skeleton",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加载的时候显示灰色占位。",
            "detailed": "列表加载时用 Skeleton：显示 6 个和真实卡片等高的灰色占位块，带微光扫过动画，数据到达后淡出替换为真实内容。",
            "implementation": "每条占位块的高度、宽度、间距与真实卡片完全一致（尤其首行文字宽度约 60%、次行 40%，模拟真实文本行长度）。背景 #E6E3DB（比纯灰柔和），微光用 linear-gradient 从左到右扫过，周期 1.5s，opacity 从 0.4→0.9。若加载很快，加一个「最短显示 300ms」的延迟避免闪烁。prefers-reduced-motion 下关闭微光动画，仅显示静态灰块。"
          },
          "aiPromptEn": {
            "basic": "Show grey placeholders while loading.",
            "detailed": "Use a skeleton for the loading list: show six grey placeholder blocks matching the height of the real cards, with a shimmer sweeping across, and fade them out into the real content when the data arrives.",
            "implementation": "Each placeholder block must have exactly the same height, width and spacing as the real card (especially the first text line at about 60% width and the second at 40%, to mimic real line lengths). Background #E6E3DB (softer than pure grey), shimmer via a linear-gradient sweeping left to right, 1.5s period, opacity from 0.4→0.9. If loading is fast, add a \"minimum 300ms display\" delay to avoid a flash. Under prefers-reduced-motion, drop the shimmer and show static grey blocks."
          },
          "globalIndex": 14,
          "level": 2,
          "analogyBadgeZh": "生活类比: 建筑工地上先立起的钢筋梁柱框架",
          "analogyBadgeEn": "Analogy: Structural Steel Framework on Construction Sites",
          "analogyDescZh": "在真正装修完工之前，你先看到房屋的大致轮廓与格局，知道接下来哪个位置会放什么家具。",
          "analogyDescEn": "Before interior finishing, you see the architectural skeleton, priming your brain for where content will land.",
          "comparisonZh": "<strong>Skeleton vs Spinner:</strong> Spinner 只在中心转圈，让人感知漫长等待；Skeleton 提前勾勒出内容版块形状，极大降低用户感官等待时间。",
          "comparisonEn": "<strong>Skeleton vs Spinner:</strong> Spinners induce perceived waiting; Skeletons outline structural layouts reducing perceived load time.",
          "quizQuestionZh": "场景思考：骨架屏中的灰色线条长度是否应该全部保持 100% 等长？",
          "quizQuestionEn": "Scenario: Should skeleton text lines all be 100% full width?",
          "quizAnswerZh": "不应该。真实文本段落往往长短不一，骨架屏的最后一行应设计为 60%-70% 宽度，模拟真实自然段落，避免产生死板色块感。",
          "quizAnswerEn": "No. Real paragraphs vary. Truncating the final skeleton line to 60-70% mimics natural copy cadence.",
          "demoType": "skeleton"
        },
        {
          "id": "empty-state",
          "name": "Empty State",
          "chineseName": "空状态",
          "category": "feedback",
          "oneLineZh": "列表空空如也时显示的那块内容——它该解释为什么空，以及下一步做什么。",
          "oneLineEn": "The block you show when a list is completely empty — it should explain why it is empty and what to do next.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "列表、搜索结果、收件箱没有任何内容",
              "recommended": true
            },
            {
              "situation": "用户第一次使用，页面完全空白",
              "recommended": true
            },
            {
              "situation": "筛选后结果为空",
              "recommended": true
            },
            {
              "situation": "任务完成了（清单全部完成）",
              "recommended": "mostly"
            },
            {
              "situation": "只是加载中",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "A list, search result, or inbox has nothing in it",
              "recommended": true
            },
            {
              "situation": "It is the user first time and the page is completely blank",
              "recommended": true
            },
            {
              "situation": "A filter combination returned no results",
              "recommended": true
            },
            {
              "situation": "A task is finished (every item on a checklist is done)",
              "recommended": "mostly"
            },
            {
              "situation": "The content is merely still loading",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "三种空状态要区别对待：「从没创建过」「筛选后无结果」「任务已完成」——文案和行动建议完全不同。",
            "空状态插画不能喧宾夺主，它是配角。"
          ],
          "whenNotToUseEn": [
            "Three kinds of empty state need different treatment: \"never created anything\", \"no results for this filter\", and \"task complete\" — the copy and the recommended action are completely different.",
            "The empty-state illustration is a supporting actor, not the star."
          ],
          "demoId": "empty-state",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "没数据时显示个提示。",
            "detailed": "搜索无结果时显示空状态：标题「没有找到匹配的照片」，说明「试试减少筛选条件，或换个关键词」，主操作「清除全部筛选」。",
            "implementation": "垂直居中布局，最大宽 320px，间距 24px 插图 + 12px 标题 + 8px 描述 + 16px 按钮。区分三种空状态文案：「首次使用」（讲价值 + 主 CTA 引导创建）、「筛选无结果」（讲怎么放宽条件 + 清除筛选按钮）、「已完成」（庆祝语气，可无按钮）。空状态不要用 Skeleton 样式（灰块），要明确告诉用户「这是空的，不是加载中」。"
          },
          "aiPromptEn": {
            "basic": "Show a message when there is no data.",
            "detailed": "When a search returns nothing, show an empty state: the title \"No photos match your search\", the description \"Try removing some filters or searching for something else\", and the primary action \"Clear all filters\".",
            "implementation": "Vertically centered layout, max-width 320px, with 24px between illustration and title, 12px between title and description, 8px between description and button, 16px to the button. Write three distinct sets of copy: \"first run\" (the value plus a primary CTA that creates something), \"no results for this filter\" (how to loosen the filter, with a clear-filters button), and \"all done\" (a celebratory tone, optionally with no button at all). Never style an empty state like a skeleton (grey blocks) — it has to say clearly \"this is empty, not loading\"."
          },
          "globalIndex": 15,
          "level": 2,
          "analogyBadgeZh": "生活类比: 新买的空白日记本第一页",
          "analogyBadgeEn": "Analogy: Blank First Page of a Fresh Diary",
          "analogyDescZh": "上面不是一片绝望的空白，而是印刷着温柔的导言和第一笔书写的建议，鼓励你开始记录。",
          "analogyDescEn": "Not a barren wasteland, but a warm invitation with helpful prompts encouraging you to write the first entry.",
          "comparisonZh": "<strong>Empty State vs Error State:</strong> Empty State 是正常使用中「暂无数据」的自然状态；Error State 是网络断开或服务异常导致的非预期失败。",
          "comparisonEn": "<strong>Empty State vs Error State:</strong> Empty State represents natural zero-data beginnings; Error State is an abnormal systemic fault.",
          "quizQuestionZh": "场景思考：一个合格的空状态界面除了友善插画和说明文案，还必须具备什么关键元素？",
          "quizQuestionEn": "Scenario: What essential element must an Empty State have besides illustration and copy?",
          "quizAnswerZh": "必须具备直接的行动入口（Call-to-Action 按钮），例如「去添加第一件商品」或「探索热门内容」，避免用户陷入死胡同。",
          "quizAnswerEn": "A clear actionable Call-to-Action button (\"Create First Project\", \"Browse Catalog\") preventing dead ends.",
          "demoType": "empty-state"
        },
        {
          "id": "snackbar",
          "name": "Snackbar",
          "chineseName": "带操作提示条",
          "category": "feedback",
          "oneLineZh": "和 Toast 长得差不多，但底部多了一个可选的操作按钮，比如「撤销」。",
          "oneLineEn": "Looks much like a toast, except it carries one optional action button at the bottom — typically \"Undo\".",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "删除/移动等操作后提供撤销",
              "recommended": true
            },
            {
              "situation": "操作已生效，用户可能想反悔",
              "recommended": true
            },
            {
              "situation": "想避免「弹窗确认」打断用户",
              "recommended": true
            },
            {
              "situation": "只是告知成功，没有任何后续动作",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "You want to offer an undo after a delete, move, or similar operation",
              "recommended": true
            },
            {
              "situation": "The action already took effect and the user might change their mind",
              "recommended": true
            },
            {
              "situation": "You want to avoid the interruption of a confirmation dialog",
              "recommended": true
            },
            {
              "situation": "You only need to report success with no follow-up action at all",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "如果撤销窗口只有 3 秒，对重要内容来说太短——要么延长时间，要么用确认框。",
            "底部有导航栏时，Snackbar 要上移，否则会被导航栏压住。"
          ],
          "whenNotToUseEn": [
            "If the undo window is only 3 seconds, that is too short for important content — either extend the duration or use a confirmation dialog.",
            "When there is a bottom navigation bar, the snackbar has to shift up or the nav bar will cover it."
          ],
          "demoId": "snackbar",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "删除后给个撤销的机会。",
            "detailed": "删除照片后底部显示 Snackbar「已删除 1 张照片」+「撤销」按钮，5 秒后自动消失；底部有导航时上移 80px。",
            "implementation": "fixed bottom: calc(80px + env(safe-area-inset-bottom))，水平居中，深色底白字圆角 8px，左侧文字右侧「撤销」文字按钮（高对比色，不用蓝色）。5 秒倒计时自动消失，同时监听指针悬停暂停倒计时。点击「撤销」立即执行恢复并移除 snackbar。role=\"status\" + aria-live=\"polite\"，并给撤销按钮足够大的热区。"
          },
          "aiPromptEn": {
            "basic": "Offer a chance to undo after deleting.",
            "detailed": "After a photo is deleted, show a snackbar at the bottom: \"1 photo deleted\" plus an \"Undo\" button, auto-dismissing after 5 seconds; shift it up by 80px when there is bottom navigation.",
            "implementation": "fixed bottom: calc(80px + env(safe-area-inset-bottom)), horizontally centered, dark background with white text, border-radius 8px, message on the left and an \"Undo\" text button on the right (high-contrast color, not blue). Auto-dismiss after a 5 second countdown, and pause the countdown on pointer hover. Clicking \"Undo\" performs the restore immediately and removes the snackbar. role=\"status\" + aria-live=\"polite\", and give the undo button a generous hit area."
          },
          "globalIndex": 16,
          "level": 2,
          "analogyBadgeZh": "生活类比: 邮递员投递后附上的「若需退回请撕此条」便签",
          "analogyBadgeEn": "Analogy: Return Slip Attached by the Courier",
          "analogyDescZh": "在屏幕边缘短暂弹出，不仅汇报了刚刚发生的事，还附带一个像「撤销」这样的紧急补救操作。",
          "analogyDescEn": "Briefly pops along the edge, confirming what just occurred while providing a lifeline action like Undo.",
          "comparisonZh": "<strong>Snackbar vs Toast:</strong> Toast 纯信息通知，没有任何可交互按钮；Snackbar 带有简短文本和至少一个操作入口（最典型是撤销 Undo）。",
          "comparisonEn": "<strong>Snackbar vs Toast:</strong> Toasts are passive notifications; Snackbars bundle actionable remedies (most notably Undo).",
          "quizQuestionZh": "场景思考：为什么 Snackbar 里的操作按钮通常只允许有 1 个，且必须是短文本（如撤销）？",
          "quizQuestionEn": "Scenario: Why limit a Snackbar to exactly one short action button?",
          "quizAnswerZh": "Snackbar 停留时间短（通常 4-6 秒），复杂的多按钮或长文本会让用户来不及阅读与决策，造成误操作或错过时机。",
          "quizAnswerEn": "Snackbars disappear in 4-6 seconds; multiple actions induce panic and trigger mis-taps.",
          "demoType": "snackbar"
        },
        {
          "id": "stepper",
          "name": "Stepper",
          "chineseName": "步骤条",
          "category": "navigation",
          "oneLineZh": "一个需要分几步完成的长流程，用一排编号节点告诉你「现在第几步、还剩几步」。",
          "oneLineEn": "A long flow broken into several steps, with a row of numbered nodes telling you which step you are on and how many are left.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "任务必须按顺序完成（3–5 步最合适）",
              "recommended": true
            },
            {
              "situation": "步骤多到用户会担心「还有多久」",
              "recommended": true
            },
            {
              "situation": "允许回退到已完成步骤",
              "recommended": true
            },
            {
              "situation": "一步就能完成的任务",
              "recommended": false
            },
            {
              "situation": "步骤数量会动态变化",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The task must be done in order (3–5 steps is the sweet spot)",
              "recommended": true
            },
            {
              "situation": "There are enough steps that users worry about how long it takes",
              "recommended": true
            },
            {
              "situation": "Going back to a completed step is allowed",
              "recommended": true
            },
            {
              "situation": "The task can be finished in one step",
              "recommended": false
            },
            {
              "situation": "The number of steps changes dynamically",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "一步就能做完的事情硬拆成三步，是纯粹的用户伤害。",
            "超过 5 步时横向排布会挤爆，移动端应改成「第 2 步 / 共 5 步 + 进度条」。"
          ],
          "whenNotToUseEn": [
            "Splitting something that takes one step into three is pure user harm.",
            "Past 5 steps the horizontal layout overflows — on mobile switch to \"Step 2 of 5\" plus a progress bar."
          ],
          "demoId": "stepper",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "把流程做成几步，显示当前进度。",
            "detailed": "把结算流程做成 Stepper，共 4 步：购物车 / 地址 / 支付 / 完成。当前步高亮，已完成步显示对勾，可点击回退到已完成步骤。",
            "implementation": "渲染 steps 数组并用 flex 横向排列，节点间用 flex-1 的连接线。状态判定：index < current → completed（实心 + Check 图标）；index === current → active（描边加粗）；index > current → upcoming（灰色，disabled）。点击 completed 步骤可回退，upcoming 不可点击。移动端（<640px）隐藏 label 只显示圆点 + 进度文字「第 2 步 / 共 4 步」。容器加 aria-label=\"结算步骤\"，当前步骤加 aria-current=\"step\"。"
          },
          "aiPromptEn": {
            "basic": "Break the flow into steps and show the current progress.",
            "detailed": "Turn the checkout flow into a 4-step stepper: Cart / Address / Payment / Done. Highlight the current step, show a checkmark on completed steps, and allow clicking back into a completed step.",
            "implementation": "Render the steps array in a horizontal flex layout, with flex-1 connectors between nodes. State rules: index < current → completed (solid + Check icon); index === current → active (bold outline); index > current → upcoming (gray, disabled). Completed steps are clickable to go back; upcoming ones are not. On mobile (<640px) hide the labels and show only the dots plus the progress text \"Step 2 of 4\". The container gets aria-label=\"Checkout steps\" and the current step gets aria-current=\"step\"."
          },
          "globalIndex": 17,
          "level": 2,
          "analogyBadgeZh": "生活类比: 宜家家具组装说明书上的「步骤 1/4」",
          "analogyBadgeEn": "Analogy: Step 1 of 4 in Furniture Assembly Manual",
          "analogyDescZh": "清清楚楚标明已经完成了哪几步、现在正在哪一步、后面还剩多少任务，让人心里有底。",
          "analogyDescEn": "Clearly charts past steps, current position, and remaining tasks, banishing onboarding anxiety.",
          "comparisonZh": "<strong>Stepper vs Progress Bar:</strong> Progress Bar 仅表示无阶段的连续百分比；Stepper 将整体任务拆分为具有强业务语义的离散阶段。",
          "comparisonEn": "<strong>Stepper vs Progress Bar:</strong> Progress Bars show abstract continuous progress; Steppers guide distinct semantic milestones.",
          "quizQuestionZh": "场景思考：在线下单支付流程中，如果用户已经在第 3 步「确认支付」，他能否点击步骤条回到第 1 步「修改收货地址」？",
          "quizQuestionEn": "Scenario: Can users click earlier steps in a checkout Stepper to edit previous data?",
          "quizAnswerZh": "可以。已完成的历史步骤应允许用户点击回溯修改；但尚未到达的未来步骤必须置灰禁用，防止跳步引发数据逻辑缺失。",
          "quizAnswerEn": "Yes. Completed prior steps should remain clickable for edits, while future steps stay disabled.",
          "demoType": "stepper"
        },
        {
          "id": "bottom-navigation",
          "name": "Bottom Navigation",
          "chineseName": "底部导航栏",
          "category": "navigation",
          "oneLineZh": "App 最底部那一排图标按钮，负责在 3–5 个顶级功能之间切换。",
          "oneLineEn": "The row of icon buttons pinned to the bottom of an app, switching between 3–5 top-level destinations.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "移动 App 有 3–5 个平级主功能",
              "recommended": true
            },
            {
              "situation": "用户需要在功能间频繁往返",
              "recommended": true
            },
            {
              "situation": "单手握持、拇指可达性优先",
              "recommended": true
            },
            {
              "situation": "桌面端 Web 应用",
              "recommended": "mostly"
            },
            {
              "situation": "有 6 个以上平级入口",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The mobile app has 3–5 peer primary features",
              "recommended": true
            },
            {
              "situation": "Users move back and forth between features often",
              "recommended": true
            },
            {
              "situation": "One-handed grip and thumb reachability come first",
              "recommended": true
            },
            {
              "situation": "Desktop web applications",
              "recommended": "mostly"
            },
            {
              "situation": "There are more than 6 peer destinations",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "入口多于 5 个时用户会开始乱点，应该收进「更多」或侧边栏。",
            "用户正在沉浸阅读或编辑时，底栏应该隐藏，把空间还给内容。"
          ],
          "whenNotToUseEn": [
            "Past five destinations users start tapping blindly — fold the rest into \"More\" or a side menu.",
            "Hide it while users are reading or editing immersively, and give the space back to the content."
          ],
          "demoId": "bottom-navigation",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "底部加一排导航图标。",
            "detailed": "在 App 底部加 Bottom Navigation，包含 首页 / 搜索 / 收藏 / 我的 四项，选中项图标和文字高亮。",
            "implementation": "固定定位在屏幕底部，容器 role=\"navigation\" aria-label=\"主导航\"，每个项是 button 且 aria-current=\"page\" 表示选中。高度 56px + env(safe-area-inset-bottom)。图标 24px，标签 10–11px。选中态用主色 #1A1917，未选中 #7A766D。点击后切换路由并保持每个 tab 各自的滚动位置。未读数量用绝对定位的 Badge 显示在图标右上角，数字 >99 显示 99+。"
          },
          "aiPromptEn": {
            "basic": "Add a row of navigation icons at the bottom.",
            "detailed": "Add bottom navigation to the app with four items — Home / Search / Saved / Profile — where the active item highlights both icon and label.",
            "implementation": "Fixed to the bottom of the screen. The container is role=\"navigation\" aria-label=\"Main navigation\"; each item is a button with aria-current=\"page\" when selected. Height 56px + env(safe-area-inset-bottom). Icons 24px, labels 10–11px. Active state uses the primary color #1A1917, inactive #7A766D. Tapping switches the route and preserves each tab's own scroll position. Unread counts show in an absolutely positioned badge at the icon's top-right, and numbers >99 render as 99+."
          },
          "globalIndex": 18,
          "level": 2,
          "analogyBadgeZh": "生活类比: 电视遥控器底部的几个主频道大按键",
          "analogyBadgeEn": "Analogy: Primary Hardware Channels on Remote Controls",
          "analogyDescZh": "无论换到哪个频道，遥控器下方的电源、主页、设置几个大键位永远固定在那里，随手可按。",
          "analogyDescEn": "No matter what show is airing, primary buttons stay pinned at the bottom, reachable in any posture.",
          "comparisonZh": "<strong>Bottom Navigation vs Tabs:</strong> 底部导航属于应用全局最顶层的页面枢纽（3-5 个主业务入口）；Tabs 属于某个具体页面内部的内容平级分类。",
          "comparisonEn": "<strong>Bottom Navigation vs Tabs:</strong> Bottom Nav anchors top-level application destinations; Tabs divide internal content within a single view.",
          "quizQuestionZh": "场景思考：为什么移动端底部导航栏强烈建议严格控制在 3 到 5 个 Tab 之间？",
          "quizQuestionEn": "Scenario: Why limit mobile Bottom Navigation to 3-5 tabs?",
          "quizAnswerZh": "少于 3 个无法支撑核心架构且造成大片留白；多于 5 个会导致单手触控面积严重不足，图标和文字拥挤甚至误触。",
          "quizAnswerEn": "Fewer than 3 wastes space; more than 5 shrinks touch targets below 44px causing frequent mis-taps.",
          "demoType": "bottom-navigation"
        },
        {
          "id": "slider",
          "name": "Slider",
          "chineseName": "滑块",
          "category": "input",
          "oneLineZh": "一条可以左右拖动的轨道，拖动就能得到一个数值。",
          "oneLineEn": "A track you drag left or right to land on a value, with the current number always shown beside it.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "在连续区间内取值（0–100）",
              "recommended": true
            },
            {
              "situation": "用户需要「大概调到某个感觉」而非精确值",
              "recommended": true
            },
            {
              "situation": "调整结果可以实时预览",
              "recommended": true
            },
            {
              "situation": "需要输入精确数值",
              "recommended": false
            },
            {
              "situation": "区间的两端语义完全不同",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The value comes from a continuous range (0–100)",
              "recommended": true
            },
            {
              "situation": "The user is tuning to a feel rather than to an exact number",
              "recommended": true
            },
            {
              "situation": "The result can be previewed live while dragging",
              "recommended": true
            },
            {
              "situation": "An exact number has to be entered",
              "recommended": false
            },
            {
              "situation": "The two ends of the range mean completely different things",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "必须精确到 87% 时，Slider 不如「输入框 + 步进按钮」。",
            "别忘了给 Slider 一个数值显示和一个可键盘操作的方式，否则无障碍就废了。"
          ],
          "whenNotToUseEn": [
            "When you need precisely 87%, a slider loses to a text field with stepper buttons.",
            "Do not forget a numeric readout and full keyboard support, or the control is unusable for many people."
          ],
          "demoId": "slider",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个可以拖动的滑块。",
            "detailed": "加一个滤镜强度滑块：0–100，右侧实时显示数值，拖动时上方显示预览缩略图，键盘左右键每次调 5。",
            "implementation": "用 <input type=\"range\" min=0 max=100 value> 并完全自定义样式：::-webkit-slider-thumb 设为 18px 白色圆 + shadow，focus/active 时放大到 22px。轨道用 background linear-gradient 按百分比染色。右侧固定宽度 44px 显示数值（tabular-nums 防跳动）。键盘：←/↓ 减 5，→/↑ 加 5，Home/End 到两端，PageUp/Down 调 10。拖动中用 onInput 实时更新预览，松手才提交。"
          },
          "aiPromptEn": {
            "basic": "Add a slider the user can drag.",
            "detailed": "Add a filter intensity slider: 0–100, the value shown live on the right, a preview thumbnail above while dragging, and arrow keys adjusting by 5.",
            "implementation": "Use <input type=\"range\" min=0 max=100 value> and style it completely: ::-webkit-slider-thumb as an 18px white circle with a shadow, growing to 22px on focus/active. Tint the track with a background linear-gradient driven by the percentage. Show the value in a fixed 44px column on the right (tabular-nums so it does not jitter). Keyboard: ←/↓ subtract 5, →/↑ add 5, Home/End jump to the ends, PageUp/PageDown move by 10. Update the preview live via onInput during the drag and only commit on release."
          },
          "globalIndex": 19,
          "level": 2,
          "analogyBadgeZh": "生活类比: 音响面板上的音量推子或调音旋钮",
          "analogyBadgeEn": "Analogy: Fader Knob on an Audio Mixing Console",
          "analogyDescZh": "用手指在轨道上左右滑动，声音就从微弱平滑渐变到洪亮，支持在连续区间内凭直觉调整。",
          "analogyDescEn": "Slide your finger along the rail for smooth continuous modulation from silent to loud.",
          "comparisonZh": "<strong>Slider vs Stepper Input:</strong> Slider 适合对绝对精确数值不敏感、追求感官连续调节的场景（如音量、亮度、价格区间）。",
          "comparisonEn": "<strong>Slider vs Stepper Input:</strong> Sliders serve continuous sensory tuning (volume, brightness); Steppers ensure discrete numerical precision.",
          "quizQuestionZh": "场景思考：当 Slider 用于筛选特定金额（如 100元 - 5000元）时，怎样设计才能防止大拇指遮挡当前选中的数字？",
          "quizQuestionEn": "Scenario: How do you prevent thumb occlusion when sliding numerical values?",
          "quizAnswerZh": "在滑块滑钮（Thumb）上方浮现一个动态跟随的数字气泡 Tooltip，或者在轨道上方常驻显示当前的数字输入框。",
          "quizAnswerEn": "Float an elevated value tooltip directly above the thumb or show a synchronized input box above.",
          "demoType": "slider"
        },
        {
          "id": "badge",
          "name": "Badge",
          "chineseName": "角标",
          "category": "data",
          "oneLineZh": "贴在图标角落的一个小标记，用来表示「有东西需要你看」。",
          "oneLineEn": "A tiny marker pinned to the corner of an icon or avatar that says \"there is something you need to look at\".",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "表示有未读内容或新消息",
              "recommended": true
            },
            {
              "situation": "需要引起注意但不需要立即处理",
              "recommended": true
            },
            {
              "situation": "在图标右上角标记状态",
              "recommended": true
            },
            {
              "situation": "表示数量统计（购物车 3 件）",
              "recommended": true
            },
            {
              "situation": "表示一个「正常」状态",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Signalling unread content or new messages",
              "recommended": true
            },
            {
              "situation": "You need attention but not immediate action",
              "recommended": true
            },
            {
              "situation": "Marking a state on the top-right of an icon",
              "recommended": true
            },
            {
              "situation": "Showing a quantity (3 items in the cart)",
              "recommended": true
            },
            {
              "situation": "Signalling a normal or healthy state",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "红点一旦到处都有，用户就会全部无视。宁可少用。",
            "99+ 的红点如果没有数字，用户会困惑「到底多少条」。"
          ],
          "whenNotToUseEn": [
            "Once red dots are everywhere users ignore all of them — use them sparingly.",
            "A \"99+\" badge without a real number leaves users wondering how many there actually are."
          ],
          "demoId": "badge",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "图标上加个红点。",
            "detailed": "在底部导航「消息」图标右上角加 Badge：未读 5 条时显示数字，超过 99 显示「99+」，0 条时隐藏，悬停时显示 Tooltip「5 条未读消息」。",
            "implementation": "Badge 绝对定位在宿主右上角（top: -4px; right: -6px），最小宽 16px 高 16px，圆角全满，红底白字 10px。数字为 1 位时为圆形，2 位以上变成胶囊（padding 0 5px）。位置要跟随 safe-area。数量为 0 时 display: none。加 aria-label=\"5 条未读消息\" 到宿主元素上。"
          },
          "aiPromptEn": {
            "basic": "Add a red dot to the icon.",
            "detailed": "Add a Badge to the top-right of the \"Messages\" icon in the bottom navigation: show a number when there are 5 unread, show \"99+\" past 99, hide at zero, and show a \"5 unread messages\" tooltip on hover.",
            "implementation": "Absolutely position the badge at the top-right of the anchor (top: -4px; right: -6px), minimum 16px wide by 16px tall, fully rounded, red background with white 10px text. A single digit renders as a circle, two or more digits become a capsule (padding 0 5px). Position must respect the safe area. Set display: none when the count is 0. Add aria-label=\"5 unread messages\" to the anchor element."
          },
          "globalIndex": 20,
          "level": 2,
          "analogyBadgeZh": "生活类比: 制服衣领上的荣誉小勋章或信箱小红旗",
          "analogyBadgeEn": "Analogy: Lapel Pin or Raised Mailbox Flag",
          "analogyDescZh": "贴在图标或头像的右上角，用醒目的红色或小数字提醒你：「这里有一份新动态在等你打开」。",
          "analogyDescEn": "Affixed to the upper corner of icons, flashing a red dot or number signaling unread activity.",
          "comparisonZh": "<strong>Badge vs Tag:</strong> Badge 是吸附在宿主元素右上角的微型状态标识（未读数/小红点）；Tag 是独立占据版面空间的分类标签。",
          "comparisonEn": "<strong>Badge vs Tag:</strong> Badges anchor to a host corner signaling count/status; Tags occupy standalone layout space.",
          "quizQuestionZh": "场景思考：当应用内未读消息数量达到 200 条时，角标中的数字应该如何显示最合理？",
          "quizQuestionEn": "Scenario: How should unread notification badges format when counts exceed 100?",
          "quizAnswerZh": "应显示为「99+」，避免三位数撑大角标圆形导致严重变形、遮挡宿主图标或造成强烈的数字视觉焦虑。",
          "quizAnswerEn": "Cap at \"99+\" to prevent badge distortion, host icon occlusion, and severe notification anxiety.",
          "demoType": "badge"
        },
        {
          "id": "chip",
          "name": "Chip",
          "chineseName": "标签",
          "category": "input",
          "oneLineZh": "一个小圆角的胶囊，里面放几个字，可以选中也可以只是显示。",
          "oneLineEn": "A small rounded pill holding a few words — sometimes selectable, sometimes purely a label.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "多选筛选（可同时激活多个条件）",
              "recommended": true
            },
            {
              "situation": "展示内容的分类或状态",
              "recommended": true
            },
            {
              "situation": "输入框里展示已选标签，可删除",
              "recommended": true
            },
            {
              "situation": "表示一个主要操作",
              "recommended": false
            },
            {
              "situation": "代替按钮做页面跳转",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Multi-select filtering (several conditions active at once)",
              "recommended": true
            },
            {
              "situation": "Showing the category or status of content",
              "recommended": true
            },
            {
              "situation": "Showing selected tags inside an input, removable",
              "recommended": true
            },
            {
              "situation": "Marking a primary action",
              "recommended": false
            },
            {
              "situation": "Acting as a button that navigates somewhere",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "Chip 不带关闭按钮时无法取消，用户会困在筛选里——可筛选的 Chip 必须可取消。",
            "不要用 Chip 堆太多可选项，它会挤成一片让人不知道点哪。"
          ],
          "whenNotToUseEn": [
            "A chip with no close button cannot be undone — users get trapped in the filter. A filterable chip must be removable.",
            "Do not pile on too many selectable chips; they smear into a wall and nobody knows where to tap."
          ],
          "demoId": "chip",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加几个小标签。",
            "detailed": "加一组可筛选的 Chip：全部 / 人像 / 风景 / 夜景，可多选，选中态填充主色，筛选结果实时更新。",
            "implementation": "每个 Chip 是 <button role=\"checkbox\" aria-checked> 或一组 radio（若为单选）。未选：背景 #F2F0EB 文字 #4A4740；选中：背景 #1A1917 文字白色。切换时用 React state，筛选逻辑在父组件。筛选类 Chip 必须可取消（再点一次回到「全部」）。Chip 组横向排列、flex-wrap、间距 8px。"
          },
          "aiPromptEn": {
            "basic": "Add a few small tags.",
            "detailed": "Add a group of filterable chips: All / Portrait / Landscape / Night. Multiple selections are allowed, the selected state fills with the primary color, and the filtered results update live.",
            "implementation": "Each chip is a <button role=\"checkbox\" aria-checked>, or a group of radios if the selection is single-select. Unselected: #F2F0EB background with #4A4740 text. Selected: #1A1917 background with white text. Drive the toggle with React state and keep the filtering logic in the parent. Filter chips must be reversible — tapping again returns to \"All\". Lay the chip group out horizontally with flex-wrap and an 8px gap."
          },
          "globalIndex": 21,
          "level": 2,
          "analogyBadgeZh": "生活类比: 衣服吊牌或行李箱上的分类提手条",
          "analogyBadgeEn": "Analogy: Luggage Tag or Garment Fabric Label",
          "analogyDescZh": "一块小巧的椭圆胶囊，上面写着「纯棉」或「已付款」，可以点击来快速过滤或输入一段关键词。",
          "analogyDescEn": "Compact rounded pill denoting attributes like \"100% Cotton\" that can be tapped to filter or dismiss.",
          "comparisonZh": "<strong>Chip vs Button:</strong> Button 代表触发动作；Chip 代表实体属性、过滤筛选条件或紧凑的可交互小标签。",
          "comparisonEn": "<strong>Chip vs Button:</strong> Buttons initiate verbs/actions; Chips represent nouns, filters, or entity attributes.",
          "quizQuestionZh": "场景思考：在电商筛选栏中，点击一个 Chip 后通常应该呈现什么视觉反馈？",
          "quizQuestionEn": "Scenario: What visual state should an active filter Chip display upon selection?",
          "quizAnswerZh": "背景色填充加深（如转为品牌高对比色），左侧或右侧出现对勾「✓」或叉号「×」，明确表明当前已处于生效过滤态。",
          "quizAnswerEn": "Invert fill contrast (brand accent background) and append a checkmark or clear cross icon.",
          "demoType": "chip"
        },
        {
          "id": "pagination",
          "name": "Pagination",
          "chineseName": "分页",
          "category": "navigation",
          "oneLineZh": "把长长的列表切成几页，底部放一排页码让你跳到其中一页。",
          "oneLineEn": "A long list is cut into pages, with a row of page numbers at the bottom that lets you jump to one of them.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "内容有明确顺序且用户会想回看",
              "recommended": true
            },
            {
              "situation": "总数有限、可以一次给出总数",
              "recommended": true
            },
            {
              "situation": "URL 需要能定位到具体一页（SEO / 分享）",
              "recommended": true
            },
            {
              "situation": "无限下滑的社交信息流",
              "recommended": false
            },
            {
              "situation": "数据量巨大且用户不需要跳页",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Content has a clear order and users may want to return to it",
              "recommended": true
            },
            {
              "situation": "The total is finite and can be shown up front",
              "recommended": true
            },
            {
              "situation": "The URL must address a specific page (SEO / sharing)",
              "recommended": true
            },
            {
              "situation": "Infinite-scroll social feeds",
              "recommended": false
            },
            {
              "situation": "The data set is enormous and users never jump to a page",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "在手机上，每页 10 条 + 一排页码的操作成本很高，用户会不知道自己在第几页。",
            "当用户的目标是「一直往下刷」而不是「找到第 48 页」，分页就是阻碍。"
          ],
          "whenNotToUseEn": [
            "On phones, 10 items per page plus a row of page numbers is expensive to operate, and users lose track of where they are.",
            "When the user goal is \"keep scrolling\" rather than \"reach page 48\", pagination is an obstacle."
          ],
          "demoId": "pagination",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "列表下面加个分页。",
            "detailed": "在列表底部加 Pagination，显示上一页/下一页和页码，当前页高亮，两侧溢出时用省略号。",
            "implementation": "渲染 ‹ [1] 2 3 … 48 › 结构。首尾页时按钮 disabled + aria-disabled。当前页按钮加 aria-current=\"page\" 且视觉高亮。窗口宽度 <480px 时只保留 ‹ 上一页 / 下一页 ›，隐藏数字页码。每页 10 条，翻页后滚动回列表顶部并聚焦列表标题（aria-live 播报「第 2 页，共 48 页」）。页码写入 URL ?page=2。"
          },
          "aiPromptEn": {
            "basic": "Add pagination below the list.",
            "detailed": "Add pagination at the bottom of the list with previous/next buttons and page numbers, highlighting the current page and using ellipses when the range overflows.",
            "implementation": "Render the structure ‹ [1] 2 3 … 48 ›. On the first and last page the buttons are disabled + aria-disabled. The current page button gets aria-current=\"page\" and a visual highlight. Below 480px viewport width keep only ‹ Previous / Next › and hide the numbered pages. 10 items per page; after paging, scroll back to the top of the list and focus the list heading (with aria-live announcing \"Page 2 of 48\"). Write the page number into the URL as ?page=2."
          },
          "globalIndex": 22,
          "level": 2,
          "analogyBadgeZh": "生活类比: 实体书页脚的页码 1, 2, 3... 45",
          "analogyBadgeEn": "Analogy: Book Page Numbers 1, 2, 3... 45 in the Footer",
          "analogyDescZh": "把厚厚的一千页大书拆成一页一页，让你清楚知道自己在第几页，随时可以直接翻到末尾。",
          "analogyDescEn": "Partitioning a massive catalog into numbered chapters, letting you jump straight to page 45.",
          "comparisonZh": "<strong>Pagination vs Infinite Scroll:</strong> Pagination 适合管理后台、需跳页定位、需知晓总量与打印的场景；Infinite Scroll 适合社交沉浸式娱乐刷帖。",
          "comparisonEn": "<strong>Pagination vs Infinite Scroll:</strong> Pagination gives precise index control for enterprise data; Infinite Scroll prioritizes discovery.",
          "quizQuestionZh": "场景思考：当数据总页数超过 100 页时，分页器中间的页码应该如何呈现？",
          "quizQuestionEn": "Scenario: How should pagination render when total pages exceed 100?",
          "quizAnswerZh": "使用省略号折叠（Ellipsis Truncation），如 `1 ... 4 5 [6] 7 8 ... 100`，只展示当前页前后几个邻近页码和首末页。",
          "quizAnswerEn": "Use ellipsis truncation: `1 ... 4 5 [6] 7 8 ... 100`, keeping the current viewport grounded.",
          "demoType": "pagination"
        },
        {
          "id": "tooltip",
          "name": "Tooltip",
          "chineseName": "文字提示",
          "category": "containers",
          "oneLineZh": "鼠标悬停时冒出来的一行小字，告诉用户这个图标是干什么的。",
          "oneLineEn": "A small line of text that appears on hover, telling you what an unfamiliar icon actually does.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "Icon Button 的含义不明确，需要解释",
              "recommended": true
            },
            {
              "situation": "补充说明某个数字或缩写（首字母缩写）",
              "recommended": true
            },
            {
              "situation": "被截断的文字需要看全文",
              "recommended": true
            },
            {
              "situation": "需要点击里面的按钮",
              "recommended": false
            },
            {
              "situation": "这是理解页面所必需的信息",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "An icon button is not self-explanatory and needs a label",
              "recommended": true
            },
            {
              "situation": "A number or an acronym needs a gloss",
              "recommended": true
            },
            {
              "situation": "Truncated text needs a way to read the whole thing",
              "recommended": true
            },
            {
              "situation": "Users need to click a button inside it",
              "recommended": false
            },
            {
              "situation": "It holds information required to understand the page",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "Tooltip 在移动端基本无法触发，所以关键信息必须有第二处出口。",
            "延迟别太长（500ms 左右合适），否则会让页面显得迟钝。"
          ],
          "whenNotToUseEn": [
            "Tooltips are basically untriggerable on mobile, so critical information needs a second, permanent home.",
            "Keep the delay short (around 500ms), or the whole page feels sluggish."
          ],
          "demoId": "tooltip",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "鼠标悬停时给个提示。",
            "detailed": "给工具栏的 Icon Button 加 Tooltip：悬停 400ms 后显示图标名称，鼠标移开或按 Esc 立即消失，同时支持键盘 focus 时显示。",
            "implementation": "触发元素加 aria-describedby 指向气泡 id，同时加 title=\"\" 作为降级。气泡 position: absolute，出现在触发元素上方 8px 处，屏幕顶部时翻转到下方。深色背景 #1A1917、白色 12px 文字、圆角 6px、max-width 200px。显示延迟 400ms（hover enter），离开立即隐藏。支持 focus-visible 时也显示。文字不超过 2 行。"
          },
          "aiPromptEn": {
            "basic": "Show a hint on hover.",
            "detailed": "Add a tooltip to the icon buttons in a toolbar: after a 400ms hover, show the name of the icon; hide it immediately on mouse-out or Esc, and also show it on keyboard focus.",
            "implementation": "The trigger element gets aria-describedby pointing at the bubble id, plus a title=\"\" as a fallback. The bubble is position: absolute, appearing 8px above the trigger and flipping below when near the top of the screen. Dark background #1A1917, white 12px text, border-radius 6px, max-width 200px. Show delay 400ms on hover enter, hide immediately on leave. Also show on focus-visible. Keep the text under 2 lines."
          },
          "globalIndex": 23,
          "level": 2,
          "analogyBadgeZh": "生活类比: 博物馆展品旁边贴的小字说明标签",
          "analogyBadgeEn": "Analogy: Small Informational Plaque Beside Museum Exhibit",
          "analogyDescZh": "你不凑过去看时它不吵不闹，只有鼠标悬停上去时，才悄悄浮现一两句关于这个按钮的补充解释。",
          "analogyDescEn": "Quiet until you lean close; hovering gently surfaces a concise clarification explaining the obscure control.",
          "comparisonZh": "<strong>Tooltip vs Popover:</strong> Tooltip 纯文本、悬停即显、鼠标移开即消失且不可点击交互；Popover 具有丰富内容与可点击按钮交互。",
          "comparisonEn": "<strong>Tooltip vs Popover:</strong> Tooltips are non-interactive read-only text on hover; Popovers are rich clickable surfaces.",
          "quizQuestionZh": "场景思考：在纯移动端触屏手机上，为什么不建议把核心操作的关键解释完全放在 Tooltip 里？",
          "quizQuestionEn": "Scenario: Why avoid placing critical instructions inside Tooltips on mobile touchscreens?",
          "quizAnswerZh": "移动端没有鼠标 hover 状态，长按触发 Tooltip 容易与系统长按选中文本或右键菜单冲突，用户很难发现其存在。",
          "quizAnswerEn": "Mobile has no hover. Long-press gestures collide with system text selection and remain largely undiscoverable.",
          "demoType": "tooltip"
        }
      ]
    },
    {
      "level": 3,
      "nameZh": "开始理解 UX Pattern",
      "nameEn": "Understanding UX patterns",
      "subtitle": "Level 3",
      "descriptionZh": "这些不是组件，是「一套做事的习惯」。学会它们，你的界面会从「能用」变成「舒服」。",
      "descriptionEn": "These are not components, they are ways of doing things. Learn them and your interface goes from usable to comfortable.",
      "patternIds": [
        "progressive-disclosure",
        "optimistic-ui",
        "destructive-action",
        "inline-validation",
        "infinite-scroll",
        "context-menu",
        "long-press",
        "swipe-action",
        "pull-to-refresh",
        "drag-and-drop",
        "error-state",
        "alert"
      ],
      "items": [
        {
          "id": "progressive-disclosure",
          "name": "Progressive Disclosure",
          "chineseName": "渐进式呈现",
          "category": "interaction",
          "oneLineZh": "默认只给用户最需要的东西，剩下的藏在「展开更多」后面。",
          "oneLineEn": "Show only what the user needs by default, and hide the rest behind a \"Show more\" affordance.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "信息量很大但多数用户只用一小部分",
              "recommended": true
            },
            {
              "situation": "高级选项会吓跑新手",
              "recommended": true
            },
            {
              "situation": "可以按用户熟练度分层",
              "recommended": true
            },
            {
              "situation": "信息缺失会导致误用",
              "recommended": false
            },
            {
              "situation": "隐藏的内容恰好是安全相关的",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "There is a lot of information but most users only need a slice",
              "recommended": true
            },
            {
              "situation": "Advanced options would scare off beginners",
              "recommended": true
            },
            {
              "situation": "You can tier the experience by user sophistication",
              "recommended": true
            },
            {
              "situation": "Missing information would lead to misuse",
              "recommended": false
            },
            {
              "situation": "The hidden content happens to be safety-related",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "把「删除」这种关键操作藏进「更多」是灾难性的。",
            "不要用它隐藏价格、费用、风险这类必须让用户看到的信息。"
          ],
          "whenNotToUseEn": [
            "Hiding something like \"Delete\" behind a \"More\" menu is a disaster.",
            "Do not use it to conceal price, fees, or risk — users must see those."
          ],
          "demoId": "progressive-disclosure",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "先显示一部分，更多内容折叠。",
            "detailed": "订单详情默认只显示总计和「查看明细」链接，展开后显示每一项的明细行；状态记住用户上次的展开选择。",
            "implementation": "默认 collapsed。触发器是文字按钮（不是箭头图标，因为「更多」比「展开」更易理解），加 aria-expanded。展开后内容用 grid-template-rows 0fr→1fr 过渡。状态持久化到 localStorage：下次进入若上次是展开的就默认展开（记忆用户偏好）。但要注意：涉及安全和价格的信息不适用这个模式。"
          },
          "aiPromptEn": {
            "basic": "Show part of it first, collapse the rest.",
            "detailed": "An order detail view shows only the total and a \"View details\" link by default; expanding it reveals one row per line item. Remember the user's expansion choice from last time.",
            "implementation": "Collapsed by default. The trigger is a text button (not an arrow icon, because \"More\" is easier to grasp than \"Expand\") with aria-expanded. Animate the expanded content with a grid-template-rows 0fr to 1fr transition. Persist the state to localStorage so a user who last had it expanded sees it expanded next time (remembering user preference). Bear in mind that this pattern does not apply to safety or pricing information."
          },
          "globalIndex": 24,
          "level": 3,
          "analogyBadgeZh": "生活类比: 折叠式多功能瑞士军刀",
          "analogyBadgeEn": "Analogy: Multi-tool Swiss Army Knife",
          "analogyDescZh": "平时合拢只露出主刀，只有当你需要剪刀或红酒起子时，才手动把特定工具抠出来。",
          "analogyDescEn": "Keeps auxiliary blades folded away inside the handle until a specific task demands opening them.",
          "comparisonZh": "<strong>Progressive Disclosure vs Modal:</strong> 渐进式呈现是在同一页面内按需展开下潜内容；Modal 则是完全跳出当前视口的阻断式上下文。",
          "comparisonEn": "<strong>Progressive Disclosure vs Modal:</strong> Progressive Disclosure unrolls within flow; Modals disrupt flow into a separate layer.",
          "quizQuestionZh": "场景思考：一个高级搜索表单有 30 个筛选条件，如何运用渐进式呈现提升新用户的填表信心？",
          "quizQuestionEn": "Scenario: How does Progressive Disclosure simplify a 30-filter enterprise search form?",
          "quizAnswerZh": "首屏只展示最核心的 3 个常用输入项（如关键词、时间），其余 27 个放入「展开高级筛选 ▾」可折叠区域中，降低初次认知负荷。",
          "quizAnswerEn": "Show only the 3 most frequent inputs first, tucking the remaining 27 into an expandable \"Advanced Filters\" drawer.",
          "demoType": "progressive-disclosure"
        },
        {
          "id": "optimistic-ui",
          "name": "Optimistic UI",
          "chineseName": "乐观更新",
          "category": "interaction",
          "oneLineZh": "不等服务器回应，先把界面改成「已经成功了」，失败了再回滚。",
          "oneLineEn": "Update the interface to \"already succeeded\" before the server answers, and roll back if it fails.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "操作成功率高（>95%）",
              "recommended": true
            },
            {
              "situation": "失败可以回滚且回滚成本低",
              "recommended": true
            },
            {
              "situation": "用户会因为等待而感到卡顿",
              "recommended": true
            },
            {
              "situation": "操作不可逆（转账、支付）",
              "recommended": false
            },
            {
              "situation": "失败率较高",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The action has a high success rate (>95%)",
              "recommended": true
            },
            {
              "situation": "Failure can be rolled back cheaply",
              "recommended": true
            },
            {
              "situation": "Waiting would make the interface feel sluggish",
              "recommended": true
            },
            {
              "situation": "The action is irreversible (transfers, payments)",
              "recommended": false
            },
            {
              "situation": "The failure rate is high",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "转账、支付这类不可逆操作必须等服务器确认。",
            "失败回滚要有提示：静默回滚会让用户以为「我的操作丢了」。"
          ],
          "whenNotToUseEn": [
            "Irreversible actions like transfers and payments must wait for server confirmation.",
            "A rollback has to be surfaced: rolling back silently makes users think their action was lost."
          ],
          "demoId": "optimistic-ui",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "先假装成功，失败再回滚。",
            "detailed": "点点赞后立即点亮图标，若接口失败则回滚成未点赞并用 Toast 提示「操作失败，请重试」。",
            "implementation": "onClick 时先 mutate 本地 state 立即更新 UI，同时记录 prevState 用于回滚，然后发请求。请求期间该元素加半透明或小 spinner 标记 pending 状态（防止重复点击）。catch 分支：还原 prevState + 弹 Toast「操作失败，请重试」+「重试」按钮。关键：回滚必须对用户可见，不能静默恢复。建议配合 Snackbar 撤销。"
          },
          "aiPromptEn": {
            "basic": "Pretend it succeeded, roll back on failure.",
            "detailed": "When the user taps Like, light up the icon immediately; if the API call fails, roll it back to unliked and show a toast saying \"Action failed. Please retry.\"",
            "implementation": "On click, first mutate local state so the UI updates immediately, and record prevState for rollback, then fire the request. While the request is in flight, mark that element as pending with semi-transparency or a small spinner (this prevents double submits). In the catch branch: restore prevState, show a toast reading \"Action failed. Please retry.\" with a \"Retry\" button. The key point: the rollback must be visible to the user and must never restore silently. Pair it with a Snackbar undo."
          },
          "globalIndex": 25,
          "level": 3,
          "analogyBadgeZh": "生活类比: 点赞时红心瞬间点亮，后台在悄悄发请求",
          "analogyBadgeEn": "Analogy: Instant Heart Highlight Before Network Ack",
          "analogyDescZh": "系统假设网络百分之百会成功，在你点击的瞬间立刻把界面变成成功状态；哪怕网络卡顿，你也感觉丝般顺滑。",
          "analogyDescEn": "Assumes server success instantaneously, rendering the liked state with zero perceptible lag while syncing in the background.",
          "comparisonZh": "<strong>Optimistic UI vs Loading Spinner:</strong> 乐观更新让用户感受不到任何网络延迟；Spinner 则是传统等待服务器响应后再刷新的保守模式。",
          "comparisonEn": "<strong>Optimistic UI vs Loading Spinner:</strong> Optimistic UI masks latency with instant visual reward; Spinners highlight network latency.",
          "quizQuestionZh": "场景思考：当乐观更新在后台最终请求失败（如网络断开）时，应该如何优雅处理界面回退？",
          "quizQuestionEn": "Scenario: How should UI degrade when an optimistic mutation eventually fails?",
          "quizAnswerZh": "界面必须平滑恢复为原状态（如心形变灰），并通过非阻断的 Toast 提示告知「点赞失败，请重试」，支持用户一键重发。",
          "quizAnswerEn": "Silently roll back the UI (heart returns to gray), surface an error toast, and provide a one-tap retry button.",
          "demoType": "optimistic-ui"
        },
        {
          "id": "destructive-action",
          "name": "Destructive Action",
          "chineseName": "破坏性操作",
          "category": "actions",
          "oneLineZh": "一旦执行就难以撤销的操作——删除、清除、注销。它的按钮必须是红色的。",
          "oneLineEn": "An action that is hard to undo once taken — delete, clear, deactivate. Its button has to be red.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "操作不可撤销或撤销成本高",
              "recommended": true
            },
            {
              "situation": "误触代价大（删数据、注销、退款）",
              "recommended": true
            },
            {
              "situation": "危险按钮在页面中低频出现",
              "recommended": true
            },
            {
              "situation": "操作频繁且容易恢复（拖动排序、清空输入框）",
              "recommended": false
            },
            {
              "situation": "批量删除 100 张照片",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The action is irreversible or expensive to reverse",
              "recommended": true
            },
            {
              "situation": "A mis-tap is costly (deleting data, deactivating an account, issuing a refund)",
              "recommended": true
            },
            {
              "situation": "The dangerous button appears only rarely on the page",
              "recommended": true
            },
            {
              "situation": "The action is frequent and easy to recover from (drag to reorder, clear a text field)",
              "recommended": false
            },
            {
              "situation": "Deleting 100 photos in bulk",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "每个危险操作都弹确认框会训练出「闭眼点确定」的习惯，反而降低安全性。",
            "真正的解法往往是提供 Undo，而不是拦住用户。"
          ],
          "whenNotToUseEn": [
            "A confirmation dialog on every dangerous action trains people to click OK with their eyes closed, which lowers safety rather than raising it.",
            "The real fix is usually to offer Undo, not to block the user."
          ],
          "demoId": "destructive-action",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "加个删除按钮。",
            "detailed": "加一个破坏性删除操作：常态是红色文字按钮，点击后弹 Dialog 二次确认，说明会删掉多少项；删除完成后用 Snackbar 提供「撤销」。",
            "implementation": "常态：红色文字按钮 #A8342C，无边框，hover 加浅红背景 #FAEDEC。点击后打开 Dialog：标题「删除 12 张照片？」，正文「这些照片会移到最近删除，30 天后自动清除。」，按钮为「取消」(Secondary) + 「删除」(danger 红色实心)。执行后立即关闭 Dialog 并弹出 Snackbar「已删除 12 张照片」+「撤销」按钮，5 秒后自动消失，撤销则恢复数据。批量删除时不弹逐项确认，只在操作前提示一次。"
          },
          "aiPromptEn": {
            "basic": "Add a delete button.",
            "detailed": "Add a destructive delete action: a red text button at rest that opens a confirmation dialog stating how many items will be removed, plus a Snackbar with Undo after the deletion completes.",
            "implementation": "At rest: a red text button #A8342C with no border, gaining a light red background #FAEDEC on hover. On click, open a Dialog: title \"Delete 12 photos?\", body \"These photos will move to Recently Deleted and be purged automatically after 30 days.\", with buttons \"Cancel\" (Secondary) + \"Delete\" (danger, solid red). After execution, close the Dialog immediately and show a Snackbar \"12 photos deleted\" with an \"Undo\" button that auto-dismisses after 5 seconds; Undo restores the data. For bulk deletion, do not confirm each item — show a single prompt before the operation."
          },
          "globalIndex": 26,
          "level": 3,
          "analogyBadgeZh": "生活类比: 红色导弹发射按键外面的安全防护罩",
          "analogyBadgeEn": "Analogy: Spring-loaded Guard Cover over Eject Button",
          "analogyDescZh": "为了防止手滑误触，按钮必须涂上警示红色，甚至需要你先掀开盖子或者输入「DELETE」文字才能按下。",
          "analogyDescEn": "Friction guards that prevent catastrophic mistakes by requiring two conscious physical motions to activate.",
          "comparisonZh": "<strong>Destructive Action vs Regular Action:</strong> 普通操作讲究一键极速响应；破坏性操作必须人为增加适当的摩擦力（Friction）以保护用户资产。",
          "comparisonEn": "<strong>Destructive Action vs Regular Action:</strong> Regular actions optimize for speed; destructive actions introduce deliberate safety friction.",
          "quizQuestionZh": "场景思考：在注销账号或删除核心数据库时，为什么仅仅弹出一个「确认/取消」对话框依然不够安全？",
          "quizQuestionEn": "Scenario: Why is a simple OK/Cancel prompt insufficient for deleting production databases?",
          "quizAnswerZh": "人类具有肌肉记忆，习惯顺手连点右侧主按钮。要求用户手动输入项目名称全称或「确认删除」四个汉字，能强制大脑切换至理性思考状态。",
          "quizAnswerEn": "Muscle memory clicks primary buttons automatically. Requiring manual typing of the project name halts automated reflexes.",
          "demoType": "destructive-action"
        },
        {
          "id": "inline-validation",
          "name": "Inline Validation",
          "chineseName": "即时校验",
          "category": "interaction",
          "oneLineZh": "在用户输入的过程中就告诉他「这样填对不对」，而不是等他提交。",
          "oneLineEn": "Tell the user while they type whether the value is right, instead of waiting until they submit.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "输入有明确的格式约束",
              "recommended": true
            },
            {
              "situation": "错误可以自动检测并给出修正提示",
              "recommended": true
            },
            {
              "situation": "长表单（填写成本高）",
              "recommended": true
            },
            {
              "situation": "错误只有提交后才知道",
              "recommended": "mostly"
            },
            {
              "situation": "每敲一键就报错的规则",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The input has a hard format constraint",
              "recommended": true
            },
            {
              "situation": "Errors can be detected automatically with an actionable fix",
              "recommended": true
            },
            {
              "situation": "The form is long and filling it in is costly",
              "recommended": true
            },
            {
              "situation": "Errors can only be known after submitting",
              "recommended": "mostly"
            },
            {
              "situation": "The rules would fire an error on every keystroke",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "不要在用户刚开始输入时就报红——先让他打完再判断。",
            "错误提示要告诉用户「怎么改」，不是「哪里错了」。"
          ],
          "whenNotToUseEn": [
            "Do not flash red the moment the user starts typing — let them finish first, then judge.",
            "The message should tell the user how to fix it, not merely where the problem is."
          ],
          "demoId": "inline-validation",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "输入时实时检查。",
            "detailed": "邮箱输入框在失焦时校验格式：合法时显示绿色对勾 +「格式正确」，非法时红边 +「需要包含 @ 的完整邮箱地址」。",
            "implementation": "校验时机：focus 时不校验，blur 时校验一次，之后用户再次输入时不校验直到下次 blur。不要在 onChange 里每键报错。错误态：边框 #A8342C + 下方 13px 红字 + aria-invalid=\"true\" + aria-describedby 指向错误文本。错误文案要可操作：「需要包含 @」优于「格式错误」。正确时给绿色 ✓ 增强信心。提交时若无错误才 focus 第一个错误项。"
          },
          "aiPromptEn": {
            "basic": "Check the format as they type.",
            "detailed": "Validate an email field on blur: when it is valid show a green check plus \"Format looks good\", when it is not show a red border plus \"Enter a complete email address containing @\".",
            "implementation": "Timing: do not validate on focus, validate once on blur, and after that do not validate again while the user keeps typing until the next blur. Never report an error in onChange on every keystroke. Error state: border #A8342C plus 13px red text below the field, plus aria-invalid=\"true\" and aria-describedby pointing at the error text. Write actionable copy: \"Must contain @\" beats \"Invalid format\". Show a green check when the value is valid to build confidence. On submit, if there are errors, focus the first erroring field."
          },
          "globalIndex": 27,
          "level": 3,
          "analogyBadgeZh": "生活类比: 驾校教练在副驾驶，方向盘打错瞬间就出声纠正",
          "analogyBadgeEn": "Analogy: Driving Instructor Correcting Steering in Real-time",
          "analogyDescZh": "不需要等到考完全程交卷才告诉你挂科；在你刚输完密码移开焦点的瞬间，绿色的勾或红色的字就明确告诉你合不合格。",
          "analogyDescEn": "Feedback happens right at the point of action, rather than waiting for exam submission to announce failure.",
          "comparisonZh": "<strong>Inline Validation vs Submit Validation:</strong> 即时校验在输入框失去焦点时单点报错，改错成本极低；提交校验等到点击提交才弹出长串错误，让人崩溃。",
          "comparisonEn": "<strong>Inline Validation vs Submit Validation:</strong> Inline validation catches mistakes field-by-field; Submit validation dumps an overwhelming error pile.",
          "quizQuestionZh": "场景思考：为什么严禁在用户刚刚聚焦输入框、刚敲入第 1 个字符时就立刻弹出「邮箱格式不合法」的红色报错？",
          "quizQuestionEn": "Scenario: Why is validating prematurely on the first typed character disastrous?",
          "quizAnswerZh": "用户还没输完就提前报错会造成极大的心理挫败感（Preemptive Error）。应该在输入框失去焦点（onBlur）或用户停顿 800ms 后再校验。",
          "quizAnswerEn": "Preemptive errors induce anxiety while users are mid-stream. Validate only on blur or after an 800ms typing pause.",
          "demoType": "inline-validation"
        },
        {
          "id": "infinite-scroll",
          "name": "Infinite Scroll",
          "chineseName": "无限滚动",
          "category": "navigation",
          "oneLineZh": "一直往下滑就自动加载下一页，没有「下一页」按钮。",
          "oneLineEn": "Keep scrolling down and the next page loads automatically, with no \"next page\" button anywhere.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "内容是「探索型」的，没有明确终点",
              "recommended": true
            },
            {
              "situation": "用户目的是随便刷（社交、灵感、资讯）",
              "recommended": true
            },
            {
              "situation": "浏览路径不需要定位和分享",
              "recommended": true
            },
            {
              "situation": "用户需要找到「第 N 页」",
              "recommended": false
            },
            {
              "situation": "内容有明确结构（订单、账单、日志）",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Content is exploratory with no clear end",
              "recommended": true
            },
            {
              "situation": "The goal is casual browsing (social, inspiration, news)",
              "recommended": true
            },
            {
              "situation": "The browse path does not need deep linking or sharing",
              "recommended": true
            },
            {
              "situation": "Users need to reach \"page N\"",
              "recommended": false
            },
            {
              "situation": "Content has a fixed structure (orders, invoices, logs)",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "无限滚动让浏览器的返回键失效——用户看完想回到列表却只能重新刷一遍。",
            "SEO 不友好：搜索引擎抓不到第 2 页之后的内容。",
            "一定要在到达底部时提供「已经到底了 + 回到顶部」按钮，否则用户不知道还能不能继续。"
          ],
          "whenNotToUseEn": [
            "Infinite scroll breaks the browser back button — users finish reading and cannot return to the list without re-scrolling through everything.",
            "It is bad for SEO: search engines cannot crawl past the first page of results.",
            "Always show an end-of-feed marker plus a \"back to top\" control at the bottom, otherwise users cannot tell whether there is more."
          ],
          "demoId": "infinite-scroll",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "滑到底自动加载。",
            "detailed": "列表滚动到底部时自动加载下一页：显示加载动画，加载完追加到列表末尾，加载完全部后显示「已经到底了」和「回到顶部」按钮。",
            "implementation": "用 IntersectionObserver 观察列表末尾的 sentinel div（rootMargin: \"200px\" 提前触发），比监听 scroll 事件性能好得多。加载中加 loading 标志防重复请求。请求失败时在底部显示「加载失败 · 重试」而不是静默失败。每页 20 条，追加时保持滚动位置稳定。滑过 3 屏后右下角出现「回到顶部」FAB。"
          },
          "aiPromptEn": {
            "basic": "Load more automatically at the bottom.",
            "detailed": "Load the next page automatically when the list scrolls to the bottom: show a loading animation, append the loaded items to the end of the list, and once everything is loaded show \"You have reached the end\" along with a \"back to top\" button.",
            "implementation": "Use IntersectionObserver to watch a sentinel div at the end of the list (rootMargin: \"200px\" to trigger early), which performs far better than listening to scroll events. Set a loading flag while a request is in flight to prevent duplicate requests. On failure, show \"Loading failed · Retry\" at the bottom instead of failing silently. 20 items per page, and keep the scroll position stable when appending. After three screens of scrolling, show a \"back to top\" FAB in the bottom-right corner."
          },
          "globalIndex": 28,
          "level": 3,
          "analogyBadgeZh": "生活类比: 永远吃不完的自动旋转回转寿司传送带",
          "analogyBadgeEn": "Analogy: Endless Revolving Conveyor Belt at Sushi Bars",
          "analogyDescZh": "你快要看到盘子底部时，传输带悄悄在前方续上一盘又一盘，让你不知不觉一直滑动下去。",
          "analogyDescEn": "New dishes glide in seamlessly right before you reach the edge, creating frictionless consumption.",
          "comparisonZh": "<strong>Infinite Scroll vs Pagination:</strong> 无限滚动适合探索型、休闲娱乐型的内容流；分页适合目标明确、需要定位和回溯的工作流。",
          "comparisonEn": "<strong>Infinite Scroll vs Pagination:</strong> Infinite scroll drives discovery and retention; pagination facilitates precise audit and retrieval.",
          "quizQuestionZh": "场景思考：无限滚动页面最大的致命体验缺陷是什么？如何克服？",
          "quizQuestionEn": "Scenario: What is the most notorious design flaw of infinite scroll, and how do you resolve it?",
          "quizAnswerZh": "用户永远触碰不到网页最底部的页脚（Footer）！解决方案是将关键政策、版权等信息移至右侧常驻边栏，或提供「回到顶部」悬浮按钮。",
          "quizAnswerEn": "Users can never reach the footer. Move footer links to a permanent sidebar or sticky secondary navigation.",
          "demoType": "infinite-scroll"
        },
        {
          "id": "context-menu",
          "name": "Context Menu",
          "chineseName": "上下文菜单",
          "category": "interaction",
          "oneLineZh": "在某个东西上点右键（手机上长按），弹出的那排操作选项。",
          "oneLineEn": "The row of actions that pops up when you right-click something (or long-press it on a phone).",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "操作只针对特定对象",
              "recommended": true
            },
            {
              "situation": "操作低频，放在主界面不划算",
              "recommended": true
            },
            {
              "situation": "需要腾出主界面空间",
              "recommended": true
            },
            {
              "situation": "这些操作是高频的",
              "recommended": false
            },
            {
              "situation": "这是移动端唯一入口",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The actions apply only to a specific object",
              "recommended": true
            },
            {
              "situation": "The actions are low-frequency and not worth main-surface space",
              "recommended": true
            },
            {
              "situation": "You need to keep the main interface clear",
              "recommended": true
            },
            {
              "situation": "These actions are high-frequency",
              "recommended": false
            },
            {
              "situation": "It is the only entry point on mobile",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "移动端没有右键，长按唤出的菜单在系统层可能和浏览器默认菜单冲突。",
            "菜单项超过 8 个就该考虑分组或换成别的形态。"
          ],
          "whenNotToUseEn": [
            "Mobile has no right click, and a long-press menu can collide with the system or browser default menu at the system layer.",
            "Past about eight items you should group them or choose a different form."
          ],
          "demoId": "context-menu",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "右键弹出菜单。",
            "detailed": "在文件上点右键弹出菜单：复制 / 移动到… / 重命名 /（分隔线）/ 删除（红色，置底）。支持键盘上下移动。",
            "implementation": "监听 contextmenu 事件并 preventDefault。用 Popover 定位到鼠标 clientX/clientY，注意视口边缘翻转。role=\"menu\" + role=\"menuitem\"。支持 ↑↓ 移动、Enter 执行、Esc 关闭。危险操作（删除）用分隔线隔开并放最后，文字用红色。每项右侧可显示快捷键（⌘C）。移动端用长按替代，但需 preventDefault 阻止系统默认菜单。"
          },
          "aiPromptEn": {
            "basic": "Right click pops up a menu.",
            "detailed": "Right-click a file to open a menu: Copy / Move to… / Rename / (separator) / Delete (red, at the bottom). Support keyboard navigation up and down.",
            "implementation": "Listen for the contextmenu event and preventDefault. Position a Popover at the pointer's clientX/clientY, flipping at viewport edges. Use role=\"menu\" with role=\"menuitem\". Support Up/Down to move, Enter to run, Esc to close. Separate dangerous actions (Delete) with a divider, place them last, and set their label in red. Show the keyboard shortcut on the right of each item (e.g. Command-C). On mobile, substitute a long press but preventDefault to suppress the system default menu."
          },
          "globalIndex": 29,
          "level": 3,
          "analogyBadgeZh": "生活类比: 餐厅服务员随时递过来的本道菜专属调料托盘",
          "analogyBadgeEn": "Analogy: Dedicated Condiment Tray Brought for a Specific Dish",
          "analogyDescZh": "你在哪道菜上举手，端上来的就是适合这道菜的芥末或生抽，而不是通用的整本总菜单。",
          "analogyDescEn": "Brought directly to where your fork is pointed, tailored exclusively to the dish immediately underneath.",
          "comparisonZh": "<strong>Context Menu vs Dropdown Menu:</strong> 下拉菜单由固定的顶部按钮触发；上下文菜单由右键或长按在当前目标指针所在位置即时唤起。",
          "comparisonEn": "<strong>Context Menu vs Dropdown Menu:</strong> Dropdowns drop from explicit anchor buttons; Context menus spawn wherever the pointer is positioned.",
          "quizQuestionZh": "场景思考：桌面端 Web 应用如果自定义了鼠标右键 Context Menu，必须注意保留什么基本无障碍逻辑？",
          "quizQuestionEn": "Scenario: What critical accessibility rule applies when overriding desktop right-click menus?",
          "quizAnswerZh": "必须支持按 Esc 键关闭，支持键盘上下箭头巡视选项，并且在按住 Shift+右键时允许用户呼出原生系统右键菜单。",
          "quizAnswerEn": "Support ESC to dismiss, keyboard arrow navigation, and preserve native system right-clicks via Shift+RightClick.",
          "demoType": "context-menu"
        },
        {
          "id": "long-press",
          "name": "Long Press",
          "chineseName": "长按",
          "category": "interaction",
          "oneLineZh": "手指按住不放半秒，弹出一排选项或者进入多选模式。",
          "oneLineEn": "Hold a finger down for about half a second and a row of options appears, or multi-select mode starts.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "需要有低频操作但不想占用界面空间",
              "recommended": true
            },
            {
              "situation": "需要进入多选模式",
              "recommended": true
            },
            {
              "situation": "需要拖拽但想限制误触",
              "recommended": true
            },
            {
              "situation": "这是主要操作",
              "recommended": false
            },
            {
              "situation": "用户不知道可以长按",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "You need low-frequency actions without spending screen space",
              "recommended": true
            },
            {
              "situation": "You need to enter multi-select mode",
              "recommended": true
            },
            {
              "situation": "You need dragging but want to guard against accidental triggers",
              "recommended": true
            },
            {
              "situation": "It is the primary action",
              "recommended": false
            },
            {
              "situation": "Users have no idea they can long press",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "长按的时长（通常 500ms）必须给反馈：震动 + 视觉变化，否则用户以为没点到。",
            "不要用长按承载唯一的关键操作。"
          ],
          "whenNotToUseEn": [
            "The duration (usually 500ms) must be signalled: haptics plus a visual change, otherwise users think the tap did not register.",
            "Never let a long press carry the only path to a critical action."
          ],
          "demoId": "long-press",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "长按弹出菜单。",
            "detailed": "给列表项加长按：按住 500ms 后震动并弹出操作菜单（编辑/分享/删除），手指移动超过 10px 或提前松手则取消。",
            "implementation": "pointerdown 启动 setTimeout(500)，pointermove 超过 10px 距离则 clearTimeout（避免和滚动冲突），pointerup / pointercancel 清除定时器。触发时调 navigator.vibrate(10)（需用户交互后才能用）并立即给该项加高亮背景作为视觉确认。菜单定位在长按点附近。移动超过 10px 的阈值很关键，否则用户想滚动列表却触发了菜单。"
          },
          "aiPromptEn": {
            "basic": "Long press pops up a menu.",
            "detailed": "Add a long press to list items: after holding for 500ms, fire haptics and open an action menu (Edit / Share / Delete); moving more than 10px or releasing early cancels it.",
            "implementation": "On pointerdown start setTimeout(500); on pointermove, clear the timeout once movement exceeds 10px (this avoids conflicting with scrolling); on pointerup / pointercancel clear the timer. On trigger, call navigator.vibrate(10) (it only works after a user interaction) and immediately add a highlight background to the item as visual confirmation. Position the menu near the point that was pressed. The 10px movement threshold is critical — without it users try to scroll the list and trigger the menu instead."
          },
          "globalIndex": 30,
          "level": 3,
          "analogyBadgeZh": "生活类比: 盖大印时在纸上用力按住两秒以留下清晰深红印记",
          "analogyBadgeEn": "Analogy: Holding a Wax Seal Down for 2 Seconds to Imprint",
          "analogyDescZh": "轻轻一碰只是普通查看，用力按住不放 500 毫秒以上，才触发多选模式或隐藏的高级快捷方式。",
          "analogyDescEn": "A quick tap inspects; holding firmly for 500ms burns through the surface into batch selection or power actions.",
          "comparisonZh": "<strong>Long Press vs Click:</strong> 单击是第一层直接触发；长按是进阶次级快捷入口，通常伴随微弱的触觉震动反馈（Haptic Feedback）。",
          "comparisonEn": "<strong>Long Press vs Click:</strong> Clicks trigger baseline verbs; Long-presses reveal secondary power tools reinforced by haptics.",
          "quizQuestionZh": "场景思考：为什么关键的核心业务功能（如支付、下单）严禁仅仅依赖长按来触发？",
          "quizQuestionEn": "Scenario: Why must critical operations never rely solely on long-press discovery?",
          "quizAnswerZh": "长按具有极高的隐蔽性（Discoverability 极差），大部分新用户根本不知道这里可以长按，且肢体障碍用户长按保持稳定性较差。",
          "quizAnswerEn": "Long-press is invisible (near zero affordance). Users cannot guess its existence and fine motor control varies widely.",
          "demoType": "long-press"
        },
        {
          "id": "swipe-action",
          "name": "Swipe Action",
          "chineseName": "滑动操作",
          "category": "interaction",
          "oneLineZh": "手指按住列表项往左一滑，底下露出「删除」「归档」这些按钮。",
          "oneLineEn": "Press a list item and slide it left, and actions like delete or archive slide out from underneath.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "高频列表中的次要操作",
              "recommended": true
            },
            {
              "situation": "删除/归档这类可逆操作",
              "recommended": true
            },
            {
              "situation": "需要保持界面极简",
              "recommended": true
            },
            {
              "situation": "这是最常用的主操作",
              "recommended": false
            },
            {
              "situation": "桌面端鼠标环境",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Secondary actions inside a high-frequency list",
              "recommended": true
            },
            {
              "situation": "Reversible actions such as delete or archive",
              "recommended": true
            },
            {
              "situation": "The interface needs to stay extremely minimal",
              "recommended": true
            },
            {
              "situation": "It is the most common primary action",
              "recommended": false
            },
            {
              "situation": "A desktop environment driven by a mouse",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "发现性是硬伤：一定要给长按/右键的替代入口。",
            "一次只能滑出一个菜单，同时出现两个菜单会让用户困惑。"
          ],
          "whenNotToUseEn": [
            "Discoverability is the hard flaw: you must ship a long-press or right-click entry point as an equivalent path.",
            "Only one menu can be open at a time; two visible menus at once leaves users confused."
          ],
          "demoId": "swipe-action",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "列表项可以左滑。",
            "detailed": "给列表项加左滑操作：滑过 50% 露出「置顶（蓝）/ 删除（红）」两个按钮，松手吸附展开，点空白收起。",
            "implementation": "用 pointer 事件 + touchstart/touchmove/touchend 记录 dx。dx < -50px 时设置 state revealedId，row transform: translateX(-140px)，两个按钮 absolute 定位在右侧各 70px 宽。用 CSS transition 处理吸附动画。同一时刻只有一个 row 处于 revealed 状态。滑动中阻止垂直滚动（判断手势主方向）。必须补一个长按（500ms）唤出同样菜单的入口，否则桌面/无障碍用户无法使用。"
          },
          "aiPromptEn": {
            "basic": "List items can be swiped left.",
            "detailed": "Add swipe actions to list items: past 50% of the width, reveal two buttons, \"Pin\" (blue) and \"Delete\" (red); on release, snap open; tapping outside closes it.",
            "implementation": "Use pointer events plus touchstart/touchmove/touchend to track dx. When dx < -50px set state revealedId, apply transform: translateX(-140px) to the row, and absolutely position the two buttons on the right at 70px wide each. Use a CSS transition for the snap animation. Only one row may be in the revealed state at a time. Block vertical scrolling mid-swipe (determine the dominant gesture direction). You must also ship a long-press (500ms) entry point that opens the same menu, otherwise desktop and assistive-technology users cannot use this at all."
          },
          "globalIndex": 31,
          "level": 3,
          "analogyBadgeZh": "生活类比: 把桌上的废纸往垃圾桶方向轻轻一扫",
          "analogyBadgeEn": "Analogy: Sweeping Loose Crumbs off the Table with a Quick Gesture",
          "analogyDescZh": "手指在列表行上向左一拨，红色的「删除」和黄色的「标为已读」就像拉开的抽屉一样露了出来。",
          "analogyDescEn": "Flicking sideways exposes action drawers (red delete, blue pin) tucked immediately beneath the row.",
          "comparisonZh": "<strong>Swipe Action vs Long Press:</strong> 滑动操作具有高度的物理直觉与空间连续性，手指离开屏幕即可完成动作；长按则是时间维度的等待。",
          "comparisonEn": "<strong>Swipe Action vs Long Press:</strong> Swiping offers continuous spatial physical feedback; long-pressing is a static temporal pause.",
          "quizQuestionZh": "场景思考：向左滑动删除列表项时，如何防止用户误触滑动过大直接删除了条目？",
          "quizQuestionEn": "Scenario: How do you prevent accidental full-swipe deletion on mobile list items?",
          "quizAnswerZh": "提供阈值吸附阻尼感，且在滑动彻底触发后弹出带 Undo 撤销按钮的 Snackbar，给予用户 5 秒钟的后悔宽限期。",
          "quizAnswerEn": "Provide elastic resistance past the action threshold and pair full-swipe deletion with an immediate Undo Snackbar.",
          "demoType": "swipe-action"
        },
        {
          "id": "pull-to-refresh",
          "name": "Pull to Refresh",
          "chineseName": "下拉刷新",
          "category": "interaction",
          "oneLineZh": "在列表顶部往下拉，松手后重新加载数据。",
          "oneLineEn": "Pull down at the top of a list and release to reload the data.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "移动端列表内容会随时间变化",
              "recommended": true
            },
            {
              "situation": "内容以「最新」为优先（动态、消息、新闻）",
              "recommended": true
            },
            {
              "situation": "用户主动想更新",
              "recommended": true
            },
            {
              "situation": "桌面端",
              "recommended": false
            },
            {
              "situation": "内容很少、一屏装得下",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "A mobile list whose content changes over time",
              "recommended": true
            },
            {
              "situation": "Content is ordered with \"newest first\" (feed, messages, news)",
              "recommended": true
            },
            {
              "situation": "Users actively want to update",
              "recommended": true
            },
            {
              "situation": "Desktop",
              "recommended": false
            },
            {
              "situation": "There is little content and it all fits on one screen",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "下拉的阈值（约 60–80px）和阻尼系数决定手感，抄别人的参数不会对。",
            "刷新时必须锁住列表不允许继续下拉，否则会出现多次刷新。"
          ],
          "whenNotToUseEn": [
            "The feel of the gesture lives in the threshold (roughly 60–80px) and the damping factor — copying someone else's numbers will not feel right.",
            "You must lock the list while refreshing so it cannot be pulled again, otherwise multiple refreshes fire."
          ],
          "demoId": "pull-to-refresh",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "支持下拉刷新。",
            "detailed": "给列表加下拉刷新：顶部下拉超过 72px 触发，指示器随拉动进度旋转，刷新中锁定列表，完成后回弹并更新内容。",
            "implementation": "touchstart 记录起始 Y，touchmove 时计算 deltaY = startY - currentY，位移用 deltaY * 0.5 做阻尼（让手感更沉）。超过 72px 时把指示器从箭头切换为旋转。touchend 时若超过阈值则触发刷新并锁定（refreshLock = true），完成后回弹动画并解锁。移动端用 overscroll-behavior: contain 避免触发页面刷新。桌面端另配一个显式刷新按钮。"
          },
          "aiPromptEn": {
            "basic": "Support pull to refresh.",
            "detailed": "Add pull to refresh to a list: pulling past 72px at the top triggers it, the indicator rotates with the pull progress, the list locks while refreshing, and it springs back and updates the content when done.",
            "implementation": "Record the start Y on touchstart, compute deltaY = startY - currentY on touchmove, and damp the displacement with deltaY * 0.5 so the gesture feels heavier. Past 72px, swap the indicator from an arrow to a spinner. On touchend, if the threshold was passed, trigger the refresh and lock it (refreshLock = true), then spring back and unlock when finished. On mobile use overscroll-behavior: contain to avoid triggering the browser's own page refresh. On desktop, provide a separate explicit refresh button."
          },
          "globalIndex": 32,
          "level": 3,
          "analogyBadgeZh": "生活类比: 老式卫生间顶部的拉绳水箱或摇水井把手",
          "analogyBadgeEn": "Analogy: Pulling the Chain on an Overhead Cistern or Water Pump",
          "analogyDescZh": "双手在屏幕顶端用力往下一拽，弹性阻尼到达临界点松手，页面骨架屏或刷新小齿轮随即欢快旋转。",
          "analogyDescEn": "Tugging downwards against an elastic spring; releasing at threshold triggers an automatic refill cycle.",
          "comparisonZh": "<strong>Pull to Refresh vs Refresh Button:</strong> 下拉刷新是触屏设备的自然手势惯性；刷新按钮则是桌面端或精确指令触发的静态控件。",
          "comparisonEn": "<strong>Pull to Refresh vs Refresh Button:</strong> Pull-to-refresh fits touchscreen gestural ergonomics; Refresh buttons suit explicit desktop intent.",
          "quizQuestionZh": "场景思考：下拉刷新在内容没有发生任何变化时，应该如何反馈给用户？",
          "quizQuestionEn": "Scenario: What feedback should pull-to-refresh return when no new data exists?",
          "quizAnswerZh": "刷新指示器平滑收起，并在顶部呈现简短轻提示「已经是最新内容」，避免用户误以为网络故障或刷新未生效。",
          "quizAnswerEn": "Smoothly retract spinner and flash a subtle \"Already up to date\" confirmation to prove the check succeeded.",
          "demoType": "pull-to-refresh"
        },
        {
          "id": "drag-and-drop",
          "name": "Drag & Drop",
          "chineseName": "拖拽排序",
          "category": "interaction",
          "oneLineZh": "按住一个东西拖到另一个位置松手，就换过去了。",
          "oneLineEn": "Press something, drag it to another position, and release — and it moves there.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "改变顺序或归属关系（看板、图层、排序）",
              "recommended": true
            },
            {
              "situation": "空间位置本身有含义",
              "recommended": true
            },
            {
              "situation": "提供「移动到…」的键盘替代",
              "recommended": true
            },
            {
              "situation": "仅为了美观排序（用户不在意顺序）",
              "recommended": false
            },
            {
              "situation": "单选一个（用点击就够）",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "Changing order or membership (boards, layers, rankings)",
              "recommended": true
            },
            {
              "situation": "Spatial position itself carries meaning",
              "recommended": true
            },
            {
              "situation": "A keyboard equivalent such as \"Move to…\" is provided",
              "recommended": true
            },
            {
              "situation": "The ordering is purely cosmetic (users do not care about order)",
              "recommended": false
            },
            {
              "situation": "You are just picking one option (a click is enough)",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "拖拽的可用性成本很高：必须同时支持键盘（Space 拿起 → 方向键移动 → Space 放下）和「移到」菜单。",
            "移动端拖拽要处理自动滚动和手势冲突，是最难的交互之一。"
          ],
          "whenNotToUseEn": [
            "Drag and drop carries a high accessibility cost: you must support both the keyboard (Space to pick up, arrow keys to move, Space to drop) and a \"Move to…\" menu.",
            "Dragging on mobile has to handle auto-scroll and gesture conflicts, which makes it one of the hardest interactions to get right."
          ],
          "demoId": "drag-and-drop",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "可以拖动排序。",
            "detailed": "支持拖拽重新排序：拖动时原位留空隙并显示插入指示线，松手后平滑移动到新位置，并同步更新数组顺序。",
            "implementation": "用 HTML5 draggable 或 Pointer Events（推荐后者，触屏也能用）。onPointerDown 记录起点，move 超过 5px 阈值才进入拖拽态（避免和点击冲突）。拖拽中：源元素 opacity 0.4 变为 ghost 跟随指针，目标位置显示 2px 指示线。计算插入索引用指针位置与各项中点比较。松手后用 FLIP 动画让其他项平滑归位。必须补键盘方案：焦点在项目上按 Space 拿起、↑↓ 移动、Space 放下、Esc 取消。"
          },
          "aiPromptEn": {
            "basic": "Items can be dragged to reorder.",
            "detailed": "Support drag-and-drop reordering: while dragging, leave a gap at the origin and show an insertion indicator line; on release, animate the item smoothly into its new position and update the underlying array order.",
            "implementation": "Use HTML5 draggable or Pointer Events (the latter is recommended so touch works too). Record the start point on onPointerDown, and only enter the dragging state once movement passes a 5px threshold (this avoids conflicting with clicks). While dragging: the source element becomes a ghost at opacity 0.4 following the pointer, and the target position shows a 2px indicator line. Compute the insertion index by comparing the pointer position against each item's midpoint. On release, use a FLIP animation to let the other items settle smoothly. You must also add the keyboard path: with focus on an item, Space picks it up, Up/Down moves it, Space drops it, Esc cancels."
          },
          "globalIndex": 33,
          "level": 3,
          "analogyBadgeZh": "生活类比: 整理书架时用手把一本厚字典抽出来插到另一排",
          "analogyBadgeEn": "Analogy: Pulling a Book from a Shelf and Slotting it Elsewhere",
          "analogyDescZh": "按住不放时卡片轻微浮起并投下深色阴影，拖动过程中其它条目自动让开空位，松手瞬间吸附就位。",
          "analogyDescEn": "Holding lifts the card into an elevated drop shadow plane, surrounding books yield space, and release snaps it home.",
          "comparisonZh": "<strong>Drag & Drop vs Up/Down Buttons:</strong> 拖拽直观符合现实物理直觉，适合多项自由大范围重排；上下按钮更适合无障碍键盘精准微调。",
          "comparisonEn": "<strong>Drag & Drop vs Up/Down Buttons:</strong> Direct manipulation handles continuous rearrangement; arrow keys guarantee accessibility.",
          "quizQuestionZh": "场景思考：当用户拖动一个元素时，为什么该元素应该增加轻微倾斜、透明度或放大阴影？",
          "quizQuestionEn": "Scenario: Why must a dragged card show elevation shadows or a slight tilt?",
          "quizAnswerZh": "提供强烈的深度（Elevation）感知，向用户大脑发送明确信号：「当前对象已脱离地面平面，处于被我抓起的漂浮状态」。",
          "quizAnswerEn": "It communicates elevation physics, reassuring the user that the element has lifted from the document into a floating state.",
          "demoType": "drag-and-drop"
        },
        {
          "id": "error-state",
          "name": "Error State",
          "chineseName": "错误状态",
          "category": "feedback",
          "oneLineZh": "出错了——不是「暂无数据」，是真的出错了，而且要告诉用户能怎么办。",
          "oneLineEn": "Something actually broke — not \"no data\", genuinely broken — and the user has to be told what to do about it.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "数据请求失败",
              "recommended": true
            },
            {
              "situation": "权限被拒绝（相机、相册）",
              "recommended": true
            },
            {
              "situation": "设备状态异常（离线、存储不足）",
              "recommended": true
            },
            {
              "situation": "输入格式错误",
              "recommended": "mostly"
            },
            {
              "situation": "内容本来就不存在",
              "recommended": false
            }
          ],
          "whenToUseEn": [
            {
              "situation": "A data request failed",
              "recommended": true
            },
            {
              "situation": "A permission was denied (camera, photos)",
              "recommended": true
            },
            {
              "situation": "The device is in a bad state (offline, out of storage)",
              "recommended": true
            },
            {
              "situation": "The input format is invalid",
              "recommended": "mostly"
            },
            {
              "situation": "The content genuinely does not exist",
              "recommended": false
            }
          ],
          "whenNotToUseZh": [
            "不要给用户看「Error 500」「ECONNREFUSED」这种技术信息。",
            "权限错误必须给「去设置」的跳转，而不是只说「权限不足」让用户干瞪眼。"
          ],
          "whenNotToUseEn": [
            "Do not show users raw technical strings like \"Error 500\" or \"ECONNREFUSED\".",
            "A permission error has to offer a \"Open settings\" shortcut instead of just stating that permission is missing and leaving the user stuck."
          ],
          "demoId": "error-state",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "请求失败了显示错误。",
            "detailed": "列表加载失败时显示错误态：「没能加载照片」+「请检查网络连接」+「重试」按钮，技术错误码放在可展开的「详细信息」里。",
            "implementation": "和空状态用同一位置、同样式，但文案不同。标题写人话（「没能加载照片」），副文案给原因和出路，技术错误码放在 <details> 里默认折叠。错误类型分流：网络错误→「重试」；权限拒绝→「去设置」并调起系统设置；404→「这个内容可能已被删除」+「返回」；5xx→「服务暂时不可用」+「重试」+「稍后再试」。重试时显示按钮 loading 态避免重复点击。"
          },
          "aiPromptEn": {
            "basic": "Show an error when the request fails.",
            "detailed": "When a list fails to load, show an error state: \"Could not load photos\", \"Check your network connection\", and a \"Retry\" button, with the technical error code tucked inside a collapsible \"Details\" section.",
            "implementation": "Same position and styling as the empty state, different copy. The title is plain language (\"Could not load photos\"), the supporting line gives the cause and the way out, and the technical code goes inside a <details> element, collapsed by default. Branch by error type: network error → \"Retry\"; permission denied → \"Open settings\" and launch the system settings; 404 → \"This content may have been deleted\" + \"Go back\"; 5xx → \"The service is temporarily unavailable\" + \"Retry\" + \"Try again later\". Show a loading state on the retry button so it cannot be double-submitted."
          },
          "globalIndex": 34,
          "level": 3,
          "analogyBadgeZh": "生活类比: 汽车仪表盘突然亮起的红色机油故障灯",
          "analogyBadgeEn": "Analogy: Red Warning Light Lighting up on Car Dashboard",
          "analogyDescZh": "它清楚地告诉你哪里出问题了、为什么出问题，最重要的是指引你接下来该怎样做才能恢复正常。",
          "analogyDescEn": "Illuminates unambiguously where something broke, why it halted, and what immediate action will restore sanity.",
          "comparisonZh": "<strong>Error State vs Empty State:</strong> 空状态是平静无数据的期待；错误状态是由于断网、崩溃或权限不足导致的流程中断。",
          "comparisonEn": "<strong>Error State vs Empty State:</strong> Empty states signal peaceful zero data; error states signify unexpected disruptions.",
          "quizQuestionZh": "场景思考：优秀的错误状态界面绝对不能只显示冷冰冰的「Error 500: Server Error」，它必须包含什么？",
          "quizQuestionEn": "Scenario: What must a human-centric error state include beyond \"Error 500\"?",
          "quizAnswerZh": "必须使用人类听得懂的语言解释原因，并给出明确的出路，如「检查网络连接」或「点击重试」按钮，以及返回首页的安全出口。",
          "quizAnswerEn": "Plain human explanation (\"Could not reach server\"), actionable remedies (\"Retry\" button), and an escape hatch home.",
          "demoType": "error-state"
        },
        {
          "id": "alert",
          "name": "Alert",
          "chineseName": "警示框",
          "category": "feedback",
          "oneLineZh": "一个必须认真对待的消息：出错了、有风险、需要你处理。",
          "oneLineEn": "A message that has to be taken seriously: something broke, something is at risk, and you need to act on it.",
          "summaryZh": "",
          "summaryEn": "",
          "whenToUseZh": [
            {
              "situation": "需要用户处理才能继续（错误、风险）",
              "recommended": true
            },
            {
              "situation": "影响范围较大（整个账户、网络异常）",
              "recommended": true
            },
            {
              "situation": "信息需要持续显示，不能自动消失",
              "recommended": true
            },
            {
              "situation": "操作成功的小提示",
              "recommended": false
            },
            {
              "situation": "只是想给个操作建议",
              "recommended": "mostly"
            }
          ],
          "whenToUseEn": [
            {
              "situation": "The user must act before anything can continue (an error, a risk)",
              "recommended": true
            },
            {
              "situation": "The blast radius is large (a whole account, a network outage)",
              "recommended": true
            },
            {
              "situation": "The information has to stay on screen and cannot auto-dismiss",
              "recommended": true
            },
            {
              "situation": "Reporting the success of a small action",
              "recommended": false
            },
            {
              "situation": "You only want to offer a tip on how to use something",
              "recommended": "mostly"
            }
          ],
          "whenNotToUseZh": [
            "红色意味着「有问题」，如果你用红色显示普通建议，用户会一直紧张。",
            "一条页面里同时出现 3 个 Alert，用户会直接全部无视。"
          ],
          "whenNotToUseEn": [
            "Red means \"something is wrong\". If you render an ordinary tip in red, users stay anxious about the entire interface.",
            "Three alerts on one page and users will ignore every single one of them."
          ],
          "demoId": "alert",
          "bestPracticesZh": [],
          "bestPracticesEn": [],
          "aiPromptZh": {
            "basic": "出错了要提醒用户。",
            "detailed": "在表单顶部加一个红色 Alert：「邮箱已被注册」+ 副文案「换个邮箱，或直接登录已有账号」+「去登录」按钮，用户修改后自动消失。",
            "implementation": "role=\"alert\" aria-live=\"assertive\"。浅红底 #FAEDEC、左侧 3px 红边 #A8342C、圆角 8px、padding 12px 16px。内含 ! 图标 + 标题 14px medium + 描述 13px + 右侧文字按钮。表单提交失败时插入到表单顶部并把焦点移到它。错误被修正（输入重新验证通过）后自动移除，但不要让焦点跳回输入框（会打断用户）。"
          },
          "aiPromptEn": {
            "basic": "Tell the user when something goes wrong.",
            "detailed": "Add a red alert at the top of the form: \"This email is already registered\", a supporting line \"Use a different email, or sign in to your existing account\", and a \"Sign in\" button. It disappears automatically once the user corrects the field.",
            "implementation": "role=\"alert\" aria-live=\"assertive\". Light red background #FAEDEC, 3px left border in #A8342C, border-radius 8px, padding 12px 16px. Inside: an ! icon, a 14px medium title, a 13px description, and a text button on the right. On a failed form submission, insert it at the top of the form and move focus to it. Remove it automatically once the error is corrected (the field revalidates), but do not send focus jumping back to the input — that interrupts the user."
          },
          "globalIndex": 35,
          "level": 3,
          "analogyBadgeZh": "生活类比: 楼道墙壁上敲碎玻璃露出的紧急火警报警铃",
          "analogyBadgeEn": "Analogy: Wall-mounted Emergency Fire Alarm with Pull Handle",
          "analogyDescZh": "用高纯度的黄色或红色带边框横幅，牢牢固定在页面最醒目的位置，在问题解决前持续发出警示。",
          "analogyDescEn": "Bold high-contrast banners mounted at the top of the room, broadcasting persistent caution until explicitly resolved.",
          "comparisonZh": "<strong>Alert vs Toast:</strong> Toast 短暂浮动且几秒自动消失，适合日常成功反馈；Alert 持续常驻在文档流内，适合系统维护、欠费等全局危机通知。",
          "comparisonEn": "<strong>Alert vs Toast:</strong> Toasts disappear silently; Alerts persist in-flow commanding attention for system-level status.",
          "quizQuestionZh": "场景思考：根据紧急程度，Alert 通常应该区分为哪四种标准的严重性级别（Severity Levels）？",
          "quizQuestionEn": "Scenario: What are the four industry-standard Alert severity tiers?",
          "quizAnswerZh": "Info（蓝色中性通知）、Success（绿色完成确认）、Warning（黄色潜在风险警告）、Danger/Critical（红色紧急严重错误）。",
          "quizAnswerEn": "Info (blue advisory), Success (green confirmation), Warning (yellow caution), and Danger/Error (red critical).",
          "demoType": "alert"
        }
      ]
    }
  ]
};

export const allLessonItems: LearnLessonItem[] = learnWorkbenchData.levels.flatMap((l) => l.items);
export const lessonItemById: Map<string, LearnLessonItem> = new Map(allLessonItems.map((it) => [it.id, it]));
