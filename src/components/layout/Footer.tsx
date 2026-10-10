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
  const featured = patterns.filter((p) => p.level === 1).slice(0, 6);
  const cats = getCategories(locale);
  const compares = allComparisonSlugs.slice(0, 6).map((s) => getComparison(s, locale)!);

  return (
    <footer className="mt-20 border-t border-line bg-[#F5F3EE]">
      <div className="container-page py-10 sm:py-12">
        {/* 4 列主导航区：严格水平基准线对齐，响应式双列/四列精简 */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 列 1：品牌与项目信息 */}
          <div className="flex flex-col">
            <p className="meta mb-3">{locale === 'zh' ? '关于 · ABOUT' : 'ABOUT'}</p>
            <div>
              <p className="text-sm font-semibold tracking-tight text-ink">{site.name}</p>
              <p className="mt-0.5 text-xs font-medium text-ink2">by {site.parentName}</p>
            </div>
            <p className="mt-2.5 max-w-[260px] text-[0.8125rem] leading-relaxed text-muted">
              {t(locale, 'meta.tagline')}
              {t(locale, 'footer.taglineSuffix')}
            </p>
            <div className="mt-4 flex flex-col space-y-1.5 text-[0.8125rem]">
              <a
                href={site.parentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center py-1 text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {t(locale, 'footer.visitLutiveLab')} ↗
              </a>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center py-1 text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                GitHub · MIT License ↗
              </a>
            </div>
          </div>

          {/* 列 2：从 Level 1 开始 */}
          <div className="flex flex-col">
            <p className="meta mb-3">{t(locale, 'footer.fromL1')}</p>
            <ul className="space-y-1.5">
              {featured.map((p) => (
                <li key={p.id}>
                  <Link
                    href={h(`/patterns/${p.id}`)}
                    className="inline-flex items-center py-1 text-[0.8125rem] text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 列 3：对比 */}
          <div className="flex flex-col">
            <p className="meta mb-3">{t(locale, 'footer.compare')}</p>
            <ul className="space-y-1.5">
              {compares.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={h(`/compare/${c.slug}`)}
                    className="inline-flex items-center py-1 text-[0.8125rem] leading-snug text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 列 4：分类 */}
          <div className="flex flex-col">
            <p className="meta mb-3">{t(locale, 'footer.cats')}</p>
            <ul className="space-y-1.5">
              {cats.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link
                    href={h(`/explore?c=${c.id}`)}
                    className="inline-flex items-center py-1 text-[0.8125rem] text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {locale === 'zh' ? `${c.name} · ${c.chineseName}` : `${c.chineseName} · ${c.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部版权与条款栏 */}
        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 leading-relaxed">
            <p>{t(locale, 'footer.stats', { n: patterns.length, m: allComparisonSlugs.length })}</p>
            <p>{t(locale, 'footer.privacy')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link
              href={h('/privacy')}
              className="inline-flex items-center py-1 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {t(locale, 'legal.privacyTitle')}
            </Link>
            <Link
              href={h('/terms')}
              className="inline-flex items-center py-1 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {t(locale, 'legal.termsTitle')}
            </Link>
            <span className="py-1">© 2026 {site.parentName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}