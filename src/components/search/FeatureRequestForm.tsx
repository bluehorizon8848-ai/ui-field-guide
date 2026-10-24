'use client';

import { useState } from 'react';
import { Send, Check, AlertCircle, RefreshCw, PlusCircle } from 'lucide-react';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import { trackEvent } from '@/lib/analytics';

interface FeatureRequestFormProps {
  currentQuery?: string;
}

export function FeatureRequestForm({ currentQuery = '' }: FeatureRequestFormProps) {
  const locale = useLocale();

  const [patternName, setPatternName] = useState(currentQuery);
  const [useCase, setUseCase] = useState('');
  const [refUrl, setRefUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = patternName.trim();
    if (!cleanName) {
      setErrorMessage(t(locale, 'request.nameRequired'));
      setStatus('error');
      return;
    }

    if (refUrl.trim() && !/^https?:\/\//i.test(refUrl.trim())) {
      setErrorMessage(t(locale, 'request.urlInvalid'));
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern_name: cleanName,
          query: currentQuery.trim() || undefined,
          use_case: useCase.trim() || undefined,
          reference_url: refUrl.trim() || undefined,
          locale,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || t(locale, 'request.error'));
      }

      setStatus('success');
      trackEvent('feature_request_submit', {
        request_type: 'missing_pattern',
      });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : t(locale, 'request.error'));
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        className="mt-6 rounded-card border border-line bg-[#FAF9F6] p-4 text-center sm:p-5"
      >
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#2C7355]">
          <Check size={16} aria-hidden="true" />
          <span>{t(locale, 'request.success')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-line/60 pt-5 text-left">
      {!isOpen ? (
        <div className="text-center">
          <p className="text-xs text-ink2">{t(locale, 'request.title')}</p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-ink"
          >
            <PlusCircle size={14} aria-hidden="true" />
            <span>{t(locale, 'request.submit')}</span>
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-[500px] rounded-card border border-line bg-surface p-4 sm:p-5 shadow-xs"
        >
          <div className="border-b border-line/70 pb-3">
            <h3 className="text-sm font-semibold text-ink">{t(locale, 'request.title')}</h3>
            <p className="mt-0.5 text-2xs leading-relaxed text-muted">
              {t(locale, 'request.sub')}
            </p>
          </div>

          <div className="mt-3.5 space-y-3">
            <div>
              <label htmlFor="req-pattern-name" className="block text-xs font-medium text-ink">
                {t(locale, 'request.patternName')} <span className="text-[#A8342C]">*</span>
              </label>
              <input
                id="req-pattern-name"
                type="text"
                required
                value={patternName}
                onChange={(e) => setPatternName(e.target.value.slice(0, 100))}
                placeholder={t(locale, 'request.patternNamePlaceholder')}
                className="mt-1 h-10 w-full rounded-lg border border-line bg-[#FCFBF8] px-3 text-xs text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div>
              <label htmlFor="req-use-case" className="block text-xs font-medium text-ink">
                {t(locale, 'request.useCase')}
              </label>
              <textarea
                id="req-use-case"
                rows={2}
                value={useCase}
                onChange={(e) => setUseCase(e.target.value.slice(0, 500))}
                placeholder={t(locale, 'request.useCasePlaceholder')}
                className="mt-1 w-full rounded-lg border border-line bg-[#FCFBF8] p-2.5 text-xs text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div>
              <label htmlFor="req-ref-url" className="block text-xs font-medium text-ink">
                {t(locale, 'request.refUrl')}
              </label>
              <input
                id="req-ref-url"
                type="url"
                value={refUrl}
                onChange={(e) => setRefUrl(e.target.value.slice(0, 300))}
                placeholder={t(locale, 'request.refUrlPlaceholder')}
                className="mt-1 h-10 w-full rounded-lg border border-line bg-[#FCFBF8] px-3 text-xs text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#A8342C]" role="alert">
              <AlertCircle size={14} aria-hidden="true" />
              <span>{errorMessage || t(locale, 'request.error')}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
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
                  <span>{t(locale, 'request.submitting')}</span>
                </>
              ) : (
                <>
                  <Send size={13} aria-hidden="true" />
                  <span>{t(locale, 'request.submit')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
