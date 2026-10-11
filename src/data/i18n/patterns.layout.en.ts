import type { PatternTranslations } from './types';

export const layoutPatternsEn: PatternTranslations = {
  container: {
    oneLine: 'Constrains page width and centers content to prevent overly long lines on wide displays.',
    description:
      'The core of a container is readability and spatial restraint. Without max-width constraints, body text stretches across thousands of pixels on ultra-wide monitors, breaking human scanning rhythm (violating the 65ch optimal line length rule). Conversely, rigid fixed pixel widths induce painful horizontal scrolling on mobile. A proper container is an adaptive safety boundary.',
    looksLike:
      'Whether viewed on a 13-inch laptop or a 34-inch ultrawide monitor, the text and primary cards stay neatly collected within a comfortable 1200px boundary, leaving breathing room along the edges.',
    fitsFor: 'Editorial articles · SaaS landing pages · Form flows · Card collections',
    whenToUse: [
      { situation: 'Article reading, blogs, and long-form editorial content (65ch to 75ch limit)', recommended: true },
      { situation: 'SaaS landing pages and responsive card grid boundaries', recommended: true },
      { situation: 'Form submissions, settings pages, and checkout workflows', recommended: true },
      { situation: 'Full-bleed dashboards, interactive maps, or video editor timelines', recommended: false },
      { situation: 'Full-width banner sections (outer section bleeds edge-to-edge, inner stays centered)', recommended: 'mostly' },
    ],
    whenNotToUse: [
      'Full-screen immersive tools (maps, canvas boards, media players) where forced max-widths break immersion.',
      'Hardcoding fixed pixel widths (e.g. width: 1200px) that cause horizontal overflow on mobile screens.',
    ],
    anatomy: [
      { label: 'Max-Width', note: 'Limits line length to comfortable bounds (e.g. max-w-7xl)' },
      { label: 'Margin Auto', note: 'Centers the container horizontally across viewports' },
      { label: 'Gutter / Padding', note: 'Prevents content from sticking to screen edges (px-4 to px-8)' },
      { label: 'Content Well', note: 'Inner wrapper like max-w-prose for optimal reading line length' },
    ],
    aiPrompt: {
      basic: 'Keep page content centered without stretching edge-to-edge.',
      detailed:
        'Wrap page body in a centered container: max-width 1280px, horizontally centered with auto margins, 16px horizontal padding on mobile, 32px on desktop, with body copy capped at 65 characters per line.',
      implementation:
        'Outer section full-width with inner div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8". Wrap editorial blocks in class="max-w-prose" to preserve comfortable reading line lengths. Never hardcode pixel widths on mobile.',
    },
    badPrompt: 'Center the page at fixed 1200px width.',
    betterPrompt:
      'Use an adaptive container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8, constrain prose to max-w-prose, and let background sections bleed edge-to-edge while keeping content centered.',
    aliases: ['container', 'max-width wrapper', 'content well', 'page bounds', 'centered wrapper'],
    tags: ['container', 'max-width', 'responsive', 'readability'],
  },
  hero: {
    oneLine: 'The primary above-the-fold spotlight communicating headline value and primary calls to action.',
    description:
      'The hero is your digital storefront window. Visitors decide within three seconds whether to stay or bounce based on this single viewport. An effective hero avoids visual clutter, clearly stating what the product is, the problem it solves, and the immediate action to take, supported by crisp hierarchy and high-contrast conversion buttons.',
    looksLike:
      'The first screen of a modern website: a punchy display headline, two explanatory sentences, a high-contrast Free Trial button, and a floating preview of the actual product UI on the right.',
    fitsFor: 'SaaS landing pages · Product showcases · Brand launches · Open source homepages',
    whenToUse: [
      { situation: 'Product landing pages, SaaS homepages, and brand showcases', recommended: true },
      { situation: 'Major feature launch announcements and marketing campaigns', recommended: true },
      { situation: 'Portfolio homepages establishing immediate professional identity', recommended: true },
      { situation: 'Internal enterprise tools or daily administrative dashboards', recommended: false },
      { situation: 'Utility-first tools where users need immediate input focus', recommended: false },
    ],
    whenNotToUse: [
      'Forcing oversized heroes on daily SaaS utilities where returning users just want to get to work.',
      'Hardcoding h-screen on mobile where dynamic browser address bars obscure primary CTAs.',
    ],
    anatomy: [
      { label: 'Eyebrow', note: 'Announcement badge or category pill above headline' },
      { label: 'Display H1', note: 'Dominant value proposition in display typography' },
      { label: 'Subtitle', note: 'Explains use cases and customer pain points in 1-2 lines' },
      { label: 'CTA Group', note: 'Primary conversion action paired with secondary ghost button' },
      { label: 'Visual Showcase', note: 'Product UI preview mockup, interactive demo, or illustration' },
    ],
    aiPrompt: {
      basic: 'Build a hero section at the top of the homepage.',
      detailed:
        'Build a SaaS hero: headline "Build AI apps in 5 minutes", two-line subtitle explaining core perks, primary high-contrast CTA "Start Free" alongside ghost button "Docs", paired with a floating dark product mockup below.',
      implementation:
        'Use min-h-[80vh] flex flex-col items-center justify-center text-center. H1 with text-4xl sm:text-6xl font-extrabold tracking-tight. Group CTAs with flex flex-wrap gap-4. Product mockup styled with rounded-xl border border-line shadow-2xl.',
    },
    badPrompt: 'Put a big headline and image at the top.',
    betterPrompt:
      'Build a modern SaaS hero: min-h-[85vh], centered eyebrow badge, tight H1 (text-5xl tracking-tight), muted subtitle, dual CTA buttons, and a tilted perspective UI screenshot.',
    aliases: ['hero', 'hero section', 'above-the-fold showcase', 'hero banner', 'landing header'],
    tags: ['hero', 'conversion', 'H1', 'CTA', 'above-the-fold'],
  },
  'bento-grid': {
    oneLine: 'Asymmetric modular grid inspired by bento lunchboxes, arranging varied feature tiles cleanly.',
    description:
      'Bento Grid breaks free from repetitive uniform cards. Borrowing from traditional bento boxes that parcel main dishes, sides, and rice into proportional compartments, this layout assigns large 2x2 or 2x1 tiles to flagship capabilities while tucking secondary perks into compact modules. The result is visual dynamism anchored by crisp external geometry.',
    looksLike:
      'Apple product pages or tech keynotes: a large dark tile showing chip performance on the top left, two small clean tiles for battery and ports on the right, and a wide panoramic card spanning the bottom.',
    fitsFor: 'SaaS feature matrices · Hardware showcases · Portfolio highlights · Metric summaries',
    whenToUse: [
      { situation: 'Product feature matrices requiring clear hierarchy and visual rhythm', recommended: true },
      { situation: 'Feature suites where benefits vary substantially in importance and media type', recommended: true },
      { situation: 'Modern tech hardware, software ecosystems, and creative agency highlights', recommended: true },
      { situation: 'Homogeneous tabular datasets with identical data fields', recommended: false },
      { situation: 'Unbounded, user-generated feeds with arbitrary aspect ratios', recommended: false },
    ],
    whenNotToUse: [
      'Forcing 10 equal-weight form inputs into asymmetric boxes, creating cognitive chaos.',
      'Failing to provide a single-column fallback on mobile, causing severe layout crushing.',
    ],
    anatomy: [
      { label: 'Hero Tile', note: 'Dominant 2x2 or 2x1 tile spotlighting flagship feature' },
      { label: 'Supporting Tiles', note: 'Standard 1x1 modules detailing complementary perks' },
      { label: 'Wide Tile', note: 'Full-row span highlighting panoramic metrics or workflows' },
      { label: 'Uniform Radius & Gap', note: 'Consistent rounded corners and gutters anchoring the grid' },
    ],
    aiPrompt: {
      basic: 'Make a bento grid to display product features.',
      detailed:
        'Create a Bento Grid with 4 tiles: tile 1 spans 2 columns featuring an interactive preview, tiles 2 and 3 are standard 1-column cards, tile 4 spans full bottom width. Uniform 16px rounded corners and subtle borders.',
      implementation:
        'Container uses display: grid, grid-template-columns: repeat(3, minmax(0, 1fr)), gap: 16px. First tile gets md:col-span-2 md:row-span-2, standard tiles 1 column, bottom tile md:col-span-3. Fallback to grid-cols-1 on small viewports.',
    },
    badPrompt: 'Arrange some different sized cards.',
    betterPrompt:
      'Design a Bento Grid feature section: grid-cols-1 md:grid-cols-3 gap-4, key feature tile md:col-span-2 md:row-span-2 with rich visuals, surrounding cards for secondary stats, collapsing gracefully on mobile.',
    aliases: ['bento grid', 'bento box', 'modular bento', 'apple-style grid', 'asymmetric grid'],
    tags: ['bento', 'grid', 'asymmetric', 'features', 'apple-style'],
  },
  masonry: {
    oneLine: 'Dynamic multi-column layout where variable-height items stack tightly without vertical gaps.',
    description:
      'Masonry solves the problem of awkward whitespace left by mismatched media aspect ratios in rigid grids. Mimicking stonemasons fitting uneven bricks, each arriving card slots immediately beneath the shortest column. This eliminates gaping holes, producing a lush, uninterrupted waterfall of rich imagery and social cards.',
    looksLike:
      'Pinterest or Red/Xiaohongshu feeds: a tall vertical photo on the left, a square card on the right followed immediately by a medium recipe snapshot, with columns staggering naturally without dead space.',
    fitsFor: 'Photo galleries · UGC social feeds · E-commerce reviews · Creative moodboards',
    whenToUse: [
      { situation: 'Visual inspiration feeds, photography galleries, and Pinterest-style boards', recommended: true },
      { situation: 'User-generated content (UGC) where image dimensions cannot be normalized', recommended: true },
      { situation: 'E-commerce buyer reviews and social commerce showcases', recommended: true },
      { situation: 'Strict horizontal comparison tables where row alignment is mandatory', recommended: false },
      { situation: 'Sequential procedural step-by-step documentation workflows', recommended: false },
    ],
    whenNotToUse: [
      'Using staggered heights for data tables where users must scan horizontally across matching rows.',
      'Omitting break-inside-avoid, allowing browsers to awkwardly bisect cards across columns.',
    ],
    anatomy: [
      { label: 'Columns', note: 'Adaptive column tracks scaling from 2 to 4 based on viewport' },
      { label: 'Variable-Height Card', note: 'Self-sizing cards expanding to natural image aspect ratios' },
      { label: 'Gutter Gap', note: 'Consistent horizontal and vertical gutters between brick tiles' },
      { label: 'Break Avoid', note: 'CSS break-inside: avoid preventing cards from splitting across columns' },
    ],
    aiPrompt: {
      basic: 'Build a Pinterest style masonry waterfall feed.',
      detailed:
        'Implement a responsive masonry feed using CSS columns (2 columns on mobile, 3 to 4 on desktop): cards with 12px rounded corners, 16px bottom margins, break-inside-avoid, holding images, titles, and engagement counts.',
      implementation:
        'Use CSS Multi-column layout: class="columns-2 md:columns-3 lg:columns-4 gap-4". Cards must apply class="break-inside-avoid mb-4 rounded-xl overflow-hidden bg-surface border border-line". Images set to w-full h-auto object-cover.',
    },
    badPrompt: 'List cards with uneven heights.',
    betterPrompt:
      'Implement an adaptive masonry layout: columns-2 sm:columns-3 lg:columns-4 gap-4, apply break-inside-avoid mb-4 to card wrappers, maintain natural aspect ratios, and prevent layout thrashing.',
    aliases: ['masonry', 'waterfall grid', 'pinterest layout', 'dynamic flow', 'staggered grid'],
    tags: ['masonry', 'waterfall', 'pinterest', 'columns', 'galleries'],
  },
  'split-screen': {
    oneLine: 'Divides the screen into equal halves, balancing emotional storytelling with functional utility.',
    description:
      'Split Screen harmonizes emotional brand resonance with focused transactional tasks. Commonly leveraged across login portals, checkout funnels, and dual-choice forks: one pane bathes the user in rich brand visuals, customer testimonials, or animations, while the companion pane provides a distraction-free interactive form.',
    looksLike:
      'A modern SaaS sign-in screen: the entire left half is a deep navy gradient featuring an illustration and rotating testimonials, while the right half is a crisp white form with login fields.',
    fitsFor: 'User authentication · Checkout funnels · Persona forks · Direct product face-offs',
    whenToUse: [
      { situation: 'Authentication flows (sign in, sign up, password recovery)', recommended: true },
      { situation: 'Dual-path onboarding forks (e.g. Individual vs Team selection)', recommended: true },
      { situation: 'Checkout flows (left-side order summary, right-side payment form)', recommended: true },
      { situation: 'Mobile-only native apps where horizontal 50/50 splits starve touch targets', recommended: false },
      { situation: 'Data-dense analytical dashboards where half-screen wastes horizontal space', recommended: false },
    ],
    whenNotToUse: [
      'Preserving horizontal splits on mobile screens, squeezing forms into unusable slivers.',
      'Failing to hide decorative graphics on mobile, forcing users to scroll past fluff to reach inputs.',
    ],
    anatomy: [
      { label: 'Brand Visual Pane', note: 'Immersive visual storytelling, illustration, or proof quote' },
      { label: 'Interactive Pane', note: 'Clean form inputs, task controls, and primary action buttons' },
      { label: 'Central Divider', note: 'Clean color boundary or hairline border splitting the screen' },
      { label: 'Mobile Collapse', note: 'Responsive breakdown collapsing into a focused single pane' },
    ],
    aiPrompt: {
      basic: 'Make a 50/50 split screen login page.',
      detailed:
        'Build a split-screen login page: left pane desktop-only with dark branding, product illustration, and testimonial; right pane white background with centered login inputs and social auth buttons.',
      implementation:
        'Outer container min-h-screen grid grid-cols-1 lg:grid-cols-2. Left pane styled with hidden lg:flex flex-col justify-between p-12 bg-ink text-surface. Right pane flex items-center justify-center p-6 sm:p-12 with max-w-md w-full form.',
    },
    badPrompt: 'Put image on left and form on right.',
    betterPrompt:
      'Build a responsive split-screen auth template: min-h-screen lg:grid-cols-2, left decorative billboard (desktop only, deep palette + quote), right focused form (centered max-w-md), collapsing gracefully on mobile.',
    aliases: ['split screen', '50/50 layout', 'dual pane', 'split layout', 'two-column screen'],
    tags: ['split-screen', 'auth', 'login', 'dual-pane', 'responsive-collapse'],
  },
  'sidebar-layout': {
    oneLine: 'Classic application shell pairing a persistent navigation rail with an independently scrolling canvas.',
    description:
      'The Sidebar App Shell is the cornerstone of SaaS, productivity software, and administrative dashboards. Unlike marketing websites, it locks the viewport to full screen height (h-screen overflow-hidden), pinning global navigation to the left while granting the main workspace its own dedicated vertical scroll track.',
    looksLike:
      'Notion or Linear desktop views: a dark gray hierarchy tree and workspace menu on the left that remains rock-solid while you scroll through long project boards and documents on the right.',
    fitsFor: 'SaaS dashboards · Admin panels · Productivity tools · Knowledge bases',
    whenToUse: [
      { situation: 'SaaS dashboards, enterprise applications, and multi-tenant admin consoles', recommended: true },
      { situation: 'Complex platforms demanding persistent navigation context and fast switching', recommended: true },
      { situation: 'Developer documentation portals and structured knowledge bases', recommended: true },
      { situation: 'Single-page promotional landing pages or lightweight marketing sites', recommended: false },
      { situation: 'Immersive long-form reading where side rails create visual noise', recommended: false },
    ],
    whenNotToUse: [
      'Allowing sidebar and main content to scroll together, forcing users to scroll back up to navigate.',
      'Cramming desktop sidebars onto mobile without converting them into slide-over sheets.',
    ],
    anatomy: [
      { label: 'Fixed Sidebar', note: 'Houses workspace switchers, hierarchy trees, and global navigation' },
      { label: 'Collapsible Rail', note: 'Slim icon-only rail preserving screen estate when collapsed' },
      { label: 'App Header / Breadcrumb', note: 'Path indicators, search trigger, and contextual utilities' },
      { label: 'Independent Canvas', note: 'Dedicated scroll container (overflow-y-auto) for work surfaces' },
    ],
    aiPrompt: {
      basic: 'Create an admin dashboard shell with left sidebar.',
      detailed:
        'Build a SaaS App Shell: locked full viewport height, 260px fixed sidebar on the left, top header with breadcrumb navigation on the right, and an independent scrollable canvas container.',
      implementation:
        'Container styled with h-screen flex overflow-hidden bg-canvas. Left sidebar w-64 flex-shrink-0 flex flex-col border-r border-line bg-surface. Right container flex-1 flex flex-col min-w-0. Right header h-14 border-b border-line. Main workspace flex-1 overflow-y-auto p-6.',
    },
    badPrompt: 'Put a menu on the left side of the page.',
    betterPrompt:
      'Create a SaaS application shell: h-screen flex overflow-hidden, left fixed 260px navigation rail, right flex-1 with breadcrumb header and overflow-y-auto canvas, collapsing into a mobile drawer.',
    aliases: ['sidebar layout', 'app shell', 'dashboard layout', 'navigation rail', 'sidebar canvas'],
    tags: ['app-shell', 'sidebar', 'dashboard', 'scroll-isolation', 'linear-style'],
  },
  'sticky-bar': {
    oneLine: 'Floats along with document flow until reaching viewport boundaries where it pins persistently.',
    description:
      'Sticky Bars rely on CSS position: sticky to preserve natural document flow while ensuring high-intent navigation or CTAs remain pinned once scrolled past. Unlike position: fixed, sticky elements naturally push preceding siblings without jarring content overlaps, seamlessly docking frosted headers or mobile checkout triggers.',
    looksLike:
      'A frosted glass top navigation bar that snaps to the top edge as you scroll down a lengthy landing page, or a sticky checkout action anchored securely to the bottom of a mobile commerce page.',
    fitsFor: 'Sticky global headers · Mobile commerce checkout bars · Form confirmation strips',
    whenToUse: [
      { situation: 'Global navigation headers on long-scroll marketing pages', recommended: true },
      { situation: 'Persistent mobile checkout bars and add-to-cart actions on product pages', recommended: true },
      { situation: 'Bottom action confirmation bars on lengthy configuration forms', recommended: true },
      { situation: 'Short single-fold landing pages where pinning adds no functional value', recommended: false },
      { situation: 'Containers where ancestor elements have overflow-hidden (breaks sticky behavior)', recommended: false },
    ],
    whenNotToUse: [
      'Placing sticky elements inside parent containers configured with overflow: hidden.',
      'Designing excessively tall sticky bars that consume excessive mobile viewport height.',
    ],
    anatomy: [
      { label: 'Sticky Anchor', note: 'Position sticky with top-0 or bottom-0 pinning to viewport edge' },
      { label: 'Backdrop Blur', note: 'Translucent surface with blur filter keeping background readable' },
      { label: 'Scroll Shadow', note: 'Subtle elevation shadow appearing dynamically on scroll' },
      { label: 'Action Elements', note: 'Brand logo, quick navigational anchors, or high-intent CTAs' },
    ],
    aiPrompt: {
      basic: 'Make the navbar stick to the top when scrolling down.',
      detailed:
        'Create a sticky frosted glass navigation bar: pinned at top (sticky top-0), 80% white translucent background with 12px backdrop blur, subtle border bottom, elevated with micro shadow on scroll.',
      implementation:
        'Header applied with class="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/80 border-b border-line transition-shadow". Verify ancestors avoid overflow-hidden. Pair with IntersectionObserver to toggle shadow-sm on scroll.',
    },
    badPrompt: 'Keep the menu floating at the top.',
    betterPrompt:
      'Implement a sticky frosted header: sticky top-0 z-40 w-full backdrop-blur-md bg-surface/85 border-b border-line/60, ensure parent overflow is visible, and cast subtle elevation upon scroll.',
    aliases: ['sticky bar', 'sticky header', 'pinned bar', 'sticky cta', 'floating navigation'],
    tags: ['sticky', 'pinned', 'backdrop-blur', 'header', 'scroll-pin'],
  },
  'full-bleed': {
    oneLine: 'Breaks container constraints to stretch edge-to-edge, injecting contrast and spatial pacing.',
    description:
      'Full-Bleed sections introduce dramatic rhythmic shifts into otherwise constrained layouts. Maintaining the same narrow container throughout an entire page can breed visual fatigue. Injecting a dark edge-to-edge partner marquee, full-bleed stat strip, or video billboard provides an exhilarating sense of expanse and visual punctuation.',
    looksLike:
      'A page moving along inside clean centered columns suddenly bursts into a full-width dark section stretching from screen edge to screen edge, showcasing customer logos in bold contrast.',
    fitsFor: 'Key performance metrics · Infinite partner marquees · Final CTA billboards · Video showcases',
    whenToUse: [
      { situation: 'Partner logo clouds or horizontal infinite-scroll marquees', recommended: true },
      { situation: 'Key impact metrics strips (e.g. Over 100k developers shipped)', recommended: true },
      { situation: 'Bottom final-conversion callout sections with inverted themes', recommended: true },
      { situation: 'Text-heavy editorial paragraphs where full widths damage reading rhythm', recommended: false },
      { situation: 'Dense mobile app interfaces where edge-to-edge strips offer no contrast', recommended: false },
    ],
    whenNotToUse: [
      'Forgetting to nest an inner container, leaving text stretched across 4K displays.',
      'Using 100vw calculations that fail to account for browser scrollbars, causing horizontal overflow.',
    ],
    anatomy: [
      { label: 'Edge-to-Edge Band', note: 'Outer wrapper breaking container limits to touch viewport edges' },
      { label: 'Contrast Background', note: 'High-contrast palette shift injecting dramatic visual rhythm' },
      { label: 'Inner Container', note: 'Nested max-w-7xl container safeguarding internal content bounds' },
      { label: 'Visual Rhythm', note: 'Breaks monochromatic pacing and re-engages scanning readers' },
    ],
    aiPrompt: {
      basic: 'Insert a full width dark section in the middle of the page.',
      detailed:
        'Create a full-bleed dark statistics banner: outer section stretches edge-to-edge (w-full bg-ink), inner container centered with max-w-7xl housing 4 metric highlights, 80px vertical padding.',
      implementation:
        'Adopt outer-bleed, inner-container architecture: <section className="w-full bg-ink text-surface py-20"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">...</div></section>. Avoid negative margins on containers.',
    },
    badPrompt: 'Make this part stretch across the whole screen.',
    betterPrompt:
      'Build a full-bleed metric strip: outer section w-full bg-ink py-20 text-surface, inner max-w-7xl mx-auto px-6 containing 4 metric stats, breaking the monotone layout rhythm.',
    aliases: ['full-bleed', 'edge-to-edge section', 'breakout section', 'full-width banner', 'bleed section'],
    tags: ['full-bleed', 'edge-to-edge', 'spatial-rhythm', 'banner', 'breakout'],
  },
};
