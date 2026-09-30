import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, Minus, X } from 'lucide-react';
import { getComparison, allComparisonSlugs, comparisons } from '@/data/comparisons';
import { patternMap } from '@/data/patterns';
import { hasDemo } from '@/data/demoIds';
import { DemoById } from '@/components/demo/DemoById';
import { absoluteUrl } from '@/lib/site';

export function generateStaticParams() {
  return allComparisonSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return { title: '未找到' };

  const title = `${c.title} 有什么区别？`;
  const description = `${c.question}用对比表和决策规则说清 ${c.title} 的区别，帮你选对组件。`;
  const url = absoluteUrl(`/compare/${c.slug}`);

  return {
    title,
    description,
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: { type: 'article', title, description, url, locale: 'zh_CN' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="flex items-center gap-1 font-medium text-[#2C7355]">
        <Check size={14} aria-hidden="true" />
        是
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="flex items-center gap-1 text-[#A8342C]">
        <X size={14} aria-hidden="true" />
        否
      </span>
    );
  }
  return <span className="text-ink2">{value}</span>;
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  const others = comparisons.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <div className="container-page py-8 sm:py-10">
      <nav aria-label="面包屑" className="mb-5">
        <ol className="flex items-center gap-1.5 text-xs text-muted">
          <li>
            <Link href="/compare" className="underline-offset-4 hover:text-ink hover:underline">
              对比
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-ink2">{c.title}</li>
        </ol>
      </nav>

      <header className="max-w-[680px]">
        <h1 className="text-[1.625rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {c.title}
        </h1>
        <p className="mt-2 text-[0.9375rem] text-muted">{c.subtitle}</p>
        <p className="mt-4 border-l-[3px] border-ink pl-4 text-[1.0625rem] leading-relaxed text-ink">
          {c.question}
        </p>
      </header>

      {/* 对比表 */}
      <section className="mt-9">
        <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">对比表</h2>
        <div className="table-scroll">
          <table className="w-full border-collapse overflow-hidden rounded-card border border-line bg-surface text-sm">
            <caption className="sr-only">{c.title} 详细对比</caption>
            <thead>
              <tr className="border-b border-line bg-[#FCFBF8]">
                <th scope="col" className="w-[112px] px-3.5 py-3 text-left text-xs font-medium text-muted">
                  Pattern
                </th>
                {c.columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-3.5 py-3 text-left text-xs font-medium text-muted"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row) => {
                const p = patternMap[row.pattern];
                return (
                  <tr key={row.pattern} className="border-b border-line2 last:border-b-0">
                    <th scope="row" className="px-3.5 py-3.5 text-left align-top">
                      {p ? (
                        <Link
                          href={`/patterns/${p.id}`}
                          className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
                        >
                          {p.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-ink">{row.pattern}</span>
                      )}
                      {p && (
                        <span className="mt-0.5 block text-2xs font-normal text-muted">
                          {p.chineseName}
                        </span>
                      )}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td key={i} className="px-3.5 py-3.5 align-top text-[0.8125rem]">
                        <Cell value={cell} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-2xs text-muted sm:hidden">← 左右滑动查看完整表格</p>
      </section>

      {/* 实时 Demo */}
      <section className="mt-10">
        <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">真实 Demo 对比</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {c.patterns.map((id) => {
            const p = patternMap[id];
            const has = hasDemo(id);
            if (!p) return null;
            return (
              <div key={id} className="flex flex-col">
                <div className="mb-2 flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-ink">{p.name}</h3>
                  <span className="text-2xs text-muted">{p.chineseName}</span>
                </div>
                {has ? (
                  <DemoById id={id} />
                ) : (
                  <div className="rounded-card border border-dashed border-line px-4 py-8 text-center text-xs text-muted">
                    这个组件暂无 Demo
                  </div>
                )}
                <p className="mt-2 text-xs leading-relaxed text-ink2">
                  <span className="font-medium text-ink">怎么判断：</span>
                  {c.rows.find((r) => r.pattern === id)?.verdict}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 决策规则 */}
      <section className="mt-10">
        <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">怎么选</h2>
        <ul className="overflow-hidden rounded-card border border-line bg-surface">
          {c.decision.map((d, i) => (
            <li
              key={i}
              className="grid gap-1.5 border-b border-line2 px-4 py-3.5 last:border-b-0 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3"
            >
              <span className="text-[0.8125rem] leading-relaxed text-ink2">{d.if}</span>
              <span
                aria-hidden="true"
                className="hidden text-center text-xs text-[#C9C5BB] sm:block"
              >
                →
              </span>
              <span className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink sm:justify-end">
                <Check size={13} className="shrink-0 text-[#2C7355]" aria-hidden="true" />
                {d.then}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Takeaway */}
      <section className="mt-10">
        <div className="rounded-card border-l-[3px] border-ink bg-[#FCFBF8] p-5">
          <p className="meta mb-2.5">一句话记住</p>
          <p className="text-[1.0625rem] leading-relaxed text-ink">{c.takeaway}</p>
        </div>
      </section>

      {/* 相关对比 */}
      <section className="mt-10">
        <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">相关的其他对比</h2>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/compare/${o.slug}`}
              className="rounded-card border border-line bg-surface p-3.5 transition-colors hover:border-[#C9C5BB]"
            >
              <p className="text-[0.8125rem] font-semibold leading-snug text-ink">{o.title}</p>
              <p className="mt-1 text-xs text-muted">{o.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
