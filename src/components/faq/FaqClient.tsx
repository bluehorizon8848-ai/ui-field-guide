'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquareQuote,
  Lightbulb,
} from 'lucide-react';
import { getFaqData, getPattern } from '@/data/i18n/resolve';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import { CopyButton } from '@/components/ui/CopyButton';
import { WikiText } from '@/components/wiki/WikiText';

export function FaqClient() {
  const locale = useLocale();
  const h = useHref();
  const { categories, items } = getFaqData(locale);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([items[0]?.id || 'how-to-use-site', items[2]?.id || 'why-ai-generates-slop'])
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(items.map((i) => i.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchQ =
        item.question.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.content.some((c) => c.toLowerCase().includes(q)) ||
        (item.promptExample &&
          (item.promptExample.bad.toLowerCase().includes(q) ||
            item.promptExample.colloquialBetter.toLowerCase().includes(q) ||
            item.promptExample.confirmationPrompt.toLowerCase().includes(q)));

      return matchQ;
    });
  }, [items, activeCategory, searchQuery]);

  return (
    <div>
      {/* 搜索与分类导航 */}
      <div className="space-y-4">
        {/* 搜索框 */}
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
            placeholder={t(locale, 'faq.searchPlaceholder')}
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </div>

        {/* 分类 Tab 切换 */}
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
            {t(locale, 'faq.allCategories')} ({items.length})
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

          <div className="ml-auto hidden items-center gap-2 text-xs text-muted sm:flex">
            <button
              type="button"
              onClick={expandAll}
              className="underline-offset-4 hover:text-ink hover:underline"
            >
              {locale === 'zh' ? '展开全部' : 'Expand all'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={collapseAll}
              className="underline-offset-4 hover:text-ink hover:underline"
            >
              {locale === 'zh' ? '折叠全部' : 'Collapse all'}
            </button>
          </div>
        </div>

        {/* Wiki 词典提示 */}
        <div className="flex items-center justify-between rounded-lg border border-line bg-[#FAF8F5] px-3.5 py-2 text-xs">
          <span className="text-muted">
            {locale === 'zh'
              ? '💡 正文中的专有名词（虚线下划线）均可点击查看 Wiki 释义与外部参考。'
              : '💡 Terms with dashed underlines can be clicked for plain-English Wiki definitions.'}
          </span>
          <Link
            href={h('/glossary')}
            className="inline-flex shrink-0 items-center gap-1 font-medium text-ink underline-offset-4 hover:underline"
          >
            <span>{locale === 'zh' ? '完整名词词典 ↗' : 'View Glossary ↗'}</span>
          </Link>
        </div>
      </div>

      {/* 问答列表 */}
      <div className="mt-6 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-card border border-dashed border-line p-10 text-center">
            <p className="text-sm font-medium text-ink">{t(locale, 'search.noResult')}</p>
            <p className="mt-1 text-xs text-muted">{t(locale, 'search.noResultHint')}</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedIds.has(item.id);
            const categoryMeta = categories.find((c) => c.id === item.category);

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-card border transition-colors ${
                  isExpanded ? 'border-[#C9C5BB] bg-surface' : 'border-line bg-surface hover:border-[#C9C5BB]'
                }`}
              >
                {/* 标题栏 */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-start justify-between gap-4 p-4 text-left sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#F2F0EB] px-2 py-0.5 text-2xs font-medium text-ink2">
                        {categoryMeta?.name}
                      </span>
                    </div>
                    <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-ink sm:text-base">
                      {item.question}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted sm:text-[0.8125rem]">
                      <WikiText text={item.summary} />
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 bg-[#F2F0EB]' : 'bg-surface'
                    }`}
                  >
                    <ChevronDown size={15} className="text-ink2" />
                  </span>
                </button>

                {/* 展开内容 */}
                {isExpanded && (
                  <div className="border-t border-line2 px-4 pb-5 pt-4 sm:px-5">
                    {/* 正文段落 */}
                    <div className="space-y-2.5 text-[0.875rem] leading-relaxed text-ink2">
                      {item.content.map((p, idx) => (
                        <p key={idx} className={p.startsWith('•') || p.match(/^[0-9]\./) ? 'pl-2' : ''}>
                          <WikiText text={p} />
                        </p>
                      ))}
                    </div>

                    {/* 提示词对比演练 (如果包含) */}
                    {item.promptExample && (
                      <div className="mt-5 rounded-xl border border-line bg-[#FCFBF8] p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                          <MessageSquareQuote size={14} aria-hidden="true" />
                          <span>{t(locale, 'faq.promptExample')}</span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {/* 踩坑问法 */}
                          <div className="rounded-lg border border-[#F2D7D5] bg-[#FDF2F0] p-3.5">
                            <div className="flex items-center gap-1.5 text-2xs font-semibold text-[#A8342C]">
                              <XCircle size={13} aria-hidden="true" />
                              <span>{t(locale, 'faq.badPrompt')}</span>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-ink2 line-through decoration-[#C9C5BB]">
                              {item.promptExample.bad}
                            </p>
                          </div>

                          {/* 口语进阶问法 */}
                          <div className="rounded-lg border border-[#D1E7DD] bg-[#F2F9F5] p-3.5">
                            <div className="flex items-center justify-between gap-2 text-2xs font-semibold text-[#1E7E52]">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={13} aria-hidden="true" />
                                <span>{t(locale, 'faq.colloquialBetter')}</span>
                              </span>
                              <CopyButton text={item.promptExample.colloquialBetter} label={t(locale, 'common.copy')} />
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-ink">
                              {item.promptExample.colloquialBetter}
                            </p>
                          </div>
                        </div>

                        {/* 确认式协作 Prompt (推荐) */}
                        <div className="mt-3 rounded-lg border border-[#E6E3DB] bg-surface p-3.5">
                          <div className="flex items-center justify-between gap-2 border-b border-line2 pb-2 text-xs font-semibold text-ink">
                            <span className="flex items-center gap-1.5 text-[#B35309]">
                              <Sparkles size={14} aria-hidden="true" />
                              <span>{t(locale, 'faq.confirmationPrompt')}</span>
                            </span>
                            <CopyButton
                              text={item.promptExample.confirmationPrompt}
                              label={t(locale, 'faq.copyPrompt')}
                            />
                          </div>
                          <p className="mt-2.5 font-mono text-xs leading-relaxed text-ink2">
                            {item.promptExample.confirmationPrompt}
                          </p>
                          <div className="mt-2.5 flex items-start gap-1.5 text-2xs text-muted">
                            <Lightbulb size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                            <span><WikiText text={item.promptExample.explanation} /></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 关联 Pattern */}
                    {item.relatedPatterns && item.relatedPatterns.length > 0 && (
                      <div className="mt-5 border-t border-line2 pt-4">
                        <p className="meta mb-2.5">{t(locale, 'faq.viewRelatedPattern')}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.relatedPatterns.map((patId) => {
                            const p = getPattern(patId, locale);
                            if (!p) return null;
                            return (
                              <Link
                                key={patId}
                                href={h(`/patterns/${p.id}`)}
                                className="group inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
                              >
                                <span>{p.name}</span>
                                <span className="text-muted">({p.chineseName})</span>
                                <ArrowRight
                                  size={12}
                                  aria-hidden="true"
                                  className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                                />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
