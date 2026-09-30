export interface LearningLevel {
  level: 1 | 2 | 3;
  name: string;
  subtitle: string;
  description: string;
  /** 覆盖的 pattern id 数量说明 */
  patternIds: string[];
}

export const learningLevels: LearningLevel[] = [
  {
    level: 1,
    name: '你每天都会看到的 UI',
    subtitle: 'Level 1',
    description:
      '这几个词你在任何 App 里都见过，只是不知道名字。认全它们，你就能描述 80% 的界面了。',
    patternIds: [
      'button',
      'cta',
      'card',
      'tabs',
      'modal',
      'toast',
      'text-field',
      'switch',
      'list',
      'icon-button',
    ],
  },
  {
    level: 2,
    name: '开始真正设计一个 App',
    subtitle: 'Level 2',
    description:
      '从「能看」到「会选」。这一层的价值在于让你在多个可行方案里挑出对的那个。',
    patternIds: [
      'bottom-sheet',
      'drawer',
      'accordion',
      'segmented-control',
      'skeleton',
      'empty-state',
      'snackbar',
      'stepper',
      'bottom-navigation',
      'slider',
      'badge',
      'chip',
      'pagination',
      'tooltip',
    ],
  },
  {
    level: 3,
    name: '开始理解 UX Pattern',
    subtitle: 'Level 3',
    description:
      '这些不是组件，是「一套做事的习惯」。学会它们，你的界面会从「能用」变成「舒服」。',
    patternIds: [
      'progressive-disclosure',
      'optimistic-ui',
      'destructive-action',
      'inline-validation',
      'infinite-scroll',
      'context-menu',
      'long-press',
      'swipe-action',
      'pull-to-refresh',
      'drag-and-drop',
      'error-state',
      'alert',
    ],
  },
];

/** 首页「Learn by Contrast」卡片 */
export const contrastCards = [
  { left: 'Toast', right: 'Snackbar', slug: 'toast-vs-snackbar-vs-alert' },
  { left: 'Dialog', right: 'Bottom Sheet', slug: 'dialog-vs-bottom-sheet-vs-drawer' },
  { left: 'Tabs', right: 'Segmented Control', slug: 'tabs-vs-segmented-control' },
  { left: 'Switch', right: 'Checkbox', slug: 'checkbox-vs-radio-vs-switch' },
  { left: 'Skeleton', right: 'Spinner', slug: 'spinner-vs-progress-bar-vs-skeleton' },
  { left: 'Tooltip', right: 'Popover', slug: 'tooltip-vs-popover' },
  { left: 'Pagination', right: 'Infinite Scroll', slug: 'pagination-vs-infinite-scroll' },
  { left: 'Button', right: 'CTA', slug: 'button-vs-cta' },
];
