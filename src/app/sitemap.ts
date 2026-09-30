import type { MetadataRoute } from 'next';
import { allPatternIds } from '@/data/patterns';
import { allComparisonSlugs } from '@/data/comparisons';
import { absoluteUrl } from '@/lib/site';

// 静态导出（output: 'export'）要求 Route Handler 显式声明为静态。
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/explore'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/learn'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/identify'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/compare'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/search'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const patterns: MetadataRoute.Sitemap = allPatternIds.map((id) => ({
    url: absoluteUrl(`/patterns/${id}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const comparisons: MetadataRoute.Sitemap = allComparisonSlugs.map((slug) => ({
    url: absoluteUrl(`/compare/${slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...statics, ...patterns, ...comparisons];
}
