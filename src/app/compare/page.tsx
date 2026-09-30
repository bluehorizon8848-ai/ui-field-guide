import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { comparisons } from '@/data/comparisons';
import { patternMap } from '@/data/patterns';

export const metadata: Metadata = {
  title: '它们到底有什么区别',
  description:
    'Toast vs Snackbar vs Alert、Dialog vs Bottom Sheet vs Drawer、Tabs vs Segmented Control —— 用表格和决策规则说清 UI 组件之间的区别。',
  alternates: { canonical: '/compare' },
};

export default function CompareIndexPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <header className="mb-8 max-w-[640px]">
        <p className="meta mb-2.5">Compare · 对比</p>
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
          它们到底有什么区别？
        </h1>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
          人往往不是不认识 Button，而是不认识「区别」。每一组对比都给你一张表、几条决策规则，和一句能直接用的话。
        </p>
      </header>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {comparisons.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="group flex flex-col rounded-card border border-line bg-surface p-4 card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-[0.9375rem] font-semibold leading-snug text-ink">
                  {c.title}
                </h2>
                <p className="mt-1 text-xs text-muted">{c.subtitle}</p>
              </div>
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="mt-1 shrink-0 text-[#C9C5BB] transition-all group-hover:translate-x-0.5 group-hover:text-ink"
              />
            </div>

            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink2">{c.question}</p>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {c.patterns.map((id) => {
                const p = patternMap[id];
                if (!p) return null;
                return (
                  <span
                    key={id}
                    className="rounded-md bg-[#F2F0EB] px-2 py-0.5 text-2xs text-ink2"
                  >
                    {p.name}
                  </span>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
