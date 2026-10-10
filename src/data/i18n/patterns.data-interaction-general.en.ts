// English copy for the data, interaction, and general pattern sets.
// Source of truth: src/data/patterns/{data,interaction,general}.ts — anatomy order/length and
// whenToUse recommended flags must stay in lockstep with those files.
import type { PatternTranslations } from './types';

export const dataInteractionGeneralPatterns: PatternTranslations = {
  // ---------------------------------------------------------------- data
  list: {
    oneLine:
      'A single column of stacked items, where every row is the same kind of thing and the whole row is one target.',
    description:
      'A list is the base unit of information display. The two decisions that matter are how much goes in one row and which rows are tappable. When a row is tappable, the entire row needs hover feedback and a full-row hit area.',
    looksLike:
      'A WeChat conversation list, the rows inside Settings, the mail list on iOS — avatar on the left, title in the middle, timestamp on the right.',
    fitsFor: 'Settings · Messages · Search results',
    whenToUse: [
      { situation: 'Three or more similar items need vertical browsing', recommended: true },
      { situation: 'Every item has the same structure (title + subtitle + value)', recommended: true },
      { situation: 'Users need to scan quickly', recommended: true },
      { situation: 'Users need to compare values horizontally across items', recommended: false },
      { situation: 'There are only one or two items', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Once a row carries five fields it has become a table — use a Table for horizontal comparison.',
      'Rows need a divider or vertical whitespace between them, otherwise they smear into one block.',
    ],
    anatomy: [
      { label: 'Row / Item', note: 'Minimum 48px hit area, the whole row is tappable' },
      { label: 'Leading', note: 'Avatar / icon' },
      { label: 'Title', note: 'Truncated to one line' },
      { label: 'Subtitle', note: 'Secondary color, one line' },
      { label: 'Trailing', note: 'Value / timestamp / chevron' },
      { label: 'Divider', note: 'Aligned to the text, not full-bleed' },
    ],
    aiPrompt: {
      basic: 'Add a list.',
      detailed:
        'Add a settings list: each row has a leading icon + title on the left, the current value + chevron on the right, the whole row is tappable, rows are separated by hairlines, and groups are separated by section headers.',
      implementation:
        '<ul> + <li>, with each row wrapped in a <button> or <a> so the whole row is tappable. Row height minimum 48px, padding 16px. Render the divider as an absolutely positioned ::after inside the li whose left offset starts at the right edge of the icon (aligned to the text, not full-bleed). Use an <h3> heading plus vertical spacing for groups instead of dividers. Row hover background #F2F0EB. When there is trailing text (e.g. "Follow System"), use the secondary color at 14px.',
    },
    badPrompt: 'Add a list to show the data.',
    betterPrompt:
      'Add a settings List: wrap each row in a button so the whole row is tappable, height >=48px, leading icon + title on the left, value + chevron on the right, dividers aligned to the text rather than full-bleed, and groups separated by headings plus spacing instead of dividers.',
    aliases: ['list', 'list item', 'row', 'feed', 'stack', 'collection'],
    tags: ['vertical', 'scannable', 'tappable rows'],
  },

  table: {
    oneLine:
      'Rows and columns that cross, used to compare several attributes across several objects side by side.',
    description:
      'A List makes people scan vertically, a Table makes people compare horizontally. When the question is "who is highest" or "which row is over budget", reach for a table. The cost of a table is horizontal space, so a narrow-screen fallback is mandatory.',
    looksLike:
      'The order management screen of an admin console, the data range in Excel, a calendar or class timetable, the comparison table in a financial report.',
    fitsFor: 'Admin console · Data · Logs',
    whenToUse: [
      { situation: 'You need to compare multiple values of the same attribute horizontally', recommended: true },
      { situation: 'There are many fields and the structure is fixed (orders, users, logs)', recommended: true },
      { situation: 'You need sorting and filtering', recommended: true },
      { situation: 'You are only showing a small amount of data across three fields', recommended: 'mostly' },
      { situation: 'The screen is a narrow mobile viewport', recommended: false },
    ],
    whenNotToUse: [
      'A table on mobile must degrade into a card list, otherwise users end up scrolling sideways and giving up.',
      'Do not make every cell tappable — users lose track of what is actually actionable.',
    ],
    anatomy: [
      { label: 'Header Row', note: 'Sticky, with sort arrows' },
      { label: 'Cell', note: 'Text left-aligned, numbers right-aligned' },
      { label: 'Row Hover', note: 'Whole row highlights to signal it is tappable' },
      { label: 'Column Resize', note: 'Drag the header edge, optional' },
      { label: 'Empty Cell', note: 'Show an em dash rather than blank space' },
    ],
    aiPrompt: {
      basic: 'Add a table to show the data.',
      detailed:
        'Add an orders data table: clickable sortable headers, right-aligned numeric columns, status shown with colored chips, horizontal scroll on the container, and a sticky header row.',
      implementation:
        '<table> + <thead> + <tbody>, with numeric columns given a class plus text-align: right and font-variant-numeric: tabular-nums. Make the th a button that supports sorting and add aria-sort="ascending". Set overflow-x: auto on the wrapper. thead position: sticky; top: 0; z-index: 1. Render empty values as an em dash rather than an empty string. On mobile (<768px) use CSS to switch to a card layout: each row display: block, with field names shown via ::before from a data-label attribute.',
    },
    badPrompt: 'Add a table.',
    betterPrompt:
      'Add a data Table: sortable header buttons with aria-sort, numeric columns right-aligned with tabular-nums, sticky header, horizontally scrolling container, em dashes for empty values, and a mobile fallback to a card layout that reveals field names via data-label.',
    aliases: ['table', 'data grid', 'data table', 'grid', 'spreadsheet'],
    tags: ['comparison', 'multi-field', 'sortable'],
  },

  badge: {
    oneLine:
      'A tiny marker pinned to the corner of an icon or avatar that says "there is something you need to look at".',
    description:
      'A badge is metadata about metadata: it carries no content of its own, it just attaches a state to some element. The two most common forms are the dot (unread) and the count (unread total). Overuse it and you get badge fatigue, where users stop seeing any of them.',
    looksLike:
      'The unread dot on a WeChat bottom tab, the "99+" on an app icon, the number on the Messages icon in a nav bar.',
    fitsFor: 'Unread · Alerts · Counts',
    whenToUse: [
      { situation: 'Signalling unread content or new messages', recommended: true },
      { situation: 'You need attention but not immediate action', recommended: true },
      { situation: 'Marking a state on the top-right of an icon', recommended: true },
      { situation: 'Showing a quantity (3 items in the cart)', recommended: true },
      { situation: 'Signalling a normal or healthy state', recommended: false },
    ],
    whenNotToUse: [
      'Once red dots are everywhere users ignore all of them — use them sparingly.',
      'A "99+" badge without a real number leaves users wondering how many there actually are.',
    ],
    anatomy: [
      { label: 'Anchor', note: 'The icon or avatar it attaches to' },
      { label: 'Bubble', note: 'Absolutely positioned at the top-right' },
      { label: 'Count', note: 'Shows 99+ past 99' },
      { label: 'Dot', note: 'Plain dot with no number, just means "something is here"' },
    ],
    aiPrompt: {
      basic: 'Add a red dot to the icon.',
      detailed:
        'Add a Badge to the top-right of the "Messages" icon in the bottom navigation: show a number when there are 5 unread, show "99+" past 99, hide at zero, and show a "5 unread messages" tooltip on hover.',
      implementation:
        'Absolutely position the badge at the top-right of the anchor (top: -4px; right: -6px), minimum 16px wide by 16px tall, fully rounded, red background with white 10px text. A single digit renders as a circle, two or more digits become a capsule (padding 0 5px). Position must respect the safe area. Set display: none when the count is 0. Add aria-label="5 unread messages" to the anchor element.',
    },
    badPrompt: 'Add a red dot hint to the icon.',
    betterPrompt:
      'Add a Badge to the icon: absolutely positioned at the top-right, a red capsule with white text, "99+" past 99, hidden at zero, with aria-label="N unread" on the anchor — and used sparingly so it does not become visual noise.',
    aliases: ['badge', 'notification badge', 'red dot', 'unread dot', 'count bubble', 'notification count'],
    tags: ['unread', 'count', 'alert'],
  },

  'chip-display': {
    oneLine:
      'A small non-interactive label attached to content to mark its category or status — you can look at it, not click it.',
    description:
      'A tag is the read-only member of the chip family: it only tells you what something is, it never does anything. Its value is that it lets users sort content by category at a glance while scanning — which items in a photo grid are videos, which are favorited.',
    looksLike:
      'Colored labels on GitHub issues, category chips at the top of a blog post ("Frontend" / "Performance"), a "Video" tag in a photo library.',
    fitsFor: 'Category · Status · Type',
    whenToUse: [
      { situation: 'Marking the category or status of content', recommended: true },
      { situation: 'Helping users tell types apart while scanning', recommended: true },
      { situation: 'Distinguishing attributes of items shown side by side', recommended: true },
      { situation: 'Clicking it should filter or navigate somewhere', recommended: false },
      { situation: 'The user needs to select it', recommended: false },
    ],
    whenNotToUse: [
      'Color is the tag\'s primary information channel — past about six colors users can no longer categorize by color.',
      'Tag versus badge: a tag sits on the content, a badge sits on an icon.',
    ],
    anatomy: [
      { label: 'Pill', note: 'Fully rounded, light background' },
      { label: 'Text', note: '12px, darker shade of the same hue' },
      { label: 'Color', note: 'Carries meaning, not decoration' },
    ],
    aiPrompt: {
      basic: 'Add a few content tags.',
      detailed:
        'Add a content Tag at the bottom of every card, using color to signal type ("Video" blue, "Favorited" amber, "Edited" gray). Not clickable.',
      implementation:
        'A span element, fully rounded, padding 2px 8px, 12px text. Colors use a light background with a darker text from the same hue family (e.g. #EEF3F8 background with #35618E text) to keep contrast at or above 4.5:1. Define at most four or five semantic colors and keep them consistent across the app. No hover effect and no cursor: pointer on a tag — make its read-only nature explicit.',
    },
    badPrompt: 'Add a tag to the content.',
    betterPrompt:
      'Add content Tags: light background with darker same-hue text (holding contrast at 4.5:1 or better), fully rounded with padding 2px 8px, at most four or five semantic colors used consistently app-wide, and no hover or pointer cursor so they read as read-only.',
    aliases: ['tag', 'label', 'label chip', 'category tag', 'status tag', 'read-only chip'],
    tags: ['category', 'color semantics', 'read-only'],
  },

  'stat-card': {
    oneLine:
      'A small card that holds exactly one number, plus a label and a sense of which way the trend is moving.',
    description:
      'A stat card answers "how are we doing right now". It must contain three things: the metric name (saying what is being measured), the value (large), and the comparison (how it moved versus the last period). Drop the third item and the card is just a lonely number.',
    looksLike:
      'The row of small cards at the top of an admin dashboard: "New today 1,284 up 12%", "Active users 8,420 down 3%", "Conversion rate 4.2%".',
    fitsFor: 'Admin home · Dashboard · Overview',
    whenToUse: [
      { situation: 'A few core metrics need to be readable at a glance', recommended: true },
      { situation: 'The metric has an obvious baseline (yesterday, last week)', recommended: true },
      { situation: 'The number matters more than the trend', recommended: true },
      { situation: 'You need to show how a number got to where it is', recommended: 'mostly' },
      { situation: 'Metrics need to be cross-analyzed against each other', recommended: false },
    ],
    whenNotToUse: [
      'Up and down colors follow convention: red-up/green-down in Chinese markets, green-up/red-down for US equities. Do not mix them up.',
      '"Up 12%" must say what it is compared against — last month? Year over year?',
    ],
    anatomy: [
      { label: 'Label', note: '12px, secondary color' },
      { label: 'Value', note: '28px, tabular-nums' },
      { label: 'Delta', note: 'Up 12% vs last week' },
      { label: 'Context', note: 'Names the comparison baseline' },
    ],
    aiPrompt: {
      basic: 'Add a few numbers to show the data.',
      detailed:
        'Add a row of stat cards: new today 1,284 (up 12% vs yesterday), active users 8,420 (down 3%), conversion rate 4.2% (flat). Use red for up and green for down.',
      implementation:
        'Grid layout: 4 columns on desktop, 2 on tablet, 1 on mobile. 16px padding per card. Metric name 12px #7A766D, value 28px medium plus font-variant-numeric: tabular-nums, delta row 12px with an arrow icon. Follow the red-up/green-down convention used in Chinese markets: #A8342C for up, #2C7355 for down (always confirm the convention with the user). Every delta must state its baseline (e.g. "vs yesterday"). Show an em dash rather than "0" when the value is zero so it is not misread.',
    },
    badPrompt: 'Add a few numbers to show the recent data.',
    betterPrompt:
      'Add a group of stat cards: metric name 12px in the secondary color, value 28px with tabular-nums, a delta row that always states its baseline (e.g. "vs yesterday"), red-up/green-down, 4 columns on desktop / 2 on tablet / 1 on mobile, and an em dash instead of "0" so a zero value is not misread.',
    aliases: ['stat card', 'metric card', 'kpi', 'kpi card', 'metric tile', 'summary card'],
    tags: ['metric', 'comparison', 'glanceable'],
  },

  avatar: {
    oneLine: 'A small round image that stands in for a person or an entity.',
    description:
      'An avatar lets users recognize who or what something is at a glance, without reading names. The fallback chain matters enormously: when the image fails to load, show the initials of the name (the surname for Chinese names), and when that fails too, show a generic person icon.',
    looksLike:
      'The round portrait at the left of a chat list, the small circle next to a GitHub username, the avatar on every comment row.',
    fitsFor: 'Users · Commenters · Members',
    whenToUse: [
      { situation: 'You need to tell different people or entities apart', recommended: true },
      { situation: 'A list contains multiple people', recommended: true },
      { situation: 'You need to show who is currently signed in', recommended: true },
      { situation: 'There is only one person and no confusion is possible', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'An avatar that fails to load and leaves a gray hole makes the page look broken — always have a fallback.',
      'The avatar is not the tap target; the tap target should be the whole row or the name.',
    ],
    anatomy: [
      { label: 'Image', note: 'Square source cropped to a circle' },
      { label: 'Fallback', note: 'Initials / default icon' },
      { label: 'Ring', note: 'Presence indicator or VIP marker' },
      { label: 'Size', note: 'xs 16 / sm 24 / md 32 / lg 40 / xl 64' },
    ],
    aiPrompt: {
      basic: 'Add an avatar.',
      detailed:
        'Add an avatar to every row in a list: a 28px circle that falls back to the initials of the name (the surname for Chinese names) when the image fails, and to a default person icon if that fails too. Online users get a green ring.',
      implementation:
        'Make the circle with border-radius: 9999px plus overflow: hidden plus object-fit: cover. Add an onError handler to the img: on the first failure switch to an initials span (background a soft color hashed from the name), on the second failure switch to a default SVG icon. Presence uses a 2px green border separated by a 2px white border (border: 2px solid #fff; box-shadow: 0 0 0 2px #2C7355). Use the person\'s real name as the alt text. Size scale: 16/24/32/40/64.',
    },
    badPrompt: 'Add a user avatar.',
    betterPrompt:
      'Add avatars: a circle with object-fit: cover, an onError fallback chain of "initials (surname for Chinese names), then a default person icon", a background color hashed from the name, a white border plus a green ring for presence, and the real name as alt text.',
    aliases: ['avatar', 'profile picture', 'user picture', 'profile image', 'initials fallback', 'presence ring'],
    tags: ['identity', 'fallback', 'circular'],
  },

  timeline: {
    oneLine: 'A single line of events in chronological order, newest at the top.',
    description:
      'A timeline is a list that carries time. It adds two things over a plain List: explicit timestamps and visual continuity (one vertical line running through everything). What it expresses is "a series of things that happened".',
    looksLike:
      'A WeChat Moments feed, the tracking trail of an order, GitHub commit history, a system changelog.',
    fitsFor: 'Activity feed · Order tracking · Changelog',
    whenToUse: [
      { situation: 'Events have a meaningful chronological order', recommended: true },
      { situation: 'You need to convey process and progress (logistics, state changes)', recommended: true },
      { situation: 'The content is about what happened rather than the current state', recommended: true },
      { situation: 'You need to show future plans (countdowns)', recommended: 'mostly' },
      { situation: 'The content has no temporal dimension', recommended: false },
    ],
    whenNotToUse: [
      'At high volume the vertical line makes the page feel fragmented — consider a plain List with timestamps.',
      'Merge events that share a timestamp; never render two identical time points.',
    ],
    anatomy: [
      { label: 'Time Group', note: '"Today", "Yesterday"' },
      { label: 'Item', note: 'Avatar + content' },
      { label: 'Rail', note: 'The vertical line on the left, running through everything' },
      { label: 'Dot', note: 'The small node sitting on the rail' },
    ],
    aiPrompt: {
      basic: 'Show the records in chronological order.',
      detailed:
        'Build a timeline: grouped by "Today / Yesterday / Earlier", with a vertical line and nodes on the left, each entry showing an avatar, content, and a timestamp, and new entries inserted at the top.',
      implementation:
        'Use ol/li, or div with role="list". Fix a 32px-wide vertical line on the left (border-left) and give each entry an absolutely positioned dot. Add sticky date group headings at the top (background matching the page color so content does not show through). Animate new entries as they are inserted (height transition plus a brief highlight that fades out). Handle scroll performance in virtualized list scenarios.',
    },
    badPrompt: 'Display the records in chronological order.',
    betterPrompt:
      'Build a Timeline: group by "Today / Yesterday / Earlier", a vertical rail with node dots on the left, sticky date group headings, a highlight-and-fade animation for newly inserted entries, and semantic <time datetime> elements.',
    aliases: ['timeline', 'activity feed', 'vertical timeline', 'history', 'changelog', 'event log'],
    tags: ['chronological', 'process', 'grouped'],
  },

  // ---------------------------------------------------------- interaction
  'swipe-action': {
    oneLine:
      'Press a list item and slide it left, and actions like delete or archive slide out from underneath.',
    description:
      'Swipe actions hide "rarely used but still necessary" operations inside a gesture. It keeps the list extremely clean, at the cost of discoverability — users may never realize they can swipe. The standard fix is to make long press open the very same menu.',
    looksLike:
      'Swiping left on an iOS mail list to reveal Archive / Flag / Delete, swiping left on a WeChat chat row to reveal Delete / Mark as unread, swiping a todo row left to expose a red delete button.',
    fitsFor: 'Delete · Archive · Pin',
    whenToUse: [
      { situation: 'Secondary actions inside a high-frequency list', recommended: true },
      { situation: 'Reversible actions such as delete or archive', recommended: true },
      { situation: 'The interface needs to stay extremely minimal', recommended: true },
      { situation: 'It is the most common primary action', recommended: false },
      { situation: 'A desktop environment driven by a mouse', recommended: false },
    ],
    whenNotToUse: [
      'Discoverability is the hard flaw: you must ship a long-press or right-click entry point as an equivalent path.',
      'Only one menu can be open at a time; two visible menus at once leaves users confused.',
    ],
    anatomy: [
      { label: 'Swipe Threshold', note: 'Past 50% of the width or 30px' },
      { label: 'Row', note: 'Moves with the finger' },
      { label: 'Action Buttons', note: 'Revealed underneath, right-aligned' },
      { label: 'Snap', note: 'Snaps open or closed on release' },
      { label: 'Fallback', note: 'Long press or right click opens the same menu' },
    ],
    aiPrompt: {
      basic: 'List items can be swiped left.',
      detailed:
        'Add swipe actions to list items: past 50% of the width, reveal two buttons, "Pin" (blue) and "Delete" (red); on release, snap open; tapping outside closes it.',
      implementation:
        'Use pointer events plus touchstart/touchmove/touchend to track dx. When dx < -50px set state revealedId, apply transform: translateX(-140px) to the row, and absolutely position the two buttons on the right at 70px wide each. Use a CSS transition for the snap animation. Only one row may be in the revealed state at a time. Block vertical scrolling mid-swipe (determine the dominant gesture direction). You must also ship a long-press (500ms) entry point that opens the same menu, otherwise desktop and assistive-technology users cannot use this at all.',
    },
    badPrompt: 'The list can be swiped left to act.',
    betterPrompt:
      'Add Swipe Actions to list items: swiping left past 50% reveals "Pin" and "Delete" buttons and snaps open, tapping outside closes it, only one item may be open at a time, and a long press is provided as an equivalent entry point.',
    aliases: ['swipe action', 'swipe to reveal', 'swipe left', 'swipe gesture', 'slide to reveal', 'row actions'],
    tags: ['gesture', 'hidden actions', 'needs fallback'],
  },

  'pull-to-refresh': {
    oneLine: 'Pull down at the top of a list and release to reload the data.',
    description:
      'Pull to refresh replaces a refresh button with the physical intuition of "pull downward". Its biggest weakness is discoverability — users have to discover it by trying. So the majority of apps still keep a refresh button in the nav bar as a backup.',
    looksLike:
      'Pulling down on a WeChat Moments feed or a mail app, and the spinning arrow that appears at the top of virtually every news app.',
    fitsFor: 'Feed · Messages · News stream',
    whenToUse: [
      { situation: 'A mobile list whose content changes over time', recommended: true },
      { situation: 'Content is ordered with "newest first" (feed, messages, news)', recommended: true },
      { situation: 'Users actively want to update', recommended: true },
      { situation: 'Desktop', recommended: false },
      { situation: 'There is little content and it all fits on one screen', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'The feel of the gesture lives in the threshold (roughly 60–80px) and the damping factor — copying someone else\'s numbers will not feel right.',
      'You must lock the list while refreshing so it cannot be pulled again, otherwise multiple refreshes fire.',
    ],
    anatomy: [
      { label: 'Threshold', note: 'Roughly 64–80px' },
      { label: 'Indicator', note: 'Arrow rotates into a spinner as you pull' },
      { label: 'Refresh', note: 'Locks the list and disables re-triggering' },
      { label: 'Overscroll', note: 'Gets heavier the further you pull, for physical feedback' },
    ],
    aiPrompt: {
      basic: 'Support pull to refresh.',
      detailed:
        'Add pull to refresh to a list: pulling past 72px at the top triggers it, the indicator rotates with the pull progress, the list locks while refreshing, and it springs back and updates the content when done.',
      implementation:
        'Record the start Y on touchstart, compute deltaY = startY - currentY on touchmove, and damp the displacement with deltaY * 0.5 so the gesture feels heavier. Past 72px, swap the indicator from an arrow to a spinner. On touchend, if the threshold was passed, trigger the refresh and lock it (refreshLock = true), then spring back and unlock when finished. On mobile use overscroll-behavior: contain to avoid triggering the browser\'s own page refresh. On desktop, provide a separate explicit refresh button.',
    },
    badPrompt: 'Pulling down refreshes.',
    betterPrompt:
      'Add Pull to Refresh: damp the touch displacement with a 0.5 factor, trigger past 72px and switch the indicator from an arrow to a spinner, lock the list with refreshLock while refreshing to prevent duplicate triggers, spring back on completion, and provide a separate explicit refresh button on desktop.',
    aliases: ['pull to refresh', 'pull down refresh', 'refresh gesture', 'pull to reload', 'overscroll refresh'],
    tags: ['gesture', 'refresh', 'damping'],
  },

  'infinite-scroll': {
    oneLine:
      'Keep scrolling down and the next page loads automatically, with no "next page" button anywhere.',
    description:
      'Infinite scroll turns browsing into continuous, endless exploration. It fits content feeds people browse casually, but it brings three real problems: the footer becomes unreachable, you cannot return to where you were, and browser back/forward stops working.',
    looksLike:
      'Weibo, a Pinterest masonry feed as you scroll, a Zhihu feed — reach the bottom and the next batch starts loading on its own.',
    fitsFor: 'Feed · Inspiration · Social',
    whenToUse: [
      { situation: 'Content is exploratory with no clear end', recommended: true },
      { situation: 'The goal is casual browsing (social, inspiration, news)', recommended: true },
      { situation: 'The browse path does not need deep linking or sharing', recommended: true },
      { situation: 'Users need to reach "page N"', recommended: false },
      { situation: 'Content has a fixed structure (orders, invoices, logs)', recommended: false },
    ],
    whenNotToUse: [
      'Infinite scroll breaks the browser back button — users finish reading and cannot return to the list without re-scrolling through everything.',
      'It is bad for SEO: search engines cannot crawl past the first page of results.',
      'Always show an end-of-feed marker plus a "back to top" control at the bottom, otherwise users cannot tell whether there is more.',
    ],
    anatomy: [
      { label: 'Sentinel', note: 'Watched with IntersectionObserver' },
      { label: 'Loading', note: 'Three bouncing dots at the bottom' },
      { label: 'End Marker', note: '"You have reached the end"' },
      { label: 'Back to Top', note: 'Appears after scrolling past three screens' },
    ],
    aiPrompt: {
      basic: 'Load more automatically at the bottom.',
      detailed:
        'Load the next page automatically when the list scrolls to the bottom: show a loading animation, append the loaded items to the end of the list, and once everything is loaded show "You have reached the end" along with a "back to top" button.',
      implementation:
        'Use IntersectionObserver to watch a sentinel div at the end of the list (rootMargin: "200px" to trigger early), which performs far better than listening to scroll events. Set a loading flag while a request is in flight to prevent duplicate requests. On failure, show "Loading failed · Retry" at the bottom instead of failing silently. 20 items per page, and keep the scroll position stable when appending. After three screens of scrolling, show a "back to top" FAB in the bottom-right corner.',
    },
    badPrompt: 'Load more automatically when scrolled to the bottom.',
    betterPrompt:
      'Add Infinite Scroll: use IntersectionObserver on an end-of-list sentinel (rootMargin 200px) to trigger early, set a loading flag to prevent duplicate requests, surface a "Retry" affordance instead of failing silently, and show "You have reached the end" plus a "back to top" button once everything is loaded.',
    aliases: ['infinite scroll', 'infinite loading', 'auto loading', 'endless feed', 'masonry feed', 'auto paginate'],
    tags: ['auto-loading', 'exploratory', 'weak SEO'],
  },

  'drag-and-drop': {
    oneLine: 'Press something, drag it to another position, and release — and it moves there.',
    description:
      'Drag and drop lets users manipulate two abstract things directly: order and membership. It must ship a non-drag alternative, because dragging demands fine motor control and not everyone knows items can be dragged.',
    looksLike:
      'Dragging a card to another column on a Kanban board, moving a sticky note in Trello, repositioning a layer in a design tool, reordering a todo list by dragging.',
    fitsFor: 'Boards · Layers · Ordering',
    whenToUse: [
      { situation: 'Changing order or membership (boards, layers, rankings)', recommended: true },
      { situation: 'Spatial position itself carries meaning', recommended: true },
      { situation: 'A keyboard equivalent such as "Move to…" is provided', recommended: true },
      { situation: 'The ordering is purely cosmetic (users do not care about order)', recommended: false },
      { situation: 'You are just picking one option (a click is enough)', recommended: false },
    ],
    whenNotToUse: [
      'Drag and drop carries a high accessibility cost: you must support both the keyboard (Space to pick up, arrow keys to move, Space to drop) and a "Move to…" menu.',
      'Dragging on mobile has to handle auto-scroll and gesture conflicts, which makes it one of the hardest interactions to get right.',
    ],
    anatomy: [
      { label: 'Drag Handle', note: 'Shows the grab cursor on hover' },
      { label: 'Ghost', note: 'Semi-transparent copy following the pointer' },
      { label: 'Drop Target', note: 'Highlights to show the insertion point' },
      { label: 'Placeholder', note: 'Leaves a gap at the original position' },
      { label: 'Keyboard Alt', note: 'Arrow keys to move once picked up' },
    ],
    aiPrompt: {
      basic: 'Items can be dragged to reorder.',
      detailed:
        'Support drag-and-drop reordering: while dragging, leave a gap at the origin and show an insertion indicator line; on release, animate the item smoothly into its new position and update the underlying array order.',
      implementation:
        'Use HTML5 draggable or Pointer Events (the latter is recommended so touch works too). Record the start point on onPointerDown, and only enter the dragging state once movement passes a 5px threshold (this avoids conflicting with clicks). While dragging: the source element becomes a ghost at opacity 0.4 following the pointer, and the target position shows a 2px indicator line. Compute the insertion index by comparing the pointer position against each item\'s midpoint. On release, use a FLIP animation to let the other items settle smoothly. You must also add the keyboard path: with focus on an item, Space picks it up, Up/Down moves it, Space drops it, Esc cancels.',
    },
    badPrompt: 'Support dragging to change the order.',
    betterPrompt:
      'Implement drag-and-drop reordering: only enter the dragging state past a 5px movement threshold so clicks still work, make the source element semi-transparent and show an insertion line at the target, settle the remaining items with a FLIP animation on drop, and add the keyboard path (Space to pick up, Up/Down to move, Space to drop, Esc to cancel).',
    aliases: ['drag and drop', 'drag to reorder', 'dnd', 'draggable', 'reorder', 'drop target'],
    tags: ['ordering', 'spatial', 'needs keyboard alt'],
  },

  'long-press': {
    oneLine: 'Hold a finger down for about half a second and a row of options appears, or multi-select mode starts.',
    description:
      'Long press is how you handle the case where there is no second screen to put things on. It tucks low-frequency operations into an unobtrusive duration, but it also creates the "how long am I supposed to hold?" confusion, so visual and haptic feedback are mandatory.',
    looksLike:
      'Long-pressing an iOS app icon for Delete / Rename / Share, long-pressing an image on Android for Save / Edit / Delete, long-pressing a photo to enter multi-select.',
    fitsFor: 'Multi-select · Icon actions · Hidden menus',
    whenToUse: [
      { situation: 'You need low-frequency actions without spending screen space', recommended: true },
      { situation: 'You need to enter multi-select mode', recommended: true },
      { situation: 'You need dragging but want to guard against accidental triggers', recommended: true },
      { situation: 'It is the primary action', recommended: false },
      { situation: 'Users have no idea they can long press', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'The duration (usually 500ms) must be signalled: haptics plus a visual change, otherwise users think the tap did not register.',
      'Never let a long press carry the only path to a critical action.',
    ],
    anatomy: [
      { label: 'Hold Threshold', note: 'Roughly 500ms' },
      { label: 'Feedback', note: 'Haptics plus a highlight, mandatory' },
      { label: 'Menu', note: 'Or an entry into multi-select mode' },
      { label: 'Cancel', note: 'Moving away or releasing cancels' },
    ],
    aiPrompt: {
      basic: 'Long press pops up a menu.',
      detailed:
        'Add a long press to list items: after holding for 500ms, fire haptics and open an action menu (Edit / Share / Delete); moving more than 10px or releasing early cancels it.',
      implementation:
        'On pointerdown start setTimeout(500); on pointermove, clear the timeout once movement exceeds 10px (this avoids conflicting with scrolling); on pointerup / pointercancel clear the timer. On trigger, call navigator.vibrate(10) (it only works after a user interaction) and immediately add a highlight background to the item as visual confirmation. Position the menu near the point that was pressed. The 10px movement threshold is critical — without it users try to scroll the list and trigger the menu instead.',
    },
    badPrompt: 'Long press can pop up a menu.',
    betterPrompt:
      'Add a Long Press: start a 500ms timer on pointerdown, clear it once movement exceeds 10px (so scrolling is not hijacked), give both haptic and visual highlight feedback on trigger, position the menu near the press point, and clear the timer on pointerup/cancel.',
    aliases: ['long press', 'press and hold', 'long press gesture', 'hold gesture', 'long tap'],
    tags: ['gesture', 'hidden', 'needs feedback'],
  },

  'context-menu': {
    oneLine:
      'The row of actions that pops up when you right-click something (or long-press it on a phone).',
    description:
      'A context menu collects "operations that only apply to this one object". Its contents should genuinely depend on the context — right-clicking an image offers "Set as cover photo", right-clicking a filename offers "Rename".',
    looksLike:
      'The browser menu on a right-clicked link, the menu on a right-clicked desktop file, the floating formatting menu that appears over selected text in Notion.',
    fitsFor: 'Files · Text · Canvas objects',
    whenToUse: [
      { situation: 'The actions apply only to a specific object', recommended: true },
      { situation: 'The actions are low-frequency and not worth main-surface space', recommended: true },
      { situation: 'You need to keep the main interface clear', recommended: true },
      { situation: 'These actions are high-frequency', recommended: false },
      { situation: 'It is the only entry point on mobile', recommended: false },
    ],
    whenNotToUse: [
      'Mobile has no right click, and a long-press menu can collide with the system or browser default menu at the system layer.',
      'Past about eight items you should group them or choose a different form.',
    ],
    anatomy: [
      { label: 'Trigger', note: 'Right click / long press' },
      { label: 'Menu', note: 'Positioned at the pointer' },
      { label: 'Item', note: '32px tall, icon + label' },
      { label: 'Separator', note: 'Groups dangerous actions apart' },
      { label: 'Shortcut', note: 'Shown right-aligned, e.g. Command-C' },
    ],
    aiPrompt: {
      basic: 'Right click pops up a menu.',
      detailed:
        'Right-click a file to open a menu: Copy / Move to… / Rename / (separator) / Delete (red, at the bottom). Support keyboard navigation up and down.',
      implementation:
        'Listen for the contextmenu event and preventDefault. Position a Popover at the pointer\'s clientX/clientY, flipping at viewport edges. Use role="menu" with role="menuitem". Support Up/Down to move, Enter to run, Esc to close. Separate dangerous actions (Delete) with a divider, place them last, and set their label in red. Show the keyboard shortcut on the right of each item (e.g. Command-C). On mobile, substitute a long press but preventDefault to suppress the system default menu.',
    },
    badPrompt: 'Right click pops up a menu.',
    betterPrompt:
      'Add a Context Menu: listen for contextmenu and preventDefault, position the Popover at the pointer with viewport-edge flipping, use role=menu/menuitem, make Up/Down/Enter/Esc work, isolate dangerous items behind a separator at the bottom in red, and show shortcuts on the right.',
    aliases: ['context menu', 'right click menu', 'secondary menu', 'shortcut menu', 'object menu'],
    tags: ['right click', 'object-level', 'low-frequency'],
  },

  'progressive-disclosure': {
    oneLine:
      'Show only what the user needs by default, and hide the rest behind a "Show more" affordance.',
    description:
      'Progressive disclosure is a delayed-gratification strategy: give the 80% of information the user needs first and let them decide whether to see the other 20%. It solves choice overload — when there are too many options, users freeze.',
    looksLike:
      'An order detail page that shows only "Total $128" plus a "Show details" link, revealing line items on click; a permission request that says "Needs camera access" instead of dumping a full screen of explanation.',
    fitsFor: 'Orders · Advanced options · Permission explanations',
    whenToUse: [
      { situation: 'There is a lot of information but most users only need a slice', recommended: true },
      { situation: 'Advanced options would scare off beginners', recommended: true },
      { situation: 'You can tier the experience by user sophistication', recommended: true },
      { situation: 'Missing information would lead to misuse', recommended: false },
      { situation: 'The hidden content happens to be safety-related', recommended: false },
    ],
    whenNotToUse: [
      'Hiding something like "Delete" behind a "More" menu is a disaster.',
      'Do not use it to conceal price, fees, or risk — users must see those.',
    ],
    anatomy: [
      { label: 'Summary', note: 'The 80% that is visible by default' },
      { label: 'Trigger', note: '"Show more ›"' },
      { label: 'Detail', note: 'The hidden 20%' },
      { label: 'State', note: 'Remembers the last choice' },
    ],
    aiPrompt: {
      basic: 'Show part of it first, collapse the rest.',
      detailed:
        'An order detail view shows only the total and a "View details" link by default; expanding it reveals one row per line item. Remember the user\'s expansion choice from last time.',
      implementation:
        'Collapsed by default. The trigger is a text button (not an arrow icon, because "More" is easier to grasp than "Expand") with aria-expanded. Animate the expanded content with a grid-template-rows 0fr to 1fr transition. Persist the state to localStorage so a user who last had it expanded sees it expanded next time (remembering user preference). Bear in mind that this pattern does not apply to safety or pricing information.',
    },
    badPrompt: 'Only show part of it, collapse the rest.',
    betterPrompt:
      'Implement Progressive Disclosure: show a summary plus a "View details" text button with aria-expanded by default, animate expansion with a 0fr to 1fr transition, and store the user\'s expansion choice in localStorage so it persists — but never hide pricing, risk, or safety information.',
    aliases: ['progressive disclosure', 'show more', 'layered reveal', 'expand to reveal', 'disclosure'],
    tags: ['layered', 'reduces load', 'remembers state'],
  },

  'optimistic-ui': {
    oneLine:
      'Update the interface to "already succeeded" before the server answers, and roll back if it fails.',
    description:
      'Optimistic UI is a qualitative leap in feel: tapping Like fills the icon instantly instead of spinning for two seconds. The price is that you must handle rollback, which means preparing exactly how you will undo the optimistic update.',
    looksLike:
      'The heart icon lighting up the instant you tap it on Xiaohongshu, a sent message appearing immediately in a WeChat thread with a sending marker, a todo item striking through the moment it is checked.',
    fitsFor: 'Like · Favorite · Send · Checkbox',
    whenToUse: [
      { situation: 'The action has a high success rate (>95%)', recommended: true },
      { situation: 'Failure can be rolled back cheaply', recommended: true },
      { situation: 'Waiting would make the interface feel sluggish', recommended: true },
      { situation: 'The action is irreversible (transfers, payments)', recommended: false },
      { situation: 'The failure rate is high', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Irreversible actions like transfers and payments must wait for server confirmation.',
      'A rollback has to be surfaced: rolling back silently makes users think their action was lost.',
    ],
    anatomy: [
      { label: 'Instant Apply', note: 'The UI changes first' },
      { label: 'Pending Marker', note: 'Semi-transparent or a small spinner' },
      { label: 'Rollback', note: 'Restored when the request fails' },
      { label: 'Error Toast', note: 'Explains what happened' },
    ],
    aiPrompt: {
      basic: 'Pretend it succeeded, roll back on failure.',
      detailed:
        'When the user taps Like, light up the icon immediately; if the API call fails, roll it back to unliked and show a toast saying "Action failed. Please retry."',
      implementation:
        'On click, first mutate local state so the UI updates immediately, and record prevState for rollback, then fire the request. While the request is in flight, mark that element as pending with semi-transparency or a small spinner (this prevents double submits). In the catch branch: restore prevState, show a toast reading "Action failed. Please retry." with a "Retry" button. The key point: the rollback must be visible to the user and must never restore silently. Pair it with a Snackbar undo.',
    },
    badPrompt: 'Update the interface first, roll back on failure.',
    betterPrompt:
      'Implement Optimistic UI: mutate local state first and record prevState, mark the element as pending during the request to prevent double clicks, and on failure restore the state plus show a "Action failed" toast with a "Retry" button — the rollback must be visible to the user, never silent.',
    aliases: ['optimistic ui', 'optimistic update', 'optimistic rendering', 'instant feedback', 'rollback on failure'],
    tags: ['instant', 'rollback', 'perceived speed'],
  },

  'inline-validation': {
    oneLine:
      'Tell the user while they type whether the value is right, instead of waiting until they submit.',
    description:
      'Timing is the whole game with inline validation: erroring on every keystroke as the user types is the most irritating version of it, and validating on blur and submit is the correct one. Its difference from form validation is about where and when the message appears.',
    looksLike:
      'Typing an email and seeing a checkmark with "Format looks good" appear as you go, then "Enter a complete email address" on blur; a live-updating "Password strength: medium" under the password field.',
    fitsFor: 'Forms · Signup · Password strength',
    whenToUse: [
      { situation: 'The input has a hard format constraint', recommended: true },
      { situation: 'Errors can be detected automatically with an actionable fix', recommended: true },
      { situation: 'The form is long and filling it in is costly', recommended: true },
      { situation: 'Errors can only be known after submitting', recommended: 'mostly' },
      { situation: 'The rules would fire an error on every keystroke', recommended: false },
    ],
    whenNotToUse: [
      'Do not flash red the moment the user starts typing — let them finish first, then judge.',
      'The message should tell the user how to fix it, not merely where the problem is.',
    ],
    anatomy: [
      { label: 'Field', note: 'Red border in the error state' },
      { label: 'Message', note: 'Red or green, explains how to fix it' },
      { label: 'Icon', note: 'Check or bang, never the only signal' },
      { label: 'Timing', note: 'On blur or submit, never per keystroke' },
    ],
    aiPrompt: {
      basic: 'Check the format as they type.',
      detailed:
        'Validate an email field on blur: when it is valid show a green check plus "Format looks good", when it is not show a red border plus "Enter a complete email address containing @".',
      implementation:
        'Timing: do not validate on focus, validate once on blur, and after that do not validate again while the user keeps typing until the next blur. Never report an error in onChange on every keystroke. Error state: border #A8342C plus 13px red text below the field, plus aria-invalid="true" and aria-describedby pointing at the error text. Write actionable copy: "Must contain @" beats "Invalid format". Show a green check when the value is valid to build confidence. On submit, if there are errors, focus the first erroring field.',
    },
    badPrompt: 'Check the format while typing.',
    betterPrompt:
      'Add Inline Validation: validate only on blur and submit (never report an error from onChange on every keystroke), write error copy as an actionable fix ("Must contain @" rather than "Invalid format"), pair a red border with the error text plus aria-invalid and aria-describedby, and show a green check when the value is valid.',
    aliases: ['inline validation', 'live validation', 'input validation', 'real-time validation', 'field validation'],
    tags: ['validation', 'timing', 'actionable'],
  },

  // -------------------------------------------------------------- general
  'modal-stateful': {
    oneLine:
      'A dialog that carries state and a place in a multi-step flow, asking "are you sure?" before an action you might regret — unlike a plain modal that just displays information.',
    description:
      'The value of a confirmation dialog is not interception, it is making the consequences legible. A good one names the specific impact (what gets deleted, whether it can be recovered) instead of a bare "Are you sure?" — the bare version only trains a conditioned reflex to click through.',
    looksLike:
      'Tapping "Delete photo" and getting "Delete 3 photos? They will move to Recently Deleted and be cleared after 30 days." with two buttons below: Cancel / Delete.',
    fitsFor: 'Delete · Close account · Pay · Clear',
    whenToUse: [
      { situation: 'The action is irreversible and high impact', recommended: true },
      { situation: 'A mis-tap is expensive (deleting data, closing an account, paying)', recommended: true },
      { situation: 'A Snackbar undo is offered as an alternative', recommended: true },
      { situation: 'The action is frequent and easily recoverable (clearing a text field)', recommended: false },
      { situation: 'The action could just become an Undo instead of a gate (delete)', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'If every action asks for confirmation, users learn to click the first button whenever a dialog appears.',
      'If you can offer an Undo, do not gate the action — let users be brave and fast, then give them a way to change their mind.',
    ],
    anatomy: [
      { label: 'Title', note: 'Names the consequence, not "Alert"' },
      { label: 'Impact', note: '"3 photos will be deleted"' },
      { label: 'Cancel', note: 'Holds focus by default' },
      { label: 'Confirm', note: 'A verb, in the danger color' },
    ],
    aiPrompt: {
      basic: 'Ask for confirmation before deleting.',
      detailed:
        'Before deleting 3 photos, show a confirmation dialog: title "Delete 3 photos?", body "These photos will move to Recently Deleted and be cleared after 30 days.", Cancel holds focus by default, and the confirm button is red.',
      implementation:
        'role="alertdialog" with aria-modal. On open, place focus on "Cancel" by default (the safe default; Esc should also mean cancel). Word the confirm button as the verb "Delete" rather than "OK", and color it danger red. Close immediately after the action runs and show a Snackbar offering undo. Do not let Esc trigger a dangerous action inside the dialog. For bulk operations, do not confirm item by item — state the total before the operation instead.',
    },
    badPrompt: 'Show a confirmation dialog before deleting.',
    betterPrompt:
      'Show an alertdialog before deleting: title the consequence ("Delete 3 photos?") rather than "Are you sure?", put focus on "Cancel" by default, use a red verb "Delete" on the confirm button, and offer an undo via Snackbar after the action runs.',
    aliases: ['confirmation dialog', 'confirm dialog', 'are you sure', 'destructive confirm', 'stateful modal', 'confirmation modal'],
    tags: ['confirmation', 'consequences', 'safe default'],
  },

  'load-more': {
    oneLine:
      'A "Load more" button at the bottom of a list that appends another batch when tapped.',
    description:
      'Load more is the compromise between pagination and infinite scroll: it keeps the user in control (nothing interrupts them) while not breaking browsing (no jump to a new page). Its weakness is that users may never tap it.',
    looksLike:
      'The "Read more" button at the end of an article, "View more replies" under a comment thread, "Load more results" at the bottom of a search results page.',
    fitsFor: 'Articles · Comments · Long lists',
    whenToUse: [
      { situation: 'Content is long but does not need page jumps', recommended: true },
      { situation: 'You want to avoid the interruption of infinite scroll', recommended: true },
      { situation: 'Users should control the pace of loading themselves', recommended: true },
      { situation: 'Content is linear reading (articles, comments)', recommended: true },
      { situation: 'There is a lot of data and users need to jump to a specific page', recommended: false },
    ],
    whenNotToUse: [
      'With a lot of content, "Load more" may never be tapped — at that point just use infinite scroll.',
      'Keep the scroll position from jumping after loading, otherwise users lose their place.',
    ],
    anatomy: [
      { label: 'Trigger', note: 'Text button, centered or full-width' },
      { label: 'Loading', note: 'Spinner inside the button' },
      { label: 'Append', note: 'New content joins the end' },
      { label: 'End Note', note: '"No more results"' },
    ],
    aiPrompt: {
      basic: 'Add a load more button at the bottom of the list.',
      detailed:
        'Add a "Load more" button at the bottom of a list: on click the button shows loading and is disabled, 20 more items are appended, the scroll position does not jump, and once everything is loaded it shows "You have reached the end".',
      implementation:
        'Set a loadingLock while the button is loading to prevent double clicks. After loading, do not change the position of existing content (items are appended at the end so earlier positions do not move, but make sure the scroll anchor is identical before and after the append). Once all content is loaded, replace the button with grey text reading "You have reached the end". Use skeletons for the first load rather than an empty list.',
    },
    badPrompt: 'Add a load more button at the bottom.',
    betterPrompt:
      'Add a "Load more" button at the bottom of a list: on click show loading and lock against repeat clicks, append content while keeping the scroll position from jumping, replace the button with "You have reached the end" once everything is loaded, and use skeletons for the first load.',
    aliases: ['load more', 'show more', 'view more', 'more button', 'append more', 'see more'],
    tags: ['on-demand', 'user control', 'append'],
  },

  'segmented-control': {
    oneLine:
      'A compact, mutually exclusive slider button group for quickly switching view modes or data dimensions within the same context.',
    description:
      'A segmented control is a compact exclusive toggle control where the selected segment has a pill or filled highlight. It is primarily used to switch observation perspectives on the same body of content or dataset (such as Day / Week / Month, List / Card, Light / Dark). It targets different presentations of the same object, rather than large distinct pages with disparate structures.',
    looksLike:
      'The Day / Week / Month control at the bottom of the iOS Photos viewer, the segmented button on a Mac, the List / Map toggle in a maps app.',
    fitsFor: 'View switching · Time range · Mode',
    whenToUse: [
      { situation: 'Rapid switching between 2–4 view modes', recommended: true },
      { situation: 'All the options are very short (1–4 characters or concise words)', recommended: true },
      { situation: 'You want the control to hug its content or sit compactly in a header/toolbar', recommended: true },
      { situation: 'Each option hosts a large and structurally distinct sub-page (use Tabs instead)', recommended: false },
      { situation: 'The option labels vary a lot in length', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'If each option represents a structurally distinct page section, prefer Tabs; Segmented Control is for lightweight view and mode switching on the same screen.',
      'Wildly different label lengths make the segments look broken — either use icons uniformly or switch to a Select.',
    ],
    anatomy: [
      { label: 'Track', note: 'Light gray background wrapping all segments' },
      { label: 'Segment', note: 'Equal width or sized to content' },
      { label: 'Selected', note: 'White fill plus a shadow' },
      { label: 'Label', note: 'One to four words is ideal' },
    ],
    aiPrompt: {
      basic: 'Add a toggle button group.',
      detailed:
        'Add a Segmented Control with three segments — Day / Week / Month — where the selected item has a white fill and a subtle shadow. Switching updates the current dataset presentation without navigating away.',
      implementation:
        'Outer div with a light gray background #F2F0EB, 8px radius and 3px padding, containing buttons with flex: 1. The selected item gets a white background plus box-shadow 0 1px 3px rgba(0,0,0,0.1) and a slight scale-up. Use role="tablist" with role="tab" and aria-selected, or radio group semantics if it is genuinely a choice. For the transition, translate the white pill with transform rather than swapping it instantly — it feels much smoother.',
    },
    badPrompt: 'Add a few buttons that toggle.',
    betterPrompt:
      'Add a Segmented Control: 2–4 segments inside a light gray track, the selected one with a white fill and shadow, the sliding pill animated with transform, expressed with role=tablist/tab + aria-selected (or radio group), for in-page view switching.',
    aliases: ['segmented control', 'segmented', 'segmented button', 'button group', 'toggle group'],
    tags: ['compact', 'views', 'same page'],
  },

  'stepper-input': {
    oneLine:
      'A control for stepping a number up and down, with a decrement button on the left, the current value in the middle, and an increment button on the right.',
    description:
      'A number stepper is built for small adjustments: cart quantity 1 to 2 to 3. Its difference from a slider is that a stepper suits discrete, small steps that need to be exact, while a slider suits continuous, large adjustments.',
    looksLike:
      'The "− 1 +" control on each cart line, the serving-count stepper on a food delivery order.',
    fitsFor: 'Cart · Servings · Quantity',
    whenToUse: [
      { situation: 'Incrementing and decrementing within a small integer range', recommended: true },
      { situation: 'An exact value is required (dragging will not do)', recommended: true },
      { situation: 'The quantity has a minimum and a maximum', recommended: true },
      { situation: 'The user needs to adjust across a wide range', recommended: false },
      { situation: 'The value needs continuous decimal precision', recommended: false },
    ],
    whenNotToUse: [
      'Decide what happens at zero: does it remove the row, or does it just stop decrementing?',
      'Disable the corresponding button when a bound is reached so the limit is visible, not mysterious.',
    ],
    anatomy: [
      { label: 'Decrement', note: 'Disabled at the minimum' },
      { label: 'Value', note: 'Centered, editable' },
      { label: 'Increment', note: 'Disabled at the maximum' },
      { label: 'Bounds', note: 'Constrained by min/max' },
    ],
    aiPrompt: {
      basic: 'Add a control for incrementing and decrementing a number.',
      detailed:
        'Add a quantity stepper: minus and plus buttons on either side with the number in the middle, a range of 1–99, the minus button disabled at 1, the plus button disabled at 99, and a number in the middle that can also be typed into directly.',
      implementation:
        'Flex container with two icon buttons on the sides (32x32) and an input in the middle that is either read-only or editable. Keep value in useState and clamp it to [min, max] on click. At a bound, disable the button, drop it to 40% opacity, and set cursor: not-allowed. The increment and decrement buttons need a hit area of at least 32x32 (44x44 recommended on mobile). Use tabular-nums so the digits do not jitter as they change.',
    },
    badPrompt: 'Add something to increment and decrement a number.',
    betterPrompt:
      'Add a Number Stepper: increment and decrement icon buttons flanking the value, clamped to [min,max], with the corresponding button disabled and dimmed at each bound, hit areas of at least 44x44, and tabular-nums so the digits do not jitter.',
    aliases: ['number stepper', 'stepper', 'quantity stepper', 'increment buttons', 'counter input', 'plus minus'],
    tags: ['small steps', 'precise', 'bounded'],
  },
};
