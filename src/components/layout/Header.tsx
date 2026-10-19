'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { site } from '@/lib/site';
import { t } from '@/lib/ui-strings';
import { useHref, useLocale, LocaleSwitch } from './LocaleProvider';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const h = useHref();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // base 是不带语言前缀的路径，active 判断和 href 拼接都从它出发，避免重复调 h()
  const NAV = [
    { base: '/explore', label: t(locale, 'nav.explore') },
    { base: '/learn', label: t(locale, 'nav.learn') },
    { base: '/compare', label: t(locale, 'nav.compare') },
    { base: '/identify', label: t(locale, 'nav.identify') },
    { base: '/faq', label: t(locale, 'nav.faq') },
    { base: '/glossary', label: t(locale, 'nav.glossary') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        router.push(h('/search'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [h, router]);

  const isActive = (base: string) => {
    const p = h(base);
    return pathname === p || pathname.startsWith(`${p}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-canvas/90 backdrop-blur-sm transition-colors ${
        scrolled ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-14 items-center gap-3">
        <div className="flex items-center gap-2">
          <a
            href={site.parentUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.parentName}
            className="hidden min-h-[44px] items-center gap-1.5 rounded-md px-1 py-1 text-xs font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            <span>{site.parentName}</span>
            <span aria-hidden="true" className="text-[#C9C5BB]">/</span>
          </a>
          <Link
            href={h('/')}
            className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-md py-1 pr-1"
            aria-label={`${site.name} ${t(locale, 'nav.home')}`}
          >
            <span
              aria-hidden="true"
              className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-ink text-[11px] font-semibold text-white"
            >
              UF
            </span>
            <span className="text-[0.9375rem] font-semibold tracking-tight text-ink">
              {site.name}
            </span>
          </Link>
        </div>

        <nav aria-label={t(locale, 'nav.main')} className="ml-4 hidden items-center gap-0.5 md:flex">
          {NAV.map((n) => {
            const active = isActive(n.base);
            return (
              <Link
                key={n.base}
                href={h(n.base)}
                aria-current={active ? 'page' : undefined}
                className={`rounded-md px-2.5 py-1.5 text-[0.8125rem] transition-colors ${
                  active ? 'font-medium text-ink' : 'text-ink2 hover:text-ink'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden sm:block">
            <LocaleSwitch />
          </div>

          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-transparent text-ink2 transition-colors hover:border-line hover:bg-surface hover:text-ink sm:flex"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>

          <Link
            href={h('/search')}
            aria-label={`${t(locale, 'nav.search')} (⌘K)`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-transparent px-2.5 text-ink2 transition-colors hover:border-line hover:bg-surface hover:text-ink"
          >
            <Search size={16} aria-hidden="true" />
            <kbd className="hidden rounded border border-line bg-[#FAF9F6] px-1.5 py-0.5 font-mono text-[10px] text-muted lg:inline-block">
              ⌘K
            </kbd>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? t(locale, 'nav.closeMenu') : t(locale, 'nav.openMenu')}
            aria-expanded={menuOpen}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-transparent text-ink2 transition-colors hover:border-line hover:bg-surface hover:text-ink md:hidden"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label={t(locale, 'nav.mobile')}
          className="scroll-contain border-t border-line bg-canvas px-5 pb-safe pt-2 md:hidden"
        >
          <div className="flex items-center justify-between border-b border-line py-2">
            <a
              href={site.parentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-xs font-medium text-muted hover:text-ink"
            >
              {site.parentName} Suite ↗
            </a>
            <LocaleSwitch />
          </div>
          {NAV.map((n) => {
            const active = isActive(n.base);
            return (
              <Link
                key={n.base}
                href={h(n.base)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm transition-colors active:bg-[#EDEae3] ${
                  active ? 'bg-[#F2F0EB] font-medium text-ink' : 'text-ink2'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}