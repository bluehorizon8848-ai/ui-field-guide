import type { PatternTranslations } from './types';

// English copy for src/data/patterns/input.ts — form controls.
export const inputPatterns: PatternTranslations = {
  'text-field': {
    oneLine:
      'A bordered box the user types into — the most basic input control there is, and the one whose quality varies the most.',
    description:
      'The Text Field is the most fundamental input component. Good ones and bad ones differ in ways that are easy to miss: whether there is a real label ("Email" or "Enter your email address"), where the error message appears, and whether the field grows to hold multiple lines.',
    looksLike:
      'The "Email" and "Password" fields on a sign-up page, a search box, the single line that pops up the keyboard when you tap it in a notes app — all Text Fields.',
    fitsFor: 'Forms · Search · Editing content',
    whenToUse: [
      { situation: 'The user needs to enter free-form text', recommended: true },
      { situation: 'The expected input is long but its length is predictable', recommended: true },
      { situation: 'The value needs format validation (email, phone number)', recommended: true },
      { situation: 'There are fewer than 5 options', recommended: false },
      { situation: 'What the user types should not be logged or displayed', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Password entry belongs in a dedicated Password Field with a show/hide toggle and strength feedback.',
      'Data with a fixed format (dates, choices) should use a purpose-built control instead of making the user type it.',
    ],
    anatomy: [
      { label: 'Label', note: 'Sits above the field and says what belongs here' },
      { label: 'Container', note: '1px border, 8px radius, 44px tall' },
      { label: 'Placeholder', note: 'Never a substitute for the label' },
      { label: 'Helper Text', note: 'Always-on text below, e.g. the password rules' },
      { label: 'Error State', note: 'Red border plus red explanatory text below' },
    ],
    aiPrompt: {
      basic: 'Add a text field.',
      detailed:
        'Add an email field: a Label reading "Email" on top, always-on helper text "Used to receive notifications" below, format validation on blur, and on error a red border with red explanatory text underneath.',
      implementation:
        'A <div> containing a <label> (14px, #4A4740) + <input type="email">. The field is 44px tall with a 1px #E6E3DB border, 8px radius, and 12px padding; on focus the border turns #1A1917 and gains a 3px translucent outer glow. The placeholder is #7A766D and must not replace the label. Validation fires on blur; the error state is a #A8342C border plus 13px red text below reading "Enter a valid email address", together with aria-invalid="true" and aria-describedby pointing at the error text.',
    },
    badPrompt: 'Add a box people can type in.',
    betterPrompt:
      'Add an email Text Field: a Label reading "Email" on top (the placeholder must not replace the label), validation on blur, and on error a #A8342C border + red explanatory text below + aria-invalid.',
    aliases: ['text field', 'text input', 'textbox', 'single-line input', 'input box', 'edit field'],
    tags: ['input', 'validation', 'label'],
  },
  'text-area': {
    oneLine: 'A text field that wraps onto multiple lines, for content that runs longer than a sentence.',
    description:
      'The only real difference between a Text Area and a Text Field is that its height can change, so it can hold a paragraph. The key design point: never ship a short default height — a box that is two lines tall tells the user two lines is all the room they get.',
    looksLike:
      'Comment boxes, message-board composers, the body editor in a notes app, the issue description field on GitHub — all Text Areas.',
    fitsFor: 'Comments · Notes · Descriptions',
    whenToUse: [
      { situation: 'The input is paragraph-length (a comment, a note, a description)', recommended: true },
      { situation: 'You cannot predict how much the user wants to write', recommended: true },
      { situation: 'The content needs a formatted preview (Markdown)', recommended: true },
      { situation: 'The answer is a single character (e.g. a verification code)', recommended: false },
    ],
    whenNotToUse: [
      'A 2-row default discourages people who write long — start at 4–6 rows and support auto-grow.',
      'On mobile it fights the on-screen keyboard, so leave room for scrolling.',
    ],
    anatomy: [
      { label: 'Container', note: 'Resizable height, min-height 96px' },
      { label: 'Placeholder', note: 'Use a realistic example sentence' },
      { label: 'Resize Handle', note: 'Draggable from the bottom-right corner on the web' },
      { label: 'Counter', note: 'Shows "128 / 500" in the bottom-right corner' },
    ],
    aiPrompt: {
      basic: 'Add a text field that accepts multiple lines.',
      detailed:
        'Add a comment box: 4 rows tall at minimum, grows automatically with the content, a "0 / 300" character counter in the bottom-right corner, and action buttons revealed on focus.',
      implementation:
        'A <textarea> with min-height: 96px; max-height: 320px; resize: vertical; width: 100%. Auto-grow in JS: on the input event set el.style.height = "auto", read scrollHeight, and only assign when the change exceeds a threshold so it does not jitter. Show 12px grey text "{len} / 300" in the bottom-right corner, switch to the warning color #94701C past 280 characters, and disable submit at 300. If the field is empty on blur, show an error message. On mobile, raise the bottom toolbar on focus so the keyboard does not cover it.',
    },
    badPrompt: 'Add a slightly bigger text field.',
    betterPrompt:
      'Add a multi-line Text Area: min-height of 4 rows + auto-grow (capped at 320px), a "0 / 300" character counter in the bottom-right corner that changes color as you approach the limit.',
    aliases: ['text area', 'textarea', 'multi-line input', 'long text input', 'comment box'],
    tags: ['long text', 'auto-grow', 'character count'],
  },
  'search-field': {
    oneLine: 'An input box built purely for finding things, usually with a magnifier icon and a clear button.',
    description:
      'A Search Field is a stateful input: it does not just accept text, it also renders results, handles the empty result set, and keeps a search history. What separates it from a plain text field is type-ahead search and the ability to clear.',
    looksLike:
      'The pill-shaped field with a magnifier at the top of an app home screen, the search bar at the top of an e-commerce search page, the search box that pops up in Mac Spotlight.',
    fitsFor: 'Content retrieval · Filtering and narrowing',
    whenToUse: [
      { situation: 'There are more than 30 items and the user knows what they want', recommended: true },
      { situation: 'Results should appear as the user types', recommended: true },
      { situation: 'The search space is structured (filter by type or tag)', recommended: true },
      { situation: 'There are only 5 items and they all fit on screen', recommended: false },
      { situation: 'The user cannot articulate what they are looking for (open-ended browsing)', recommended: false },
    ],
    whenNotToUse: [
      'An empty search field must offer popular searches, recent searches, or category entry points — otherwise it is just an empty input.',
      'When there are zero results, you must offer a way out (clear the filters, view everything).',
    ],
    anatomy: [
      { label: 'Search Icon', note: '16px icon on the left' },
      { label: 'Input', note: 'Light gray background to set it apart from a plain text field' },
      { label: 'Clear Button', note: 'An X icon appears once there is text' },
      { label: 'Results', note: 'Dropdown list, navigable with the arrow keys' },
      { label: 'Empty State', note: 'Offers popular queries or suggestions' },
    ],
    aiPrompt: {
      basic: 'Add a search field.',
      detailed:
        'Add a search field: a magnifier on the left, results updating live with a 300ms debounce as the user types, a clear button on the right, and popular-search chips in the empty state.',
      implementation:
        'The container uses position: relative, with the magnifier absolutely positioned 12px from the left and the input at padding-left: 36px. An X button appears on the right when there is text (aria-label="Clear"). Debounce at 300ms and cancel the previous request with AbortController. A results panel pops up below when the field is focused: ↑↓ move the highlight, Enter selects, Esc closes. The empty state (no input or no results) shows popular-search chips that fill the field when clicked.',
    },
    badPrompt: 'Add something people can search with.',
    betterPrompt:
      'Add a Search Field: a magnifier icon on the left, live results with a 300ms debounce, a clear button on the right once there is text, popular-search chips in the empty state, and ↑↓ to move through results.',
    aliases: ['search field', 'search bar', 'search input', 'search box', 'query input'],
    tags: ['search', 'debounce', 'empty state'],
  },
  checkbox: {
    oneLine: 'A small square the user can tick, for picking any number of several independent options at once.',
    description:
      'The semantics of a checkbox are "independent on/off": ticking it does not affect the one next to it. The difference from a radio button is not visual but logical — one allows multiple selections, the other allows exactly one.',
    looksLike:
      'The square at the left of each row in a shopping cart, the check in front of "Allow notifications" in Settings, the circle in front of every item in a to-do list.',
    fitsFor: 'Multi-select · Bulk actions · Accepting terms',
    whenToUse: [
      { situation: 'Any number of several options can be selected', recommended: true },
      { situation: 'You need a "Select all" control', recommended: true },
      { situation: 'An independent toggle (enabling a feature)', recommended: true },
      { situation: 'The options are mutually exclusive and only one can be picked', recommended: false },
      { situation: 'Ticking it triggers a dangerous action immediately', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'A checkbox works for a mandatory declaration such as "I agree to the terms", but it is a poor stand-in for an explicit "Agree and continue" action.',
      'On mobile, make the whole row tappable in a checklist — a 16px checkbox on its own is a very small target.',
    ],
    anatomy: [
      { label: 'Box', note: '18–20px with a 1.5px border' },
      { label: 'Check Mark', note: 'Appears when selected, optionally animated' },
      { label: 'Label', note: 'Left-aligned with the box on the same baseline' },
      { label: 'Indeterminate', note: 'Shows a dash when only some children are checked' },
      { label: 'Disabled', note: 'Checked but no longer changeable' },
    ],
    aiPrompt: {
      basic: 'Add a few boxes that can be ticked.',
      detailed:
        'Add a checkbox list with a Select all control: the "Select all" row at the top supports an indeterminate state, every row is tappable across its full width, and the selected count shows on the right.',
      implementation:
        'Wrap each item in a <label> around input[type=checkbox] plus the text so the whole row becomes the hit target. Derive the "Select all" checked state from the children: all selected = true, some selected = true with indeterminate=true (set as a DOM property via ref). The half-selected box shows a dash rather than a check mark. Show "3 selected" live at the top of the list. On mobile, pad the label out to 44px tall.',
    },
    badPrompt: 'Add a few options people can tick.',
    betterPrompt:
      'Add a Checkbox list: the whole row is tappable (label wraps the input), a "Select all" row with an indeterminate state, a live selected count at the top, and rows at least 44px tall for comfortable mobile tapping.',
    aliases: ['checkbox', 'multi-select box', 'selection box', 'tick control', 'checkbox group'],
    tags: ['multi-select', 'select all', 'indeterminate'],
  },
  radio: {
    oneLine: 'A row of circles where picking one clears the others — one choice, immediately visible.',
    description:
      'The value of a radio button is mutual exclusivity. It is faster than a select dropdown because every option is visible and scannable in one pass, but it costs vertical space. With fewer than 5 options it is usually better than a select.',
    looksLike:
      'The two circles for "Personal / Business" on a sign-in page, the round options in a photo-size picker, the circles in front of each payment method.',
    fitsFor: 'Either-or choices · Plan selection · Settings',
    whenToUse: [
      { situation: 'There are 2–5 mutually exclusive options', recommended: true },
      { situation: 'The user needs to see and compare all the options', recommended: true },
      { situation: 'Each option carries a line of descriptive text', recommended: true },
      { situation: 'There are more than 7 options', recommended: false },
      { situation: 'The user needs to be able to choose "none"', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Once a radio option is selected, one of them is always selected. If skipping is legitimate, add a "None of the above" option or switch to a select.',
      'Past 7 options, use a select dropdown instead — otherwise the page grows very long.',
    ],
    anatomy: [
      { label: 'Circle', note: '18px with a 1.5px outer ring' },
      { label: 'Dot', note: 'A filled circle appears when selected' },
      { label: 'Label', note: 'A heading plus an optional description' },
      { label: 'Group', note: 'Wrapped in a fieldset + legend' },
    ],
    aiPrompt: {
      basic: 'Add a few radio buttons.',
      detailed:
        'Add a group of radio buttons: Personal / Business. Each option has a line of description beneath it, the whole row is tappable, and the dot fills in when selected.',
      implementation:
        'Wrap the whole group in a <fieldset> + <legend> (the legend can be visible as the group title or hidden). Each option is a <label> containing input[type=radio] name="accountType" plus the content. Rows get 12px padding, an 8px radius, and a #F2F0EB hover background. On selection the dot expands with a scale animation from 0. Keyboard: ↑↓ move within the group and select as they go, and Tab stops on the group only once, on its first member. Always define a default selection — never drop the user into an empty required group.',
    },
    badPrompt: 'Add a few circles and let the user pick one.',
    betterPrompt:
      'Add a Radio group (Personal / Business): wrapped in fieldset+legend, each option tappable across the full row with descriptive text, 12px padding between options, ↑↓ to move between them, and a default selection already made.',
    aliases: ['radio button', 'radio', 'single-select', 'radio option', 'dot selector'],
    tags: ['exclusive', 'single choice', 'visible options'],
  },
  switch: {
    oneLine: 'A control that slides left and right, on or off, with the state always plainly visible.',
    description:
      'A switch communicates whether a feature is currently on. The difference from a checkbox is a difference in tense: a checkbox says "you ticked this action", a switch says "this state is on". A checkbox usually takes effect on submit; a switch takes effect immediately.',
    looksLike:
      'The slider at the right end of a "Dark mode" or "Notifications" row in Settings, every green rounded switch in iOS Settings, the "Autoplay video" toggle in an app preferences screen.',
    fitsFor: 'Settings · Feature toggles · Mode switching',
    whenToUse: [
      { situation: 'A feature is on or off and the change takes effect immediately', recommended: true },
      { situation: 'The current state must be visible at a glance', recommended: true },
      { situation: 'The state itself carries meaning (on = power-saving mode)', recommended: true },
      { situation: 'The change should only take effect after confirmation', recommended: false },
      { situation: 'The selection has to be submitted along with a form', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'A switch should not need a tooltip explaining what "on" and "off" mean — if it does, use a checkbox with explicit copy instead.',
      'When flipping it has serious consequences (turning it off loses data), pair the switch with a confirmation or an undo.',
    ],
    anatomy: [
      { label: 'Track', note: '40×24px, turns the primary color when on' },
      { label: 'Thumb', note: 'A 20px circle that lifts with a shadow while dragging' },
      { label: 'Label', note: 'Describes the feature, not the state' },
      { label: 'State Label', note: 'Optional, reads "On / Off"' },
    ],
    aiPrompt: {
      basic: 'Add a switch.',
      detailed:
        'Add a settings row: the title "Dark mode" plus a line of description on the left, a switch on the right. Toggling takes effect immediately and confirms with a toast.',
      implementation:
        'button role="switch" aria-checked={on}, placed to the right of the label text. The track is 44×26px with a fully rounded radius, #D8D5CD when off and #2C7355 when on, with a 22px white thumb carrying a shadow and an 18px travel. The toggle animates over 180ms cubic-bezier. The whole row is tappable. On toggle, write the system setting immediately and show a toast reading "Dark mode on"; if the change would lose data, show a confirmation Dialog first. When disabled, drop the whole row to 40% opacity and add disabled.',
    },
    badPrompt: 'Add something that can be turned on and off.',
    betterPrompt:
      'Add a Switch settings row: role="switch" + aria-checked, a 44×26px track, a 22px thumb, the change takes effect immediately with a confirmation toast, the whole row is tappable, and it does not use checkbox semantics.',
    aliases: ['switch', 'toggle switch', 'toggle', 'on-off switch', 'flip switch', 'switch control'],
    tags: ['on/off', 'instant apply', 'visible state'],
  },
  slider: {
    oneLine: 'A track you drag left or right to land on a value, with the current number always shown beside it.',
    description:
      'A slider is for finding a value inside a continuous or stepped range — volume, brightness, filter intensity. It has one fatal weakness: the exact value is neither visible nor clickable, so you must always display the current number alongside it.',
    looksLike:
      'The brightness bar on a phone, the focus slider in a camera app, the "Filter intensity" control in a photo editor, the drag bars in the macOS trackpad settings.',
    fitsFor: 'Volume · Brightness · Filter intensity',
    whenToUse: [
      { situation: 'The value comes from a continuous range (0–100)', recommended: true },
      { situation: 'The user is tuning to a feel rather than to an exact number', recommended: true },
      { situation: 'The result can be previewed live while dragging', recommended: true },
      { situation: 'An exact number has to be entered', recommended: false },
      { situation: 'The two ends of the range mean completely different things', recommended: false },
    ],
    whenNotToUse: [
      'When you need precisely 87%, a slider loses to a text field with stepper buttons.',
      'Do not forget a numeric readout and full keyboard support, or the control is unusable for many people.',
    ],
    anatomy: [
      { label: 'Track', note: 'A thin 3px rounded line in gray' },
      { label: 'Filled', note: 'The passed portion is tinted' },
      { label: 'Thumb / Handle', note: 'An 18px circle that grows to 22px while dragging' },
      { label: 'Value Label', note: 'Shows the current value' },
      { label: 'Bounds', note: 'What each end means (Light / Full)' },
    ],
    aiPrompt: {
      basic: 'Add a slider the user can drag.',
      detailed:
        'Add a filter intensity slider: 0–100, the value shown live on the right, a preview thumbnail above while dragging, and arrow keys adjusting by 5.',
      implementation:
        'Use <input type="range" min=0 max=100 value> and style it completely: ::-webkit-slider-thumb as an 18px white circle with a shadow, growing to 22px on focus/active. Tint the track with a background linear-gradient driven by the percentage. Show the value in a fixed 44px column on the right (tabular-nums so it does not jitter). Keyboard: ←/↓ subtract 5, →/↑ add 5, Home/End jump to the ends, PageUp/PageDown move by 10. Update the preview live via onInput during the drag and only commit on release.',
    },
    badPrompt: 'Add a bar you can drag.',
    betterPrompt:
      'Add a Slider (0–100): the value in a fixed-width column on the right (tabular-nums), a live preview while dragging that commits on release, ←/→ adjusting by 5, and Home/End jumping to the ends.',
    aliases: ['slider', 'range slider', 'range input', 'drag bar', 'value slider', 'slider control'],
    tags: ['continuous value', 'live preview', 'keyboard'],
  },
  select: {
    oneLine: 'A box that opens downward into a list of options and collapses again once you pick one.',
    description:
      'A select trades space for clarity: collapsed it occupies a single row, expanded it shows every option at once. With fewer than 5 options, radio buttons are usually better — a select costs the user two clicks.',
    looksLike:
      'A "Select city" field in a form, the dropdown in an Excel cell, the select box in every settings screen.',
    fitsFor: 'Forms · Many options · Filtering',
    whenToUse: [
      { situation: 'There are more than 5 options and listing them all is too long', recommended: true },
      { situation: 'The options are peers with no hierarchy', recommended: true },
      { situation: 'The list needs to be searchable (20+ options)', recommended: true },
      { situation: 'There are fewer than 5 options', recommended: false },
      { situation: 'Multiple selections are needed', recommended: false },
    ],
    whenNotToUse: [
      'A native select on mobile raises the system picker, which behaves very differently from the web version — plan for that gap.',
      'When picking a value changes the interface in ways the user must understand, a select gives them no context to explain it.',
    ],
    anatomy: [
      { label: 'Trigger', note: 'Shows the current value + ChevronDown' },
      { label: 'Menu', note: 'Positioned relative to the trigger' },
      { label: 'Option', note: '40px tall, the selected one carries a Check' },
      { label: 'Search', note: 'Essential once there are many options' },
      { label: 'Group', note: 'Options grouped with dividers' },
    ],
    aiPrompt: {
      basic: 'Add a dropdown select.',
      detailed:
        'Add a city select dropdown: 30+ options, a search field at the top of the expanded menu, and the chosen option shown in the trigger with a Check mark.',
      implementation:
        'A button[aria-haspopup="listbox"] acts as the trigger, with the menu positioned below it using a Popover. The menu uses role="listbox" and options use role="option" aria-selected. ↑↓ move, Enter selects, Esc closes and returns focus to the trigger, Home/End jump to the ends. Past 15 options, add a search input at the top and focus it automatically. When there is not enough room on screen, flip the menu upward automatically. Close on outside click. Trigger height 44px.',
    },
    badPrompt: 'Add a dropdown you can pick from.',
    betterPrompt:
      'Add a Select: a button[aria-haspopup=listbox] as the trigger, a menu with role=listbox and options with aria-selected, working ↑↓/Enter/Esc keyboard support, a search field when there are many options, and a menu that flips upward near the bottom of the screen.',
    aliases: ['select', 'dropdown', 'select box', 'dropdown menu', 'select menu', 'combo box'],
    tags: ['collapsed options', 'keyboard', 'popup'],
  },
  chip: {
    oneLine: 'A small rounded pill holding a few words — sometimes selectable, sometimes purely a label.',
    description:
      'Chips have two distinct uses that are easy to confuse: an input chip is interactive (filterable, selectable, removable), while a display chip is a read-only label for a category or status. When you see a pill in a UI, first work out whether it is clickable.',
    looksLike:
      'Topic tags on a social feed, labels on GitHub, the filter pills above a search results page, the "keyword ✕" entries already filled into an input.',
    fitsFor: 'Filtering · Categorization · Selected tags',
    whenToUse: [
      { situation: 'Multi-select filtering (several conditions active at once)', recommended: true },
      { situation: 'Showing the category or status of content', recommended: true },
      { situation: 'Showing selected tags inside an input, removable', recommended: true },
      { situation: 'Marking a primary action', recommended: false },
      { situation: 'Acting as a button that navigates somewhere', recommended: false },
    ],
    whenNotToUse: [
      'A chip with no close button cannot be undone — users get trapped in the filter. A filterable chip must be removable.',
      'Do not pile on too many selectable chips; they smear into a wall and nobody knows where to tap.',
    ],
    anatomy: [
      { label: 'Container', note: 'Fully rounded, padding 6px 12px' },
      { label: 'Label', note: '12–14px' },
      { label: 'Selected', note: 'Filled with the primary color or marked with a check' },
      { label: 'Remove', note: 'The ✕ in input scenarios' },
    ],
    aiPrompt: {
      basic: 'Add a few small tags.',
      detailed:
        'Add a group of filterable chips: All / Portrait / Landscape / Night. Multiple selections are allowed, the selected state fills with the primary color, and the filtered results update live.',
      implementation:
        'Each chip is a <button role="checkbox" aria-checked>, or a group of radios if the selection is single-select. Unselected: #F2F0EB background with #4A4740 text. Selected: #1A1917 background with white text. Drive the toggle with React state and keep the filtering logic in the parent. Filter chips must be reversible — tapping again returns to "All". Lay the chip group out horizontally with flex-wrap and an 8px gap.',
    },
    badPrompt: 'Add a few tags.',
    betterPrompt:
      'Add a group of filterable chips (multi-select): light gray when unselected, solid dark fill when selected with aria-checked kept in sync, tapping again to clear, and results filtering live.',
    aliases: ['chip', 'tag', 'pill', 'filter chip', 'label pill', 'chip group'],
    tags: ['pill', 'filterable', 'multi-select'],
  },
  'date-picker': {
    oneLine: 'A calendar that pops open on click so the user can pick a specific day, with invalid dates greyed out.',
    description:
      'The hard part of a date picker is not popping up a calendar — it is making the constraints legible. Birth dates cannot be in the future, past dates must be greyed out, and the allowed span has to be explained. All of that has to be visible directly on the calendar.',
    looksLike:
      'Choosing a departure date when booking a flight, picking a visit day for an appointment, setting a date range in an analytics dashboard — a month calendar that pops up on click.',
    fitsFor: 'Appointments · Rentals · Billing · Travel',
    whenToUse: [
      { situation: 'The user needs to pick one specific date', recommended: true },
      { situation: 'The date has validity constraints (no past dates)', recommended: true },
      { situation: 'Getting it wrong is costly (appointments, lease terms, invoices)', recommended: true },
      { situation: 'The user needs to pick a range of dates', recommended: 'mostly' },
      { situation: 'Only an approximate month or year is needed', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Making someone open a calendar twice just to fill in a date is often worse than letting a text field accept a format like 2026-03-15.',
      'Remember: never make users fail on format. Accept several input formats and correct them afterward.',
    ],
    anatomy: [
      { label: 'Trigger', note: 'Shows the chosen date or a placeholder' },
      { label: 'Calendar', note: 'A 7×6 grid' },
      { label: 'Valid / Disabled', note: 'Disabled days greyed out and unclickable' },
      { label: 'Selected', note: 'Filled with the primary color' },
      { label: 'Range Highlight', note: 'Highlights the middle of a selected range' },
    ],
    aiPrompt: {
      basic: 'Add a date picker.',
      detailed:
        'Add a date picker: defaults to today, past dates cannot be selected and are greyed out in the month calendar, and the chosen date is written back into the input.',
      implementation:
        'A trigger of <input type="date">, or a custom button plus a popover calendar. The calendar is 7 columns × 6 rows, and the header shows "March 2026" with left and right arrows. Non-selectable dates get disabled + 40% opacity. The selected day is filled #1A1917 with white text. Today gets a ring around it. Clicking a date closes the calendar and writes the value back into the input formatted as "2026-03-15". Keyboard: arrow keys move between dates, Enter selects, Esc closes.',
    },
    badPrompt: 'Add something for picking a date.',
    betterPrompt:
      'Add a Date Picker: defaults to today, past dates greyed out and disabled, the selected day filled with the primary color, today marked with an outline, arrow keys to move, Enter to select, Esc to close.',
    aliases: ['date picker', 'calendar picker', 'date field', 'date selector', 'calendar popover'],
    tags: ['date', 'constraints', 'calendar'],
  },
  'file-upload': {
    oneLine: 'Lets the user get a file from their device into your app, with progress, cancellation, and retry along the way.',
    description:
      'The real difficulty of file upload lives in the "uploading" and "failed" states. Success is visible by itself; failure is routinely ignored. A competent upload control needs progress, cancellation, retry on failure, and a clear statement of format and size limits.',
    looksLike:
      'Picking an image in a chat app, importing photos from a gallery app, the "Upload avatar" box in an admin panel, the dashed drop zone in a web form.',
    fitsFor: 'Images · Documents · Media import',
    whenToUse: [
      { situation: 'You need to receive images, documents, or media files', recommended: true },
      { situation: 'Both drag-and-drop and click-to-pick should work', recommended: true },
      { situation: 'Large files need visible progress and a way to cancel', recommended: true },
      { situation: 'Only one image is needed (avatar, cover)', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'On mobile, request photo and file permissions up front — and when permission is denied, explain why and link to Settings.',
      'Always state the format and size limits before the upload starts, never after the user has waited five minutes.',
    ],
    anatomy: [
      { label: 'Drop Zone', note: 'Dashed border, supports both click and drop' },
      { label: 'File List', note: 'Thumbnail + name + size' },
      { label: 'Progress', note: 'A progress bar plus a percentage' },
      { label: 'Cancel / Retry', note: 'Cancelable while running, retryable after a failure' },
      { label: 'Constraint', note: 'Format, size, and count limits' },
    ],
    aiPrompt: {
      basic: 'Add an image upload feature.',
      detailed:
        'Add an image upload zone: supports click and drag, accepts jpg/png only, caps each file at 10MB, and shows a thumbnail and progress bar per file with cancel and retry.',
      implementation:
        'The drop zone uses a 2px dashed #D8D5CD border and highlights to #1A1917 on drag-over. Set accept="image/jpeg,image/png" and validate size ≤10MB on the client before firing the request. On failure show a red "File exceeds 10MB" message on the file item plus a "Try again" link. Each file item contains a 48×48 thumbnail, the file name, the size, a progress bar (uploaded / total), and a "✕" cancel button. Use XMLHttpRequest rather than fetch so you can read upload.onprogress.',
    },
    badPrompt: 'Add an upload button for files.',
    betterPrompt:
      'Add a file upload zone: supports click and drag, accept limits the format, size is validated on the client, each file shows a thumbnail + progress bar + cancel button, failures can be retried, and the format and size limits are stated up front.',
    aliases: ['file upload', 'upload', 'drop zone', 'drag-and-drop upload', 'attachment upload', 'file picker'],
    tags: ['file', 'progress', 'error state'],
  },
};