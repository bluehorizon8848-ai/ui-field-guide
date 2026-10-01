// English translation data for the navigation and actions pattern entries.

import type { PatternTranslations } from './types';

export const navigationActionPatterns: PatternTranslations = {
  'breadcrumb': {
    oneLine:
      'When the page hierarchy is deep, a trail like "Home › Settings › Privacy" sits at the top and answers "which level am I on?"',
    description:
      'A breadcrumb is a clickable trail of ancestor levels. It is not meant for jumping anywhere — that is what a nav menu is for. It answers exactly one question: where am I, and how do I go back up one level?',
    looksLike:
      'You open the details of a photo in a gallery app and the top of the page shows "‹ Albums › 2024 › IMG_0231". Tapping "2024" goes back up a level. That is a breadcrumb.',
    fitsFor: 'Admin panels · content sites · deep pages',
    whenToUse: [
      { situation: 'The page hierarchy is 3+ levels deep', recommended: true },
      { situation: 'Users may want to step back up a level', recommended: true },
      { situation: 'Content sites and admin dashboards', recommended: true },
      { situation: 'Apps with a single level of structure (home → detail)', recommended: false },
      { situation: 'Mobile bottom navigation already provides enough orientation', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'With only one or two levels, a breadcrumb is just noise — a back button is enough.',
      'On narrow mobile screens it is often replaced by the back arrow in the app bar.',
    ],
    anatomy: [
      { label: 'Root / Home', note: 'Usually the home page or the product name' },
      { label: 'Ancestors', note: 'The levels in between, clickable to go back up' },
      { label: 'Current', note: 'The last segment, not clickable' },
      { label: 'Separator', note: 'The › / / / ›› glyph between segments' },
    ],
    aiPrompt: {
      basic: 'Add a breadcrumb navigation to the top of the detail page.',
      detailed:
        'Add a breadcrumb at the top of the photo detail page: Albums › 2024 › IMG_0231. "Albums" and "2024" are clickable and go back up a level; the last segment is the current page and is not clickable.',
      implementation:
        'Render the breadcrumb at the top of the page, with data coming from the route hierarchy array [{label:"Albums",href:"/albums"},{label:"2024",href:"/albums/2024"},{label:"IMG_0231"}]. Render the last item as plain text and disabled, the rest as links that get an underline on hover. Use › as the separator, one step lighter than the text color. On mobile (<640px) keep only the root and the last two items, collapsing the middle ones into an ellipsis.',
    },
    badPrompt: 'Add something at the top to go back up.',
    betterPrompt:
      'Add a breadcrumb at the top of the detail page: Albums › 2024 › IMG_0231. Intermediate levels are clickable to go back up, the current page is not clickable.',
    aliases: ['path navigation', 'breadcrumb trail', 'hierarchical navigation', 'location indicator', 'path bar'],
    tags: ['hierarchy', 'orientation', 'back'],
  },

  'tabs': {
    oneLine:
      'Several peer content sections sit side by side; switching tabs swaps the whole panel — and each one gets its own URL.',
    description:
      'The key to tabs is "peer level + has a URL + preserves context". Tapping "Profile" changes the URL to /profile instead of pushing a new screen. Tabs carry different views of the same level.',
    looksLike:
      'Open a user profile on Xiaohongshu (RED) and the top has four tabs — Profile / Videos / Liked / Saved. Tapping one swaps the content below it. That is tabs.',
    fitsFor: 'Profile pages · content sections · settings groups',
    whenToUse: [
      { situation: '2–5 peer content sections', recommended: true },
      { situation: 'Switching keeps the user in the same page context', recommended: true },
      { situation: 'Every section has real content', recommended: true },
      { situation: 'The content has a required order (use a Stepper)', recommended: false },
      { situation: 'Two options are mutually exclusive rather than "both worth a look"', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Past five tabs, switch to side navigation or a dropdown.',
      'Do not use tabs when switching discards the current edit state — users will assume the content is still there.',
    ],
    anatomy: [
      { label: 'Tab List', note: 'Laid out horizontally, with an indicator along the bottom' },
      { label: 'Active Indicator', note: 'An underline or filled block marking the current tab' },
      { label: 'Tab', note: 'Short label, ideally 1–4 characters' },
      { label: 'Panel', note: 'The content region mapped one-to-one with a tab' },
    ],
    aiPrompt: {
      basic: 'Add a few tabs that switch the content below.',
      detailed:
        'Add tabs to the user profile page: Profile / Posts / Likes. Tapping a tab swaps the content below, and the active tab gets an underline indicator.',
      implementation:
        'Use a Tabs component with items [{key:"posts",label:"Profile"},{key:"works",label:"Posts"},{key:"likes",label:"Likes"}] and defaultActiveKey="posts". The container gets role="tablist", each tab role="tab" + aria-selected, and the content area role="tabpanel" + aria-labelledby. On switch, sync the URL query (?tab=works) and support browser back/forward. The active indicator is a 2px solid bottom border in #1A1917. On mobile the tab list scrolls horizontally with the scrollbar hidden.',
    },
    badPrompt: 'Add a few buttons at the top to switch the stuff below.',
    betterPrompt:
      'Add tabs to the profile page — Profile / Posts / Likes — with a bottom indicator on the active tab and the URL query synced on switch.',
    aliases: ['tabbed interface', 'tab bar', 'tab strip', 'segmented tabs', 'tabbed nav'],
    tags: ['peer switching', 'sections', 'context'],
  },

  'bottom-navigation': {
    oneLine:
      'The row of icon buttons pinned to the bottom of an app, switching between 3–5 top-level destinations.',
    description:
      'Bottom navigation is the main menu of a mobile app. It exists because it is thumb-reachable and always one tap away. It holds only the 3–5 highest-frequency destinations, and detail pages should cover it.',
    looksLike:
      'WeChat has "Chats / Contacts / Discover / Me" at the bottom; Alipay has "Home / Messages / Ant Forest / My / Cards". Both are bottom navigation.',
    fitsFor: 'Mobile apps · multiple primary features',
    whenToUse: [
      { situation: 'The mobile app has 3–5 peer primary features', recommended: true },
      { situation: 'Users move back and forth between features often', recommended: true },
      { situation: 'One-handed grip and thumb reachability come first', recommended: true },
      { situation: 'Desktop web applications', recommended: 'mostly' },
      { situation: 'There are more than 6 peer destinations', recommended: false },
    ],
    whenNotToUse: [
      'Past five destinations users start tapping blindly — fold the rest into "More" or a side menu.',
      'Hide it while users are reading or editing immersively, and give the space back to the content.',
    ],
    anatomy: [
      { label: 'Bar', note: 'Pinned to the bottom, includes safe-area padding' },
      { label: 'Item', note: 'Icon + short label' },
      { label: 'Active Item', note: 'Icon recolored + label darkened' },
      { label: 'Badge', note: 'A dot or a count, optional' },
    ],
    aiPrompt: {
      basic: 'Add a row of navigation icons at the bottom.',
      detailed:
        'Add bottom navigation to the app with four items — Home / Search / Saved / Profile — where the active item highlights both icon and label.',
      implementation:
        'Fixed to the bottom of the screen. The container is role="navigation" aria-label="Main navigation"; each item is a button with aria-current="page" when selected. Height 56px + env(safe-area-inset-bottom). Icons 24px, labels 10–11px. Active state uses the primary color #1A1917, inactive #7A766D. Tapping switches the route and preserves each tab\'s own scroll position. Unread counts show in an absolutely positioned badge at the icon\'s top-right, and numbers >99 render as 99+.',
    },
    badPrompt: 'Add a menu bar at the bottom.',
    betterPrompt:
      'Add bottom navigation — Home / Search / Saved / Profile — with the active icon and label highlighted, bottom safe-area insets handled, and a badge on items with unread counts.',
    aliases: ['bottom tab bar', 'bottom nav', 'bottom app bar', 'tab dock', 'mobile bottom bar'],
    tags: ['main menu', 'thumb zone', 'app'],
  },

  'navigation-rail': {
    oneLine:
      'A column of navigation items placed vertically on the left, for layouts with more vertical room than horizontal.',
    description:
      'A navigation rail is the vertical twin of bottom navigation. On tablets, desktops, and wide web layouts it replaces bottom navigation, fits more destinations, and can expand to show text labels.',
    looksLike:
      'Open a web admin console or a tablet productivity app and the vertical stack of icons plus labels on the left is the navigation rail. Hit the hamburger button and it expands into a full sidebar.',
    fitsFor: 'Tablet · desktop · admin panels',
    whenToUse: [
      { situation: 'Tablet, desktop, or widescreen layouts', recommended: true },
      { situation: 'There are more than 5 destinations', recommended: true },
      { situation: 'Global navigation must stay visible at all times', recommended: true },
      { situation: 'Small phone screens in portrait', recommended: false },
    ],
    whenNotToUse: [
      'On a phone it eats precious width — bottom navigation or a hamburger menu is better.',
      'With only two destinations, a row of text links is enough.',
    ],
    anatomy: [
      { label: 'Rail', note: 'Vertical arrangement, collapsible' },
      { label: 'Destination', note: 'Icon + label' },
      { label: 'FAB', note: 'The top of the rail often holds the primary action' },
      { label: 'Collapse Toggle', note: 'Switches between icon-only and expanded' },
    ],
    aiPrompt: {
      basic: 'Add a column of navigation on the left.',
      detailed:
        'Add a navigation rail to the left of the tablet layout, icon above label, with Overview / Media / Albums / Settings, collapsible down to icons only.',
      implementation:
        'The rail is 80px wide (icon state) / 240px wide (expanded), laid out with vertical flex. The container is role="navigation" and items are buttons with aria-current="page". Store the collapsed state in localStorage. Animate the width change with a CSS transition of 200ms; below 840px width it automatically degrades into a Drawer (opened via the hamburger button). Reserve a 56px area at the top for the FAB.',
    },
    badPrompt: 'Add a sidebar menu on the left.',
    betterPrompt:
      'Add a navigation rail on the left — icon above label — that automatically collapses into a hamburger-controlled Drawer below 840px width.',
    aliases: ['side rail', 'vertical nav', 'side navigation', 'icon rail', 'vertical sidebar'],
    tags: ['vertical nav', 'widescreen', 'collapsible'],
  },

  'sidebar': {
    oneLine:
      'A navigation panel pinned to one edge of the screen — always visible, or sliding out from a hamburger button.',
    description:
      'A sidebar is a container shape for navigation: persistent on the left on desktop, a slide-over panel on mobile. How it differs from a navigation rail is that a sidebar usually carries text labels and group headings — it is navigation in its expanded form.',
    looksLike:
      'The page tree down the left of Notion, the repository menu on the left of GitHub, the list of mail folders that slides in from the left when you open Gmail — all sidebars.',
    fitsFor: 'Desktop · many destinations · grouped',
    whenToUse: [
      { situation: 'Many destinations that need grouping and text labels', recommended: true },
      { situation: 'On desktop, navigation should stay visible', recommended: true },
      { situation: 'Mobile needs to hold destinations that do not fit in bottom navigation', recommended: true },
      { situation: 'The page itself is very short, with only 2–3 destinations', recommended: false },
    ],
    whenNotToUse: [
      'Spending 240px of width on three or four destinations is obvious wasted space.',
      'A persistent sidebar on mobile squeezes the content area very narrow.',
    ],
    anatomy: [
      { label: 'Panel', note: 'Fixed to the side, can slide open' },
      { label: 'Header', note: 'Logo / title / close button' },
      { label: 'Nav Group', note: 'A set of destinations under a small heading' },
      { label: 'Item', note: 'Icon + text, can nest children' },
      { label: 'Scrim', note: 'The translucent overlay covering content on mobile' },
    ],
    aiPrompt: {
      basic: 'Add a sidebar menu.',
      detailed:
        'Add a sidebar that slides in from the left, with two groups — "Workspace" and "Personal" — opened by a hamburger button on mobile and persistent on desktop.',
      implementation:
        'Width 260px; on desktop (≥1024px) position: fixed and persistent. On mobile hide it with transform: translateX(-100%), then slide it out by adding .open when the hamburger button is tapped, and show a Scrim of rgba(0,0,0,0.4) at the same time; tapping the Scrim or pressing Esc closes it. Trap focus inside the panel while open and return focus to the hamburger button after closing. Navigation items are a tags with aria-current="page", and the current item uses #F2F0EB as its background.',
    },
    badPrompt: 'Add a menu on the left that slides out.',
    betterPrompt:
      'Add a slide-over sidebar (260px wide): persistent on desktop, opened by a hamburger button with a scrim on mobile, grouped under "Workspace / Personal", dismissible with Esc.',
    aliases: ['drawer nav', 'side panel', 'side menu', 'slide-over nav', 'off-canvas menu'],
    tags: ['grouped', 'persistent', 'slide-over'],
  },

  'pagination': {
    oneLine:
      'A long list is cut into pages, with a row of page numbers at the bottom that lets you jump to one of them.',
    description:
      'The core value of pagination is locatability: users can remember "the thing I want is on page 3" and jump straight back to it. For ordered, paged data — article lists, search results — it is still the most dependable option.',
    looksLike:
      'The "‹ 1 2 3 … 48 ›" row under a set of search results, or the page number strip at the bottom of a Taobao product listing, are both pagination.',
    fitsFor: 'Search results · article lists · admin tables',
    whenToUse: [
      { situation: 'Content has a clear order and users may want to return to it', recommended: true },
      { situation: 'The total is finite and can be shown up front', recommended: true },
      { situation: 'The URL must address a specific page (SEO / sharing)', recommended: true },
      { situation: 'Infinite-scroll social feeds', recommended: false },
      { situation: 'The data set is enormous and users never jump to a page', recommended: false },
    ],
    whenNotToUse: [
      'On phones, 10 items per page plus a row of page numbers is expensive to operate, and users lose track of where they are.',
      'When the user goal is "keep scrolling" rather than "reach page 48", pagination is an obstacle.',
    ],
    anatomy: [
      { label: 'Prev / Next', note: 'Disabled and dimmed on the first and last page' },
      { label: 'Page Numbers', note: 'Current page highlighted, ellipses on both sides' },
      { label: 'Current', note: 'Bolded or recolored' },
      { label: 'Total Info', note: 'For example "1,240 results"' },
    ],
    aiPrompt: {
      basic: 'Add pagination below the list.',
      detailed:
        'Add pagination at the bottom of the list with previous/next buttons and page numbers, highlighting the current page and using ellipses when the range overflows.',
      implementation:
        'Render the structure ‹ [1] 2 3 … 48 ›. On the first and last page the buttons are disabled + aria-disabled. The current page button gets aria-current="page" and a visual highlight. Below 480px viewport width keep only ‹ Previous / Next › and hide the numbered pages. 10 items per page; after paging, scroll back to the top of the list and focus the list heading (with aria-live announcing "Page 2 of 48"). Write the page number into the URL as ?page=2.',
    },
    badPrompt: 'Add something to flip pages.',
    betterPrompt:
      'Add pagination at the bottom of the list — ‹ 1 2 3 … 48 › — with the current page highlighted, prev/next disabled on the first and last page, only prev/next on phones, and the page number synced to the URL.',
    aliases: ['pager', 'paging controls', 'page numbers', 'page navigation', 'paginator'],
    tags: ['paging', 'locatable', 'url state'],
  },

  'stepper': {
    oneLine:
      'A long flow broken into several steps, with a row of numbered nodes telling you which step you are on and how many are left.',
    description:
      'A stepper removes the anxiety of not knowing how much is left. How it differs from tabs: a stepper is ordered, and the steps form a process; tabs are parallel switches between content.',
    looksLike:
      'The "Cart › Address › Payment › Done" row at checkout, or the "Step 2 of 4" indicator during sign-up, are both steppers.',
    fitsFor: 'Checkout · sign-up · upload flows',
    whenToUse: [
      { situation: 'The task must be done in order (3–5 steps is the sweet spot)', recommended: true },
      { situation: 'There are enough steps that users worry about how long it takes', recommended: true },
      { situation: 'Going back to a completed step is allowed', recommended: true },
      { situation: 'The task can be finished in one step', recommended: false },
      { situation: 'The number of steps changes dynamically', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Splitting something that takes one step into three is pure user harm.',
      'Past 5 steps the horizontal layout overflows — on mobile switch to "Step 2 of 5" plus a progress bar.',
    ],
    anatomy: [
      { label: 'Step Node', note: 'A circle holding the number or an icon' },
      { label: 'Connector', note: 'The line between nodes, tinted for completed parts' },
      { label: 'Label', note: 'Three states: completed / current / not started' },
      { label: 'Current Step', note: 'Highlighted and bolded' },
    ],
    aiPrompt: {
      basic: 'Break the flow into steps and show the current progress.',
      detailed:
        'Turn the checkout flow into a 4-step stepper: Cart / Address / Payment / Done. Highlight the current step, show a checkmark on completed steps, and allow clicking back into a completed step.',
      implementation:
        'Render the steps array in a horizontal flex layout, with flex-1 connectors between nodes. State rules: index < current → completed (solid + Check icon); index === current → active (bold outline); index > current → upcoming (gray, disabled). Completed steps are clickable to go back; upcoming ones are not. On mobile (<640px) hide the labels and show only the dots plus the progress text "Step 2 of 4". The container gets aria-label="Checkout steps" and the current step gets aria-current="step".',
    },
    badPrompt: 'Add some progress indication so users know where they are.',
    betterPrompt:
      'Use a stepper for the 4-step checkout flow (Cart/Address/Payment/Done): check completed steps, highlight the current one, allow going back to completed steps, and fall back to "Step 2 of 4" on mobile.',
    aliases: ['step indicator', 'wizard steps', 'progress steps', 'step tracker', 'stepper nav'],
    tags: ['flow', 'sequence', 'progress'],
  },

  'back-button': {
    oneLine: 'A left-pointing arrow that takes you back to wherever you just came from.',
    description:
      'The back button is the most basic and most important navigation on mobile. It answers "how do I get back to that page I was on", so it has to exist — especially on iOS, where a screen with no back arrow in the top-left is a serious usability failure.',
    looksLike:
      'You tap into a conversation from a WeChat chat list and the "‹ Name" in the top-left is the back button — tapping it returns to the list with your scroll position intact.',
    fitsFor: 'Mobile · hierarchical pages',
    whenToUse: [
      { situation: 'Moving one level deeper on mobile', recommended: true },
      { situation: 'Users may get lost and need to go back up', recommended: true },
      { situation: 'Browser history can be relied on', recommended: true },
      { situation: 'This is step 1 of a flow (no previous level to go back to)', recommended: false },
    ],
    whenNotToUse: [
      'A top-level tab at the root should not have a back button — there is nowhere to go back to.',
      'On the web, duplicating the browser back button often feels clumsy; but in a PWA or standalone app it is mandatory.',
    ],
    anatomy: [
      { label: 'Icon', note: 'ChevronLeft, 24px' },
      { label: 'Label', note: 'Optional, usually the title of the previous screen' },
      { label: 'Hit Area', note: 'At least 44×44px' },
    ],
    aiPrompt: {
      basic: 'Add a back button.',
      detailed:
        'Add a back button at the top-left of the detail page: a left arrow plus the previous screen name, which returns to the list and restores the scroll position.',
      implementation:
        'A button element with a ChevronLeft icon (20–24px) plus the previous screen title as text, and aria-label="Back to list". Hit area at least 44×44px with no extra visual border. On tap call history.back(), falling back to router.push(default home) when there is no history. After going back, restore the previous screen\'s scrollTop (store scrollY in route cache or sessionStorage). On iOS do not keep bottom navigation visible at the same time — hide it on entry and show it again on return.',
    },
    badPrompt: 'Add a button in the top-left that goes back.',
    betterPrompt:
      'Add a back button at the top-left of the detail page: ChevronLeft icon plus the previous screen name, aria-label="Back to list", going back and restoring the previous scroll position, hit area ≥44×44px.',
    aliases: ['back arrow', 'back nav', 'chevron left', 'return button', 'go back'],
    tags: ['back', 'hit area', 'history'],
  },

  'button': {
    oneLine:
      'The most basic clickable element in the interface — the user taps it and one thing happens.',
    description:
      'The button is the starting point of every action. It has no special visual identity of its own: it can come in any color and size, but it is always the thing that triggers an action when pressed.',
    looksLike:
      '"Log in" on a sign-in page, "Save" in settings, "Cancel / OK" at the bottom of a dialog — anything that triggers a concrete action is a button.',
    fitsFor: 'Submit · save · delete · confirm',
    whenToUse: [
      { situation: 'Triggering a clear action (submit, delete, save)', recommended: true },
      { situation: 'The action is the next step on the current page', recommended: true },
      { situation: 'You need to express hierarchy: Primary + Secondary', recommended: true },
      { situation: 'It only navigates to another page with no semantics of its own', recommended: 'mostly' },
      { situation: 'More than 3 equally weighted primary buttons on one page', recommended: false },
    ],
    whenNotToUse: [
      'A row of text links at the top of the page that all look like buttons destroys the hierarchy.',
      'A label of "OK" makes users nervous — "Delete photo" is far friendlier than "OK".',
    ],
    anatomy: [
      { label: 'Container', note: 'Min hit area 44×44px, 8px corner radius' },
      { label: 'Label', note: 'Starts with a verb and states the result' },
      { label: 'Leading Icon', note: 'Optional, only when it aids recognition' },
      { label: 'Loading State', note: 'Clicks disabled and a spinner shown' },
      { label: 'Disabled State', note: 'Lower contrast but still readable' },
    ],
    aiPrompt: {
      basic: 'Add a save button.',
      detailed:
        'Add a pair of buttons at the bottom of the edit page: a secondary "Cancel" on the left and a primary "Save" on the right. While saving, show loading and disable it.',
      implementation:
        'Two <button> elements: the right one is Primary (background #1A1917, white text, 8px radius, padding 10px 20px, min-height 44px), the left one is Secondary (white background + 1px border #E6E3DB). After clicking Save: set disabled=true, show a 16px spinner, aria-busy=true, and restore within 600ms on success. On hover, darken the background to #35322C. Focus state uses a 2px outline with 2px offset. Use a verb for the label, not "OK".',
    },
    badPrompt: 'Add a button.',
    betterPrompt:
      'Add a pair of buttons: a primary "Save photo" (dark, solid) and a secondary "Cancel" (white with an outline). The primary button shows a loading state and disables on click.',
    aliases: ['push button', 'btn', 'action button', 'plain button', 'submit button'],
    tags: ['primary action', 'verb', 'hit area'],
  },

  'cta': {
    oneLine:
      'The single most important button on the page — it is the one thing you want the user to do next.',
    description:
      'A CTA is not a button that looks different; it is a role: the single primary action of the current page. You can have five secondary buttons, but only one CTA. The test is simple — if you removed it, could the user still complete the task?',
    looksLike:
      'The full-width "Start free trial" on a sign-up page, the highlighted "Buy now" in the top-right of a landing page — they stand out because they are the only thing on the page driving conversion.',
    fitsFor: 'Landing pages · sign-up · empty states',
    whenToUse: [
      { situation: 'The page has one clear action you most want the user to complete', recommended: true },
      { situation: 'Landing pages, sign-up pages, and empty states', recommended: true },
      { situation: 'You need visual weight to guide the next step', recommended: true },
      { situation: 'Several equally important primary actions coexist on the page', recommended: false },
    ],
    whenNotToUse: [
      'Making every button a CTA means there is no CTA — once visual weight is averaged out, the focus disappears.',
      'Forcing a CTA into a high-frequency workspace interface is just noise.',
    ],
    anatomy: [
      { label: 'Container', note: 'Larger padding, usually full-width or noticeably wider' },
      { label: 'Value Label', note: 'States the benefit, not the feature: "Start free" beats "Sign up"' },
      { label: 'Visual Weight', note: 'The only solid, highlighted button on the page' },
      { label: 'Optional Hint', note: 'A line of small text below the button that reduces hesitation' },
    ],
    aiPrompt: {
      basic: 'Add a prominent button.',
      detailed:
        'Add a full-width primary CTA to the sign-up page reading "Start free trial", dark and solid, with a line of small text underneath: "No credit card required".',
      implementation:
        'button width 100%, height 52px, background #1A1917, text 17px medium, 8px radius, darkening to #35322C on hover. It is the only high-solidity button on the page; secondary links (already have an account? Log in) are demoted to text buttons. Place a 13px gray helper text 8px below the button. On mobile guarantee bottom padding-bottom: env(safe-area-inset-bottom).',
    },
    badPrompt: 'Add a button for the user to click.',
    betterPrompt:
      'Add the single primary CTA to the sign-up page: full-width, dark solid, labeled "Start free trial" (benefit, not feature), with 13px gray text "No credit card required" below it.',
    aliases: ['call to action', 'conversion button', 'primary button', 'action button', 'hero button'],
    tags: ['primary action', 'conversion', 'singular'],
  },

  'icon-button': {
    oneLine:
      'A button with only an icon and no text, which is only meaningful when paired with a tooltip.',
    description:
      'An icon button trades space for clarity: it fits into a toolbar, but the user has to already know what the icon means. So its premise is that the icon is universal enough, or that a tooltip backs it up.',
    looksLike:
      'The row of small icons in the top-right of an editor (bold, italic, align), the heart and download keys on an image, the delete X on each chat list row — all icon buttons.',
    fitsFor: 'Toolbars · card actions · universal symbols',
    whenToUse: [
      { situation: 'The toolbar needs to hold many actions', recommended: true },
      { situation: 'The icon is an industry-standard symbol (search, close, share)', recommended: true },
      { situation: 'Space is extremely tight (such as a card corner)', recommended: true },
      { situation: 'A feature appearing for the first time, with a non-obvious icon', recommended: false },
      { situation: 'It is the primary action of the page', recommended: false },
    ],
    whenNotToUse: [
      'A feature that needs to be discovered (say "Export") should not be icon-only — users would have to guess the meaning.',
      'Single Chinese characters used as icons are nearly unreadable in a Chinese UI.',
    ],
    anatomy: [
      { label: 'Hit Area', note: '32px visually, hit area expanded to 44×44px' },
      { label: 'Icon', note: '20–24px, stroke width kept consistent at 1.75px' },
      { label: 'Tooltip', note: 'Required, or add an aria-label' },
      { label: 'States', note: 'Three states: hover / active / disabled' },
    ],
    aiPrompt: {
      basic: 'Add an icon button.',
      detailed:
        'Add a group of icon buttons to the right of the editor toolbar: bold / italic / delete. Delete uses the danger red, and a tooltip appears on hover.',
      implementation:
        'A button containing a 20px icon (lucide) with no text. Visual size 32×32px, but expand the hit area to 44×44px with a pseudo-element (::after absolute inset:-6px). Give every button an aria-label and a tooltip (appears after 400ms hover, disappears on mouse leave, closes with Esc). The danger button turns #A8342C on hover. Space items in the toolbar by 4px and wrap the whole group in role="toolbar".',
    },
    badPrompt: 'Add a few small icons that can be tapped.',
    betterPrompt:
      'Add a group of icon buttons (20px icon, 44×44px hit area), each with an aria-label and a hover tooltip, delete in the danger red, and the whole group wrapped in role="toolbar".',
    aliases: ['icon button', 'symbol button', 'icon-only button', 'glyph button'],
    tags: ['toolbar', 'hit area', 'tooltip'],
  },

  'fab': {
    oneLine:
      'The round button that floats in the corner of the screen, usually carrying the "create" action.',
    description:
      'The FAB is designed as a shortcut that is always within thumb reach. It sits in the bottom-right of the app: the benefit is that it breaks out of the hierarchy and is always available; the cost is that it covers content and permanently occupies visual attention.',
    looksLike:
      'The round button with a plus in the bottom-right of Google Material apps, the "+" publish button on Xiaohongshu (RED), the pencil in the bottom-right of a notes app — all FABs.',
    fitsFor: 'Create · capture · quick note',
    whenToUse: [
      { situation: 'There is one high-frequency primary action on mobile (create / capture / log)', recommended: true },
      { situation: 'That action should be reachable from several levels of pages', recommended: true },
      { situation: 'The page is a long scrolling list', recommended: true },
      { situation: 'The toolbar already has a primary button', recommended: false },
      { situation: 'The primary action would cover critical content at the bottom', recommended: false },
    ],
    whenNotToUse: [
      'Adding a FAB on top of a layout with 5 or fewer tabs is redundant — "create" usually belongs in the bottom navigation.',
      'It always floats above everything, so a position that is too low covers the last row of the list.',
    ],
    anatomy: [
      { label: 'Surface', note: '56×56px, with a shadow to reinforce the floating feel' },
      { label: 'Icon', note: '24px, centered' },
      { label: 'Position', note: '16px from the bottom-right plus the safe area' },
      { label: 'Extended', note: 'The extended FAB with a text label' },
    ],
    aiPrompt: {
      basic: 'Add a floating button in the bottom-right corner.',
      detailed:
        'Add a FAB in the bottom-right of the mobile page: a circle with a plus icon that creates new content. It stays fixed while a long list scrolls and does not scroll away with the content.',
      implementation:
        'button position: fixed; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); width/height 56px; border-radius: 9999px; background #1A1917; box-shadow 0 4px 12px rgba(0,0,0,0.2); z-index 40. Put a 24px Plus icon inside with aria-label="Create". Use scale(0.96) for hover/active. If the page has bottom navigation, change bottom to nav height + 16px. Keep it visible at the bottom of the scroll (do not hide it) so users never lose the entry point.',
    },
    badPrompt: 'Put a plus sign in the bottom-right corner.',
    betterPrompt:
      'Add a FAB in the bottom-right on mobile: 56px circle, dark solid, Plus icon, shadow for depth, aria-label="Create", with bottom offset accounting for the bottom navigation height and the safe area.',
    aliases: ['floating action button', 'floating button', 'FAB', 'hover button', 'floating compose button'],
    tags: ['floating', 'primary action', 'thumb zone'],
  },

  'split-button': {
    oneLine:
      'A default action on the left and a dropdown arrow on the right, where the right side reveals other variants of the same action.',
    description:
      'A split button solves the specific problem of "default action plus variants": users hit the left side 90% of the time and the right side 10% of the time to pick a variant. It is more compact than "a button next to a dropdown" and faster than a pure dropdown.',
    looksLike:
      '"Paste ▼" in Word — click the left side to paste the default format, click the right side to choose "Keep Source Formatting / Paste as Plain Text".',
    fitsFor: 'Toolbars · default action plus variants',
    whenToUse: [
      { situation: 'There is a default action with 2–4 common variants', recommended: true },
      { situation: 'The default action is used far more often than the variants', recommended: true },
      { situation: 'Toolbar space is tight but variants still need to be exposed', recommended: true },
      { situation: 'All options are used about equally often', recommended: false },
    ],
    whenNotToUse: [
      'Past 5 variants, replace the right side with a separate Menu button.',
      'On mobile, finger precision is low and a 34px-wide arrow zone is hard to hit.',
    ],
    anatomy: [
      { label: 'Main Action', note: 'The left side, taking about 70% of the width' },
      { label: 'Divider', note: '1px, in the button color or semi-transparent' },
      { label: 'Toggle Zone', note: 'The right side, with a ChevronDown' },
      { label: 'Menu', note: 'The popup menu, expanding downward on tap' },
    ],
    aiPrompt: {
      basic: 'Add a dropdown arrow to the right of a button.',
      detailed:
        'Build a split button: "Paste" as the main zone, with an arrow that opens a menu of Paste Special variants.',
      implementation:
        'An outer flex container wrapping two buttons: the main zone uses padding 8px 16px, the arrow zone uses padding 8px 10px with a 1px divider on its left. The two buttons share a border-radius so only the main zone rounds on the left and the arrow zone on the right, reading as one control. The arrow zone gets aria-haspopup="menu" + aria-expanded. Position the menu with a Popover anchored below the button, close on Esc and on outside click, and allow arrow-key movement between items. Mark the current item with a Check icon.',
    },
    badPrompt: 'A button with a small arrow that expands.',
    betterPrompt:
      'Build a split button: "Paste" as the left main action, and on the right a 1px-divided arrow zone (aria-haspopup="menu") that opens the variants menu, with the two zones\' radii forming one control.',
    aliases: ['split button', 'master-detail button', 'combined button', 'dropdown button combo', 'button with menu'],
    tags: ['toolbar', 'primary-secondary', 'variants'],
  },

  'destructive-action': {
    oneLine:
      'An action that is hard to undo once taken — delete, clear, deactivate. Its button has to be red.',
    description:
      'A destructive action is a design pattern rather than a single component. It has three parts: visual de-emphasis (quiet most of the time), confirmation on trigger (a second-confirm dialog), and an escape hatch (an Undo after the deletion).',
    looksLike:
      '"Delete photo" in a gallery, the red "Erase All Data" at the very bottom of settings, the "Delete" that appears when you swipe a chat list row left — what they share is a required confirmation.',
    fitsFor: 'Delete · erase · deactivate',
    whenToUse: [
      { situation: 'The action is irreversible or expensive to reverse', recommended: true },
      { situation: 'A mis-tap is costly (deleting data, deactivating an account, issuing a refund)', recommended: true },
      { situation: 'The dangerous button appears only rarely on the page', recommended: true },
      { situation: 'The action is frequent and easy to recover from (drag to reorder, clear a text field)', recommended: false },
      { situation: 'Deleting 100 photos in bulk', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'A confirmation dialog on every dangerous action trains people to click OK with their eyes closed, which lowers safety rather than raising it.',
      'The real fix is usually to offer Undo, not to block the user.',
    ],
    anatomy: [
      { label: 'De-emphasized', note: 'A red text button that does not compete for attention' },
      { label: 'Confirm Dialog', note: 'States the consequence, never just "Are you sure?"' },
      { label: 'Impact Text', note: '"12 photos will be deleted and cannot be recovered"' },
      { label: 'Undo Escape', note: 'A Snackbar offering Undo after the deletion' },
    ],
    aiPrompt: {
      basic: 'Add a delete button.',
      detailed:
        'Add a destructive delete action: a red text button at rest that opens a confirmation dialog stating how many items will be removed, plus a Snackbar with Undo after the deletion completes.',
      implementation:
        'At rest: a red text button #A8342C with no border, gaining a light red background #FAEDEC on hover. On click, open a Dialog: title "Delete 12 photos?", body "These photos will move to Recently Deleted and be purged automatically after 30 days.", with buttons "Cancel" (Secondary) + "Delete" (danger, solid red). After execution, close the Dialog immediately and show a Snackbar "12 photos deleted" with an "Undo" button that auto-dismisses after 5 seconds; Undo restores the data. For bulk deletion, do not confirm each item — show a single prompt before the operation.',
    },
    badPrompt: 'Add a red delete button.',
    betterPrompt:
      'Handle the dangerous action with a three-part pattern: a red text button that stays quiet at rest → a confirmation dialog on click that spells out the consequence (not "Are you sure?") → a Snackbar with Undo after it completes.',
    aliases: ['danger action', 'delete action', 'destructive button', 'double confirmation', 'irreversible action'],
    tags: ['risk', 'confirmation', 'undo'],
  },
};