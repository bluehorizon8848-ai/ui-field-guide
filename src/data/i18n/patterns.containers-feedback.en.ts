// English copy for the containers + feedback pattern entries (18 patterns).
// Structure mirrors src/data/patterns/containers.ts and feedback.ts exactly:
// anatomy length/order and whenToUse recommended flags are kept in sync with the Chinese source.

import type { PatternTranslations } from './types';

export const containerFeedbackPatterns: PatternTranslations = {
  'card': {
    oneLine:
      'A rounded, bordered container that bundles one related piece of content — image, title, text — into a single self-contained unit.',
    description:
      'A card is the most generic layout unit there is. It does not dictate what goes inside: an image, a heading, some copy, a button, all of it is fine. Its value is that it chops a scattered pile of information into blocks that can be clicked and understood on their own.',
    looksLike:
      'The tiled content blocks on an app home screen, article cards on a news site, one square per feature in a settings list, each row of search results.',
    fitsFor: 'Content feeds · Search results · Feature entry points',
    whenToUse: [
      { situation: 'A group of content can be clicked or understood on its own', recommended: true },
      { situation: 'It needs a clear click boundary (the whole card is clickable)', recommended: true },
      { situation: 'A repeated unit inside a grid layout', recommended: true },
      { situation: 'The content is very short — a single line of text', recommended: false },
      { situation: 'You would be nesting a card inside another card', recommended: false },
    ],
    whenNotToUse: [
      'Cards inside cards, or buttons inside buttons, are the classic symptom of a hierarchy that has lost control.',
      'If all you need is a bit of grouping, a divider is enough — no need to promote every group to a box.',
    ],
    anatomy: [
      { label: 'Surface', note: 'White background + 1px border + a very light shadow' },
      { label: 'Media', note: 'Optional, 16:9 or 1:1' },
      { label: 'Title', note: 'Clamped to 2 lines' },
      { label: 'Description', note: '1–2 lines, secondary text color' },
      { label: 'Action', note: 'At the bottom, or the whole card is clickable' },
    ],
    aiPrompt: {
      basic: 'Add a few cards.',
      detailed:
        'Add a list of content cards: each card has a 16:9 cover image, a title, a description and a "View details" link. The whole card is clickable and lifts slightly on hover.',
      implementation:
        '<article> as the container, white background, 1px #E6E3DB border, border-radius 10px, overflow hidden. Cover image aspect-ratio: 16/9 + object-fit: cover. Title 16px medium, line-clamp: 2. Description 14px #7A766D, line-clamp: 2. Whole card clickable: the card itself is an <a>, or carries onClick with tabIndex=0 plus an Enter key handler, and no nested <a> inside (avoids nesting interactive elements). hover: translateY(-2px) + elevated shadow.',
    },
    badPrompt: 'Add a few boxes to show some content.',
    betterPrompt:
      'Add a card list: white background, 1px border, border-radius 10px, 16:9 cover + title (clamped to 2 lines) + description, whole card clickable (no nested links inside), lifts 2px on hover with a raised shadow.',
    aliases: ['card', 'content card', 'tile', 'card container', 'panel card', 'item card'],
    tags: ['container', 'clickable', 'grid'],
  },

  'accordion': {
    oneLine:
      'Click a heading and the content below it expands; click again and it collapses back out of the way.',
    description:
      'The purpose of an accordion is to compress a lot of information into a smaller space. It can allow several panels open at once, or only one at a time — the latter is strictly speaking closer to a Collapsible. The classic use is an FAQ.',
    looksLike:
      'The question-and-answer list on an FAQ page, the "About this Mac ›" groups in a settings screen, the collapsible entries of a help center — click a heading and another paragraph appears below it.',
    fitsFor: 'FAQ · Settings groups · Help center',
    whenToUse: [
      { situation: 'There is a lot of content that can be compressed into a small space (FAQ)', recommended: true },
      { situation: 'Users do not need to see everything at once', recommended: true },
      { situation: 'Entries vary in length and cannot be aligned into a table', recommended: true },
      { situation: 'Users need to compare the content of all entries side by side', recommended: false },
      { situation: 'The content is only two or three lines — just show it directly', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'If users need to compare details across several entries, hiding them behind clicks only adds work.',
      'Using an accordion when there is a single entry is pure packaging with no payoff.',
    ],
    anatomy: [
      { label: 'Header', note: 'The entire row is clickable, height ≥44px' },
      { label: 'Label', note: 'The heading text — says what is inside' },
      { label: 'Chevron', note: 'Points right → points down, rotating 180°' },
      { label: 'Content', note: 'Revealed when expanded' },
      { label: 'Expanded State', note: 'Chevron rotated, content visible' },
    ],
    aiPrompt: {
      basic: 'Add something that expands and collapses.',
      detailed:
        'Add an FAQ accordion: multiple entries can be open at the same time, the whole heading row is clickable, the chevron on the right rotates 180° when expanded, and the content uses a grid-row transition.',
      implementation:
        'Each entry uses <button aria-expanded={open} aria-controls={id}> as the heading row (full-row hit area, padding 16px 20px, min-height 48px), with the content region as <div id role="region" aria-labelledby>. Animate expansion with a grid-template-rows: 0fr → 1fr transition (250ms), which is smoother than the max-height approach; the container needs overflow: hidden. Animate the chevron with transition: transform. When multiple entries may be open, openItems is a Set. Do not use the native <details> element, because its animation and default arrow styling cannot be controlled.',
    },
    badPrompt: 'Add something that expands when you click it.',
    betterPrompt:
      'Add an FAQ accordion: multi-open, headings as button[aria-expanded] with a full-row hit area ≥48px, chevron rotating 180° when expanded, content animated with a grid-template-rows 0fr→1fr height transition.',
    aliases: ['accordion', 'disclosure list', 'expandable list', 'faq accordion', 'collapse panel'],
    tags: ['expand', 'collapse', 'space-saving'],
  },

  'collapsible': {
    oneLine:
      'Only one section stays open at a time — open a new one and the previous one closes itself.',
    description:
      'A collapsible and an accordion are two strategies for the same mechanism. An accordion lets several panels open at once; a collapsible is the mutually exclusive version. Which one to use comes down to the job: use an accordion when people need to compare, and a collapsible when they only need to read one thing at a time.',
    looksLike:
      'You open the second panel in a list and the first one folds shut automatically — that is the default behavior of many accordions.',
    fitsFor: 'Settings · Sectioned content · Detail expansion',
    whenToUse: [
      { situation: 'The user only needs to focus on one block at a time', recommended: true },
      { situation: 'The content is long and opening several at once would blow out the page', recommended: true },
      { situation: 'The options are related (picking A changes what B means)', recommended: true },
      { situation: 'Users need to compare multiple entries', recommended: false },
    ],
    whenNotToUse: [
      'If the real need is "see two things at once", mutually exclusive panels keep interrupting the user.',
      'With only one entry, a collapsible turns a simple question into a puzzle.',
    ],
    anatomy: [
      { label: 'Trigger', note: 'The heading row plus a chevron' },
      { label: 'Panel', note: 'Only one is visible at any moment' },
      { label: 'Indicator', note: 'The chevron direction' },
    ],
    aiPrompt: {
      basic: 'Add an expandable section where only one can be open.',
      detailed:
        'Add a single-open collapsible panel: clicking the currently expanded item collapses it, clicking another item switches to that one, and at most one item is expanded at any time.',
      implementation:
        'Keep state as openIndex: number | null. On click: if (openIndex === i) setOpenIndex(null) else setOpenIndex(i). When openIndex changes, run the collapse animation on the outgoing panel and the expand animation on the incoming one (height 0fr→1fr transition, 250ms). Note that overlapping the two animations causes a jump, so use 180ms for collapse and 250ms for expand.',
    },
    badPrompt: 'Add a collapsible thing where opening one closes the others.',
    betterPrompt:
      'Add a collapsible: keep openIndex in state (nullable), clicking the open item collapses it and clicking another switches to it, at most one panel open at a time, 180ms collapse / 250ms expand height transitions so the two do not overlap and jump.',
    aliases: ['collapsible', 'single-open accordion', 'expandable section', 'exclusive accordion', 'disclosure panel'],
    tags: ['exclusive', 'single', 'expand'],
  },

  'modal': {
    oneLine:
      'Something pops up in the middle of the screen, and until you deal with it you cannot use the page underneath.',
    description:
      'A modal intercepts the user: the page behind it dims, stops responding to clicks, and stops scrolling. It has exactly two legitimate uses — a decision that must be made right now, or a focused input environment. Almost everything else can be solved with a non-blocking alternative.',
    looksLike:
      'The small dialog that appears after you tap "Delete photo", the composer that expands from the center of the screen while you write a comment, the centered form panel on a sign-in or sign-up page.',
    fitsFor: 'Confirmation · Sign-in · Required input',
    whenToUse: [
      { situation: 'A decision is required before anything else can proceed (confirmation)', recommended: true },
      { situation: 'The user needs a focused input environment (sign-in, comment)', recommended: true },
      { situation: 'A serious error needs to interrupt the user', recommended: true },
      { situation: 'You only want to display a piece of information', recommended: false },
      { situation: 'It has to carry a multi-step task (a long form)', recommended: false },
    ],
    whenNotToUse: [
      'Popping up a dialog on every button press is the most common experience disaster there is.',
      'A modal inside a modal is a design incident — use breadcrumbs or a stepper instead.',
    ],
    anatomy: [
      { label: 'Scrim', note: 'Translucent black, usually dismisses on click' },
      { label: 'Dialog Surface', note: 'White background, border-radius 12px, max-width 480px' },
      { label: 'Title', note: 'State the consequence, not "Notice"' },
      { label: 'Body', note: 'No more than 3 lines' },
      { label: 'Actions', note: 'Right-aligned: cancel + confirm' },
      { label: 'Close', note: '✕ in the top-right corner, or press Esc' },
    ],
    aiPrompt: {
      basic: 'Pop up a dialog when the user clicks.',
      detailed:
        'After tapping "Delete", show a confirmation dialog: the title states the consequence, the body is no more than two lines, and the bottom right-aligns "Cancel" and a red "Delete" button. Both Esc and a scrim click dismiss it.',
      implementation:
        'role="dialog" aria-modal="true", with aria-labelledby pointing at the title. On open, add overflow: hidden to body and move focus to the first interactive element (or to the dialog itself). Focus trap: Tab cycles only within the dialog. Esc closes. Scrim rgba(0,0,0,0.4); clicking the scrim closes it (except for destructive operations). Width min(480px, calc(100vw - 32px)), vertically centered. Animation: opacity + scale(0.96→1) over 150ms. On close, return focus to the trigger element.',
    },
    badPrompt: 'Make a dialog pop up when the user clicks.',
    betterPrompt:
      'Show a confirmation dialog (role=dialog aria-modal): the title states the consequence instead of saying "Notice", the body is ≤2 lines, and the bottom right-aligns "Cancel + red Delete". Esc and scrim click both close it; focus is trapped on open and body scroll is locked.',
    aliases: ['modal', 'dialog', 'modal dialog', 'popup window', 'overlay dialog', 'blocking dialog'],
    tags: ['blocking', 'confirmation', 'focus'],
  },

  'bottom-sheet': {
    oneLine:
      'A panel that slides up from the bottom edge of the screen and rests there without taking over the whole display.',
    description:
      'A bottom sheet is the most-loved container on mobile: it preserves the feeling that you are still on the original page while opening up a focused area for actions. The two most common shapes are a fixed-height selection panel and a pure list of action buttons (an action sheet).',
    looksLike:
      'The edit panel that rises from the bottom when you tap "Edit" in a photo app, the filter panel after tapping search in a maps app, the "Take Photo / Choose from Library / Scan" list that pops up from the "+" button.',
    fitsFor: 'Filters · Options · Share actions',
    whenToUse: [
      { situation: 'Mobile needs a lightweight selection or action panel', recommended: true },
      { situation: 'You want to keep the context of the page underneath (users still see where they are)', recommended: true },
      { situation: 'There are between 3 and 8 actions', recommended: true },
      { situation: 'The content needs full-screen depth (a long form, an editor)', recommended: false },
      { situation: 'A desktop web interface', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Once the content passes half the screen, a bottom sheet costs the user their sense of "page" — a full screen is steadier there.',
      'When you need to strictly block the user until they decide, a modal interrupts far more forcefully.',
    ],
    anatomy: [
      { label: 'Scrim', note: 'Translucent black, does not fully hide the content underneath' },
      { label: 'Surface', note: 'Top corners rounded 16px, rises from the bottom' },
      { label: 'Drag Handle', note: 'Short centered bar at the top, signals that it can be dragged' },
      { label: 'Title', note: 'Optional, centered' },
      { label: 'Content', note: 'A list of options or a form' },
      { label: 'Handle / Grabber', note: 'Dragging it downward dismisses the sheet' },
    ],
    aiPrompt: {
      basic: 'Slide something up from the bottom.',
      detailed:
        'After tapping "Filters", open a bottom sheet from the bottom of the screen: the height adapts to the content and never exceeds 70% of the viewport, the page behind stays visible under a translucent scrim, there is a drag handle at the top, and dragging down or tapping the scrim closes it.',
      implementation:
        'Container fixed inset-0 z-50, scrim rgba(0,0,0,0.4) fading in. Panel fixed bottom-0, max-height: 70vh, border-radius 16px 16px 0 0, transform: translateY(100%) → 0 over 280ms with cubic-bezier(0.32,0.72,0,1). Place a 36×4px gray drag handle 12px from the top. Offer at least three ways to close: drag the handle down (tracking the finger), tap the scrim, tap the cancel button. Lock body scroll while open and close on Esc. Constrain the height with a measured max-height rather than a fixed height.',
    },
    badPrompt: 'Make something pop up from the bottom on click.',
    betterPrompt:
      'After tapping "Filters", open a bottom sheet: height adapts to content with max-height 70vh, top corners rounded 16px plus a drag handle, a 40% scrim that keeps the page visible behind, and four ways to close — drag down, scrim tap, cancel button, or ESC.',
    aliases: ['bottom sheet', 'action sheet', 'bottom drawer', 'sheet', 'bottom panel', 'modal bottom sheet'],
    tags: ['bottom', 'slides-up', 'context'],
  },

  'drawer': {
    oneLine:
      'A panel that slides in from the edge of the screen, usually from the side, sometimes from the bottom.',
    description:
      'What defines a drawer is that it slides in from an edge and either pushes aside or covers the original page. A drawer that slides up from the bottom is usually just a bottom sheet; the real distinction is the side drawer, which carries navigation or filters without interrupting the main flow.',
    looksLike:
      'The menu that slides in from the left when you tap the hamburger icon, the "Selected items" panel that slides out from the right in a shopping cart, the settings panel that side-slides in.',
    fitsFor: 'Navigation · Filters · Detail panels',
    whenToUse: [
      { situation: 'Mobile needs room for entries that bottom navigation cannot fit', recommended: true },
      { situation: 'There are many filter conditions that need a full panel to live in', recommended: true },
      { situation: 'The main content needs to stay visible (to compare against filtered results)', recommended: 'mostly' },
      { situation: 'You need to show a large amount of information at once (help, details)', recommended: false },
    ],
    whenNotToUse: [
      'Once a drawer holds tabs and accordions, it is a page wearing a disguise — just navigate there.',
      'Nesting drawers inside drawers turns the back behavior into a guessing game.',
    ],
    anatomy: [
      { label: 'Overlay', note: 'Translucent black, closes on click' },
      { label: 'Panel', note: 'Slides in from the side, width 280–320px' },
      { label: 'Handle', note: 'Optional, hints that the panel can slide out' },
      { label: 'Content', note: 'Navigation items or a form' },
    ],
    aiPrompt: {
      basic: 'Slide a panel in from the left.',
      detailed:
        'Add a drawer that slides in from the left, 300px wide, carrying the primary navigation. A hamburger button opens it; a scrim click or Esc closes it, and focus returns to the button on close.',
      implementation:
        'Container fixed inset-0 z-50, scrim rgba(0,0,0,0.4). Panel fixed left-0 top-0 h-full w-[300px], transform: translateX(-100%) → 0 over 250ms. Lock body scroll while open, trap focus inside the panel, close on Esc, and return focus to the hamburger button on close. Support an edge-swipe gesture to open (detect touchstart/touchmove starting at x<20px). Fixed on mobile; at mobile-and-up sizes (≥1024px) it should be permanently visible as a sidebar rather than a drawer.',
    },
    badPrompt: 'Add a side panel that slides out.',
    betterPrompt:
      'Add a left drawer (300px wide): opened by a hamburger button, 40% scrim, Esc and scrim click both close it, focus trapped inside, focus returned to the button on close, background scroll locked, and a permanent sidebar at ≥1024px instead of a drawer.',
    aliases: ['drawer', 'side drawer', 'slide-out panel', 'off-canvas panel', 'side panel', 'navigation drawer'],
    tags: ['side', 'navigation', 'scrim'],
  },

  'popover': {
    oneLine:
      'A small panel that pops out next to a particular element, visually tethered to the thing that opened it.',
    description:
      'The defining trait of a popover is attachment: it always grows out near its trigger and points back at where it came from. That is what makes it read differently from a modal in the center of the screen or a bottom sheet at the bottom of the screen.',
    looksLike:
      'The month picker that appears beside the calendar icon, the little menu that floats out after you tap "More", the palette that opens after you tap a color swatch — each one sits right next to its own trigger.',
    fitsFor: 'Menus · Pickers · Quick edits',
    whenToUse: [
      { situation: 'The content needs a visual relationship with a specific element', recommended: true },
      { situation: 'The content is light (a menu, a picker, a small form)', recommended: true },
      { situation: 'The page underneath needs to stay interactive', recommended: true },
      { situation: 'The user has to be blocked from finishing the current operation', recommended: false },
      { situation: 'The content is long and needs a lot of scrolling', recommended: false },
    ],
    whenNotToUse: [
      'Putting a long list in a popover is a common mistake — once users scroll to the bottom they lose the thread of where it came from.',
      'On mobile, popovers tend to overflow the viewport because there is not enough room, so positioning needs care.',
    ],
    anatomy: [
      { label: 'Trigger', note: 'Gets an active background while pressed' },
      { label: 'Surface', note: 'White background + shadow to read as floating' },
      { label: 'Arrow', note: 'Points at the trigger, optional' },
      { label: 'Content', note: 'Menu items / a form / a preview' },
    ],
    aiPrompt: {
      basic: 'Pop a small panel out next to something.',
      detailed:
        'After clicking the "Format" button, open a popover below it offering four type styles to choose from, with a small arrow pointing at the trigger button. Esc and outside clicks close it.',
      implementation:
        'The trigger button gets aria-haspopup="menu" aria-expanded. The popover is role="menu" with options as role="menuitem". Position it with Floating UI or by hand: read trigger.getBoundingClientRect(), prefer placing it below, flip above when there is not enough room underneath, align to the trigger left edge, 6px of spacing. Add an 8px rotated white square as the arrow. Close on Esc or outside click, and return focus to the trigger.',
    },
    badPrompt: 'Pop something out next to this.',
    betterPrompt:
      'Open a popover below the trigger button (role=menu) with a small arrow pointing back at the trigger, positioned with Floating UI and flipped above automatically when there is not enough space, closed by Esc or an outside click, focus returned to the trigger.',
    aliases: ['popover', 'popover panel', 'floating panel', 'flyout', 'popup menu', 'anchored overlay'],
    tags: ['anchored', 'lightweight', 'positioning'],
  },

  'tooltip': {
    oneLine:
      'A small line of text that appears on hover, telling you what an unfamiliar icon actually does.',
    description:
      'A tooltip does exactly one thing: it names and explains. It cannot hold buttons (that is a popover) and it cannot carry a critical action. Its biggest limitation is that touch devices can barely trigger it, so it can never be the only place information lives.',
    looksLike:
      'Hover an unfamiliar icon and a small dark bar reading "Export as PDF" floats out beside it — that is a tooltip.',
    fitsFor: 'Icon naming · Acronym expansion · Full text on demand',
    whenToUse: [
      { situation: 'An icon button is not self-explanatory and needs a label', recommended: true },
      { situation: 'A number or an acronym needs a gloss', recommended: true },
      { situation: 'Truncated text needs a way to read the whole thing', recommended: true },
      { situation: 'Users need to click a button inside it', recommended: false },
      { situation: 'It holds information required to understand the page', recommended: false },
    ],
    whenNotToUse: [
      'Tooltips are basically untriggerable on mobile, so critical information needs a second, permanent home.',
      'Keep the delay short (around 500ms), or the whole page feels sluggish.',
    ],
    anatomy: [
      { label: 'Trigger', note: 'Usually focusable' },
      { label: 'Bubble', note: 'Dark background, white text, border-radius 6px' },
      { label: 'Text', note: '≤2 lines, never a long sentence' },
      { label: 'Arrow', note: 'Points at the trigger element' },
    ],
    aiPrompt: {
      basic: 'Show a hint on hover.',
      detailed:
        'Add a tooltip to the icon buttons in a toolbar: after a 400ms hover, show the name of the icon; hide it immediately on mouse-out or Esc, and also show it on keyboard focus.',
      implementation:
        'The trigger element gets aria-describedby pointing at the bubble id, plus a title="" as a fallback. The bubble is position: absolute, appearing 8px above the trigger and flipping below when near the top of the screen. Dark background #1A1917, white 12px text, border-radius 6px, max-width 200px. Show delay 400ms on hover enter, hide immediately on leave. Also show on focus-visible. Keep the text under 2 lines.',
    },
    badPrompt: 'Show a hint when the mouse goes over it.',
    betterPrompt:
      'Add a tooltip to the icon button: appear after a 400ms hover showing the icon name, hide immediately on mouse-out or Esc, trigger on keyboard focus too, add aria-describedby, flip below automatically near the top of the screen, and keep the text ≤2 lines.',
    aliases: ['tooltip', 'hover hint', 'title tip', 'hover label', 'hint bubble'],
    tags: ['hover', 'labeling', 'keyboard'],
  },

  'toast': {
    oneLine:
      'A small confirmation that drifts into the corner of the screen after an action and disappears on its own a few seconds later.',
    description:
      'A toast says exactly one thing: the action you just took succeeded. It has no buttons — if you need an action, use a Snackbar — it never blocks the user, and it disappears by itself. Its job is a momentary confirmation, not a message that demands attention.',
    looksLike:
      'The "Sent" that drifts down at the top of the screen after sending a message, the "Saved to Photos" that flashes in the bottom-right corner after saving an image — both are toasts.',
    fitsFor: 'Saved · Sent · Completed',
    whenToUse: [
      { situation: 'An action succeeded and needs a one-line confirmation', recommended: true },
      { situation: 'You do not want to interrupt what the user is doing', recommended: true },
      { situation: 'The information is simple and requires nothing from the user', recommended: true },
      { situation: 'The user has to make a choice (undo / retry)', recommended: false },
      { situation: 'You need to convey a serious error', recommended: false },
    ],
    whenNotToUse: [
      'The moment you put an "Undo" button inside it, it has become a snackbar — do not mix the two.',
      'Repeated actions make toasts stack into a column, which reads like something has gone wrong.',
    ],
    anatomy: [
      { label: 'Container', note: 'Dark background, white text, border-radius 8px' },
      { label: 'Icon', note: 'Success ✓ / failure ! / info i' },
      { label: 'Message', note: 'One sentence, ≤20 characters' },
      { label: 'Duration', note: 'Auto-dismisses after 2–4 seconds' },
    ],
    aiPrompt: {
      basic: 'Show a confirmation after saving.',
      detailed:
        'After a successful save, show the toast "Photo saved" — dark background, white text, a checkmark icon, centered at the top of the screen, fading out automatically after 2.5 seconds.',
      implementation:
        'Fixed position top: 16px (or bottom: 24px), horizontally centered, dark background #1A1917 with white text, border-radius 8px, padding 10px 16px, icon + message centered horizontally. Animate with opacity + translateY(-10px), 200ms in and 200ms out. Remove automatically after 3 seconds. When triggered repeatedly, replace rather than stack (a toast with the same key overwrites the previous one). role="status" aria-live="polite" so screen readers announce it too.',
    },
    badPrompt: 'Show a confirmation after the action.',
    betterPrompt:
      'After a successful action, show a toast: dark background, white text, a circular icon, centered at the top, auto-dismissing after 3 seconds, with role="status" + aria-live="polite", and replace instead of stacking when triggered again.',
    aliases: ['toast', 'toast notification', 'flash message', 'transient notification', 'status toast'],
    tags: ['non-blocking', 'auto-dismiss', 'confirmation'],
  },

  'snackbar': {
    oneLine:
      'Looks much like a toast, except it carries one optional action button at the bottom — typically "Undo".',
    description:
      'The only difference between a snackbar and a toast is whether it can do something. The moment it offers an undo button it becomes the safety net for dangerous operations. That is also why Google insists deletes get a snackbar rather than a confirmation dialog.',
    looksLike:
      'The "Message deleted · Undo" bar at the bottom of Gmail after deleting an email, the "Ad skipped · Restore" bar at the bottom of YouTube after dismissing an ad — both have a tappable action.',
    fitsFor: 'Delete · Move · Bulk operations',
    whenToUse: [
      { situation: 'You want to offer an undo after a delete, move, or similar operation', recommended: true },
      { situation: 'The action already took effect and the user might change their mind', recommended: true },
      { situation: 'You want to avoid the interruption of a confirmation dialog', recommended: true },
      { situation: 'You only need to report success with no follow-up action at all', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'If the undo window is only 3 seconds, that is too short for important content — either extend the duration or use a confirmation dialog.',
      'When there is a bottom navigation bar, the snackbar has to shift up or the nav bar will cover it.',
    ],
    anatomy: [
      { label: 'Container', note: 'Usually centered at the bottom of the screen' },
      { label: 'Message', note: 'Passive voice: "Message deleted"' },
      { label: 'Action', note: 'Such as "Undo" or "Retry"' },
      { label: 'Duration', note: 'Give it 5–10 seconds when there is an undo' },
    ],
    aiPrompt: {
      basic: 'Offer a chance to undo after deleting.',
      detailed:
        'After a photo is deleted, show a snackbar at the bottom: "1 photo deleted" plus an "Undo" button, auto-dismissing after 5 seconds; shift it up by 80px when there is bottom navigation.',
      implementation:
        'fixed bottom: calc(80px + env(safe-area-inset-bottom)), horizontally centered, dark background with white text, border-radius 8px, message on the left and an "Undo" text button on the right (high-contrast color, not blue). Auto-dismiss after a 5 second countdown, and pause the countdown on pointer hover. Clicking "Undo" performs the restore immediately and removes the snackbar. role="status" + aria-live="polite", and give the undo button a generous hit area.',
    },
    badPrompt: 'Show a confirmation after deleting.',
    betterPrompt:
      'After a delete, show a bottom snackbar: "1 photo deleted" + an "Undo" text button, auto-dismissing after 5 seconds (countdown pauses on hover), shifted up when there is bottom navigation, with role="status" + aria-live="polite".',
    aliases: ['snackbar', 'action bar', 'undo bar', 'material snackbar', 'undo snackbar'],
    tags: ['undo', 'safety-net', 'non-blocking'],
  },

  'alert': {
    oneLine:
      'A message that has to be taken seriously: something broke, something is at risk, and you need to act on it.',
    description:
      'An alert is the "you cannot ignore this" category. It can sit inline in the page or live inside a dialog (an alert dialog). What they share is that the user is normally expected to respond. Unlike a toast it does not disappear on its own.',
    looksLike:
      'The red line reading "Wrong password" under a failed form field, the yellow banner reading "Your card has expired" at the top of a checkout page — both are alerts.',
    fitsFor: 'Errors · Risks · Things requiring action',
    whenToUse: [
      { situation: 'The user must act before anything can continue (an error, a risk)', recommended: true },
      { situation: 'The blast radius is large (a whole account, a network outage)', recommended: true },
      { situation: 'The information has to stay on screen and cannot auto-dismiss', recommended: true },
      { situation: 'Reporting the success of a small action', recommended: false },
      { situation: 'You only want to offer a tip on how to use something', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Red means "something is wrong". If you render an ordinary tip in red, users stay anxious about the entire interface.',
      'Three alerts on one page and users will ignore every single one of them.',
    ],
    anatomy: [
      { label: 'Container', note: 'Tinted background + a matching left border' },
      { label: 'Icon', note: 'Chosen by severity: i / ! / ×' },
      { label: 'Title', note: 'One sentence naming the problem' },
      { label: 'Description', note: 'Optional, how to fix it' },
      { label: 'Action', note: 'Such as "Retry" or "Go to settings"' },
    ],
    aiPrompt: {
      basic: 'Tell the user when something goes wrong.',
      detailed:
        'Add a red alert at the top of the form: "This email is already registered", a supporting line "Use a different email, or sign in to your existing account", and a "Sign in" button. It disappears automatically once the user corrects the field.',
      implementation:
        'role="alert" aria-live="assertive". Light red background #FAEDEC, 3px left border in #A8342C, border-radius 8px, padding 12px 16px. Inside: an ! icon, a 14px medium title, a 13px description, and a text button on the right. On a failed form submission, insert it at the top of the form and move focus to it. Remove it automatically once the error is corrected (the field revalidates), but do not send focus jumping back to the input — that interrupts the user.',
    },
    badPrompt: 'Pop up a warning when something goes wrong.',
    betterPrompt:
      'Add a role="alert" alert at the top of the form: light red background + 3px left border + ! icon + the title "This email is already registered" + a suggested fix + a "Sign in" button, focused on submit failure and removed automatically once the input is corrected.',
    aliases: ['alert', 'warning', 'error alert', 'notice', 'alert banner', 'inline alert'],
    tags: ['severe', 'action-required', 'persistent'],
  },

  'banner': {
    oneLine:
      'A full-width strip pinned to the top or bottom of the page that carries a message about the whole app.',
    description:
      'A banner is the global version of an alert: it belongs to no particular form or section, it speaks for the entire app or site — maintenance windows, network outages, new version notices.',
    looksLike:
      'The yellow strip at the top of a site reading "This site will be down tonight at 2:00", the bar at the top of an app reading "You are currently offline".',
    fitsFor: 'Offline · Maintenance · App-wide notices',
    whenToUse: [
      { situation: 'A condition affects the entire app (offline, under maintenance)', recommended: true },
      { situation: 'The notice is global and unrelated to any specific piece of content', recommended: true },
      { situation: 'Users should know about it, but it should not interrupt their work', recommended: true },
      { situation: 'The error belongs to one particular input field', recommended: false },
    ],
    whenNotToUse: [
      'A banner belongs above the content, at the top. Parked at the very bottom of the page it is the same as invisible.',
      'Do not use a banner for marketing — that is the landing page hero banner’s job, not the product UI.',
    ],
    anatomy: [
      { label: 'Strip', note: 'Full width, solid color background' },
      { label: 'Icon', note: 'Optional' },
      { label: 'Message', note: 'Centered or left-aligned' },
      { label: 'Dismiss', note: 'Optional ✕ the user can close it' },
      { label: 'Action', note: 'Such as "Update" or "Retry"' },
    ],
    aiPrompt: {
      basic: 'Add a notice strip at the top.',
      detailed:
        'Add a global banner at the top of the page: "You are offline, content may be out of date" plus a "Retry" button. The user can dismiss it manually, and that dismissed state lasts for the current session.',
      implementation:
        'A full-width strip placed above or below the header, light yellow background with dark text, padding 8px 16px, flex centered. role="status". The close button uses aria-label="Dismiss notice", and the dismissed state is stored in sessionStorage (session-only — do not write to localStorage, so it reappears next time). Drive the offline state from the window online/offline events, showing and hiding automatically, and replace the copy with "Connection restored" as soon as the network comes back.',
    },
    badPrompt: 'Add a notice bar at the top.',
    betterPrompt:
      'Add a global banner (full width, role=status): show "You are offline" plus a "Retry" button, let the user dismiss it with the state stored in sessionStorage, and listen to online/offline events to show it automatically and swap the copy when connectivity returns.',
    aliases: ['banner', 'announcement bar', 'top bar', 'full-width notice', 'site banner'],
    tags: ['global', 'full-width', 'persistent'],
  },

  'progress-bar': {
    oneLine:
      'A horizontal bar that fills up little by little as the task completes, so you know roughly how long is left.',
    description:
      'The key question for a progress bar is whether you know the total. If you do, show a percentage; if you do not, show the indeterminate state (a short bar sweeping back and forth). Do not pretend to have progress you cannot measure.',
    looksLike:
      'The thin bar at the top of the screen during an app update, the percentage bar at the bottom while downloading a file, the slim bar under each photo while it uploads.',
    fitsFor: 'Upload · Download · Install',
    whenToUse: [
      { situation: 'You know the total amount of work and can give a real percentage', recommended: true },
      { situation: 'The task takes a while (upload, download, install)', recommended: true },
      { situation: 'People benefit from a quantified "step 3 of 7" sense of progress', recommended: true },
      { situation: 'You have no idea how long it will take', recommended: 'mostly' },
      { situation: 'The action finishes in 0.3 seconds', recommended: false },
    ],
    whenNotToUse: [
      'A progress bar that crawls to 99% and stalls is the worst experience there is — if you are stuck at 99%, switch to the indeterminate state or say why.',
      'Do not animate a fake percentage when the real progress is unknown (crawl evenly to 90% and wait). Users can tell they are being lied to.',
    ],
    anatomy: [
      { label: 'Track', note: '4px tall, light gray background' },
      { label: 'Fill', note: 'Primary color, width = percentage' },
      { label: 'Label', note: 'Optional, shown right next to it' },
      { label: 'Indeterminate', note: 'A short bar sweeping back and forth' },
    ],
    aiPrompt: {
      basic: 'Add a progress bar.',
      detailed:
        'Show a progress bar while uploading: since the total size is known, display the real percentage and "Uploaded 3.2MB / 8MB"; turn it green with a checkmark on completion, and red with a retry option on failure.',
      implementation:
        'Container 4px tall, fully rounded, background #E6E3DB, with an inner div whose width = the percentage. Animate with transition: width 200ms ease-out. When the total is known, use the determinate form with value=0..100; when it is unknown, use the indeterminate form: an inner short bar (30% wide) running a looping translateX 0→100% animation. Overall progress can be weighted: a single file counts for 80% and the merge step for 20%. On failure, turn the fill #A8342C and show "Upload failed · Retry" below it.',
    },
    badPrompt: 'Add a progress bar while loading.',
    betterPrompt:
      'Show a progress bar while loading: when the total is known, display the real percentage plus "Uploaded 3.2MB / 8MB", turn green with a checkmark on completion and red with "Retry" on failure; when the total is unknown, use an indeterminate bar sweeping back and forth instead of fake progress.',
    aliases: ['progress bar', 'loading bar', 'progress indicator', 'percentage bar', 'loading progress'],
    tags: ['quantified', 'percentage', 'waiting'],
  },

  'spinner': {
    oneLine:
      'A circle that keeps spinning to say "loading, please wait" — the simplest loading indicator, and the one most often overused.',
    description:
      'A spinner is the simplest loading indicator and the most overused one. Its biggest problem is that it leaves the page empty: users have no idea how long they will wait, or whether anything has even started.',
    looksLike:
      'The spinning loading icon in the middle of the page, the little circle inside a button after you tap it, the spinner on a cold app launch.',
    fitsFor: 'Short waits · Inside buttons · Small widgets',
    whenToUse: [
      { situation: 'The wait is short (<1s) and the page structure does not change', recommended: true },
      { situation: 'A small, contained load inside a button', recommended: true },
      { situation: 'A single isolated widget is loading', recommended: true },
      { situation: 'The wait exceeds 1 second and there is page structure to show', recommended: false },
      { situation: 'It is the first load of a whole page', recommended: false },
    ],
    whenNotToUse: [
      'An empty page plus a spinner reads as a broken page. Use a skeleton for first loads.',
      'If there is still no answer after 10 seconds, "This is taking longer than usual — retry?" is kinder than another second of spinning.',
    ],
    anatomy: [
      { label: 'Ring', note: '12–32px, 2–3px stroke width' },
      { label: 'Rotation', note: 'Constant speed, 0.8s per revolution' },
      { label: 'Container', note: 'Inside the button, or centered in the page' },
    ],
    aiPrompt: {
      basic: 'Spin a circle while loading.',
      detailed:
        'After a button is tapped, show a spinner and disable it, replacing the label with "Saving…". For page-level loading use a 24px spinner with a line reading "Loading your photos…", and after 10 seconds offer a retry.',
      implementation:
        'An SVG circle rotating via stroke-dasharray, animation: spin 0.8s linear infinite (linear is mandatory — easing makes it look janky). Spinner inside a button at 16px, with the button width locked (use min-width so nothing reflows). Page level: a 24px spinner + 13px text, centered. After 10 seconds, use setTimeout to show "This is taking longer than usual" + a "Retry" link. Under prefers-reduced-motion, replace the rotation with three static dots.',
    },
    badPrompt: 'Show a spinner while loading.',
    betterPrompt:
      'Use a spinner for loading: an SVG ring rotating at 0.8s linear, 16px inside a button with the button width unchanged, 24px with "Loading…" text at page level, a retry option after 10 seconds, and static dots under reduced-motion.',
    aliases: ['spinner', 'loading spinner', 'loading indicator', 'spinner ring', 'busy indicator'],
    tags: ['waiting', 'no-progress', 'simple'],
  },

  'skeleton': {
    oneLine:
      'Before the data arrives, lay out the future layout using grey blocks so the shape of the page is already on screen.',
    description:
      'The value of a skeleton is that it removes the sense of the page being assembled. Users see the shape of the content first and the content itself second, and perceived wait time drops noticeably. What makes it more sophisticated than a spinner is that it also communicates what this page is going to look like.',
    looksLike:
      'The grey avatar squares, title bars and image placeholders you see when you open a feed before it has finished loading — that is a skeleton screen.',
    fitsFor: 'First load · List pagination · Predictable structure',
    whenToUse: [
      { situation: 'First load of a page with a predictable structure', recommended: true },
      { situation: 'The wait is longer than 1 second', recommended: true },
      { situation: 'Users need to understand the page structure up front', recommended: true },
      { situation: 'Pagination loads more items (appended to the bottom of the list)', recommended: true },
      { situation: 'The structure is unpredictable (infinite scroll with unknown content)', recommended: false },
    ],
    whenNotToUse: [
      'If the data comes back in 200ms, the skeleton flashing by is itself a distraction — enforce a minimum display time (say 300ms).',
      'The skeleton shapes must match the real content exactly, otherwise users see the layout jump when it is replaced.',
    ],
    anatomy: [
      { label: 'Block', note: 'Corner radius identical to the real element' },
      { label: 'Shimmer', note: 'Optional looping highlight animation' },
      { label: 'Layout Mirror', note: 'Shapes correspond to the real content' },
      { label: 'Fade Out', note: 'Skeleton disappears when the data arrives' },
    ],
    aiPrompt: {
      basic: 'Show grey placeholders while loading.',
      detailed:
        'Use a skeleton for the loading list: show six grey placeholder blocks matching the height of the real cards, with a shimmer sweeping across, and fade them out into the real content when the data arrives.',
      implementation:
        'Each placeholder block must have exactly the same height, width and spacing as the real card (especially the first text line at about 60% width and the second at 40%, to mimic real line lengths). Background #E6E3DB (softer than pure grey), shimmer via a linear-gradient sweeping left to right, 1.5s period, opacity from 0.4→0.9. If loading is fast, add a "minimum 300ms display" delay to avoid a flash. Under prefers-reduced-motion, drop the shimmer and show static grey blocks.',
    },
    badPrompt: 'Show grey placeholder blocks while loading.',
    betterPrompt:
      'Use a skeleton for the loading list: placeholder blocks sized exactly like the real cards (text lines simulating 60%/40% widths), light grey background with a 1.5s shimmer sweep, fading out when data arrives, a "minimum 300ms display" guard for fast loads, and no shimmer under reduced-motion.',
    aliases: ['skeleton', 'skeleton screen', 'skeleton loader', 'placeholder', 'grey placeholder', 'content placeholder'],
    tags: ['placeholder', 'layout-preview', 'perception'],
  },

  'empty-state': {
    oneLine:
      'The block you show when a list is completely empty — it should explain why it is empty and what to do next.',
    description:
      'The empty state is the most underrated pattern in the set. The default implementation is the words "No data", which wastes the single most confusing moment a user has. A good empty state carries three things: why it is empty, what can be done, and which button to press.',
    looksLike:
      'A brand-new album saying "No photos yet — take one" with a camera icon and a "New album" button.',
    fitsFor: 'First run · No search results · All done',
    whenToUse: [
      { situation: 'A list, search result, or inbox has nothing in it', recommended: true },
      { situation: 'It is the user first time and the page is completely blank', recommended: true },
      { situation: 'A filter combination returned no results', recommended: true },
      { situation: 'A task is finished (every item on a checklist is done)', recommended: 'mostly' },
      { situation: 'The content is merely still loading', recommended: false },
    ],
    whenNotToUse: [
      'Three kinds of empty state need different treatment: "never created anything", "no results for this filter", and "task complete" — the copy and the recommended action are completely different.',
      'The empty-state illustration is a supporting actor, not the star.',
    ],
    anatomy: [
      { label: 'Illustration', note: 'Light line art, nothing too busy' },
      { label: 'Title', note: 'Names the current state' },
      { label: 'Description', note: 'Why it is empty + how to fill it' },
      { label: 'Primary Action', note: 'One unambiguous button' },
    ],
    aiPrompt: {
      basic: 'Show a message when there is no data.',
      detailed:
        'When a search returns nothing, show an empty state: the title "No photos match your search", the description "Try removing some filters or searching for something else", and the primary action "Clear all filters".',
      implementation:
        'Vertically centered layout, max-width 320px, with 24px between illustration and title, 12px between title and description, 8px between description and button, 16px to the button. Write three distinct sets of copy: "first run" (the value plus a primary CTA that creates something), "no results for this filter" (how to loosen the filter, with a clear-filters button), and "all done" (a celebratory tone, optionally with no button at all). Never style an empty state like a skeleton (grey blocks) — it has to say clearly "this is empty, not loading".',
    },
    badPrompt: 'Show "no data" when there is no data.',
    betterPrompt:
      'Write the empty state in three parts: a title naming the current state + a description explaining why it is empty and how to fill it + one clear primary action. Keep the copy distinct for "first run / no filter results / task complete", and never reuse the skeleton styling.',
    aliases: ['empty state', 'blank state', 'zero state', 'no results state', 'empty placeholder', 'nothing here yet'],
    tags: ['guidance', 'explanation', 'next-step'],
  },

  'error-state': {
    oneLine:
      'Something actually broke — not "no data", genuinely broken — and the user has to be told what to do about it.',
    description:
      'An error state and an empty state are two different things. An empty state means there was never anything; an error state means there should have been something and the app could not get it. The latter must offer a retry and an explanation, not just a sad face.',
    looksLike:
      '"Could not load photos. Check your connection and try again" with a "Retry" button, shown in the exact spot where the list content should have been.',
    fitsFor: 'Network failure · Permissions · Service outage',
    whenToUse: [
      { situation: 'A data request failed', recommended: true },
      { situation: 'A permission was denied (camera, photos)', recommended: true },
      { situation: 'The device is in a bad state (offline, out of storage)', recommended: true },
      { situation: 'The input format is invalid', recommended: 'mostly' },
      { situation: 'The content genuinely does not exist', recommended: false },
    ],
    whenNotToUse: [
      'Do not show users raw technical strings like "Error 500" or "ECONNREFUSED".',
      'A permission error has to offer a "Open settings" shortcut instead of just stating that permission is missing and leaving the user stuck.',
    ],
    anatomy: [
      { label: 'Icon', note: 'A warning or broken-connection symbol, visually toned down' },
      { label: 'Title', note: 'Plain language, no error codes' },
      { label: 'Reason', note: 'Expandable technical detail' },
      { label: 'Recovery', note: 'Such as "Retry" or "Open settings"' },
    ],
    aiPrompt: {
      basic: 'Show an error when the request fails.',
      detailed:
        'When a list fails to load, show an error state: "Could not load photos", "Check your network connection", and a "Retry" button, with the technical error code tucked inside a collapsible "Details" section.',
      implementation:
        'Same position and styling as the empty state, different copy. The title is plain language ("Could not load photos"), the supporting line gives the cause and the way out, and the technical code goes inside a <details> element, collapsed by default. Branch by error type: network error → "Retry"; permission denied → "Open settings" and launch the system settings; 404 → "This content may have been deleted" + "Go back"; 5xx → "The service is temporarily unavailable" + "Retry" + "Try again later". Show a loading state on the retry button so it cannot be double-submitted.',
    },
    badPrompt: 'Show an error message when loading fails.',
    betterPrompt:
      'Write the error state as plain-language title + cause + recovery action: "Retry" for network errors, "Open settings" (launching settings) for permission errors, "Go back" for 404, put the technical code in a <details> collapsed by default, and show a loading state on the retry button to prevent double submits.',
    aliases: ['error state', 'error page', 'failure state', 'error screen', 'oops screen', 'something went wrong'],
    tags: ['recovery', 'cause', 'retry'],
  },

  'success-state': {
    oneLine:
      'A task is completely finished — it deserves a page of its own, not just a spinner that stops.',
    description:
      'When a flow completes (an order submitted, a signup finished, a post published), give it a proper success page: confirmation, a look at the result, and the next step. The difference from a toast is that a success page is where you stay, while a toast is something you pass by.',
    looksLike:
      'A big "Published" heading, a preview of what was just posted, and two buttons: "View" and "Back to home".',
    fitsFor: 'Publishing · Ordering · Sign-up complete',
    whenToUse: [
      { situation: 'The final step of a multi-step flow has completed', recommended: true },
      { situation: 'The action produced something visible', recommended: true },
      { situation: 'The user probably wants to look at the result next', recommended: true },
      { situation: 'A small action is done (saving a setting)', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Firing up a full success page for a small action like "Saved" is overkill — use a toast.',
      'A success page should immediately tell the user where the result is, not just that it worked.',
    ],
    anatomy: [
      { label: 'Check Icon', note: 'A checkmark or a light illustration' },
      { label: 'Title', note: 'Such as "Published"' },
      { label: 'Result', note: 'Shows the thing that was just created' },
      { label: 'Next Action', note: 'View / Go back / Do it again' },
    ],
    aiPrompt: {
      basic: 'Show a success page when the action completes.',
      detailed:
        'After publishing succeeds, show a success page: a green checkmark, the heading "Published", a thumbnail preview of what was just published, and two buttons, "View" and "Back to home".',
      implementation:
        'Centered layout, max-width 420px. The checkmark is an SVG stroke-dashoffset animation over 400ms. Title at 20px medium, with the result preview below it (a thumbnail or a summary card). Buttons at the bottom: "View" (primary, opens what was just created) and "Back to home" (secondary). This page should not allow browser back (going back would resubmit), so intercept with onbeforeunload where necessary.',
    },
    badPrompt: 'Show a success page when it is done.',
    betterPrompt:
      'Show a success page when the flow completes: a green checkmark with a stroke animation, the heading "Published", a thumbnail preview of what was just created, "View" (primary) and "Back to home" (secondary), and intercept browser back to prevent a duplicate submit.',
    aliases: ['success state', 'success page', 'confirmation page', 'done state', 'completion screen', 'all set screen'],
    tags: ['complete', 'result', 'next-step'],
  },

  'service-card': {
    oneLine:
      'The signature interactive widget of HarmonyOS — surfacing live app status and high-frequency services directly on the home screen without opening the app.',
    description:
      'Service Card (Universal Widget / Service Card) is the flagship micro-interface paradigm in HarmonyOS ArkUI. It transcends traditional isolated apps by condensing essential data and state (such as real-time ride tracking, delivery status, flight check-in, media playback, and fitness metrics) into 2x2, 2x4, or 4x4 desktop micro-windows. Users can view dynamic updates at a glance, trigger one-tap actions like play/pause directly on the card, or launch lightweight atomic services without full installation.',
    looksLike:
      'The weather or to-do memo widget pinned to a Huawei home screen that lets you check off tasks or glance at city temperatures without launching the main application.',
    fitsFor: 'Desktop widgets · live ambient status · zero-install atomic services',
    whenToUse: [
      { situation: 'Time-sensitive or ambient app state needs continuous visibility (delivery tracking, market tickers, calendar reminders)', recommended: true },
      { situation: 'Providing ultra-fast single-tap actions (music playback toggle, smart home switch, one-tap check-in)', recommended: true },
      { situation: 'Serving as a direct interactive gateway into lightweight HarmonyOS atomic services', recommended: true },
      { situation: 'Overloading the widget with deep multi-step forms or long scrolling lists (redirect to the app instead)', recommended: false },
    ],
    whenNotToUse: [
      'Do not treat service cards as mini-browsers; space is constrained and requires restrained, high-signal information.',
      'Avoid complex nested scrolling lists or multi-level navigation within desktop cards to avoid degrading home screen swipe physics.',
    ],
    anatomy: [
      { label: 'Card Container', note: 'Standard grid form factor (2x2: 150x150, 2x4: 310x150) with 16-24px rounded corners' },
      { label: 'Header / Brand', note: 'App micro-icon and card name at the top left' },
      { label: 'Key Visual / Data', note: 'Large display numerals, dynamic sparkline charts, or state badges' },
      { label: 'Quick Action', note: 'Micro-buttons and pill actions triggering card actions or atomic service routing' },
    ],
    aiPrompt: {
      basic: 'Create a HarmonyOS desktop service card.',
      detailed:
        'Build a 2x2 weather service card following HarmonyOS ArkUI specs: ambient desktop widget displaying live temperature, weather icon, air quality, and one-tap refresh.',
      implementation:
        'Implement according to ArkUI service card guidelines: 2x2 square card (156px x 156px, rounded-3xl, subtle border border-line, Morandi gradient glassmorphism). Top header with 16px app icon and "Weather" title. Center body features 32px bold temperature and vector weather art. Bottom capsule status "Updated 10m ago". Outer card dispatches postCardAction router event to open atomic service.',
    },
    badPrompt: 'Draw a phone widget.',
    betterPrompt:
      'Follow HarmonyOS ArkUI Service Card specs: conform to standard 2x2 grid dimensions, expose vital live metrics and micro-actions, and support zero-install atomic service launching.',
    aliases: ['service card', 'harmonyos widget', 'atomic service card', 'desktop widget', 'universal card'],
    tags: ['HarmonyOS', 'ArkUI', 'service card', 'widget', 'atomic service'],
  },
};

