'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { site } from '@/lib/site';

const NAV = [
  { href: '/explore', label: '图鉴' },
  { href: '/learn', label: '学习路径' },
  { href: '/compare', label: '对比' },
  { href: '/identify', label: '我不知道它叫什么' },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-canvas/90 backdrop-blur-sm transition-colors ${
        scrolled ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-14 items-center gap-3">
        <Link
          href="/"
          className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-md py-1 pr-1"
          aria-label={`${site.name} 首页`}
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

        <nav aria-label="主导航" className="ml-4 hidden items-center gap-0.5 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
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
          <Link
            href="/search"
            aria-label="搜索"
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink2 transition-colors hover:bg-[#F2F0EB] hover:text-ink"
          >
            <Search size={17} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink2 transition-colors hover:bg-[#F2F0EB] hover:text-ink md:hidden"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="移动端导航"
          className="border-t border-line bg-canvas px-5 py-2 md:hidden"
        >
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
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
