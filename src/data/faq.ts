export interface FaqItem {
  id: string;
  category: 'guide' | 'mindset' | 'cases' | 'troubleshoot';
  question: string;
  questionZh?: string;
  summary: string;
  answerHtml?: string;
  content: string[];
  /** 结合本站真实 Pattern 的关联 id */
  relatedPatterns?: string[];
  /** 真实可直接复制给 AI 的口语化 Prompt 示例 */
  promptExample?: {
    bad: string;
    colloquialBetter: string;
    confirmationPrompt: string;
    explanation: string;
  };
}

export interface FaqCategory {
  id: 'guide' | 'mindset' | 'cases' | 'troubleshoot';
  name: string;
  nameZh?: string;
  desc: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'guide',
    name: '网站食用指南',
    nameZh: '网站食用指南',
    desc: '从「不知道叫什么」到「在 Cursor 里敲下代码」的极简四步闭环。',
  },
  {
    id: 'mindset',
    name: 'AI 前端交流心法',
    nameZh: 'AI 前端交流心法',
    desc: '为什么说「让 AI 反向确认细节」比直接让它写代码好用十倍？',
  },
  {
    id: 'cases',
    name: '本站组件实战案例',
    nameZh: '本站组件实战案例',
    desc: '结合 Modal、Bottom Sheet、Toast、Card 等真实场景的口语化提问对比。',
  },
  {
    id: 'troubleshoot',
    name: 'AI 翻车与调优排查',
    nameZh: 'AI 翻车与调优排查',
    desc: '样式丑、没手感、缺无障碍、弹窗关不掉？教你口语化手术刀式追问。',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'how-to-use-site',
    category: 'guide',
    question: '作为一个新手 AI 独立开发者，我该如何使用这个网站？',
    summary: '把它当成你的「前端意图翻译机」和「组件验收标准清单」。',
    content: [
      '作为独立开发者，你的最大优势是产品想法与业务敏捷度，但最常卡壳的瞬间往往是：脑海中有交互画面，却不知道前端生态里对应的权威术语叫什么，导致直接对 AI（Cursor / Windsurf / Claude / v0）提需求时，AI 全凭概率猜，做出一堆不可用的代码。',
      '使用本站的推荐工作流：',
      '1. 【定位】如果完全不知道叫什么，去「我不知道它叫什么（Identify）」按出现位置和触发方式定位，或者在搜索框直接用生活化大白话搜（如“底下弹出来”、“转圈圈”）。',
      '2. 【手感验证】点进词条，直接在「Live Demo」里点击试用，确认它是否符合你的交互预期。',
      '3. 【认知解剖】看「Anatomy（解剖结构）」和「When to Use」，了解一个专业的组件应包含哪些部件（遮罩、手柄、关闭按钮、无障碍焦点）。',
      '4. 【复制口语 Prompt】在词条详情的「Ask AI」里，复制我们为你生成的「口语协同模式」提示词，粘贴进你的 AI 编程助手，让 AI 帮你确认细节并生成符合业界标准的组件！',
    ],
    relatedPatterns: ['bottom-sheet', 'modal', 'toast'],
  },
  {
    id: 'compare-decisions',
    category: 'guide',
    question: '面对相似的组件，我该怎么做选型决策？',
    summary: '去「对比（Compare）」页面看决策速查表，避免在移动端滥用 PC 端模式。',
    content: [
      '独立开发者最容易踩的坑就是“把所有弹窗都做成 Modal”、“把所有提示都做成 Alert”。',
      '在「对比（Compare）」专区，我们提炼了高频困惑（例如：Toast vs Snackbar、Dialog vs Bottom Sheet、Tabs vs Segmented Control 等）。',
      '每组对比都有清晰的三段论：一张横向对比表、几条绝对不要违背的决策规则（Decision Rules），以及一句可以直接当成口诀记住的总结。选型前花 30 秒看一眼，能省去后期重构数小时的痛苦。',
    ],
    relatedPatterns: ['modal', 'bottom-sheet', 'toast', 'snackbar', 'tabs', 'segmented-control'],
  },
  {
    id: 'why-ai-generates-slop',
    category: 'mindset',
    question: '为什么我直接对 AI 说「帮我做个好看的弹窗/卡片」，效果总是很糟糕？',
    summary: '因为太模糊的 Prompt 会触发大模型的「概率平均化」，吐出平庸甚至带有严重交互缺陷的代码。',
    content: [
      '大模型本质上是概率续写机。当你输入「帮我做个好看的弹窗」时：',
      '• AI 不知道你的目标端（PC 还是移动端？是宽屏还是触摸屏？）',
      '• AI 不知道信息层级（是危险操作确认、长表单填写、还是纯状态通知？）',
      '• AI 不知道交互约束（遮罩层点击是否关闭？按 ESC 能否退出？焦点是否被锁定？）',
      '结果就是：AI 给你在屏幕正中间居中画了一个硬编码圆角和边框的白盒子，移动端键盘弹起时直接被遮挡，没有任何过渡动效，关闭按钮点了没反应。',
      '正确的做法不是背诵冷冰冰的 CSS 代码，而是**「明确业务意图 + 给出标准组件名 + 限制交互边界」**。',
    ],
    promptExample: {
      bad: '帮我写个弹窗，好看点，里面有确认和取消。',
      colloquialBetter: '我想在用户点击注销账号时给一个防误触弹窗。用标准的 Dialog / Modal 规范，居中显示，包含醒目的红色危险删除按钮和次级取消按钮。',
      confirmationPrompt: '我想做一个注销账号的二次确认弹窗。请使用标准的 Dialog / Modal 规范。在写代码前，请先向我确认：1) 标题与警示文案层级；2) 点击背景遮罩是否允许关闭（防误触）；3) 键盘 ESC 与焦点锁定逻辑。确认后再给出 React + Tailwind 实现。',
      explanation: '好的 Prompt 让 AI 明白它面对的是什么严肃场景，并主动补全专业前端的防御性设计。',
    },
    relatedPatterns: ['modal', 'alert-dialog', 'destructive-action'],
  },
  {
    id: 'four-step-prompt-formula',
    category: 'mindset',
    question: '新手与 AI 沟通前端组件的最佳公式是什么？',
    summary: '记住「场景意图 + 标准组件名 + 交互期望 + 反向确认」四步口语公式。',
    content: [
      '你不需要成为专业前端切图仔，但你需要学会当一个合格的「产品架构指挥官」。向 AI 提组件需求时，套用这套极简公式：',
      '【第 1 步 · 场景意图】一句话说清楚业务目的（例如：“用户在结算页点击优惠券时”、“商品列表页每一项”）。',
      '【第 2 步 · 权威组件名】代入本站提供的标准中英文术语（如 Bottom Sheet、Stat Card、Accordion、Skeleton）。',
      '【第 3 步 · 关键交互特征】说明触发方式与关闭方式（如“从底部滑上来”、“展开当前项时自动收起其他项”）。',
      '【第 4 步 · 反向确认指令】强制加上一句：“在给出最终代码前，请先向我确认关键细节和边界条件”。这一句话能让 AI 的代码质量提升一个档次！',
    ],
    promptExample: {
      bad: '做个列表，展开可以看详情。',
      colloquialBetter: '我需要在帮助中心做一个常见问题解答列表。请使用标准的 Accordion（手风琴）组件规范，点击问题标题展开答案。',
      confirmationPrompt: '我想在帮助中心做 FAQ 模块，请使用标准的 Accordion（手风琴）组件。在写代码前，请先向我确认：1) 默认是否全折叠、是否允许同时展开多个；2) 展开箭头的旋转动效；3) 是否需要平滑的高度过渡动画。确认无误后给出实现代码。',
      explanation: '通过反向确认，AI 不会一股脑写完又让你反复 debug，而是先把设计意图对齐。',
    },
    relatedPatterns: ['accordion', 'collapsible'],
  },
  {
    id: 'confirmation-prompting',
    category: 'mindset',
    question: '什么是「确认式对话」（Confirmation Prompting）？为什么强烈推荐？',
    summary: '把 AI 从「不可预测的代码生成器」变成「先对齐需求的前端专家伙伴」。',
    content: [
      '很多新手习惯把 AI 当成单向指令接收器：发一段话 -> AI 吐出 300 行代码 -> 发现不合心意 -> 痛苦地打补丁 -> 代码越来越乱。',
      '而高阶 AI 开发者更青睐「确认式对话」：',
      '你在 Prompt 的结尾明确要求：【“请先不要直接写全量代码。先列出你推测的核心规格、状态设计和交互假设向我确认，等我确认后再实现。”】',
      '这有三大立竿见影的收益：',
      '1. 发现盲点：AI 会主动提醒你诸如“移动端触控高度是否满足 44px”、“加载失败时有没有空状态”、“超长文本怎么截断”等容易被忽略的细节。',
      '2. 代码极其准确：经过一次简短的确认，AI 生成的代码几乎一次性就能跑通并融入项目。',
      '3. 培养你的产品直觉：在和 AI 的一问一答中，你自然而然学会了资深前端和 UI 设计师的思考方式。',
    ],
    relatedPatterns: ['empty-state', 'error-state'],
  },
  {
    id: 'case-modal-vs-bottomsheet',
    category: 'cases',
    question: '【实战案例 1】Modal（居中对话框）与 Bottom Sheet（底部抽屉）的提问技巧',
    summary: '移动端切忌到处用居中 Modal！教你如何用大白话让 AI 做出原生级底部抽屉。',
    content: [
      '痛点：在手机屏幕上，居中弹出的 Modal 往往拇指很难够到关闭按钮，键盘弹起还会把输入框顶到屏幕外。现代移动应用在次级操作、多选列表、支付选择时，标准做法是使用 Bottom Sheet（底部抽屉）。',
      '提问心法：向 AI 明确“运行在手机端”、“从底部滑出”，并提及“顶部拖拽手柄（Drag Handle）”与“向下滑动退出手势”。',
    ],
    promptExample: {
      bad: '写个弹窗让用户在手机上选支付方式。',
      colloquialBetter: '我在做一个移动端电商结账流程，需要用户选微信还是支付宝。请使用标准的 Bottom Sheet（底部抽屉）规范，贴底滑出，带半透明遮罩。',
      confirmationPrompt: '我想在移动端结账页做一个支付方式选择面板。请使用标准的 Bottom Sheet（底部抽屉）而不是居中 Modal。请先向我确认：1) 面板的默认高度与多档 Snap Points；2) 顶部拖拽手柄（Drag Handle）与手势滑动关闭阻尼；3) 遮罩点击关闭与无障碍焦点锁定。确认后再给出基于 React / Tailwind 的代码。',
      explanation: '代入了 Bottom Sheet 和 Snap Points 术语后，AI 会自动引入手势或高质量无障碍库（如 vaul 或 Radix UI）。',
    },
    relatedPatterns: ['bottom-sheet', 'modal'],
  },
  {
    id: 'case-toast-vs-snackbar',
    category: 'cases',
    question: '【实战案例 2】Toast（轻提示）与 Snackbar（带操作轻提示）的提问技巧',
    summary: '用户删除了重要内容？不要只用 Toast 提示“删除成功”，教 AI 带上「撤销」操作！',
    content: [
      '痛点：很多人不管什么通知都用一个 2 秒自动消失的纯文字 Toast。但如果是危险操作（如删除文件、取消关注），一旦手滑误触就不可挽回。',
      '提问心法：如果通知需要带上操作按钮（如“已移入回收站 · 撤销”），应明确告诉 AI 使用 Snackbar 规范，并约定停留时长与撤销回调。',
    ],
    promptExample: {
      bad: '用户删除了卡片后，弹个提示说删除成功。',
      colloquialBetter: '用户删除一条笔记后，在屏幕底部给一个轻提示，并包含一个「撤销」按钮。如果 5 秒内没点撤销，才真正执行删除。',
      confirmationPrompt: '在用户点击删除笔记后，我需要一个标准的 Snackbar（带操作轻提示）。请向我确认：1) 提示文字与「撤销」按钮的颜色主次；2) 自动停留时间（建议 4-6 秒）；3) 乐观更新与真正提交后端的倒计时逻辑。确认后给出实现。',
      explanation: 'Snackbar 能大幅减少用户的焦虑感，避免把简单的删除做成复杂的二次确认阻断弹窗。',
    },
    relatedPatterns: ['toast', 'snackbar'],
  },
  {
    id: 'case-card-layout',
    category: 'cases',
    question: '【实战案例 3】Card（内容卡片）的提问技巧',
    summary: '如何告诉 AI「整卡可点，但不要嵌套链接」，避免层级灾难？',
    content: [
      '痛点：新手让 AI 写卡片列表时，AI 经常在卡片外部套一个 <a> 标签，卡片内部又放一个「查看更多」的 <a> 标签或者点赞按钮，导致 HTML 规范报错、事件冒泡穿透，点击时行为诡异。',
      '提问心法：口语化强调“整卡可点（Card as click target）”、“内部不要嵌套链接”、“悬停时轻微上浮”，并指定标题截断行数。',
    ],
    promptExample: {
      bad: '帮我做几个好看的方块卡片放文章。',
      colloquialBetter: '做一组文章卡片：16:9 封面图、标题两行截断、发布时间与作者信息。整张卡片可点击跳转，悬停时轻度上浮并加深阴影。',
      confirmationPrompt: '我需要设计一组内容卡片列表（Card）。整张卡片作为可点击单元跳转详情页，但内部避免嵌套其它 <a> 标签以保证无障碍规范。请先向我确认封面长宽比、标题文字截断策略以及 hover 时的过渡微动效，然后给出组件代码。',
      explanation: '提前规避了 HTML 嵌套链接这个最经典的初学者 Bug。',
    },
    relatedPatterns: ['card', 'stat-card'],
  },
  {
    id: 'case-skeleton-loading',
    category: 'cases',
    question: '【实战案例 4】Skeleton（骨架屏）vs Spinner（加载转圈圈）的提问技巧',
    summary: '为什么不要在白屏中间放个大转盘？如何让 AI 根据页面结构生成骨架屏。',
    content: [
      '痛点：用户进入页面，白屏中间一个转圈圈（Spinner），不仅显得加载极慢，而且数据返回后页面瞬间跳动（Layout Shift），严重损伤视觉质感。',
      '提问心法：告诉 AI“根据实际内容排版生成骨架屏（Skeleton）”，带有微弱的呼吸扫光动画（Shimmer effect），高度和比例完全镜像真实卡片。',
    ],
    promptExample: {
      bad: '加载数据的时候加个 loading 状态。',
      colloquialBetter: '数据加载时不要只放居中的旋转图标，请用跟文章卡片结构 1:1 对应的 Skeleton（骨架屏）占位，带有轻柔的扫光动效。',
      confirmationPrompt: '我想为商品列表页设计加载状态。请使用标准的 Skeleton（骨架屏）而非居中 Spinner，骨架块应完全对应商品封面、标题和价格的几何占位。请向我确认扫光动画速度（Shimmer）与首屏渲染骨架数量，确认后给出实现代码。',
      explanation: '骨架屏给用户“内容马上就要呈现”的心理预期，主观体感加载速度快 30% 以上。',
    },
    relatedPatterns: ['skeleton', 'spinner'],
  },
  {
    id: 'tuning-ugly-ai-code',
    category: 'troubleshoot',
    question: 'AI 生成的代码很丑、间距松散或交互别扭，怎么口语化让它做「微调手术」？',
    summary: '拒绝空泛的「不好看」，用这 4 句手术刀口语指令精准指挥 AI。',
    content: [
      '很多独立开发者在微调时容易急躁，说“感觉还是不好看，再改改”，AI 就会随机乱改甚至把原本对的逻辑给冲掉。',
      '记住以下 4 句精准的高效微调指令：',
      '1. 【调层次与对比】：“现在的层级太平了。把主标题字重加大为 semibold，副标题文字颜色降为次级色（如 slate-500），边框透明度减弱为 10%。”',
      '2. 【调留白与紧凑度】：“界面太松散了。把容器内边距从 p-8 改为更克制的 p-4，元素间距从 space-y-6 缩减为 space-y-3。”',
      '3. 【调动效质感】：“现在的展开动作太生硬/太弹了。请使用标准的 cubic-bezier(0.16, 1, 0.3, 1) 缓动曲线，持续时间控制在 200ms 到 300ms 之间。”',
      '4. 【加防御性状态】：“请帮我补全另外三种状态：内容为空时的 Empty State、接口报错时的 Error State，以及单行文本过长时的省略号截断（truncate）。”',
    ],
    relatedPatterns: ['empty-state', 'error-state'],
  },
  {
    id: 'system-prompt-integration',
    category: 'troubleshoot',
    question: '如何把本站的 UI 规范内化进我的 Cursor Rules 或项目系统提示词中？',
    summary: '把规范做成规则文件，让 AI 在你的每一次会话中自动遵守。',
    content: [
      '你可以把本站的核心心法直接复制到你的项目根目录下的 `.cursorrules`、`.windsurfrules` 或 `CLAUDE.md` 中：',
      '“【前端交互与组件设计准则】：',
      '1. 严禁使用生硬的居中 alert 代替业务弹窗。移动端操作面板默认优先使用 Bottom Sheet 规范，PC 端对话框使用标准的 Dialog/Modal 规范并实现 ESC 退出与焦点捕获。',
      '2. 内容通知区分 Toast（自动消失轻提示）与 Snackbar（支持撤销操作），危险操作绝不可用静默 Toast。',
      '3. 列表加载优先使用与目标 DOM 占位 1:1 的 Skeleton（骨架屏），杜绝全屏大尺寸 Spinner。',
      '4. 在实现任何复杂复合组件前，先列出组件解剖结构（Anatomy）、无障碍要求及响应式假设，与我确认后再输出完整可运行代码。”',
    ],
  },
];
