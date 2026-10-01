'use client';

import Link from 'next/link';
import type { UIPattern } from '@/data/types';
import { categoryMap } from '@/data/categories';
import { hasDemo } from '@/data/demoIds';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import { MiniPreview } from './MiniPreview';

export function PatternCard({
  pattern,
  showPreview = true,
  headingLevel = 3,
}: {
  pattern: UIPattern;
  showPreview?: boolean;
  /**
   * 标题层级。Explore / Search 页面里卡片是 h2 的同级内容，
   * 用 h3 会造成 h1 → h3 跳级，破坏标题大纲。
   */
  headingLevel?: 2 | 3;
}) {
  const locale = useLocale();
  const h = useHref();
  const cat = categoryMap[pattern.category];
  const has = hasDemo(pattern.id);
  const Heading = `h${headingLevel}` as 'h2' | 'h3';

  return (
    <Link
      href={h(`/patterns/${pattern.id}`)}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface card-hover hover:-translate-y-0.5"
    >
      {showPreview && (
        <div className="relative h-[132px] shrink-0 overflow-hidden border-b border-line bg-[#FCFBF8]">
          <MiniPreview id={pattern.id} />
          {!has && (
            <span className="absolute right-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-2xs text-muted">
              {t(locale, 'card.noDemo')}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${cat?.tint ?? 'bg-[#F2F0EB]'}`} />
          <span className="meta !text-[0.625rem]">{cat?.chineseName}</span>
          {has && showPreview && (
            <span className="ml-auto text-2xs text-[#2C7355]">
              {t(locale, 'card.interactive')}
            </span>
          )}
        </div>

        <Heading className="mt-1.5 text-[0.9375rem] font-semibold leading-snug tracking-tight text-ink">
          {pattern.name}
        </Heading>
        <p className="mt-0.5 text-xs text-muted">{pattern.chineseName}</p>

        <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink2">
          {pattern.oneLine}
        </p>
      </div>
    </Link>
  );
}

export function PatternCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="h-[132px] animate-pulse bg-[#F0EDE6]" />
      <div className="space-y-2 p-3.5">
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-[#F0EDE6]" />
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-[#F0EDE6]" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-[#F5F3EE]" />
      </div>
    </div>
  );
}