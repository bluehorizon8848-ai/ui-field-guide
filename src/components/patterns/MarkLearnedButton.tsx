'use client';

import { Check, CheckCircle2 } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function MarkLearnedButton({ patternId }: { patternId: string }) {
  const locale = useLocale();
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
      {t(locale, learned ? 'pattern.markedLearned' : 'pattern.markLearned')}
    </button>
  );
}
