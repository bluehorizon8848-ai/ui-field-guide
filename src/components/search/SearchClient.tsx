'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, X } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { searchPatterns } from '@/data/search';
import { PatternCard } from '@/components/patterns/PatternCard';

const EXAMPLES = ['底下弹出来', '一步一步填写', '转圈圈', '撤销', '红点', '折叠', '分层展开'];

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get('q') ?? '');

  const results = useMemo(() => (q.trim() ? searchPatterns(q, patterns) : []), [q]);

  const submit = (v: string) => {
    const t = v.trim();
    router.replace(t ? `/search?q=${encodeURIComponent(t)}` : '/search', { scroll: false });
  };

  return (
    <div>
      <div className="relative max-w-[620px]">
        <label htmlFor="search-q" className="sr-only">
          搜索 UI 术语
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
          placeholder="试试「底下弹出来」或「bottom sheet」"
          className="h-14 w-full rounded-xl border border-line bg-surface pl-12 pr-11 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              submit('');
            }}
            aria-label="清除"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {!q.trim() ? (
        <div className="mt-8">
          <p className="meta mb-3">你的口语描述也能搜</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((e) => (
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
            这些是独立开发者最常说的几句话。它们对应的专业术语分别是 Bottom Sheet、Stepper、
            Spinner、Snackbar、Badge、Accordion、Progressive Disclosure。
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-line px-6 py-14 text-center">
          <p className="text-sm text-ink">没找到「{q}」</p>
          <p className="mt-1.5 text-xs text-muted">
            换个说法试试，或者去
            <a href="/identify" className="mx-1 underline underline-offset-4 hover:text-ink">
              「我不知道它叫什么」
            </a>
            让选项帮你定位。
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 mt-7 text-xs text-muted" role="status" aria-live="polite">
            {results.length} 个结果
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ pattern, matchedBy }) => (
              <div key={pattern.id} className="relative">
                <PatternCard pattern={pattern} headingLevel={2} />
                <span className="absolute right-3 top-3 rounded bg-white/95 px-1.5 py-0.5 text-2xs text-muted">
                  匹配：{matchedBy}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
