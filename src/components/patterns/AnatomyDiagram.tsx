'use client';

import type { AnatomyItem } from '@/data/types';

/**
 * Anatomy 图：用编号 + 图例的方式标注组件结构。
 * 不依赖任何外部图片，纯 CSS 实现。
 */
export function AnatomyDiagram({ items }: { items: AnatomyItem[] }) {
  return (
    <ol className="space-y-0">
      {items.map((a, i) => (
        <li key={a.label} className="flex gap-3.5 border-l border-line pb-4 pl-1 last:border-l-transparent last:pb-0">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-2xs font-semibold text-white"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-semibold text-ink">{a.label}</span>
              <span className="text-xs text-muted">{a.labelZh}</span>
            </p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink2">{a.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
