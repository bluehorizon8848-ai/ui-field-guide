'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { demoRegistry } from '@/components/demo/registry';
import { patternMap } from '@/data/patterns';

const STRIP = [
  { id: 'accordion', name: 'Accordion', zh: '手风琴 / 折叠面板' },
  { id: 'bottom-sheet', name: 'Bottom Sheet', zh: '底部弹出面板' },
  { id: 'toast', name: 'Toast', zh: '轻提示' },
];

/**
 * 首屏下方的「真的可以玩」区。
 * 三个最典型的浮层/折叠类组件 —— 正好对应独立开发者最常问的三句话。
 */
export function InteractiveStrip() {
  const [active, setActive] = useState(STRIP[0].id);
  const Demo = demoRegistry[active];
  const pattern = patternMap[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="挑选一个试试"
        className="flex flex-wrap gap-1.5 border-b border-line"
      >
        {STRIP.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active === s.id}
            onClick={() => setActive(s.id)}
            className={`relative -mb-px rounded-t-lg px-3.5 py-2.5 text-left transition-colors ${
              active === s.id ? 'text-ink' : 'text-muted hover:text-ink2'
            }`}
          >
            <span className="block text-sm font-semibold">{s.name}</span>
            <span className="mt-0.5 block text-2xs">{s.zh}</span>
            {active === s.id && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ink" />
            )}
          </button>
        ))}
      </div>

      {Demo && pattern && (
        <div className="mt-5">
          <p className="mb-4 max-w-[620px] text-[0.9375rem] leading-relaxed text-ink2">
            {pattern.oneLine}
          </p>
          <Demo />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/patterns/${pattern.id}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
            >
              它叫什么，什么时候用
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href={`/patterns/${pattern.id}#ask-ai`}
              className="inline-flex min-h-[44px] items-center text-sm text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              直接抄 Prompt 给 AI
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
