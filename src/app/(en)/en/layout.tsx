import type { Metadata, Viewport } from 'next';
import '../../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { LocaleProvider } from '@/components/layout/LocaleProvider';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { site, siteMeta, htmlLang } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

const LOCALE: Locale = 'en';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${siteMeta.en.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: siteMeta.en.description,
  keywords: siteMeta.en.keywords,
  alternates: {
    canonical: '/en',
    languages: { 'zh-CN': '/', en: '/en', 'x-default': '/' },
  },
  openGraph: {
    type: 'website',
    locale: siteMeta.en.locale,
    siteName: site.name,
    title: `${site.name} — ${siteMeta.en.tagline}`,
    description: siteMeta.en.description,
    url: `${site.url}/en`,
    images: [
      {
        url: `${site.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${site.name} by ${site.parentName}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${siteMeta.en.tagline}`,
    description: siteMeta.en.description,
    images: [`${site.url}/og-image.png`],
  },
  robots: { index: true, follow: true },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#FAF9F6',
  width: 'device-width',
  initialScale: 1,
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={htmlLang(LOCALE)}>
      <body className="min-h-screen bg-canvas font-sans antialiased">
        <LocaleProvider locale={LOCALE}>
          <GoogleAnalytics locale={LOCALE} />
          <SkipLink locale={LOCALE} />
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}