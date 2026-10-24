'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { getConsentState, setConsent, type ConsentChoice } from '@/lib/analytics';

export function ConsentBanner() {
  const locale = useLocale();
  const h = useHref();
  const [visible, setVisible] = useState(false);
  const [consentChoice, setConsentChoice] = useState<ConsentChoice>('unset');

  useEffect(() => {
    // Check initial state on mount
    const state = getConsentState();
    setConsentChoice(state);
    if (state === 'unset') {
      setVisible(true);
    }

    // Allow re-opening banner anytime from Footer or Privacy page
    const handleOpen = () => {
      setConsentChoice(getConsentState());
      setVisible(true);
    };

    const handleConsentChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ consent: ConsentChoice }>;
      if (customEvent.detail?.consent) {
        setConsentChoice(customEvent.detail.consent);
      }
    };

    window.addEventListener('uifg:open-consent', handleOpen);
    window.addEventListener('uifg:consent-changed', handleConsentChanged);

    return () => {
      window.removeEventListener('uifg:open-consent', handleOpen);
      window.removeEventListener('uifg:consent-changed', handleConsentChanged);
    };
  }, []);

  const handleAccept = useCallback(() => {
    setConsent(true);
    setConsentChoice('granted');
    setVisible(false);
  }, []);

  const handleDecline = useCallback(() => {
    setConsent(false);
    setConsentChoice('denied');
    setVisible(false);
  }, []);

  if (!visible) return null;

  const isZh = locale === 'zh';

  return (
    <aside
      id="consent-banner"
      role="region"
      aria-label={isZh ? '隐私与分析设置' : 'Privacy & Analytics Preferences'}
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 pointer-events-none transition-all"
    >
      <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-line bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">🍪</span>
              <h2 className="text-sm font-semibold tracking-tight text-ink">
                {isZh ? '隐私与分析偏好设置' : 'Privacy & Analytics Preferences'}
              </h2>
              {consentChoice !== 'unset' && (
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted dark:bg-neutral-800">
                  {isZh
                    ? `当前状态：${consentChoice === 'granted' ? '已同意' : '已拒绝'}`
                    : `Current: ${consentChoice === 'granted' ? 'Granted' : 'Denied'}`}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {isZh
                ? '我们使用 Google Analytics (GA4) 收集匿名交互数据（如 Pattern 浏览与 Demo 试玩频次）以持续改进指南体验。未征得您的明确同意前，分析统计默认处于关闭状态（Denied）。我们绝不收集任何个人身份信息、搜索关键词或 Prompt 原文。'
                : 'We use Google Analytics (GA4) to collect anonymous metrics (such as pattern views and demo interaction frequency) to improve the guide. Disabled by default until you grant consent. We never collect personal data, search terms, or prompts.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            <Link
              href={h('/privacy')}
              className="inline-flex min-h-[38px] items-center px-2 text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              {isZh ? '隐私政策 ↗' : 'Privacy Policy ↗'}
            </Link>
            <button
              type="button"
              id="consent-decline-button"
              onClick={handleDecline}
              className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              {isZh ? '仅保留必要（拒绝）' : 'Decline (Strict Essential)'}
            </button>
            <button
              type="button"
              id="consent-accept-button"
              onClick={handleAccept}
              className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-neutral-800 active:scale-[0.98]"
            >
              {isZh ? '同意分析统计' : 'Accept Analytics'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
