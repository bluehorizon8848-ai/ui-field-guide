'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID, trackEvent } from '@/lib/analytics';
import type { Locale } from '@/lib/i18n';

export function GoogleAnalytics({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const fullPath = search ? `${pathname}${search}` : pathname;

    // Avoid duplicate page_view for the identical full path
    if (lastPathRef.current === fullPath) return;
    lastPathRef.current = fullPath;

    trackEvent('page_view', {
      page_path: pathname,
      page_location: typeof window !== 'undefined' ? window.location.href : fullPath,
      page_title: typeof document !== 'undefined' ? document.title : '',
      locale,
    });
  }, [pathname, locale]);

  // If no GA measurement ID is configured, setup fallback dataLayer for clean test observability
  if (!GA_MEASUREMENT_ID) {
    return (
      <script
        id="ga-fallback-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
          `,
        }}
      />
    );
  }

  return (
    <>
      {/* Synchronous inline script ensuring dataLayer and Consent Default are ready before React hydration */}
      <script
        id="ga-consent-and-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;

            var userConsent = null;
            try {
              userConsent = localStorage.getItem('uifg.consent.v1');
            } catch(e) {}

            if (userConsent === 'granted' || userConsent === 'denied') {
              // Returning visitor with explicit stored choice:
              gtag('consent', 'default', {
                'analytics_storage': userConsent,
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
              });
            } else {
              // Consent Mode v2 Regional Defaults:
              // 1. Sensitive jurisdictions (EEA 30 countries, UK, Switzerland) strictly default to denied
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'region': ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'],
                'wait_for_update': 500
              });

              // 2. Non-sensitive regions: basic anonymous analytics allowed by default, advertising permanently denied
              gtag('consent', 'default', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            }

            var host = window.location.hostname;
            var isStaging = host.includes('pages.dev') || host.includes('localhost') || host === '127.0.0.1';
            var isLocal = host === 'localhost' || host === '127.0.0.1';

            gtag('js', new Date());
            // Disable automatic page_view to prevent double counting in Next.js App Router
            // Tag staging traffic with debug_mode & traffic_type to prevent polluting production reports
            // GA4 Cookie Domain & Prefix Isolation:
            // - cookie_prefix: 'uifg' ensures all cookies are named _uifg_ga and _uifg_ga_E67MRP4HKJ
            // - cookie_domain: host (or 'none' for local) ensures cookies are bound strictly to ui.lutivelab.com
            //   and NEVER written to top-level .lutivelab.com, preventing collision with sister projects.
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              anonymize_ip: true,
              debug_mode: isStaging,
              traffic_type: isStaging ? 'staging' : 'production',
              cookie_prefix: 'uifg',
              cookie_domain: isLocal ? 'none' : host
            });
          `,
        }}
      />
      <Script
        id="ga-gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}
