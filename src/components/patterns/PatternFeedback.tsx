'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import { trackEvent } from '@/lib/analytics';

type NegativeReason = 'unclear_explanation' | 'demo_issue' | 'prompt_not_useful' | 'other';

interface PatternFeedbackProps {
  patternId: string;
}

export function PatternFeedback({ patternId }: PatternFeedbackProps) {
  const locale = useLocale();

  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [selectedReason, setSelectedReason] = useState<NegativeReason>('unclear_explanation');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'already_voted'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const sessionKey = `uifg_voted_${patternId}`;

  // Check if user already submitted in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem(sessionKey)) {
          setStatus('already_voted');
        }
      } catch {
        // Ignore sessionStorage restrictions
      }
    }
  }, [sessionKey]);

  const submitFeedback = async (voteValue: 'yes' | 'no', reasonVal?: NegativeReason, commentVal?: string) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern_id: patternId,
          vote: voteValue,
          reason: voteValue === 'no' ? reasonVal : undefined,
          optional_comment: voteValue === 'no' && commentVal?.trim() ? commentVal.trim() : undefined,
          locale,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || t(locale, 'feedback.error'));
      }

      // Success
      setStatus('success');
      try {
        sessionStorage.setItem(sessionKey, voteValue);
      } catch {
        // Ignore
      }

      // GA4 event tracking
      trackEvent('feedback_submit', {
        pattern_id: patternId,
        vote: voteValue,
        reason: voteValue === 'no' ? reasonVal : undefined,
      });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : t(locale, 'feedback.error'));
    }
  };

  const handlePositiveClick = () => {
    setVote('yes');
    submitFeedback('yes');
  };

  const handleNegativeClick = () => {
    setVote('no');
  };

  const handleNegativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback('no', selectedReason, comment);
  };

  if (status === 'already_voted' || status === 'success') {
    return (
      <aside
        aria-label={t(locale, 'feedback.helpfulQuestion')}
        className="mt-8 rounded-card border border-line bg-[#FAF9F6] p-4 text-center sm:p-5"
      >
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#2C7355]" role="status">
          <Check size={16} aria-hidden="true" />
          <span>{t(locale, 'feedback.thankYou')}</span>
        </div>
        <p className="mt-1 text-2xs text-muted">
          {t(locale, 'feedback.alreadySubmitted')}
        </p>
      </aside>
    );
  }

  const reasons: { id: NegativeReason; labelKey: 'feedback.reasonUnclear' | 'feedback.reasonDemo' | 'feedback.reasonPrompt' | 'feedback.reasonOther' }[] = [
    { id: 'unclear_explanation', labelKey: 'feedback.reasonUnclear' },
    { id: 'demo_issue', labelKey: 'feedback.reasonDemo' },
    { id: 'prompt_not_useful', labelKey: 'feedback.reasonPrompt' },
    { id: 'other', labelKey: 'feedback.reasonOther' },
  ];

  return (
    <aside
      aria-label={t(locale, 'feedback.helpfulQuestion')}
      className="mt-8 rounded-card border border-line bg-[#FAF9F6] p-4 sm:p-5"
    >
      <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-sm font-medium text-ink">
            {t(locale, 'feedback.helpfulQuestion')}
          </p>
          <p className="text-2xs text-muted">
            {locale === 'zh'
              ? '帮助我们持续提升词典解释与 Demo 体验（免登录匿名提交）'
              : 'Help us improve explanations and demos (anonymous, no sign-in required)'}
          </p>
        </div>

        {vote !== 'no' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePositiveClick}
              disabled={status === 'submitting'}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-[#2C7355] hover:bg-[#F0F7F4] hover:text-[#2C7355] focus:outline-none focus:ring-2 focus:ring-[#2C7355] disabled:opacity-50"
            >
              <ThumbsUp size={14} aria-hidden="true" />
              <span>{t(locale, 'feedback.yes')}</span>
            </button>
            <button
              type="button"
              onClick={handleNegativeClick}
              disabled={status === 'submitting'}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-[#A8342C] hover:bg-[#FCF5F5] hover:text-[#A8342C] focus:outline-none focus:ring-2 focus:ring-[#A8342C] disabled:opacity-50"
            >
              <ThumbsDown size={14} aria-hidden="true" />
              <span>{t(locale, 'feedback.notYet')}</span>
            </button>
          </div>
        )}
      </div>

      {vote === 'no' && (
        <form onSubmit={handleNegativeSubmit} className="mt-4 border-t border-line/60 pt-4">
          <fieldset>
            <legend className="text-xs font-medium text-ink">
              {t(locale, 'feedback.whyNot')}
            </legend>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {reasons.map((r) => (
                <label
                  key={r.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-xs transition-colors ${
                    selectedReason === r.id
                      ? 'border-ink bg-surface font-semibold text-ink shadow-2xs'
                      : 'border-line bg-surface/60 text-ink2 hover:bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="feedback-reason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={() => setSelectedReason(r.id)}
                    className="h-4 w-4 text-ink focus:ring-ink"
                  />
                  <span>{t(locale, r.labelKey)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-3">
            <label htmlFor={`feedback-comment-${patternId}`} className="sr-only">
              {t(locale, 'feedback.commentPlaceholder')}
            </label>
            <textarea
              id={`feedback-comment-${patternId}`}
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              maxLength={500}
              placeholder={t(locale, 'feedback.commentPlaceholder')}
              rows={3}
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />
            <div className="mt-1 flex justify-end text-2xs text-muted">
              <span>{comment.length}/500</span>
            </div>
          </div>

          {status === 'error' && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#A8342C]" role="alert">
              <AlertCircle size={14} aria-hidden="true" />
              <span>{errorMessage || t(locale, 'feedback.error')}</span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setVote(null)}
              className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-medium text-muted hover:text-ink"
            >
              {t(locale, 'common.close')}
            </button>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#35322C] focus:outline-none focus:ring-2 focus:ring-ink disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <RefreshCw size={13} className="animate-spin" aria-hidden="true" />
                  <span>{t(locale, 'feedback.submitting')}</span>
                </>
              ) : status === 'error' ? (
                <span>{t(locale, 'feedback.retry')}</span>
              ) : (
                <span>{t(locale, 'feedback.submit')}</span>
              )}
            </button>
          </div>
        </form>
      )}
    </aside>
  );
}
