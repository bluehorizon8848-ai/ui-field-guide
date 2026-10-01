'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { demoRegistry } from '@/components/demo/registry';
import { getPattern } from '@/data/i18n/resolve';
import { useHref, useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

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
  const locale = useLocale();
  const h = useHref();
  const Demo = demoRegistry[active];
  const pattern = getPattern(active, locale);

  return (
    <div>
      <div
        role="tablist"
        aria-label={t(locale, 'strip.pickOne')}
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
              href={h(`/patterns/${pattern.id}`)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
            >
              {t(locale, 'strip.whatIsIt')}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href={h(`/patterns/${pattern.id}#ask-ai`)}
              className="inline-flex min-h-[44px] items-center text-sm text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {t(locale, 'strip.copyPrompt')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}