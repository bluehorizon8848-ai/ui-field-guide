import type { MetadataRoute } from 'next';
import { allPatternIds } from '@/data/patterns';
import { allComparisonSlugs } from '@/data/comparisons';
import { absoluteUrl } from '@/lib/site';
import { href } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

// 静态导出（output: 'export'）要求 Route Handler 显式声明为静态。
export const dynamic = 'force-static';

const LOCALES: Locale[] = ['zh', 'en'];

/**
 * sitemap 覆盖两种语言。
 *
 * Next 的 Sitemap 类型没有 alternates.languages 字段（那是 metadata 的能力），
 * 所以 hreflang 关系靠每条 URL 自身页面里的 <link rel="alternate"> 表达，
 * sitemap 只负责把两个语言的 URL 都列全，别漏掉 /en 那一半。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/explore', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/learn', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/identify', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/compare', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/search', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const s of statics) {
      entries.push({
        url: absoluteUrl(href(s.path, locale)),
        lastModified: now,
        changeFrequency: s.changeFrequency,
        priority: s.priority,
      });
    }

    for (const id of allPatternIds) {
      entries.push({
        url: absoluteUrl(href(`/patterns/${id}`, locale)),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    for (const slug of allComparisonSlugs) {
      entries.push({
        url: absoluteUrl(href(`/compare/${slug}`, locale)),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}