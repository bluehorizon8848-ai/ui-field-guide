'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { patterns } from '@/data/patterns';
import { getLearningLevels, localizePatterns } from '@/data/i18n/resolve';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function LearnClient({ total }: { total: number }) {
  const locale = useLocale();
  const h = useHref();
  const learningLevels = getLearningLevels(locale);
  // 进度统计的是 id 集合，但卡片要显示本地化的 oneLine，所以渲染用本地化版本
  const patternById = useMemo(
    () => new Map(localizePatterns(patterns, locale).map((p) => [p.id, p])),
    [locale]
  );
  const { learned, ready, toggle, reset } = useProgress();
  const pct = total > 0 ? Math.round((learned.length / total) * 100) : 0;

  return (
    <div>
      {/* 进度总览 */}
      <div className="rounded-card border border-line bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="meta mb-1.5">{t(locale, 'learn.progress')}</p>
            <p className="text-[1.75rem] font-semibold leading-none tabular-nums text-ink">
              {ready ? learned.length : 0}
              <span className="text-base font-normal text-muted"> / {total}</span>
            </p>
            <p className="mt-1.5 text-xs text-muted">
              {t(locale, 'learn.known', { n: ready ? learned.length : 0 })}
            </p>
          </div>
          {ready && learned.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              {t(locale, 'learn.reset')}
            </button>
          )}
        </div>

        <div
          role="progressbar"
          aria-valuenow={ready ? learned.length : 0}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={t(locale, 'learn.progressAria')}
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#E6E3DB]"
        >
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-2xs text-muted">{t(locale, 'learn.local')}</p>
      </div>

      {/* 三级路径 */}
      <div className="mt-8 space-y-8">
        {learningLevels.map((level) => {
          const items = level.patternIds
            .map((id) => patternById.get(id))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));
          const done = items.filter((p) => learned.includes(p.id)).length;

          return (
            <section key={level.level}>
              <header className="mb-4 flex flex-wrap items-baseline gap-2.5">
                <span className="meta">{level.subtitle}</span>
                <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  {level.name}
                </h2>
                <span className="ml-auto text-xs tabular-nums text-muted">
                  {done} / {items.length}
                </span>
              </header>

              <p className="mb-4 max-w-[600px] text-[0.875rem] leading-relaxed text-ink2">
                {level.description}
              </p>

              <ul className="grid gap-2 sm:grid-cols-2">
                {items.map((p) => {
                  const on = learned.includes(p.id);
                  return (
                    <li key={p.id}>
                      <div
                        className={`flex items-center gap-3 rounded-card border bg-surface p-3.5 transition-colors ${
                          on ? 'border-[#2C7355]' : 'border-line'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(p.id)}
                          aria-pressed={on}
                          aria-label={`${t(locale, on ? 'learn.unmark' : 'learn.mark')} ${p.name}`}
                          className={`group flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            on ? 'text-[#2C7355]' : 'text-muted hover:text-ink'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                              on
                                ? 'border-[#2C7355] bg-[#2C7355] text-white'
                                : 'border-[#C9C5BB] group-hover:border-ink'                            }`}
                          >
                            {on && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M2.5 6.2 L4.8 8.5 L9.5 3.5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                        </button>

                        <Link href={h(`/patterns/${p.id}`)} className="flex min-h-[44px] min-w-0 flex-1 flex-col justify-center py-1">
                          <span className="block text-[0.875rem] font-semibold text-ink">
                            {p.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {p.chineseName}
                          </span>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
