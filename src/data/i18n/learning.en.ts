import type { LearningTranslations } from './types';

/**
 * English copy for the 3 learning levels.
 * level / subtitle / patternIds stay in the source file.
 */
export const learningTranslations: LearningTranslations = {
  1: {
    name: 'The UI you see every day',
    description:
      'You have already seen these words in every app, you just did not know the names. Learn them and you can describe 80% of any interface.',
  },
  2: {
    name: 'Actually designing an app',
    description:
      'From recognising to choosing. This level is about picking the right one out of several workable options.',
  },
  3: {
    name: 'Understanding UX patterns',
    description:
      'These are not components, they are ways of doing things. Learn them and your interface goes from usable to comfortable.',
  },
};

/** Homepage "Learn by Contrast" cards, kept in sync with contrastCards. */
export const contrastCardsEn = [
  { left: 'Toast', right: 'Snackbar', slug: 'toast-vs-snackbar-vs-alert' },
  { left: 'Dialog', right: 'Bottom Sheet', slug: 'dialog-vs-bottom-sheet-vs-drawer' },
  { left: 'Tabs', right: 'Segmented Control', slug: 'tabs-vs-segmented-control' },
  { left: 'Switch', right: 'Checkbox', slug: 'checkbox-vs-radio-vs-switch' },
  { left: 'Skeleton', right: 'Spinner', slug: 'spinner-vs-progress-bar-vs-skeleton' },
  { left: 'Tooltip', right: 'Popover', slug: 'tooltip-vs-popover' },
  { left: 'Pagination', right: 'Infinite Scroll', slug: 'pagination-vs-infinite-scroll' },
  { left: 'Button', right: 'CTA', slug: 'button-vs-cta' },
];