import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PatternDetailClient } from '@/components/patterns/PatternDetailClient';
import { patterns, patternMap, allPatternIds } from '@/data/patterns';
import { patternTitle, patternDescription, absoluteUrl } from '@/lib/site';

export function generateStaticParams() {
  return allPatternIds.map((id) => ({ slug: id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = patternMap[slug];
  if (!p) return { title: '未找到' };

  const title = patternTitle(p.name);
  const description = patternDescription(p.name, p.chineseName, p.oneLine);
  const url = absoluteUrl(`/patterns/${p.id}`);

  return {
    title,
    description,
    alternates: { canonical: `/patterns/${p.id}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'UI Field Guide',
      locale: 'zh_CN',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = patternMap[slug];

  if (!pattern) notFound();

  const others = patterns
    .filter((p) => p.id !== pattern.id && p.level === pattern.level)
    .slice(0, 3);

  return (
    <>
      <PatternDetailClient pattern={pattern} />

      {others.length > 0 && (
        <section className="border-t border-line bg-[#FCFBF8]">
          <div className="container-page py-10">
            <p className="meta mb-4">同 Level 的其他词条</p>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/patterns/${p.id}`}
                  className="rounded-card border border-line bg-surface p-4 transition-colors hover:border-[#C9C5BB]"
                >
                  <p className="text-sm font-semibold text-ink">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.chineseName}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink2">
                    {p.oneLine}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
