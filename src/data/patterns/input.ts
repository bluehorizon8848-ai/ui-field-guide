import type { UIPattern } from '../types';

export const inputPatterns: UIPattern[] = [
  {
    id: 'text-field',
    name: 'Text Field',
    chineseName: '文本输入框',
    aliases: ['输入框', 'text field', 'text input', 'textbox', '单行输入', '输入栏'],
    category: 'input',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['input'],
    oneLine: '一个带边框的框，用户往里面打字。',
    description:
      'Text Field 是最基础的输入组件。好的输入框和差的输入框差别很大：有没有 Label（是「邮箱」还是「请输入您的邮箱地址」）、错误提示出现在哪里、是否支持多行。',
    looksLike:
      '注册页的「邮箱」「密码」、搜索框、笔记 App 里点一下弹出键盘的那一行——都是 Text Field。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '需要用户输入自由文本', recommended: true },
      { situation: '输入内容长度可预知且较长', recommended: true },
      { situation: '需要格式校验（邮箱、手机号）', recommended: true },
      { situation: '选项少于 5 个时', recommended: false },
      { situation: '输入内容不应被记录/展示时', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '密码输入框应该用专门的 Password Field，带显示 / 隐藏切换和强度提示。',
      '要求固定格式的数据（日期、选择）应该用专用组件，别让用户手打。',
    ],
    anatomy: [
      { label: 'Label', labelZh: '标签', note: '位于上方，说明这里填什么' },
      { label: 'Container', labelZh: '输入框', note: '边框 1px，圆角 8px，高度 44px' },
      { label: 'Placeholder', labelZh: '占位文字', note: '不可替代 Label' },
      { label: 'Helper Text', labelZh: '辅助说明', note: '下方常驻，如密码规则' },
      { label: 'Error State', labelZh: '错误态', note: '红边 + 下方红字说明' },
    ],
    similarPatterns: ['text-area', 'search-field', 'select', 'inline-validation'],
    compareWith: 'text-area',
    aiPrompt: {
      basic: '加个输入框。',
      detailed:
        '加一个邮箱输入框：上方 Label「邮箱」，下方常驻辅助文字「用于接收通知」，失焦时校验格式，错误时红边 + 下方红字说明。',
      implementation:
        '<div> 内含 <label>（14px，#4A4740）+ <input type="email">。输入框高 44px，边框 1px #E6E3DB，圆角 8px，padding 12px，focus 时边框变 #1A1917 且加 3px 半透明外发光。placeholder 用 #7A766D 且不可替代 label。校验在 blur 时触发，错误态：边框 #A8342C + 下方 13px 红字「请输入有效的邮箱地址」，并加 aria-invalid="true" 与 aria-describedby 指向错误文本。',
    },
    badPrompt: '加个能打字的框。',
    betterPrompt:
      '加邮箱 Text Field：上方 Label「邮箱」（placeholder 不能替代 label），blur 时校验，错误时红边 #A8342C + 下方红字说明 + aria-invalid。',
    fitsFor: '表单 · 搜索 · 编辑内容',
    tags: ['输入', '校验', 'label'],
  },
  {
    id: 'text-area',
    name: 'Text Area',
    chineseName: '多行输入框',
    aliases: ['多行输入', 'textarea', 'text area', '长文本输入', '留言框'],
    category: 'input',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['input'],
    oneLine: '一个能换行的输入框，用来写长一点的内容。',
    description:
      'Text Area 和 Text Field 的区别只有一条：它的高度可变，能容纳段落。它的关键设计点是「不要只给一个默认矮框」——用户看到两行的高度，会以为只能写两行。',
    looksLike:
      '评论框、留言板输入框、笔记 App 里的正文编辑区、GitHub 的 Issue 描述框——都是 Text Area。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '输入内容是段落级别（评论、备注、描述）', recommended: true },
      { situation: '不确定用户要写多长', recommended: true },
      { situation: '需要显示格式预览（Markdown）', recommended: true },
      { situation: '只填 1 个字符（如验证码）', recommended: false },
    ],
    whenNotToUse: [
      '默认高度给 2 行会让长文作者望而却步——给 4–6 行并支持自动增长。',
      '在移动端它会和键盘遮挡打架，记得预留滚动空间。',
    ],
    anatomy: [
      { label: 'Container', labelZh: '容器', note: '高度可调，min-height 96px' },
      { label: 'Placeholder', labelZh: '占位文字', note: '给一个真实的示例句子' },
      { label: 'Resize Handle', labelZh: '缩放手柄', note: 'Web 端右下角可拖拽' },
      { label: 'Counter', labelZh: '字数统计', note: '右下角显示「128 / 500」' },
    ],
    similarPatterns: ['text-field', 'search-field', 'inline-validation'],
    compareWith: 'text-field',
    aiPrompt: {
      basic: '加个能打多行的输入框。',
      detailed:
        '加一个评论输入框：最小高度 4 行，随内容自动增高，右下角显示「0 / 300」字数统计，聚焦时显示操作按钮。',
      implementation:
        '<textarea> 设置 min-height: 96px; max-height: 320px; resize: vertical; width: 100%。用 JS 做 auto-grow：input 事件时 el.style.height = "auto" 再取 scrollHeight，变化超过阈值才赋值避免抖动。右下角 12px 灰色小字显示「{len} / 300」，超过 280 字时变警告色 #94701C，达到 300 时禁用提交。失焦时若为空则显示错误提示。移动端在聚焦时把底部工具栏上移，避免被键盘遮挡。',
    },
    badPrompt: '加一个大点的输入框。',
    betterPrompt:
      '加多行 Text Area：min-height 4 行 + auto-grow（上限 320px），右下角「0 / 300」字数统计，接近上限时变色。',
    fitsFor: '评论 · 备注 · 描述',
    tags: ['长文本', '自动增高', '字数'],
  },
  {
    id: 'search-field',
    name: 'Search Field',
    chineseName: '搜索框',
    aliases: ['搜索栏', 'search field', 'search bar', 'search input', '搜索输入'],
    category: 'input',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['input', 'navigate'],
    oneLine: '一个专门用来找东西的输入框，通常带放大镜图标和清除按钮。',
    description:
      'Search Field 是有状态的输入框：它不仅接收文字，还要负责展示结果、处理空结果、处理搜索历史。它和普通输入框的最大区别在于「边打边搜」和「可清除」。',
    looksLike:
      'App 首页顶部那个带放大镜的胶囊形输入框、电商App 搜索页顶部的搜索条、Mac  Spotlight 弹出的搜索框。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '内容超过 30 项且用户知道要找什么', recommended: true },
      { situation: '需要边输入边出结果', recommended: true },
      { situation: '搜索范围是结构化的（按类型/标签筛）', recommended: true },
      { situation: '内容只有 5 项且都能看见', recommended: false },
      { situation: '用户根本不知道自己要找什么（探索型浏览）', recommended: false },
    ],
    whenNotToUse: [
      '搜索框在空状态下应该给出「热门搜索 / 最近搜索 / 分类入口」，不然它就是一根空输入框。',
      '搜索结果为零时，必须给替代路径（清空筛选、看全部）。',
    ],
    anatomy: [
      { label: 'Search Icon', labelZh: '放大镜', note: '左侧 16px 图标' },
      { label: 'Input', labelZh: '输入区', note: '背景用浅灰区分于普通输入框' },
      { label: 'Clear Button', labelZh: '清除', note: '有文字时出现 X 图标' },
      { label: 'Results', labelZh: '结果列表', note: '下拉展示，键盘可上下选' },
      { label: 'Empty State', labelZh: '空结果', note: '提供热门词或建议' },
    ],
    similarPatterns: ['text-field', 'select', 'search-field', 'chip'],
    compareWith: 'text-field',
    aiPrompt: {
      basic: '加个搜索框。',
      detailed:
        '加一个搜索框：左侧放大镜，输入时 300ms 防抖实时出结果，右侧有清除按钮，空状态显示热门搜索标签。',
      implementation:
        '容器 position: relative，放大镜绝对定位在左 12px，input padding-left: 36px。有文字时右侧出现 X 按钮（aria-label="清除"）。防抖 300ms + AbortController 取消上一次请求。输入框聚焦时下方弹出结果面板，↑↓ 可移动高亮、Enter 选中、Esc 关闭。空状态（无输入或无结果）显示热门搜索 Chip，点击直接填入。',
    },
    badPrompt: '加个能搜索的东西。',
    betterPrompt:
      '加 Search Field：左侧放大镜图标、300ms 防抖实时出结果、有文字时右侧出现清除按钮、空状态显示热门搜索 Chip、↑↓ 可选结果。',
    fitsFor: '内容检索 · 筛选定位',
    tags: ['检索', '防抖', '空状态'],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    chineseName: '复选框',
    aliases: ['复选框', '勾选框', 'checkbox', '多选框', '对勾框'],
    category: 'input',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['select', 'confirm'],
    oneLine: '一个可以打勾的小方框，用于从多个选项里选任意几个。',
    description:
      'Checkbox 的语义是「独立的开关」：勾了它不影响旁边那个。它和 Radio 的区别不在外观，而在逻辑——一个允许多选，一个只能单选。',
    looksLike:
      '购物车每行左边的方框、设置页「允许通知」前面的勾、Todo 列表每项前面的圆框。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '从多个选项中选任意几个', recommended: true },
      { situation: '需要「全选」', recommended: true },
      { situation: '一个独立的开关（启用某功能）', recommended: true },
      { situation: '选项互斥、只能选一个', recommended: false },
      { situation: '点击后立即生效的危险操作', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '「同意服务条款」这种必须确认的声明用 Checkbox 可以，但它不是「同意就继续」的好替代品。',
      '在移动端，Checklist 里每项最好整行可点（Row 级热区），只让 16px 的小方框可点会很难操作。',
    ],
    anatomy: [
      { label: 'Box', labelZh: '方框', note: '18–20px，边框 1.5px' },
      { label: 'Check Mark', labelZh: '对勾', note: '选中时出现，可带动画' },
      { label: 'Label', labelZh: '文字', note: '与方框同基线左对齐' },
      { label: 'Indeterminate', labelZh: '半选态', note: '部分选中时显示横线' },
      { label: 'Disabled', labelZh: '禁用态', note: '已勾选但不可改' },
    ],
    similarPatterns: ['radio', 'switch', 'checkbox'],
    compareWith: 'radio',
    aiPrompt: {
      basic: '加几个可以勾选的框。',
      detailed:
        '加一个带全选的复选框列表：顶部「全选」支持半选态，每行文字整行可点，右侧显示已选数量。',
      implementation:
        '每项用 <label> 包裹 input[type=checkbox] + 文字，让整行成为热区。「全选」checked 由子项推导：全选中=true，部分选中=true 且 indeterminate=true（通过 ref 设置 DOM 属性）。半选时方框显示横线而非对勾。列表顶部实时显示「已选 3 项」。移动端把 label padding 撑到 44px 高。',
    },
    badPrompt: '加几个能打勾的选项。',
    betterPrompt:
      '加 Checkbox 列表：整行可点（label 包裹），支持「全选」的 indeterminate 半选态，顶部实时显示已选数量，选项区高度 ≥44px 便于移动端点击。',
    fitsFor: '多选 · 批量操作 · 同意条款',
    tags: ['多选', '全选', '半选'],
    comparisonSlug: 'checkbox-vs-radio-vs-switch',
  },
  {
    id: 'radio',
    name: 'Radio Button',
    chineseName: '单选按钮',
    aliases: ['单选框', 'radio button', 'radio', '单选按钮', '圆点选择'],
    category: 'input',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['select'],
    oneLine: '一排圆点，选中其中一个。选了一个，另一个自动取消。',
    description:
      'Radio 的价值是「互斥」。它比下拉框更快（所有选项都可见，一眼扫完），但会占用垂直空间。选项少于 5 个时它通常比 Select 更好。',
    looksLike:
      '登录页的「个人 / 企业」两个圆点、照片尺寸选择里的圆形单选、支付方式列表前面的圆圈。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '2–5 个互斥选项', recommended: true },
      { situation: '所有选项都需要用户看到并比较', recommended: true },
      { situation: '每个选项带描述文字', recommended: true },
      { situation: '选项超过 7 个', recommended: false },
      { situation: '需要「不选」（可跳过）', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Radio 一旦选中就必须选一个。如果「跳过」是合法选项，请加一个「以上都不是」的单选项，或改用 Select。',
      '选项超过 7 个请改用 Select Dropdown，否则页面会被撑得很长。',
    ],
    anatomy: [
      { label: 'Circle', labelZh: '圆圈', note: '18px，外圈 1.5px' },
      { label: 'Dot', labelZh: '内点', note: '选中时显示实心圆' },
      { label: 'Label', labelZh: '文字', note: '主标题 + 可选描述' },
      { label: 'Group', labelZh: '分组', note: '用 fieldset + legend 包裹' },
    ],
    similarPatterns: ['checkbox', 'switch', 'segmented-control', 'select'],
    compareWith: 'checkbox',
    aiPrompt: {
      basic: '加几个单选按钮。',
      detailed:
        '加一组单选按钮：个人 / 企业。每个选项下方有一行说明文字，整行可点，选中项内点变实心。',
      implementation:
        '用 <fieldset> + <legend> 包裹整个组（legend 不可见或作为组标题）。每个选项 <label> 内含 input[type=radio] name="accountType" + 内容。整行 padding 12px，圆角 8px，hover 背景 #F2F0EB。选中时内点用 scale 动画从 0 展开。键盘：↑↓ 在同组内移动并自动选中，Tab 只在组内第一个可停留一次。必须有默认值，不要让用户面对全空的必填组。',
    },
    badPrompt: '加几个圆点让用户选一个。',
    betterPrompt:
      '加 Radio 组（个人 / 企业）：用 fieldset+legend 包裹，每项整行可点并带说明文字，选项间 padding 12px，↑↓ 键可切换，必须有默认选中项。',
    fitsFor: '二选一 · 方案选择 · 设置项',
    tags: ['互斥', '单选', '可见选项'],
    comparisonSlug: 'checkbox-vs-radio-vs-switch',
  },
  {
    id: 'switch',
    name: 'Switch',
    chineseName: '开关',
    aliases: ['开关', 'switch', 'toggle', '切换开关', '拨动开关', 'toggle switch'],
    category: 'input',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['confirm', 'select'],
    oneLine: '一个左右滑动的开关，一开一关，状态永远摆在明面上。',
    description:
      'Switch 传达的是「这个功能现在是开着的还是关着的」。它和 Checkbox 的区别是：Checkbox 是「勾了这个动作」，Switch 是「这个状态开着」。Checkbox 通常在提交时生效，Switch 立即生效。',
    looksLike:
      '设置页里「深色模式」「通知开关」那一行右端的滑块、iOS 设置里所有绿色的圆角开关、App 设置里的「自动播放视频」。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'easy',
    whenToUse: [
      { situation: '一个功能的开/关状态，切换立即生效', recommended: true },
      { situation: '状态需要一眼可见', recommended: true },
      { situation: '开关状态本身有意义（开=省电模式）', recommended: true },
      { situation: '需要用户「确认后才生效」', recommended: false },
      { situation: '这个勾选需要随表单一起提交', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Switch 不用解释「开」和「关」的意思——那说明它不适合用 Switch，改用 Checkbox + 明确文案。',
      '切换后有重要后果（关掉会丢数据）时，Switch 本身要配合确认或 Undo。',
    ],
    anatomy: [
      { label: 'Track', labelZh: '轨道', note: '40×24px，开启时变主色' },
      { label: 'Thumb', labelZh: '滑块', note: '20px 圆，拖动时有阴影' },
      { label: 'Label', labelZh: '文字', note: '描述这个功能而非状态' },
      { label: 'State Label', labelZh: '状态文字', note: '可选，「开 / 关」' },
    ],
    similarPatterns: ['checkbox', 'radio', 'segmented-control'],
    compareWith: 'checkbox',
    aiPrompt: {
      basic: '加个开关。',
      detailed:
        '加一个设置项：左侧标题「深色模式」+ 一行说明，右侧 Switch。切换立即生效并显示 Toast 确认。',
      implementation:
        'button role="switch" aria-checked={on}，放在 label 文字右侧。轨道 44×26px 圆角全满，未开启 #D8D5CD，开启 #2C7355，滑块 22px 白色带 shadow，位移 18px。切换动画 180ms cubic-bezier。整行可点。切换时立即写系统设置并弹 Toast「已开启深色模式」；若切换会导致数据丢失，先弹确认 Dialog。禁用时整体降到 40% 不透明度并加 disabled。',
    },
    badPrompt: '加个能开能关的东西。',
    betterPrompt:
      '加 Switch 设置项：role="switch" + aria-checked，44×26px 轨道、22px 滑块、切换立即生效并弹 Toast 确认，整行可点，不用 Checkbox 语义。',
    fitsFor: '设置项 · 功能开关 · 模式切换',
    tags: ['开/关', '立即生效', '状态可见'],
    comparisonSlug: 'checkbox-vs-radio-vs-switch',
  },
  {
    id: 'slider',
    name: 'Slider',
    chineseName: '滑块',
    aliases: ['滑块', 'slider', 'range slider', '拖动条', '进度调节', 'range'],
    category: 'input',
    level: 1,
    appearance: ['always'],
    position: ['inline'],
    job: ['input', 'select'],
    oneLine: '一条可以左右拖动的轨道，拖动就能得到一个数值。',
    description:
      'Slider 适合「在连续或离散的区间里找一个值」——音量、亮度、滤镜强度。但它有一个致命弱点：精确值看不见也点不准，所以必须同时显示当前数值。',
    looksLike:
      '手机屏幕上的亮度条、相机 App 的对焦滑块、图片编辑里的「滤镜强度」、Mac 触控板设置里的拖动条。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '在连续区间内取值（0–100）', recommended: true },
      { situation: '用户需要「大概调到某个感觉」而非精确值', recommended: true },
      { situation: '调整结果可以实时预览', recommended: true },
      { situation: '需要输入精确数值', recommended: false },
      { situation: '区间的两端语义完全不同', recommended: false },
    ],
    whenNotToUse: [
      '必须精确到 87% 时，Slider 不如「输入框 + 步进按钮」。',
      '别忘了给 Slider 一个数值显示和一个可键盘操作的方式，否则无障碍就废了。',
    ],
    anatomy: [
      { label: 'Track', labelZh: '轨道', note: '3px 圆角细线，灰底' },
      { label: 'Filled', labelZh: '已选段', note: '已过部分染色' },
      { label: 'Thumb / Handle', labelZh: '滑块', note: '18px 圆，拖动时放大到 22px' },
      { label: 'Value Label', labelZh: '数值', note: '显示当前值' },
      { label: 'Bounds', labelZh: '起止标注', note: '两端含义（淡/浓）' },
    ],
    similarPatterns: ['progress-bar', 'stepper', 'segmented-control'],
    compareWith: 'progress-bar',
    aiPrompt: {
      basic: '加个可以拖动的滑块。',
      detailed:
        '加一个滤镜强度滑块：0–100，右侧实时显示数值，拖动时上方显示预览缩略图，键盘左右键每次调 5。',
      implementation:
        '用 <input type="range" min=0 max=100 value> 并完全自定义样式：::-webkit-slider-thumb 设为 18px 白色圆 + shadow，focus/active 时放大到 22px。轨道用 background linear-gradient 按百分比染色。右侧固定宽度 44px 显示数值（tabular-nums 防跳动）。键盘：←/↓ 减 5，→/↑ 加 5，Home/End 到两端，PageUp/Down 调 10。拖动中用 onInput 实时更新预览，松手才提交。',
    },
    badPrompt: '加个能拖的条。',
    betterPrompt:
      '加 Slider（0–100）：右侧固定宽度显示数值（tabular-nums），拖动中实时预览、松手才提交，键盘 ←/→ 每次调 5，Home/End 到两端。',
    fitsFor: '音量 · 亮度 · 滤镜强度',
    tags: ['连续值', '实时预览', '键盘'],
  },
  {
    id: 'select',
    name: 'Select',
    chineseName: '下拉选择器',
    aliases: ['下拉菜单', 'select', 'dropdown', '选择器', '下拉框', 'select box'],
    category: 'input',
    level: 1,
    appearance: ['on-click'],
    position: ['inline'],
    job: ['select'],
    oneLine: '一个框，点开后向下展开一列选项，选完就收起。',
    description:
      'Select 是「空间换清晰度」的组件：收起时只占一行高度，展开时所有选项可看。选项少于 5 个时直接用 Radio 比它更好——因为 Select 要点两次。',
    looksLike:
      '表单里的「请选择城市」、Excel 的单元格下拉、各类设置里的下拉选择框。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '选项超过 5 个，全部列出太长', recommended: true },
      { situation: '选项之间是平级的', recommended: true },
      { situation: '需要搜索（选项 20+）', recommended: true },
      { situation: '选项少于 5 个', recommended: false },
      { situation: '需要多选', recommended: false },
    ],
    whenNotToUse: [
      '移动端的原生 Select 会调起系统选择器，体验与 Web 差异大，注意适配。',
      '选完一个值后需要用户理解「为什么改变了界面」时，Select 缺少上下文说明。',
    ],
    anatomy: [
      { label: 'Trigger', labelZh: '触发框', note: '显示当前值 + ChevronDown' },
      { label: 'Menu', labelZh: '弹出层', note: '跟随触发框定位' },
      { label: 'Option', labelZh: '选项', note: '高 40px，选中项加 Check' },
      { label: 'Search', labelZh: '选项内搜索', note: '选项多时必备' },
      { label: 'Group', labelZh: '选项分组', note: '用分隔线分组' },
    ],
    similarPatterns: ['radio', 'segmented-control', 'search-field', 'select'],
    compareWith: 'radio',
    aiPrompt: {
      basic: '加个下拉选择框。',
      detailed:
        '加一个城市选择下拉框：选项 30+ 个，展开后顶部有搜索框，已选项显示在触发框里并带 Check 标记。',
      implementation:
        'button[aria-haspopup="listbox"] 作为触发框，展开时用 Popover 定位在下方。菜单 role="listbox"，选项 role="option" aria-selected。↑↓ 移动、Enter 选中、Esc 关闭并把焦点还给触发框、Home/End 到首尾。选项 >15 个时加顶部搜索输入框并自动聚焦。当屏高不足时菜单向上展开（自动翻转）。点击外部关闭。触发框高度 44px。',
    },
    badPrompt: '加个可以选的下拉框。',
    betterPrompt:
      '加 Select：button[aria-haspopup=listbox] 作触发框，菜单 role=listbox + 选项 aria-selected，↑↓/Enter/Esc 键盘可用，选项多时加搜索框，靠近屏幕底部时菜单向上翻转。',
    fitsFor: '表单 · 大量选项 · 筛选',
    tags: ['折叠选项', '键盘', '弹出'],
  },
  {
    id: 'chip',
    name: 'Chip',
    chineseName: '标签',
    aliases: ['标签', 'chip', 'tag', '标签片', '胶囊', 'pill', 'filter chip'],
    category: 'input',
    level: 2,
    appearance: ['always'],
    position: ['inline'],
    job: ['select', 'status'],
    oneLine: '一个小圆角的胶囊，里面放几个字，可以选中也可以只是显示。',
    description:
      'Chip 有两种截然不同的用法，容易混：Input Chip 是可点的（可筛选、可选、可删除），Display Chip 是只读的标签（分类、状态）。UI 里看到胶囊，先判断它能不能点。',
    looksLike:
      '小红书话题标签、GitHub 的 label、搜索页上方的筛选胶囊、输入框里已经选好的「关键词 ✕」。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '多选筛选（可同时激活多个条件）', recommended: true },
      { situation: '展示内容的分类或状态', recommended: true },
      { situation: '输入框里展示已选标签，可删除', recommended: true },
      { situation: '表示一个主要操作', recommended: false },
      { situation: '代替按钮做页面跳转', recommended: false },
    ],
    whenNotToUse: [
      'Chip 不带关闭按钮时无法取消，用户会困在筛选里——可筛选的 Chip 必须可取消。',
      '不要用 Chip 堆太多可选项，它会挤成一片让人不知道点哪。',
    ],
    anatomy: [
      { label: 'Container', labelZh: '胶囊体', note: '全圆角，padding 6px 12px' },
      { label: 'Label', labelZh: '文字', note: '12–14px' },
      { label: 'Selected', labelZh: '选中态', note: '填充主色或加勾' },
      { label: 'Remove', labelZh: '删除', note: '输入场景的 ✕' },
    ],
    similarPatterns: ['badge', 'segmented-control', 'select', 'file-upload'],
    compareWith: 'badge',
    aiPrompt: {
      basic: '加几个小标签。',
      detailed:
        '加一组可筛选的 Chip：全部 / 人像 / 风景 / 夜景，可多选，选中态填充主色，筛选结果实时更新。',
      implementation:
        '每个 Chip 是 <button role="checkbox" aria-checked> 或一组 radio（若为单选）。未选：背景 #F2F0EB 文字 #4A4740；选中：背景 #1A1917 文字白色。切换时用 React state，筛选逻辑在父组件。筛选类 Chip 必须可取消（再点一次回到「全部」）。Chip 组横向排列、flex-wrap、间距 8px。',
    },
    badPrompt: '加几个标签。',
    betterPrompt:
      '加一组可筛选 Chip（可多选）：未选浅灰底、选中深色填充并同步 aria-checked，再点一次可取消，筛选结果实时更新。',
    fitsFor: '筛选 · 分类 · 已选标签',
    tags: ['胶囊', '可筛选', '多选'],
  },
  {
    id: 'date-picker',
    name: 'Date Picker',
    chineseName: '日期选择器',
    aliases: ['日期选择', 'date picker', 'calendar picker', '日历选择', 'date field'],
    category: 'input',
    level: 2,
    appearance: ['on-click'],
    position: ['overlay'],
    job: ['select', 'input'],
    oneLine: '一个日历，点开可以选日子。',
    description:
      'Date Picker 的难点不是「弹出日历」，而是让用户理解「哪些日子能选」。出生日期不能选未来、已过去的日期要置灰、跨度范围要说明——这些约束必须在日历上直接可见。',
    looksLike:
      '订机票时选出发日期、预约挂号选就诊日、统计后台选日期范围——点一下弹出的月历。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '用户需要选择一个具体日期', recommended: true },
      { situation: '日期有合法性约束（不能选过去）', recommended: true },
      { situation: '选错代价高（预约、租期、账单）', recommended: true },
      { situation: '需要选一段范围', recommended: 'mostly' },
      { situation: '只需要大概的月份/年份', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '单纯为了「填个日期」而让用户点两次日历，很多场景不如让文本框接受 2026-03-15 这种格式。',
      '记住：别让用户为格式报错。允许多种输入，错了再提示。',
    ],
    anatomy: [
      { label: 'Trigger', labelZh: '触发框', note: '显示已选日期或占位' },
      { label: 'Calendar', labelZh: '月历', note: '7×6 网格' },
      { label: 'Valid / Disabled', labelZh: '可选/禁用日', note: '禁用日置灰不可点' },
      { label: 'Selected', labelZh: '选中日', note: '填充主色' },
      { label: 'Range Highlight', labelZh: '区间高亮', note: '范围选择时高亮中间' },
    ],
    similarPatterns: ['text-field', 'select', 'popover'],
    compareWith: 'select',
    aiPrompt: {
      basic: '加个日期选择器。',
      detailed:
        '加一个日期选择器：默认今天，不能选过去日期，弹出的月历里过去的日期置灰不可点，选中后回填到输入框。',
      implementation:
        '触发框 <input type="date"> 或自定义 button + popover 日历。日历 7 列 × 6 行，header 显示「2026 年 3 月」带左右切换箭头。不可选日期加 disabled + 40% 不透明度。选中日填充 #1A1917 白色文字。今天加一圈描边标记。点击选择后关闭日历并回填输入框，格式化为「2026-03-15」。键盘：方向键移动日期、Enter 选中、Esc 关闭。',
    },
    badPrompt: '加个选日期的。',
    betterPrompt:
      '加 Date Picker：默认今天、过去的日期置灰禁用不可点、选中日填充主色、今天加描边标记，键盘方向键可移动、Enter 选中、Esc 关闭。',
    fitsFor: '预约 · 租期 · 账单 · 出行',
    tags: ['日期', '约束', '日历'],
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    chineseName: '文件上传',
    aliases: ['上传', 'file upload', '上传区', '拖拽上传', 'upload', '附件上传'],
    category: 'input',
    level: 2,
    appearance: ['always'],
    position: ['inline'],
    job: ['input', 'create'],
    oneLine: '让用户把文件从设备弄到你的应用里。',
    description:
      '文件上传真正的难点是「上传中」和「上传失败」这两段。上传成功用户看得见，失败却常常被忽略。一个合格的上传组件必须有：进度、取消、失败重试、格式大小限制提示。',
    looksLike:
      '微信聊天里选择图片、相册 App 导入照片、后台的「上传头像」框、网页表单里的虚线拖拽框。',
    platforms: ['web', 'mobile', 'desktop'],
    difficulty: 'medium',
    whenToUse: [
      { situation: '需要接收图片、文档、媒体文件', recommended: true },
      { situation: '支持拖拽和点击选择两种方式', recommended: true },
      { situation: '大文件需要显示进度和可取消', recommended: true },
      { situation: '只需一张图（头像、封面）', recommended: 'mostly' },
    ],
    whenNotToUse: [
      '移动端记得申请相册/文件权限，权限拒绝时要有解释和设置入口。',
      '一定要提前告知格式和大小限制，别让用户传完 5 分钟才被拒。',
    ],
    anatomy: [
      { label: 'Drop Zone', labelZh: '拖拽区', note: '虚线框，支持点击和拖放' },
      { label: 'File List', labelZh: '文件列表', note: '缩略图 + 名称 + 大小' },
      { label: 'Progress', labelZh: '上传进度', note: '进度条 + 百分比' },
      { label: 'Cancel / Retry', labelZh: '取消/重试', note: '进行中可取消，失败可重试' },
      { label: 'Constraint', labelZh: '限制说明', note: '格式、大小、数量' },
    ],
    similarPatterns: ['progress-bar', 'button', 'file-upload', 'avatar'],
    compareWith: 'progress-bar',
    aiPrompt: {
      basic: '加个上传图片的功能。',
      detailed:
        '加一个图片上传区：支持点击和拖拽，只接受 jpg/png，单张不超过 10MB，上传时显示缩略图和进度条，可取消和重试。',
      implementation:
        '拖拽区虚线 2px dashed #D8D5CD，拖入时高亮为 #1A1917。accept="image/jpeg,image/png"，前端先校验 size ≤10MB 再发请求，失败时在文件项上显示红色错误「文件超过 10MB」+「重新上传」链接。每个文件项含缩略图 48×48、文件名、大小、进度条（已上传/总大小）和「✕」取消按钮。用 XMLHttpRequest 而非 fetch 以获取 upload.onprogress 进度。',
    },
    badPrompt: '加个上传按钮可以传文件。',
    betterPrompt:
      '加文件上传区：支持点击和拖拽，accept 限定格式，前端预校验大小，每个文件显示缩略图 + 进度条 + 取消按钮，失败可重试，提前说明格式和大小限制。',
    fitsFor: '图片 · 文档 · 媒体导入',
    tags: ['文件', '进度', '失败态'],
  },
];
