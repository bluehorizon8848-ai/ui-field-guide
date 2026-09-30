import type { UIPattern } from '../types';

export const feedbackPatterns: UIPattern[] = [
  {
    id: 'toast',
    name: 'Toast',
    chineseName: '轻提示',
    aliases: ['toast', '轻提示', '浮动提示', '短暂提示', 'notification', '小提示'],
    category: 'feedback',
    level: 1,
    appearance: ['auto'],
    position: ['bottom'],
    job: ['status'],
    oneLine: '操作完成后屏幕角落飘出来的小提示，几秒后自己消失。',
    description:
      'Toast 只说一件事：「你刚才的操作成功了」。它没有按钮（需要操作就该用 Snackbar），不阻断用户，几秒自动消失。中文语境里也叫「轻提示」。',
    looksLike:
      '微信发出消息后顶部飘过的「已发送」、图片保存后右下角闪过的「已保存到相册」——都是 Toast。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '操作成功，需要一句确认', recommended: true },
      { situation: '不打断用户当前操作', recommended: true },
      { situation: '信息简单，无需用户做任何事', recommended: true },
      { situation: '需要用户做出选择（撤销 / 重试）', recommended: false },
      { situation: '传递严重错误', recommended: false },
    ],
    whenNotToUse: [
      'Toast 里放「撤销」按钮那就变成 Snackbar 了，别混用。',
      '连续操作时会堆叠成一列 Toast，看起来像出了错。',
    ],
    anatomy: [
      { label: 'Container', labelZh: '容器', note: '深色底白字，圆角 8px' },
      { label: 'Icon', labelZh: '图标', note: '成功 ✓ / 失败 ! / 信息 i' },
      { label: 'Message', labelZh: '文案', note: '一句话，≤20 字' },
      { label: 'Duration', labelZh: '时长', note: '2–4 秒自动消失' },
    ],
    similarPatterns: ['snackbar', 'alert', 'banner', 'badge'],
    compareWith: 'snackbar',
    aiPrompt: {
      basic: '保存后给个提示。',
      detailed:
        '保存成功后显示 Toast「照片已保存」，深色底白字，带对勾图标，屏幕顶部居中，2.5 秒后自动淡出。',
      implementation:
        '固定定位 top: 16px（或 bottom: 24px），水平居中，深色底 #1A1917 白字，圆角 8px，padding 10px 16px，图标 + 文案水平居中。动画 opacity + translateY(-10px) 淡入淡出各 200ms。3 秒后自动移除。连续触发时替换而非堆叠（同一个 key 的 toast 覆盖前一个）。role="status" aria-live="polite" 让屏幕阅读器也能读到。',
    },
    badPrompt: '操作完给个提示。',
    betterPrompt:
      '操作成功后弹 Toast：深色底白字、圆形图标、顶部居中、3 秒自动淡出，role="status" + aria-live="polite"，重复触发时替换而非堆叠。',
    fitsFor: '已保存 · 已发送 · 已完成',
    tags: ['非阻断', '自动消失', '确认'],
    comparisonSlug: 'toast-vs-snackbar-vs-alert',
  },
  {
    id: 'snackbar',
    name: 'Snackbar',
    chineseName: '带操作提示条',
    aliases: ['snackbar', '操作条', '撤销条', '动作条', 'material snackbar'],
    category: 'feedback',
    level: 2,
    appearance: ['auto'],
    position: ['bottom'],
    job: ['status'],
    oneLine: '和 Toast 长得差不多，但底部多了一个可选的操作按钮，比如「撤销」。',
    description:
      'Snackbar 和 Toast 的唯一区别就是「能不能做一件事」。有了撤销按钮，它就成为执行危险操作后的安全网。这也是为什么 Google 坚持删除操作要给 Snackbar 而不是弹确认框。',
    looksLike:
      'Gmail 删除邮件后底部弹出的「邮件已删除 · 撤销」、YouTube 关闭广告后底部的「广告已跳过 · 还原」——都带一个可点按钮。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '删除/移动等操作后提供撤销', recommended: true },
      { situation: '操作已生效，用户可能想反悔', recommended: true },
      { situation: '想避免「弹窗确认」打断用户', recommended: true },
      { situation: '只是告知成功，没有任何后续动作', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '如果撤销窗口只有 3 秒，对重要内容来说太短——要么延长时间，要么用确认框。',
      '底部有导航栏时，Snackbar 要上移，否则会被导航栏压住。',
    ],
    anatomy: [
      { label: 'Container', labelZh: '容器', note: '通常屏幕底部居中' },
      { label: 'Message', labelZh: '消息', note: '用被动语态：「邮件已删除」' },
      { label: 'Action', labelZh: '操作按钮', note: '如「撤销」「重试」' },
      { label: 'Duration', labelZh: '时长', note: '有撤销时给 5–10 秒' },
    ],
    similarPatterns: ['toast', 'alert', 'snackbar', 'destructive-action'],
    compareWith: 'toast',
    aiPrompt: {
      basic: '删除后给个撤销的机会。',
      detailed:
        '删除照片后底部显示 Snackbar「已删除 1 张照片」+「撤销」按钮，5 秒后自动消失；底部有导航时上移 80px。',
      implementation:
        'fixed bottom: calc(80px + env(safe-area-inset-bottom))，水平居中，深色底白字圆角 8px，左侧文字右侧「撤销」文字按钮（高对比色，不用蓝色）。5 秒倒计时自动消失，同时监听指针悬停暂停倒计时。点击「撤销」立即执行恢复并移除 snackbar。role="status" + aria-live="polite"，并给撤销按钮足够大的热区。',
    },
    badPrompt: '删除后提示一下。',
    betterPrompt:
      '删除后弹底部 Snackbar：「已删除 1 张照片」+「撤销」文字按钮，5 秒自动消失（悬停暂停倒计时），有底部导航时上移，role="status" + aria-live="polite"。',
    fitsFor: '删除 · 移出 · 批量操作',
    tags: ['撤销', '安全网', '非阻断'],
    comparisonSlug: 'toast-vs-snackbar-vs-alert',
  },
  {
    id: 'alert',
    name: 'Alert',
    chineseName: '警示框',
    aliases: ['警告', 'alert', '警示', '警告框', 'notice', '提示框'],
    category: 'feedback',
    level: 2,
    appearance: ['always', 'on-click'],
    position: ['overlay'],
    job: ['status', 'confirm'],
    oneLine: '一个必须认真对待的消息：出错了、有风险、需要你处理。',
    description:
      'Alert 是「不处理不行」的那类提示。它可以内嵌在页面里（Inline Alert），也可以放在对话框里（Alert Dialog）。关键是它通常需要用户做出回应。',
    looksLike:
      '表单提交失败后输入框下方那行红字「密码错误」、支付页面顶部的黄色横幅「您的银行卡已过期」——都是 Alert。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '需要用户处理才能继续（错误、风险）', recommended: true },
      { situation: '影响范围较大（整个账户、网络异常）', recommended: true },
      { situation: '信息需要持续显示，不能自动消失', recommended: true },
      { situation: '操作成功的小提示', recommended: false },
      { situation: '只是想给个操作建议', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '红色意味着「有问题」，如果你用红色显示普通建议，用户会一直紧张。',
      '一条页面里同时出现 3 个 Alert，用户会直接全部无视。',
    ],
    anatomy: [
      { label: 'Container', labelZh: '容器', note: '浅色底 + 同色左边框' },
      { label: 'Icon', labelZh: '图标', note: '按严重度选：i / ! / ×' },
      { label: 'Title', labelZh: '标题', note: '一句话说清问题' },
      { label: 'Description', labelZh: '说明', note: '可选，如何解决' },
      { label: 'Action', labelZh: '操作', note: '「重试」「去设置」' },
    ],
    similarPatterns: ['banner', 'toast', 'modal', 'error-state', 'inline-validation'],
    compareWith: 'banner',
    aiPrompt: {
      basic: '出错了要提醒用户。',
      detailed:
        '在表单顶部加一个红色 Alert：「邮箱已被注册」+ 副文案「换个邮箱，或直接登录已有账号」+「去登录」按钮，用户修改后自动消失。',
      implementation:
        'role="alert" aria-live="assertive"。浅红底 #FAEDEC、左侧 3px 红边 #A8342C、圆角 8px、padding 12px 16px。内含 ! 图标 + 标题 14px medium + 描述 13px + 右侧文字按钮。表单提交失败时插入到表单顶部并把焦点移到它。错误被修正（输入重新验证通过）后自动移除，但不要让焦点跳回输入框（会打断用户）。',
    },
    badPrompt: '出错了弹个提示。',
    betterPrompt:
      '表单顶部加 role="alert" 的 Alert：浅红底 + 3px 左边框 + ! 图标 + 标题「邮箱已被注册」+ 解决建议 + 「去登录」按钮，提交失败时聚焦它，输入修正后自动消失。',
    fitsFor: '错误 · 风险 · 需处理事项',
    tags: ['严重', '需处理', '持续'],
    comparisonSlug: 'toast-vs-snackbar-vs-alert',
  },
  {
    id: 'banner',
    name: 'Banner',
    chineseName: '横幅提示',
    aliases: ['横幅', 'banner', '顶部条', '通栏提示', 'announcement bar'],
    category: 'feedback',
    level: 2,
    appearance: ['always'],
    position: ['top'],
    job: ['status', 'inform'],
    oneLine: '横跨页面顶部或底部的一条长条，用来放全局消息。',
    description:
      'Banner 是 Alert 的「全局版」：它不属于任何具体表单或区域，而是整个应用/网站层面的消息——系统维护、网络异常、版本更新提示。',
    looksLike:
      '网站顶部那条「网站将于今晚 2:00 维护」的黄色条、App 顶部「当前处于离线模式」的提示条。',
    platforms: ['web', 'mobile'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '影响整个应用的状态（离线、维护中）', recommended: true },
      { situation: '与具体内容无关的全局通知', recommended: true },
      { situation: '需要用户知晓但不打断操作', recommended: true },
      { situation: '与某个输入框相关的错误', recommended: false },
    ],
    whenNotToUse: [
      'Banner 应该出现在内容之前（顶部）。放在页面最底部等于没人看见。',
      '不要用 Banner 做营销——那是落地页横幅的专利，不属于产品界面。',
    ],
    anatomy: [
      { label: 'Strip', labelZh: '条状容器', note: '通栏，色块背景' },
      { label: 'Icon', labelZh: '图标', note: '可省略' },
      { label: 'Message', labelZh: '消息', note: '居中或左对齐' },
      { label: 'Dismiss', labelZh: '关闭', note: '可选 X，用户可关掉' },
      { label: 'Action', labelZh: '操作', note: '「去更新」「重试」' },
    ],
    similarPatterns: ['alert', 'toast', 'badge'],
    compareWith: 'alert',
    aiPrompt: {
      basic: '顶部加一条提示。',
      detailed:
        '在页面顶部加一个全局 Banner：「网络连接已断开，内容可能不是最新的」+「重试」按钮，可手动关闭，关闭状态记到本次会话。',
      implementation:
        '通栏条，位于 header 之上或 header 之下，浅黄底 + 深色文字，padding 8px 16px，flex 居中。role="status"。关闭按钮用 aria-label="关闭提示"，关闭状态存 sessionStorage（只在本会话有效，不写 localStorage 以便下次仍提示）。离线状态用 window online/offline 事件自动显示/隐藏，检测到恢复网络时自动替换文案为「已恢复连接」。',
    },
    badPrompt: '顶部加个提示条。',
    betterPrompt:
      '加全局 Banner（通栏、role=status）：显示「网络连接已断开」+「重试」按钮，可手动关闭且状态存 sessionStorage，监听 online/offline 事件自动显示与替换文案。',
    fitsFor: '离线 · 维护 · 全局通知',
    tags: ['全局', '通栏', '常驻'],
  },
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    chineseName: '进度条',
    aliases: ['进度条', 'progress bar', '进度指示器', 'loading bar', '百分比条'],
    category: 'feedback',
    level: 1,
    appearance: ['auto'],
    position: ['inline'],
    job: ['status'],
    oneLine: '一条横线，随着任务完成一点点填满，让你知道还要等多久。',
    description:
      'Progress Bar 的关键是有没有确定的总量。有总量就显示百分比；没有总量（不知道要多久）就显示不确定态（来回滑动的短条），不要假装有进度。',
    looksLike:
      'App 更新时顶部的细长进度条、下载文件时底部的百分比条、上传照片时每张图下面的小细条。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '知道总工作量，能给出百分比', recommended: true },
      { situation: '任务耗时较长（上传、下载、安装）', recommended: true },
      { situation: '需要显示「第几步 / 共几步」的量化感', recommended: true },
      { situation: '完全不知道要多久', recommended: 'mostly' },
      { situation: '操作 0.3 秒就完成', recommended: false },
    ],
    whenNotToUse: [
      '进度条走到 99% 停住是最糟糕的体验——如果卡在 99%，应该改成不确定态或显示原因。',
      '不要在不确定进度时显示假的百分比（比如匀速走到 90% 再等），用户能感觉到被欺骗。',
    ],
    anatomy: [
      { label: 'Track', labelZh: '轨道', note: '4px 高，浅灰底' },
      { label: 'Fill', labelZh: '已填充', note: '主色，宽度 = 百分比' },
      { label: 'Label', labelZh: '百分比', note: '可选，紧邻显示' },
      { label: 'Indeterminate', labelZh: '不确定态', note: '短条来回滑动' },
    ],
    similarPatterns: ['spinner', 'skeleton', 'stepper', 'slider'],
    compareWith: 'spinner',
    aiPrompt: {
      basic: '加个进度条。',
      detailed:
        '上传时显示进度条：已知总大小所以显示真实百分比和「已上传 3.2MB / 8MB」；上传完成后变绿色打勾，失败变红色并显示重试。',
      implementation:
        '容器高 4px 圆角全满 bg #E6E3DB，内部 div 宽度 = 百分比。动画 transition: width 200ms ease-out。已知总量用 value=0..100 的确定态；未知总量用 indeterminate：内部短条（30% 宽）做 translateX 0→100% 的循环动画。总进度可加权：单文件进度占 80%，合并步骤占 20%。失败时填充变 #A8342C 并在下方显示「上传失败 · 重试」。',
    },
    badPrompt: '加载的时候加个进度条。',
    betterPrompt:
      '加载时显示 Progress Bar：已知总量时显示真实百分比 + 「已上传 3.2MB / 8MB」文案，完成变绿勾、失败变红并给「重试」，总量未知时改用不确定态短条循环而不是假进度。',
    fitsFor: '上传 · 下载 · 安装',
    tags: ['量化', '百分比', '等待'],
    comparisonSlug: 'spinner-vs-progress-bar-vs-skeleton',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    chineseName: '加载转圈',
    aliases: ['转圈圈', 'spinner', 'loading spinner', '加载动画', 'loading', '菊花'],
    category: 'feedback',
    level: 1,
    appearance: ['auto'],
    position: ['center'],
    job: ['status'],
    oneLine: '一个不停转的圈，表示「正在加载，请稍等」。',
    description:
      'Spinner 是最简单也最容易被滥用的加载指示。它的最大问题是：它让页面「空」着，用户不知道会等多久，也不知道到底有没有开始。',
    looksLike:
      '页面中间那个转圈的加载图标、点按钮后按钮里转的小圈、App 冷启动时的菊花。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '等待时间短（<1 秒）且无页面结构变化', recommended: true },
      { situation: '按钮内部的小范围加载', recommended: true },
      { situation: '只是一个独立小部件在加载', recommended: true },
      { situation: '等待超过 1 秒且有页面结构', recommended: false },
      { situation: '首次加载整个页面', recommended: false },
    ],
    whenNotToUse: [
      '空页面 + 转圈 = 用户以为页面坏了。首次加载请用 Skeleton。',
      '如果超过 10 秒还没结果，加一句「加载较慢，重试？」比继续转圈友好。',
    ],
    anatomy: [
      { label: 'Ring', labelZh: '圆环', note: '12–32px，2–3px 线宽' },
      { label: 'Rotation', labelZh: '旋转', note: '匀速 0.8s/圈' },
      { label: 'Container', labelZh: '容器', note: '按钮内或页面中央' },
    ],
    similarPatterns: ['progress-bar', 'skeleton', 'spinner'],
    compareWith: 'skeleton',
    aiPrompt: {
      basic: '加载的时候转个圈。',
      detailed:
        '按钮点击后显示 spinner 并禁用，文字替换为「保存中…」；页面级加载用 24px spinner 加一行「正在加载相册…」文案，超过 10 秒显示重试选项。',
      implementation:
        'SVG 圆环 + stroke-dasharray 实现旋转，animation: spin 0.8s linear infinite（必须 linear，缓动会显得卡）。按钮内 spinner 16px，按钮宽度保持不变（避免布局跳动，用 min-width）。page 级：24px spinner + 13px 文字，居中。超过 10 秒用 setTimeout 显示「加载较慢」+「重试」链接。prefers-reduced-motion 下改为不旋转的静态三个点。',
    },
    badPrompt: '加载的时候显示个转圈。',
    betterPrompt:
      '加载态用 Spinner：SVG 圆环 0.8s linear 匀速旋转，按钮内 16px 且保持按钮宽度不变，页面级 24px + 「正在加载…」文案，超过 10 秒显示重试，reduced-motion 下改静态三点。',
    fitsFor: '短等待 · 按钮内 · 小部件',
    tags: ['等待', '无进度', '简单'],
    comparisonSlug: 'spinner-vs-progress-bar-vs-skeleton',
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    chineseName: '骨架屏',
    aliases: ['骨架屏', 'skeleton', '骨架', '占位', 'skeleton screen', '灰屏占位'],
    category: 'feedback',
    level: 2,
    appearance: ['auto'],
    position: ['inline'],
    job: ['status'],
    oneLine: '数据没到之前，先用灰色块把未来的布局摆出来。',
    description:
      'Skeleton 的价值是消除「页面在组装」的过程感。用户先看到内容形状，再看到内容本身，感知等待时间会明显缩短。它比 Spinner 更高级的地方在于——它同时也在传递「这个页面会长什么样」。',
    looksLike:
      '打开小红书还没加载完时，那些灰色的头像方块、标题横条、图片占位块——就是骨架屏。',
    platforms: ['web', 'mobile'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '首次加载一个有固定结构的页面', recommended: true },
      { situation: '等待超过 1 秒', recommended: true },
      { situation: '需要让用户提前理解页面结构', recommended: true },
      { situation: '分页加载更多（追加到列表底部）', recommended: true },
      { situation: '结构不固定（无限滚动未知内容）', recommended: false },
    ],
    whenNotToUse: [
      '如果数据 200ms 就回来了，Skeleton 的闪现本身就是干扰——加一个最短显示时长（如 300ms）。',
      '骨架的形状要真的和最终内容一致，否则用户会看到「形状变了」的抖动。',
    ],
    anatomy: [
      { label: 'Block', labelZh: '占位块', note: '圆角与真实元素一致' },
      { label: 'Shimmer', labelZh: '微光扫过', note: '可选的循环高光动画' },
      { label: 'Layout Mirror', labelZh: '布局镜像', note: '形状对应真实内容' },
      { label: 'Fade Out', labelZh: '淡出', note: '数据到达后骨架消失' },
    ],
    similarPatterns: ['spinner', 'progress-bar', 'empty-state', 'skeleton'],
    compareWith: 'spinner',
    aiPrompt: {
      basic: '加载的时候显示灰色占位。',
      detailed:
        '列表加载时用 Skeleton：显示 6 个和真实卡片等高的灰色占位块，带微光扫过动画，数据到达后淡出替换为真实内容。',
      implementation:
        '每条占位块的高度、宽度、间距与真实卡片完全一致（尤其首行文字宽度约 60%、次行 40%，模拟真实文本行长度）。背景 #E6E3DB（比纯灰柔和），微光用 linear-gradient 从左到右扫过，周期 1.5s，opacity 从 0.4→0.9。若加载很快，加一个「最短显示 300ms」的延迟避免闪烁。prefers-reduced-motion 下关闭微光动画，仅显示静态灰块。',
    },
    badPrompt: '加载的时候显示灰块占位。',
    betterPrompt:
      '列表加载用 Skeleton：占位块尺寸与真实卡片完全一致（文字行模拟 60%/40% 宽度），浅灰底 + 1.5s 微光扫过，数据到达后淡出；加载很快时加「最短显示 300ms」避免闪烁，reduced-motion 下关闭微光。',
    fitsFor: '首次加载 · 列表分页 · 结构固定',
    tags: ['占位', '结构预览', '感知优化'],
    comparisonSlug: 'spinner-vs-progress-bar-vs-skeleton',
  },
  {
    id: 'empty-state',
    name: 'Empty State',
    chineseName: '空状态',
    aliases: ['空状态', 'empty state', '空页面', '零状态', 'blank state', '无数据'],
    category: 'feedback',
    level: 2,
    appearance: ['always'],
    position: ['center'],
    job: ['status', 'create'],
    oneLine: '列表空空如也时显示的那块内容——它该解释为什么空，以及下一步做什么。',
    description:
      'Empty State 是被低估最严重的模式。默认做法是「暂无数据」四个字，但这浪费了用户最困惑的那一刻。好的空状态包含三件事：为什么空、能做什么、下一步点哪里。',
    looksLike:
      '新建的相册里那句「还没有照片，去拍一张吧」+ 一个相机图标 + 一个「新建相册」按钮。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '列表、搜索结果、收件箱没有任何内容', recommended: true },
      { situation: '用户第一次使用，页面完全空白', recommended: true },
      { situation: '筛选后结果为空', recommended: true },
      { situation: '任务完成了（清单全部完成）', recommended: 'mostly' },
      { situation: '只是加载中', recommended: false },
    ],
    whenNotToUse: [
      '三种空状态要区别对待：「从没创建过」「筛选后无结果」「任务已完成」——文案和行动建议完全不同。',
      '空状态插画不能喧宾夺主，它是配角。',
    ],
    anatomy: [
      { label: 'Illustration', labelZh: '插图', note: '轻量线性，不要太花' },
      { label: 'Title', labelZh: '标题', note: '说明当前状态' },
      { label: 'Description', labelZh: '描述', note: '为什么空 + 怎么填' },
      { label: 'Primary Action', labelZh: '主操作', note: '一个明确的按钮' },
    ],
    similarPatterns: ['cta', 'skeleton', 'error-state', 'empty-state'],
    compareWith: 'error-state',
    aiPrompt: {
      basic: '没数据时显示个提示。',
      detailed:
        '搜索无结果时显示空状态：标题「没有找到匹配的照片」，说明「试试减少筛选条件，或换个关键词」，主操作「清除全部筛选」。',
      implementation:
        '垂直居中布局，最大宽 320px，间距 24px 插图 + 12px 标题 + 8px 描述 + 16px 按钮。区分三种空状态文案：「首次使用」（讲价值 + 主 CTA 引导创建）、「筛选无结果」（讲怎么放宽条件 + 清除筛选按钮）、「已完成」（庆祝语气，可无按钮）。空状态不要用 Skeleton 样式（灰块），要明确告诉用户「这是空的，不是加载中」。',
    },
    badPrompt: '没有数据的时候显示暂无数据。',
    betterPrompt:
      '空状态写成三段式：标题说明当前状态 + 描述解释为什么空和怎么填 + 一个明确主操作；并区分「首次使用 / 筛选无结果 / 任务已完成」三种文案，不要和 Skeleton 混用。',
    fitsFor: '首次使用 · 筛选无结果 · 已完成',
    tags: ['引导', '解释', '下一步'],
  },
  {
    id: 'error-state',
    name: 'Error State',
    chineseName: '错误状态',
    aliases: ['错误态', 'error state', '出错状态', '失败状态', 'error page', '空错误'],
    category: 'feedback',
    level: 2,
    appearance: ['always'],
    position: ['center'],
    job: ['status'],
    oneLine: '出错了——不是「暂无数据」，是真的出错了，而且要告诉用户能怎么办。',
    description:
      'Error State 和 Empty State 是两回事。Empty State 是「本来就没有」，Error State 是「本来应该有但没拿到」。后者必须给重试入口和原因说明，不能只放一个哭脸。',
    looksLike:
      '「网络连接失败，请检查网络后重试」+「重试」按钮，出现在列表本该有内容的位置上。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '数据请求失败', recommended: true },
      { situation: '权限被拒绝（相机、相册）', recommended: true },
      { situation: '设备状态异常（离线、存储不足）', recommended: true },
      { situation: '输入格式错误', recommended: 'mostly' },
      { situation: '内容本来就不存在', recommended: false },
    ],
    whenNotToUse: [
      '不要给用户看「Error 500」「ECONNREFUSED」这种技术信息。',
      '权限错误必须给「去设置」的跳转，而不是只说「权限不足」让用户干瞪眼。',
    ],
    anatomy: [
      { label: 'Icon', labelZh: '图标', note: '警告/断线符号，弱化处理' },
      { label: 'Title', labelZh: '标题', note: '说人话，不报错码' },
      { label: 'Reason', labelZh: '原因', note: '可展开的技术细节' },
      { label: 'Recovery', labelZh: '恢复操作', note: '「重试」「去设置」' },
    ],
    similarPatterns: ['alert', 'empty-state', 'inline-validation'],
    compareWith: 'empty-state',
    aiPrompt: {
      basic: '请求失败了显示错误。',
      detailed:
        '列表加载失败时显示错误态：「没能加载照片」+「请检查网络连接」+「重试」按钮，技术错误码放在可展开的「详细信息」里。',
      implementation:
        '和空状态用同一位置、同样式，但文案不同。标题写人话（「没能加载照片」），副文案给原因和出路，技术错误码放在 <details> 里默认折叠。错误类型分流：网络错误→「重试」；权限拒绝→「去设置」并调起系统设置；404→「这个内容可能已被删除」+「返回」；5xx→「服务暂时不可用」+「重试」+「稍后再试」。重试时显示按钮 loading 态避免重复点击。',
    },
    badPrompt: '加载失败的时候显示错误提示。',
    betterPrompt:
      '错误态写人话标题 + 原因 + 恢复操作：网络错给「重试」、权限错给「去设置」并调起设置、404 给「返回」，技术错误码放 <details> 默认折叠，重试时按钮显示 loading 防重复点击。',
    fitsFor: '网络失败 · 权限 · 服务异常',
    tags: ['恢复', '原因', '重试'],
  },
  {
    id: 'success-state',
    name: 'Success State',
    chineseName: '成功状态',
    aliases: ['成功态', 'success state', '完成状态', '成功页', '完成页'],
    category: 'feedback',
    level: 2,
    appearance: ['always'],
    position: ['center'],
    job: ['status'],
    oneLine: '一个任务彻底完成了——它值得一个专属页面，而不只是转个圈。',
    description:
      '当一个流程走完（订单提交、注册成功、发布完成），给一个完整的成功页面：确认 + 展示成果 + 给出下一步。它和 Toast 的区别是——成功页是停留的，Toast 是路过的。',
    looksLike:
      '「发布成功」大标题 + 刚发的内容预览 + 「查看」和「回到首页」两个按钮。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '一个多步流程的最终完成', recommended: true },
      { situation: '操作产生了一个可见的成果', recommended: true },
      { situation: '用户接下来可能想查看结果', recommended: true },
      { situation: '小操作已完成（保存设置）', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '「已保存」这种小操作弹一个整页成功是杀鸡用牛刀，用 Toast。',
      '成功页应该立即告诉用户「结果在哪」，而不是只说「成功了」。',
    ],
    anatomy: [
      { label: 'Check Icon', labelZh: '成功图标', note: '对勾或轻量插图' },
      { label: 'Title', labelZh: '标题', note: '「发布成功」' },
      { label: 'Result', labelZh: '成果预览', note: '把刚创建的东西显示出来' },
      { label: 'Next Action', labelZh: '下一步', note: '查看 / 返回 / 再来一次' },
    ],
    similarPatterns: ['empty-state', 'toast', 'progress-bar'],
    compareWith: 'empty-state',
    aiPrompt: {
      basic: '操作完成后给个成功页面。',
      detailed:
        '发布成功后显示成功页：绿色对勾 + 「发布成功」+ 刚发布内容的缩略图预览 + 「查看」和「回到首页」两个按钮。',
      implementation:
        '居中布局，最大宽 420px。对勾用 SVG 描边动画（stroke-dashoffset 动画 400ms）。标题 20px medium，下面放成果预览（缩略图或摘要卡片）。底部按钮：「查看」（主按钮，返回刚创建的内容）+「回到首页」（次按钮）。这个页面不应该有浏览器返回（用户返回会重新提交），必要时用 onbeforeunload 拦截。',
    },
    badPrompt: '完成后显示成功页。',
    betterPrompt:
      '流程完成后显示成功页：绿色对勾描边动画 + 「发布成功」+ 刚创建内容的缩略图预览 + 「查看」（主）/「回到首页」（次），并拦截浏览器返回避免重复提交。',
    fitsFor: '发布 · 下单 · 注册完成',
    tags: ['完成', '成果', '下一步'],
  },
];
