'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, Minus, Share2, X } from 'lucide-react';
import type { UIPattern } from '@/data/types';
import { patternMap } from '@/data/patterns';
import { comparisonMap } from '@/data/comparisons';
import { categoryMap } from '@/data/categories';
import { demoRegistry } from '@/components/demo/registry';
import { AnatomyDiagram } from './AnatomyDiagram';
import { AskAI, BadPrompt } from './AskAI';
import { PatternCard } from './PatternCard';
import { ShareCardModal } from '@/components/social/ShareCardModal';
import { MarkLearnedButton } from './MarkLearnedButton';
import { Tocs } from './Tocs';

const PLATFORM_LABEL = { web: 'Web', mobile: 'Mobile', desktop: 'Desktop' } as const;
const DIFFICULTY = { easy: '容易', medium: '中等', hard: '进阶' } as const;

const SECTIONS = [
  { id: 'demo', label: 'Live Demo' },
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'when', label: 'When to Use' },
  { id: 'similar', label: 'Similar' },
  { id: 'ask-ai', label: 'Ask AI' },
];

export function PatternDetailClient({ pattern }: { pattern: UIPattern }) {
  const [shareOpen, setShareOpen] = useState(false);
  const Demo = demoRegistry[pattern.id];
  const cat = categoryMap[pattern.category];
  const comparison = pattern.comparisonSlug ? comparisonMap[pattern.comparisonSlug] : undefined;

  const similar = pattern.similarPatterns
    .map((id) => patternMap[id])
    .filter(Boolean)
    .slice(0, 4);

  const compareWith = pattern.compareWith ? patternMap[pattern.compareWith] : undefined;

  return (
    <article className="container-page py-8 sm:py-10">
      {/* 面包屑 */}
      <nav aria-label="面包屑" className="mb-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <li>
            <Link
              href="/explore"
              className="inline-flex min-h-[44px] items-center underline-offset-4 hover:text-ink hover:underline"
            >
              图鉴
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href={`/explore?c=${pattern.category}`}
              className="inline-flex min-h-[44px] items-center underline-offset-4 hover:text-ink hover:underline"
            >
              {cat?.chineseName}
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
              {pattern.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-2xs font-medium text-ink2"
                >
                  {PLATFORM_LABEL[p]}
                </span>
              ))}
              <span className="text-2xs text-muted">上手难度：{DIFFICULTY[pattern.difficulty]}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <MarkLearnedButton patternId={pattern.id} />
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-[#F5F3EE]"
              >
                <Share2 size={14} aria-hidden="true" />
                生成分享卡片
              </button>
            </div>
          </header>

          {/* 一句话解释 */}
          <p className="mt-6 border-l-[3px] border-ink pl-4 text-[1.0625rem] leading-relaxed text-ink">
            {pattern.oneLine}
          </p>

          {/* Live Demo */}
          <section id="demo" className="scroll-mt-20 pt-9">
            <SectionHead index="01" title="Live Demo" sub="真的可以点" />
            {Demo ? (
              <>
                <Demo />
                <p className="mt-4 rounded-lg bg-[#F5F3EE] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink2">
                  <span className="font-medium text-ink">你刚才看到的这个：</span>
                  {pattern.looksLike}
                </p>
              </>
            ) : (
              <div className="rounded-card border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
                这个组件的 Demo 还在路上。
                <span className="mt-1.5 block text-xs">
                  但它该被用在哪里，下面写清楚了。
                </span>
              </div>
            )}
          </section>

          {/* 详细解释 */}
          <section className="pt-9">
            <SectionHead index="02" title="它到底是什么" />
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
            <SectionHead index="03" title="Anatomy · 它由什么组成" />
            <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
              <AnatomyDiagram items={pattern.anatomy} />
            </div>
          </section>

          {/* When to Use */}
          <section id="when" className="scroll-mt-20 pt-9">
            <SectionHead index="04" title="When to Use" sub="什么时候该用 / 不该用" />
            <div className="overflow-hidden rounded-card border border-line">
              <table className="w-full text-sm">
                <caption className="sr-only">{pattern.name} 使用场景建议</caption>
                <thead>
                  <tr className="border-b border-line bg-[#FCFBF8]">
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted">
                      情况
                    </th>
                    <th scope="col" className="w-24 px-4 py-2.5 text-left text-xs font-medium text-muted">
                      推荐
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
                            用
                          </span>
                        ) : row.recommended === false ? (
                          <span className="flex items-center gap-1 text-[0.8125rem] text-[#A8342C]">
                            <X size={14} aria-hidden="true" />
                            不用
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[0.8125rem] text-[#94701C]">
                            <Minus size={14} aria-hidden="true" />
                            视情况
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
            <SectionHead index="05" title="Similar Patterns" sub="别搞混" />
            {comparison && (
              <Link
                href={`/compare/${comparison.slug}`}
                className="mb-4 flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 card-hover"
              >
                <span className="min-w-0">
                  <span className="meta mb-1 block">完整对比</span>
                  <span className="block text-sm font-semibold text-ink">
                    {comparison.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted">{comparison.question}</span>
                </span>
                <span className="shrink-0 rounded-lg bg-[#F2F0EB] px-2.5 py-1.5 text-2xs text-ink2">
                  查看表格
                </span>
              </Link>
            )}

            {compareWith && (
              <div className="mb-4 rounded-card border border-line bg-[#FCFBF8] p-4">
                <p className="meta mb-2.5">最容易混淆的一个</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CompareBlock pattern={pattern} self />
                  {compareWith && <CompareBlock pattern={compareWith} />}
                </div>
                <p className="mt-3 border-t border-line pt-3 text-[0.8125rem] leading-relaxed text-ink2">
                  <span className="font-medium text-ink">一句话区分：</span>
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
            <SectionHead index="06" title="怎么告诉 AI" sub="三层 Prompt" />
            <AskAI pattern={pattern} />
          </section>

          {/* Bad prompt */}
          <section className="pt-9">
            <SectionHead index="07" title="不要只对 AI 说" sub="Bad → Better" />
            <BadPrompt pattern={pattern} />
          </section>

          {/* Share card */}
          <section className="pt-9">
            <SectionHead index="08" title="分享这张卡" sub="社交平台友好" />
            <div className="rounded-card border border-line bg-[#FCFBF8] p-4 sm:p-5">
              <p className="text-[0.8125rem] leading-relaxed text-ink2">
                把这个 Pattern 做成 3:4（小红书）或 1:1（X / Reddit）的知识卡片，在浏览器里直接导出 PNG，不需要后端。
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
                >
                  <Share2 size={14} aria-hidden="true" />
                  生成分享卡片
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

function CompareBlock({ pattern, self = false }: { pattern: UIPattern; self?: boolean }) {
  return (
    <Link
      href={`/patterns/${pattern.id}`}
      className={`block rounded-lg border p-3 transition-colors ${
        self
          ? 'border-ink bg-surface'
          : 'border-line bg-surface hover:border-[#C9C5BB]'
      }`}
    >
      <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
        {pattern.name}
        {self && <span className="text-2xs font-normal text-muted">当前</span>}
      </p>
      <p className="mt-0.5 text-2xs text-muted">{pattern.chineseName}</p>
      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-ink2">
        {pattern.oneLine}
      </p>
    </Link>
  );
}
