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
      <Script
        id="ga-consent-and-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;

            // Google Consent Mode v2: Regional Defaults
            // In regions requiring explicit opt-in (EEA, UK, Switzerland), analytics_storage strictly defaults to 'denied'
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'region': ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'],
              'wait_for_update': 500
            });

            // In other regions, allow analytics_storage by default while keeping ads strictly denied
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });

            // If user has previous explicit choice, apply it immediately
            try {
              var userConsent = localStorage.getItem('uifg.consent.v1');
              if (userConsent === 'granted' || userConsent === 'denied') {
                gtag('consent', 'update', {
                  'analytics_storage': userConsent
                });
              }
            } catch(e) {}

            window.setConsent = function(granted) {
              try {
                localStorage.setItem('uifg.consent.v1', granted ? 'granted' : 'denied');
              } catch(e) {}
              gtag('consent', 'update', {
                'analytics_storage': granted ? 'granted' : 'denied'
              });
            };

            var host = window.location.hostname;
            var isStaging = host.includes('pages.dev') || host.includes('localhost') || host === '127.0.0.1';

            gtag('js', new Date());
            // Disable automatic page_view to prevent double counting in App Router
            // Tag staging traffic with debug_mode & traffic_type to prevent polluting production reports
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              anonymize_ip: true,
              debug_mode: isStaging,
              traffic_type: isStaging ? 'staging' : 'production'
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
