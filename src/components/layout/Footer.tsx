'use client';

import Link from 'next/link';
import { allComparisonSlugs } from '@/data/comparisons';
import { patterns } from '@/data/patterns';
import { getCategories, getComparison } from '@/data/i18n/resolve';
import { site } from '@/lib/site';
import { t } from '@/lib/ui-strings';
import { useHref, useLocale } from './LocaleProvider';

export function Footer() {
  const locale = useLocale();
  const h = useHref();
  const featured = patterns.filter((p) => p.level === 1).slice(0, 10);
  const cats = getCategories(locale);
  const compares = allComparisonSlugs.slice(0, 6).map((s) => getComparison(s, locale)!);

  return (
    <footer className="mt-20 border-t border-line bg-[#F5F3EE]">
      <div className="container-page py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-ink">{site.name}</p>
            <p className="mt-0.5 text-xs font-medium text-ink2">by {site.parentName}</p>
            <p className="mt-2 max-w-[240px] text-[0.8125rem] leading-relaxed text-muted">
              {t(locale, 'meta.tagline')}
              {t(locale, 'footer.taglineSuffix')}
            </p>
            <div className="mt-3.5 flex flex-col gap-1 text-xs">
              <a
                href={site.parentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center text-ink2 underline-offset-4 hover:text-ink hover:underline"
              >
                {t(locale, 'footer.visitLutiveLab')} ↗
              </a>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center text-ink2 underline-offset-4 hover:text-ink hover:underline"
              >
                GitHub · MIT License ↗
              </a>
            </div>
          </div>

          <div>
            <p className="meta mb-2.5">{t(locale, 'footer.fromL1')}</p>
            <ul className="space-y-1.5">
              {featured.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link
                    href={h(`/patterns/${p.id}`)}
                    className="inline-flex min-h-[44px] items-center text-[0.8125rem] text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="meta mb-2.5">{t(locale, 'footer.compare')}</p>
            <ul className="space-y-1.5">
              {compares.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={h(`/compare/${c.slug}`)}
                    className="inline-flex min-h-[44px] items-center text-[0.8125rem] leading-snug text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="meta mb-2.5">{t(locale, 'footer.cats')}</p>
            <ul className="space-y-1.5">
              {cats.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link
                    href={h(`/explore?c=${c.id}`)}
                    className="inline-flex min-h-[44px] items-center text-[0.8125rem] text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {/* 中文页显示「导航 · Navigation」，英文页反过来——英文名在前更符合英文读者习惯 */}
                    {locale === 'zh' ? `${c.name} · ${c.chineseName}` : `${c.chineseName} · ${c.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-line pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>{t(locale, 'footer.stats', { n: patterns.length, m: allComparisonSlugs.length })}</p>
            <p>{t(locale, 'footer.privacy')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={h('/privacy')}
              className="inline-flex min-h-[36px] items-center underline-offset-4 hover:text-ink hover:underline"
            >
              {t(locale, 'legal.privacyTitle')}
            </Link>
            <Link
              href={h('/terms')}
              className="inline-flex min-h-[36px] items-center underline-offset-4 hover:text-ink hover:underline"
            >
              {t(locale, 'legal.termsTitle')}
            </Link>
            <span>© 2026 {site.parentName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}