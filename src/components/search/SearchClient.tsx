'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, X } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { searchPatterns } from '@/data/search';
import { PatternCard } from '@/components/patterns/PatternCard';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t, matchedByLabel } from '@/lib/ui-strings';

/**
 * 空查询时展示的示例词。
 *
 * 这些不只是文案，必须是当前语言下真的搜得到东西的词：
 * searchPatterns 的口语映射（colloquialMap）目前只覆盖中文口语，
 * 所以英文那组只能取自英文名 / 别名，否则点了示例却得到空结果。
 */
const EXAMPLES_ZH = ['底下弹出来', '一步一步填写', '转圈圈', '撤销', '红点', '折叠', '分层展开'];
const EXAMPLES_EN = [
  'bottom sheet',
  'step indicator',
  'loading spinner',
  'snackbar',
  'notification badge',
  'collapsible',
  'progressive disclosure',
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
        <div className="mt-8">
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
                className="min-h-[44px] rounded-lg bg-[#F2F0EB] px-3 py-2 text-[0.8125rem] text-ink2 transition-colors hover:bg-[#E9E6DF] active:bg-[#E2DED5]"
              >
                {e}
              </button>
            ))}
          </div>
          <p className="mt-4 max-w-[520px] text-[0.8125rem] leading-relaxed text-muted">
            {t(locale, 'search.examplesNote')}
          </p>
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
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ pattern, matchedBy }) => (
              <div key={pattern.id} className="relative">
                <PatternCard pattern={pattern} headingLevel={2} />
                <span className="absolute right-3 top-3 rounded bg-white/95 px-1.5 py-0.5 text-2xs text-muted">
                  {t(locale, 'search.hit')}: {matchedByLabel(locale, matchedBy)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}