import Link from 'next/link';
import { categories } from '@/data/categories';
import { patterns } from '@/data/patterns';
import { comparisons } from '@/data/comparisons';
import { site } from '@/lib/site';

export function Footer() {
  const featured = patterns.filter((p) => p.level === 1).slice(0, 10);

  return (
    <footer className="mt-20 border-t border-line bg-[#F5F3EE]">
      <div className="container-page py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-ink">{site.name}</p>
            <p className="mt-2 max-w-[240px] text-[0.8125rem] leading-relaxed text-muted">
              {site.tagline}。看到 → 理解 → 知道名字 → 知道什么时候用 → 学会怎么告诉 AI。
            </p>
          </div>

          <div>
            <p className="meta mb-2.5">从 Level 1 开始</p>
            <ul className="space-y-1.5">
              {featured.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/patterns/${p.id}`}
                    className="inline-flex min-h-[44px] items-center text-[0.8125rem] text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="meta mb-2.5">对比</p>
            <ul className="space-y-1.5">
              {comparisons.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/compare/${c.slug}`}
                    className="inline-flex min-h-[44px] items-center text-[0.8125rem] leading-snug text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="meta mb-2.5">分类</p>
            <ul className="space-y-1.5">
              {categories.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/explore?c=${c.id}`}
                    className="inline-flex min-h-[44px] items-center text-[0.8125rem] text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {c.name} · {c.chineseName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-line pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {patterns.length} 个 Pattern · {comparisons.length} 组对比 · 静态部署，无账号无后端
          </p>
          <p>
            学习进度保存在你自己的浏览器里（LocalStorage），不上传任何数据。
          </p>
        </div>
      </div>
    </footer>
  );
}
