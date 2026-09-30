'use client';

import { Check, CheckCircle2 } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

export function MarkLearnedButton({ patternId }: { patternId: string }) {
  const { isLearned, toggle, ready } = useProgress();
  const learned = ready && isLearned(patternId);

  return (
    <button
      type="button"
      onClick={() => toggle(patternId)}
      aria-pressed={learned}
      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
        learned
          ? 'border-[#2C7355] bg-[#E6F2EC] text-[#2C7355]'
          : 'border-line bg-surface text-ink hover:bg-[#F5F3EE]'
      }`}
    >
      {learned ? (
        <CheckCircle2 size={14} aria-hidden="true" />
      ) : (
        <Check size={14} aria-hidden="true" />
      )}
      {learned ? '已认识这个词' : '标记为已认识'}
    </button>
  );
}
