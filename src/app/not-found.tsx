import Link from 'next/link';
import { Search, Compass, Ruler, Sparkles } from 'lucide-react';
import './globals.css';

/** 404 页面自己的导航。用静态列表而不是 Header 组件——Header 依赖 LocaleProvider，
 *  而这个页面拿不到 context。静态链接反而更稳，也顺带保证了中英两个入口都在。 */
const NAV = [
  { href: '/explore', label: '图鉴', labelEn: 'Explore', icon: Compass },
  { href: '/learn', label: '学习路径', labelEn: 'Learn', icon: Sparkles },
  { href: '/compare', label: '对比', labelEn: 'Compare', icon: Ruler },
  { href: '/search', label: '搜索', labelEn: 'Search', icon: Search },
];

const NAV_EN = NAV.map((n) => ({ ...n, href: `/en${n.href}` }));

/**
 * 全局 404（URL 匹配不到任何路由时用）。
 *
 * 结构上的特殊之处：双 root layout（(zh) / (en)）下，本文件是唯一需要
 * 自带 <html> / <body> 的地方——浏览器要求每个文档都有这两个标签，
 * 而根目录的透传式 root layout 不提供它们（Next.js 在这种结构下允许）。
 *
 * 代价是拿不到 locale，也不共享 Header / Footer，
 * 所以文案做成语言中立（中文 + 英文并排），并自带一组导航出口，
 * 避免用户走到死胡同。真正的词条 404 走各语言自己的 not-found.tsx。
 */
export default function GlobalNotFound() {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-canvas font-sans antialiased">
        <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
          <p className="meta mb-3">404</p>
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.75rem]">
            页面不存在 · Page not found
          </h1>
          <p className="mt-2.5 max-w-[460px] text-[0.9375rem] leading-relaxed text-ink2">
            可能是链接过期了，也可能是我们还没收录这个词条。
            <br />
            The link may be outdated, or this entry hasn&apos;t been added yet.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/explore"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
            >
              <Compass size={15} aria-hidden="true" />
              逛图鉴 · Explore
            </Link>
            <Link
              href="/identify"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
            >
              我不知道它叫什么 · I don&apos;t know what it&apos;s called
            </Link>
          </div>

          {/* 死胡同不能只有一扇门：给出中英两套完整导航 */}
          <div className="mt-12 w-full max-w-[560px] border-t border-line pt-8">
            <p className="meta mb-3">中文 · Chinese</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-[0.8125rem] text-ink2 transition-colors hover:border-[#C9C5BB] hover:text-ink"
                  >
                    <n.icon size={14} aria-hidden="true" />
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="meta mb-3 mt-7">English</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {NAV_EN.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    hrefLang="en"
                    lang="en"
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-[0.8125rem] text-ink2 transition-colors hover:border-[#C9C5BB] hover:text-ink"
                  >
                    <n.icon size={14} aria-hidden="true" />
                    {n.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}