'use client';

import { useState } from 'react';
import { Bookmark, ExternalLink, Heart, Sparkles, Star } from 'lucide-react';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import { DemoStage } from './DemoStage';

export function CardDemo() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<number>(1);

  return (
    <DemoStage caption={t(locale, 'demo.containers.caption.card')}>
      <div className="mx-auto flex w-full max-w-[540px] flex-col items-center justify-center gap-4 sm:flex-row sm:items-stretch">
        {/* 卡片 1：内容与精选卡 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedCard(1)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedCard(1);
            }
          }}
          className={`group flex w-full max-w-[260px] flex-col justify-between rounded-2xl border bg-surface p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent ${
            selectedCard === 1
              ? 'border-accent shadow-sm ring-1 ring-accent/20'
              : 'border-line hover:border-lineDark'
          }`}
        >
          <div>
            {/* 媒体封面区 (16:9) */}
            <div className="relative mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#EBF4F0] to-[#E2ECE7]">
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-accent">
                <Sparkles size={14} aria-hidden="true" />
                Featured
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                aria-label={liked ? 'Unlike' : 'Like'}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-muted shadow-xs transition hover:scale-110 hover:text-danger"
              >
                <Heart
                  size={15}
                  className={liked ? 'fill-danger text-danger' : 'text-muted'}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 标题与描述 */}
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-[#F2F0EB] px-2 py-0.5 text-2xs font-medium text-ink2">
                {isZh ? '设计模式' : 'UI Pattern'}
              </span>
              <span className="text-2xs text-muted">Level 1</span>
            </div>
            <h4 className="text-sm font-semibold text-ink group-hover:text-accent">
              {isZh ? '设计系统卡片容器' : 'Design System Card'}
            </h4>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
              {isZh
                ? '独立自包含的信息单元，将相关内容组织在统一卡片面内。'
                : 'Self-contained surface grouping related information together.'}
            </p>
          </div>

          {/* 底部操作区 */}
          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
            <span className="text-xs font-semibold text-ink">
              {liked ? (isZh ? '已喜欢 · 1' : 'Liked · 1') : isZh ? '0 喜欢' : '0 Likes'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
              {isZh ? '探索' : 'Explore'}
              <ExternalLink size={12} aria-hidden="true" />
            </span>
          </div>
        </div>

        {/* 卡片 2：功能操作卡 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedCard(2)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedCard(2);
            }
          }}
          className={`group flex w-full max-w-[260px] flex-col justify-between rounded-2xl border bg-surface p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent ${
            selectedCard === 2
              ? 'border-accent shadow-sm ring-1 ring-accent/20'
              : 'border-line hover:border-lineDark'
          }`}
        >
          <div>
            {/* 媒体封面区 */}
            <div className="relative mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#F5F3EE] to-[#EAE6DD]">
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-ink2">
                <Star size={14} className="text-amber-500" aria-hidden="true" />
                4.9 / 5.0
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSaved(!saved);
                }}
                aria-label={saved ? 'Unsave' : 'Save'}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-muted shadow-xs transition hover:scale-110 hover:text-accent"
              >
                <Bookmark
                  size={15}
                  className={saved ? 'fill-accent text-accent' : 'text-muted'}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 标题与描述 */}
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-[#F2F0EB] px-2 py-0.5 text-2xs font-medium text-ink2">
                {isZh ? '交互组件' : 'Component'}
              </span>
              <span className="font-mono text-xs font-bold text-ink">Free</span>
            </div>
            <h4 className="text-sm font-semibold text-ink group-hover:text-accent">
              {isZh ? '可复用组件规范' : 'Reusable Component'}
            </h4>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
              {isZh
                ? '整卡具备明确的点击边界，支持单独点击、收藏与状态反馈。'
                : 'Clear bounding surface with hover feedback and actions.'}
            </p>
          </div>

          {/* 底部操作区 */}
          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
            <span className="text-xs text-muted">
              {saved ? (isZh ? '已收藏' : 'Saved') : isZh ? '未收藏' : 'Not saved'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSaved(!saved);
              }}
              className={`min-touch-target rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                saved
                  ? 'bg-[#EBF4F0] text-accent'
                  : 'bg-ink text-white hover:bg-ink2'
              }`}
            >
              {saved ? (isZh ? '已加入' : 'Added') : isZh ? '加入收藏' : 'Bookmark'}
            </button>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}
