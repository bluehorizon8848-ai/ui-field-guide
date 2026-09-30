import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

// 静态导出（output: 'export'）要求 Route Handler 显式声明为静态。
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
