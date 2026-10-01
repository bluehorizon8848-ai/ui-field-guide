'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { LOCALES, LOCALE_LABEL, localeFromPath, href } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * 客户端组件通过这个 hook 拿当前语言，用来给 <html lang> 之外的东西兜底
 * （比如复制按钮文案、Demo 里的模拟界面）。
 *
 * 服务端组件不需要它——它们直接用自己 page.tsx 里的 locale 参数。
 */
const LocaleContext = createContext<Locale>('zh');

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * 站内链接，自动带上当前语言前缀。
 * 组件里用它替代 next/link 的 href，就不用每个页面手动拼 locale 了。
 */
export function useHref(): (path: string) => string {
  const locale = useLocale();
  return useMemo(() => (path: string) => href(path, locale), [locale]);
}

/**
 * 语言切换器。刻意做成两枚并排的文字标签而不是下拉菜单：
 * 只有两个选项，下拉多一次点击；并排文字一眼看全，且两个都是真实可点的链接
 * （搜索引擎能跟随，爬虫也能发现 /en 下的全部内容）。
 */
export function LocaleSwitch() {
  const pathname = usePathname();
  const current = localeFromPath(pathname);
  const [query, setQuery] = useState('');

  // 刻意不用 useSearchParams()：它在静态导出下会触发「必须包在 Suspense 里」的错误，
  // 而这个组件在 Header 里，包 Suspense 等于给每个页面套一层。
  // 直接读 URL 更省事，SSR 首帧没有 query、hydrate 后补上，用户感知不到。
  useEffect(() => {
    setQuery(window.location.search.replace(/^\?/, ''));
  }, [pathname]);

  const withQuery = (p: string) => (query ? `${p}?${query}` : p);

  return (
    <div
      className="flex items-center rounded-lg border border-line bg-surface p-0.5"
      role="group"
      aria-label={current === 'zh' ? '语言' : 'Language'}
    >
      <Globe size={13} aria-hidden="true" className="ml-1.5 shrink-0 text-muted" />
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <Link
            key={l}
            // 每枚按钮指向自己的语言，不是「切换后的语言」。
            // href() 会先剥掉现有前缀再加，所以中英两个页面互相跳转都不会出现 /en/en/。
            href={withQuery(href(pathname, l))}
            hrefLang={l}
            lang={l}
            aria-current={active ? 'true' : undefined}
            className={`inline-flex min-h-[38px] items-center rounded-[6px] px-2 text-xs transition-colors ${
              active
                ? 'bg-ink font-medium text-white'
                : 'text-ink2 hover:bg-[#F2F0EB] hover:text-ink'
            }`}
          >
            {LOCALE_LABEL[l]}
          </Link>
        );
      })}
    </div>
  );
}