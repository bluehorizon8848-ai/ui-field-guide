'use client';

import { useId, useRef, useState } from 'react';
import { Archive, Check, Heart, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

/* ---------------- Swipe Action ---------------- */

const SWIPE_ITEMS = [
  { id: 1, tKey: 'demo.interaction.swipe.mail', time: '9:41', sKey: null },
  { id: 2, tKey: 'demo.interaction.swipe.report', time: '', sKey: 'demo.interaction.swipe.yesterday' },
  { id: 3, tKey: 'demo.interaction.swipe.bill', time: '', sKey: 'demo.interaction.swipe.yesterday' },
] as const;

export function SwipeActionDemo() {
  const locale = useLocale();
  const [revealed, setRevealed] = useState<number | null>(null);
  const [removed, setRemoved] = useState<number[]>([]);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const decided = useRef<'none' | 'h' | 'v'>('none');

  const remaining = SWIPE_ITEMS.filter((i) => !removed.includes(i.id));

  return (
    <DemoStage caption={t(locale, 'demo.interaction.caption.swipe')}>
      <div className="mx-auto w-full max-w-[400px]">
        <ul className="overflow-hidden rounded-xl border border-line">
          {remaining.length === 0 && (
            <li className="bg-surface px-4 py-6 text-center text-xs text-muted">
              {t(locale, 'demo.interaction.swipe.empty')}
            </li>
          )}
          {remaining.map((item) => {
            const open = revealed === item.id;
            const title = t(locale, item.tKey);
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
                    <span className="sr-only">
                      {t(locale, 'demo.interaction.swipe.deleteItem', { name: title })}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex w-[72px] items-center justify-center bg-[#35618E] text-white"
                  >
                    <Archive size={17} aria-hidden="true" />
                    <span className="sr-only">
                      {t(locale, 'demo.interaction.swipe.archiveItem', { name: title })}
                    </span>
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
                    <span className="block truncate text-[0.8125rem] text-ink">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {item.time || t(locale, item.sKey!)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRevealed(open ? null : item.id)}
                    aria-label={t(locale, 'demo.interaction.swipe.more')}
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
            {t(locale, 'demo.interaction.swipe.undo', { n: removed.length })}
          </button>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Pull to Refresh ---------------- */

const REFRESH_ITEMS = [
  'demo.interaction.refresh.item1',
  'demo.interaction.refresh.item2',
  'demo.interaction.refresh.item3',
] as const;

export function PullToRefreshDemo() {
  const locale = useLocale();
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
    <DemoStage caption={t(locale, 'demo.interaction.caption.refresh')}>
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
              ? t(locale, 'demo.interaction.refresh.refreshing')
              : resistance > 0
                ? resistance >= THRESHOLD
                  ? t(locale, 'demo.interaction.refresh.release')
                  : t(locale, 'demo.interaction.refresh.pullMore')
                : t(locale, 'demo.interaction.refresh.hint')}
          </p>
          <div className="mt-3 space-y-2">
            {REFRESH_ITEMS.map((key) => (
              <div
                key={key}
                className="rounded-lg border border-line px-3 py-2.5 text-[0.8125rem] text-ink2"
              >
                {t(locale, key)}
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
  const locale = useLocale();
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
    { id: 'a', tKey: 'demo.interaction.longPress.name1' },
    { id: 'b', tKey: 'demo.interaction.longPress.name2' },
    { id: 'c', tKey: 'demo.interaction.longPress.name3' },
  ] as const;

  const MENU = [
    { id: 'edit', tKey: 'demo.interaction.longPress.edit' },
    { id: 'share', tKey: 'demo.interaction.longPress.share' },
    { id: 'delete', tKey: 'demo.interaction.longPress.delete' },
  ] as const;

  return (
    <DemoStage caption={t(locale, 'demo.interaction.caption.longPress')}>
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
                <p className="text-[0.8125rem] text-ink">{t(locale, it.tKey)}</p>
              </div>

              {pressed === `${it.id}:menu` && (
                <div className="absolute inset-x-4 top-full z-10 mt-1 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in">
                  {MENU.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPressed(null)}
                      className={`w-full px-3 py-2 text-left text-[0.8125rem] transition-colors hover:bg-[#F5F3EE] ${
                        m.id === 'delete' ? 'text-[#A8342C]' : 'text-ink2'
                      }`}
                    >
                      {t(locale, m.tKey)}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center text-xs text-muted" role="status" aria-live="polite">
          {pressed?.endsWith(':menu')
            ? t(locale, 'demo.interaction.longPress.menuOpen')
            : t(locale, 'demo.interaction.longPress.hint')}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Drag & Drop ---------------- */

const COL_DEFS = [
  { id: 'todo', labelKey: 'demo.interaction.drag.todo', itemKeys: ['demo.interaction.drag.item1', 'demo.interaction.drag.item2'] },
  { id: 'doing', labelKey: 'demo.interaction.drag.doing', itemKeys: ['demo.interaction.drag.item3'] },
  { id: 'done', labelKey: 'demo.interaction.drag.done', itemKeys: ['demo.interaction.drag.item4', 'demo.interaction.drag.item5'] },
] as const;

export function DragDropDemo() {
  const locale = useLocale();
  const [cols, setCols] = useState(() =>
    COL_DEFS.map((c) => ({ ...c, items: [...c.itemKeys] }))
  );
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
    <DemoStage caption={t(locale, 'demo.interaction.caption.drag')}>
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
            <p className="meta mb-2 px-0.5">{t(locale, col.labelKey)}</p>
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
                  {t(locale, item)}
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
  const locale = useLocale();
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
    <DemoStage caption={t(locale, 'demo.interaction.caption.optimistic')}>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-sm text-ink">{t(locale, 'demo.interaction.optimistic.item')}</p>
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
          {t(locale, 'demo.interaction.optimistic.failNext')}
        </label>

        <p className="text-center text-xs text-muted" role="status" aria-live="polite">
          {pending
            ? t(locale, 'demo.interaction.optimistic.pending')
            : liked
              ? t(locale, 'demo.interaction.optimistic.liked')
              : t(locale, 'demo.interaction.optimistic.unliked')}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Inline Validation ---------------- */

export function InlineValidationDemo() {
  const locale = useLocale();
  const [v, setV] = useState('');
  const [touched, setTouched] = useState(false);
  const uid = useId();
  const pwId = `${uid}-pw`;
  const pwHintId = `${uid}-pw-hint`;
  const valid = v.length >= 8;

  return (
    <DemoStage caption={t(locale, 'demo.interaction.caption.validation')}>
      <div className="mx-auto w-full max-w-[380px]">
        <label htmlFor={pwId} className="mb-1.5 block text-sm text-ink2">
          {t(locale, 'demo.interaction.validation.label')}
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
            ? t(locale, 'demo.interaction.validation.error', { n: v.length })
            : t(locale, 'demo.interaction.validation.hint')}
        </p>
        {touched && valid && (
          <p className="mt-1 flex items-center gap-1 text-[0.8125rem] text-[#2C7355]">
            <Check size={13} aria-hidden="true" />
            {t(locale, 'demo.interaction.validation.ok')}
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Progressive Disclosure ---------------- */

// Amounts stay in ¥: this is a Chinese-market product mock, so the currency is
// part of the scenario rather than something to localise.
const DISCLOSURE_ITEMS = [
  ['demo.interaction.disclosure.item1', '¥68'],
  ['demo.interaction.disclosure.item2', '¥45'],
  ['demo.interaction.disclosure.item3', '−¥15'],
] as const;

export function ProgressiveDisclosureDemo() {
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);

  return (
    <DemoStage caption={t(locale, 'demo.interaction.caption.disclosure')}>
      <div className="mx-auto w-full max-w-[400px] rounded-xl border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink2">
            {t(locale, 'demo.interaction.disclosure.total')}
          </span>
          <span className="text-lg font-semibold tabular-nums text-ink">¥128</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-2 text-xs text-ink underline-offset-4 hover:underline"
        >
          {expanded
            ? t(locale, 'demo.interaction.disclosure.hide')
            : t(locale, 'demo.interaction.disclosure.show')}
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-200 ${
            expanded ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1.5 border-t border-line2 pt-3 text-xs text-muted">
              {DISCLOSURE_ITEMS.map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span>{t(locale, k)}</span>
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
