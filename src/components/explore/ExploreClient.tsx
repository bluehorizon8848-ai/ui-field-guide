'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { categories, categoryMap } from '@/data/categories';
import { searchPatterns } from '@/data/search';
import { PatternCard } from '@/components/patterns/PatternCard';

const LEVELS = [
  { v: 'all', label: '全部难度' },
  { v: '1', label: 'Level 1' },
  { v: '2', label: 'Level 2' },
  { v: '3', label: 'Level 3' },
];

export function ExploreClient() {
  const params = useSearchParams();
  const initialCat = params.get('c') ?? 'all';
  const [cat, setCat] = useState(
    categories.some((c) => c.id === initialCat) ? initialCat : 'all'
  );
  const [level, setLevel] = useState('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    let out = patterns;
    if (cat !== 'all') out = out.filter((p) => p.category === cat);
    if (level !== 'all') out = out.filter((p) => p.level === Number(level));
    if (q.trim()) {
      const hits = new Set(searchPatterns(q, patterns).map((h) => h.pattern.id));
      out = patterns.filter((p) => hits.has(p.id));
      if (cat !== 'all') out = out.filter((p) => p.category === cat);
      if (level !== 'all') out = out.filter((p) => p.level === Number(level));
    }
    return out;
  }, [cat, level, q]);

  const activeCat = categoryMap[cat];

  return (
    <div>
      <div className="mb-5 max-w-[560px]">
        <label htmlFor="explore-q" className="sr-only">
          搜索词条
        </label>
        <div className="relative">
          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="explore-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索中文、英文、别名或口语描述…"
            className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-10 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label="清除搜索"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip active={cat === 'all'} onClick={() => setCat('all')}>
            全部 {patterns.length}
          </FilterChip>
          {categories.map((c) => {
            const count = patterns.filter((p) => p.category === c.id).length;
            if (count === 0) return null;
            return (
              <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {c.chineseName} {count}
              </FilterChip>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="meta mr-1">难度</span>
          {LEVELS.map((l) => (
            <FilterChip
              key={l.v}
              active={level === l.v}
              onClick={() => setLevel(l.v)}
              subtle
            >
              {l.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {activeCat && cat !== 'all' && (
        <p className="mb-5 max-w-[620px] border-l-2 border-line pl-3.5 text-[0.875rem] leading-relaxed text-ink2">
          {activeCat.blurb}
        </p>
      )}

      <p className="mb-4 text-xs text-muted" role="status" aria-live="polite">
        {list.length} 个 Pattern
        {q.trim() ? `，匹配「${q}」` : ''}
      </p>

      {list.length === 0 ? (
        <div className="rounded-card border border-dashed border-line px-6 py-14 text-center">
          <p className="text-sm text-ink">没有符合条件的词条</p>
          <button
            type="button"
            onClick={() => {
              setCat('all');
              setLevel('all');
              setQ('');
            }}
            className="mt-2 text-xs text-ink2 underline underline-offset-4 hover:text-ink"
          >
            清除全部筛选
          </button>
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <PatternCard key={p.id} pattern={p} headingLevel={2} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  subtle = false,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
        active
          ? 'bg-ink text-white'
          : subtle
            ? 'text-ink2 hover:bg-[#F2F0EB]'
            : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
      }`}
    >
      {children}
    </button>
  );
}
