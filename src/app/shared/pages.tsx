import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowRight, Check, Compass, Search, Sparkles, X } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { HeroDemos } from '@/components/home/HeroDemos';
import { InteractiveStrip } from '@/components/home/InteractiveStrip';
import { PatternCard } from '@/components/patterns/PatternCard';
import { ExploreClient } from '@/components/explore/ExploreClient';
import { IdentifyClient } from '@/components/identify/IdentifyClient';
import { SearchClient } from '@/components/search/SearchClient';
import { LearnClient } from '@/components/learning/LearnClient';
import { DemoById } from '@/components/demo/DemoById';
import { patterns } from '@/data/patterns';
import { allComparisonSlugs } from '@/data/comparisons';
import { hasDemo } from '@/data/demoIds';
import {
  getCategories,
  getComparison,
  getComparisons,
  getContrastCards,
  getLearningLevels,
  getPattern,
} from '@/data/i18n/resolve';
import { languageAlternates, href, OG_LOCALE } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/ui-strings';

/**
 * 静态页的中英双版本工厂。
 * 与 pattern-page.tsx 同理：版式只有一份，语言差异只来自数据与词典。
 */

const HOT = [
  'bottom-sheet',
  'modal',
  'toast',
  'snackbar',
  'skeleton',
  'accordion',
  'tabs',
  'switch',
  'slider',
  'empty-state',
];

/* ============================ 首页 ============================ */

export function createHomePage(locale: Locale) {
  const hotPatterns = HOT.map((id) => getPattern(id, locale)!).filter(Boolean);
  const cats = getCategories(locale);
  const cards = getContrastCards(locale);

  return function HomePage() {
    return (
      <>
        <section className="border-b border-line">
          <div className="container-page py-12 sm:py-16">
            <div className="max-w-[720px]">
              <p className="meta mb-4">{t(locale, 'meta.tagline')}</p>
              <h1 className="text-[1.75rem] font-semibold leading-[1.25] tracking-tight text-ink sm:text-[2.5rem]">
                {t(locale, 'home.title1')}
                <br className="hidden sm:block" />
                {t(locale, 'home.title2')}
              </h1>
              <p className="mt-4 max-w-[560px] text-[0.9375rem] leading-relaxed text-ink2 sm:text-base">
                {t(locale, 'home.sub1')}
                <br className="hidden sm:block" />
                {t(locale, 'home.sub2', { n: patterns.length })}
              </p>
            </div>

            <div className="mt-8 max-w-[640px]">
              <SearchBar />
              <p className="mt-2.5 text-xs text-muted">
                {t(locale, 'home.searchHint')}{' '}
                <Link
                  href={href(locale === 'zh' ? '/search?q=%E5%BA%95%E4%B8%8B%E5%BC%B9%E5%87%BA%E6%9D%A5' : '/search?q=bottom+sheet', locale)}
                  className="underline underline-offset-4 hover:text-ink"
                >
                  {locale === 'zh' ? '底下弹出来' : 'bottom sheet'}
                </Link>{' '}
                {locale === 'zh' ? '或' : 'or'}{' '}
                <Link
                  href={href(locale === 'zh' ? '/search?q=%E4%B8%80%E6%AD%A5%E4%B8%80%E6%AD%A5%E5%A1%AB%E5%86%99' : '/search?q=fill+in+step+by+step', locale)}
                  className="underline underline-offset-4 hover:text-ink"
                >
                  {locale === 'zh' ? '一步一步填写' : 'fill in step by step'}
                </Link>
                {locale === 'zh' ? '。' : '.'}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link
                href={href('/identify', locale)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
              >
                <Compass size={16} aria-hidden="true" />
                {t(locale, 'home.identify')}
              </Link>
              <Link
                href={href('/learn', locale)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
              >
                <Sparkles size={16} aria-hidden="true" />
                {t(locale, 'home.learnL1')}
              </Link>
            </div>

            {/* 首屏下方就是组件本身，不是营销插画 */}
            <div className="mt-10">
              <HeroDemos />
            </div>
          </div>
        </section>

        <section className="border-b border-line bg-[#FCFBF8]">
          <div className="container-page py-12 sm:py-14">
            <p className="meta mb-2">{t(locale, 'home.playMeta')}</p>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
              {t(locale, 'home.playTitle')}
            </h2>
            <div className="mt-6">
              <InteractiveStrip />
            </div>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="container-page py-12 sm:py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="meta mb-2">{t(locale, 'home.contrastMeta')}</p>
                <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
                  {t(locale, 'home.contrastTitle')}
                </h2>
              </div>
              <Link
                href={href('/compare', locale)}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {t(locale, 'home.contrastAll', { n: allComparisonSlugs.length })}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((c) => (
                <Link
                  key={c.slug}
                  href={href(`/compare/${c.slug}`, locale)}
                  className="group flex items-center gap-2.5 rounded-card border border-line bg-surface p-3.5 card-hover"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-semibold text-ink">
                      {c.left}
                    </span>
                    <span className="mt-1 block text-2xs uppercase tracking-wider text-muted">vs</span>
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

        <section className="border-b border-line">
          <div className="container-page py-12 sm:py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="meta mb-2">{t(locale, 'home.hotMeta')}</p>
                <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
                  {t(locale, 'home.hotTitle', { n: 10 })}
                </h2>
              </div>
              <Link
                href={href('/explore', locale)}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {t(locale, 'home.allPatterns', { n: patterns.length })}
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

        <section>
          <div className="container-page py-12 sm:py-14">
            <p className="meta mb-2">{t(locale, 'home.catMeta')}</p>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
              {t(locale, 'home.catTitle', { n: cats.length })}
            </h2>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {cats.map((c) => {
                const count = patterns.filter((p) => p.category === c.id).length;
                return (
                  <Link
                    key={c.id}
                    href={href(`/explore?c=${c.id}`, locale)}
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
  };
}

/* ============================ 图鉴 ============================ */

export function createExplorePage(locale: Locale) {
  return function ExplorePage() {
    return (
      <div className="container-page py-10 sm:py-12">
        <header className="mb-8 max-w-[640px]">
          <p className="meta mb-2.5">{t(locale, 'explore.meta')}</p>
          <h1 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.875rem]">
            {t(locale, 'explore.all', { n: patterns.length })}
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
            {t(locale, 'explore.sub')}
          </p>
        </header>

        <Suspense fallback={<div className="h-40" />}>
          <ExploreClient />
        </Suspense>
      </div>
    );
  };
}

/* ============================ 学习路径 ============================ */

export function createLearnPage(locale: Locale) {
  const levels = getLearningLevels(locale);
  const cards = getContrastCards(locale);
  const compares = getComparisons(locale);

  return function LearnPage() {
    return (
      <div className="container-page py-10 sm:py-12">
        <header className="mb-8 max-w-[640px]">
          <p className="meta mb-2.5">{t(locale, 'learn.meta')}</p>
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
            {locale === 'zh' ? '按顺序来，不用一次学完' : 'Go in order — no need to finish at once'}
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
            {locale === 'zh'
              ? '这不是考试。学到哪儿算哪儿，进度存在你自己的浏览器里。'
              : "This isn't an exam. Stop whenever you like — your progress is stored in your own browser."}
          </p>
        </header>

        <LearnClient total={patterns.length} />

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            {locale === 'zh' ? '学习路径之外' : 'Beyond the learning path'}
          </h2>
          <p className="mt-2 max-w-[560px] text-[0.875rem] leading-relaxed text-ink2">
            {locale === 'zh'
              ? '「它们到底有什么区别」是独立开发者最高频的需求 —— 下面这 8 组值得单独看。'
              : '"What\'s the difference?" is the single most common question indie developers ask. These 8 deserve their own page.'}
          </p>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => {
              const full = compares.find((x) => x.slug === c.slug);
              return (
                <Link
                  key={c.slug}
                  href={href(`/compare/${c.slug}`, locale)}
                  className="rounded-card border border-line bg-surface p-3.5 transition-colors hover:border-[#C9C5BB]"
                >
                  <p className="text-[0.8125rem] font-semibold text-ink">
                    {c.left} <span className="text-muted">vs</span> {c.right}
                  </p>
                  {full && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                      {full.question}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            {locale === 'zh' ? '这条路径覆盖了什么' : 'What this path covers'}
          </h2>
          <ul className="mt-4 space-y-2">
            {levels.map((l) => (
              <li key={l.level} className="text-[0.875rem] text-ink2">
                <span className="font-medium text-ink">{l.name}</span> —— {l.description}
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  };
}

/* ============================ Identify ============================ */

export function createIdentifyPage(locale: Locale) {
  return function IdentifyPage() {
    return (
      <div className="container-page py-10 sm:py-12">
        <header className="mb-8 max-w-[600px]">
          <p className="meta mb-2.5">{t(locale, 'identify.meta')}</p>
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
            {t(locale, 'identify.title')}
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
            {t(locale, 'identify.sub')}
          </p>
          <p className="mt-1.5 text-xs text-muted">
            {locale === 'zh'
              ? '规则跑在你自己的浏览器里，不调用任何 AI 接口，也不上传选择。'
              : 'The rules run entirely in your browser — no AI API calls, nothing uploaded.'}
          </p>
        </header>

        <IdentifyClient />
      </div>
    );
  };
}

/* ============================ 搜索 ============================ */

export function createSearchPage(locale: Locale) {
  return function SearchPage() {
    return (
      <div className="container-page py-10 sm:py-12">
        <header className="mb-7 max-w-[640px]">
          <p className="meta mb-2.5">{t(locale, 'search.meta')}</p>
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
            {locale === 'zh' ? '用你记得的任何方式搜' : 'Search however you remember it'}
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
            {locale === 'zh'
              ? '中文、英文、别名，甚至你当时随口说的那句话。这里都能找到对应的专业术语。'
              : 'By name, by alias, or by the vague sentence you said at the time. The professional term is here.'}
          </p>
        </header>

        <Suspense fallback={<div className="h-40" />}>
          <SearchClient />
        </Suspense>
      </div>
    );
  };
}

/* ============================ 对比索引 ============================ */

export function createCompareIndexPage(locale: Locale) {
  const compares = getComparisons(locale);

  return function CompareIndexPage() {
    return (
      <div className="container-page py-10 sm:py-12">
        <header className="mb-8 max-w-[640px]">
          <p className="meta mb-2.5">{t(locale, 'compare.meta')}</p>
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
            {t(locale, 'compare.title')}
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
            {locale === 'zh'
              ? '人往往不是不认识 Button，而是不认识「区别」。每一组对比都给你一张表、几条决策规则，和一句能直接用的话。'
              : "You know Button. What you don't know is when NOT to use it. Each comparison gives you a table, a decision rule, and one sentence you can use."}
          </p>
        </header>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {compares.map((c) => (
            <Link
              key={c.slug}
              href={href(`/compare/${c.slug}`, locale)}
              className="group flex flex-col rounded-card border border-line bg-surface p-4 card-hover"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-[0.9375rem] font-semibold leading-snug text-ink">{c.title}</h2>
                  <p className="mt-1 text-xs text-muted">{c.subtitle}</p>
                </div>
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[#C9C5BB] transition-all group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </div>

              <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink2">{c.question}</p>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {c.patterns.map((id) => {
                  const p = getPattern(id, locale);
                  if (!p) return null;
                  return (
                    <span key={id} className="rounded-md bg-[#F2F0EB] px-2 py-0.5 text-2xs text-ink2">
                      {p.name}
                    </span>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };
}

/* ============================ 对比详情 ============================ */

function Cell({ value, locale }: { value: string | boolean; locale: Locale }) {
  if (value === true) {
    return (
      <span className="flex items-center gap-1 font-medium text-[#2C7355]">
        <Check size={14} aria-hidden="true" />
        {locale === 'zh' ? '是' : 'Yes'}
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="flex items-center gap-1 text-[#A8342C]">
        <X size={14} aria-hidden="true" />
        {locale === 'zh' ? '否' : 'No'}
      </span>
    );
  }
  return <span className="text-ink2">{value}</span>;
}

export function createCompareDetailPage(locale: Locale) {
  return async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const c = getComparison(slug, locale);
    if (!c) notFound();

    const others = getComparisons(locale)
      .filter((x) => x.slug !== c.slug)
      .slice(0, 3);

    return (
      <div className="container-page py-8 sm:py-10">
        <nav aria-label={t(locale, 'pattern.breadcrumb')} className="mb-5">
          <ol className="flex items-center gap-1.5 text-xs text-muted">
            <li>
              <Link
                href={href('/compare', locale)}
                className="underline-offset-4 hover:text-ink hover:underline"
              >
                {t(locale, 'compare.back')}
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

        <section className="mt-9">
          <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">
            {locale === 'zh' ? '对比表' : 'Comparison table'}
          </h2>
          <div className="table-scroll">
            <table className="w-full border-collapse overflow-hidden rounded-card border border-line bg-surface text-sm">
              <caption className="sr-only">{c.title}</caption>
              <thead>
                <tr className="border-b border-line bg-[#FCFBF8]">
                  <th scope="col" className="w-[112px] px-3.5 py-3 text-left text-xs font-medium text-muted">
                    {t(locale, 'compare.colPattern')}
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
                  const p = getPattern(row.pattern, locale);
                  return (
                    <tr key={row.pattern} className="border-b border-line2 last:border-b-0">
                      <th scope="row" className="px-3.5 py-3.5 text-left align-top">
                        {p ? (
                          <Link
                            href={href(`/patterns/${p.id}`, locale)}
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
                          <Cell value={cell} locale={locale} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-2xs text-muted sm:hidden">
            {locale === 'zh' ? '← 左右滑动查看完整表格' : '← Swipe to see the full table'}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">
            {locale === 'zh' ? '真实 Demo 对比' : 'The demos, side by side'}
          </h2>
          <div className="grid gap-3 lg:grid-cols-3">
            {c.patterns.map((id) => {
              const p = getPattern(id, locale);
              if (!p) return null;
              return (
                <div key={id} className="flex flex-col">
                  <div className="mb-2 flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold text-ink">{p.name}</h3>
                    <span className="text-2xs text-muted">{p.chineseName}</span>
                  </div>
                  {hasDemo(id) ? (
                    <DemoById id={id} />
                  ) : (
                    <div className="rounded-card border border-dashed border-line px-4 py-8 text-center text-xs text-muted">
                      {locale === 'zh' ? '这个组件暂无 Demo' : 'No demo for this one yet'}
                    </div>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-ink2">
                    <span className="font-medium text-ink">
                      {locale === 'zh' ? '怎么判断：' : 'How to decide: '}
                    </span>
                    {c.rows.find((r) => r.pattern === id)?.verdict}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">
            {t(locale, 'compare.decision')}
          </h2>
          <ul className="overflow-hidden rounded-card border border-line bg-surface">
            {c.decision.map((d, i) => (
              <li
                key={i}
                className="grid gap-1.5 border-b border-line2 px-4 py-3.5 last:border-b-0 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3"
              >
                <span className="text-[0.8125rem] leading-relaxed text-ink2">{d.if}</span>
                <span aria-hidden="true" className="hidden text-center text-xs text-[#C9C5BB] sm:block">
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

        <section className="mt-10">
          <div className="rounded-card border-l-[3px] border-ink bg-[#FCFBF8] p-5">
            <p className="meta mb-2.5">{t(locale, 'compare.takeaway')}</p>
            <p className="text-[1.0625rem] leading-relaxed text-ink">{c.takeaway}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-ink">
            {t(locale, 'compare.related')}
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={href(`/compare/${o.slug}`, locale)}
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
  };
}

export function createCompareDetailMetadata(locale: Locale) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }): Promise<Metadata> {
    const { slug } = await params;
    const c = getComparison(slug, locale);
    if (!c) return { title: locale === 'zh' ? '未找到' : 'Not found' };

    const title = locale === 'zh' ? `${c.title} 有什么区别？` : `${c.title}: What's the Difference?`;
    const description =
      locale === 'zh'
        ? `${c.question}用对比表和决策规则说清 ${c.title} 的区别，帮你选对组件。`
        : `${c.question} A comparison table and decision rules to help you pick the right one.`;

    return {
      title,
      description,
      alternates: languageAlternates(`/compare/${c.slug}`, locale),
      openGraph: {
        type: 'article',
        title,
        description,
        url: href(`/compare/${c.slug}`, locale),
        locale: OG_LOCALE[locale],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  };
}

export const compareStaticParams = () => allComparisonSlugs.map((slug) => ({ slug }));

/* ============================ 404 ============================ */

export function createNotFound(locale: Locale) {
  return function NotFound() {
    return (
      <div className="container-page flex min-h-[58vh] flex-col items-center justify-center py-16 text-center">
        <p className="meta mb-3">404</p>
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.75rem]">
          {t(locale, 'notfound.title')}
        </h1>
        <p className="mt-2.5 max-w-[420px] text-[0.9375rem] leading-relaxed text-ink2">
          {t(locale, 'notfound.desc')}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Link
            href={href('/search', locale)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
          >
            <Search size={15} aria-hidden="true" />
            {t(locale, 'notfound.search')}
          </Link>
          <Link
            href={href('/identify', locale)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
          >
            {t(locale, 'notfound.identify')}
          </Link>
          <Link
            href={href('/explore', locale)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
          >
            {t(locale, 'notfound.explore')}
          </Link>
        </div>
      </div>
    );
  };
}

/* ============================ Metadata ============================ */

const META: Record<string, { zh: [string, string]; en: [string, string] }> = {
  '/explore': {
    zh: ['UI 图鉴', '按分类浏览全部 UI Pattern，每个都有可交互 Demo、使用场景和可以直接告诉 AI 的 Prompt。'],
    en: [
      'UI Field Guide — All Patterns',
      'Browse every UI pattern by category. Each one has an interactive demo, usage guidance, and a prompt you can hand to AI.',
    ],
  },
  '/learn': {
    zh: [
      '学习路径',
      '从「每天都在看但不知道名字」到「理解 UX Pattern」的三级学习路径。进度保存在本地浏览器，不需要账号。',
    ],
    en: [
      'Learning Path',
      'Three levels from "I see it every day but don\'t know the name" to "I understand UX patterns". Progress stays in your browser — no account needed.',
    ],
  },
  '/identify': {
    zh: [
      '我不知道它叫什么',
      '按「它出现在哪儿」和「它主要干什么」两步筛出可能的 UI Pattern。纯本地规则，不需要 AI，不需要账号。',
    ],
    en: [
      "I Don't Know What It's Called",
      'Answer two questions — where it appears and what it does — to narrow down the pattern. Pure local rules, no AI, no account.',
    ],
  },
  '/compare': {
    zh: [
      '它们到底有什么区别',
      'Toast vs Snackbar vs Alert、Dialog vs Bottom Sheet vs Drawer、Tabs vs Segmented Control —— 用表格和决策规则说清 UI 组件之间的区别。',
    ],
    en: [
      'What Actually Differs',
      'Toast vs Snackbar vs Alert, Dialog vs Bottom Sheet vs Drawer, Tabs vs Segmented Control — side-by-side tables and decision rules.',
    ],
  },
  '/search': {
    zh: [
      '搜索 UI 术语',
      '用中文、英文、别名或你的口语描述搜索 UI Pattern。比如「底下弹出来」能找到 Bottom Sheet。',
    ],
    en: [
      'Search UI Terms',
      'Search UI patterns by English name, Chinese name, alias, or a vague description of what you remember seeing.',
    ],
  },
};

export function createStaticMetadata(path: string, locale: Locale): Metadata {
  const m = META[path][locale];
  return {
    title: m[0],
    description: m[1],
    alternates: languageAlternates(path, locale),
  };
}