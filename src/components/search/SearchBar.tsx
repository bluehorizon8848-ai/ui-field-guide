'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { searchPatterns } from '@/data/search';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t, matchedByLabel } from '@/lib/ui-strings';

/**
 * 空结果提示里的示例词，必须是当前语言下真的搜得到东西的词。
 * 中文口语映射覆盖「底下弹出来」；英文没有口语映射，只能取自英文别名。
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
          aria-expanded={open && results.length > 0}
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

      {open && results.length > 0 && (
        <ul
          id="search-suggest"
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-pop animate-rise-in"
        >
          {results.map(({ pattern, matchedBy }) => (
            <li key={pattern.id} role="option" aria-selected={false}>
              <Link
                href={h(`/patterns/${pattern.id}`)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-[#F5F3EE]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">
                    {pattern.name}
                    <span className="ml-1.5 text-xs text-muted">{pattern.chineseName}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {pattern.oneLine}
                  </span>
                </span>
                <span className="shrink-0 rounded bg-[#F2F0EB] px-1.5 py-0.5 text-2xs text-muted">
                  {matchedByLabel(locale, matchedBy)}
                </span>
              </Link>
            </li>
          ))}
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