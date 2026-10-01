import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PatternDetailClient } from '@/components/patterns/PatternDetailClient';
import { allPatternIds, patterns } from '@/data/patterns';
import { getPattern } from '@/data/i18n/resolve';
import { patternTitle, patternDescription } from '@/lib/site';
import { languageAlternates, href, OG_LOCALE } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/ui-strings';

/**
 * 词条详情页的中英双版本工厂。
 *
 * ZH 和 EN 页面结构完全一致，只有 locale 不同。与其维护两份几乎相同的 JSX，
 * 不如一个工厂——改版式只需要改一处，两边同时生效，不会漂移。
 */
export function createPatternPage(locale: Locale) {
  return async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pattern = getPattern(slug, locale);

    if (!pattern) notFound();

    const others = patterns
      .filter((p) => p.id !== pattern.id && p.level === pattern.level)
      .slice(0, 3)
      .map((p) => getPattern(p.id, locale)!);

    return (
      <>
        <PatternDetailClient pattern={pattern} />

        {others.length > 0 && (
          <section className="border-t border-line bg-[#FCFBF8]">
            <div className="container-page py-10">
              <p className="meta mb-4">{t(locale, 'pattern.sameLevel')}</p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {others.map((p) => (
                  <Link
                    key={p.id}
                    href={href(`/patterns/${p.id}`, locale)}
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
  };
}

export function createPatternMetadata(locale: Locale) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }): Promise<Metadata> {
    const { slug } = await params;
    const p = getPattern(slug, locale);
    if (!p) return { title: locale === 'zh' ? '未找到' : 'Not found' };

    const title = patternTitle(p.name, locale);
    const description = patternDescription(p.name, p.chineseName, p.oneLine, locale);

    return {
      title,
      description,
      alternates: languageAlternates(`/patterns/${p.id}`, locale),
      openGraph: {
        type: 'article',
        title,
        description,
        url: href(`/patterns/${p.id}`, locale),
        siteName: 'UI Field Guide',
        locale: OG_LOCALE[locale],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  };
}

export const patternStaticParams = () => allPatternIds.map((id) => ({ slug: id }));