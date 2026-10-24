'use client';

import { useState, useEffect } from 'react';
import { getConsentState, setConsent, type ConsentChoice } from '@/lib/analytics';
import type { Locale } from '@/lib/i18n';

export function PrivacyPreferenceControls({ locale }: { locale: Locale }) {
  const [consent, setConsentState] = useState<ConsentChoice>('unset');
  const [clearedNotice, setClearedNotice] = useState(false);
  const isZh = locale === 'zh';

  useEffect(() => {
    setConsentState(getConsentState());

    const handleConsentChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ consent: ConsentChoice }>;
      if (customEvent.detail?.consent) {
        setConsentState(customEvent.detail.consent);
      }
    };

    window.addEventListener('uifg:consent-changed', handleConsentChanged);
    return () => {
      window.removeEventListener('uifg:consent-changed', handleConsentChanged);
    };
  }, []);

  const handleGrant = () => {
    setConsent(true);
    setConsentState('granted');
    setClearedNotice(false);
  };

  const handleRevoke = () => {
    setConsent(false);
    setConsentState('denied');
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 4000);
  };

  const handleOpenBanner = () => {
    window.dispatchEvent(new CustomEvent('uifg:open-consent'));
  };

  return (
    <div className="mt-4 rounded-xl border border-line bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-ink">
            {isZh ? '当前分析 Cookie 状态' : 'Current Analytics Cookie Status'}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                consent === 'granted'
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-ink2">
              {consent === 'granted'
                ? isZh ? '已授权开启 (Granted)' : 'Granted'
                : isZh ? '未授权 / 已拒绝 (Denied)' : 'Denied (Default)'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {consent === 'granted' ? (
            <button
              type="button"
              id="privacy-revoke-button"
              onClick={handleRevoke}
              className="inline-flex min-h-[36px] cursor-pointer items-center justify-center rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              {isZh ? '撤回同意并清除 Cookie' : 'Revoke & Clear Cookies'}
            </button>
          ) : (
            <button
              type="button"
              id="privacy-grant-button"
              onClick={handleGrant}
              className="inline-flex min-h-[36px] cursor-pointer items-center justify-center rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              {isZh ? '开启匿名分析' : 'Allow Analytics'}
            </button>
          )}

          <button
            type="button"
            id="privacy-open-banner-button"
            onClick={handleOpenBanner}
            className="inline-flex min-h-[36px] cursor-pointer items-center justify-center rounded-lg border border-line bg-transparent px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {isZh ? '打开设置面板' : 'Open Banner'}
          </button>
        </div>
      </div>

      {clearedNotice && (
        <p className="mt-2 text-[0.75rem] text-emerald-600 dark:text-emerald-400">
          ✓ {isZh ? '已成功撤销同意，并彻底清理本地 GA4 统计 Cookie。' : 'Consent revoked. GA4 analytics cookies cleared.'}
        </p>
      )}
    </div>
  );
}
