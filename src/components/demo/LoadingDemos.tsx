'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, RefreshCw, WifiOff } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

/* ---------------- Skeleton ---------------- */

function SkeletonCard() {
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-surface p-3">
      <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-[#E9E6DF]" />
      <div className="min-w-0 flex-1 space-y-2 py-0.5">
        <div className="h-3 w-[62%] animate-pulse rounded bg-[#E9E6DF]" />
        <div className="h-2.5 w-[40%] animate-pulse rounded bg-[#F0EDE6]" />
        <div className="h-2.5 w-[28%] animate-pulse rounded bg-[#F0EDE6]" />
      </div>
    </div>
  );
}

function RealCard({ i, locale }: { i: number; locale: 'zh' | 'en' }) {
  const nameKeys = [
    'demo.loading.skeleton.name1',
    'demo.loading.skeleton.name2',
    'demo.loading.skeleton.name3',
    'demo.loading.skeleton.name4',
  ] as const;
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-surface p-3">
      <div
        className="h-14 w-14 shrink-0 rounded-lg"
        style={{
          background: ['#DCE6EF', '#E9E2D4', '#E2EAE4', '#EFE1E1', '#E4E2EF'][i % 5],
        }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 py-0.5">
        <p className="truncate text-[0.8125rem] font-medium text-ink">
          {t(locale, nameKeys[i % 4])}
        </p>
        <p className="mt-1 text-xs text-muted">
          {['2026-03-12 14:22', '2026-03-08 20:41', '2026-02-27 09:15', '2026-02-14 16:03'][i % 4]}
        </p>
        <p className="mt-1 text-xs text-muted">{['3.2 MB', '4.8 MB', '1.1 MB', '2.6 MB'][i % 4]}</p>
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = () => {
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    // 最短显示 500ms，避免闪烁
    timer.current = setTimeout(() => setLoading(false), 1800);
  };

  useEffect(() => {
    if (loading && !timer.current) {
      timer.current = setTimeout(() => setLoading(false), 1800);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loading]);

  return (
    <DemoStage caption={t(locale, 'demo.loading.caption.skeleton')}>
      <div className="mb-4 flex justify-center">
        <DemoButton variant="secondary" onClick={reload}>
          <RefreshCw size={14} aria-hidden="true" />
          {t(locale, 'demo.loading.skeleton.reload')}
        </DemoButton>
      </div>
      <div className="mx-auto w-full max-w-[440px] space-y-2.5" aria-busy={loading}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : Array.from({ length: 4 }).map((_, i) => (
              <RealCard key={i} i={i} locale={locale} />
            ))}
      </div>
    </DemoStage>
  );
}

/* ---------------- Spinner ---------------- */

export function SpinnerDemo() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);

  const run = (withSlow: boolean) => {
    setSlow(withSlow);
    setLoading(true);
    setTimeout(() => setLoading(false), withSlow ? 12000 : 900);
  };

  useEffect(() => {
    if (loading && slow) {
      const t = setTimeout(() => setSlow(false), 10);
      return () => clearTimeout(t);
    }
  }, [loading, slow]);

  return (
    <DemoStage caption={t(locale, 'demo.loading.caption.spinner')}>
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2.5">
            <DemoButton variant="secondary" onClick={() => run(false)}>
              {t(locale, 'demo.loading.spinner.short')}
            </DemoButton>
            <DemoButton variant="secondary" onClick={() => run(true)}>
              {t(locale, 'demo.loading.spinner.long')}
            </DemoButton>
          </div>
          <DemoButton onClick={() => run(false)} disabled={loading}>
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {t(locale, 'demo.loading.spinner.working')}
              </>
            ) : (
              t(locale, 'demo.loading.spinner.inButton')
            )}
          </DemoButton>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-2.5 border-t border-line pt-5">
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-[#E6E3DB] border-t-ink"
              role="status"
              aria-label={t(locale, 'demo.loading.spinner.loadingAlbum')}
            />
            {slow ? (
              <div className="text-center">
                <p className="text-xs text-muted">
                  {t(locale, 'demo.loading.spinner.slow')}
                </p>
                <button
                  type="button"
                  className="mt-1 text-xs font-medium text-ink underline-offset-4 hover:underline"
                >
                  {t(locale, 'demo.loading.spinner.cancelWait')}
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted">
                {t(locale, 'demo.loading.spinner.loadingAlbum')}
              </p>
            )}
          </div>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Progress Bar ---------------- */

export function ProgressBarDemo() {
  const locale = useLocale();
  const [p, setP] = useState(0);
  const [running, setRunning] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (mode: 'determinate' | 'indeterminate') => {
    if (timer.current) clearInterval(timer.current);
    setDone(false);
    if (mode === 'indeterminate') {
      setIndeterminate(true);
      setRunning(true);
      timer.current = setInterval(() => {}, 1000);
      return;
    }
    setIndeterminate(false);
    setP(0);
    setRunning(true);
    timer.current = setInterval(() => {
      setP((prev) => {
        if (prev >= 100) {
          if (timer.current) clearInterval(timer.current);
          setRunning(false);
          setDone(true);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 9 + 2);
      });
    }, 220);
  };

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  return (
    <DemoStage caption={t(locale, 'demo.loading.caption.progress')}>
      <div className="mx-auto w-full max-w-[400px] space-y-4">
        <div className="flex gap-2.5">
          <DemoButton variant="secondary" onClick={() => start('determinate')}>
            {t(locale, 'demo.loading.progress.known')}
          </DemoButton>
          <DemoButton variant="secondary" onClick={() => start('indeterminate')}>
            {t(locale, 'demo.loading.progress.unknown')}
          </DemoButton>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-ink2">
              {indeterminate
                ? t(locale, 'demo.loading.progress.working')
                : done
                  ? t(locale, 'demo.loading.progress.done')
                  : t(locale, 'demo.loading.progress.uploaded', {
                      a: ((p / 100) * 8).toFixed(1),
                    })}
            </span>
            {!indeterminate && <span className="tabular-nums text-muted">{Math.round(p)}%</span>}
          </div>
          <div
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : Math.round(p)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t(locale, 'demo.loading.progress.aria')}
            className="h-1.5 w-full overflow-hidden rounded-full bg-[#E6E3DB]"
          >
            {indeterminate ? (
              <div className="h-full w-1/3 animate-indeterminate rounded-full bg-ink" />
            ) : (
              <div
                className={`h-full rounded-full transition-[width] duration-200 ${
                  done ? 'bg-[#2C7355]' : 'bg-ink'
                }`}
                style={{ width: `${p}%` }}
              />
            )}
          </div>
        </div>

        {done && (
          <p className="flex items-center gap-1.5 text-xs text-[#2C7355]">
            <Check size={14} aria-hidden="true" />
            {t(locale, 'demo.loading.progress.complete')}
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Empty / Error / Success ---------------- */

export function EmptyStateDemo() {
  const locale = useLocale();
  const [kind, setKind] = useState<'first' | 'filtered' | 'done'>('first');

  const content = {
    first: {
      icon: '📷',
      title: t(locale, 'demo.loading.empty.firstTitle'),
      desc: t(locale, 'demo.loading.empty.firstDesc'),
      action: t(locale, 'demo.loading.empty.firstAction'),
    },
    filtered: {
      icon: '🔍',
      title: t(locale, 'demo.loading.empty.filteredTitle'),
      desc: t(locale, 'demo.loading.empty.filteredDesc'),
      action: t(locale, 'demo.loading.empty.filteredAction'),
    },
    done: {
      icon: '✨',
      title: t(locale, 'demo.loading.empty.doneTitle'),
      desc: t(locale, 'demo.loading.empty.doneDesc'),
      action: t(locale, 'demo.loading.empty.doneAction'),
    },
  }[kind];

  return (
    <DemoStage caption={t(locale, 'demo.loading.caption.empty')}>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {(
          [
            ['first', 'demo.loading.empty.tabFirst'],
            ['filtered', 'demo.loading.empty.tabFiltered'],
            ['done', 'demo.loading.empty.tabDone'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              kind === k ? 'bg-ink text-white' : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
            }`}
          >
            {t(locale, label)}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2.5 py-4 text-center">
        <span className="text-3xl" aria-hidden="true">
          {content.icon}
        </span>
        <p className="text-sm font-semibold text-ink">{content.title}</p>
        <p className="max-w-[280px] text-[0.8125rem] leading-relaxed text-muted">
          {content.desc}
        </p>
        <button
          type="button"
          className="mt-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
        >
          {content.action}
        </button>
      </div>
    </DemoStage>
  );
}

export function ErrorStateDemo() {
  const locale = useLocale();
  const [kind, setKind] = useState<'network' | 'permission' | 'missing'>('network');

  const content = {
    network: {
      icon: <WifiOff size={26} className="text-muted" aria-hidden="true" />,
      title: t(locale, 'demo.loading.error.networkTitle'),
      desc: t(locale, 'demo.loading.error.networkDesc'),
      action: t(locale, 'demo.loading.error.networkAction'),
    },
    permission: {
      icon: <span className="text-3xl" aria-hidden="true">🔒</span>,
      title: t(locale, 'demo.loading.error.permissionTitle'),
      desc: t(locale, 'demo.loading.error.permissionDesc'),
      action: t(locale, 'demo.loading.error.permissionAction'),
    },
    missing: {
      icon: <span className="text-3xl" aria-hidden="true">🕳️</span>,
      title: t(locale, 'demo.loading.error.missingTitle'),
      desc: t(locale, 'demo.loading.error.missingDesc'),
      action: t(locale, 'demo.loading.error.missingAction'),
    },
  }[kind];

  return (
    <DemoStage caption={t(locale, 'demo.loading.caption.error')}>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {(
          [
            ['network', 'demo.loading.error.tabNetwork'],
            ['permission', 'demo.loading.error.tabPermission'],
            ['missing', 'demo.loading.error.tabMissing'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              kind === k ? 'bg-ink text-white' : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
            }`}
          >
            {t(locale, label)}
          </button>
        ))}
      </div>

      <div
        role="alert"
        className="flex flex-col items-center gap-2.5 py-4 text-center"
      >
        {content.icon}
        <p className="text-sm font-semibold text-ink">{content.title}</p>
        <p className="max-w-[300px] text-[0.8125rem] leading-relaxed text-muted">
          {content.desc}
        </p>
        <button
          type="button"
          className="mt-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
        >
          {content.action}
        </button>
        <details className="mt-1 text-xs text-muted">
          <summary className="cursor-pointer underline-offset-4 hover:underline">
            {t(locale, 'demo.loading.error.details')}
          </summary>
          <p className="mt-1 font-mono text-[11px]">HTTP 503 · upstream timeout</p>
        </details>
      </div>
    </DemoStage>
  );
}

export function SuccessStateDemo() {
  const locale = useLocale();
  return (
    <DemoStage caption={t(locale, 'demo.loading.caption.success')}>
      <div className="flex flex-col items-center gap-2.5 py-4 text-center">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F2EC] text-[#2C7355]"
          aria-hidden="true"
        >
          <Check size={24} strokeWidth={2.5} />
        </span>
        <p className="text-base font-semibold text-ink">
          {t(locale, 'demo.loading.success.title')}
        </p>
        <p className="max-w-[280px] text-[0.8125rem] leading-relaxed text-muted">
          {t(locale, 'demo.loading.success.desc')}
        </p>

        <div className="mt-2 w-full max-w-[260px] rounded-xl border border-line bg-[#FCFBF8] p-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-[#E2EAE4]" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink">
                {t(locale, 'demo.loading.success.item')}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {t(locale, 'demo.loading.success.itemMeta')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex gap-2.5">
          <button
            type="button"
            className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-ink transition-colors hover:bg-[#F5F3EE]"
          >
            {t(locale, 'demo.loading.success.home')}
          </button>
          <button
            type="button"
            className="rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
          >
            {t(locale, 'demo.loading.success.view')}
          </button>
        </div>
      </div>
    </DemoStage>
  );
}
