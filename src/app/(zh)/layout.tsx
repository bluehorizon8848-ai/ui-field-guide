import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { LocaleProvider } from '@/components/layout/LocaleProvider';
import { site, siteMeta, htmlLang } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

const LOCALE: Locale = 'zh';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${siteMeta.zh.tagline}`,
    template: `%s｜${site.name}`,
  },
  description: siteMeta.zh.description,
  keywords: siteMeta.zh.keywords,
  // alternates 必须在 metadata 顶层，不能塞进 openGraph（Next 的类型不接受）。
  // 作用是告诉搜索引擎英文版在 /en，避免它把英文页当成重复内容丢掉。
  alternates: {
    canonical: '/',
    languages: { 'zh-CN': '/', en: '/en', 'x-default': '/' },
  },
  openGraph: {
    type: 'website',
    locale: siteMeta.zh.locale,
    siteName: site.name,
    title: `${site.name} — ${siteMeta.zh.tagline}`,
    description: siteMeta.zh.description,
    url: site.url,
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
    title: `${site.name} — ${siteMeta.zh.tagline}`,
    description: siteMeta.zh.description,
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

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={htmlLang(LOCALE)}>
      <body className="min-h-screen bg-canvas font-sans antialiased">
        <LocaleProvider locale={LOCALE}>
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