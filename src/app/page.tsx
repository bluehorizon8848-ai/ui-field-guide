import Link from 'next/link';
import { ArrowRight, Compass, Shuffle, Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { HeroDemos } from '@/components/home/HeroDemos';
import { InteractiveStrip } from '@/components/home/InteractiveStrip';
import { PatternCard } from '@/components/patterns/PatternCard';
import { contrastCards } from '@/data/learning';
import { patterns } from '@/data/patterns';
import { categories } from '@/data/categories';

export default function HomePage() {
  const hot = ['bottom-sheet', 'modal', 'toast', 'snackbar', 'skeleton', 'accordion', 'tabs', 'switch', 'slider', 'empty-state'];
  const hotPatterns = hot.map((id) => patterns.find((p) => p.id === id)!).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-page py-12 sm:py-16">
          <div className="max-w-[720px]">
            <p className="meta mb-4">
              AI 独立开发者的 UI / UX 可视化词典
            </p>
            <h1 className="text-[1.75rem] font-semibold leading-[1.25] tracking-tight text-ink sm:text-[2.5rem]">
              你知道自己想要什么，
              <br className="hidden sm:block" />
              只是不知道它叫什么。
            </h1>
            <p className="mt-4 max-w-[560px] text-[0.9375rem] leading-relaxed text-ink2 sm:text-base">
              看示例、学名字、理解场景，然后直接告诉 AI。
              <br className="hidden sm:block" />
              这里有 {patterns.length} 个真实的 UI Pattern，每一条都能点、能玩、能抄 Prompt。
            </p>
          </div>

          <div className="mt-8 max-w-[640px]">
            <SearchBar />
            <p className="mt-2.5 text-xs text-muted">
              支持中文、英文、别名。你的口语描述也能搜 —— 试试
              <Link href="/search?q=%E5%BA%95%E4%B8%8B%E5%BC%B9%E5%87%BA%E6%9D%A5" className="mx-1 underline underline-offset-4 hover:text-ink">
                底下弹出来
              </Link>
              或
              <Link href="/search?q=%E4%B8%80%E6%AD%A5%E4%B8%80%E6%AD%A5%E5%A1%AB%E5%86%99" className="mx-1 underline underline-offset-4 hover:text-ink">
                一步一步填写
              </Link>
              。
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link
              href="/identify"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
            >
              <Compass size={16} aria-hidden="true" />
              我不知道它叫什么
            </Link>
            <Link
              href="/learn"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
            >
              <Sparkles size={16} aria-hidden="true" />
              从 Level 1 开始学
            </Link>
          </div>

          {/* 首屏下方就是组件本身，不是营销插画 */}
          <div className="mt-10">
            <HeroDemos />
          </div>
        </div>
      </section>

      {/* 真的可以玩 */}
      <section className="border-b border-line bg-[#FCFBF8]">
        <div className="container-page py-12 sm:py-14">
          <p className="meta mb-2">先玩，再学名字</p>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
            这三个是独立开发者最常问的
          </h2>
          <div className="mt-6">
            <InteractiveStrip />
          </div>
        </div>
      </section>

      {/* Learn by Contrast */}
      <section className="border-b border-line">
        <div className="container-page py-12 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="meta mb-2">它们到底有什么区别？</p>
              <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
                人不是不认识 Button，是不认识「区别」
              </h2>
            </div>
            <Link
              href="/compare"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              全部 8 组对比
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {contrastCards.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group flex items-center gap-2.5 rounded-card border border-line bg-surface p-3.5 card-hover"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem] font-semibold text-ink">
                    {c.left}
                  </span>
                  <span className="mt-1 block text-2xs uppercase tracking-wider text-muted">
                    vs
                  </span>
                  <span className="mt-1 block truncate text-[0.8125rem] font-semibold text-ink">
                    {c.right}
                  </span>
                </span>
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="shrink-0 text-[#C9C5BB] transition-all group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 热门术语 */}
      <section className="border-b border-line">
        <div className="container-page py-12 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="meta mb-2">最常被搜到的</p>
              <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
                先认识这 10 个
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              全部 {patterns.length} 个
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {hotPatterns.map((p) => (
              <PatternCard key={p.id} pattern={p} showPreview={false} />
            ))}
          </div>
        </div>
      </section>

      {/* 分类入口 */}
      <section>
        <div className="container-page py-12 sm:py-14">
          <p className="meta mb-2">按分类逛</p>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
            8 个分类
          </h2>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {categories.map((c) => {
              const count = patterns.filter((p) => p.category === c.id).length;
              return (
                <Link
                  key={c.id}
                  href={`/explore?c=${c.id}`}
                  className="group flex items-start gap-3.5 rounded-card border border-line bg-surface p-4 card-hover"
                >
                  <span className={`mt-0.5 h-9 w-1.5 shrink-0 rounded-full ${c.tint}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-ink">{c.name}</span>
                      <span className="text-xs text-muted">{c.chineseName}</span>
                      <span className="ml-auto shrink-0 text-2xs tabular-nums text-muted">
                        {count}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink2">
                      {c.blurb}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
