export type TermCategory = 'interaction' | 'a11y' | 'visual' | 'architecture';

export interface ExternalLink {
  label: string;
  url: string;
  type: 'mdn' | 'w3c' | 'apple' | 'google' | 'webdev';
}

export interface TermItem {
  id: string;
  term: string;
  termZh?: string;
  aliases: string[];
  category: TermCategory;
  /** 用人话讲：给小白的一句话极简通俗解释 */
  plainExplanation: string;
  /** 为什么重要 / 跟 AI 提需求时该怎么用 */
  whyItMatters: string;
  /** 关联的本站组件 ID */
  relatedPatternId?: string;
  /** 外部权威参考或搜索链接 */
  links: ExternalLink[];
}

export interface TermCategoryMeta {
  id: TermCategory;
  name: string;
  nameZh?: string;
  desc: string;
}

export const TERM_CATEGORIES: TermCategoryMeta[] = [
  {
    id: 'interaction',
    name: '交互与手势',
    nameZh: '交互与手势',
    desc: '滑动手感、拖拽吸附、点击与触发逻辑等动态交互规范。',
  },
  {
    id: 'a11y',
    name: '无障碍 (a11y)',
    nameZh: '无障碍 (a11y)',
    desc: '键盘操作、屏幕阅读器、焦点控制与防误触规范。',
  },
  {
    id: 'visual',
    name: '视觉与动效',
    nameZh: '视觉与动效',
    desc: '骨架扫光、缓动曲线、毛玻璃材质与微交互细节。',
  },
  {
    id: 'architecture',
    name: '状态与前端架构',
    nameZh: '状态与前端架构',
    desc: '乐观更新、防抖节流、布局抖动等界面生命周期与性能概念。',
  },
];

export const TERMS_DATA: TermItem[] = [
  {
    id: 'snap-points',
    term: 'Snap Points',
    termZh: '多档吸附点 / 停靠分段',
    aliases: ['吸附点', 'Snap points', '分段停靠点', '分档停靠'],
    category: 'interaction',
    plainExplanation: '像抽屉拉到一半或全开时自带的「机械卡扣」，滑动松手后会自动吸附到固定高度（如 50% 半屏或 90% 全屏）。',
    whyItMatters: '在做移动端底部抽屉（Bottom Sheet）时，如果不加 Snap Points，抽屉停在任意尴尬高度，界面会非常松散难用。告诉 AI「支持 50% 与 90% 两档 Snap Points」，AI 就知道用专业组件库。',
    relatedPatternId: 'bottom-sheet',
    links: [
      {
        label: 'MDN: CSS Scroll Snap Points',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap',
        type: 'mdn',
      },
      {
        label: 'Apple HIG: Sheets Presentation',
        url: 'https://developer.apple.com/design/human-interface-guidelines/sheets',
        type: 'apple',
      },
      {
        label: 'Google 搜索 "Snap Points UI"',
        url: 'https://www.google.com/search?q=Snap+Points+UI+design',
        type: 'google',
      },
    ],
  },
  {
    id: 'drag-handle',
    term: 'Drag Handle',
    termZh: '拖拽把手 / 指示条',
    aliases: ['拖拽手柄', '把手', '指示条', 'Drag handle', '抓手'],
    category: 'interaction',
    plainExplanation: '抽屉或卡片顶部那根细细的浅灰色圆角横条，用视觉暗示用户「这里可以用手指上下拖动」。',
    whyItMatters: '移动端的重要视觉线索（Affordance）。没有把手，用户往往不知道抽屉能往下拉。向 AI 提需求时加上「顶部带居中的 Drag Handle」，组件质感立刻提升。',
    relatedPatternId: 'bottom-sheet',
    links: [
      {
        label: 'Apple HIG: Grabber Handle',
        url: 'https://developer.apple.com/design/human-interface-guidelines/sheets',
        type: 'apple',
      },
      {
        label: 'Google 搜索 "Drag handle UI pattern"',
        url: 'https://www.google.com/search?q=Drag+handle+UI+pattern',
        type: 'google',
      },
    ],
  },
  {
    id: 'focus-trap',
    term: 'Focus Trap',
    termZh: '焦点锁定 / 焦点捕获',
    aliases: ['焦点捕获', 'Focus trap', '键盘焦点限制'],
    category: 'a11y',
    plainExplanation: '弹窗打开时，用户按键盘 Tab 键切换焦点，光标只能在弹窗内部的按钮之间循环，绝对不会飘到弹窗背后的页面上。',
    whyItMatters: '专业前端与业余切图的分水岭。没有 Focus Trap 的弹窗，按 Tab 键会不小心触发背景里的删除按钮！向 AI 强调「带 Focus Trap」，AI 会引入 Radix 或专用 hook 防御此 Bug。',
    relatedPatternId: 'modal',
    links: [
      {
        label: 'W3C WAI-ARIA: Dialog Modal Pattern',
        url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
        type: 'w3c',
      },
      {
        label: 'MDN: Keyboard Focus in Modals',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role',
        type: 'mdn',
      },
    ],
  },
  {
    id: 'aria',
    term: 'ARIA / a11y',
    termZh: '无障碍无障碍属性规范',
    aliases: ['ARIA', 'a11y', '无障碍', 'Accessibility'],
    category: 'a11y',
    plainExplanation: '写给盲人读屏软件和辅助设备的 HTML 特殊标签（如 aria-expanded、aria-hidden），让看不见屏幕的人也能听懂界面。',
    whyItMatters: '好的开源组件库（如 Radix、shadcn、ArkUI）的核心价值就在于完整的 ARIA 状态。告诉 AI「确保 ARIA 属性与键盘可访问性完整」，AI 会自动输出更严谨的语义化代码。',
    links: [
      {
        label: 'MDN: Accessibility (a11y) Overview',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
        type: 'mdn',
      },
      {
        label: 'W3C: ARIA Authoring Practices Guide',
        url: 'https://www.w3.org/WAI/ARIA/apg/',
        type: 'w3c',
      },
    ],
  },
  {
    id: 'backdrop',
    term: 'Backdrop / Overlay',
    termZh: '半透明背景遮罩',
    aliases: ['遮罩层', '蒙层', 'Backdrop', 'Overlay', '背景遮罩'],
    category: 'visual',
    plainExplanation: '弹窗或抽屉弹出时，垫在背后把页面变暗（或加毛玻璃模糊）的那层深色半透明幕布，让用户聚焦在前景内容上。',
    whyItMatters: '两个核心细节需对 AI 明确：1) 透明度与模糊度（如 bg-black/40 backdrop-blur-sm）；2) 点击遮罩层是否自动关闭当前浮层。',
    relatedPatternId: 'modal',
    links: [
      {
        label: 'MDN: ::backdrop CSS Pseudo-element',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop',
        type: 'mdn',
      },
      {
        label: 'Google 搜索 "Modal backdrop best practices"',
        url: 'https://www.google.com/search?q=Modal+backdrop+best+practices',
        type: 'google',
      },
    ],
  },
  {
    id: 'touch-target',
    term: 'Touch Target (44px)',
    termZh: '触控热区规范 (44px)',
    aliases: ['触控区域', '44px', '点击热区', 'Touch Target', '最小点击范围'],
    category: 'interaction',
    plainExplanation: '人手指尖在触屏上的接触面积大约是 9 毫米。手机界面的可点击元素（按钮、图标）尺寸或热区至少要达到 44×44 像素，否则极难点准。',
    whyItMatters: '很多新手设计的图标按钮只有 16px 或 20px，在手机上戳三次都戳不中。告诉 AI「所有交互元素遵守 44px 最小触控热区（min-h-[44px] min-w-[44px]）」，移动端体验瞬间及格。',
    relatedPatternId: 'icon-button',
    links: [
      {
        label: 'Apple HIG: Touch Target Size',
        url: 'https://developer.apple.com/design/human-interface-guidelines/inputs',
        type: 'apple',
      },
      {
        label: 'web.dev: Accessible Tap Targets',
        url: 'https://web.dev/accessible-tap-targets/',
        type: 'webdev',
      },
    ],
  },
  {
    id: 'shimmer-effect',
    term: 'Shimmer Effect',
    termZh: '骨架扫光 / 呼吸微动效',
    aliases: ['扫光动效', '骨架屏扫光', 'Shimmer', '微光动效'],
    category: 'visual',
    plainExplanation: '骨架屏（Skeleton）加载时，一道浅灰色的光带从左往右缓缓滑过的微弱动画，像水面反光一样。',
    whyItMatters: '相比死板的静态灰块，扫光动效能让用户潜意识觉得「系统正在高速处理，内容马上就出」，大大降低等待的焦虑感。告诉 AI「给 Skeleton 加上轻柔的 CSS Shimmer 动效」。',
    relatedPatternId: 'skeleton',
    links: [
      {
        label: 'Google 搜索 "Skeleton shimmer animation CSS"',
        url: 'https://www.google.com/search?q=Skeleton+shimmer+animation+CSS',
        type: 'google',
      },
    ],
  },
  {
    id: 'cls',
    term: 'Layout Shift (CLS)',
    termZh: '累积布局偏移 / 页面跳动',
    aliases: ['CLS', '布局抖动', 'Layout shift', '页面跳动'],
    category: 'architecture',
    plainExplanation: '网页加载到一半时，突然插进来一张图片或广告，把你正在阅读的文字猛地往下挤了一下，甚至导致你误点错了按钮。',
    whyItMatters: 'Google Web Vitals 核心性能指标之一。使用骨架屏提前占好固定宽高、为图片写死 aspect-ratio，都是为了杜绝 CLS。',
    relatedPatternId: 'skeleton',
    links: [
      {
        label: 'web.dev: Cumulative Layout Shift (CLS)',
        url: 'https://web.dev/cls/',
        type: 'webdev',
      },
      {
        label: 'MDN: Understanding Layout Stability',
        url: 'https://developer.mozilla.org/en-US/docs/Glossary/CLS',
        type: 'mdn',
      },
    ],
  },
  {
    id: 'optimistic-ui',
    term: 'Optimistic UI',
    termZh: '乐观更新',
    aliases: ['乐观更新', 'Optimistic UI', '乐观UI'],
    category: 'architecture',
    plainExplanation: '用户点赞或点删除时，界面不等后端服务器返回成功，立刻把红心点亮或把条目划走；如果几秒后网络失败了，再撤销并弹出提示。',
    whyItMatters: '让你的 Web App 拥有媲美原生 App 丝滑手感的终极秘诀。配合 Snackbar 撤销机制时，先在本地隐藏条目，等 5 秒确认没点撤销才真正发请求给服务器。',
    relatedPatternId: 'snackbar',
    links: [
      {
        label: 'Google 搜索 "Optimistic UI UX pattern"',
        url: 'https://www.google.com/search?q=Optimistic+UI+UX+pattern',
        type: 'google',
      },
    ],
  },
  {
    id: 'debounce-throttle',
    term: 'Debounce & Throttle',
    termZh: '防抖与节流',
    aliases: ['防抖', '节流', 'Debounce', 'Throttle'],
    category: 'architecture',
    plainExplanation: '防抖：等用户停止打字 300 毫秒后才发搜索请求；节流：用户拼命滚动屏幕时，每隔 100 毫秒最多只计算一次位置。',
    whyItMatters: '搜索输入框（Search Bar）和无限滚动（Infinite Scroll）的必修课。不加防抖，打一个词就会向服务器发送 10 次请求，甚至把后端搞崩溃。',
    relatedPatternId: 'text-field',
    links: [
      {
        label: 'MDN: Debounce vs Throttle in JS',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event',
        type: 'mdn',
      },
    ],
  },
  {
    id: 'glassmorphism',
    term: 'Glassmorphism',
    termZh: '毛玻璃材质 / 背景模糊',
    aliases: ['毛玻璃', '磨砂玻璃', 'Glassmorphism', 'Backdrop blur'],
    category: 'visual',
    plainExplanation: '像把一块磨砂玻璃盖在内容上面，背景里的文字和图片变得朦胧半透明，营造高级的空间景深质感（如 iOS 控制中心）。',
    whyItMatters: '现代 UI 的高级感利器。在 Tailwind 中通常通过 `backdrop-blur-md bg-white/70 border border-white/20` 实现。',
    links: [
      {
        label: 'MDN: backdrop-filter CSS',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter',
        type: 'mdn',
      },
      {
        label: 'Apple HIG: Materials and Blur',
        url: 'https://developer.apple.com/design/human-interface-guidelines/materials',
        type: 'apple',
      },
    ],
  },
  {
    id: 'micro-interaction',
    term: 'Micro-interaction',
    termZh: '微交互 / 物理触感反馈',
    aliases: ['微交互', '微动效', 'Micro-interaction', '触感反馈'],
    category: 'visual',
    plainExplanation: '按钮按下时轻微缩小 2%、开关打开时圆球弹跳一下、复制成功时图标变成勾——这些不易察觉却让产品充满生命力的小细节。',
    whyItMatters: '让你的软件从「能用」跨越到「精致」的关键。向 AI 要动效时，要求「加入微交互：active:scale-95，缓动曲线 spring 弹性过渡」。',
    relatedPatternId: 'switch',
    links: [
      {
        label: 'Nielsen Norman: Micro-interactions in UX',
        url: 'https://www.nngroup.com/articles/microinteractions/',
        type: 'webdev',
      },
      {
        label: 'Google 搜索 "Micro interactions examples"',
        url: 'https://www.google.com/search?q=Micro+interactions+examples+UI',
        type: 'google',
      },
    ],
  },
];
