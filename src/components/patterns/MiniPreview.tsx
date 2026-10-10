import type { ReactElement } from 'react';

/**
 * 卡片内的商业级 Micro-UI 微缩示意图（纯 SVG 矢量，无外部运行时依赖）。
 *
 * 设计规范（Micro-UI Design System）：
 * 1. 统一视窗舞台（Showcase Stage）：240x132 视口，居中置入 208x106 视窗卡片，
 *    搭配微描边、圆角与极简 Window Chrome（视窗微点），呈现高质感软件产品界面。
 * 2. 鲜活具象化（Living Components）：摒弃粗糙的窄单灰线条，采用真实组件微缩轮廓、
 *    微文字、现代胶囊药丸（Pill）、层次色彩（翡翠绿、科技蓝、暖炭黑、柔和暖灰）与微图标。
 * 3. 严格覆盖全站 63 个 Pattern ID。
 */

export function MiniPreview({ id }: { id: string }) {
  const draw = PREVIEWS[id];
  if (!draw) {
    return (
      <div className="flex h-full items-center justify-center bg-[#FAF9F6]">
        <span className="text-2xs font-mono text-[#8C887E]">UI</span>
      </div>
    );
  }
  return (
    <svg
      viewBox="0 0 240 132"
      className="h-full w-full"
      role="img"
      aria-label={`${id} 示意图`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="mini-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1A1917" floodOpacity="0.04" />
        </filter>
      </defs>
      {/* 统一外舞台底框 */}
      <rect x="14" y="10" width="212" height="112" rx="8" fill="#FFFFFF" stroke="#E6E3DB" strokeWidth="1" filter="url(#mini-shadow)" />
      {/* 视窗顶部装饰微点 */}
      <circle cx="25" cy="19" r="2" fill="#E6E3DB" />
      <circle cx="32" cy="19" r="2" fill="#E6E3DB" />
      <circle cx="39" cy="19" r="2" fill="#E6E3DB" />
      <line x1="14" y1="26" x2="226" y2="26" stroke="#F0EDE6" strokeWidth="1" />
      {/* 组件主体呈现 */}
      {draw}
    </svg>
  );
}

const INK = '#1A1917';
const INK2 = '#4A4740';
const MUTED = '#8C887E';
const LINE = '#E6E3DB';
const SOFT = '#F5F3ED';
const WHITE = '#FFFFFF';
const GREEN = '#1D734C';
const GREEN_BG = '#E8F3ED';
const BLUE = '#2563EB';
const BLUE_BG = '#EFF6FF';
const RED = '#DC2626';
const RED_BG = '#FEF2F2';
const AMBER = '#D97706';
const AMBER_BG = '#FFFBEB';

const PREVIEWS: Record<string, ReactElement> = {
  /* ==========================================================================
     1. Navigation (8 个)
     ========================================================================== */
  breadcrumb: (
    <g>
      <rect x="28" y="44" width="184" height="42" rx="6" fill={SOFT} />
      {/* Home 图标与文本 */}
      <path d="M42 66 L47 62 L52 66 V71 H42 Z" fill="none" stroke={MUTED} strokeWidth="1.4" />
      <text x="56" y="68" fontSize="8.5" fill={MUTED} fontFamily="sans-serif">Home</text>
      <text x="82" y="68" fontSize="8.5" fill={MUTED} fontFamily="sans-serif">›</text>
      <text x="92" y="68" fontSize="8.5" fill={MUTED} fontFamily="sans-serif">Projects</text>
      <text x="130" y="68" fontSize="8.5" fill={MUTED} fontFamily="sans-serif">›</text>
      {/* 当前项高亮胶囊 */}
      <rect x="140" y="55" width="58" height="20" rx="4" fill={WHITE} stroke={LINE} />
      <text x="146" y="68" fontSize="8.5" fontWeight="600" fill={INK} fontFamily="sans-serif">UI Guide</text>
    </g>
  ),

  tabs: (
    <g>
      {/* 顶部 Tab 栏 */}
      <rect x="28" y="38" width="62" height="22" rx="4" fill={INK} />
      <text x="59" y="52" fontSize="8" fontWeight="600" fill={WHITE} textAnchor="middle">Overview</text>
      <rect x="94" y="38" width="54" height="22" rx="4" fill="transparent" />
      <text x="121" y="52" fontSize="8" fill={MUTED} textAnchor="middle">Activity</text>
      <rect x="152" y="38" width="54" height="22" rx="4" fill="transparent" />
      <text x="179" y="52" fontSize="8" fill={MUTED} textAnchor="middle">Settings</text>
      {/* 选中内容面板 */}
      <rect x="28" y="64" width="184" height="46" rx="6" fill={SOFT} stroke={LINE} />
      <circle cx="44" cy="80" r="7" fill={GREEN_BG} />
      <path d="M41 80 l2 2 l4 -4" stroke={GREEN} strokeWidth="1.4" fill="none" />
      <rect x="58" y="76" width="72" height="8" rx="2" fill={INK2} />
      <rect x="58" y="90" width="124" height="6" rx="2" fill={LINE} />
    </g>
  ),

  'bottom-navigation': (
    <g>
      {/* 模拟手机卡片视口 */}
      <rect x="36" y="34" width="168" height="80" rx="6" fill={SOFT} stroke={LINE} />
      <rect x="46" y="44" width="70" height="8" rx="2" fill={LINE} />
      <rect x="46" y="58" width="148" height="18" rx="4" fill={WHITE} />
      {/* 底部导航条 */}
      <rect x="36" y="86" width="168" height="28" rx="0" fill={WHITE} />
      <line x1="36" y1="86" x2="204" y2="86" stroke={LINE} strokeWidth="1" />
      {/* Tab 1 (激活) */}
      <circle cx="58" cy="97" r="4.5" fill={INK} />
      <rect x="52" y="104" width="12" height="4" rx="1.5" fill={INK} />
      {/* Tab 2, 3, 4 */}
      <circle cx="98" cy="97" r="4.5" fill={LINE} />
      <circle cx="140" cy="97" r="4.5" fill={LINE} />
      <circle cx="182" cy="97" r="4.5" fill={LINE} />
    </g>
  ),

  'navigation-rail': (
    <g>
      {/* 左侧垂直导航轨 */}
      <rect x="28" y="32" width="34" height="82" rx="5" fill={INK} />
      <circle cx="45" cy="46" r="6" fill={GREEN} />
      <rect x="36" y="60" width="18" height="14" rx="3" fill={WHITE} fillOpacity="0.2" />
      <rect x="36" y="80" width="18" height="14" rx="3" fill={WHITE} fillOpacity="0.1" />
      <circle cx="45" cy="104" r="5" fill={WHITE} fillOpacity="0.3" />
      {/* 右侧主视区 */}
      <rect x="68" y="32" width="144" height="82" rx="5" fill={SOFT} stroke={LINE} />
      <rect x="80" y="44" width="60" height="9" rx="2" fill={INK2} />
      <rect x="80" y="60" width="120" height="20" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="80" y="86" width="120" height="18" rx="4" fill={WHITE} stroke={LINE} />
    </g>
  ),

  sidebar: (
    <g>
      {/* 侧边栏 */}
      <rect x="28" y="32" width="56" height="82" rx="5" fill={SOFT} stroke={LINE} />
      <rect x="36" y="42" width="40" height="6" rx="2" fill={INK} />
      {/* 菜单项（第一个激活） */}
      <rect x="34" y="56" width="44" height="16" rx="3" fill={WHITE} stroke={LINE} />
      <circle cx="40" cy="64" r="2.5" fill={GREEN} />
      <rect x="46" y="61" width="26" height="5" rx="1.5" fill={INK2} />
      <rect x="38" y="78" width="36" height="5" rx="1.5" fill={MUTED} />
      <rect x="38" y="90" width="30" height="5" rx="1.5" fill={MUTED} />
      {/* 右侧主内容 */}
      <rect x="90" y="32" width="122" height="82" rx="5" fill={WHITE} stroke={LINE} />
      <rect x="102" y="44" width="50" height="8" rx="2" fill={INK2} />
      <rect x="102" y="60" width="98" height="42" rx="4" fill={SOFT} />
    </g>
  ),

  pagination: (
    <g>
      <rect x="28" y="38" width="184" height="24" rx="4" fill={SOFT} />
      <rect x="38" y="47" width="80" height="6" rx="2" fill={LINE} />
      {/* 分页控制胶囊群 */}
      {[
        { t: '‹', a: false },
        { t: '1', a: false },
        { t: '2', a: true },
        { t: '3', a: false },
        { t: '4', a: false },
        { t: '›', a: false },
      ].map((p, i) => {
        const x = 44 + i * 26;
        return (
          <g key={i}>
            <rect
              x={x}
              y="74"
              width="22"
              height="22"
              rx="4"
              fill={p.a ? INK : WHITE}
              stroke={p.a ? INK : LINE}
            />
            <text
              x={x + 11}
              y="88"
              fontSize="9"
              fontWeight={p.a ? '600' : '400'}
              fill={p.a ? WHITE : INK2}
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
      <line x1="55" y1="58" x2="185" y2="58" stroke={LINE} strokeWidth="2" />
      <line x1="55" y1="58" x2="115" y2="58" stroke={GREEN} strokeWidth="2" />
      {/* 节点 1 (完成) */}
      <circle cx="55" cy="58" r="10" fill={GREEN} />
      <path d="M51 58 l3 3 l5 -6" stroke={WHITE} strokeWidth="1.6" fill="none" />
      <text x="55" y="80" fontSize="7.5" fontWeight="600" fill={INK} textAnchor="middle">1. Account</text>
      {/* 节点 2 (进行中) */}
      <circle cx="120" cy="58" r="10" fill={WHITE} stroke={BLUE} strokeWidth="2.5" />
      <circle cx="120" cy="58" r="3.5" fill={BLUE} />
      <text x="120" y="80" fontSize="7.5" fontWeight="600" fill={BLUE} textAnchor="middle">2. Profile</text>
      {/* 节点 3 (未开始) */}
      <circle cx="185" cy="58" r="10" fill={WHITE} stroke={LINE} strokeWidth="1.5" />
      <text x="185" y="62" fontSize="8" fill={MUTED} textAnchor="middle">3</text>
      <text x="185" y="80" fontSize="7.5" fill={MUTED} textAnchor="middle">Confirm</text>
    </g>
  ),

  'back-button': (
    <g>
      <rect x="28" y="36" width="184" height="74" rx="6" fill={SOFT} />
      {/* 顶部返回导航栏 */}
      <rect x="28" y="36" width="184" height="28" rx="0" fill={WHITE} stroke={LINE} />
      <rect x="36" y="42" width="48" height="16" rx="3" fill={SOFT} />
      <path d="M44 50 l-3 -3 l3 -3" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <text x="50" y="53" fontSize="8" fontWeight="600" fill={INK}>Back</text>
      <text x="120" y="53" fontSize="8.5" fontWeight="600" fill={INK} textAnchor="middle">Document Details</text>
      <rect x="42" y="74" width="80" height="8" rx="2" fill={LINE} />
      <rect x="42" y="88" width="140" height="12" rx="3" fill={WHITE} />
    </g>
  ),

  /* ==========================================================================
     2. Actions (6 个)
     ========================================================================== */
  button: (
    <g>
      {/* Primary Button */}
      <rect x="36" y="42" width="76" height="28" rx="5" fill={INK} />
      <text x="74" y="59" fontSize="9" fontWeight="600" fill={WHITE} textAnchor="middle">Save Changes</text>
      {/* Secondary Button */}
      <rect x="124" y="42" width="76" height="28" rx="5" fill={WHITE} stroke={LINE} />
      <text x="162" y="59" fontSize="9" fontWeight="500" fill={INK2} textAnchor="middle">Cancel</text>
      {/* Ghost / Small Button */}
      <rect x="80" y="80" width="80" height="24" rx="12" fill={BLUE_BG} />
      <text x="120" y="95" fontSize="8.5" fontWeight="600" fill={BLUE} textAnchor="middle">+ New Project</text>
    </g>
  ),

  cta: (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      <text x="120" y="52" fontSize="10" fontWeight="700" fill={INK} textAnchor="middle">Ready to Ship Faster?</text>
      <text x="120" y="65" fontSize="7.5" fill={MUTED} textAnchor="middle">Join 10,000+ indie makers today.</text>
      {/* 醒目 CTA 胶囊 */}
      <rect x="66" y="74" width="108" height="28" rx="14" fill={GREEN} />
      <text x="120" y="91" fontSize="9" fontWeight="600" fill={WHITE} textAnchor="middle">Get Started Free →</text>
    </g>
  ),

  'icon-button': (
    <g>
      <rect x="28" y="44" width="184" height="44" rx="6" fill={SOFT} />
      {[
        { icon: 'edit', color: INK },
        { icon: 'copy', color: INK },
        { icon: 'share', color: BLUE },
        { icon: 'trash', color: RED },
      ].map((item, i) => {
        const x = 44 + i * 40;
        return (
          <g key={i}>
            <rect x={x} y="52" width="28" height="28" rx="6" fill={WHITE} stroke={LINE} />
            <circle cx={x + 14} cy="66" r="6" fill={item.color} fillOpacity="0.1" />
            <circle cx={x + 14} cy="66" r="3" fill={item.color} />
          </g>
        );
      })}
    </g>
  ),

  fab: (
    <g>
      <rect x="28" y="32" width="184" height="80" rx="5" fill={SOFT} />
      <rect x="40" y="44" width="90" height="8" rx="2" fill={LINE} />
      <rect x="40" y="58" width="110" height="6" rx="2" fill={LINE} />
      <rect x="40" y="70" width="80" height="6" rx="2" fill={LINE} />
      {/* 悬浮 FAB 按钮 */}
      <circle cx="178" cy="84" r="18" fill={BLUE} filter="url(#mini-shadow)" />
      <path d="M178 76 v16 M170 84 h16" stroke={WHITE} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),

  'split-button': (
    <g>
      <rect x="42" y="52" width="120" height="30" rx="5" fill={INK} />
      <text x="94" y="70" fontSize="9" fontWeight="600" fill={WHITE} textAnchor="middle">Deploy Site</text>
      <line x1="134" y1="52" x2="134" y2="82" stroke={WHITE} strokeOpacity="0.3" strokeWidth="1" />
      <path d="M144 65 l3.5 4 l3.5 -4" stroke={WHITE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* 下拉展开提示 */}
      <rect x="130" y="86" width="68" height="20" rx="3" fill={WHITE} stroke={LINE} />
      <text x="164" y="99" fontSize="7.5" fill={INK2} textAnchor="middle">Preview Only</text>
    </g>
  ),

  'destructive-action': (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={RED_BG} stroke="#FECACA" />
      <circle cx="48" cy="54" r="8" fill={RED} />
      <text x="48" y="57" fontSize="9" fontWeight="700" fill={WHITE} textAnchor="middle">!</text>
      <text x="64" y="54" fontSize="9" fontWeight="600" fill={RED}>Delete Workspace?</text>
      <text x="64" y="66" fontSize="7.5" fill="#7F1D1D">This action cannot be undone.</text>
      {/* 危险操作按钮 */}
      <rect x="124" y="76" width="76" height="24" rx="4" fill={RED} />
      <text x="162" y="91" fontSize="8.5" fontWeight="600" fill={WHITE} textAnchor="middle">Delete Now</text>
    </g>
  ),

  /* ==========================================================================
     3. Containers & Overlays (8 个)
     ========================================================================== */
  card: (
    <g>
      <rect x="36" y="32" width="76" height="80" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="42" y="38" width="64" height="34" rx="4" fill={BLUE_BG} />
      <rect x="42" y="78" width="50" height="6" rx="2" fill={INK} />
      <rect x="42" y="88" width="40" height="5" rx="1.5" fill={MUTED} />
      <rect x="42" y="98" width="24" height="8" rx="3" fill={GREEN_BG} />

      <rect x="128" y="32" width="76" height="80" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="134" y="38" width="64" height="34" rx="4" fill={SOFT} />
      <rect x="134" y="78" width="46" height="6" rx="2" fill={INK} />
      <rect x="134" y="88" width="54" height="5" rx="1.5" fill={MUTED} />
      <rect x="134" y="98" width="24" height="8" rx="3" fill={SOFT} />
    </g>
  ),

  accordion: (
    <g>
      {/* Item 1 (展开) */}
      <rect x="28" y="32" width="184" height="48" rx="5" fill={SOFT} stroke={LINE} />
      <circle cx="42" cy="45" r="3" fill={BLUE} />
      <text x="52" y="48" fontSize="8.5" fontWeight="600" fill={INK}>How does billing work?</text>
      <path d="M196 46 l-4 -4 l-4 4" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="52" y="56" width="138" height="14" rx="3" fill={WHITE} />
      <text x="58" y="66" fontSize="7" fill={MUTED}>You can cancel your subscription at anytime.</text>

      {/* Item 2 (折叠) */}
      <rect x="28" y="86" width="184" height="26" rx="5" fill={WHITE} stroke={LINE} />
      <circle cx="42" cy="99" r="3" fill={LINE} />
      <text x="52" y="102" fontSize="8.5" fill={INK2}>Can I invite my team?</text>
      <path d="M196 97 l-4 4 l-4 -4" stroke={MUTED} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  ),

  collapsible: (
    <g>
      <rect x="28" y="34" width="184" height="76" rx="6" fill={SOFT} />
      <rect x="36" y="42" width="168" height="22" rx="4" fill={WHITE} stroke={LINE} />
      <path d="M46 53 l4 4 l-4 4" stroke={INK} strokeWidth="1.6" fill="none" />
      <text x="58" y="56" fontSize="8.5" fontWeight="600" fill={INK}>Advanced Configuration</text>
      {/* 展开的选项内容 */}
      <rect x="46" y="70" width="150" height="8" rx="2" fill={LINE} />
      <rect x="46" y="82" width="120" height="8" rx="2" fill={LINE} />
      <rect x="46" y="94" width="80" height="8" rx="2" fill={LINE} />
    </g>
  ),

  modal: (
    <g>
      {/* 半透明遮罩 */}
      <rect x="14" y="26" width="212" height="96" fill="#1A1917" fillOpacity="0.3" />
      {/* 悬浮弹窗卡片 */}
      <rect x="44" y="38" width="152" height="72" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="58" y="54" fontSize="9" fontWeight="600" fill={INK}>Confirm Publishing</text>
      <path d="M182 46 l6 6 M188 46 l-6 6" stroke={MUTED} strokeWidth="1.4" />
      <rect x="58" y="62" width="124" height="12" rx="2" fill={SOFT} />
      {/* 操作按钮 */}
      <rect x="108" y="82" width="38" height="18" rx="3" fill={SOFT} />
      <text x="127" y="94" fontSize="7.5" fill={INK2} textAnchor="middle">Cancel</text>
      <rect x="152" y="82" width="36" height="18" rx="3" fill={BLUE} />
      <text x="170" y="94" fontSize="7.5" fontWeight="600" fill={WHITE} textAnchor="middle">Publish</text>
    </g>
  ),

  'bottom-sheet': (
    <g>
      <rect x="28" y="32" width="184" height="42" rx="4" fill={SOFT} />
      {/* 从底部滑起的 Sheet */}
      <rect x="36" y="56" width="168" height="58" rx="8" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      {/* 顶部 Drag Handle */}
      <rect x="106" y="62" width="28" height="3" rx="1.5" fill={MUTED} />
      <text x="50" y="78" fontSize="8.5" fontWeight="600" fill={INK}>Select Export Format</text>
      <rect x="50" y="86" width="140" height="10" rx="2" fill={SOFT} />
      <rect x="50" y="99" width="100" height="10" rx="2" fill={SOFT} />
    </g>
  ),

  drawer: (
    <g>
      <rect x="28" y="32" width="184" height="80" rx="5" fill={SOFT} />
      {/* 右侧滑出抽屉 */}
      <rect x="110" y="32" width="102" height="80" rx="0" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <rect x="120" y="44" width="50" height="8" rx="2" fill={INK} />
      <path d="M198 42 l6 6 M204 42 l-6 6" stroke={MUTED} strokeWidth="1.4" />
      <rect x="120" y="60" width="80" height="16" rx="3" fill={SOFT} />
      <rect x="120" y="82" width="80" height="20" rx="3" fill={BLUE_BG} />
    </g>
  ),

  popover: (
    <g>
      <rect x="40" y="38" width="64" height="24" rx="4" fill={SOFT} stroke={LINE} />
      <text x="72" y="53" fontSize="8" fill={INK2} textAnchor="middle">Filter By ▾</text>
      {/* 浮动气泡 */}
      <rect x="40" y="68" width="112" height="44" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <path d="M68 68 l4 -4 l4 4 z" fill={WHITE} />
      <text x="52" y="82" fontSize="7.5" fontWeight="600" fill={INK}>Recent Updates</text>
      <text x="52" y="94" fontSize="7.5" fill={MUTED}>Most Popular</text>
      <text x="52" y="105" fontSize="7.5" fill={MUTED}>Alphabetical</text>
    </g>
  ),

  tooltip: (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      <circle cx="80" cy="74" r="14" fill={WHITE} stroke={LINE} />
      <path d="M76 74 h8 M80 70 v8" stroke={INK} strokeWidth="1.6" />
      {/* Tooltip 气泡 */}
      <rect x="94" y="58" width="82" height="24" rx="4" fill={INK} filter="url(#mini-shadow)" />
      <path d="M94 70 l-4 -3 l4 -3 z" fill={INK} />
      <text x="135" y="73" fontSize="7.5" fontWeight="500" fill={WHITE} textAnchor="middle">Create new item (⌘N)</text>
    </g>
  ),

  /* ==========================================================================
     4. Data Display (7 个)
     ========================================================================== */
  list: (
    <g>
      {[
        { t: 'Project Alpha', s: 'Active', c: GREEN },
        { t: 'Design System', s: 'Review', c: BLUE },
        { t: 'Mobile Redesign', s: 'Paused', c: MUTED },
      ].map((item, i) => {
        const y = 36 + i * 26;
        return (
          <g key={i}>
            <rect x="28" y={y} width="184" height="22" rx="4" fill={WHITE} stroke={LINE} />
            <circle cx="40" cy={y + 11} r="4" fill={item.c} />
            <text x="50" y={y + 14} fontSize="8" fontWeight="500" fill={INK}>{item.t}</text>
            <rect x="168" y={y + 5} width="36" height="12" rx="3" fill={SOFT} />
            <text x="186" y={y + 14} fontSize="7" fill={INK2} textAnchor="middle">{item.s}</text>
          </g>
        );
      })}
    </g>
  ),

  table: (
    <g>
      <rect x="26" y="34" width="188" height="76" rx="5" fill={WHITE} stroke={LINE} />
      {/* 表头 */}
      <rect x="26" y="34" width="188" height="18" rx="0" fill={SOFT} />
      <text x="36" y="46" fontSize="7.5" fontWeight="600" fill={MUTED}>USER</text>
      <text x="96" y="46" fontSize="7.5" fontWeight="600" fill={MUTED}>STATUS</text>
      <text x="164" y="46" fontSize="7.5" fontWeight="600" fill={MUTED}>ROLE</text>
      {/* 行 1 */}
      <circle cx="42" cy="62" r="5" fill={BLUE_BG} />
      <text x="52" y="65" fontSize="7.5" fill={INK}>Alice.dev</text>
      <rect x="94" y="56" width="34" height="12" rx="6" fill={GREEN_BG} />
      <text x="111" y="65" fontSize="7" fontWeight="600" fill={GREEN} textAnchor="middle">Online</text>
      <text x="164" y="65" fontSize="7.5" fill={INK2}>Admin</text>
      <line x1="26" y1="74" x2="214" y2="74" stroke={LINE} />
      {/* 行 2 */}
      <circle cx="42" cy="88" r="5" fill={AMBER_BG} />
      <text x="52" y="91" fontSize="7.5" fill={INK}>Bob.tech</text>
      <rect x="94" y="82" width="34" height="12" rx="6" fill={SOFT} />
      <text x="111" y="91" fontSize="7" fill={MUTED} textAnchor="middle">Offline</text>
      <text x="164" y="91" fontSize="7.5" fill={INK2}>Editor</text>
    </g>
  ),

  badge: (
    <g>
      {/* 各种生动微徽标 */}
      <rect x="36" y="44" width="46" height="36" rx="6" fill={SOFT} />
      <circle cx="59" cy="62" r="9" fill={WHITE} stroke={LINE} />
      <circle cx="68" cy="53" r="4" fill={RED} />
      <text x="59" y="94" fontSize="7.5" fill={MUTED} textAnchor="middle">Dot</text>

      <rect x="98" y="44" width="46" height="36" rx="6" fill={SOFT} />
      <circle cx="121" cy="62" r="9" fill={WHITE} stroke={LINE} />
      <rect x="125" y="48" width="14" height="9" rx="4.5" fill={RED} />
      <text x="132" y="55" fontSize="6.5" fontWeight="700" fill={WHITE} textAnchor="middle">9+</text>
      <text x="121" y="94" fontSize="7.5" fill={MUTED} textAnchor="middle">Count</text>

      <rect x="160" y="44" width="46" height="36" rx="6" fill={GREEN_BG} />
      <rect x="168" y="56" width="30" height="12" rx="6" fill={GREEN} />
      <text x="183" y="65" fontSize="6.5" fontWeight="600" fill={WHITE} textAnchor="middle">PRO</text>
      <text x="183" y="94" fontSize="7.5" fill={GREEN} textAnchor="middle">Status</text>
    </g>
  ),

  'chip-display': (
    <g>
      <rect x="28" y="36" width="184" height="74" rx="6" fill={SOFT} />
      <text x="38" y="52" fontSize="8" fontWeight="600" fill={MUTED}>TECH STACK</text>
      {/* Chip 胶囊阵列 */}
      <rect x="38" y="62" width="48" height="18" rx="9" fill={WHITE} stroke={LINE} />
      <text x="62" y="74" fontSize="7.5" fill={INK} textAnchor="middle">Next.js</text>
      <rect x="92" y="62" width="56" height="18" rx="9" fill={WHITE} stroke={LINE} />
      <text x="120" y="74" fontSize="7.5" fill={INK} textAnchor="middle">TypeScript</text>
      <rect x="154" y="62" width="50" height="18" rx="9" fill={BLUE_BG} stroke="#BFDBFE" />
      <text x="179" y="74" fontSize="7.5" fontWeight="600" fill={BLUE} textAnchor="middle">Tailwind</text>
    </g>
  ),

  'stat-card': (
    <g>
      <rect x="32" y="34" width="82" height="76" rx="6" fill={WHITE} stroke={LINE} />
      <text x="42" y="48" fontSize="7.5" fill={MUTED}>Revenue</text>
      <text x="42" y="66" fontSize="13" fontWeight="700" fill={INK}>$14.2k</text>
      <rect x="42" y="74" width="38" height="12" rx="3" fill={GREEN_BG} />
      <text x="61" y="83" fontSize="7" fontWeight="600" fill={GREEN} textAnchor="middle">+28.4%</text>

      <rect x="126" y="34" width="82" height="76" rx="6" fill={WHITE} stroke={LINE} />
      <text x="136" y="48" fontSize="7.5" fill={MUTED}>Active Users</text>
      <text x="136" y="66" fontSize="13" fontWeight="700" fill={INK}>3,420</text>
      {/* 迷你折线图 */}
      <path d="M136 94 l12 -8 l14 4 l16 -12" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  ),

  avatar: (
    <g>
      <rect x="28" y="34" width="184" height="76" rx="6" fill={SOFT} />
      {/* 单个头像带在线状态 */}
      <circle cx="58" cy="68" r="16" fill={BLUE_BG} stroke={WHITE} strokeWidth="2" />
      <text x="58" y="72" fontSize="10" fontWeight="600" fill={BLUE} textAnchor="middle">JD</text>
      <circle cx="70" cy="78" r="4" fill={GREEN} stroke={WHITE} strokeWidth="1.5" />
      {/* 头像堆叠组 Avatar Group */}
      <circle cx="120" cy="68" r="14" fill="#FCE7F3" stroke={WHITE} strokeWidth="2" />
      <circle cx="138" cy="68" r="14" fill="#FEF3C7" stroke={WHITE} strokeWidth="2" />
      <circle cx="156" cy="68" r="14" fill="#E0E7FF" stroke={WHITE} strokeWidth="2" />
      <circle cx="174" cy="68" r="14" fill={INK} stroke={WHITE} strokeWidth="2" />
      <text x="174" y="72" fontSize="7.5" fontWeight="600" fill={WHITE} textAnchor="middle">+5</text>
    </g>
  ),

  timeline: (
    <g>
      <line x1="56" y1="38" x2="56" y2="104" stroke={LINE} strokeWidth="2" />
      {/* 事件 1 */}
      <circle cx="56" cy="46" r="6" fill={GREEN} />
      <path d="M54 46 l1.5 1.5 l3 -3" stroke={WHITE} strokeWidth="1.2" fill="none" />
      <rect x="70" y="39" width="130" height="18" rx="3" fill={WHITE} stroke={LINE} />
      <text x="76" y="51" fontSize="7.5" fontWeight="600" fill={INK}>Version 1.0 Released</text>

      {/* 事件 2 */}
      <circle cx="56" cy="74" r="5" fill={BLUE} />
      <rect x="70" y="67" width="130" height="18" rx="3" fill={WHITE} stroke={LINE} />
      <text x="76" y="79" fontSize="7.5" fill={INK2}>Custom Domain Bound</text>

      {/* 事件 3 */}
      <circle cx="56" cy="98" r="4" fill={MUTED} />
      <text x="76" y="101" fontSize="7.5" fill={MUTED}>Initial Repo Commit</text>
    </g>
  ),

  /* ==========================================================================
     5. Feedback & States (12 个)
     ========================================================================== */
  toast: (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      {/* 悬浮 Toast 胶囊 */}
      <rect x="44" y="54" width="152" height="32" rx="6" fill={INK} filter="url(#mini-shadow)" />
      <circle cx="62" cy="70" r="7" fill={GREEN} />
      <path d="M59 70 l2 2 l4 -4" stroke={WHITE} strokeWidth="1.4" fill="none" />
      <text x="76" y="73" fontSize="8.5" fontWeight="600" fill={WHITE}>Saved to Cloud</text>
      <text x="180" y="73" fontSize="7.5" fill={MUTED} textAnchor="end">Undo</text>
    </g>
  ),

  snackbar: (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      {/* 底部浮动 Snackbar */}
      <rect x="36" y="80" width="168" height="26" rx="4" fill="#262522" filter="url(#mini-shadow)" />
      <text x="48" y="96" fontSize="7.5" fill={WHITE}>File moved to trash</text>
      <text x="188" y="96" fontSize="7.5" fontWeight="600" fill="#60A5FA" textAnchor="end">UNDO</text>
    </g>
  ),

  alert: (
    <g>
      {/* 成功 Alert */}
      <rect x="28" y="34" width="184" height="32" rx="5" fill={GREEN_BG} stroke="#A7F3D0" />
      <circle cx="44" cy="50" r="6" fill={GREEN} />
      <path d="M42 50 l1.5 1.5 l3 -3" stroke={WHITE} strokeWidth="1.2" fill="none" />
      <text x="56" y="47" fontSize="8" fontWeight="600" fill="#065F46">Deployment Successful</text>
      <text x="56" y="58" fontSize="7" fill="#047857">Your site is live on Cloudflare.</text>

      {/* 警告 Alert */}
      <rect x="28" y="74" width="184" height="32" rx="5" fill={AMBER_BG} stroke="#FDE68A" />
      <circle cx="44" cy="90" r="6" fill={AMBER} />
      <text x="44" y="93" fontSize="8" fontWeight="700" fill={WHITE} textAnchor="middle">!</text>
      <text x="56" y="87" fontSize="8" fontWeight="600" fill="#92400E">Storage Almost Full</text>
      <text x="56" y="98" fontSize="7" fill="#B45309">You have used 85% of your quota.</text>
    </g>
  ),

  banner: (
    <g>
      {/* 全屏通栏 Banner */}
      <rect x="14" y="27" width="212" height="26" fill={BLUE} />
      <text x="110" y="43" fontSize="8" fontWeight="600" fill={WHITE} textAnchor="middle">🎉 2026 Spring Design Tokens Released</text>
      <rect x="180" y="32" width="36" height="16" rx="3" fill={WHITE} />
      <text x="198" y="43" fontSize="7" fontWeight="600" fill={BLUE} textAnchor="middle">Read →</text>
      {/* 下方正文示意 */}
      <rect x="28" y="64" width="120" height="8" rx="2" fill={LINE} />
      <rect x="28" y="78" width="184" height="28" rx="4" fill={SOFT} />
    </g>
  ),

  'progress-bar': (
    <g>
      <rect x="28" y="36" width="184" height="74" rx="6" fill={SOFT} />
      <text x="40" y="56" fontSize="8.5" fontWeight="600" fill={INK}>Uploading Assets...</text>
      <text x="200" y="56" fontSize="8" fontWeight="600" fill={BLUE} textAnchor="end">72%</text>
      {/* 进度条槽与指示器 */}
      <rect x="40" y="66" width="160" height="8" rx="4" fill={LINE} />
      <rect x="40" y="66" width="115" height="8" rx="4" fill={BLUE} />
      <text x="40" y="88" fontSize="7" fill={MUTED}>3.2 MB of 4.5 MB uploaded</text>
    </g>
  ),

  spinner: (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      {/* 旋转 Spinner 轮廓 */}
      <circle cx="120" cy="64" r="14" fill="none" stroke={LINE} strokeWidth="3" />
      <path d="M120 50 A 14 14 0 0 1 134 64" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      <text x="120" y="94" fontSize="8" fontWeight="500" fill={INK2} textAnchor="middle">Synchronizing data...</text>
    </g>
  ),

  skeleton: (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={WHITE} stroke={LINE} />
      {/* 骨架屏占位块 */}
      <circle cx="48" cy="54" r="12" fill={SOFT} />
      <rect x="70" y="46" width="80" height="8" rx="3" fill={SOFT} />
      <rect x="70" y="58" width="110" height="6" rx="2" fill="#F0EDE6" />
      <rect x="40" y="78" width="160" height="10" rx="3" fill={SOFT} />
      <rect x="40" y="93" width="120" height="10" rx="3" fill="#F0EDE6" />
    </g>
  ),

  'empty-state': (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      {/* 空状态图标与文案 */}
      <circle cx="120" cy="54" r="14" fill={WHITE} stroke={LINE} />
      <path d="M115 54 h10 M120 49 v10" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
      <text x="120" y="78" fontSize="8.5" fontWeight="600" fill={INK} textAnchor="middle">No Collections Yet</text>
      <text x="120" y="88" fontSize="7" fill={MUTED} textAnchor="middle">Create your first pattern to begin.</text>
      <rect x="96" y="94" width="48" height="14" rx="3" fill={INK} />
      <text x="120" y="104" fontSize="7" fontWeight="500" fill={WHITE} textAnchor="middle">+ New</text>
    </g>
  ),

  'error-state': (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={RED_BG} stroke="#FECACA" />
      <circle cx="120" cy="52" r="12" fill={RED} />
      <text x="120" y="57" fontSize="11" fontWeight="700" fill={WHITE} textAnchor="middle">✕</text>
      <text x="120" y="76" fontSize="8.5" fontWeight="600" fill={RED} textAnchor="middle">Failed to Load Data</text>
      <text x="120" y="86" fontSize="7" fill="#7F1D1D" textAnchor="middle">Please check your network and retry.</text>
      <rect x="94" y="92" width="52" height="14" rx="3" fill={WHITE} stroke="#FECACA" />
      <text x="120" y="102" fontSize="7" fontWeight="600" fill={RED} textAnchor="middle">Retry ↻</text>
    </g>
  ),

  'success-state': (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={GREEN_BG} stroke="#A7F3D0" />
      <circle cx="120" cy="52" r="12" fill={GREEN} />
      <path d="M116 52 l3 3 l6 -6" stroke={WHITE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <text x="120" y="76" fontSize="9" fontWeight="600" fill={GREEN} textAnchor="middle">Order Completed!</text>
      <text x="120" y="86" fontSize="7" fill="#047857" textAnchor="middle">Receipt sent to your inbox.</text>
      <rect x="96" y="92" width="48" height="14" rx="3" fill={GREEN} />
      <text x="120" y="102" fontSize="7" fontWeight="600" fill={WHITE} textAnchor="middle">Done</text>
    </g>
  ),

  'modal-stateful': (
    <g>
      <rect x="14" y="26" width="212" height="96" fill="#1A1917" fillOpacity="0.25" />
      <rect x="38" y="36" width="164" height="76" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      {/* 多步骤表单对话框 */}
      <text x="50" y="50" fontSize="8.5" fontWeight="600" fill={INK}>Step 2 of 3: Permissions</text>
      <rect x="50" y="56" width="140" height="4" rx="2" fill={LINE} />
      <rect x="50" y="56" width="94" height="4" rx="2" fill={BLUE} />
      <rect x="50" y="68" width="140" height="18" rx="3" fill={SOFT} />
      <circle cx="62" cy="77" r="4" fill={GREEN} />
      <text x="72" y="80" fontSize="7.5" fill={INK2}>Full Read/Write Access</text>
      <rect x="144" y="92" width="46" height="16" rx="3" fill={INK} />
      <text x="167" y="103" fontSize="7.5" fontWeight="600" fill={WHITE} textAnchor="middle">Next →</text>
    </g>
  ),

  'load-more': (
    <g>
      <rect x="28" y="32" width="184" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="40" y="42" width="90" height="6" rx="2" fill={LINE} />
      <rect x="28" y="60" width="184" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="40" y="70" width="110" height="6" rx="2" fill={LINE} />
      {/* 加载更多按钮 */}
      <rect x="80" y="90" width="80" height="20" rx="10" fill={SOFT} stroke={LINE} />
      <text x="120" y="103" fontSize="7.5" fontWeight="600" fill={INK2} textAnchor="middle">Load 12 More ↓</text>
    </g>
  ),

  /* ==========================================================================
     6. Input (13 个)
     ========================================================================== */
  'segmented-control': (
    <g>
      <rect x="28" y="46" width="184" height="40" rx="8" fill={SOFT} />
      {/* 分段药丸切换器 */}
      <rect x="32" y="50" width="58" height="32" rx="6" fill={WHITE} filter="url(#mini-shadow)" />
      <text x="61" y="70" fontSize="9" fontWeight="600" fill={INK} textAnchor="middle">Daily</text>
      <text x="120" y="70" fontSize="8.5" fill={MUTED} textAnchor="middle">Weekly</text>
      <text x="178" y="70" fontSize="8.5" fill={MUTED} textAnchor="middle">Monthly</text>
    </g>
  ),

  'stepper-input': (
    <g>
      <rect x="28" y="36" width="184" height="74" rx="6" fill={SOFT} />
      <text x="62" y="54" fontSize="8" fontWeight="600" fill={MUTED}>QUANTITY</text>
      {/* 计数输入器 */}
      <rect x="62" y="62" width="116" height="32" rx="6" fill={WHITE} stroke={LINE} />
      <rect x="62" y="62" width="32" height="32" rx="0" fill={SOFT} />
      <text x="78" y="82" fontSize="12" fontWeight="600" fill={INK} textAnchor="middle">−</text>
      <text x="120" y="82" fontSize="11" fontWeight="700" fill={INK} textAnchor="middle">3</text>
      <rect x="146" y="62" width="32" height="32" rx="0" fill={SOFT} />
      <text x="162" y="82" fontSize="12" fontWeight="600" fill={INK} textAnchor="middle">+</text>
    </g>
  ),

  'text-field': (
    <g>
      <text x="36" y="46" fontSize="8" fontWeight="600" fill={INK2}>Email Address</text>
      {/* 聚焦输入框 */}
      <rect x="36" y="52" width="168" height="32" rx="5" fill={WHITE} stroke={BLUE} strokeWidth="1.6" />
      <text x="46" y="72" fontSize="8.5" fill={INK}>alex.designer@lutive.com</text>
      <line x1="158" y1="62" x2="158" y2="76" stroke={BLUE} strokeWidth="1.5" />
      <text x="36" y="96" fontSize="7" fill={MUTED}>We'll never share your email.</text>
    </g>
  ),

  'text-area': (
    <g>
      <text x="36" y="44" fontSize="8" fontWeight="600" fill={INK2}>Project Description</text>
      <rect x="36" y="50" width="168" height="46" rx="5" fill={WHITE} stroke={LINE} />
      <text x="46" y="64" fontSize="8" fill={INK2}>Building a high quality UI field guide...</text>
      <rect x="46" y="72" width="110" height="4" rx="2" fill={LINE} />
      <text x="194" y="104" fontSize="6.5" fill={MUTED} textAnchor="end">42 / 200</text>
    </g>
  ),

  'search-field': (
    <g>
      {/* 搜索输入胶囊 */}
      <rect x="28" y="50" width="184" height="34" rx="17" fill={SOFT} stroke={LINE} />
      <circle cx="46" cy="67" r="5" fill="none" stroke={MUTED} strokeWidth="1.6" />
      <path d="M50 71 l3.5 3.5" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
      <text x="60" y="70" fontSize="8.5" fill={MUTED}>Search patterns, tags, components...</text>
      <rect x="182" y="58" width="22" height="18" rx="4" fill={WHITE} stroke={LINE} />
      <text x="193" y="70" fontSize="7.5" fontWeight="600" fill={INK2} textAnchor="middle">⌘K</text>
    </g>
  ),

  checkbox: (
    <g>
      {/* 选中态 */}
      <rect x="42" y="44" width="18" height="18" rx="4" fill={BLUE} />
      <path d="M46 53 l3 3 l6 -6" stroke={WHITE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="68" y="56" fontSize="8.5" fontWeight="600" fill={INK}>Enable push notifications</text>

      {/* 未选中态 */}
      <rect x="42" y="72" width="18" height="18" rx="4" fill={WHITE} stroke={LINE} />
      <text x="68" y="84" fontSize="8.5" fill={INK2}>Weekly digest email</text>
    </g>
  ),

  radio: (
    <g>
      {/* 选中态 */}
      <circle cx="50" cy="52" r="9" fill={WHITE} stroke={BLUE} strokeWidth="2" />
      <circle cx="50" cy="52" r="4.5" fill={BLUE} />
      <text x="68" y="55" fontSize="8.5" fontWeight="600" fill={INK}>Standard Shipping (Free)</text>

      {/* 未选中态 */}
      <circle cx="50" cy="80" r="9" fill={WHITE} stroke={LINE} strokeWidth="1.5" />
      <text x="68" y="83" fontSize="8.5" fill={INK2}>Express Courier ($12.00)</text>
    </g>
  ),

  switch: (
    <g>
      {/* 开关 ON */}
      <rect x="40" y="44" width="40" height="22" rx="11" fill={GREEN} />
      <circle cx="69" cy="55" r="8" fill={WHITE} filter="url(#mini-shadow)" />
      <text x="92" y="58" fontSize="8.5" fontWeight="600" fill={INK}>Dark Mode Active</text>

      {/* 开关 OFF */}
      <rect x="40" y="74" width="40" height="22" rx="11" fill={LINE} />
      <circle cx="51" cy="85" r="8" fill={WHITE} filter="url(#mini-shadow)" />
      <text x="92" y="88" fontSize="8.5" fill={MUTED}>Sound Effects</text>
    </g>
  ),

  slider: (
    <g>
      <text x="36" y="50" fontSize="8" fontWeight="600" fill={INK2}>Volume Level</text>
      <text x="204" y="50" fontSize="8" fontWeight="600" fill={BLUE} textAnchor="end">65%</text>
      {/* 滑轨与高亮槽 */}
      <rect x="36" y="66" width="168" height="6" rx="3" fill={LINE} />
      <rect x="36" y="66" width="110" height="6" rx="3" fill={BLUE} />
      {/* 物理滑块 */}
      <circle cx="146" cy="69" r="9" fill={WHITE} stroke={BLUE} strokeWidth="2" filter="url(#mini-shadow)" />
    </g>
  ),

  select: (
    <g>
      <text x="36" y="44" fontSize="8" fontWeight="600" fill={INK2}>Deployment Region</text>
      <rect x="36" y="50" width="168" height="30" rx="5" fill={WHITE} stroke={LINE} />
      <circle cx="48" cy="65" r="4" fill={GREEN} />
      <text x="58" y="68" fontSize="8.5" fill={INK}>us-east-1 (N. Virginia)</text>
      <path d="M190 63 l4 4 l4 -4" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 展开列表提示 */}
      <rect x="36" y="84" width="168" height="24" rx="4" fill={SOFT} stroke={LINE} />
      <text x="58" y="99" fontSize="7.5" fill={MUTED}>ap-northeast-1 (Tokyo)</text>
    </g>
  ),

  chip: (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      {/* 可交互 Chip 胶囊 */}
      <rect x="38" y="48" width="60" height="22" rx="11" fill={INK} />
      <text x="68" y="62" fontSize="8" fontWeight="600" fill={WHITE} textAnchor="middle">All Items</text>

      <rect x="104" y="48" width="56" height="22" rx="11" fill={WHITE} stroke={LINE} />
      <text x="132" y="62" fontSize="8" fill={INK2} textAnchor="middle">Featured</text>

      <rect x="166" y="48" width="40" height="22" rx="11" fill={WHITE} stroke={LINE} />
      <text x="186" y="62" fontSize="8" fill={INK2} textAnchor="middle">New</text>

      <rect x="38" y="78" width="76" height="22" rx="11" fill={BLUE_BG} stroke="#BFDBFE" />
      <text x="76" y="92" fontSize="8" fontWeight="600" fill={BLUE} textAnchor="middle">Selected ✕</text>
    </g>
  ),

  'date-picker': (
    <g>
      <rect x="36" y="32" width="168" height="82" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="50" y="46" fontSize="8.5" fontWeight="700" fill={INK}>October 2026</text>
      <path d="M182 42 l-3 -3 M192 39 l3 3" stroke={MUTED} strokeWidth="1.4" />
      {/* 迷你日历网格 */}
      {[0, 1, 2, 3, 4, 5, 6].map((col) => {
        const x = 50 + col * 20;
        return (
          <g key={col}>
            <circle cx={x} cy="60" r="4.5" fill={col < 2 ? SOFT : WHITE} />
            <circle cx={x} cy="76" r="6.5" fill={col === 3 ? BLUE : WHITE} stroke={col === 3 ? BLUE : 'none'} />
            <text x={x} y="79" fontSize="6.5" fontWeight={col === 3 ? '700' : '400'} fill={col === 3 ? WHITE : INK2} textAnchor="middle">
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
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="120" cy="56" r="12" fill={WHITE} stroke={LINE} />
      <path d="M120 62 v-11 M116 55 l4 -4 l4 4" stroke={BLUE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <text x="120" y="78" fontSize="8.5" fontWeight="600" fill={INK} textAnchor="middle">Drop assets here, or browse</text>
      <text x="120" y="88" fontSize="7" fill={MUTED} textAnchor="middle">Supports PNG, SVG, JSON up to 25MB</text>
    </g>
  ),

  /* ==========================================================================
     7. Interaction & Advanced Patterns (9 个)
     ========================================================================== */
  'swipe-action': (
    <g>
      {/* 底层划开操作按钮 */}
      <rect x="148" y="48" width="34" height="34" fill={BLUE} />
      <text x="165" y="68" fontSize="8" fontWeight="600" fill={WHITE} textAnchor="middle">Pin</text>
      <rect x="182" y="48" width="30" height="34" fill={RED} />
      <text x="197" y="68" fontSize="8" fontWeight="600" fill={WHITE} textAnchor="middle">Del</text>
      {/* 滑动的上层卡片 */}
      <g transform="translate(-40 0)">
        <rect x="36" y="48" width="176" height="34" rx="4" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
        <circle cx="52" cy="65" r="7" fill={SOFT} />
        <text x="66" y="68" fontSize="8.5" fontWeight="600" fill={INK}>Swipe left to reveal actions</text>
      </g>
      <text x="120" y="104" fontSize="7.5" fill={MUTED} textAnchor="middle">← Drag horizontally to trigger</text>
    </g>
  ),

  'pull-to-refresh': (
    <g>
      {/* 顶部下拉圆环箭头 */}
      <circle cx="120" cy="46" r="10" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <path d="M120 40 a6 6 0 1 1 -5 2.5" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M115 40 l0 3.5 l3.5 0" stroke={BLUE} strokeWidth="1.5" fill="none" />
      <text x="120" y="66" fontSize="7.5" fill={MUTED} textAnchor="middle">Pull down to refresh...</text>
      {/* 内容列表 */}
      <rect x="36" y="74" width="168" height="18" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="46" y="81" width="80" height="5" rx="1.5" fill={LINE} />
      <rect x="36" y="96" width="168" height="18" rx="4" fill={WHITE} stroke={LINE} />
    </g>
  ),

  'infinite-scroll': (
    <g>
      <rect x="36" y="32" width="168" height="22" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="48" y="41" width="70" height="5" rx="1.5" fill={LINE} />
      <rect x="36" y="58" width="168" height="22" rx="4" fill={WHITE} stroke={LINE} />
      <rect x="48" y="67" width="90" height="5" rx="1.5" fill={LINE} />
      {/* 底部加载更多指示 */}
      <circle cx="112" cy="95" r="5" fill="none" stroke={BLUE} strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="124" y="98" fontSize="7.5" fill={MUTED}>Fetching more records...</text>
    </g>
  ),

  'drag-and-drop': (
    <g>
      {/* 看板列 1 */}
      <rect x="28" y="32" width="88" height="82" rx="5" fill={SOFT} stroke={LINE} />
      <text x="36" y="45" fontSize="7.5" fontWeight="600" fill={MUTED}>TO DO (2)</text>
      <rect x="34" y="52" width="76" height="24" rx="4" fill={WHITE} stroke={LINE} />
      <text x="42" y="66" fontSize="7.5" fill={INK}>Design Tokens</text>
      {/* 拖拽中的卡片 */}
      <rect x="34" y="80" width="76" height="24" rx="4" fill={WHITE} stroke={BLUE} strokeWidth="1.5" filter="url(#mini-shadow)" />
      <text x="42" y="94" fontSize="7.5" fontWeight="600" fill={BLUE}>Navigation v2 ⠿</text>

      {/* 看板列 2 */}
      <rect x="124" y="32" width="88" height="82" rx="5" fill={SOFT} stroke={LINE} strokeDasharray="3 3" />
      <text x="132" y="45" fontSize="7.5" fontWeight="600" fill={MUTED}>IN PROGRESS</text>
    </g>
  ),

  'long-press': (
    <g>
      <rect x="32" y="34" width="90" height="76" rx="6" fill={WHITE} stroke={LINE} />
      <circle cx="77" cy="62" r="16" fill={BLUE_BG} />
      <text x="77" y="66" fontSize="9" fontWeight="700" fill={BLUE} textAnchor="middle">Hold</text>
      <text x="77" y="92" fontSize="7" fill={MUTED} textAnchor="middle">Long press 500ms</text>
      {/* 弹出的快捷微菜单 */}
      <rect x="130" y="44" width="78" height="54" rx="5" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="142" y="58" fontSize="7.5" fontWeight="600" fill={INK}>Share Item</text>
      <text x="142" y="72" fontSize="7.5" fill={INK2}>Duplicate</text>
      <line x1="130" y1="78" x2="208" y2="78" stroke={LINE} />
      <text x="142" y="90" fontSize="7.5" fontWeight="600" fill={RED}>Delete</text>
    </g>
  ),

  'context-menu': (
    <g>
      <rect x="28" y="32" width="184" height="80" rx="6" fill={SOFT} />
      <circle cx="68" cy="60" r="14" fill={WHITE} stroke={LINE} />
      <text x="68" y="64" fontSize="8" fill={MUTED} textAnchor="middle">File</text>
      {/* 右键浮起菜单 */}
      <rect x="92" y="42" width="108" height="64" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="104" y="56" fontSize="8" fill={INK}>Inspect Element</text>
      <text x="104" y="70" fontSize="8" fill={INK}>Copy Selector</text>
      <line x1="92" y1="76" x2="200" y2="76" stroke={LINE} />
      <text x="104" y="88" fontSize="8" fill={BLUE}>Copy AI Prompt</text>
      <text x="104" y="100" fontSize="8" fill={RED}>Delete Component</text>
    </g>
  ),

  'progressive-disclosure': (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={WHITE} stroke={LINE} />
      <text x="40" y="50" fontSize="8.5" fontWeight="600" fill={INK}>Basic Settings</text>
      <rect x="40" y="58" width="160" height="6" rx="2" fill={LINE} />
      {/* 渐进披露触发开关 */}
      <text x="40" y="78" fontSize="8" fontWeight="600" fill={BLUE}>Show Advanced Options ▾</text>
      <rect x="40" y="86" width="160" height="18" rx="3" fill={SOFT} stroke={LINE} />
      <text x="48" y="98" fontSize="7" fill={MUTED}>API Key, Webhook URL, Timeout limits...</text>
    </g>
  ),

  'optimistic-ui': (
    <g>
      <rect x="28" y="34" width="184" height="78" rx="6" fill={SOFT} />
      {/* 乐观更新卡片 */}
      <rect x="40" y="46" width="160" height="40" rx="6" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <path d="M52 66 c-3 -4 -7 -1 -7 2 c0 4 7 9 7 9 c0 0 7 -5 7 -9 c0 -3 -4 -6 -7 -2 z" fill={RED} />
      <text x="64" y="66" fontSize="8.5" fontWeight="600" fill={INK}>Favorited instantly</text>
      <circle cx="178" cy="66" r="4" fill="none" stroke={MUTED} strokeWidth="1.2" strokeDasharray="4 2" />
      <text x="120" y="100" fontSize="7" fill={MUTED} textAnchor="middle">UI updates before server ACK</text>
    </g>
  ),

  'inline-validation': (
    <g>
      <text x="36" y="44" fontSize="8" fontWeight="600" fill={INK2}>Choose Username</text>
      {/* 实时校验红框与提示 */}
      <rect x="36" y="50" width="168" height="28" rx="5" fill={WHITE} stroke={RED} strokeWidth="1.5" />
      <text x="46" y="68" fontSize="8.5" fill={INK}>admin_root</text>
      <circle cx="190" cy="64" r="5" fill={RED} />
      <text x="190" y="67" fontSize="7" fontWeight="700" fill={WHITE} textAnchor="middle">✕</text>
      {/* 错误提示文字 */}
      <text x="36" y="90" fontSize="7.5" fontWeight="500" fill={RED}>Username is already taken by another account.</text>
      <text x="36" y="102" fontSize="7" fill={GREEN}>✓ Suggestion: admin_root_2026</text>
    </g>
  ),

  'action-sheet': (
    <g>
      <rect x="28" y="30" width="184" height="84" rx="6" fill="#EDE9DF" opacity="0.6" />
      {/* iOS Action Sheet: 上部功能卡片 + 底部物理脱离取消岛 */}
      <rect x="52" y="38" width="136" height="46" rx="8" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="120" y="53" fontSize="8" fontWeight="500" fill={BLUE} textAnchor="middle">Share Photo</text>
      <line x1="52" y1="61" x2="188" y2="61" stroke={LINE} strokeWidth="0.8" />
      <text x="120" y="75" fontSize="8" fontWeight="600" fill={RED} textAnchor="middle">Delete Permanently</text>
      {/* 独立取消岛 */}
      <rect x="52" y="88" width="136" height="22" rx="8" fill={WHITE} stroke={LINE} filter="url(#mini-shadow)" />
      <text x="120" y="102" fontSize="8.5" fontWeight="600" fill={INK} textAnchor="middle">Cancel</text>
    </g>
  ),

  'command-palette': (
    <g>
      {/* Linear 风格 ⌘K 居中浮窗 */}
      <rect x="34" y="34" width="172" height="78" rx="8" fill={WHITE} stroke={INK} strokeWidth="1.2" filter="url(#mini-shadow)" />
      {/* 顶部搜索栏 */}
      <text x="44" y="48" fontSize="8" fill={MUTED}>🔍</text>
      <text x="56" y="48" fontSize="8" fill={INK2}>Type a command...</text>
      <rect x="180" y="41" width="18" height="10" rx="2" fill={SOFT} stroke={LINE} />
      <text x="189" y="48" fontSize="6.5" fontWeight="600" fill={MUTED} textAnchor="middle">ESC</text>
      <line x1="34" y1="54" x2="206" y2="54" stroke={LINE} strokeWidth="0.8" />
      {/* 命令项目 1 */}
      <rect x="40" y="58" width="160" height="18" rx="4" fill={BLUE_BG} />
      <text x="48" y="70" fontSize="7.5" fontWeight="600" fill={BLUE}>Create New Issue</text>
      <rect x="176" y="62" width="18" height="10" rx="2" fill={WHITE} stroke={LINE} />
      <text x="185" y="69" fontSize="6.5" fontWeight="600" fill={BLUE} textAnchor="middle">⌘N</text>
      {/* 命令项目 2 */}
      <rect x="40" y="79" width="160" height="18" rx="4" fill={WHITE} />
      <text x="48" y="91" fontSize="7.5" fill={INK2}>Switch Project...</text>
      <rect x="176" y="83" width="18" height="10" rx="2" fill={SOFT} stroke={LINE} />
      <text x="185" y="90" fontSize="6.5" fontWeight="600" fill={MUTED} textAnchor="middle">↵</text>
    </g>
  ),

  'extended-fab': (
    <g>
      {/* 模拟页面列表项 */}
      <rect x="36" y="34" width="168" height="16" rx="4" fill={SOFT} />
      <rect x="36" y="54" width="168" height="16" rx="4" fill={SOFT} />
      <rect x="36" y="74" width="168" height="16" rx="4" fill={SOFT} />
      {/* 右下角 MD3 Extended FAB 展开胶囊 */}
      <rect x="120" y="78" width="84" height="28" rx="14" fill={INK} filter="url(#mini-shadow)" />
      <circle cx="134" cy="92" r="6" fill="#3A3832" />
      <path d="M131 92 h6 M134 89 v6" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" />
      <text x="145" y="95" fontSize="8" fontWeight="600" fill={WHITE}>Compose</text>
    </g>
  ),

  'service-card': (
    <g>
      {/* 鸿蒙 HarmonyOS 2x2 桌面万能服务卡片 */}
      <rect x="62" y="32" width="116" height="82" rx="16" fill="url(#mini-harmony-grad)" stroke="#D4E2F4" strokeWidth="1.2" filter="url(#mini-shadow)" />
      <defs>
        <linearGradient id="mini-harmony-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0F7FF" />
          <stop offset="100%" stopColor="#E2EEFC" />
        </linearGradient>
      </defs>
      {/* 头部微标识 */}
      <circle cx="76" cy="45" r="4.5" fill={BLUE} />
      <text x="85" y="48" fontSize="7" fontWeight="600" fill={INK2}>Weather</text>
      <circle cx="164" cy="45" r="2" fill={BLUE} opacity="0.6" />
      {/* 核心气温与天气图 */}
      <text x="76" y="74" fontSize="19" fontWeight="700" fill={INK}>26°</text>
      <circle cx="146" cy="64" r="8" fill="#F59E0B" />
      <path d="M140 70 q6 -5 14 0" stroke={WHITE} strokeWidth="1.5" fill="none" />
      {/* 底部微胶囊状态 */}
      <rect x="74" y="84" width="68" height="14" rx="7" fill={WHITE} opacity="0.9" />
      <text x="108" y="94" fontSize="6" fontWeight="600" fill={GREEN} textAnchor="middle">AQI 24 · Good</text>
    </g>
  ),
};

