'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { getPattern } from '@/data/i18n/resolve';
import { searchPatterns, FUNCTIONAL_SCENARIOS } from '@/data/search';
import { ScenarioBadge } from '@/components/ui/ScenarioBadge';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t, matchedByLabel } from '@/lib/ui-strings';

/**
 * 空结果提示里的示例词，必须是当前语言下真的搜得到东西的词。
 */
const COLLOQUIAL_EXAMPLE: Record<'zh' | 'en', string> = {
  zh: '底下弹出来',
  en: 'show more',
};

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const locale = useLocale();
  const h = useHref();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (q.trim() ? searchPatterns(q, patterns).slice(0, 6) : []), [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const submit = (value: string) => {
    const v = value.trim();
    if (!v) return;
    setOpen(false);
    inputRef.current?.blur();
    router.push(`${h('/search')}?q=${encodeURIComponent(v)}`);
  };

  const handleScenarioClick = (query: string) => {
    setQ(query);
    submit(query);
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <SearchIcon
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggest"
          aria-label={t(locale, 'search.inputAria')}
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit(q);
            if (e.key === 'Escape') {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={t(locale, 'search.barPlaceholder')}
          className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-10 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              inputRef.current?.focus();
            }}
            aria-label={t(locale, 'search.clear')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* 1. 空输入时的功能场景快捷推荐面板 */}
      {open && !q.trim() && (
        <div
          id="search-suggest"
          className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-line bg-surface p-3 shadow-pop animate-rise-in"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Sparkles size={13} className="text-[#1D734C]" />
              {locale === 'zh' ? '功能场景精准推荐' : 'Curated Scenario Shortcuts'}
            </span>
            <span className="text-2xs text-muted">
              {locale === 'zh' ? '点击快速直达' : 'Tap to search'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {FUNCTIONAL_SCENARIOS.slice(0, 6).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleScenarioClick(s.query)}
                className="flex items-center gap-2.5 rounded-lg border border-line/60 bg-[#FAF9F6] p-2 text-left transition-colors hover:border-ink/30 hover:bg-[#F2F0EB]"
              >
                <ScenarioBadge icon={s.icon} size={14} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-ink">
                    {locale === 'zh' ? s.label : s.labelEn}
                  </span>
                  <span className="block truncate text-[10px] text-muted">
                    {locale === 'zh' ? s.description : s.descriptionEn}
                  </span>
                </span>
                <ArrowRight size={12} className="shrink-0 text-muted" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. 搜索建议列表（高亮呈现推荐原因与平台专属徽标） */}
      {open && results.length > 0 && (
        <ul
          id="search-suggest"
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-pop animate-rise-in"
        >
          {results.map(({ pattern, matchedBy, scenarioReason, scenarioReasonEn }) => {
            const localizedPattern = getPattern(pattern.id, locale) ?? pattern;
            const reason = locale === 'en' ? (scenarioReasonEn || scenarioReason) : scenarioReason;
            return (
              <li key={pattern.id} role="option" aria-selected={false}>
                <Link
                  href={h(`/patterns/${pattern.id}`)}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-[#F5F3EE]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-ink">
                        {pattern.name}
                      </span>
                      <span className="text-xs text-muted">{pattern.chineseName}</span>
                      {pattern.specialBadge && (
                        <span className="rounded bg-[#1D734C]/10 px-1.5 py-0.2 text-[10px] font-semibold text-[#1D734C]">
                          {pattern.specialBadge}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {localizedPattern.oneLine}
                    </span>
                    {reason && (
                      <span className="mt-1 flex items-center gap-1 truncate text-[11px] font-medium text-[#1D734C]">
                        <Lightbulb size={12} className="shrink-0 text-[#D97706]" />
                        <span className="truncate">{reason}</span>
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 rounded bg-[#F2F0EB] px-1.5 py-0.5 text-2xs text-muted">
                    {matchedByLabel(locale, matchedBy)}
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => submit(q)}
              className="flex w-full items-center gap-2 border-t border-line px-3.5 py-2.5 text-left text-xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
            >
              <SearchIcon size={13} aria-hidden="true" />
              {t(locale, 'search.viewAllResults', { q })}
            </button>
          </li>
        </ul>
      )}

      {/* 3. 无结果提示 */}
      {open && q.trim() && results.length === 0 && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 rounded-xl border border-line bg-surface px-4 py-5 text-center shadow-pop animate-rise-in">
          <p className="text-sm text-ink">{t(locale, 'search.noResultFor', { q })}</p>
          <p className="mt-1 text-xs text-muted">
            {t(locale, 'search.tryColloquial', { q: COLLOQUIAL_EXAMPLE[locale] })}
          </p>
        </div>
      )}
    </div>
  );
}