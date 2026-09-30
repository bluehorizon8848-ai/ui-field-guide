'use client';

import { useId, useRef, useState } from 'react';
import { Archive, Check, Heart, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { DemoStage } from './DemoStage';

/* ---------------- Swipe Action ---------------- */

const SWIPE_ITEMS = [
  { id: 1, t: '来自 iCloud 的邮件', s: '9:41' },
  { id: 2, t: '周报 · 团队协作', s: '昨天' },
  { id: 3, t: '账单提醒', s: '昨天' },
];

export function SwipeActionDemo() {
  const [revealed, setRevealed] = useState<number | null>(null);
  const [removed, setRemoved] = useState<number[]>([]);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const decided = useRef<'none' | 'h' | 'v'>('none');

  const remaining = SWIPE_ITEMS.filter((i) => !removed.includes(i.id));

  return (
    <DemoStage caption="在某一行的内容上按住向左拖。注意：真实产品里还需要长按作为替代入口 —— 这里用右侧「⋮」代替。">
      <div className="mx-auto w-full max-w-[400px]">
        <ul className="overflow-hidden rounded-xl border border-line">
          {remaining.length === 0 && (
            <li className="bg-surface px-4 py-6 text-center text-xs text-muted">
              列表空了
            </li>
          )}
          {remaining.map((item) => {
            const open = revealed === item.id;
            return (
              <li key={item.id} className="relative overflow-hidden border-b border-line last:border-b-0">
                {/* 底层操作 */}
                <div className="absolute inset-0 flex items-stretch justify-end">
                  <button
                    type="button"
                    onClick={() => setRemoved((r) => [...r, item.id])}
                    className="flex w-[72px] items-center justify-center bg-[#A8342C] text-white"
                  >
                    <Trash2 size={17} aria-hidden="true" />
                    <span className="sr-only">删除 {item.t}</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-[72px] items-center justify-center bg-[#35618E] text-white"
                  >
                    <Archive size={17} aria-hidden="true" />
                    <span className="sr-only">归档 {item.t}</span>
                  </button>
                </div>

                {/* 前层行 */}
                <div
                  className="relative flex items-center gap-3 bg-surface px-4 py-3.5"
                  style={{
                    transform: open ? 'translateX(-144px)' : 'translateX(0)',
                    transition: 'transform 200ms cubic-bezier(0.32,0.72,0,1)',
                  }}
                  onPointerDown={(e) => {
                    startX.current = e.clientX;
                    startY.current = e.clientY;
                    decided.current = 'none';
                  }}
                  onPointerMove={(e) => {
                    if (startX.current === null) return;
                    const dx = e.clientX - startX.current;
                    const dy = e.clientY - (startY.current ?? e.clientY);
                    if (decided.current === 'none' && Math.abs(dx) > 6) {
                      decided.current = Math.abs(dx) > Math.abs(dy) * 1.5 ? 'h' : 'v';
                    }
                    if (decided.current !== 'h') return;
                    if (dx < -40) setRevealed(item.id);
                    else if (dx > 20) setRevealed(null);
                  }}
                  onPointerUp={() => {
                    startX.current = null;
                    decided.current = 'none';
                  }}
                  onPointerLeave={() => {
                    startX.current = null;
                    decided.current = 'none';
                  }}
                >
                  <span className="h-8 w-8 shrink-0 rounded-lg bg-[#DCE6EF]" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] text-ink">{item.t}</span>
                    <span className="mt-0.5 block text-xs text-muted">{item.s}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRevealed(open ? null : item.id)}
                    aria-label="更多操作"
                    aria-expanded={open}
                    className="shrink-0 rounded p-1.5 text-muted transition-colors hover:bg-[#F2F0EB]"
                  >
                    <MoreHorizontal size={16} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {removed.length > 0 && (
          <button
            type="button"
            onClick={() => setRemoved([])}
            className="mt-3 w-full rounded-lg border border-line py-2 text-xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
          >
            撤销删除（{removed.length}）
          </button>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Pull to Refresh ---------------- */

export function PullToRefreshDemo() {
  const [dy, setDy] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const locked = useRef(false);

  const THRESHOLD = 72;
  const resistance = Math.min(dy * 0.5, 140);

  const doRefresh = () => {
    if (locked.current) return;
    locked.current = true;
    setRefreshing(true);
    setDy(THRESHOLD);
    setTimeout(() => {
      setRefreshing(false);
      setDy(0);
      locked.current = false;
    }, 1400);
  };

  return (
    <DemoStage caption="在内容区域按住往下拖（移动端手势）。注意阻尼 —— 越拉越沉，这是手感的关键。">
      <div className="relative mx-auto w-full max-w-[380px] overflow-hidden rounded-xl border border-line">
        <div
          className="flex flex-col items-center justify-center overflow-hidden bg-[#FCFBF8] transition-[height] duration-200"
          style={{ height: resistance > 0 ? resistance : 0 }}
        >
          <span
            className="text-muted transition-transform"
            style={{
              transform: `rotate(${Math.min(resistance / THRESHOLD, 1) * 270}deg)`,
            }}
          >
            <RefreshCw
              size={15}
              className={refreshing ? 'animate-spin' : ''}
              aria-hidden="true"
            />
          </span>
        </div>

        <div
          className="select-none bg-surface px-4 py-3"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={(e) => {
            if (!locked.current) startY.current = e.clientY;
          }}
          onPointerMove={(e) => {
            if (startY.current === null) return;
            const delta = startY.current - e.clientY;
            setDy(delta > 0 ? delta : 0);
          }}
          onPointerUp={() => {
            startY.current = null;
            if (resistance >= THRESHOLD) doRefresh();
            else if (!locked.current) setDy(0);
          }}
          onPointerLeave={() => {
            startY.current = null;
            if (!locked.current) setDy(0);
          }}
        >
          <p className="text-center text-[0.8125rem] text-muted">
            {refreshing
              ? '正在刷新…'
              : resistance > 0
                ? resistance >= THRESHOLD
                  ? '松手刷新'
                  : '继续下拉'
                : '在区域里按住往下拖'}
          </p>
          <div className="mt-3 space-y-2">
            {['3 条新动态', '2 张新照片', '1 条新评论'].map((t) => (
              <div
                key={t}
                className="rounded-lg border border-line px-3 py-2.5 text-[0.8125rem] text-ink2"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Long Press ---------------- */

export function LongPressDemo() {
  const [pressed, setPressed] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  const begin = (id: string, e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    setPressed(id);
    timer.current = setTimeout(() => {
      setPressed(`${id}:menu`);
      if (navigator.vibrate) navigator.vibrate(12);
    }, 500);
  };

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    start.current = null;
    setPressed(null);
  };

  const ITEMS = [
    { id: 'a', t: 'IMG_0231 海岸线' },
    { id: 'b', t: 'DSC_4478 城市夜景' },
    { id: 'c', t: 'IMG_0155 旧照片' },
  ];

  return (
    <DemoStage caption="按住一项不放（约半秒）—— 会有震动和视觉高亮，然后弹出菜单。移开手指会取消。">
      <div className="mx-auto w-full max-w-[400px]">
        <ul className="overflow-hidden rounded-xl border border-line">
          {ITEMS.map((it) => (
            <li key={it.id} className="relative border-b border-line last:border-b-0">
              <div
                className={`px-4 py-3.5 select-none transition-colors ${
                  pressed === it.id ? 'bg-[#EFEDE7]' : 'bg-surface'
                }`}
                onPointerDown={(e) => begin(it.id, e)}
                onPointerMove={(e) => {
                  if (!start.current) return;
                  const d = Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y);
                  if (d > 10) cancel();
                }}
                onPointerUp={cancel}
                onPointerLeave={cancel}
                onContextMenu={(e) => e.preventDefault()}
              >
                <p className="text-[0.8125rem] text-ink">{it.t}</p>
              </div>

              {pressed === `${it.id}:menu` && (
                <div className="absolute inset-x-4 top-full z-10 mt-1 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in">
                  {['编辑', '分享', '删除'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPressed(null)}
                      className={`w-full px-3 py-2 text-left text-[0.8125rem] transition-colors hover:bg-[#F5F3EE] ${
                        t === '删除' ? 'text-[#A8342C]' : 'text-ink2'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center text-xs text-muted" role="status" aria-live="polite">
          {pressed?.endsWith(':menu') ? '菜单已弹出' : '按住任意一项试试'}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Drag & Drop ---------------- */

const COLS = [
  { id: 'todo', label: '待处理', items: ['设计首页', '写文档'] },
  { id: 'doing', label: '进行中', items: ['实现搜索'] },
  { id: 'done', label: '已完成', items: ['搭脚手架', '定配色'] },
];

export function DragDropDemo() {
  const [cols, setCols] = useState(COLS);
  const [drag, setDrag] = useState<{ col: number; item: number } | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const move = (toCol: number, toIdx: number) => {
    if (!drag) return;
    setCols((prev) => {
      const next = prev.map((c) => ({ ...c, items: [...c.items] }));
      const [item] = next[drag.col].items.splice(drag.item, 1);
      next[toCol].items.splice(toIdx, 0, item);
      return next;
    });
    setDrag(null);
  };

  return (
    <DemoStage caption="用鼠标按住卡片拖动。触屏上需要处理更多手势冲突 —— 这是最难的交互之一。">
      <div className="grid grid-cols-3 gap-2.5">
        {cols.map((col, ci) => (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(ci);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              if (!drag) return;
              move(ci, drag.col === ci ? drag.item : col.items.length);
            }}
            className={`min-h-[150px] rounded-xl border-2 p-2.5 transition-colors ${
              over === ci && drag && drag.col !== ci
                ? 'border-ink bg-[#F7F5F0]'
                : 'border-dashed border-line bg-[#FCFBF8]'
            }`}
          >
            <p className="meta mb-2 px-0.5">{col.label}</p>
            <div className="space-y-1.5">
              {col.items.map((item, ii) => (
                <div
                  key={item}
                  draggable
                  onDragStart={() => setDrag({ col: ci, item: ii })}
                  onDragEnd={() => {
                    setDrag(null);
                    setOver(null);
                  }}
                  className={`cursor-grab rounded-lg border border-line bg-surface px-2.5 py-2 text-[0.75rem] text-ink transition-opacity active:cursor-grabbing ${
                    drag?.col === ci && drag?.item === ii ? 'opacity-40' : ''
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

/* ---------------- Optimistic UI ---------------- */

export function OptimisticDemo() {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [count, setCount] = useState(128);
  const [failNext, setFailNext] = useState(false);

  const toggle = () => {
    if (pending) return;
    const next = !liked;
    const prevLiked = liked;
    const prevCount = count;

    // 1. 立即更新 UI
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    setPending(true);

    // 2. 发请求
    setTimeout(() => {
      setPending(false);
      if (failNext) {
        // 3. 失败：回滚 + 提示
        setLiked(prevLiked);
        setCount(prevCount);
        setFailNext(false);
      }
    }, 1100);
  };

  return (
    <DemoStage caption="点一下：图标瞬间点亮（不等服务器）。开「模拟下次失败」再点一次，看回滚。">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-sm text-ink">海岸线的一天</p>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              disabled={pending}
              aria-pressed={liked}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? 'text-[#A8342C]' : 'text-muted'
              } ${pending ? 'opacity-60' : ''}`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
              <span className="tabular-nums">{count}</span>
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-ink2">
          <input
            type="checkbox"
            checked={failNext}
            onChange={(e) => setFailNext(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#1A1917]"
          />
          模拟下次请求失败
        </label>

        <p className="text-center text-xs text-muted" role="status" aria-live="polite">
          {pending
            ? '正在同步…（UI 已经更新了）'
            : liked
              ? '已点赞'
              : '未点赞'}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Inline Validation ---------------- */

export function InlineValidationDemo() {
  const [v, setV] = useState('');
  const [touched, setTouched] = useState(false);
  const uid = useId();
  const pwId = `${uid}-pw`;
  const pwHintId = `${uid}-pw-hint`;
  const valid = v.length >= 8;

  return (
    <DemoStage caption="点输入框然后移开鼠标（失焦）才会校验。注意错误文案写的是「怎么改」。">
      <div className="mx-auto w-full max-w-[380px]">
        <label htmlFor={pwId} className="mb-1.5 block text-sm text-ink2">
          新密码
        </label>
        <input
          id={pwId}
          type="password"
          value={v}
          onChange={(e) => setV(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={touched && !valid}
          aria-describedby={pwHintId}
          className={`h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)] ${
            touched && !valid ? 'border-[#A8342C]' : 'border-line'
          }`}
        />
        <p
          id={pwHintId}
          className={`mt-1.5 text-[0.8125rem] ${
            touched && !valid ? 'text-[#A8342C]' : 'text-muted'
          }`}
          role={touched && !valid ? 'alert' : undefined}
        >
          {touched && !valid
            ? '至少需要 8 个字符，现在有 ' + v.length + ' 个'
            : '至少 8 个字符'}
        </p>
        {touched && valid && (
          <p className="mt-1 flex items-center gap-1 text-[0.8125rem] text-[#2C7355]">
            <Check size={13} aria-hidden="true" />
            强度足够
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Progressive Disclosure ---------------- */

export function ProgressiveDisclosureDemo() {
  const [expanded, setExpanded] = useState(false);

  return (
    <DemoStage caption="默认只给摘要。用户点开才看到明细 —— 这能显著降低「选择过载」。">
      <div className="mx-auto w-full max-w-[400px] rounded-xl border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink2">订单合计</span>
          <span className="text-lg font-semibold tabular-nums text-ink">¥128</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-2 text-xs text-ink underline-offset-4 hover:underline"
        >
          {expanded ? '收起明细' : '查看明细'}
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-200 ${
            expanded ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1.5 border-t border-line2 pt-3 text-xs text-muted">
              {[
                ['相框 · 原木色 × 1', '¥68'],
                ['冲印服务 · 20 张', '¥45'],
                ['优惠券', '−¥15'],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span>{k}</span>
                  <span className="tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}
