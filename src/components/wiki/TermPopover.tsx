'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ExternalLink,
  ArrowRight,
  X,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';
import type { TermItem } from '@/data/terms';
import { getTerm, getPattern } from '@/data/i18n/resolve';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

interface TermPopoverProps {
  termId?: string;
  term?: TermItem;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function TermPopover({
  termId,
  term: propTerm,
  children,
  className = '',
  showIcon = false,
}: TermPopoverProps) {
  const locale = useLocale();
  const h = useHref();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const term = propTerm || (termId ? getTerm(termId, locale) : undefined);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  if (!term) {
    return <span className={className}>{children}</span>;
  }

  const relatedPattern = term.relatedPatternId
    ? getPattern(term.relatedPatternId, locale)
    : undefined;

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${term.term} - ${t(locale, 'wiki.showExplanation')}`}
        className={`inline cursor-help border-b border-dashed border-[#8A8578] text-inherit transition-colors hover:border-ink hover:text-ink font-medium ${className}`}
      >
        <span>{children || term.term}</span>
        {showIcon && (
          <HelpCircle
            size={11}
            aria-hidden="true"
            className="ml-0.5 inline -translate-y-0.5 text-muted opacity-80"
          />
        )}
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={term.term}
          className="absolute left-1/2 top-full z-50 mt-2 w-80 max-w-[85vw] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-surface p-4 text-left shadow-pop animate-rise-in sm:left-0 sm:translate-x-0"
        >
          {/* 头部：标题与关闭 */}
          <div className="flex items-start justify-between gap-2 border-b border-line2 pb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-[#F2F0EB] px-1.5 py-0.5 text-3xs font-medium text-ink2 uppercase tracking-wide">
                  {term.category}
                </span>
                <span className="text-2xs font-semibold text-ink sm:text-xs">
                  {term.term}
                </span>
              </div>
              {term.termZh && (
                <p className="mt-0.5 text-2xs text-muted">{term.termZh}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t(locale, 'common.close')}
              className="rounded p-1 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </div>

          {/* 核心人话解释 */}
          <div className="mt-2.5 space-y-2 text-xs leading-relaxed text-ink2">
            <div className="rounded-lg bg-[#FAF8F5] p-2.5">
              <p className="font-semibold text-ink text-2xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <Info size={11} className="text-[#94701C]" aria-hidden="true" />
                <span>{t(locale, 'wiki.plainDef')}</span>
              </p>
              <p className="text-ink leading-relaxed">{term.plainExplanation}</p>
            </div>

            {/* 提需求重点 */}
            <div>
              <p className="text-2xs font-semibold text-muted uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Sparkles size={11} className="text-[#B35309]" aria-hidden="true" />
                <span>{t(locale, 'wiki.whyItMatters')}</span>
              </p>
              <p className="text-muted leading-relaxed text-[0.8125rem]">
                {term.whyItMatters}
              </p>
            </div>
          </div>

          {/* 站内关联组件 */}
          {relatedPattern && (
            <div className="mt-3 border-t border-line2 pt-2.5">
              <Link
                href={h(`/patterns/${relatedPattern.id}`)}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-lg bg-[#F5F3EE] px-2.5 py-1.5 text-2xs font-medium text-ink transition-colors hover:bg-[#EDEAE3]"
              >
                <span className="flex items-center gap-1">
                  <BookOpen size={12} className="text-ink2" aria-hidden="true" />
                  <span>
                    {t(locale, 'wiki.viewLiveDemo')}: {relatedPattern.name}
                  </span>
                </span>
                <ArrowRight
                  size={12}
                  className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}

          {/* 外部搜索与文档 */}
          {term.links.length > 0 && (
            <div className="mt-2.5 border-t border-line2 pt-2">
              <p className="text-3xs uppercase tracking-wider text-muted mb-1">
                {t(locale, 'wiki.externalLinks')}
              </p>
              <div className="flex flex-wrap gap-1.5">
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
            </div>
          )}
        </div>
      )}
    </span>
  );
}
