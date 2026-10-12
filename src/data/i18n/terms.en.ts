import type { TermItem, TermCategoryMeta } from '../terms';

export const TERM_CATEGORIES_EN: TermCategoryMeta[] = [
  {
    id: 'interaction',
    name: 'Interaction & Gestures',
    desc: 'Scroll friction, drag snapping, tap targets, and trigger logic.',
  },
  {
    id: 'a11y',
    name: 'Accessibility (a11y)',
    nameZh: undefined,
    desc: 'Keyboard navigation, screen readers, focus control, and error prevention.',
  },
  {
    id: 'visual',
    name: 'Visual & Motion',
    nameZh: undefined,
    desc: 'Shimmer loaders, easing curves, glassmorphism, and micro-interactions.',
  },
  {
    id: 'architecture',
    name: 'State & Frontend Architecture',
    nameZh: undefined,
    desc: 'Optimistic UI, debounce, throttle, layout shift, and lifecycle patterns.',
  },
];

export const TERMS_DATA_EN: TermItem[] = [
  {
    id: 'snap-points',
    term: 'Snap Points',
    aliases: ['Snap points', 'Sheet resting positions', 'Detents'],
    category: 'interaction',
    plainExplanation: 'Like physical mechanical notches that automatically catch a drawer at fixed heights when released (e.g. 50% half-screen or 90% full-screen).',
    whyItMatters: 'Without snap points, mobile bottom sheets stop at awkward heights and feel broken. Prompt AI: "Support 50% and 90% snap points" to get production-grade sheet code.',
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
        label: 'Google Search "Snap Points UI"',
        url: 'https://www.google.com/search?q=Snap+Points+UI+design',
        type: 'google',
      },
    ],
  },
  {
    id: 'drag-handle',
    term: 'Drag Handle',
    aliases: ['Grabber', 'Handle bar', 'Drag indicator'],
    category: 'interaction',
    plainExplanation: 'The subtle rounded grey pill at the top of a sheet signaling to users: "You can drag this up or down with your finger."',
    whyItMatters: 'Crucial visual affordance on mobile. Without it, users may not realize a panel can be swiped down. Ask AI for a centered drag handle to instantly polish your sheet.',
    relatedPatternId: 'bottom-sheet',
    links: [
      {
        label: 'Apple HIG: Grabber Handle',
        url: 'https://developer.apple.com/design/human-interface-guidelines/sheets',
        type: 'apple',
      },
      {
        label: 'Google Search "Drag handle UI pattern"',
        url: 'https://www.google.com/search?q=Drag+handle+UI+pattern',
        type: 'google',
      },
    ],
  },
  {
    id: 'focus-trap',
    term: 'Focus Trap',
    aliases: ['Focus trapping', 'Keyboard trap', 'Focus lock'],
    category: 'a11y',
    plainExplanation: 'When a dialog opens, pressing Tab only cycles between buttons inside the dialog and never escapes to background elements behind the modal.',
    whyItMatters: 'A key mark of senior engineering. Without a focus trap, tabbing can accidentally trigger destructive background buttons! Instruct AI to enforce focus trapping.',
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
    aliases: ['ARIA', 'a11y', 'Accessibility', 'Screen readers'],
    category: 'a11y',
    plainExplanation: 'Special HTML attributes (such as aria-expanded, aria-hidden) that describe interactive states to screen readers and assistive tech.',
    whyItMatters: 'Premier component libraries (Radix, ArkUI, Headless UI) exist primarily for robust ARIA compliance. Tell AI to output accessible ARIA markup to avoid bad code.',
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
    aliases: ['Overlay', 'Scrim', 'Dimmer', 'Backdrop'],
    category: 'visual',
    plainExplanation: 'The semi-transparent darkened (or blurred) layer behind a dialog that dims background content, forcing attention onto the foreground.',
    whyItMatters: 'Specify two crucial details to AI: 1) Opacity and blur level (e.g. bg-black/40 backdrop-blur-sm); 2) Whether tapping the backdrop dismisses the modal.',
    relatedPatternId: 'modal',
    links: [
      {
        label: 'MDN: ::backdrop CSS Pseudo-element',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop',
        type: 'mdn',
      },
      {
        label: 'Google Search "Modal backdrop best practices"',
        url: 'https://www.google.com/search?q=Modal+backdrop+best+practices',
        type: 'google',
      },
    ],
  },
  {
    id: 'touch-target',
    term: 'Touch Target (44px)',
    aliases: ['Tap target', '44px rule', 'Hit area', 'Minimum size'],
    category: 'interaction',
    plainExplanation: 'An average human fingertip covers about 9mm on glass. Interactive targets must measure at least 44x44 pixels to avoid mis-taps.',
    whyItMatters: 'Novices often create tiny 16px icon buttons that are infuriating to tap. Instructing AI to enforce min-h-[44px] min-w-[44px] elevates mobile usability immediately.',
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
    aliases: ['Skeleton shimmer', 'Glow sweep', 'Pulse animation'],
    category: 'visual',
    plainExplanation: 'A subtle light-grey wave smoothly sweeping left-to-right across placeholder cards while content loads, like sunlight reflecting off water.',
    whyItMatters: 'Far better than static grey boxes. Shimmer animation subconsciously reassures users that content is arriving momentarily, cutting perceived wait time.',
    relatedPatternId: 'skeleton',
    links: [
      {
        label: 'Google Search "Skeleton shimmer animation CSS"',
        url: 'https://www.google.com/search?q=Skeleton+shimmer+animation+CSS',
        type: 'google',
      },
    ],
  },
  {
    id: 'cls',
    term: 'Layout Shift (CLS)',
    termZh: undefined,
    aliases: ['CLS', 'Layout shift', 'Content jumping'],
    category: 'architecture',
    plainExplanation: 'When late-loading images or ads abruptly shove text downwards while a user is reading, causing accidental clicks.',
    whyItMatters: 'A core Google Web Vitals metric. Using Skeletons that reserve layout space beforehand prevents jarring CLS completely.',
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
    termZh: undefined,
    aliases: ['Optimistic updates', 'Instant UI feedback'],
    category: 'architecture',
    plainExplanation: 'Updating the UI immediately when a user likes or deletes something without waiting for the server, rolling back only if the network fails.',
    whyItMatters: 'The secret to native-app responsiveness on the web. Paired with Snackbars, you can hide an item locally for 5 seconds before triggering backend deletions.',
    relatedPatternId: 'snackbar',
    links: [
      {
        label: 'Google Search "Optimistic UI UX pattern"',
        url: 'https://www.google.com/search?q=Optimistic+UI+UX+pattern',
        type: 'google',
      },
    ],
  },
  {
    id: 'debounce-throttle',
    term: 'Debounce & Throttle',
    termZh: undefined,
    aliases: ['Debounce', 'Throttle', 'Rate limiting input'],
    category: 'architecture',
    plainExplanation: 'Debounce: waiting 300ms until typing stops before querying search. Throttle: calculating scroll position at most once every 100ms.',
    whyItMatters: 'Essential for search bars and infinite scroll. Without debouncing, typing a single word spams the backend with dozens of requests.',
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
    termZh: undefined,
    aliases: ['Frosted glass', 'Backdrop blur', 'Translucent materials'],
    category: 'visual',
    plainExplanation: 'Simulating frosted glass over underlying content with semi-transparent blurs, providing depth and elevation (e.g. iOS Control Center).',
    whyItMatters: 'Modern aesthetic staple. In Tailwind: backdrop-blur-md bg-white/70 border border-white/20.',
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
    termZh: undefined,
    aliases: ['Micro interactions', 'Haptic feedback', 'Spring physics'],
    category: 'visual',
    plainExplanation: 'Tiny rewarding details: button shrinking by 2% on press, switch knob bouncing into place, or an icon morphing into a checkmark.',
    whyItMatters: 'Elevates software from merely functional to delightful. Ask AI for spring-physics easing curves and active:scale-95 tactile press feedback.',
    relatedPatternId: 'switch',
    links: [
      {
        label: 'Nielsen Norman: Micro-interactions in UX',
        url: 'https://www.nngroup.com/articles/microinteractions/',
        type: 'webdev',
      },
      {
        label: 'Google Search "Micro interactions examples"',
        url: 'https://www.google.com/search?q=Micro+interactions+examples+UI',
        type: 'google',
      },
    ],
  },
];
