'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { UIPattern } from '@/data/types';
import { CopyButton } from '@/components/ui/CopyButton';

const LEVELS = [
  {
    key: 'basic' as const,
    label: 'Level 1',
    name: '简单说法',
    hint: '你平时会怎么跟朋友说',
  },
  {
    key: 'detailed' as const,
    label: 'Level 2',
    name: '更准确',
    hint: '补上组件名和具体内容',
  },
  {
    key: 'implementation' as const,
    label: 'Level 3',
    name: '实现级描述',
    hint: '尺寸、状态、动效、无障碍',
  },
];

export function AskAI({ pattern }: { pattern: UIPattern }) {
  const [level, setLevel] = useState<'basic' | 'detailed' | 'implementation'>('detailed');
  const current = LEVELS.find((l) => l.key === level)!;

  return (
    <div>
      <div role="tablist" aria-label="Prompt 精细度" className="flex flex-wrap gap-1.5">
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
            <span className="mt-0.5 block text-[0.8125rem] font-medium">{l.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-card border border-line bg-[#FCFBF8]">
        <div className="flex items-center justify-between gap-2 border-b border-line px-3.5 py-2">
          <p className="text-2xs text-muted">{current.hint}</p>
          <CopyButton text={pattern.aiPrompt[level]} label="复制 Prompt" />
        </div>
        <p className="whitespace-pre-wrap px-3.5 py-3.5 font-mono text-[0.8125rem] leading-relaxed text-ink2">
          {pattern.aiPrompt[level]}
        </p>
      </div>
    </div>
  );
}

export function BadPrompt({ pattern }: { pattern: UIPattern }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-[#FCFBF8] p-3.5">
        <p className="mb-2 flex items-center gap-1.5 text-2xs font-medium text-[#A8342C]">
          <X size={13} aria-hidden="true" />
          不要这样对 AI 说
        </p>
        <p className="text-[0.875rem] leading-relaxed text-ink2 line-through decoration-[#C9C5BB] decoration-1">
          {pattern.badPrompt}
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface p-3.5">
        <p className="mb-2 flex items-center justify-between gap-2 text-2xs font-medium text-[#2C7355]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} aria-hidden="true" />
            改成这样说
          </span>
          <CopyButton text={pattern.betterPrompt} label="复制" />
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
