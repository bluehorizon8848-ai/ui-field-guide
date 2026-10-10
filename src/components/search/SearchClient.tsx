'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Sparkles, ArrowRight } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { searchPatterns, FUNCTIONAL_SCENARIOS } from '@/data/search';
import { PatternCard } from '@/components/patterns/PatternCard';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t, matchedByLabel } from '@/lib/ui-strings';

/**
 * 空查询时展示的口语词条。
 */
const EXAMPLES_ZH = [
  '底下弹出来',
  '一步一步填写',
  '转圈圈',
  '撤销',
  '红点',
  '折叠',
  '分层展开',
  '快捷指令',
  '服务卡片',
  '带字的悬浮按钮',
];
const EXAMPLES_EN = [
  'bottom sheet',
  'step indicator',
  'loading spinner',
  'snackbar',
  'notification badge',
  'collapsible',
  'command palette',
  'service card',
  'extended fab',
];

export function SearchClient() {
  const locale = useLocale();
  const h = useHref();
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get('q') ?? '');

  const examples = locale === 'en' ? EXAMPLES_EN : EXAMPLES_ZH;

  const results = useMemo(() => (q.trim() ? searchPatterns(q, patterns) : []), [q]);

  const submit = (v: string) => {
    const query = v.trim();
    router.replace(
      query ? `${h('/search')}?q=${encodeURIComponent(query)}` : h('/search'),
      { scroll: false }
    );
  };

  const handleScenarioClick = (query: string) => {
    setQ(query);
    submit(query);
  };

  return (
    <div>
      <div className="relative max-w-[620px]">
        <label htmlFor="search-q" className="sr-only">
          {t(locale, 'search.inputAria')}
        </label>
        <SearchIcon
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          id="search-q"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            submit(e.target.value);
          }}
          autoFocus
          placeholder={t(locale, 'search.placeholder')}
          className="h-14 w-full rounded-xl border border-line bg-surface pl-12 pr-11 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              submit('');
            }}
            aria-label={t(locale, 'search.clear')}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {!q.trim() ? (
        <div className="mt-8 space-y-8">
          {/* 功能场景精准推荐 */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                <Sparkles size={14} className="text-[#1D734C]" />
                {locale === 'zh' ? '功能场景精准推荐' : 'Curated Functional Scenarios'}
              </span>
              <span className="text-2xs text-muted">
                {locale === 'zh' ? '根据实际业务场景匹配合适组件' : 'Match components by real use case'}
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {FUNCTIONAL_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleScenarioClick(s.query)}
                  className="flex flex-col justify-between rounded-xl border border-line/70 bg-surface p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{s.emoji}</span>
                      <ArrowRight size={13} className="text-muted" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-ink">
                      {locale === 'zh' ? s.label : s.labelEn}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">
                      {locale === 'zh' ? s.description : s.descriptionEn}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.patternIds.slice(0, 2).map((pid) => (
                      <span
                        key={pid}
                        className="rounded bg-[#F2F0EB] px-1.5 py-0.2 font-mono text-[10px] text-ink2"
                      >
                        {pid}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 口语描述快速检索 */}
          <div>
            <p className="meta mb-3">{t(locale, 'search.colloquialMeta')}</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setQ(e);
                    submit(e);
                  }}
                  className="min-h-[44px] rounded-lg bg-[#F2F0EB] px-3.5 py-2 text-[0.8125rem] text-ink2 transition-colors hover:bg-[#E9E6DF] active:bg-[#E2DED5]"
                >
                  {e}
                </button>
              ))}
            </div>
            <p className="mt-3 max-w-[560px] text-[0.8125rem] leading-relaxed text-muted">
              {t(locale, 'search.examplesNote')}
            </p>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-line px-6 py-14 text-center">
          <p className="text-sm text-ink">{t(locale, 'search.noResultFor', { q })}</p>
          <p className="mt-1.5 text-xs text-muted">
            {t(locale, 'search.noResultTry')}
            <a href={h('/identify')} className="mx-1 underline underline-offset-4 hover:text-ink">
              {t(locale, 'identify.title')}
            </a>
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 mt-7 text-xs text-muted" role="status" aria-live="polite">
            {results.length} {t(locale, 'search.results')}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ pattern, matchedBy, scenarioReason }) => (
              <div key={pattern.id} className="flex flex-col">
                <div className="relative flex-1">
                  <PatternCard pattern={pattern} headingLevel={2} />
                  <span className="absolute right-3 top-3 rounded bg-white/95 px-1.5 py-0.5 text-2xs text-muted shadow-2xs">
                    {t(locale, 'search.hit')}: {matchedByLabel(locale, matchedBy)}
                  </span>
                </div>
                {scenarioReason && (
                  <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-[#1D734C]/20 bg-[#E8F3ED]/40 p-2.5 text-xs text-[#1D734C]">
                    <span className="shrink-0 text-xs">💡</span>
                    <span className="font-medium text-ink2">{scenarioReason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}