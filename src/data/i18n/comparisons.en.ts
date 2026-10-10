import type { ComparisonTranslations } from './types';

/**
 * English copy for the 8 comparison pages.
 * Only prose lives here — slug / patterns / relatedComparisons stay in the source file.
 */
export const comparisonTranslations: ComparisonTranslations = {
  'dialog-vs-bottom-sheet-vs-drawer': {
    title: 'Dialog vs Bottom Sheet vs Drawer',
    subtitle: 'Three ways to say "put a layer on top"',
    question: 'I need to bring up a layer on top of the current screen. Which one?',
    columns: [
      { key: 'anchor', label: 'Where it appears' },
      { key: 'blocking', label: 'Blocks the user' },
      { key: 'context', label: 'Page underneath' },
      { key: 'platform', label: 'Main platforms' },
    ],
    rows: [
      {
        pattern: 'modal',
        cells: ['Center of the screen', true, 'Fully covered and dimmed', 'All platforms'],
        verdict: 'Use it when the user "must decide"',
      },
      {
        pattern: 'bottom-sheet',
        cells: [
          'Bottom of the screen',
          'Partially blocks',
          'Stays visible, so context remains',
          'Mobile',
        ],
        verdict: 'The default picker on mobile',
      },
      {
        pattern: 'drawer',
        cells: [
          'Side of the screen',
          'Partially blocks',
          'Mostly stays visible',
          'All platforms',
        ],
        verdict: 'When navigation or filtering needs real estate',
      },
    ],
    decision: [
      {
        if: 'the user must choose before they can continue (delete confirmation, sign-in)',
        then: 'use a Dialog',
      },
      {
        if: 'on mobile you need to pick from a few options, or show a row of actions',
        then: 'use a Bottom Sheet',
      },
      {
        if: 'you have a lot to show and it deserves its own space (navigation, filters)',
        then: 'use a Drawer',
      },
      {
        if: 'you only want to tell the user something worked',
        then: 'use none of these — use a Toast',
      },
    ],
    takeaway:
      'The real difference is how much they block. Heavier blocking (Dialog) for decisions the user cannot dodge; lighter blocking (Bottom Sheet, Drawer) for situations they can walk away from.',
  },
  'toast-vs-snackbar-vs-alert': {
    title: 'Toast vs Snackbar vs Alert',
    subtitle: 'Three ways to say "give the user a heads-up"',
    question: 'The action is done and I want to acknowledge it. Which one?',
    columns: [
      { key: 'action', label: 'Can carry an action' },
      { key: 'duration', label: 'How long it stays' },
      { key: 'blocking', label: 'Blocks the user' },
      { key: 'use', label: 'Typical use' },
    ],
    rows: [
      {
        pattern: 'toast',
        cells: ['No', 'Disappears after 2–3s', false, '"Saved", "Sent"'],
        verdict: 'Pure confirmation, nothing follows',
      },
      {
        pattern: 'snackbar',
        cells: ['Yes (undo / retry)', '5–10s', false, '"Deleted · Undo"'],
        verdict: 'Tells the user they can change their mind',
      },
      {
        pattern: 'alert',
        cells: ['Usually', 'Stays until dismissed', 'Sometimes (Alert Dialog)', 'Errors, risks, things to handle'],
        verdict: 'The kind that cannot be ignored',
      },
    ],
    decision: [
      { if: 'you just need to confirm success', then: 'use a Toast' },
      { if: 'you want the user to be able to undo what they just did', then: 'use a Snackbar' },
      {
        if: 'the user has to deal with the problem (something broke, something is at risk)',
        then: 'use an Alert (an Alert Dialog when it is severe)',
      },
    ],
    takeaway:
      'Toast and Snackbar get mixed up constantly. One question decides it: does the user need to tap anything? If not, it is a Toast.',
  },
  'tabs-vs-segmented-control': {
    title: 'Tabs vs Segmented Control',
    subtitle: 'Why they look alike but are not the same thing',
    question: 'I have a set of options to switch between. Tabs or Segmented Control?',
    columns: [
      { key: 'level', label: 'What it switches' },
      { key: 'scope', label: 'Suitable scope' },
      { key: 'url', label: 'URL / Routing connection' },
      { key: 'width', label: 'Visual form' },
    ],
    rows: [
      {
        pattern: 'tabs',
        cells: [
          'Full content panels across distinct sections',
          'Page or module-level navigation with distinct content structures',
          'Often mapped to dedicated URLs/queries for deep linking and sharing; can also be in-page',
          'Full-width or left-aligned, occupying prominent layout space',
        ],
        verdict: 'Switching between distinct full content sections',
      },
      {
        pattern: 'segmented-control',
        cells: [
          'Different presentation modes of the same content',
          'In-place data filtering or mode switching on the same dataset',
          'Mostly in-page state (can sync query params if needed), without navigating away',
          'Compact pill-shaped button group hugging its content or equally divided',
        ],
        verdict: 'Switching observation perspectives on the same data',
      },
    ],
    decision: [
      {
        if: 'switching between distinct major content sections (e.g., Profile / Posts / Likes) that may need independent sharing or deep linking',
        then: 'use Tabs',
      },
      {
        if: 'switching between presentation modes of the same content in place (like list / board, day / week / month)',
        then: 'use a Segmented Control',
      },
      { if: 'you have more than 5 options', then: 'use a Select dropdown or sidebar nav instead of overcrowding' },
    ],
    takeaway:
      'Quickest test: Tabs host distinct content panels (section navigation); a Segmented Control switches view modes on the same entity (state filtering). Both can optionally map to URLs depending on needs — do not decide purely based on URLs.',
  },
  'checkbox-vs-radio-vs-switch': {
    title: 'Checkbox vs Radio vs Switch',
    subtitle: 'Three ways to let the user pick something',
    question: 'I need the user to make a selection. Which control?',
    columns: [
      { key: 'multi', label: 'Multiple selection' },
      { key: 'effect', label: 'Takes effect' },
      { key: 'semantics', label: 'What it expresses' },
      { key: 'use', label: 'Typical use' },
    ],
    rows: [
      {
        pattern: 'checkbox',
        cells: ['Yes', 'On form submit', '"I checked these"', 'Cart multi-select, accepting terms'],
        verdict: 'Collecting several choices',
      },
      {
        pattern: 'radio',
        cells: ['No (mutually exclusive)', 'Selected on click', '"I picked one of these"', 'Sign-in method, plan choice'],
        verdict: 'Pick one out of many',
      },
      {
        pattern: 'switch',
        cells: ['Not applicable', 'Applies immediately', '"This feature is on or off"', 'Feature toggles in settings'],
        verdict: 'Flipping a state on or off',
      },
    ],
    decision: [
      { if: 'several options can be picked at once', then: 'use a Checkbox' },
      { if: 'only one option is allowed and all of them should stay visible', then: 'use a Radio' },
      { if: 'it is the on/off state of a feature', then: 'use a Switch' },
      {
        if: 'what comes next is "what should I do now"',
        then: 'that is a Button, not a selection control',
      },
    ],
    takeaway:
      'Radio and Switch both look like a dot or a slider, but one is a single decision and the other is a lasting state. Ask: am I choosing once, or turning something on?',
  },
  'spinner-vs-progress-bar-vs-skeleton': {
    title: 'Spinner vs Progress Bar vs Skeleton',
    subtitle: 'Three ways to say "loading"',
    question: 'Data is loading. How should I show it?',
    columns: [
      { key: 'progress', label: 'Quantifiable' },
      { key: 'structure', label: 'Previews structure' },
      { key: 'time', label: 'Good for waits' },
      { key: 'use', label: 'Typical use' },
    ],
    rows: [
      {
        pattern: 'spinner',
        cells: ['No', false, 'Short (<1s)', 'Inside buttons, small widgets'],
        verdict: 'The default for short waits',
      },
      {
        pattern: 'progress-bar',
        cells: ['Yes (percentage)', false, 'Long, with a known total', 'Upload, download, install'],
        verdict: 'When you know how much is left',
      },
      {
        pattern: 'skeleton',
        cells: ['No (but implies structure)', true, 'Medium to long (first load)', 'Lists, cards, above-the-fold'],
        verdict: 'The first load of a whole page',
      },
    ],
    decision: [
      { if: 'the wait is very short (one tap and it is back)', then: 'use a Spinner, or nothing at all' },
      { if: 'you know the exact progress (upload at 40%)', then: 'use a Progress Bar' },
      { if: 'you are loading a page or list with a predictable structure', then: 'use a Skeleton' },
      { if: 'the wait might exceed 10 seconds', then: 'add explanatory copy and a retry action' },
    ],
    takeaway:
      "A Skeleton's advantage is that it shows the page's shape while people wait, so perceived waiting shrinks. Still hold it for 300ms minimum, or a fast response makes it flash and feel worse.",
  },
  'tooltip-vs-popover': {
    title: 'Tooltip vs Popover',
    subtitle: 'Two ways to show a small floating layer',
    question: 'I need a small layer floating out from something. Which one?',
    columns: [
      { key: 'trigger', label: 'Trigger' },
      { key: 'content', label: 'What fits inside' },
      { key: 'interactive', label: 'Clickable' },
      { key: 'use', label: 'Typical use' },
    ],
    rows: [
      {
        pattern: 'tooltip',
        cells: ['Hover / focus', 'Text only', 'No', 'Explaining icons and abbreviations'],
        verdict: '"What does this thing do?"',
      },
      {
        pattern: 'popover',
        cells: ['Click', 'Menus, forms, anything', 'Yes', 'Action panels, pickers'],
        verdict: '"Pick one of these or fill this in"',
      },
    ],
    decision: [
      { if: 'you just need to explain a name or an abbreviation', then: 'use a Tooltip' },
      { if: 'the layer needs to be tappable, selectable, or fillable', then: 'use a Popover' },
      {
        if: 'mobile is a primary platform',
        then: 'do not lean on Tooltips (hard to trigger on touch) — use visible text',
      },
    ],
    takeaway:
      'One line separates them: a Tooltip can only be read, a Popover can be used. If anything clickable shows up inside your floating layer, it is not a Tooltip.',
  },
  'pagination-vs-infinite-scroll': {
    title: 'Pagination vs Infinite Scroll',
    subtitle: '"No end in sight" or "you can go back"',
    question: 'My list is long. Paginate or infinite scroll?',
    columns: [
      { key: 'control', label: 'User control' },
      { key: 'locate', label: 'Linkable / shareable' },
      { key: 'seo', label: 'SEO friendly' },
      { key: 'use', label: 'Typical use' },
    ],
    rows: [
      {
        pattern: 'pagination',
        cells: ['Yes (user turns pages)', 'Yes (?page=2)', 'Yes', 'Search results, orders, admin panels'],
        verdict: 'When people need to go back and find something',
      },
      {
        pattern: 'infinite-scroll',
        cells: ['No (loads automatically)', 'No', 'Poor', 'Social feeds, inspiration, news'],
        verdict: 'Exploratory content meant for casual browsing',
      },
    ],
    decision: [
      {
        if: 'users will want to return to "page N" or share a specific page',
        then: 'use Pagination',
      },
      {
        if: 'the content is endless browsing with no goal (social, inspiration)',
        then: 'use Infinite Scroll',
      },
      {
        if: 'you want endless browsing but not a broken back button',
        then: 'a Load More button is the middle ground',
      },
    ],
    takeaway:
      'Infinite scroll is not a fancier pagination. It buys that continuous feeling by losing "I know where I am". If content is structured and people need to find things, paginate.',
  },
  'button-vs-cta': {
    title: 'Button vs CTA',
    subtitle: 'They are not "two kinds of buttons"',
    question: 'I need to add a button. A regular Button or a CTA?',
    columns: [
      { key: 'count', label: 'How many per page' },
      { key: 'role', label: 'Role' },
      { key: 'visual', label: 'Visual weight' },
      { key: 'use', label: 'Typical use' },
    ],
    rows: [
      {
        pattern: 'button',
        cells: ['As many as you need', 'Triggers an action', 'Regular size', 'Save, cancel, delete, edit'],
        verdict: 'The general term for anything clickable',
      },
      {
        pattern: 'cta',
        cells: ['At most 1', 'The one next step on the page', 'Larger / more prominent', 'Sign-up, landing, empty states'],
        verdict: 'The single most important thing on the page',
      },
    ],
    decision: [
      {
        if: 'there is one thing on the page the user most needs to do',
        then: 'make it the CTA (single, most prominent)',
      },
      { if: 'it is just an ordinary action', then: 'use a Button (several can carry equal weight)' },
      {
        if: 'you have ended up with 3 CTAs that are all "most important"',
        then: 'step back and decide what this page is actually asking the user to do',
      },
    ],
    takeaway:
      'A CTA is a role, not a look. One page can hold many Buttons but only one thing you want the user to do. The moment visual weight is spread evenly, the focus disappears.',
  },
};