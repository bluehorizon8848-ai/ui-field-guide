'use client';

import { useState } from 'react';
import { Calendar, Check, ChevronDown, Home, Image as ImageIcon, Star, User } from 'lucide-react';
import { DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

/* ---------------- List ---------------- */

export function ListDemo() {
  const locale = useLocale();
  const [active, setActive] = useState<string | null>(null);

  const ITEMS = [
    { id: 'photos', icon: ImageIcon, labelKey: 'demo.data.list.photos', valueKey: 'demo.data.list.photosValue' },
    { id: 'favorites', icon: Star, labelKey: 'demo.data.list.favorites', valueKey: 'demo.data.list.favoritesValue' },
    { id: 'shared', icon: User, labelKey: 'demo.data.list.shared', valueKey: 'demo.data.list.sharedValue' },
    { id: 'family', icon: Home, labelKey: 'demo.data.list.family', valueKey: 'demo.data.list.familyValue' },
  ] as const;

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.list')}>
      <ul className="mx-auto w-full max-w-[380px] overflow-hidden rounded-xl border border-line">
        {ITEMS.map(({ id, icon: Icon, labelKey, valueKey }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => setActive(active === id ? null : id)}
              aria-current={active === id ? 'true' : undefined}
              className={`flex w-full items-center gap-3 border-b border-line px-4 py-3.5 text-left transition-colors last:border-b-0 ${
                active === id ? 'bg-[#F2F0EB]' : 'hover:bg-[#F7F5F0]'
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F0EB] text-ink2">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm text-ink">{t(locale, labelKey)}</span>
              <span className="text-[0.8125rem] text-muted">{t(locale, valueKey)}</span>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className="-rotate-90 text-[#C9C5BB]"
              />
            </button>
          </li>
        ))}
      </ul>
    </DemoStage>
  );
}

/* ---------------- Table ---------------- */

export function TableDemo() {
  const locale = useLocale();
  const [sort, setSort] = useState<'name' | 'size'>('size');

  const ROWS = [
    { name: 'IMG_0231.jpg', size: 3.2, typeKey: 'demo.data.table.photo', status: 'cleaned', statusKey: 'demo.data.table.cleaned' },
    { name: 'DSC_4478.jpg', size: 4.8, typeKey: 'demo.data.table.photo', status: 'kept', statusKey: 'demo.data.table.kept' },
    { name: 'clip_01.mp4', size: 128.5, typeKey: 'demo.data.table.video', status: 'cleaned', statusKey: 'demo.data.table.cleaned' },
    { name: 'screen.png', size: 0.4, typeKey: 'demo.data.table.shot', status: 'ignored', statusKey: 'demo.data.table.ignored' },
  ] as const;

  const sorted = [...ROWS].sort((a, b) =>
    sort === 'size' ? a.size - b.size : a.name.localeCompare(b.name)
  );

  const badge: Record<string, string> = {
    cleaned: 'bg-[#E6F2EC] text-[#2C7355]',
    kept: 'bg-[#F2F0EB] text-ink2',
    ignored: 'bg-[#F2F0EB] text-muted',
  };

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.table')}>
      <div className="table-scroll w-full max-w-[500px] overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-2xs">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-line bg-[#FAF9F6]">
              <th scope="col" className="py-1 px-3 text-left">
                <button
                  type="button"
                  onClick={() => setSort('name')}
                  className="flex min-h-[36px] items-center gap-1 text-xs font-semibold text-muted transition-colors hover:text-ink"
                >
                  {t(locale, 'demo.data.table.name')}
                  {sort === 'name' && <span aria-hidden="true">↓</span>}
                </button>
              </th>
              <th scope="col" className="pb-2 pr-3 text-right">
                <button
                  type="button"
                  onClick={() => setSort('size')}
                  className="-mx-1.5 flex min-h-[44px] items-center gap-1 rounded px-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
                >
                  {t(locale, 'demo.data.table.size')}
                  {sort === 'size' && <span aria-hidden="true">↓</span>}
                </button>
              </th>
              <th scope="col" className="pb-2 pr-3 text-left text-xs font-medium text-muted">
                {t(locale, 'demo.data.table.type')}
              </th>
              <th scope="col" className="pb-2 text-left text-xs font-medium text-muted">
                {t(locale, 'demo.data.table.status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-b border-line2 last:border-b-0 hover:bg-[#FCFBF8]">
                <td className="py-2.5 pr-3 text-[0.8125rem] text-ink">{r.name}</td>
                <td className="py-2.5 pr-3 text-right text-[0.8125rem] tabular-nums text-ink2">
                  {r.size} MB
                </td>
                <td className="py-2.5 pr-3 text-[0.8125rem] text-muted">
                  {t(locale, r.typeKey)}
                </td>
                <td className="py-2.5">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-2xs font-medium ${badge[r.status]}`}
                  >
                    {t(locale, r.statusKey)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoStage>
  );
}

/* ---------------- Badge ---------------- */

export function BadgeDemo() {
  const locale = useLocale();
  const [counts, setCounts] = useState({ msg: 5, file: 128, cart: 0 });

  const items = [
    { k: 'msg' as const, labelKey: 'demo.data.badge.msg', icon: <User size={18} /> },
    { k: 'file' as const, labelKey: 'demo.data.badge.file', icon: <ImageIcon size={18} /> },
    { k: 'cart' as const, labelKey: 'demo.data.badge.cart', icon: <Star size={18} /> },
  ] as const;

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.badge')}>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {items.map((it) => {
          const n = counts[it.k];
          return (
            <button
              key={it.k}
              type="button"
              onClick={() =>
                setCounts((c) => ({
                  ...c,
                  [it.k]: c[it.k] >= 130 ? 0 : c[it.k] + 1,
                }))
              }
              className="relative flex flex-col items-center gap-2"
              aria-label={t(locale, 'demo.data.badge.aria', {
                name: t(locale, it.labelKey),
                n,
              })}
            >
              <span className="relative text-ink2">
                {it.icon}
                {n > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#A8342C] px-1 text-[9px] font-semibold text-white">
                    {n > 99 ? '99+' : n}
                  </span>
                )}
              </span>
              <span className="text-xs text-muted">{t(locale, it.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </DemoStage>
  );
}

/* ---------------- Tag ---------------- */

export function TagDemo() {
  const locale = useLocale();
  const tags = [
    { labelKey: 'demo.data.tag.video', cls: 'bg-[#EEF3F8] text-[#35618E]' },
    { labelKey: 'demo.data.tag.saved', cls: 'bg-[#F8F2E4] text-[#94701C]' },
    { labelKey: 'demo.data.tag.edited', cls: 'bg-[#F2F0EB] text-muted' },
    { labelKey: 'demo.data.tag.original', cls: 'bg-[#ECF5F0] text-[#2C7355]' },
  ] as const;

  const names = [
    t(locale, 'demo.data.tag.name1'),
    t(locale, 'demo.data.tag.name2'),
    t(locale, 'demo.data.tag.name3'),
  ];

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.tag')}>
      <div className="mx-auto w-full max-w-[400px] space-y-2.5">
        {names.map((name, i) => (
          <div
            key={name}
            className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3.5 py-3"
          >
            <span className="min-w-0 truncate text-[0.8125rem] text-ink">{name}</span>
            <span className="flex shrink-0 gap-1.5">
              {tags.slice(0, (i % 2) + 1).map((tag) => (
                <span
                  key={tag.labelKey}
                  className={`rounded-full px-2 py-0.5 text-2xs font-medium ${tag.cls}`}
                >
                  {t(locale, tag.labelKey)}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

/* ---------------- Stat Card ---------------- */

export function StatCardDemo() {
  const locale = useLocale();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

  const STATS = {
    day: [
      {
        label: t(locale, 'demo.data.stat.newToday'),
        value: '1,284',
        delta: '+12.4%',
        up: true,
        points: '0,28 15,24 30,26 45,18 60,14 75,10 90,4',
        stroke: '#1D734C',
        fill: '#E8F3ED',
      },
      {
        label: t(locale, 'demo.data.stat.active'),
        value: '8,420',
        delta: '-3.2%',
        up: false,
        points: '0,8 15,12 30,10 45,20 60,18 75,25 90,26',
        stroke: '#DC2626',
        fill: '#FEF2F2',
      },
      {
        label: t(locale, 'demo.data.stat.conversion'),
        value: '4.2%',
        delta: '+0.8%',
        up: true,
        points: '0,22 15,18 30,20 45,16 60,12 75,14 90,8',
        stroke: '#2563EB',
        fill: '#EFF6FF',
      },
      {
        label: t(locale, 'demo.data.stat.cleanedToday'),
        value: '128',
        delta: '0.0%',
        up: null,
        points: '0,16 15,16 30,16 45,16 60,16 75,16 90,16',
        stroke: '#8C887E',
        fill: '#F4F2EC',
      },
    ],
    week: [
      {
        label: t(locale, 'demo.data.stat.newToday'),
        value: '8,920',
        delta: '+24.8%',
        up: true,
        points: '0,30 15,22 30,18 45,16 60,10 75,8 90,2',
        stroke: '#1D734C',
        fill: '#E8F3ED',
      },
      {
        label: t(locale, 'demo.data.stat.active'),
        value: '42,150',
        delta: '+6.5%',
        up: true,
        points: '0,24 15,20 30,22 45,14 60,12 75,8 90,4',
        stroke: '#1D734C',
        fill: '#E8F3ED',
      },
      {
        label: t(locale, 'demo.data.stat.conversion'),
        value: '4.6%',
        delta: '+1.2%',
        up: true,
        points: '0,20 15,16 30,18 45,14 60,10 75,10 90,6',
        stroke: '#2563EB',
        fill: '#EFF6FF',
      },
      {
        label: t(locale, 'demo.data.stat.cleanedToday'),
        value: '960',
        delta: '+18%',
        up: true,
        points: '0,26 15,22 30,18 45,14 60,12 75,8 90,4',
        stroke: '#1D734C',
        fill: '#E8F3ED',
      },
    ],
    month: [
      {
        label: t(locale, 'demo.data.stat.newToday'),
        value: '36,400',
        delta: '+48.2%',
        up: true,
        points: '0,32 15,25 30,20 45,15 60,10 75,6 90,2',
        stroke: '#1D734C',
        fill: '#E8F3ED',
      },
      {
        label: t(locale, 'demo.data.stat.active'),
        value: '184,200',
        delta: '+14.1%',
        up: true,
        points: '0,28 15,22 30,18 45,16 60,12 75,8 90,3',
        stroke: '#1D734C',
        fill: '#E8F3ED',
      },
      {
        label: t(locale, 'demo.data.stat.conversion'),
        value: '5.1%',
        delta: '+2.4%',
        up: true,
        points: '0,22 15,18 30,16 45,12 60,8 75,6 90,2',
        stroke: '#2563EB',
        fill: '#EFF6FF',
      },
      {
        label: t(locale, 'demo.data.stat.cleanedToday'),
        value: '4,120',
        delta: '+32%',
        up: true,
        points: '0,28 15,24 30,20 45,16 60,10 75,8 90,2',
        stroke: '#1D734C',
        fill: '#E8F3ED',
      },
    ],
  };

  const currentStats = STATS[period];

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.stat')}>
      <div className="w-full max-w-[620px] space-y-3.5">
        {/* 时间范围切换器 */}
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-2xs font-semibold tracking-wider text-muted uppercase">
            Performance Overview
          </span>
          <div className="flex rounded-lg border border-line bg-surface p-0.5 shadow-2xs">
            {(
              [
                { id: 'day', label: 'Today' },
                { id: 'week', label: '7 Days' },
                { id: 'month', label: '30 Days' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPeriod(item.id)}
                className={`rounded-md px-2.5 py-1 text-2xs font-medium transition-all ${
                  period === item.id
                    ? 'bg-ink text-white shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 现代指标卡片网格 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {currentStats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-line bg-surface p-3.5 shadow-2xs transition-all hover:border-[#D8D4CA] hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-2xs font-medium text-muted">{s.label}</span>
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold tabular-nums ${
                    s.up === true
                      ? 'bg-[#E8F3ED] text-[#1D734C]'
                      : s.up === false
                        ? 'bg-[#FEF2F2] text-[#DC2626]'
                        : 'bg-[#F4F2EC] text-[#767269]'
                  }`}
                >
                  {s.delta}
                </span>
              </div>

              <div className="my-2">
                <span className="font-sans text-xl font-bold tracking-tight tabular-nums text-ink sm:text-2xl">
                  {s.value}
                </span>
              </div>

              {/* 迷你平滑走势图 (Sparkline) */}
              <div className="h-7 w-full overflow-hidden pt-1">
                <svg viewBox="0 0 90 32" className="h-full w-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={s.stroke}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={s.points}
                  />
                  <circle
                    cx="90"
                    cy={s.points.split(' ').slice(-1)[0].split(',')[1]}
                    r="2.5"
                    fill={s.stroke}
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Avatar ---------------- */

export function AvatarDemo() {
  const locale = useLocale();
  const PEOPLE = [
    { nameKey: 'demo.data.avatar.name1', url: 'linear-gradient(135deg,#DCE6EF,#E9E2D4)' },
    { nameKey: 'demo.data.avatar.name2', url: 'linear-gradient(135deg,#E2EAE4,#EFE1E1)' },
    { nameKey: 'demo.data.avatar.name3', url: 'linear-gradient(135deg,#EFE1E1,#E4E2EF)' },
    { nameKey: 'demo.data.avatar.name4', url: 'linear-gradient(135deg,#E9E2D4,#DCE6EF)' },
  ] as const;

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.avatar')}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          {PEOPLE.map((p) => {
            const name = t(locale, p.nameKey);
            return (
            <span key={p.nameKey} className="flex flex-col items-center gap-1.5">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium text-ink2 ring-2 ring-white"
                style={{ background: p.url }}
                role="img"
                aria-label={name}
              >
                {name[0]}
              </span>
              <span className="text-2xs text-muted">{name}</span>
            </span>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted">
          {t(locale, 'demo.data.avatar.note')}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Timeline ---------------- */

export function TimelineDemo() {
  const locale = useLocale();
  const GROUPS = [
    {
      labelKey: 'demo.data.timeline.today',
      items: [
        { tKey: 'demo.data.timeline.1', time: '14:20' },
        { tKey: 'demo.data.timeline.2', time: '10:05' },
        { tKey: 'demo.data.timeline.3', time: '09:12' },
      ],
    },
    {
      labelKey: 'demo.data.timeline.yesterday',
      items: [
        { tKey: 'demo.data.timeline.4', time: '21:40' },
        { tKey: 'demo.data.timeline.5', time: '16:22' },
      ],
    },
  ] as const;

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.timeline')}>
      <div className="mx-auto w-full max-w-[400px]">
        {GROUPS.map((g, gi) => (
          <div key={g.labelKey} className="mb-5 last:mb-0">
            <p className="meta sticky top-0 z-10 bg-surface py-1.5">
              {t(locale, g.labelKey)}
            </p>
            <div className="relative mt-1 space-y-3.5 pl-6">
              <span
                className="absolute left-[5px] top-1.5 h-[calc(100%-1rem)] w-px bg-line"
                aria-hidden="true"
              />
              {g.items.map((it) => (
                <div key={it.tKey} className="relative">
                  <span
                    className="absolute -left-6 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-surface bg-ink"
                    aria-hidden="true"
                  />
                  <p className="text-[0.8125rem] leading-snug text-ink">
                    {t(locale, it.tKey)}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-muted">{it.time}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

/* ---------------- Date Picker ---------------- */

export function DatePickerDemo() {
  const locale = useLocale();
  const [selected, setSelected] = useState<number | null>(12);
  const [month, setMonth] = useState(0); // 0 = 本月

  const today = 14;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.date')}>
      <div className="mx-auto w-full max-w-[300px]">
        <div className="rounded-xl border border-line bg-surface p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth((m) => Math.max(0, m - 1))}
              disabled={month === 0}
              className="rounded p-1 text-muted transition-colors hover:bg-[#F2F0EB] disabled:opacity-30"
              aria-label={t(locale, 'demo.data.date.prev')}
            >
              ‹
            </button>
            <span className="text-sm font-medium text-ink">
              {month === 0
                ? t(locale, 'demo.data.date.month3')
                : t(locale, 'demo.data.date.month2')}
            </span>
            <button
              type="button"
              onClick={() => setMonth((m) => Math.min(1, m + 1))}
              disabled={month === 1}
              className="rounded p-1 text-muted transition-colors hover:bg-[#F2F0EB] disabled:opacity-30"
              aria-label={t(locale, 'demo.data.date.next')}
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {Array.from(t(locale, 'demo.data.date.weekdays')).map((d, i) => (
              <span key={`${d}-${i}`} className="py-1 text-2xs text-muted">
                {d}
              </span>
            ))}
            {days.map((d) => {
              const past = month === 0 && d < today;
              const isToday = month === 0 && d === today;
              const isSel = selected === d && month === 0;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={past}
                  onClick={() => setSelected(d)}
                  className={`relative flex h-8 items-center justify-center rounded-lg text-[0.8125rem] tabular-nums transition-colors ${
                    isSel
                      ? 'bg-ink font-medium text-white'
                      : past
                        ? 'cursor-not-allowed text-[#C9C5BB]'
                        : 'text-ink hover:bg-[#F2F0EB]'
                  } ${isToday && !isSel ? 'ring-1 ring-inset ring-ink' : ''}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2.5 text-center text-xs text-muted">
          {selected
            ? t(locale, 'demo.data.date.picked', {
                m: month === 0 ? 3 : 2,
                d: selected,
              })
            : t(locale, 'demo.data.date.none')}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Popover ---------------- */

const POPOVER_ITEMS = [
  { icon: Calendar, labelKey: 'demo.data.popover.timeline' },
  { icon: ImageIcon, labelKey: 'demo.data.popover.triple' },
  { icon: Star, labelKey: 'demo.data.popover.rating' },
] as const;

export function PopoverDemo() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.popover')}>
      <div className="flex min-h-[220px] items-center justify-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-[#F5F3EE]"
          >
            {t(locale, 'demo.data.popover.trigger')}
            <ChevronDown size={14} aria-hidden="true" className="text-muted" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
              <div
                role="menu"
                className="absolute left-0 top-full z-20 mt-1.5 w-52 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in"
              >
                {POPOVER_ITEMS.map(({ icon: Icon, labelKey }) => (
                  <button
                    key={labelKey}
                    type="button"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.8125rem] text-ink2 transition-colors hover:bg-[#F5F3EE]"
                  >
                    <Icon size={14} className="text-muted" aria-hidden="true" />
                    {t(locale, labelKey)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Context Menu ---------------- */

// The ⌘C hint keys off the item id, not its label, so it survives translation.
const CONTEXT_MENU_ITEMS = [
  ['copy', 'demo.data.menu.copy'],
  ['move', 'demo.data.menu.move'],
  ['rename', 'demo.data.menu.rename'],
  ['link', 'demo.data.menu.link'],
] as const;

export function ContextMenuDemo() {
  const locale = useLocale();
  const [pos, setPos] = useState<{ x: number | string; y: number | string } | null>(null);

  return (
    <DemoStage caption={t(locale, 'demo.data.caption.menu')}>
      <div
        className="relative flex min-h-[220px] flex-wrap items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-[#FCFBF8] p-4"
        onContextMenu={(e) => {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
      >
        <p className="select-none text-sm text-ink2">{t(locale, 'demo.data.menu.hint')}</p>
        <button
          type="button"
          onClick={() => setPos({ x: '50%', y: 60 })}
          className="rounded-md border border-line bg-surface px-2.5 py-1 text-2xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
        >
          {t(locale, 'demo.data.menu.simulate')}
        </button>

        {pos && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setPos(null)} onContextMenu={(e) => { e.preventDefault(); setPos(null); }} aria-hidden="true" />
            <div
              role="menu"
              style={{
                left: typeof pos.x === 'number' ? `${pos.x}px` : pos.x,
                top: typeof pos.y === 'number' ? `${pos.y}px` : pos.y,
              }}
              className="absolute z-20 w-44 -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in"
            >
              {CONTEXT_MENU_ITEMS.map(([id, labelKey]) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  onClick={() => setPos(null)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[0.8125rem] text-ink2 transition-colors hover:bg-[#F5F3EE]"
                >
                  {t(locale, labelKey)}
                  {id === 'copy' && <span className="text-2xs text-muted">⌘C</span>}
                </button>
              ))}
              <div className="my-1 h-px bg-line" role="separator" />
              <button
                type="button"
                role="menuitem"
                onClick={() => setPos(null)}
                className="flex w-full items-center px-3 py-1.5 text-left text-[0.8125rem] text-[#A8342C] transition-colors hover:bg-[#FAEDEC]"
              >
                {t(locale, 'demo.data.menu.delete')}
              </button>
            </div>
          </>
        )}
      </div>
    </DemoStage>
  );
}
