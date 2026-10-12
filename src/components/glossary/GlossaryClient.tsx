'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
} from 'lucide-react';
import { getTermsData, getPattern } from '@/data/i18n/resolve';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import type { TermCategory } from '@/data/terms';

export function GlossaryClient() {
  const locale = useLocale();
  const h = useHref();
  const { categories, items } = getTermsData(locale);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTerms = useMemo(() => {
    return items.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchText =
        item.term.toLowerCase().includes(q) ||
        (item.termZh && item.termZh.toLowerCase().includes(q)) ||
        item.plainExplanation.toLowerCase().includes(q) ||
        item.whyItMatters.toLowerCase().includes(q) ||
        (item.aliases && item.aliases.some((a) => a.toLowerCase().includes(q)));

      return matchText;
    });
  }, [items, activeCategory, searchQuery]);

  return (
    <div>
      {/* 搜索与分类 Tab */}
      <div className="space-y-4">
        {/* 搜索输入框 */}
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(locale, 'glossary.searchPlaceholder')}
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </div>

        {/* 分类切换 */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-3">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-ink text-white'
                : 'bg-surface text-ink2 border border-line hover:border-[#C9C5BB]'
            }`}
          >
            {t(locale, 'glossary.allTerms')} ({items.length})
          </button>
          {categories.map((c) => {
            const count = items.filter((i) => i.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === c.id
                    ? 'bg-ink text-white'
                    : 'bg-surface text-ink2 border border-line hover:border-[#C9C5BB]'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 专有名词卡片列表 */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filteredTerms.length === 0 ? (
          <div className="col-span-full rounded-card border border-dashed border-line p-10 text-center">
            <p className="text-sm font-medium text-ink">{t(locale, 'search.noResult')}</p>
            <p className="mt-1 text-xs text-muted">{t(locale, 'search.noResultHint')}</p>
          </div>
        ) : (
          filteredTerms.map((term) => {
            const relatedPattern = term.relatedPatternId
              ? getPattern(term.relatedPatternId, locale)
              : undefined;

            return (
              <article
                key={term.id}
                className="flex flex-col justify-between rounded-card border border-line bg-surface p-5 transition-colors hover:border-[#C9C5BB]"
              >
                <div>
                  {/* 头部元数据 */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-[#F2F0EB] px-2 py-0.5 text-2xs font-medium text-ink2 uppercase tracking-wide">
                          {term.category}
                        </span>
                        {term.aliases && term.aliases.length > 0 && (
                          <span className="text-2xs text-muted">
                            ({term.aliases.slice(0, 2).join(' / ')})
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-base font-semibold leading-snug text-ink sm:text-[1.0625rem]">
                        {term.term}
                      </h2>
                      {term.termZh && (
                        <p className="mt-0.5 text-xs text-muted">{term.termZh}</p>
                      )}
                    </div>
                  </div>

                  {/* 通俗人话解释 */}
                  <div className="mt-3.5 rounded-lg bg-[#FAF8F5] p-3 text-xs leading-relaxed text-ink">
                    <p className="mb-1 flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider text-[#94701C]">
                      <Info size={12} aria-hidden="true" />
                      <span>{t(locale, 'wiki.plainDef')}</span>
                    </p>
                    <p>{term.plainExplanation}</p>
                  </div>

                  {/* 提需求避坑说明 */}
                  <div className="mt-3 text-xs leading-relaxed text-ink2">
                    <p className="mb-1 flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider text-muted">
                      <Sparkles size={12} className="text-[#B35309]" aria-hidden="true" />
                      <span>{t(locale, 'wiki.whyItMatters')}</span>
                    </p>
                    <p className="text-muted">{term.whyItMatters}</p>
                  </div>
                </div>

                {/* 底部关联与外部链接 */}
                <div className="mt-5 border-t border-line2 pt-3 space-y-2">
                  {relatedPattern && (
                    <Link
                      href={h(`/patterns/${relatedPattern.id}`)}
                      className="group flex items-center justify-between rounded-lg bg-[#F5F3EE] px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-[#EDEAE3]"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={13} className="text-ink2" aria-hidden="true" />
                        <span>
                          {t(locale, 'wiki.viewLiveDemo')}: {relatedPattern.name}
                        </span>
                      </span>
                      <ArrowRight
                        size={13}
                        className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                        aria-hidden="true"
                      />
                    </Link>
                  )}

                  {term.links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-3xs uppercase tracking-wider text-muted mr-1">
                        {t(locale, 'wiki.externalLinks')}:
                      </span>
                      {term.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded border border-line bg-surface px-2 py-0.5 text-3xs text-ink2 transition-colors hover:border-[#C9C5BB] hover:text-ink"
                        >
                          <span>{link.label}</span>
                          <ExternalLink size={10} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
