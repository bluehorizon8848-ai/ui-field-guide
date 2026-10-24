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

            // Google Consent Mode v2: Deny all ads, allow analytics
            var storedConsent = 'granted';
            try {
              if (localStorage.getItem('uifg.consent.v1') === 'denied') {
                storedConsent = 'denied';
              }
            } catch(e) {}

            gtag('consent', 'default', {
              'analytics_storage': storedConsent,
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });

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
