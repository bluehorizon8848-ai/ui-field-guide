'use client';

import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, House, Image as ImageIcon, User } from 'lucide-react';
import { DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

/* ---------------- Breadcrumb ---------------- */

export function BreadcrumbDemo() {
  const locale = useLocale();
  const [depth, setDepth] = useState(3);
  const path = [t(locale, 'demo.nav.breadcrumb.album'), '2026', 'IMG_0231'].slice(0, depth);

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.breadcrumb')}>
      <nav aria-label={t(locale, 'demo.nav.breadcrumb.aria')} className="min-w-0">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {path.map((item, i) => {
            const isLast = i === path.length - 1;
            return (
              <li key={item} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="select-none text-[#C9C5BB]">
                    ›
                  </span>
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="block max-w-[150px] truncate rounded px-1 py-0.5 font-medium text-ink"
                  >
                    {item}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDepth(i + 1)}
                    className="rounded px-1 py-0.5 text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {item}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <p className="mt-4 text-xs text-muted">
        {t(locale, 'demo.nav.breadcrumb.level')}{' '}
        <span className="text-ink2">{path.join(' / ')}</span>
        {depth < 3 && (
          <button
            type="button"
            onClick={() => setDepth(3)}
            className="ml-2 text-ink2 underline underline-offset-4 hover:text-ink"
          >
            {t(locale, 'demo.nav.breadcrumb.deep')}
          </button>
        )}
      </p>
    </DemoStage>
  );
}

/* ---------------- Tabs ---------------- */

export function TabsDemo() {
  const locale = useLocale();
  const [tab, setTab] = useState('posts');

  const TABS = [
    { k: 'posts', label: t(locale, 'demo.nav.tabs.home') },
    { k: 'works', label: t(locale, 'demo.nav.tabs.works') },
    { k: 'likes', label: t(locale, 'demo.nav.tabs.likes') },
    { k: 'saved', label: t(locale, 'demo.nav.tabs.saved') },
  ];

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.tabs')}>
      <div>
        <div
          role="tablist"
          aria-label={t(locale, 'demo.nav.tabs.aria')}
          className="flex gap-1 border-b border-line"
        >
          {TABS.map((item) => (
            <button
              key={item.k}
              type="button"
              role="tab"
              id={`tab-${item.k}`}
              aria-selected={tab === item.k}
              aria-controls={`panel-${item.k}`}
              onClick={() => setTab(item.k)}
              className={`relative -mb-px whitespace-nowrap px-3.5 py-2.5 text-sm transition-colors ${
                tab === item.k ? 'font-medium text-ink' : 'text-muted hover:text-ink2'
              }`}
            >
              {item.label}
              {tab === item.k && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ink" />
              )}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="py-4"
        >
          {(() => {
            const CONTENT: Record<string, string[]> = {
              posts: [
                t(locale, 'demo.nav.tabs.post1'),
                t(locale, 'demo.nav.tabs.post2'),
                t(locale, 'demo.nav.tabs.post3'),
              ],
              works: [
                t(locale, 'demo.nav.tabs.work1'),
                t(locale, 'demo.nav.tabs.work2'),
                t(locale, 'demo.nav.tabs.work3'),
              ],
              likes: [
                t(locale, 'demo.nav.tabs.like1'),
                t(locale, 'demo.nav.tabs.like2'),
                t(locale, 'demo.nav.tabs.like3'),
              ],
              saved: [
                t(locale, 'demo.nav.tabs.save1'),
                t(locale, 'demo.nav.tabs.save2'),
                t(locale, 'demo.nav.tabs.save3'),
              ],
            };
            const content = CONTENT[tab] ?? [];
            return (
              <ul className="space-y-2">
                {content.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8125rem] text-ink2"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9C5BB]" />
                    {c}
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Bottom Navigation ---------------- */

export function BottomNavigationDemo() {
  const locale = useLocale();
  const [active, setActive] = useState('home');

  const ITEMS = [
    { k: 'home', label: t(locale, 'demo.nav.bottom.home'), icon: House },
    { k: 'album', label: t(locale, 'demo.nav.bottom.album'), icon: ImageIcon, badge: 5 },
    { k: 'me', label: t(locale, 'demo.nav.bottom.me'), icon: User },
  ];

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.bottom')}>
      <div className="mx-auto w-full max-w-[320px]">
        <div className="mb-3 h-16 rounded-lg border border-dashed border-line bg-[#FCFBF8]" />
        <nav
          aria-label={t(locale, 'nav.main')}
          className="flex items-stretch border-t border-line bg-surface pt-1.5"
        >
          {ITEMS.map((it) => {
            const on = active === it.k;
            const Icon = it.icon;
            return (
              <button
                key={it.k}
                type="button"
                onClick={() => setActive(it.k)}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-1 flex-col items-center gap-1 py-1.5 transition-colors ${
                  on ? 'text-ink' : 'text-muted'
                }`}
              >
                <span className="relative">
                  <Icon size={21} aria-hidden="true" strokeWidth={on ? 2.2 : 1.8} />
                  {it.badge && (
                    <span className="absolute -right-1.5 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#A8342C] px-1 text-[9px] font-semibold text-white">
                      {it.badge}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] ${on ? 'font-medium' : ''}`}>{it.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </DemoStage>
  );
}

/* ---------------- Navigation Rail / Sidebar ---------------- */

export function SidebarDemo() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('overview');

  const ITEMS = [
    { k: 'overview', label: t(locale, 'demo.nav.sidebar.overview') },
    { k: 'library', label: t(locale, 'demo.nav.sidebar.library') },
    { k: 'album', label: t(locale, 'demo.nav.sidebar.album') },
    { k: 'trash', label: t(locale, 'demo.nav.sidebar.trash') },
    { k: 'settings', label: t(locale, 'demo.nav.sidebar.settings') },
  ];

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.sidebar')}>
      <div className="flex min-h-[240px] flex-col overflow-hidden rounded-xl border border-line sm:flex-row">
        <nav
          aria-label={t(locale, 'demo.nav.sidebar.aria')}
          className={`flex shrink-0 flex-row border-b border-line bg-[#FCFBF8] transition-[width] duration-200 sm:flex-col sm:border-b-0 sm:border-r ${
            open ? 'w-full sm:w-[150px]' : 'w-full sm:w-[60px]'
          }`}
        >
          <div className="flex h-11 shrink-0 items-center border-b border-line px-3 sm:border-b-0">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-[10px] font-semibold text-white">
              {t(locale, 'demo.nav.sidebar.mark')}
            </span>
            {open && (
              <span className="ml-2 text-xs font-medium text-ink">
                {t(locale, 'demo.nav.sidebar.app')}
              </span>
            )}
          </div>
          <ul className="flex flex-1 gap-1 overflow-x-auto p-1.5 sm:flex-col sm:overflow-x-visible">
            {ITEMS.map((it) => (
              <li key={it.k} className="shrink-0 sm:shrink">
                <button
                  type="button"
                  onClick={() => setActive(it.k)}
                  aria-current={active === it.k ? 'page' : undefined}
                  aria-label={open ? it.label : undefined}
                  title={it.label}
                  className={`flex min-h-[44px] w-full min-w-[44px] items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.8125rem] transition-colors ${
                    active === it.k
                      ? 'bg-[#EFEDE7] font-medium text-ink'
                      : 'text-ink2 hover:bg-[#F2F0EB] active:bg-[#EDEae3]'
                  }`}
                >
                  <span className="h-4 w-4 shrink-0 rounded bg-[#D8D5CD]" aria-hidden="true" />
                  {open && <span className="truncate">{it.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-11 items-center border-b border-line px-3">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="-my-1.5 flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md px-2 text-xs text-ink2 transition-colors hover:bg-[#F2F0EB] active:bg-[#EDEae3]"
            >
              {t(locale, 'demo.nav.sidebar.toggle')}
            </button>
            <span className="ml-2 text-xs text-muted">
              {open
                ? t(locale, 'demo.nav.sidebar.expanded')
                : t(locale, 'demo.nav.sidebar.collapsed')}
            </span>
          </div>
          <div className="grid-lines flex flex-1 items-center justify-center p-4">
            <p className="text-xs text-muted">{t(locale, 'demo.nav.sidebar.content')}</p>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Stepper ---------------- */

export function StepperDemo() {
  const locale = useLocale();
  const [current, setCurrent] = useState(1);

  const STEPS = [
    t(locale, 'demo.nav.stepper.cart'),
    t(locale, 'demo.nav.stepper.address'),
    t(locale, 'demo.nav.stepper.pay'),
    t(locale, 'demo.nav.stepper.done'),
  ];

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.stepper')}>
      <div className="w-full">
        <ol className="flex items-center" aria-label={t(locale, 'demo.nav.stepper.aria')}>
          {STEPS.map((s, i) => {
            const state = i < current ? 'done' : i === current ? 'active' : 'upcoming';
            return (
              <li key={s} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  disabled={state === 'upcoming'}
                  onClick={() => setCurrent(i)}
                  aria-current={state === 'active' ? 'step' : undefined}
                  className="flex shrink-0 flex-col items-center gap-1.5 disabled:cursor-default"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                      state === 'done'
                        ? 'border-ink bg-ink text-white'
                        : state === 'active'
                          ? 'border-ink bg-surface text-ink'
                          : 'border-line bg-surface text-[#C9C5BB]'
                    }`}
                  >
                    {state === 'done' ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : i + 1}
                  </span>
                  <span
                    className={`whitespace-nowrap text-[0.6875rem] ${
                      state === 'upcoming' ? 'text-[#C9C5BB]' : state === 'active' ? 'font-medium text-ink' : 'text-muted'
                    }`}
                  >
                    {s}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span
                    className={`mx-2 mb-5 h-px flex-1 transition-colors ${
                      i < current ? 'bg-ink' : 'bg-line'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-center text-xs text-muted">
          {t(locale, 'demo.nav.stepper.progress', { n: current + 1, m: STEPS.length })}{' '}
          · {STEPS[current]}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Pagination ---------------- */

export function PaginationDemo() {
  const locale = useLocale();
  const [page, setPage] = useState(3);

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.pagination')}>
      <div className="w-full">
        <div className="mb-4 flex items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-[#FCFBF8] py-6">
          <p className="text-sm text-ink2">
            {t(locale, 'demo.nav.pagination.viewing', { n: page })}
          </p>
        </div>
        <nav aria-label={t(locale, 'demo.nav.pagination.aria')} className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label={t(locale, 'demo.nav.pagination.prev')}
            className="flex h-11 w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink active:bg-[#EDEae3] disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={page === n ? 'page' : undefined}
              className={`h-8 min-w-8 rounded-md px-2 text-sm tabular-nums transition-colors ${
                page === n
                  ? 'bg-ink font-medium text-white'
                  : 'text-ink2 hover:bg-[#F2F0EB]'
              }`}
            >
              {n}
            </button>
          ))}

          <span className="px-1 text-sm text-[#C9C5BB]" aria-hidden="true">
            …
          </span>
          <button
            type="button"
            onClick={() => setPage(48)}
            aria-current={page === 48 ? 'page' : undefined}
            className={`h-8 min-w-8 rounded-md px-2 text-sm tabular-nums transition-colors ${
              page === 48 ? 'bg-ink font-medium text-white' : 'text-ink2 hover:bg-[#F2F0EB]'
            }`}
          >
            48
          </button>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(48, p + 1))}
            disabled={page === 48}
            aria-label={t(locale, 'demo.nav.pagination.next')}
            className="flex h-11 w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink active:bg-[#EDEae3] disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
        <p className="mt-3 text-center text-xs text-muted">
          {t(locale, 'demo.nav.pagination.summary', { n: 48, m: 20 })}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Infinite Scroll ---------------- */

export function InfiniteScrollDemo() {
  const locale = useLocale();
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading || count >= 18) return;
    setLoading(true);
    setTimeout(() => {
      setCount((c) => Math.min(18, c + 6));
      setLoading(false);
    }, 900);
  };

  const done = count >= 18;

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.infinite')}>
      <div className="mx-auto w-full max-w-[400px]">
        <div className="max-h-[240px] space-y-2 overflow-y-auto pr-1">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2.5"
            >
              <div
                className="h-9 w-9 shrink-0 rounded-lg"
                style={{
                  background: ['#DCE6EF', '#E9E2D4', '#E2EAE4', '#EFE1E1'][i % 4],
                }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] text-ink">
                  {t(locale, 'demo.nav.infinite.item', { n: i + 1 })}
                </p>
                <p className="text-xs text-muted">{t(locale, 'demo.nav.infinite.time')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center">
          {loading ? (
            <span
              className="flex items-center gap-2 text-xs text-muted"
              role="status"
              aria-live="polite"
            >
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9C5BB] [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9C5BB] [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9C5BB]" />
              </span>
              {t(locale, 'demo.nav.infinite.loading')}
            </span>
          ) : done ? (
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="h-px w-6 bg-line" aria-hidden="true" />
              {t(locale, 'demo.nav.infinite.end')}
              <span className="h-px w-6 bg-line" aria-hidden="true" />
            </span>
          ) : (
            <button
              type="button"
              onClick={loadMore}
              className="rounded-lg border border-line px-4 py-2 text-xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
            >
              {t(locale, 'demo.nav.loadMore.button')}
            </button>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Load More ---------------- */

export function LoadMoreDemo() {
  const locale = useLocale();
  const [n, setN] = useState(3);
  const all = Array.from({ length: n }, (_, i) => i);
  const done = n >= 9;

  return (
    <DemoStage caption={t(locale, 'demo.nav.caption.loadMore')}>
      <div className="mx-auto w-full max-w-[400px]">
        <div className="space-y-2">
          {all.map((i) => (
            <div
              key={i}
              className="rounded-lg border border-line bg-surface px-3.5 py-3 text-[0.8125rem] leading-relaxed text-ink2"
            >
              {t(locale, 'demo.nav.loadMore.item', { n: i + 1 })}
            </div>
          ))}
        </div>
        <div className="mt-3.5 flex justify-center">
          {done ? (
            <span className="text-xs text-muted">{t(locale, 'demo.nav.loadMore.end')}</span>
          ) : (
            <button
              type="button"
              onClick={() => setN((v) => Math.min(9, v + 3))}
              className="rounded-lg border border-line px-4 py-2 text-xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
            >
              {t(locale, 'demo.nav.loadMore.button')}
            </button>
          )}
        </div>
      </div>
    </DemoStage>
  );
}
