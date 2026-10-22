'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, Minus, Share2, X } from 'lucide-react';
import type { UIPattern } from '@/data/types';
import type { Locale } from '@/lib/i18n';
import { href } from '@/lib/i18n';
import { getPattern, getComparison, getCategory } from '@/data/i18n/resolve';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import { demoRegistry } from '@/components/demo/registry';
import { AnatomyDiagram } from './AnatomyDiagram';
import { AskAI, BadPrompt } from './AskAI';
import { PatternCard } from './PatternCard';
import { ShareCardModal } from '@/components/social/ShareCardModal';
import { MarkLearnedButton } from './MarkLearnedButton';
import { Tocs } from './Tocs';

import type { Platform } from '@/data/types';

const PLATFORM_LABEL: Record<Platform, string> = {
  web: 'Web',
  mobile: 'Mobile',
  desktop: 'Desktop',
  ios: 'iOS',
  android: 'Android',
  harmonyos: 'HarmonyOS',
};
const DIFFICULTY = { easy: 'easy', medium: 'medium', hard: 'hard' } as const;

/** TOC 的 label 两种语言一致（本来就是英文术语），所以放在模块作用域不随语言变 */
const SECTIONS = [
  { id: 'demo', label: 'Live Demo' },
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'when', label: 'When to Use' },
  { id: 'similar', label: 'Similar' },
  { id: 'ask-ai', label: 'Ask AI' },
];

export function PatternDetailClient({ pattern }: { pattern: UIPattern }) {
  const locale = useLocale();
  const h = useHref();
  const [shareOpen, setShareOpen] = useState(false);
  const [fromLearn, setFromLearn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('from') === 'learn') {
        setFromLearn(true);
      }
    }
  }, []);

  const Demo = demoRegistry[pattern.id];
  const cat = getCategory(pattern.category, locale);
  const comparison = pattern.comparisonSlug ? getComparison(pattern.comparisonSlug, locale) : undefined;

  const similar = pattern.similarPatterns
    .map((id) => getPattern(id, locale))
    .filter((p): p is UIPattern => Boolean(p))
    .slice(0, 4);

  const compareWith = pattern.compareWith ? getPattern(pattern.compareWith, locale) : undefined;

  return (
    <article className="container-page py-8 sm:py-10">
      {/* 从 Learn 跳转而来的专属返回入口 */}
      {fromLearn && (
        <div className="mb-4">
          <Link
            id="return-to-learn-link"
            href={h(`/learn?item=${pattern.id}&from=learn`)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-accent/30 bg-[#EBF4F0] px-3.5 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-white"
          >
            <span aria-hidden="true">←</span>
            <span>
              {locale === 'zh'
                ? `返回 Learn · 继续 ${pattern.name} 课程`
                : `Return to Learn · Continue ${pattern.name}`}
            </span>
          </Link>
        </div>
      )}

      {/* 面包屑 */}
      <nav aria-label={t(locale, 'pattern.breadcrumb')} className="mb-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <li>
            <Link
              href={h('/explore')}
              className="inline-flex min-h-[44px] items-center underline-offset-4 hover:text-ink hover:underline"
            >
              {t(locale, 'common.explore')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href={h(`/explore?c=${pattern.category}`)}
              className="inline-flex min-h-[44px] items-center underline-offset-4 hover:text-ink hover:underline"
            >
              {locale === 'en' ? cat?.name : cat?.chineseName}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-ink2">{pattern.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="min-w-0">
          {/* Title */}
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <span className="meta">{cat?.name}</span>
              <span aria-hidden="true" className="text-[#C9C5BB]">·</span>
              <span className="meta">Level {pattern.level}</span>
            </div>

            <h1 className="mt-2.5 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.125rem]">
              {pattern.name}
            </h1>
            <p className="mt-1 text-[1.0625rem] text-muted">{pattern.chineseName}</p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {pattern.specialBadge && (
                <span className="rounded-md border border-[#1D734C]/30 bg-[#1D734C]/10 px-2 py-0.5 text-2xs font-semibold text-[#1D734C]">
                  {pattern.specialBadge}
                </span>
              )}
              {pattern.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-2xs font-medium text-ink2"
                >
                  {PLATFORM_LABEL[p]}
                </span>
              ))}
              <span className="text-2xs text-muted">
                {t(locale, 'pattern.difficulty')}: {t(locale, `difficulty.${DIFFICULTY[pattern.difficulty]}`)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <MarkLearnedButton patternId={pattern.id} />
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-[#F5F3EE]"
              >
                <Share2 size={14} aria-hidden="true" />
                {t(locale, 'pattern.share')}
              </button>
            </div>
          </header>

          {/* 一句话解释 */}
          <p className="mt-6 border-l-[3px] border-ink pl-4 text-[1.0625rem] leading-relaxed text-ink">
            {pattern.oneLine}
          </p>

          {/* Live Demo */}
          <section id="demo" className="scroll-mt-20 pt-9">
            <SectionHead index="01" title={t(locale, 'section.demo')} sub={t(locale, 'section.demoSub')} />
            {Demo ? (
              <>
                <Demo />
                <p className="mt-4 rounded-lg bg-[#F5F3EE] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink2">
                  <span className="font-medium text-ink">{t(locale, 'pattern.seenBefore')}</span>
                  {pattern.looksLike}
                </p>
              </>
            ) : (
              <div className="rounded-card border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
                {t(locale, 'pattern.demoComing')}
                <span className="mt-1.5 block text-xs">{t(locale, 'pattern.demoComingSub')}</span>
              </div>
            )}
          </section>

          {/* 详细解释 */}
          <section className="pt-9">
            <SectionHead index="02" title={t(locale, 'pattern.what')} />
            <p className="prose-note">{pattern.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {pattern.aliases.map((a) => (
                <span
                  key={a}
                  className="rounded-md bg-[#F2F0EB] px-2 py-0.5 text-2xs text-ink2"
                >
                  {a}
                </span>
              ))}
            </div>
          </section>

          {/* Anatomy */}
          <section id="anatomy" className="scroll-mt-20 pt-9">
            <SectionHead index="03" title={t(locale, 'pattern.anatomy')} />
            <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
              <AnatomyDiagram items={pattern.anatomy} />
            </div>
          </section>

          {/* When to Use */}
          <section id="when" className="scroll-mt-20 pt-9">
            <SectionHead index="04" title={t(locale, 'pattern.whenTitle')} sub={t(locale, 'pattern.whenSub')} />
            <div className="overflow-hidden rounded-card border border-line">
              <table className="w-full text-sm">
                <caption className="sr-only">{t(locale, 'pattern.usageCaption', { name: pattern.name })}</caption>
                <thead>
                  <tr className="border-b border-line bg-[#FCFBF8]">
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted">
                      {t(locale, 'pattern.colSituation')}
                    </th>
                    <th scope="col" className="w-24 px-4 py-2.5 text-left text-xs font-medium text-muted">
                      {t(locale, 'pattern.colRecommend')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pattern.whenToUse.map((row) => (
                    <tr key={row.situation} className="border-b border-line2 last:border-b-0">
                      <td className="px-4 py-2.5 text-[0.8125rem] leading-snug text-ink2">
                        {row.situation}
                      </td>
                      <td className="px-4 py-2.5">
                        {row.recommended === true ? (
                          <span className="flex items-center gap-1 text-[0.8125rem] font-medium text-[#2C7355]">
                            <Check size={14} aria-hidden="true" />
                            {t(locale, 'pattern.use')}
                          </span>
                        ) : row.recommended === false ? (
                          <span className="flex items-center gap-1 text-[0.8125rem] text-[#A8342C]">
                            <X size={14} aria-hidden="true" />
                            {t(locale, 'pattern.notUse')}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[0.8125rem] text-[#94701C]">
                            <Minus size={14} aria-hidden="true" />
                            {t(locale, 'pattern.maybeUse')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pattern.whenNotToUse.length > 0 && (
              <div className="mt-3 space-y-2">
                {pattern.whenNotToUse.map((w) => (
                  <p
                    key={w}
                    className="flex items-start gap-2 rounded-lg bg-[#FAEDEC] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-[#7A241F]"
                  >
                    <X size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span>{w}</span>
                  </p>
                ))}
              </div>
            )}
          </section>

          {/* Similar */}
          <section id="similar" className="scroll-mt-20 pt-9">
            <SectionHead index="05" title={t(locale, 'pattern.similarTitle')} sub={t(locale, 'pattern.similarSub')} />
            {comparison && (
              <Link
                href={h(`/compare/${comparison.slug}`)}
                className="mb-4 flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 card-hover"
              >
                <span className="min-w-0">
                  <span className="meta mb-1 block">{t(locale, 'pattern.fullCompare')}</span>
                  <span className="block text-sm font-semibold text-ink">
                    {comparison.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted">{comparison.question}</span>
                </span>
                <span className="shrink-0 rounded-lg bg-[#F2F0EB] px-2.5 py-1.5 text-2xs text-ink2">
                  {t(locale, 'pattern.viewTable')}
                </span>
              </Link>
            )}

            {compareWith && (
              <div className="mb-4 rounded-card border border-line bg-[#FCFBF8] p-4">
                <p className="meta mb-2.5">{t(locale, 'pattern.mostConfused')}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CompareBlock pattern={pattern} locale={locale} self />
                  {compareWith && <CompareBlock pattern={compareWith} locale={locale} />}
                </div>
                <p className="mt-3 border-t border-line pt-3 text-[0.8125rem] leading-relaxed text-ink2">
                  <span className="font-medium text-ink">{t(locale, 'pattern.oneLineDiff')}</span>
                  {pattern.oneLine}
                </p>
              </div>
            )}

            {similar.length > 0 && (
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {similar.map((p) => (
                  <PatternCard key={p.id} pattern={p} showPreview={false} />
                ))}
              </div>
            )}
          </section>

          {/* Ask AI */}
          <section id="ask-ai" className="scroll-mt-20 pt-9">
            <SectionHead index="06" title={t(locale, 'pattern.askAi')} sub={t(locale, 'pattern.askAiSub')} />
            <AskAI pattern={pattern} />
          </section>

          {/* Bad prompt */}
          <section className="pt-9">
            <SectionHead index="07" title={t(locale, 'pattern.badPrompt')} sub={t(locale, 'pattern.badPromptSub')} />
            <BadPrompt pattern={pattern} />
          </section>

          {/* Share card */}
          <section className="pt-9">
            <SectionHead index="08" title={t(locale, 'pattern.shareTitle')} sub={t(locale, 'pattern.shareSub')} />
            <div className="rounded-card border border-line bg-[#FCFBF8] p-4 sm:p-5">
              <p className="text-[0.8125rem] leading-relaxed text-ink2">
                {t(locale, 'pattern.shareDesc')}
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
                >
                  <Share2 size={14} aria-hidden="true" />
                  {t(locale, 'pattern.share')}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* 侧边 TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Tocs sections={SECTIONS} />
          </div>
        </aside>
      </div>

      {shareOpen && (
        <ShareCardModal pattern={pattern} onClose={() => setShareOpen(false)} />
      )}
    </article>
  );
}

function SectionHead({
  index,
  title,
  sub,
}: {
  index: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="mb-4 flex items-baseline gap-2.5">
      <span className="font-mono text-2xs tabular-nums text-muted">{index}</span>
      <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{title}</h2>
      {sub && <span className="text-xs text-muted">{sub}</span>}
      <span className="mt-2 h-px flex-1 bg-line" aria-hidden="true" />
    </header>
  );
}

function CompareBlock({
  pattern,
  locale,
  self = false,
}: {
  pattern: UIPattern;
  locale: Locale;
  self?: boolean;
}) {
  return (
    <Link
      href={href(`/patterns/${pattern.id}`, locale)}
      className={`block rounded-lg border p-3 transition-colors ${
        self
          ? 'border-ink bg-surface'
          : 'border-line bg-surface hover:border-[#C9C5BB]'
      }`}
    >
      <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
        {pattern.name}
        {self && (
          <span className="text-2xs font-normal text-muted">
            {t(locale, 'pattern.current')}
          </span>
        )}
      </p>
      <p className="mt-0.5 text-2xs text-muted">{pattern.chineseName}</p>
      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-ink2">
        {pattern.oneLine}
      </p>
    </Link>
  );
}
