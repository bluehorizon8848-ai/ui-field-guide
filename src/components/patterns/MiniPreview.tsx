import type { ReactElement } from 'react';

/**
 * 卡片内的商业级 Micro-UI 微缩示意图（纯 SVG 矢量，无外部运行时依赖）。
 *
 * 设计规范（Micro-UI Design System v2）：
 * 1. 宽广舞台视窗（Expanded Showcase Stage）：从原本内缩留白外扩至 8,6,224,120，
 *    搭配内部 1.15 倍等比居中放大，使有效组件画幅提升超 32%（配合外层 148px 高度，整体饱满度提升约 50%）。
 * 2. 鲜活高辨识度色彩（High-Contrast & Semantic Accents）：
 *    告别单调灰暗！核心中性色升级为曜石深黑（#0F172A）与高对比度文字灰（#64748B），
 *    全方位注入科技亮蓝（#2563EB）、翡翠翠绿（#059669）、警示鲜红（#DC2626）、琥珀金黄（#D97706）、优雅高阶紫（#7C3AED）等鲜明功能色。
 * 3. 严格覆盖全站 75 个 Pattern ID。
 */

export function MiniPreview({ id, mode = 'card' }: { id: string; mode?: 'card' | 'share' }) {
  const draw = PREVIEWS[id];
  if (!draw) {
    return (
      <div className="flex h-full items-center justify-center bg-[#FAF9F6]">
        <span className="text-2xs font-mono text-[#8C887E]">UI</span>
      </div>
    );
  }

  const isShare = mode === 'share';
  const viewBox = isShare ? '0 0 240 176' : '0 0 240 132';
  const winH = isShare ? 164 : 120;
  const targetCenterY = isShare ? 96 : 71;
  const targetScale = isShare ? 1.28 : 1.15;

  return (
    <svg
      viewBox={viewBox}
      className="h-full w-full"
      role="img"
      aria-label={`${id} 示意图`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="mini-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.06" />
        </filter>
        <clipPath id="mini-win-clip">
          <rect x="8" y="6" width="224" height={winH} rx="8" />
        </clipPath>
      </defs>
      {/* 统一外舞台底框：释放可用画幅 */}
      <rect x="8" y="6" width="224" height={winH} rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" filter="url(#mini-shadow)" />
      {/* 视窗顶部精致微圆点 */}
      <circle cx="20" cy="15" r="2.2" fill="#CBD5E1" />
      <circle cx="27" cy="15" r="2.2" fill="#E2E8F0" />
      <circle cx="34" cy="15" r="2.2" fill="#E2E8F0" />
      <line x1="8" y1="22" x2="232" y2="22" stroke="#F1F5F9" strokeWidth="1" />
      {/* 组件主体呈现：居中等比放大，饱满充满视窗 */}
      <g clipPath="url(#mini-win-clip)">
        <g transform={`translate(120, ${targetCenterY}) scale(${targetScale}) translate(-120, -71)`}>
          {draw}
        </g>
      </g>
    </svg>
  );
}

const INK = '#0F172A';         // 曜石深黑
const INK2 = '#334155';        // 次级文字深灰
const MUTED = '#64748B';       // 高可读中度灰（符合 WCAG AA）
const LINE = '#CBD5E1';        // 明晰浅灰描边
const SOFT = '#F8FAFC';        // 纯净浅灰背景底色
const WHITE = '#FFFFFF';
const GREEN = '#059669';       // 翡翠翠绿
const GREEN_BG = '#ECFDF5';
const BLUE = '#2563EB';        // 科技亮蓝
const BLUE_BG = '#EFF6FF';
const RED = '#DC2626';         // 警示鲜红
const RED_BG = '#FEF2F2';
const AMBER = '#D97706';       // 琥珀金黄
const AMBER_BG = '#FFFBEB';
const PURPLE = '#7C3AED';      // 优雅高阶紫
const PURPLE_BG = '#F5F3FF';
const ORANGE = '#EA580C';      // 活力暖橙
const ORANGE_BG = '#FFF7ED';

const PREVIEWS: Record<string, ReactElement> = {
  /* ==========================================================================
     1. Navigation (8 个)
     ========================================================================== */
  breadcrumb: (
    <g>
      <rect x="26" y="38" width="188" height="40" rx="6" fill={WHITE} stroke={LINE} />
      {/* Home 图标与蓝色链接 */}
      <path d="M38 58 L44 53 L50 58 V64 H38 Z" fill={BLUE_BG} stroke={BLUE} strokeWidth="1.4" />
      <text x="54" y="61" fontSize="8.5" fontWeight="600" fill={BLUE} fontFamily="sans-serif">Home</text>
      <text x="80" y="61" fontSize="9" fontWeight="bold" fill={MUTED} fontFamily="sans-serif">›</text>
      <text x="90" y="61" fontSize="8.5" fontWeight="500" fill={INK2} fontFamily="sans-serif">Projects</text>
      <text x="128" y="61" fontSize="9" fontWeight="bold" fill={MUTED} fontFamily="sans-serif">›</text>
      {/* 当前激活项：鲜亮蓝底白字高亮胶囊 */}
      <rect x="138" y="48" width="68" height="20" rx="4" fill={BLUE_BG} stroke={BLUE} strokeWidth="1.2" />
      <circle cx="146" cy="58" r="2.5" fill={BLUE} />
      <text x="153" y="61" fontSize="8.5" fontWeight="700" fill={BLUE} fontFamily="sans-serif">UI Guide</text>
      {/* 下方微内容示意，让层次一目了然 */}
      <rect x="26" y="86" width="188" height="22" rx="4" fill={SOFT} stroke={LINE} />
      <rect x="36" y="94" width="70" height="6" rx="2" fill={LINE} />
    </g>
  ),

  tabs: (
    <g>
      {/* 顶部 Tab 栏：激活项采用科技亮蓝高饱和填充 */}
      <rect x="26" y="36" width="66" height="24" rx="5" fill={BLUE} />
      <text x="59" y="51" fontSize="8.5" fontWeight="700" fill={WHITE} textAnchor="middle">Overview</text>
      <rect x="96" y="36" width="56" height="24" rx="5" fill={WHITE} stroke={LINE} />
      <text x="124" y="51" fontSize="8" fontWeight="500" fill={INK2} textAnchor="middle">Activity</text>
      <rect x="156" y="36" width="56" height="24" rx="5" fill={WHITE} stroke={LINE} />
      <text x="184" y="51" fontSize="8" fontWeight="500" fill={MUTED} textAnchor="middle">Settings</text>
      {/* 选中内容面板：鲜活微组件 */}
      <rect x="26" y="66" width="188" height="44" rx="6" fill={WHITE} stroke={LINE} />
      <circle cx="44" cy="82" r="9" fill={GREEN_BG} stroke={GREEN} strokeWidth="1" />
      <path d="M40 82 l3 3 l5 -5" stroke={GREEN} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="62" y="76" width="80" height="8" rx="2" fill={INK} />
      <rect x="62" y="89" width="132" height="6" rx="2" fill={LINE} />
    </g>
  ),

  'bottom-navigation': (
    <g>
      {/* 手机外壳 */}
      <rect x="32" y="28" width="176" height="88" rx="8" fill={WHITE} stroke={INK} strokeWidth="1.2" />
      {/* 顶部模拟 App 内容区（带亮蓝卡片） */}
      <rect x="40" y="36" width="160" height="34" rx="5" fill={BLUE_BG} />
      <rect x="48" y="44" width="70" height="7" rx="2" fill={BLUE} />
      <rect x="48" y="55" width="120" height="5" rx="1.5" fill={BLUE} opacity="0.4" />
      {/* 底部导航条 */}
      <rect x="32" y="76" width="176" height="40" rx="0" fill={WHITE} />
      <line x1="32" y1="76" x2="208" y2="76" stroke={LINE} strokeWidth="1" />
      {/* Tab 1 (激活) */}
      <rect x="42" y="80" width="32" height="24" rx="6" fill={BLUE_BG} />
      <circle cx="58" cy="89" r="4.5" fill={BLUE} />
      <text x="58" y="100" fontSize="6.5" fontWeight="700" fill={BLUE} textAnchor="middle">Home</text>
      {/* Tab 2, 3, 4 */}
      <circle cx="102" cy="89" r="4" fill={LINE} />
      <text x="102" y="100" fontSize="6.5" fill={MUTED} textAnchor="middle">Feed</text>
      <circle cx="146" cy="89" r="4" fill={LINE} />
      <text x="146" y="100" fontSize="6.5" fill={MUTED} textAnchor="middle">Alerts</text>
      <circle cx="190" cy="89" r="4" fill={LINE} />
      <text x="190" y="100" fontSize="6.5" fill={MUTED} textAnchor="middle">User</text>
    </g>
  ),

  'navigation-rail': (
    <g>
      {/* 左侧垂直导航轨 */}
      <rect x="24" y="28" width="40" height="88" rx="6" fill={INK} />
      {/* 激活项：亮蓝胶囊 */}
      <rect x="30" y="36" width="28" height="24" rx="5" fill={BLUE} />
      <circle cx="44" cy="48" r="4.5" fill={WHITE} />
      {/* 未激活项 */}
      <circle cx="44" cy="72" r="4" fill={WHITE} opacity="0.35" />
      <circle cx="44" cy="96" r="4" fill={WHITE} opacity="0.25" />
      {/* 右侧主视区 */}
      <rect x="70" y="28" width="144" height="88" rx="6" fill={SOFT} stroke={LINE} />
      <rect x="80" y="38" width="70" height="8" rx="2" fill={INK} />
      <rect x="80" y="54" width="124" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <circle cx="92" cy="66" r="5" fill={GREEN} />
      <rect x="104" y="63" width="60" height="6" rx="2" fill={INK2} />
      <rect x="80" y="84" width="124" height="22" rx="4" fill={WHITE} stroke={LINE} />
    </g>
  ),

  sidebar: (
    <g>
      {/* 侧边栏 */}
      <rect x="24" y="28" width="62" height="88" rx="6" fill={SOFT} stroke={LINE} />
      <rect x="32" y="36" width="36" height="7" rx="2" fill={INK} />
      {/* 激活菜单项 */}
      <rect x="30" y="50" width="50" height="22" rx="4" fill={BLUE_BG} stroke={BLUE} strokeWidth="1" />
      <circle cx="38" cy="61" r="3" fill={BLUE} />
      <rect x="44" y="58" width="30" height="6" rx="2" fill={BLUE} />
      {/* 普通菜单项 */}
      <rect x="34" y="78" width="42" height="5" rx="1.5" fill={MUTED} />
      <rect x="34" y="92" width="36" height="5" rx="1.5" fill={MUTED} />
      {/* 右侧主内容 */}
      <rect x="92" y="28" width="122" height="88" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="104" y="40" width="60" height="8" rx="2" fill={INK} />
      <rect x="104" y="56" width="98" height="50" rx="4" fill={SOFT} stroke={LINE} />
    </g>
  ),

  pagination: (
    <g>
      <rect x="26" y="36" width="188" height="24" rx="4" fill={SOFT} stroke={LINE} />
      <rect x="36" y="45" width="80" height="6" rx="2" fill={LINE} />
      {/* 分页控制胶囊群 */}
      {[
        { t: '‹', a: false, c: INK2 },
        { t: '1', a: false, c: INK2 },
        { t: '2', a: true, c: WHITE },
        { t: '3', a: false, c: INK2 },
        { t: '4', a: false, c: INK2 },
        { t: '›', a: false, c: INK2 },
      ].map((p, i) => {
        const x = 38 + i * 28;
        return (
          <g key={i}>
            <rect
              x={x}
              y="72"
              width="24"
              height="24"
              rx="5"
              fill={p.a ? BLUE : WHITE}
              stroke={p.a ? BLUE : LINE}
              strokeWidth={p.a ? '1.5' : '1'}
            />
            <text
              x={x + 12}
              y="87"
              fontSize="10"
              fontWeight={p.a ? '700' : '500'}
              fill={p.c}
              textAnchor="middle"
            >
              {p.t}
            </text>
          </g>
        );
      })}
    </g>
  ),

  stepper: (
    <g>
      {/* 步骤条连接线 */}
      <line x1="50" y1="56" x2="190" y2="56" stroke={LINE} strokeWidth="2.5" />
      <line x1="50" y1="56" x2="120" y2="56" stroke={GREEN} strokeWidth="2.5" />
      {/* 节点 1 (完成) */}
      <circle cx="50" cy="56" r="12" fill={GREEN} />
      <path d="M45 56 l3.5 3.5 l6.5 -7" stroke={WHITE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="50" y="80" fontSize="8" fontWeight="700" fill={INK} textAnchor="middle">Account</text>
      {/* 节点 2 (进行中) */}
      <circle cx="120" cy="56" r="12" fill={WHITE} stroke={BLUE} strokeWidth="2.5" />
      <circle cx="120" cy="56" r="4.5" fill={BLUE} />
      <text x="120" y="80" fontSize="8" fontWeight="700" fill={BLUE} textAnchor="middle">Profile</text>
      {/* 节点 3 (未开始) */}
      <circle cx="190" cy="56" r="12" fill={WHITE} stroke={LINE} strokeWidth="2" />
      <text x="190" y="60" fontSize="8.5" fontWeight="600" fill={MUTED} textAnchor="middle">3</text>
      <text x="190" y="80" fontSize="8" fill={MUTED} textAnchor="middle">Confirm</text>
    </g>
  ),

  'back-button': (
    <g>
      <rect x="26" y="32" width="188" height="82" rx="6" fill={WHITE} stroke={LINE} />
      {/* 顶部返回导航栏 */}
      <rect x="26" y="32" width="188" height="30" rx="0" fill={SOFT} />
      <line x1="26" y1="62" x2="214" y2="62" stroke={LINE} strokeWidth="1" />
      {/* 返回胶囊 */}
      <rect x="34" y="38" width="52" height="18" rx="4" fill={WHITE} stroke={BLUE} strokeWidth="1.2" />
      <path d="M42 47 l-3 -3 l3 -3" stroke={BLUE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="48" y="50" fontSize="8" fontWeight="700" fill={BLUE}>Back</text>
      <text x="136" y="50" fontSize="8.5" fontWeight="700" fill={INK} textAnchor="middle">Order #9824</text>
      {/* 内容区 */}
      <rect x="38" y="74" width="90" height="8" rx="2" fill={INK} />
      <rect x="38" y="88" width="150" height="14" rx="3" fill={BLUE_BG} stroke={LINE} />
    </g>
  ),

  /* ==========================================================================
     2. Actions (6 个)
     ========================================================================== */
  button: (
    <g>
      {/* Primary Button */}
      <rect x="32" y="40" width="82" height="30" rx="6" fill={BLUE} />
      <text x="73" y="58" fontSize="9" fontWeight="700" fill={WHITE} textAnchor="middle">Save Changes</text>
      {/* Secondary Button */}
      <rect x="126" y="40" width="82" height="30" rx="6" fill={WHITE} stroke={LINE} strokeWidth="1.2" />
      <text x="167" y="58" fontSize="9" fontWeight="600" fill={INK2} textAnchor="middle">Cancel</text>
      {/* Ghost / Small Button */}
      <rect x="76" y="82" width="88" height="26" rx="13" fill={BLUE_BG} stroke={BLUE} strokeWidth="1" />
      <text x="120" y="98" fontSize="8.5" fontWeight="700" fill={BLUE} textAnchor="middle">+ New Project</text>
    </g>
  ),

  cta: (
    <g>
      <rect x="26" y="32" width="188" height="82" rx="6" fill={SOFT} stroke={LINE} />
      <text x="120" y="52" fontSize="10.5" fontWeight="700" fill={INK} textAnchor="middle">Ready to Ship Faster?</text>
      <text x="120" y="66" fontSize="8" fill={MUTED} textAnchor="middle">Join 10,000+ indie makers today.</text>
      {/* 醒目 CTA 胶囊 */}
      <rect x="62" y="76" width="116" height="28" rx="14" fill={GREEN} />
      <text x="120" y="93" fontSize="9" fontWeight="700" fill={WHITE} textAnchor="middle">Get Started Free →</text>
    </g>
  ),

  'icon-button': (
    <g>
      <rect x="26" y="40" width="188" height="48" rx="6" fill={SOFT} stroke={LINE} />
      {[
        { color: INK, bg: SOFT, stroke: INK },
        { color: BLUE, bg: BLUE_BG, stroke: BLUE },
        { color: GREEN, bg: GREEN_BG, stroke: GREEN },
        { color: RED, bg: RED_BG, stroke: RED },
      ].map((item, i) => {
        const x = 38 + i * 44;
        return (
          <g key={i}>
            <rect x={x} y="48" width="32" height="32" rx="6" fill={item.bg} stroke={item.stroke} strokeWidth="1.2" />
            <circle cx={x + 16} cy="64" r="7" fill={item.color} fillOpacity="0.15" />
            <circle cx={x + 16} cy="64" r="3.5" fill={item.color} />
          </g>
        );
      })}
    </g>
  ),

  fab: (
    <g>
      <rect x="26" y="30" width="188" height="84" rx="6" fill={SOFT} stroke={LINE} />
      <rect x="40" y="44" width="90" height="8" rx="2" fill={LINE} />
      <rect x="40" y="58" width="110" height="6" rx="2" fill={LINE} />
      <rect x="40" y="70" width="80" height="6" rx="2" fill={LINE} />
      {/* 悬浮 FAB 按钮 */}
      <circle cx="178" cy="82" r="20" fill={BLUE} filter="url(#mini-shadow)" />
      <path d="M178 72 v20 M168 82 h20" stroke={WHITE} strokeWidth="2.8" strokeLinecap="round" />
    </g>
  ),

  'split-button': (
    <g>
      <rect x="38" y="48" width="126" height="32" rx="6" fill={INK} />
      <text x="92" y="68" fontSize="9.5" fontWeight="700" fill={WHITE} textAnchor="middle">Deploy Site</text>
      <line x1="134" y1="48" x2="134" y2="80" stroke={WHITE} strokeOpacity="0.3" strokeWidth="1" />
      <path d="M145 62 l4 4 l4 -4" stroke={WHITE} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* 下拉展开提示 */}
      <rect x="126" y="86" width="76" height="22" rx="4" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="164" y="100" fontSize="8" fontWeight="600" fill={BLUE} textAnchor="middle">Preview Only</text>
    </g>
  ),

  'destructive-action': (
    <g>
      <rect x="26" y="32" width="188" height="82" rx="6" fill={RED_BG} stroke={RED} strokeWidth="1.2" />
      <circle cx="48" cy="52" r="9" fill={RED} />
      <text x="48" y="56" fontSize="10" fontWeight="800" fill={WHITE} textAnchor="middle">!</text>
      <text x="64" y="53" fontSize="9.5" fontWeight="700" fill={RED}>Delete Workspace?</text>
      <text x="64" y="66" fontSize="8" fill="#7F1D1D">This action cannot be undone.</text>
      {/* 危险操作按钮 */}
      <rect x="120" y="76" width="84" height="26" rx="5" fill={RED} />
      <text x="162" y="93" fontSize="8.5" fontWeight="700" fill={WHITE} textAnchor="middle">Delete Now</text>
    </g>
  ),

  /* ==========================================================================
     3. Containers & Overlays (8 个)
     ========================================================================== */
  card: (
    <g>
      <rect x="32" y="30" width="82" height="84" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="38" y="36" width="70" height="36" rx="4" fill={BLUE_BG} stroke={BLUE} strokeWidth="0.8" />
      <rect x="38" y="78" width="54" height="7" rx="2" fill={INK} />
      <rect x="38" y="88" width="44" height="5" rx="1.5" fill={MUTED} />
      <rect x="38" y="98" width="28" height="9" rx="3" fill={GREEN_BG} />
      <text x="52" y="105" fontSize="6.5" fontWeight="700" fill={GREEN} textAnchor="middle">NEW</text>

      <rect x="126" y="30" width="82" height="84" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="132" y="36" width="70" height="36" rx="4" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="0.8" />
      <rect x="132" y="78" width="50" height="7" rx="2" fill={INK} />
      <rect x="132" y="88" width="58" height="5" rx="1.5" fill={MUTED} />
      <rect x="132" y="98" width="28" height="9" rx="3" fill={SOFT} />
    </g>
  ),

  accordion: (
    <g>
      {/* Item 1 (展开) */}
      <rect x="26" y="30" width="188" height="52" rx="6" fill={SOFT} stroke={LINE} />
      <circle cx="40" cy="44" r="3.5" fill={BLUE} />
      <text x="50" y="47" fontSize="8.5" fontWeight="700" fill={INK}>How does billing work?</text>
      <path d="M198 46 l-4 -4 l-4 4" stroke={BLUE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="44" y="56" width="154" height="18" rx="3" fill={WHITE} stroke={LINE} />
      <text x="52" y="68" fontSize="7.5" fill={MUTED}>You can cancel your subscription at anytime.</text>

      {/* Item 2 (折叠) */}
      <rect x="26" y="88" width="188" height="26" rx="6" fill={WHITE} stroke={LINE} />
      <circle cx="40" cy="101" r="3.5" fill={LINE} />
      <text x="50" y="104" fontSize="8.5" fontWeight="600" fill={INK2}>Can I invite my team?</text>
      <path d="M198 99 l-4 4 l-4 -4" stroke={MUTED} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),

  collapsible: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      <rect x="34" y="40" width="172" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <path d="M46 52 l4 4 l-4 4" stroke={BLUE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="58" y="55" fontSize="8.5" fontWeight="700" fill={INK}>Advanced Configuration</text>
      {/* 展开的选项内容 */}
      <rect x="46" y="72" width="150" height="8" rx="2" fill={LINE} />
      <rect x="46" y="85" width="120" height="8" rx="2" fill={LINE} />
      <rect x="46" y="98" width="80" height="8" rx="2" fill={LINE} />
    </g>
  ),

  modal: (
    <g>
      {/* 半透明遮罩：超界覆盖，由外层 clipPath 精确裁剪 */}
      <rect x="-20" y="-20" width="280" height="220" fill="#0F172A" fillOpacity="0.4" />
      {/* 悬浮弹窗卡片：154x92 优雅挺拔黄金比例，自然留白 */}
      <rect x="43" y="25" width="154" height="92" rx="8" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="56" y="45" fontSize="10" fontWeight="700" fill={INK}>Confirm Publishing</text>
      <path d="M182 37 l6 6 M188 37 l-6 6" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="56" y="53" width="128" height="18" rx="4" fill={SOFT} />
      {/* 操作按钮 */}
      <rect x="96" y="82" width="44" height="23" rx="4" fill={SOFT} stroke={LINE} />
      <text x="118" y="97" fontSize="8.5" fill={INK2} textAnchor="middle">Cancel</text>
      <rect x="146" y="82" width="44" height="23" rx="4" fill={BLUE} />
      <text x="168" y="97" fontSize="8.5" fontWeight="700" fill={WHITE} textAnchor="middle">Publish</text>
    </g>
  ),

  'bottom-sheet': (
    <g>
      <rect x="26" y="30" width="188" height="42" rx="5" fill={SOFT} stroke={LINE} />
      {/* 从底部滑起的 Sheet */}
      <rect x="32" y="54" width="176" height="62" rx="10" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      {/* 顶部 Drag Handle */}
      <rect x="106" y="60" width="28" height="3.5" rx="1.75" fill={MUTED} />
      <text x="46" y="78" fontSize="9" fontWeight="700" fill={INK}>Select Export Format</text>
      <rect x="46" y="86" width="148" height="12" rx="3" fill={BLUE_BG} stroke={BLUE} strokeWidth="0.8" />
      <text x="54" y="95" fontSize="7.5" fontWeight="600" fill={BLUE}>PDF Document (.pdf)</text>
      <rect x="46" y="102" width="110" height="10" rx="3" fill={SOFT} />
    </g>
  ),

  drawer: (
    <g>
      <rect x="26" y="28" width="188" height="88" rx="6" fill={SOFT} stroke={LINE} />
      {/* 右侧滑出抽屉 */}
      <rect x="108" y="28" width="106" height="88" rx="0" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <rect x="118" y="40" width="56" height="8" rx="2" fill={INK} />
      <path d="M198 38 l6 6 M204 38 l-6 6" stroke={MUTED} strokeWidth="1.6" />
      <rect x="118" y="56" width="86" height="18" rx="3" fill={SOFT} />
      <rect x="118" y="80" width="86" height="24" rx="4" fill={BLUE_BG} stroke={BLUE} strokeWidth="1" />
      <text x="161" y="95" fontSize="8" fontWeight="700" fill={BLUE} textAnchor="middle">Save Filter</text>
    </g>
  ),

  popover: (
    <g>
      <rect x="38" y="36" width="68" height="26" rx="5" fill={WHITE} stroke={BLUE} strokeWidth="1.2" />
      <text x="72" y="52" fontSize="8.5" fontWeight="600" fill={BLUE} textAnchor="middle">Filter By ▾</text>
      {/* 浮动气泡 */}
      <rect x="38" y="68" width="118" height="46" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <path d="M68 68 l4 -5 l4 5 z" fill={WHITE} stroke={LINE} />
      <text x="50" y="82" fontSize="8" fontWeight="700" fill={BLUE}>Recent Updates ✓</text>
      <text x="50" y="95" fontSize="8" fill={INK2}>Most Popular</text>
      <text x="50" y="106" fontSize="8" fill={MUTED}>Alphabetical</text>
    </g>
  ),

  tooltip: (
    <g>
      <rect x="26" y="32" width="188" height="82" rx="6" fill={SOFT} stroke={LINE} />
      <circle cx="80" cy="74" r="15" fill={WHITE} stroke={BLUE} strokeWidth="1.5" />
      <path d="M75 74 h10 M80 69 v10" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
      {/* Tooltip 气泡 */}
      <rect x="96" y="58" width="90" height="26" rx="5" fill={INK} filter="url(#mini-shadow)" />
      <path d="M96 71 l-5 -4 l5 -4 z" fill={INK} />
      <text x="141" y="74" fontSize="8" fontWeight="600" fill={WHITE} textAnchor="middle">Create new item (⌘N)</text>
    </g>
  ),

  /* ==========================================================================
     4. Data Display (7 个)
     ========================================================================== */
  list: (
    <g>
      {[
        { t: 'Project Alpha', s: 'Active', c: GREEN, bg: GREEN_BG },
        { t: 'Design System', s: 'Review', c: BLUE, bg: BLUE_BG },
        { t: 'Mobile Redesign', s: 'Paused', c: AMBER, bg: AMBER_BG },
      ].map((item, i) => {
        const y = 34 + i * 28;
        return (
          <g key={i}>
            <rect x="26" y={y} width="188" height="24" rx="5" fill={WHITE} stroke={LINE} />
            <circle cx="38" cy={y + 12} r="4.5" fill={item.c} />
            <text x="50" y={y + 15} fontSize="8.5" fontWeight="600" fill={INK}>{item.t}</text>
            <rect x="166" y={y + 5} width="40" height="14" rx="4" fill={item.bg} stroke={item.c} strokeWidth="0.8" />
            <text x="186" y={y + 15} fontSize="7" fontWeight="700" fill={item.c} textAnchor="middle">{item.s}</text>
          </g>
        );
      })}
    </g>
  ),

  table: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={WHITE} stroke={LINE} />
      {/* 表头 */}
      <rect x="26" y="32" width="188" height="20" rx="0" fill={BLUE_BG} />
      <text x="36" y="45" fontSize="8" fontWeight="700" fill={BLUE}>USER</text>
      <text x="96" y="45" fontSize="8" fontWeight="700" fill={BLUE}>STATUS</text>
      <text x="164" y="45" fontSize="8" fontWeight="700" fill={BLUE}>ROLE</text>
      {/* 行 1 */}
      <circle cx="42" cy="64" r="5.5" fill={BLUE} />
      <text x="54" y="67" fontSize="8" fontWeight="600" fill={INK}>Alice.dev</text>
      <rect x="94" y="57" width="38" height="14" rx="7" fill={GREEN_BG} stroke={GREEN} strokeWidth="0.8" />
      <text x="113" y="67" fontSize="7" fontWeight="700" fill={GREEN} textAnchor="middle">Online</text>
      <text x="164" y="67" fontSize="8" fontWeight="500" fill={INK2}>Admin</text>
      <line x1="26" y1="76" x2="214" y2="76" stroke={LINE} />
      {/* 行 2 */}
      <circle cx="42" cy="92" r="5.5" fill={AMBER} />
      <text x="54" y="95" fontSize="8" fontWeight="600" fill={INK}>Bob.tech</text>
      <rect x="94" y="85" width="38" height="14" rx="7" fill={SOFT} stroke={LINE} />
      <text x="113" y="95" fontSize="7" fill={MUTED} textAnchor="middle">Offline</text>
      <text x="164" y="95" fontSize="8" fontWeight="500" fill={INK2}>Editor</text>
    </g>
  ),

  badge: (
    <g>
      <rect x="34" y="40" width="50" height="42" rx="6" fill={SOFT} stroke={LINE} />
      <circle cx="59" cy="61" r="10" fill={WHITE} stroke={LINE} />
      <circle cx="68" cy="51" r="4.5" fill={RED} />
      <text x="59" y="94" fontSize="8" fontWeight="600" fill={MUTED} textAnchor="middle">Dot</text>

      <rect x="96" y="40" width="50" height="42" rx="6" fill={SOFT} stroke={LINE} />
      <circle cx="121" cy="61" r="10" fill={WHITE} stroke={LINE} />
      <rect x="124" y="46" width="16" height="10" rx="5" fill={RED} />
      <text x="132" y="54" fontSize="7" fontWeight="800" fill={WHITE} textAnchor="middle">9+</text>
      <text x="121" y="94" fontSize="8" fontWeight="600" fill={MUTED} textAnchor="middle">Count</text>

      <rect x="158" y="40" width="50" height="42" rx="6" fill={GREEN_BG} stroke={GREEN} strokeWidth="1" />
      <rect x="166" y="54" width="34" height="14" rx="7" fill={GREEN} />
      <text x="183" y="64" fontSize="7" fontWeight="800" fill={WHITE} textAnchor="middle">PRO</text>
      <text x="183" y="94" fontSize="8" fontWeight="700" fill={GREEN} textAnchor="middle">Status</text>
    </g>
  ),

  'chip-display': (
    <g>
      <rect x="26" y="34" width="188" height="76" rx="6" fill={SOFT} stroke={LINE} />
      <text x="38" y="52" fontSize="8.5" fontWeight="700" fill={MUTED}>TECH STACK</text>
      {/* Chip 胶囊阵列 */}
      <rect x="36" y="62" width="52" height="20" rx="10" fill={WHITE} stroke={LINE} />
      <text x="62" y="75" fontSize="8" fontWeight="600" fill={INK} textAnchor="middle">Next.js</text>
      <rect x="94" y="62" width="58" height="20" rx="10" fill={WHITE} stroke={LINE} />
      <text x="123" y="75" fontSize="8" fontWeight="600" fill={INK} textAnchor="middle">TypeScript</text>
      <rect x="158" y="62" width="50" height="20" rx="10" fill={BLUE_BG} stroke={BLUE} strokeWidth="1.2" />
      <text x="183" y="75" fontSize="8" fontWeight="700" fill={BLUE} textAnchor="middle">Tailwind</text>
    </g>
  ),

  'stat-card': (
    <g>
      <rect x="30" y="30" width="86" height="82" rx="6" fill={WHITE} stroke={LINE} />
      <text x="40" y="46" fontSize="8" fontWeight="600" fill={MUTED}>Revenue</text>
      <text x="40" y="66" fontSize="14" fontWeight="800" fill={INK}>$14.2k</text>
      <rect x="40" y="76" width="44" height="14" rx="4" fill={GREEN_BG} stroke={GREEN} strokeWidth="0.8" />
      <text x="62" y="86" fontSize="7.5" fontWeight="700" fill={GREEN} textAnchor="middle">+28.4%</text>

      <rect x="124" y="30" width="86" height="82" rx="6" fill={WHITE} stroke={LINE} />
      <text x="134" y="46" fontSize="8" fontWeight="600" fill={MUTED}>Active Users</text>
      <text x="134" y="66" fontSize="14" fontWeight="800" fill={INK}>3,420</text>
      {/* 迷你折线走势图 */}
      <path d="M134 94 l14 -10 l16 5 l18 -14" fill="none" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),

  avatar: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      {/* 单个头像带在线状态 */}
      <circle cx="56" cy="68" r="17" fill={BLUE_BG} stroke={BLUE} strokeWidth="2" />
      <text x="56" y="73" fontSize="11" fontWeight="700" fill={BLUE} textAnchor="middle">JD</text>
      <circle cx="70" cy="79" r="4.5" fill={GREEN} stroke={WHITE} strokeWidth="1.8" />
      {/* 头像堆叠组 */}
      <circle cx="118" cy="68" r="15" fill="#FCE7F3" stroke={WHITE} strokeWidth="2" />
      <circle cx="138" cy="68" r="15" fill="#FEF3C7" stroke={WHITE} strokeWidth="2" />
      <circle cx="158" cy="68" r="15" fill="#E0E7FF" stroke={WHITE} strokeWidth="2" />
      <circle cx="178" cy="68" r="15" fill={INK} stroke={WHITE} strokeWidth="2" />
      <text x="178" y="72" fontSize="8" fontWeight="700" fill={WHITE} textAnchor="middle">+5</text>
    </g>
  ),

  timeline: (
    <g>
      <line x1="56" y1="36" x2="56" y2="108" stroke={LINE} strokeWidth="2.5" />
      {/* 事件 1 */}
      <circle cx="56" cy="46" r="7" fill={GREEN} />
      <path d="M53.5 46 l2 2 l4 -4" stroke={WHITE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <rect x="72" y="38" width="132" height="20" rx="4" fill={WHITE} stroke={LINE} />
      <text x="78" y="51" fontSize="8" fontWeight="700" fill={INK}>Version 1.0 Released</text>

      {/* 事件 2 */}
      <circle cx="56" cy="74" r="6" fill={BLUE} />
      <rect x="72" y="66" width="132" height="20" rx="4" fill={BLUE_BG} stroke={BLUE} strokeWidth="0.8" />
      <text x="78" y="79" fontSize="8" fontWeight="600" fill={BLUE}>Custom Domain Bound</text>

      {/* 事件 3 */}
      <circle cx="56" cy="100" r="5" fill={MUTED} />
      <text x="78" y="103" fontSize="8" fill={MUTED}>Initial Repo Commit</text>
    </g>
  ),

  /* ==========================================================================
     5. Feedback & States (12 个)
     ========================================================================== */
  toast: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      {/* 悬浮 Toast 胶囊 */}
      <rect x="40" y="52" width="160" height="36" rx="8" fill={INK} filter="url(#mini-shadow)" />
      <circle cx="60" cy="70" r="8" fill={GREEN} />
      <path d="M57 70 l2.5 2.5 l5 -5" stroke={WHITE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <text x="76" y="73" fontSize="9" fontWeight="700" fill={WHITE}>Saved to Cloud</text>
      <text x="184" y="73" fontSize="8" fontWeight="600" fill={MUTED} textAnchor="end">Undo</text>
    </g>
  ),

  snackbar: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      {/* 底部浮动 Snackbar */}
      <rect x="34" y="78" width="172" height="28" rx="5" fill="#1E293B" filter="url(#mini-shadow)" />
      <text x="46" y="95" fontSize="8" fill={WHITE}>File moved to trash</text>
      <text x="194" y="95" fontSize="8" fontWeight="700" fill="#60A5FA" textAnchor="end">UNDO</text>
    </g>
  ),

  alert: (
    <g>
      {/* 成功 Alert */}
      <rect x="26" y="32" width="188" height="34" rx="6" fill={GREEN_BG} stroke={GREEN} strokeWidth="1" />
      <circle cx="44" cy="49" r="7" fill={GREEN} />
      <path d="M41.5 49 l2 2 l4 -4" stroke={WHITE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <text x="58" y="46" fontSize="8.5" fontWeight="700" fill="#065F46">Deployment Successful</text>
      <text x="58" y="57" fontSize="7.5" fill="#047857">Your site is live on Cloudflare.</text>

      {/* 警告 Alert */}
      <rect x="26" y="74" width="188" height="34" rx="6" fill={AMBER_BG} stroke={AMBER} strokeWidth="1" />
      <circle cx="44" cy="91" r="7" fill={AMBER} />
      <text x="44" y="94.5" fontSize="9" fontWeight="800" fill={WHITE} textAnchor="middle">!</text>
      <text x="58" y="88" fontSize="8.5" fontWeight="700" fill="#92400E">Storage Almost Full</text>
      <text x="58" y="99" fontSize="7.5" fill="#B45309">You have used 85% of your quota.</text>
    </g>
  ),

  banner: (
    <g>
      {/* 全屏通栏 Banner */}
      <rect x="8" y="24" width="224" height="28" fill={BLUE} />
      <text x="110" y="42" fontSize="8.5" fontWeight="700" fill={WHITE} textAnchor="middle">2026 Spring Design Tokens Released</text>
      <rect x="184" y="29" width="38" height="18" rx="4" fill={WHITE} />
      <text x="203" y="41" fontSize="7.5" fontWeight="700" fill={BLUE} textAnchor="middle">Read →</text>
      {/* 下方正文示意 */}
      <rect x="26" y="66" width="130" height="8" rx="2" fill={LINE} />
      <rect x="26" y="82" width="188" height="32" rx="4" fill={SOFT} stroke={LINE} />
    </g>
  ),

  'progress-bar': (
    <g>
      <rect x="26" y="34" width="188" height="76" rx="6" fill={SOFT} stroke={LINE} />
      <text x="38" y="55" fontSize="9" fontWeight="700" fill={INK}>Uploading Assets...</text>
      <text x="202" y="55" fontSize="9" fontWeight="800" fill={BLUE} textAnchor="end">72%</text>
      {/* 进度条槽与指示器 */}
      <rect x="38" y="66" width="164" height="9" rx="4.5" fill={LINE} />
      <rect x="38" y="66" width="118" height="9" rx="4.5" fill={BLUE} />
      <text x="38" y="90" fontSize="7.5" fill={MUTED}>3.2 MB of 4.5 MB uploaded</text>
    </g>
  ),

  spinner: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      {/* 旋转 Spinner 轮廓 */}
      <circle cx="120" cy="62" r="16" fill="none" stroke={LINE} strokeWidth="3" />
      <path d="M120 46 A 16 16 0 0 1 136 62" fill="none" stroke={BLUE} strokeWidth="3.5" strokeLinecap="round" />
      <text x="120" y="94" fontSize="8.5" fontWeight="600" fill={INK} textAnchor="middle">Synchronizing data...</text>
    </g>
  ),

  skeleton: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={WHITE} stroke={LINE} />
      {/* 骨架屏占位块 */}
      <circle cx="48" cy="54" r="14" fill={SOFT} stroke={LINE} />
      <rect x="72" y="44" width="86" height="9" rx="3" fill={SOFT} />
      <rect x="72" y="58" width="116" height="7" rx="2" fill={SOFT} />
      <rect x="38" y="80" width="164" height="11" rx="3" fill={SOFT} />
      <rect x="38" y="96" width="124" height="11" rx="3" fill={SOFT} />
    </g>
  ),

  'empty-state': (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      <circle cx="120" cy="52" r="15" fill={WHITE} stroke={LINE} />
      <path d="M114 52 h12 M120 46 v12" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
      <text x="120" y="78" fontSize="9" fontWeight="700" fill={INK} textAnchor="middle">No Collections Yet</text>
      <text x="120" y="88" fontSize="7.5" fill={MUTED} textAnchor="middle">Create your first pattern to begin.</text>
      <rect x="94" y="94" width="52" height="16" rx="4" fill={BLUE} />
      <text x="120" y="105" fontSize="7.5" fontWeight="700" fill={WHITE} textAnchor="middle">+ New</text>
    </g>
  ),

  'error-state': (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={RED_BG} stroke={RED} strokeWidth="1.2" />
      <circle cx="120" cy="50" r="13" fill={RED} />
      <text x="120" y="55" fontSize="12" fontWeight="800" fill={WHITE} textAnchor="middle">✕</text>
      <text x="120" y="75" fontSize="9" fontWeight="700" fill={RED} textAnchor="middle">Failed to Load Data</text>
      <text x="120" y="86" fontSize="7.5" fill="#7F1D1D" textAnchor="middle">Please check your network and retry.</text>
      <rect x="92" y="92" width="56" height="16" rx="4" fill={WHITE} stroke={RED} strokeWidth="1" />
      <text x="120" y="103" fontSize="7.5" fontWeight="700" fill={RED} textAnchor="middle">Retry ↻</text>
    </g>
  ),

  'success-state': (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={GREEN_BG} stroke={GREEN} strokeWidth="1.2" />
      <circle cx="120" cy="50" r="13" fill={GREEN} />
      <path d="M115 50 l3.5 3.5 l7 -7" stroke={WHITE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="120" y="75" fontSize="9.5" fontWeight="700" fill={GREEN} textAnchor="middle">Order Completed!</text>
      <text x="120" y="86" fontSize="7.5" fill="#047857" textAnchor="middle">Receipt sent to your inbox.</text>
      <rect x="94" y="92" width="52" height="16" rx="4" fill={GREEN} />
      <text x="120" y="103" fontSize="7.5" fontWeight="700" fill={WHITE} textAnchor="middle">Done</text>
    </g>
  ),

  'modal-stateful': (
    <g>
      <rect x="-20" y="-20" width="280" height="220" fill="#0F172A" fillOpacity="0.35" />
      <rect x="43" y="25" width="154" height="92" rx="8" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      {/* 多步骤表单对话框 */}
      <text x="55" y="44" fontSize="9" fontWeight="700" fill={INK}>Step 2 of 3: Permissions</text>
      <rect x="55" y="50" width="130" height="5" rx="2.5" fill={LINE} />
      <rect x="55" y="50" width="86" height="5" rx="2.5" fill={BLUE} />
      <rect x="55" y="62" width="130" height="20" rx="4" fill={SOFT} stroke={LINE} />
      <circle cx="67" cy="72" r="4" fill={GREEN} />
      <text x="76" y="75" fontSize="7.5" fontWeight="600" fill={INK2}>Full Read/Write Access</text>
      <rect x="141" y="88" width="44" height="20" rx="4" fill={BLUE} />
      <text x="163" y="101" fontSize="8" fontWeight="700" fill={WHITE} textAnchor="middle">Next →</text>
    </g>
  ),

  'load-more': (
    <g>
      <rect x="26" y="30" width="188" height="26" rx="5" fill={WHITE} stroke={LINE} />
      <rect x="38" y="41" width="90" height="6" rx="2" fill={LINE} />
      <rect x="26" y="60" width="188" height="26" rx="5" fill={WHITE} stroke={LINE} />
      <rect x="38" y="71" width="110" height="6" rx="2" fill={LINE} />
      {/* 加载更多按钮 */}
      <rect x="76" y="92" width="88" height="22" rx="11" fill={BLUE_BG} stroke={BLUE} strokeWidth="1" />
      <text x="120" y="106" fontSize="8" fontWeight="700" fill={BLUE} textAnchor="middle">Load 12 More ↓</text>
    </g>
  ),

  /* ==========================================================================
     6. Input (13 个)
     ========================================================================== */
  'segmented-control': (
    <g>
      <rect x="26" y="44" width="188" height="42" rx="8" fill={SOFT} stroke={LINE} />
      {/* 分段药丸切换器：激活态高亮 */}
      <rect x="30" y="48" width="60" height="34" rx="6" fill={BLUE} filter="url(#mini-shadow)" />
      <text x="60" y="69" fontSize="9.5" fontWeight="700" fill={WHITE} textAnchor="middle">Daily</text>
      <text x="120" y="69" fontSize="9" fontWeight="500" fill={INK2} textAnchor="middle">Weekly</text>
      <text x="180" y="69" fontSize="9" fontWeight="500" fill={MUTED} textAnchor="middle">Monthly</text>
    </g>
  ),

  'stepper-input': (
    <g>
      <rect x="26" y="34" width="188" height="76" rx="6" fill={SOFT} stroke={LINE} />
      <text x="60" y="52" fontSize="8.5" fontWeight="700" fill={MUTED}>QUANTITY</text>
      {/* 计数输入器 */}
      <rect x="60" y="60" width="120" height="34" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="60" y="60" width="34" height="34" rx="0" fill={SOFT} />
      <text x="77" y="81" fontSize="13" fontWeight="700" fill={INK} textAnchor="middle">−</text>
      <text x="120" y="81" fontSize="12" fontWeight="800" fill={BLUE} textAnchor="middle">3</text>
      <rect x="146" y="60" width="34" height="34" rx="0" fill={SOFT} />
      <text x="163" y="81" fontSize="13" fontWeight="700" fill={INK} textAnchor="middle">+</text>
    </g>
  ),

  'text-field': (
    <g>
      <text x="34" y="44" fontSize="8.5" fontWeight="700" fill={INK}>Email Address</text>
      {/* 聚焦输入框 */}
      <rect x="34" y="50" width="172" height="34" rx="6" fill={WHITE} stroke={BLUE} strokeWidth="1.8" />
      <text x="46" y="71" fontSize="9" fontWeight="500" fill={INK}>alex.designer@lutive.com</text>
      <line x1="166" y1="60" x2="166" y2="76" stroke={BLUE} strokeWidth="1.8" />
      <text x="34" y="98" fontSize="7.5" fill={MUTED}>We'll never share your email.</text>
    </g>
  ),

  'text-area': (
    <g>
      <text x="34" y="42" fontSize="8.5" fontWeight="700" fill={INK}>Project Description</text>
      <rect x="34" y="48" width="172" height="48" rx="6" fill={WHITE} stroke={LINE} />
      <text x="46" y="64" fontSize="8.5" fill={INK2}>Building a high quality UI field guide...</text>
      <rect x="46" y="72" width="110" height="4" rx="2" fill={LINE} />
      <text x="198" y="108" fontSize="7" fontWeight="600" fill={BLUE} textAnchor="end">42 / 200</text>
    </g>
  ),

  'search-field': (
    <g>
      {/* 搜索输入胶囊 */}
      <rect x="26" y="48" width="188" height="36" rx="18" fill={WHITE} stroke={BLUE} strokeWidth="1.4" />
      <circle cx="46" cy="66" r="5.5" fill="none" stroke={BLUE} strokeWidth="1.8" />
      <path d="M50 70 l4 4" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" />
      <text x="60" y="69" fontSize="9" fontWeight="500" fill={INK2}>Search patterns, tags, components...</text>
      <rect x="184" y="56" width="24" height="20" rx="4" fill={BLUE_BG} stroke={BLUE} strokeWidth="0.8" />
      <text x="196" y="69" fontSize="8" fontWeight="700" fill={BLUE} textAnchor="middle">⌘K</text>
    </g>
  ),

  checkbox: (
    <g>
      {/* 选中态 */}
      <rect x="38" y="42" width="20" height="20" rx="5" fill={BLUE} />
      <path d="M43 52 l3.5 3.5 l7 -7" stroke={WHITE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <text x="66" y="56" fontSize="9" fontWeight="700" fill={INK}>Enable push notifications</text>

      {/* 未选中态 */}
      <rect x="38" y="72" width="20" height="20" rx="5" fill={WHITE} stroke={LINE} strokeWidth="1.5" />
      <text x="66" y="86" fontSize="9" fontWeight="500" fill={INK2}>Weekly digest email</text>
    </g>
  ),

  radio: (
    <g>
      {/* 选中态 */}
      <circle cx="48" cy="52" r="10" fill={WHITE} stroke={BLUE} strokeWidth="2.2" />
      <circle cx="48" cy="52" r="5" fill={BLUE} />
      <text x="68" y="56" fontSize="9" fontWeight="700" fill={INK}>Standard Shipping (Free)</text>

      {/* 未选中态 */}
      <circle cx="48" cy="80" r="10" fill={WHITE} stroke={LINE} strokeWidth="1.8" />
      <text x="68" y="84" fontSize="9" fontWeight="500" fill={INK2}>Express Courier ($12.00)</text>
    </g>
  ),

  switch: (
    <g>
      {/* 开关 ON */}
      <rect x="36" y="42" width="44" height="24" rx="12" fill={GREEN} />
      <circle cx="68" cy="54" r="9" fill={WHITE} filter="url(#mini-shadow)" />
      <text x="90" y="57" fontSize="9" fontWeight="700" fill={INK}>Dark Mode Active</text>

      {/* 开关 OFF */}
      <rect x="36" y="74" width="44" height="24" rx="12" fill={LINE} />
      <circle cx="48" cy="86" r="9" fill={WHITE} filter="url(#mini-shadow)" />
      <text x="90" y="89" fontSize="9" fontWeight="500" fill={MUTED}>Sound Effects</text>
    </g>
  ),

  slider: (
    <g>
      <text x="34" y="48" fontSize="8.5" fontWeight="700" fill={INK}>Volume Level</text>
      <text x="206" y="48" fontSize="8.5" fontWeight="800" fill={BLUE} textAnchor="end">65%</text>
      {/* 滑轨与高亮槽 */}
      <rect x="34" y="66" width="172" height="7" rx="3.5" fill={LINE} />
      <rect x="34" y="66" width="112" height="7" rx="3.5" fill={BLUE} />
      {/* 物理滑块 */}
      <circle cx="146" cy="69.5" r="10" fill={WHITE} stroke={BLUE} strokeWidth="2.5" filter="url(#mini-shadow)" />
    </g>
  ),

  select: (
    <g>
      <text x="34" y="42" fontSize="8.5" fontWeight="700" fill={INK}>Deployment Region</text>
      <rect x="34" y="48" width="172" height="32" rx="6" fill={WHITE} stroke={LINE} />
      <circle cx="48" cy="64" r="4.5" fill={GREEN} />
      <text x="58" y="67" fontSize="8.5" fontWeight="600" fill={INK}>us-east-1 (N. Virginia)</text>
      <path d="M192 62 l4 4 l4 -4" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* 展开列表提示 */}
      <rect x="34" y="84" width="172" height="24" rx="4" fill={SOFT} stroke={LINE} />
      <text x="58" y="99" fontSize="8" fill={MUTED}>ap-northeast-1 (Tokyo)</text>
    </g>
  ),

  chip: (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      {/* 可交互 Chip 胶囊 */}
      <rect x="36" y="46" width="62" height="24" rx="12" fill={INK} />
      <text x="67" y="61" fontSize="8.5" fontWeight="700" fill={WHITE} textAnchor="middle">All Items</text>

      <rect x="104" y="46" width="58" height="24" rx="12" fill={WHITE} stroke={LINE} />
      <text x="133" y="61" fontSize="8.5" fontWeight="600" fill={INK2} textAnchor="middle">Featured</text>

      <rect x="168" y="46" width="42" height="24" rx="12" fill={WHITE} stroke={LINE} />
      <text x="189" y="61" fontSize="8.5" fontWeight="600" fill={INK2} textAnchor="middle">New</text>

      <rect x="36" y="78" width="82" height="24" rx="12" fill={BLUE_BG} stroke={BLUE} strokeWidth="1.2" />
      <text x="77" y="93" fontSize="8.5" fontWeight="700" fill={BLUE} textAnchor="middle">Selected ✕</text>
    </g>
  ),

  'date-picker': (
    <g>
      <rect x="34" y="30" width="172" height="84" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="48" y="46" fontSize="9" fontWeight="800" fill={INK}>October 2026</text>
      <path d="M184 41 l-3 -3 M194 38 l3 3" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
      {/* 迷你日历网格 */}
      {[0, 1, 2, 3, 4, 5, 6].map((col) => {
        const x = 50 + col * 20;
        return (
          <g key={col}>
            <circle cx={x} cy="60" r="4.5" fill={col < 2 ? SOFT : WHITE} />
            <circle cx={x} cy="76" r="7.5" fill={col === 3 ? BLUE : WHITE} stroke={col === 3 ? BLUE : 'none'} />
            <text x={x} y="79.5" fontSize="7" fontWeight={col === 3 ? '800' : '500'} fill={col === 3 ? WHITE : INK2} textAnchor="middle">
              {col + 10}
            </text>
            <circle cx={x} cy="94" r="4.5" fill={WHITE} />
          </g>
        );
      })}
    </g>
  ),

  'file-upload': (
    <g>
      {/* 虚线拖拽上传区 */}
      <rect x="26" y="32" width="188" height="80" rx="6" fill={BLUE_BG} stroke={BLUE} strokeWidth="1.5" strokeDasharray="5 3" />
      <circle cx="120" cy="54" r="14" fill={WHITE} stroke={BLUE} strokeWidth="1.2" />
      <path d="M120 61 v-13 M115 53 l5 -5 l5 5" stroke={BLUE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <text x="120" y="78" fontSize="9" fontWeight="700" fill={BLUE} textAnchor="middle">Drop assets here, or browse</text>
      <text x="120" y="90" fontSize="7.5" fill={MUTED} textAnchor="middle">Supports PNG, SVG, JSON up to 25MB</text>
    </g>
  ),

  /* ==========================================================================
     7. Interaction & Advanced Patterns (9 个)
     ========================================================================== */
  'swipe-action': (
    <g>
      {/* 底层划开操作按钮 */}
      <rect x="146" y="46" width="36" height="36" fill={BLUE} rx="2" />
      <text x="164" y="68" fontSize="8.5" fontWeight="700" fill={WHITE} textAnchor="middle">Pin</text>
      <rect x="182" y="46" width="34" height="36" fill={RED} rx="2" />
      <text x="199" y="68" fontSize="8.5" fontWeight="700" fill={WHITE} textAnchor="middle">Del</text>
      {/* 滑动的上层卡片 */}
      <g transform="translate(-42 0)">
        <rect x="34" y="46" width="180" height="36" rx="5" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
        <circle cx="52" cy="64" r="8" fill={BLUE_BG} stroke={BLUE} strokeWidth="1" />
        <text x="68" y="67" fontSize="9" fontWeight="700" fill={INK}>Swipe left to reveal actions</text>
      </g>
      <text x="120" y="104" fontSize="8" fontWeight="600" fill={MUTED} textAnchor="middle">← Drag horizontally to trigger</text>
    </g>
  ),

  'pull-to-refresh': (
    <g>
      {/* 顶部下拉圆环箭头 */}
      <circle cx="120" cy="44" r="11" fill={WHITE} stroke={BLUE} strokeWidth="1.5" filter="url(#mini-shadow)" />
      <path d="M120 38 a6 6 0 1 1 -5 2.5" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
      <path d="M115 38 l0 3.5 l3.5 0" stroke={BLUE} strokeWidth="1.8" fill="none" />
      <text x="120" y="66" fontSize="8" fontWeight="600" fill={BLUE} textAnchor="middle">Pull down to refresh...</text>
      {/* 内容列表 */}
      <rect x="34" y="74" width="172" height="18" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="46" y="81" width="80" height="5" rx="1.5" fill={LINE} />
      <rect x="34" y="96" width="172" height="18" rx="4" fill={WHITE} stroke={LINE} />
    </g>
  ),

  'infinite-scroll': (
    <g>
      <rect x="34" y="30" width="172" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="46" y="40" width="70" height="5" rx="1.5" fill={LINE} />
      <rect x="34" y="58" width="172" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="46" y="68" width="90" height="5" rx="1.5" fill={LINE} />
      {/* 底部加载更多指示 */}
      <circle cx="110" cy="98" r="6" fill="none" stroke={BLUE} strokeWidth="2" strokeDasharray="8 4" />
      <text x="124" y="101" fontSize="8" fontWeight="600" fill={BLUE}>Fetching more records...</text>
    </g>
  ),

  'drag-and-drop': (
    <g>
      {/* 看板列 1 */}
      <rect x="26" y="30" width="90" height="84" rx="6" fill={SOFT} stroke={LINE} />
      <text x="36" y="45" fontSize="8" fontWeight="700" fill={MUTED}>TO DO (2)</text>
      <rect x="32" y="52" width="78" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <text x="40" y="66" fontSize="8" fontWeight="600" fill={INK}>Design Tokens</text>
      {/* 拖拽中的卡片 */}
      <rect x="32" y="82" width="78" height="24" rx="4" fill={WHITE} stroke={BLUE} strokeWidth="1.8" filter="url(#mini-shadow)" />
      <text x="40" y="96" fontSize="8" fontWeight="700" fill={BLUE}>Navigation v2 ⠿</text>

      {/* 看板列 2 */}
      <rect x="124" y="30" width="90" height="84" rx="6" fill={BLUE_BG} stroke={BLUE} strokeDasharray="4 3" strokeWidth="1.2" />
      <text x="134" y="45" fontSize="8" fontWeight="700" fill={BLUE}>IN PROGRESS</text>
    </g>
  ),

  'long-press': (
    <g>
      <rect x="30" y="32" width="92" height="80" rx="6" fill={WHITE} stroke={LINE} />
      <circle cx="76" cy="62" r="18" fill={BLUE_BG} stroke={BLUE} strokeWidth="1.5" />
      <text x="76" y="66" fontSize="10" fontWeight="800" fill={BLUE} textAnchor="middle">Hold</text>
      <text x="76" y="94" fontSize="7.5" fontWeight="600" fill={MUTED} textAnchor="middle">Long press 500ms</text>
      {/* 弹出的快捷微菜单 */}
      <rect x="130" y="40" width="80" height="60" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="142" y="56" fontSize="8" fontWeight="700" fill={INK}>Share Item</text>
      <text x="142" y="70" fontSize="8" fontWeight="500" fill={INK2}>Duplicate</text>
      <line x1="130" y1="76" x2="210" y2="76" stroke={LINE} />
      <text x="142" y="90" fontSize="8" fontWeight="700" fill={RED}>Delete</text>
    </g>
  ),

  'context-menu': (
    <g>
      <rect x="26" y="30" width="188" height="84" rx="6" fill={SOFT} stroke={LINE} />
      <circle cx="66" cy="60" r="16" fill={WHITE} stroke={LINE} />
      <text x="66" y="64" fontSize="8.5" fontWeight="600" fill={MUTED} textAnchor="middle">File</text>
      {/* 右键浮起菜单 */}
      <rect x="90" y="38" width="114" height="70" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="102" y="54" fontSize="8.5" fontWeight="500" fill={INK}>Inspect Element</text>
      <text x="102" y="68" fontSize="8.5" fontWeight="500" fill={INK}>Copy Selector</text>
      <line x1="90" y1="74" x2="204" y2="74" stroke={LINE} />
      <text x="102" y="88" fontSize="8.5" fontWeight="700" fill={BLUE}>Copy AI Prompt</text>
      <text x="102" y="100" fontSize="8.5" fontWeight="700" fill={RED}>Delete Component</text>
    </g>
  ),

  'progressive-disclosure': (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={WHITE} stroke={LINE} />
      <text x="38" y="48" fontSize="9" fontWeight="700" fill={INK}>Basic Settings</text>
      <rect x="38" y="56" width="164" height="6" rx="2" fill={LINE} />
      {/* 渐进披露触发开关 */}
      <text x="38" y="78" fontSize="8.5" fontWeight="700" fill={BLUE}>Show Advanced Options ▾</text>
      <rect x="38" y="86" width="164" height="20" rx="4" fill={SOFT} stroke={LINE} />
      <text x="46" y="99" fontSize="7.5" fill={MUTED}>API Key, Webhook URL, Timeout limits...</text>
    </g>
  ),

  'optimistic-ui': (
    <g>
      <rect x="26" y="32" width="188" height="80" rx="6" fill={SOFT} stroke={LINE} />
      {/* 乐观更新卡片 */}
      <rect x="38" y="44" width="164" height="42" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <path d="M52 65 c-3 -4 -7 -1 -7 2 c0 4 7 9 7 9 c0 0 7 -5 7 -9 c0 -3 -4 -6 -7 -2 z" fill={RED} />
      <text x="66" y="66" fontSize="9" fontWeight="700" fill={INK}>Favorited instantly</text>
      <circle cx="184" cy="65" r="4.5" fill="none" stroke={BLUE} strokeWidth="1.5" strokeDasharray="4 2" />
      <text x="120" y="102" fontSize="7.5" fontWeight="600" fill={MUTED} textAnchor="middle">UI updates before server ACK</text>
    </g>
  ),

  'inline-validation': (
    <g>
      <text x="34" y="42" fontSize="8.5" fontWeight="700" fill={INK}>Choose Username</text>
      {/* 实时校验红框与提示 */}
      <rect x="34" y="48" width="172" height="30" rx="6" fill={WHITE} stroke={RED} strokeWidth="1.6" />
      <text x="46" y="67" fontSize="9" fontWeight="500" fill={INK}>admin_root</text>
      <circle cx="194" cy="63" r="5.5" fill={RED} />
      <text x="194" y="66.5" fontSize="8" fontWeight="800" fill={WHITE} textAnchor="middle">✕</text>
      {/* 错误提示文字 */}
      <text x="34" y="90" fontSize="8" fontWeight="600" fill={RED}>Username is already taken by another account.</text>
      <text x="34" y="102" fontSize="7.5" fontWeight="600" fill={GREEN}>✓ Suggestion: admin_root_2026</text>
    </g>
  ),

  'action-sheet': (
    <g>
      <rect x="26" y="28" width="188" height="88" rx="6" fill="#0F172A" fillOpacity="0.15" />
      {/* iOS Action Sheet: 上部功能卡片 + 底部独立取消岛 */}
      <rect x="48" y="36" width="144" height="48" rx="8" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="120" y="52" fontSize="8.5" fontWeight="600" fill={BLUE} textAnchor="middle">Share Photo</text>
      <line x1="48" y1="60" x2="192" y2="60" stroke={LINE} strokeWidth="0.8" />
      <text x="120" y="74" fontSize="8.5" fontWeight="700" fill={RED} textAnchor="middle">Delete Permanently</text>
      {/* 独立取消岛 */}
      <rect x="48" y="90" width="144" height="22" rx="8" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="120" y="104" fontSize="9" fontWeight="700" fill={INK} textAnchor="middle">Cancel</text>
    </g>
  ),

  'command-palette': (
    <g>
      {/* Linear 风格 ⌘K 居中浮窗 */}
      <rect x="32" y="32" width="176" height="82" rx="8" fill={WHITE} stroke={BLUE} strokeWidth="1.4" filter="url(#mini-shadow)" />
      {/* 顶部搜索栏 */}
      <circle cx="44" cy="45" r="3" stroke={BLUE} strokeWidth="1.2" fill="none" />
      <line x1="46.5" y1="47.5" x2="49" y2="50" stroke={BLUE} strokeWidth="1.2" strokeLinecap="round" />
      <text x="54" y="48" fontSize="8.5" fontWeight="500" fill={INK}>Type a command...</text>
      <rect x="182" y="40" width="20" height="11" rx="2" fill={SOFT} stroke={LINE} />
      <text x="192" y="48" fontSize="7" fontWeight="700" fill={MUTED} textAnchor="middle">ESC</text>
      <line x1="32" y1="54" x2="208" y2="54" stroke={LINE} strokeWidth="0.8" />
      {/* 命令项目 1 */}
      <rect x="38" y="58" width="164" height="20" rx="4" fill={BLUE_BG} stroke={BLUE} strokeWidth="0.8" />
      <text x="48" y="71" fontSize="8" fontWeight="700" fill={BLUE}>Create New Issue</text>
      <rect x="180" y="63" width="18" height="10" rx="2" fill={WHITE} stroke={LINE} />
      <text x="189" y="70" fontSize="6.5" fontWeight="700" fill={BLUE} textAnchor="middle">⌘N</text>
      {/* 命令项目 2 */}
      <rect x="38" y="82" width="164" height="18" rx="4" fill={WHITE} />
      <text x="48" y="94" fontSize="8" fill={INK2}>Switch Project...</text>
      <rect x="180" y="86" width="18" height="10" rx="2" fill={SOFT} stroke={LINE} />
      <text x="189" y="93" fontSize="6.5" fontWeight="700" fill={MUTED} textAnchor="middle">↵</text>
    </g>
  ),

  'extended-fab': (
    <g>
      {/* 模拟页面列表项 */}
      <rect x="34" y="32" width="172" height="18" rx="4" fill={SOFT} stroke={LINE} />
      <rect x="34" y="54" width="172" height="18" rx="4" fill={SOFT} stroke={LINE} />
      <rect x="34" y="76" width="172" height="18" rx="4" fill={SOFT} stroke={LINE} />
      {/* 右下角 MD3 Extended FAB 展开胶囊 */}
      <rect x="114" y="76" width="92" height="32" rx="16" fill={BLUE} filter="url(#mini-shadow)" />
      <circle cx="130" cy="92" r="7" fill={WHITE} fillOpacity="0.2" />
      <path d="M127 92 h6 M130 89 v6" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
      <text x="144" y="95" fontSize="8.5" fontWeight="700" fill={WHITE}>Compose</text>
    </g>
  ),

  'service-card': (
    <g>
      {/* 鸿蒙 HarmonyOS 2x2 桌面万能服务卡片 */}
      <rect x="58" y="30" width="124" height="86" rx="16" fill="url(#mini-harmony-grad)" stroke="#93C5FD" strokeWidth="1.2" filter="url(#mini-shadow)" />
      <defs>
        <linearGradient id="mini-harmony-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
      {/* 头部微标识 */}
      <circle cx="74" cy="44" r="5" fill={BLUE} />
      <text x="84" y="47" fontSize="7.5" fontWeight="700" fill={BLUE}>Weather</text>
      <circle cx="168" cy="44" r="2.5" fill={BLUE} opacity="0.6" />
      {/* 核心气温与天气图 */}
      <text x="74" y="75" fontSize="21" fontWeight="800" fill={INK}>26°</text>
      <circle cx="152" cy="65" r="9" fill="#F59E0B" />
      <path d="M145 72 q7 -6 16 0" stroke={WHITE} strokeWidth="1.8" fill="none" />
      {/* 底部微胶囊状态 */}
      <rect x="72" y="86" width="76" height="16" rx="8" fill={WHITE} opacity="0.95" />
      <text x="110" y="97" fontSize="6.5" fontWeight="700" fill={GREEN} textAnchor="middle">AQI 24 · Good</text>
    </g>
  ),

  /* ==========================================================================
     8. Layout (8 个)
     ========================================================================== */
  container: (
    <g>
      <rect x="22" y="32" width="196" height="82" rx="5" fill={SOFT} stroke={LINE} />
      <rect x="54" y="32" width="132" height="82" fill={WHITE} stroke={PURPLE} strokeWidth="1.2" strokeDasharray="4 2" />
      <rect x="64" y="40" width="64" height="7" rx="2" fill={PURPLE} />
      <rect x="64" y="52" width="112" height="3" rx="1.5" fill={MUTED} opacity="0.4" />
      <rect x="64" y="58" width="92" height="3" rx="1.5" fill={MUTED} opacity="0.4" />
      <rect x="64" y="68" width="52" height="38" rx="4" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="0.8" />
      <rect x="124" y="68" width="52" height="38" rx="4" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="0.8" />
      <text x="38" y="76" fontSize="6.5" fontWeight="700" fill={PURPLE} textAnchor="middle">margin</text>
      <text x="202" y="76" fontSize="6.5" fontWeight="700" fill={PURPLE} textAnchor="middle">margin</text>
    </g>
  ),

  hero: (
    <g>
      <rect x="96" y="33" width="48" height="8" rx="4" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="0.8" />
      <text x="120" y="39.5" fontSize="5" fill={PURPLE} fontWeight="800" textAnchor="middle">NEW LAUNCH</text>
      <rect x="54" y="46" width="132" height="10" rx="2" fill={INK} />
      <rect x="70" y="60" width="100" height="4" rx="1.5" fill={MUTED} opacity="0.6" />
      <rect x="90" y="69" width="28" height="12" rx="4" fill={PURPLE} />
      <text x="104" y="77.5" fontSize="5.5" fontWeight="700" fill={WHITE} textAnchor="middle">Start</text>
      <rect x="122" y="69" width="28" height="12" rx="4" fill={WHITE} stroke={LINE} />
      <text x="136" y="77.5" fontSize="5.5" fontWeight="600" fill={INK2} textAnchor="middle">Demo</text>
      <rect x="46" y="86" width="148" height="28" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <circle cx="56" cy="94" r="2.2" fill={LINE} />
      <circle cx="63" cy="94" r="2.2" fill={LINE} />
      <line x1="46" y1="98" x2="194" y2="98" stroke={SOFT} strokeWidth="1" />
    </g>
  ),

  'bento-grid': (
    <g>
      {/* Bento 主格 */}
      <rect x="26" y="32" width="116" height="82" rx="8" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="1.2" />
      <rect x="36" y="40" width="32" height="7" rx="2" fill={PURPLE} />
      <rect x="36" y="52" width="86" height="5" rx="1" fill={INK} />
      <rect x="36" y="60" width="64" height="4" rx="1" fill={MUTED} opacity="0.6" />
      <rect x="36" y="70" width="96" height="36" rx="5" fill={WHITE} stroke={PURPLE} strokeWidth="0.8" />

      {/* 右上小格 */}
      <rect x="148" y="32" width="66" height="38" rx="7" fill={GREEN_BG} stroke={GREEN} strokeWidth="1" />
      <circle cx="160" cy="45" r="4.5" fill={GREEN} />
      <rect x="168" y="43" width="38" height="5" rx="1" fill={INK} />
      <rect x="158" y="56" width="48" height="4" rx="1" fill={GREEN} opacity="0.6" />

      {/* 右下小格 */}
      <rect x="148" y="76" width="66" height="38" rx="7" fill={BLUE_BG} stroke={BLUE} strokeWidth="1" />
      <circle cx="160" cy="89" r="4.5" fill={BLUE} />
      <rect x="168" y="87" width="38" height="5" rx="1" fill={INK} />
      <rect x="158" y="100" width="48" height="4" rx="1" fill={BLUE} opacity="0.6" />
    </g>
  ),

  masonry: (
    <g>
      <rect x="26" y="32" width="58" height="50" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="30" y="36" width="50" height="32" rx="4" fill="#EEF2F6" />
      <rect x="30" y="72" width="38" height="5" rx="1" fill={INK} />

      <rect x="26" y="86" width="58" height="28" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="30" y="90" width="50" height="14" rx="3" fill="#FAF5EF" />
      <rect x="30" y="107" width="30" height="4" rx="1" fill={MUTED} opacity="0.6" />

      <rect x="90" y="32" width="58" height="34" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="94" y="36" width="50" height="20" rx="3" fill={PURPLE_BG} />
      <rect x="94" y="59" width="34" height="4" rx="1" fill={PURPLE} />

      <rect x="90" y="70" width="58" height="44" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="94" y="74" width="50" height="28" rx="4" fill={GREEN_BG} />
      <rect x="94" y="105" width="40" height="4" rx="1" fill={GREEN} />

      <rect x="154" y="32" width="58" height="54" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="158" y="36" width="50" height="38" rx="4" fill={RED_BG} />
      <rect x="158" y="78" width="36" height="5" rx="1" fill={RED} />

      <rect x="154" y="90" width="58" height="24" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="158" y="94" width="50" height="14" rx="3" fill={BLUE_BG} />
    </g>
  ),

  'split-screen': (
    <g>
      <rect x="24" y="30" width="96" height="84" rx="5" fill={INK} />
      <rect x="34" y="42" width="42" height="5" rx="1" fill={PURPLE} />
      <text x="34" y="60" fontSize="9" fontWeight="800" fill={WHITE}>Split Story</text>
      <rect x="34" y="68" width="70" height="4" rx="1" fill="#94A3B8" />
      <rect x="34" y="76" width="52" height="4" rx="1" fill="#94A3B8" />

      <rect x="120" y="30" width="96" height="84" rx="5" fill={WHITE} stroke={LINE} />
      <text x="134" y="47" fontSize="9" fontWeight="700" fill={INK}>Log in</text>
      <rect x="134" y="54" width="70" height="11" rx="3" fill={SOFT} stroke={LINE} />
      <rect x="134" y="69" width="70" height="11" rx="3" fill={SOFT} stroke={LINE} />
      <rect x="134" y="86" width="70" height="14" rx="4" fill={PURPLE} />
      <text x="169" y="96" fontSize="6.5" fontWeight="700" fill={WHITE} textAnchor="middle">Submit</text>
    </g>
  ),

  'sidebar-layout': (
    <g>
      <rect x="24" y="30" width="48" height="84" rx="5" fill={SOFT} stroke={LINE} />
      <rect x="30" y="36" width="14" height="5" rx="1" fill={PURPLE} />
      <rect x="30" y="47" width="36" height="7" rx="2" fill={WHITE} stroke={PURPLE} strokeWidth="0.8" />
      <rect x="30" y="58" width="36" height="5" rx="1.5" fill={MUTED} opacity="0.4" />
      <rect x="30" y="66" width="36" height="5" rx="1.5" fill={MUTED} opacity="0.4" />
      <rect x="30" y="74" width="36" height="5" rx="1.5" fill={MUTED} opacity="0.4" />

      <rect x="76" y="30" width="140" height="84" rx="5" fill={WHITE} stroke={LINE} />
      <line x1="76" y1="44" x2="216" y2="44" stroke={LINE} strokeWidth="1" />
      <rect x="84" y="36" width="44" height="5" rx="1" fill={MUTED} opacity="0.5" />
      <rect x="84" y="52" width="124" height="28" rx="5" fill={SOFT} stroke={LINE} />
      <rect x="84" y="84" width="124" height="24" rx="5" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="0.8" />
    </g>
  ),

  'sticky-bar': (
    <g>
      <rect x="28" y="32" width="184" height="82" rx="5" fill={SOFT} stroke={LINE} />
      <rect x="40" y="60" width="160" height="14" rx="3" fill={WHITE} stroke={LINE} />
      <rect x="40" y="78" width="160" height="14" rx="3" fill={WHITE} stroke={LINE} />
      <rect x="40" y="96" width="160" height="14" rx="3" fill={WHITE} stroke={LINE} />

      <rect x="28" y="32" width="184" height="22" fill={WHITE} opacity="0.96" stroke={PURPLE} strokeWidth="1" filter="url(#mini-shadow)" />
      <circle cx="42" cy="43" r="3.5" fill={PURPLE} />
      <rect x="50" y="40" width="40" height="5" rx="1" fill={INK} />
      <rect x="172" y="37" width="32" height="12" rx="3" fill={PURPLE} />
      <text x="188" y="45.5" fontSize="5.5" fontWeight="700" fill={WHITE} textAnchor="middle">Action</text>
    </g>
  ),

  'full-bleed': (
    <g>
      <rect x="56" y="32" width="128" height="20" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="18" y="58" width="204" height="34" fill={INK} />
      <rect x="56" y="62" width="128" height="26" fill="none" stroke={PURPLE} strokeWidth="1.2" strokeDasharray="3 2" />
      <text x="120" y="74" fontSize="7.5" fontWeight="800" fill={WHITE} textAnchor="middle">Full-Bleed 100vw</text>
      <text x="120" y="83" fontSize="5.5" fontWeight="600" fill="#CBD5E1" textAnchor="middle">Inner max-w-7xl centered</text>
      <rect x="56" y="96" width="128" height="20" rx="4" fill={WHITE} stroke={LINE} />
    </g>
  ),
};
