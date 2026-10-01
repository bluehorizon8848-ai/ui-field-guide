'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { UIPattern } from '@/data/types';
import { CopyButton } from '@/components/ui/CopyButton';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import type { UIKey } from '@/lib/ui-strings';

const LEVELS = [
  { key: 'basic' as const, label: 'Level 1', nameKey: 'ask.l1name', hintKey: 'ask.l1hint' },
  { key: 'detailed' as const, label: 'Level 2', nameKey: 'ask.l2name', hintKey: 'ask.l2hint' },
  {
    key: 'implementation' as const,
    label: 'Level 3',
    nameKey: 'ask.l3name',
    hintKey: 'ask.l3hint',
  },
];

export function AskAI({ pattern }: { pattern: UIPattern }) {
  const locale = useLocale();
  const [level, setLevel] = useState<'basic' | 'detailed' | 'implementation'>('detailed');
  const current = LEVELS.find((l) => l.key === level)!;

  return (
    <div>
      <div
        role="tablist"
        aria-label={t(locale, 'ask.tablist')}
        className="flex flex-wrap gap-1.5"
      >
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            role="tab"
            aria-selected={level === l.key}
            onClick={() => setLevel(l.key)}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-left transition-colors ${
              level === l.key ? 'bg-ink text-white' : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
            }`}
          >
            <span className="block text-2xs uppercase tracking-wider opacity-70">{l.label}</span>
            <span className="mt-0.5 block text-[0.8125rem] font-medium">
              {t(locale, l.nameKey as UIKey)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-card border border-line bg-[#FCFBF8]">
        <div className="flex items-center justify-between gap-2 border-b border-line px-3.5 py-2">
          <p className="text-2xs text-muted">{t(locale, current.hintKey as UIKey)}</p>
          <CopyButton text={pattern.aiPrompt[level]} label={t(locale, 'ask.copyPrompt')} />
        </div>
        <p className="whitespace-pre-wrap px-3.5 py-3.5 font-mono text-[0.8125rem] leading-relaxed text-ink2">
          {pattern.aiPrompt[level]}
        </p>
      </div>
    </div>
  );
}

export function BadPrompt({ pattern }: { pattern: UIPattern }) {
  const locale = useLocale();
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-[#FCFBF8] p-3.5">
        <p className="mb-2 flex items-center gap-1.5 text-2xs font-medium text-[#A8342C]">
          <X size={13} aria-hidden="true" />
          {t(locale, 'ask.dontSay')}
        </p>
        <p className="text-[0.875rem] leading-relaxed text-ink2 line-through decoration-[#C9C5BB] decoration-1">
          {pattern.badPrompt}
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface p-3.5">
        <p className="mb-2 flex items-center justify-between gap-2 text-2xs font-medium text-[#2C7355]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} aria-hidden="true" />
            {t(locale, 'ask.sayInstead')}
          </span>
          <CopyButton text={pattern.betterPrompt} label={t(locale, 'common.copy')} />
        </p>
        <p className="text-[0.875rem] leading-relaxed text-ink">{pattern.betterPrompt}</p>
      </div>
    </div>
  );
}

export function AlertNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted">
      <AlertCircle size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}