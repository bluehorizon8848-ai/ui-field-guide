'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { site } from '@/lib/site';
import { t } from '@/lib/ui-strings';
import { useHref, useLocale, LocaleSwitch } from './LocaleProvider';

export function Header() {
  const pathname = usePathname();
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

          <Link
            href={h('/search')}
            aria-label={t(locale, 'nav.search')}
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink2 transition-colors hover:bg-[#F2F0EB] hover:text-ink"
          >
            <Search size={17} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? t(locale, 'nav.closeMenu') : t(locale, 'nav.openMenu')}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink2 transition-colors hover:bg-[#F2F0EB] hover:text-ink md:hidden"
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
          {/* 窄屏隐藏了顶部切换器，移动菜单里必须补一个，否则手机上根本没法切语言 */}
          <div className="flex items-center justify-between border-b border-line py-2">
            <span className="meta">{locale === 'zh' ? '语言' : 'Language'}</span>
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