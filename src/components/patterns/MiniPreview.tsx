import type { ReactElement } from 'react';

/**
 * 卡片内的轻量静态示意图（纯 SVG，无交互）。
 * 用途：让图鉴网格在快速扫读时仍能「看出形状」。
 * 真正可操作的 demo 在 Pattern 详情页和首页精选区。
 */
export function MiniPreview({ id }: { id: string }) {
  const draw = PREVIEWS[id];
  if (!draw) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-2xs text-[#C9C5BB]">UI</span>
      </div>
    );
  }
  return (
    <svg
      viewBox="0 0 240 132"
      className="h-full w-full"
      role="img"
      aria-label={`${id} 示意图`}
      preserveAspectRatio="xMidYMid slice"
    >
      {draw}
    </svg>
  );
}

const INK = '#1A1917';
const LINE = '#E6E3DB';
const SOFT = '#F2F0EB';
const MID = '#C9C5BB';

const __box = (x: number, y: number, w: number, h: number, fill = SOFT, r = 3) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
);

const __line = (x: number, y: number, w: number, fill = MID) => (
  <rect x={x} y={y} width={w} height={3} rx={1.5} fill={fill} />
);

const PREVIEWS: Record<string, ReactElement> = {
  /* ---- Navigation ---- */
  breadcrumb: (
    <g>
      {__box(24, 30, 192, 72, '#fff', 8)}
      {__line(40, 58, 34)}
      <text x="80" y="63" fontSize="10" fill={MID}>›</text>
      {__line(90, 58, 40)}
      <text x="136" y="63" fontSize="10" fill={MID}>›</text>
      {__line(146, 58, 52, INK)}
    </g>
  ),
  tabs: (
    <g>
      {__line(24, 44, 44, INK)}
      {__line(76, 44, 44)}
      {__line(128, 44, 56)}
      {__box(24, 54, 192, 48, SOFT, 6)}
      {__line(40, 68, 100)}
      {__line(40, 84, 70)}
    </g>
  ),
  'bottom-navigation': (
    <g>
      {__box(24, 26, 192, 80, '#fff', 8)}
      {__box(24, 88, 192, 1.8, LINE)}
      {[52, 100, 148, 196].map((x, i) => (
        <g key={x}>
          {__box(x - 8, 66, 16, 12, i === 0 ? INK : MID, 3)}
          {__line(x - 11, 84, 22, i === 0 ? INK : MID)}
        </g>
      ))}
    </g>
  ),
  'navigation-rail': (
    <g>
      {__box(24, 26, 44, 80, SOFT, 6)}
      {[38, 58, 78, 98].map((y, i) => (
        <rect
          key={y}
          x="32"
          y={y - 5}
          width="28"
          height="10"
          rx="3"
          fill={i === 0 ? INK : MID}
        />
      ))}
      {__box(78, 26, 138, 80, '#fff', 6)}
    </g>
  ),
  sidebar: (
    <g>
      {__box(24, 26, 62, 80, SOFT, 6)}
      {__box(32, 36, 20, 20, INK, 4)}
      {[62, 76, 90].map((y) => __line(32, y - 1.5, 44))}
      {__box(94, 26, 122, 80, '#fff', 6)}
    </g>
  ),
  pagination: (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 32 + i * 30;
        const active = i === 2;
        return (
          <g key={i}>
            {active && <rect x={x} y="52" width="22" height="22" rx="4" fill={INK} />}
            <text
              x={x + 11}
              y="67"
              fontSize="9"
              fill={active ? '#fff' : INK}
              textAnchor="middle"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {__line(196, 52, 20, MID)}
      {__line(32, 86, 176, LINE)}
    </g>
  ),
  stepper: (
    <g>
      {[52, 100, 148, 196].map((x, i) => (
        <g key={x}>
          {i < 3 && <line x1={x + 12} y1="60" x2={x + 36} y2="60" stroke={i === 0 ? INK : LINE} strokeWidth="2" />}
          <circle
            cx={x}
            cy="60"
            r="11"
            fill={i <= 1 ? INK : '#fff'}
            stroke={i <= 1 ? INK : LINE}
            strokeWidth="1.5"
          />
          <text x={x} y="64" fontSize="9" fill={i <= 1 ? '#fff' : MID} textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  ),
  'back-button': (
    <g>
      {__box(24, 30, 192, 72, '#fff', 8)}
      <path d="M52 66 L44 58 M44 58 L52 50" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      {__line(58, 58, 46, INK)}
    </g>
  ),
  'infinite-scroll': (
    <g>
      {[32, 62, 92].map((y, i) => (
        <g key={y}>
          {__box(32, y, 176, 24, i === 2 ? SOFT : '#fff', 5)}
          {__box(38, y + 6, 12, 12, MID, 3)}
          {__line(58, y + 10, 70)}
        </g>
      ))}
    </g>
  ),
  'load-more': (
    <g>
      {[32, 58].map((y) => (
        <g key={y}>
          {__box(32, y, 176, 20, '#fff', 5)}
          {__line(44, y + 9, 90)}
        </g>
      ))}
      {__box(80, 90, 80, 24, '#fff', 6)}
      <text x="120" y="106" fontSize="9" fill={INK} textAnchor="middle">加载更多</text>
    </g>
  ),

  /* ---- Actions ---- */
  button: (
    <g>
      {__box(64, 44, 112, 34, INK, 6)}
      <text x="120" y="65" fontSize="11" fill="#fff" textAnchor="middle">保存</text>
      {__box(28, 44, 28, 34, '#fff', 6)}
      <rect x="28" y="44" width="28" height="34" rx="6" fill="none" stroke={LINE} />
    </g>
  ),
  cta: (
    <g>
      {__box(36, 32, 168, 76, '#fff', 8)}
      {__line(60, 50, 100, INK)}
      {__line(78, 62, 64)}
      {__box(56, 76, 128, 24, INK, 5)}
      <text x="120" y="92" fontSize="9" fill="#fff" textAnchor="middle">免费开始使用</text>
    </g>
  ),
  'icon-button': (
    <g>
      {[40, 80, 120, 160, 200].map((x, i) => (
        <g key={x}>
          {__box(x - 16, 48, 32, 32, i === 2 ? SOFT : '#fff', 6)}
          <rect
            x={x - 16}
            y={48}
            width="32"
            height="32"
            rx="6"
            fill="none"
            stroke={LINE}
          />
          {i === 4 ? (
            <path d={`M${x - 5} 64 L${x} 69 L${x + 5} 59`} stroke="#A8342C" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <circle cx={x} cy="64" r="6" fill={MID} />
          )}
        </g>
      ))}
    </g>
  ),
  fab: (
    <g>
      {__box(28, 28, 150, 76, '#fff', 6)}
      {__line(42, 44, 70)}
      {__line(42, 60, 96)}
      {__line(42, 76, 58)}
      <circle cx="192" cy="88" r="22" fill={INK} />
      <path d="M185 88 H199 M192 81 V95" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),
  'split-button': (
    <g>
      <path d="M84 52 h72 a6 6 0 0 1 6 6 v16 a6 6 0 0 1 -6 6 h-72 a6 6 0 0 1 -6 -6 v-16 a6 6 0 0 1 6 -6 z" fill={INK} />
      <line x1="132" y1="54" x2="132" y2="78" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.5" />
      <text x="106" y="69" fontSize="10" fill="#fff" textAnchor="middle">粘贴</text>
      <path d="M145 62 l5 5 5 -5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  'destructive-action': (
    <g>
      {__box(32, 40, 176, 46, '#fff', 8)}
      {__line(48, 56, 80, INK)}
      {__line(48, 70, 56, MID)}
      <text x="192" y="68" fontSize="10" fill="#A8342C" textAnchor="end">清除</text>
    </g>
  ),

  /* ---- Input ---- */
  'text-field': (
    <g>
      {__line(56, 44, 40, '#4A4740')}
      {__box(56, 56, 128, 32, '#fff', 6)}
      <rect x="56" y="56" width="128" height="32" rx="6" fill="none" stroke={LINE} />
      <text x="66" y="76" fontSize="9" fill={MID}>you@example.com</text>
      {__line(56, 96, 84, MID)}
    </g>
  ),
  'text-area': (
    <g>
      {__line(56, 38, 40, '#4A4740')}
      {__box(56, 50, 128, 56, '#fff', 6)}
      <rect x="56" y="50" width="128" height="56" rx="6" fill="none" stroke={LINE} />
      {__line(66, 62, 80, MID)}
      {__line(66, 76, 100, MID)}
      {__line(66, 90, 52, MID)}
    </g>
  ),
  'search-field': (
    <g>
      {__box(40, 54, 160, 32, SOFT, 16)}
      <circle cx="58" cy="68" r="5" fill="none" stroke={MID} strokeWidth="2" />
      <path d="M62 72 l4 4" stroke={MID} strokeWidth="2" strokeLinecap="round" />
      <text x="74" y="74" fontSize="9" fill={MID}>搜索照片</text>
    </g>
  ),
  checkbox: (
    <g>
      {[46, 82, 118, 154].map((y, i) => (
        <g key={y}>
          {i < 2 && (
            <rect x="40" y={y - 8} width="17" height="17" rx="4" fill={INK} />
          )}
          {i >= 2 && (
            <>
              <rect x="40" y={y - 8} width="17" height="17" rx="4" fill="#fff" />
              <rect x="40" y={y - 8} width="17" height="17" rx="4" fill="none" stroke={MID} />
            </>
          )}
          {i < 2 && (
            <path d={`M44 ${y} l3 3 6 -7`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          {__line(66, y - 2, 60, i < 2 ? INK : MID)}
        </g>
      ))}
    </g>
  ),
  radio: (
    <g>
      {[48, 84, 120].map((y, i) => (
        <g key={y}>
          <circle cx="50" cy={y} r="9" fill="#fff" stroke={i === 0 ? INK : MID} strokeWidth="1.8" />
          {i === 0 && <circle cx="50" cy={y} r="4" fill={INK} />}
          {__line(68, y - 2, i === 0 ? 70 : 56, i === 0 ? INK : MID)}
        </g>
      ))}
    </g>
  ),
  switch: (
    <g>
      {[48, 84].map((y, i) => (
        <g key={y}>
          {__line(40, y - 2, 80)}
          <rect x="140" y={y - 12} width="42" height="24" rx="12" fill={i === 0 ? '#2C7355' : '#D8D5CD'} />
          <circle cx={i === 0 ? 170 : 152} cy={y} r="9" fill="#fff" />
        </g>
      ))}
    </g>
  ),
  slider: (
    <g>
      {__box(40, 62, 160, 5, SOFT, 2.5)}
      {__box(40, 62, 88, 5, INK, 2.5)}
      <circle cx="128" cy="64.5" r="9" fill="#fff" stroke={INK} strokeWidth="2" />
      {__line(40, 84, 30, MID)}
      {__line(170, 84, 30, MID)}
    </g>
  ),
  'segmented-control': (
    <g>
      {__box(52, 50, 136, 32, SOFT, 7)}
      {__box(55, 53, 42, 26, '#fff', 5)}
      <rect x="55" y="53" width="42" height="26" rx="5" fill="#fff" filter="url(#sh)" />
      {['日', '周', '月'].map((t, i) => (
        <text
          key={t}
          x={76 + i * 45}
          y="70"
          fontSize="11"
          fill={i === 0 ? INK : MID}
          textAnchor="middle"
        >
          {t}
        </text>
      ))}
    </g>
  ),
  select: (
    <g>
      {__line(56, 44, 32, '#4A4740')}
      {__box(56, 56, 128, 32, '#fff', 6)}
      <rect x="56" y="56" width="128" height="32" rx="6" fill="none" stroke={LINE} />
      <text x="68" y="76" fontSize="9" fill={MID}>请选择城市</text>
      <path d="M166 68 l5 5 5 -5" stroke={MID} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {__box(56, 92, 128, 22, SOFT, 4)}
      <text x="68" y="107" fontSize="8" fill={INK}>北京</text>
    </g>
  ),
  chip: (
    <g>
      {['全部', '人像', '风景', '夜景'].map((t, i) => (
        <g key={t}>
          {i === 1 && <rect x="32" y="54" width="46" height="26" rx="13" fill={INK} />}
          {i !== 1 && <rect x="32" y="54" width="46" height="26" rx="13" fill={SOFT} />}
          <text x="55" y="71" fontSize="9" fill={i === 1 ? '#fff' : '#4A4740'} textAnchor="middle">
            {t}
          </text>
          {i < 3 && <rect x="90" y="54" width="46" height="26" rx="13" fill={SOFT} />}
          {i < 3 && (
            <text x="113" y="71" fontSize="9" fill="#4A4740" textAnchor="middle">
              {t}
            </text>
          )}
        </g>
      ))}
    </g>
  ),
  'date-picker': (
    <g>
      {__box(52, 28, 136, 80, '#fff', 8)}
      <rect x="52" y="28" width="136" height="80" rx="8" fill="none" stroke={LINE} />
      {__line(78, 42, 60, INK)}
      {[0, 1, 2, 3, 4, 5, 6].map((c) => (
        <circle key={c} cx={70 + c * 17} cy={58} r="5" fill={c < 3 ? '#E3E0D8' : SOFT} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((c) => (
        <circle key={`b${c}`} cx={70 + c * 17} cy={78} r="5" fill={c === 2 ? INK : SOFT} />
      ))}
      <circle cx="70" cy="78" r="7" fill="none" stroke={INK} />
      {[0, 1, 2, 3, 4, 5, 6].map((c) => (
        <circle key={`c${c}`} cx={70 + c * 17} cy={98} r="5" fill={SOFT} />
      ))}
    </g>
  ),
  'file-upload': (
    <g>
      <rect x="44" y="30" width="152" height="72" rx="8" fill="none" stroke={MID} strokeWidth="1.6" strokeDasharray="5 4" />
      <path d="M120 54 v18 M113 61 l7 -7 7 7" stroke={MID} strokeWidth="2" fill="none" strokeLinecap="round" />
      {__box(72, 82, 96, 12, SOFT, 6)}
      {__box(72, 82, 54, 12, INK, 6)}
    </g>
  ),
  'stepper-input': (
    <g>
      {__box(72, 46, 96, 40, '#fff', 8)}
      <rect x="72" y="46" width="96" height="40" rx="8" fill="none" stroke={LINE} />
      <line x1="96" y1="48" x2="96" y2="84" stroke={LINE} />
      <line x1="144" y1="48" x2="144" y2="84" stroke={LINE} />
      <text x="120" y="71" fontSize="13" fill={INK} textAnchor="middle">1</text>
      <path d="M80 66 h8 M84 62 v8" stroke={MID} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M156 66 h8 M160 62 v8" stroke={MID} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),

  /* ---- Containers ---- */
  card: (
    <g>
      <rect x="32" y="28" width="86" height="76" rx="8" fill="#fff" stroke={LINE} />
      <rect x="34" y="30" width="82" height="34" rx="7" fill={SOFT} />
      {__line(42, 74, 52, INK)}
      {__line(42, 86, 38, MID)}
      <rect x="126" y="28" width="82" height="76" rx="8" fill="#fff" stroke={LINE} />
      <rect x="128" y="30" width="78" height="34" rx="7" fill={SOFT} />
      {__line(136, 74, 48, INK)}
      {__line(136, 86, 34, MID)}
    </g>
  ),
  accordion: (
    <g>
      {[36, 74, 100].map((y, i) => (
        <g key={y}>
          <rect x="36" y={y} width="168" height="1" fill={LINE} />
          {__line(50, y + 18, i === 0 ? 76 : 60, INK)}
          <path
            d={`M182 ${y + 14} l4 4 -4 4`}
            stroke={MID}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={i === 0 ? `rotate(-90 184 ${y + 18})` : ''}
          />
          {i === 0 && <rect x="50" y="50" width="140" height="16" rx="3" fill={SOFT} />}
        </g>
      ))}
      <rect x="36" y="36" width="168" height="1" fill={LINE} />
    </g>
  ),
  collapsible: (
    <g>
      {[36, 66, 96].map((y, i) => (
        <g key={y}>
          <rect x="40" y={y} width="160" height="1" fill={LINE} />
          {__line(54, y + 14, i === 0 ? 70 : 54, i === 0 ? INK : '#4A4740')}
          <path
            d={`M182 ${y + 10} l4 4 -4 4`}
            stroke={i === 0 ? INK : MID}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={i === 0 ? `rotate(-90 184 ${y + 14})` : ''}
          />
          {i === 0 && (
            <>
              <rect x="54" y="46" width="132" height="16" rx="3" fill={SOFT} />
              <rect x="40" y="66" width="160" height="1" fill={LINE} />
            </>
          )}
        </g>
      ))}
    </g>
  ),
  modal: (
    <g>
      {__box(24, 26, 192, 80, '#DEDBD3', 8)}
      {__box(58, 38, 124, 58, '#fff', 8)}
      {__line(72, 52, 66, INK)}
      {__line(72, 64, 96, MID)}
      {__line(72, 76, 52, MID)}
      {__box(130, 82, 40, 10, INK, 3)}
    </g>
  ),
  dialog: (
    <g>
      {__box(24, 26, 192, 80, '#DEDBD3', 8)}
      {__box(58, 38, 124, 58, '#fff', 8)}
      {__line(72, 52, 66, INK)}
      {__line(72, 64, 96, MID)}
      {__line(72, 76, 52, MID)}
      {__box(130, 82, 40, 10, INK, 3)}
    </g>
  ),
  'bottom-sheet': (
    <g>
      {__box(24, 26, 192, 50, '#DEDBD3', 6)}
      {__box(24, 70, 192, 36, '#fff', 10)}
      {__box(104, 75, 32, 4, MID, 2)}
      {__line(44, 88, 80, INK)}
      {__line(44, 97, 60, MID)}
    </g>
  ),
  drawer: (
    <g>
      {__box(24, 26, 192, 80, '#DEDBD3', 6)}
      {__box(24, 26, 84, 80, '#fff', 6)}
      {__line(38, 40, 26, INK)}
      {__line(38, 56, 52)}
      {__line(38, 72, 44)}
      {__line(38, 88, 34)}
    </g>
  ),
  popover: (
    <g>
      {__box(32, 26, 70, 20, SOFT, 4)}
      {__box(20, 54, 110, 48, '#fff', 8)}
      <rect x="20" y="54" width="110" height="48" rx="8" fill="none" stroke={LINE} />
      <path d="M44 54 l8 -8 8 8 z" fill="#fff" />
      {__line(34, 68, 60, INK)}
      {__line(34, 80, 44, MID)}
      {__line(34, 90, 70, MID)}
    </g>
  ),
  tooltip: (
    <g>
      <circle cx="60" cy="60" r="16" fill={SOFT} />
      {__box(80, 46, 76, 24, INK, 5)}
      <path d="M84 46 l6 -6 6 6 z" fill={INK} />
      <text x="118" y="62" fontSize="9" fill="#fff" textAnchor="middle">导出 PDF</text>
    </g>
  ),

  /* ---- Feedback ---- */
  toast: (
    <g>
      {__box(76, 26, 88, 24, INK, 6)}
      <text x="120" y="42" fontSize="9" fill="#fff" textAnchor="middle">照片已保存</text>
      {__box(48, 62, 144, 44, '#fff', 6)}
      <rect x="48" y="62" width="144" height="44" rx="6" fill="none" stroke={LINE} />
      {__line(62, 76, 90)}
      {__line(62, 90, 60, MID)}
    </g>
  ),
  snackbar: (
    <g>
      {__box(48, 30, 144, 40, '#fff', 6)}
      <rect x="48" y="30" width="144" height="40" rx="6" fill="none" stroke={LINE} />
      {__line(62, 44, 80)}
      {__line(62, 58, 50, MID)}
      {__box(36, 88, 168, 30, INK, 6)}
      <text x="66" y="107" fontSize="8" fill="#fff">已删除</text>
      <text x="184" y="107" fontSize="8" fill="#fff" textAnchor="end" fontWeight="600">
        撤销
      </text>
    </g>
  ),
  alert: (
    <g>
      {__box(40, 34, 160, 34, '#FAEDEC', 6)}
      {__box(40, 34, 3, 34, '#A8342C', 1.5)}
      {__line(54, 46, 66, '#7A241F')}
      {__line(54, 58, 100, '#7A241F')}
      {__box(40, 78, 160, 30, '#F8F2E4', 6)}
      {__box(40, 78, 3, 30, '#94701C', 1.5)}
      {__line(54, 92, 100, '#6B520F')}
    </g>
  ),
  banner: (
    <g>
      {__box(24, 26, 192, 26, '#F8F2E4', 0)}
      {__line(40, 38, 90, '#6B520F')}
      {__line(180, 37, 8, '#6B520F')}
      {__line(196, 37, 8, '#6B520F')}
      {__box(24, 52, 192, 54, '#fff', 4)}
      {__line(44, 68, 110)}
      {__line(44, 82, 76, MID)}
    </g>
  ),
  'progress-bar': (
    <g>
      {__box(48, 56, 144, 6, SOFT, 3)}
      {__box(48, 56, 96, 6, INK, 3)}
      <text x="48" y="46" fontSize="9" fill="#4A4740">已上传 5.3 MB / 8 MB</text>
      <text x="192" y="46" fontSize="9" fill={MID} textAnchor="end">67%</text>
    </g>
  ),
  spinner: (
    <g>
      <circle cx="120" cy="60" r="16" fill="none" stroke={LINE} strokeWidth="3" />
      <path d="M120 44 a16 16 0 0 1 16 16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {__box(64, 96, 112, 20, '#fff', 5)}
      <rect x="64" y="96" width="112" height="20" rx="5" fill="none" stroke={LINE} />
      <text x="120" y="110" fontSize="8" fill={INK} textAnchor="middle">保存中…</text>
    </g>
  ),
  skeleton: (
    <g>
      {[30, 62, 94].map((y) => (
        <g key={y}>
          {__box(36, y, 168, 26, '#fff', 5)}
          <rect x="36" y={y} width="168" height="26" rx="5" fill="none" stroke={LINE} />
          {__box(42, y + 5, 16, 16, '#E9E6DF', 3)}
          {__line(66, y + 9, 66, '#E9E6DF')}
          {__line(66, y + 17, 40, '#F0EDE6')}
        </g>
      ))}
    </g>
  ),
  'empty-state': (
    <g>
      <circle cx="120" cy="52" r="20" fill={SOFT} />
      <path d="M112 52 l6 6 10 -12" stroke={MID} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {__line(84, 82, 72, INK)}
      {__line(92, 94, 56, MID)}
      {__box(88, 104, 64, 16, INK, 4)}
    </g>
  ),
  'error-state': (
    <g>
      <circle cx="120" cy="50" r="20" fill="#FAEDEC" />
      <path d="M120 42 v10 M120 57 v1.5" stroke="#A8342C" strokeWidth="2.4" strokeLinecap="round" />
      {__line(84, 80, 72, INK)}
      {__line(94, 92, 52, MID)}
      {__box(88, 102, 64, 16, INK, 4)}
    </g>
  ),
  'success-state': (
    <g>
      <circle cx="120" cy="48" r="20" fill="#E6F2EC" />
      <path d="M112 48 l6 6 10 -12" stroke="#2C7355" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {__line(92, 78, 56, INK)}
      {__box(80, 90, 80, 22, '#fff', 5)}
      <rect x="80" y="90" width="80" height="22" rx="5" fill="none" stroke={LINE} />
      {__box(86, 95, 12, 12, SOFT, 2)}
    </g>
  ),

  /* ---- Data ---- */
  list: (
    <g>
      {[32, 68, 104].map((y) => (
        <g key={y}>
          <rect x="36" y={y} width="168" height="1" fill={LINE} />
          {__box(44, y + 10, 16, 16, SOFT, 4)}
          {__line(70, y + 14, 62, INK)}
          {__line(176, y + 14, 18, MID)}
        </g>
      ))}
    </g>
  ),
  table: (
    <g>
      {__box(32, 34, 176, 68, '#fff', 6)}
      <rect x="32" y="34" width="176" height="68" rx="6" fill="none" stroke={LINE} />
      <rect x="32" y="34" width="176" height="18" fill={SOFT} />
      <line x1="32" y1="52" x2="208" y2="52" stroke={LINE} />
      <line x1="32" y1="74" x2="208" y2="74" stroke={LINE} />
      {__line(42, 41, 40, '#4A4740')}
      {__line(190, 41, 12, '#4A4740')}
      {__line(42, 60, 48, MID)}
      {__line(180, 60, 22, MID)}
      {__line(42, 82, 52, MID)}
      {__line(180, 82, 22, MID)}
    </g>
  ),
  badge: (
    <g>
      {[60, 120, 180].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="58" r="16" fill={SOFT} />
          {i < 2 && (
            <g>
              <circle cx={x + 13} cy="45" r="9" fill="#A8342C" />
              <text x={x + 13} y="48.5" fontSize="8" fill="#fff" textAnchor="middle">
                {i === 0 ? '5' : '9+'}
              </text>
            </g>
          )}
          {__line(x - 14, 90, 28, MID)}
        </g>
      ))}
    </g>
  ),
  'chip-display': (
    <g>
      {[34, 64, 94].map((y) => (
        <g key={y}>
          {__box(36, y, 168, 24, '#fff', 5)}
          <rect x="36" y={y} width="168" height="24" rx="5" fill="none" stroke={LINE} />
          {__line(48, y + 10, 62, INK)}
          {__box(142, y + 6, 28, 12, '#EEF3F8', 6)}
          {__box(176, y + 6, 22, 12, '#F8F2E4', 6)}
        </g>
      ))}
    </g>
  ),
  avatar: (
    <g>
      {[64, 120, 176].map((x, i) => (
        <g key={x}>
          <circle
            cx={x}
            cy="58"
            r="20"
            fill={['#DCE6EF', '#E2EAE4', '#EFE1E1'][i]}
            stroke="#fff"
            strokeWidth="2"
          />
          {__line(x - 34, 90, 68, MID)}
        </g>
      ))}
    </g>
  ),
  timeline: (
    <g>
      <line x1="46" y1="34" x2="46" y2="104" stroke={LINE} strokeWidth="1.5" />
      {[42, 68, 96].map((y, i) => (
        <g key={y}>
          <circle cx="46" cy={y} r="5" fill={INK} stroke="#fff" strokeWidth="2" />
          {__line(64, y - 2, 76, i === 0 ? INK : MID)}
          {__line(64, y + 8, 36, MID)}
        </g>
      ))}
    </g>
  ),

  /* ---- Interaction ---- */
  'swipe-action': (
    <g>
      <rect x="164" y="46" width="44" height="22" fill="#35618E" />
      <rect x="208" y="46" width="24" height="22" fill="#A8342C" />
      <g transform="translate(-48 0)">
        <rect x="32" y="46" width="200" height="22" fill="#fff" />
        <rect x="32" y="46" width="200" height="22" rx="4" fill="none" stroke={LINE} />
        {__line(44, 55, 70, INK)}
        {__line(44, 61, 40, MID)}
      </g>
      {__line(40, 92, 100, MID)}
    </g>
  ),
  'pull-to-refresh': (
    <g>
      <rect x="52" y="30" width="136" height="76" rx="8" fill="#fff" stroke={LINE} />
      <path d="M120 44 a8 8 0 1 1 -6 3" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      {__line(76, 70, 88, MID)}
      {__line(76, 84, 60, MID)}
    </g>
  ),
  'drag-and-drop': (
    <g>
      {[32, 106].map((x) => (
        <g key={x}>
          <rect x={x} y="30" width="72" height="76" rx="7" fill="#FCFBF8" stroke={LINE} strokeDasharray="4 3" />
          {[42, 60, 78].map((y) => (
            <g key={y}>
              <rect x={x + 6} y={y} width="60" height="14" rx="3" fill="#fff" stroke={LINE} />
              {__line(x + 12, y + 6, 28, MID)}
            </g>
          ))}
        </g>
      ))}
    </g>
  ),
  'long-press': (
    <g>
      {[36, 62, 88].map((y, i) => (
        <g key={y}>
          {__box(36, y, 120, 22, i === 0 ? '#EFEDE7' : '#fff', 4)}
          <rect x="36" y={y} width="120" height="22" rx="4" fill="none" stroke={LINE} />
          {__line(48, y + 9, 60, i === 0 ? INK : '#4A4740')}
        </g>
      ))}
      {__box(140, 56, 78, 40, '#fff', 6)}
      <rect x="140" y="56" width="78" height="40" rx="6" fill="none" stroke={LINE} />
      {__line(152, 66, 44, INK)}
      {__line(152, 78, 40, '#A8342C')}
    </g>
  ),
  'context-menu': (
    <g>
      {__box(36, 26, 168, 82, '#FCFBF8', 6)}
      {__line(60, 40, 90, INK)}
      {__line(60, 56, 70, MID)}
      {__box(72, 62, 120, 66, '#fff', 6)}
      <rect x="72" y="62" width="120" height="66" rx="6" fill="none" stroke={LINE} />
      {__line(86, 74, 60, INK)}
      {__line(86, 88, 60, INK)}
      <line x1="80" y1="98" x2="184" y2="98" stroke={LINE} />
      {__line(86, 108, 48, '#A8342C')}
    </g>
  ),
  'progressive-disclosure': (
    <g>
      {__box(44, 30, 152, 76, '#fff', 8)}
      {__line(60, 48, 60, '#4A4740')}
      {__line(176, 44, 4, INK)}
      {__line(60, 66, 40, INK)}
      {__line(60, 84, 110, MID)}
    </g>
  ),
  'optimistic-ui': (
    <g>
      {__box(56, 34, 128, 60, '#fff', 8)}
      {__line(72, 50, 76, INK)}
      <path
        d="M76 68 c-4 -5 -9 -1 -9 3 c0 5 9 11 9 11 c0 0 9 -6 9 -11 c0 -4 -5 -8 -9 -3 z"
        fill="#A8342C"
      />
      {__line(96, 72, 24, '#A8342C')}
      {__line(72, 110, 96, MID)}
    </g>
  ),
  'inline-validation': (
    <g>
      {__line(60, 36, 40, '#4A4740')}
      {__box(60, 48, 120, 32, '#fff', 6)}
      <rect x="60" y="48" width="120" height="32" rx="6" fill="none" stroke="#A8342C" strokeWidth="1.4" />
      <text x="72" y="68" fontSize="9" fill={INK}>••••••</text>
      {__line(60, 88, 92, '#A8342C')}
    </g>
  ),
  'stat-card': (
    <g>
      {__box(48, 26, 66, 80, '#fff', 6)}
      {__line(58, 38, 22, MID)}
      <text x="58" y="76" fontSize="24" fontWeight="600" fill={INK}>8.4k</text>
      {__line(58, 88, 40, MID)}
      <path d="M54 96 l10 -6 l8 4 l12 -12" fill="none" stroke="#2C7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {__box(124, 26, 66, 80, '#fff', 6)}
      {__line(134, 38, 22, MID)}
      <text x="134" y="76" fontSize="24" fontWeight="600" fill={INK}>62%</text>
      {__line(134, 88, 40, MID)}
      <path d="M130 96 l10 -4 l8 8 l12 -10" fill="none" stroke="#A8342C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  'modal-stateful': (
    <g>
      {__box(40, 20, 160, 92, '#EFEDE7', 6)}
      {__line(52, 32, 56, MID)}
      {__line(52, 46, 120, LINE)}
      {__line(52, 60, 96, LINE)}
      {__box(72, 72, 44, 24, '#fff', 4)}
      {__line(80, 82, 28, MID)}
      {__box(128, 72, 60, 24, INK, 4)}
      {__line(138, 82, 40, '#fff')}
      {__box(28, 10, 184, 104, '#fff', 8)}
      <rect x="28" y="10" width="184" height="104" rx="8" fill="none" stroke={INK} strokeWidth="1.6" />
      {__line(44, 28, 48, INK)}
      {__line(44, 46, 130, LINE)}
      {__line(44, 60, 104, LINE)}
      {__box(60, 78, 52, 22, '#F2F0EB', 4)}
      {__line(70, 87, 32, MID)}
      {__box(122, 78, 76, 22, INK, 4)}
      {__line(134, 87, 52, '#fff')}
    </g>
  ),
};
