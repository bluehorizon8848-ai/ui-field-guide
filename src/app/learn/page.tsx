import type { Metadata } from 'next';
import { LearnClient } from '@/components/learning/LearnClient';
import { learningLevels, contrastCards } from '@/data/learning';
import { patterns } from '@/data/patterns';
import { comparisons } from '@/data/comparisons';

export const metadata: Metadata = {
  title: '学习路径',
  description:
    '从「每天都在看但不知道名字」到「理解 UX Pattern」的三级学习路径。进度保存在本地浏览器，不需要账号。',
  alternates: { canonical: '/learn' },
};

export default function LearnPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <header className="mb-8 max-w-[640px]">
        <p className="meta mb-2.5">Learn · 学习路径</p>
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
          按顺序来，不用一次学完
        </h1>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
          这不是考试。学到哪儿算哪儿，进度存在你自己的浏览器里。
        </p>
      </header>

      <LearnClient total={patterns.length} />

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-ink">学习路径之外</h2>
        <p className="mt-2 max-w-[560px] text-[0.875rem] leading-relaxed text-ink2">
          「它们到底有什么区别」是独立开发者最高频的需求 —— 下面这 8 组值得单独看。
        </p>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {contrastCards.map((c) => {
            const full = comparisons.find((x) => x.slug === c.slug);
            return (
              <a
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="rounded-card border border-line bg-surface p-3.5 transition-colors hover:border-[#C9C5BB]"
              >
                <p className="text-[0.8125rem] font-semibold text-ink">
                  {c.left} <span className="text-muted">vs</span> {c.right}
                </p>
                {full && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                    {full.question}
                  </p>
                )}
              </a>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-ink">这条路径覆盖了什么</h2>
        <ul className="mt-4 space-y-2">
          {learningLevels.map((l) => (
            <li key={l.level} className="text-[0.875rem] text-ink2">
              <span className="font-medium text-ink">{l.name}</span> —— {l.description}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
