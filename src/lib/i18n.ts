/**
 * 国际化基础设施。
 *
 * URL 策略：中文在根路径（/patterns/modal），英文在 /en 前缀（/en/patterns/modal）。
 * 选这个而不是纯客户端切换，是因为静态导出下英文术语需要被搜索引擎独立收录——
 * 海外开发者搜 "bottom sheet vs modal" 时拿到的是可分享、可索引的链接。
 *
 * 中文数据文件是「真相」，英文是并列 overlay（见 src/data/i18n/），互不覆盖。
 */

export type Locale = 'zh' | 'en';

export const LOCALES: Locale[] = ['zh', 'en'];
export const DEFAULT_LOCALE: Locale = 'zh';

/** 语言切换入口上显示的名字。用「母语自称」而不是 English/中文，符合可用性惯例。 */
export const LOCALE_LABEL: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

/** <html lang> 的取值。zh-Hans 比 zh-CN 更精确（简体）。 */
export const HTML_LANG: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
};

/** Open Graph locale，格式是 language_TERRITORY。 */
export const OG_LOCALE: Record<Locale, string> = {
  zh: 'zh_CN',
  en: 'en_US',
};

export const EN_PREFIX = '/en';

export function isLocale(v: string | undefined): v is Locale {
  return v === 'zh' || v === 'en';
}

/**
 * 给站内路径加语言前缀。中文是根，不需要前缀。
 *
 * 两个方向都要正确剥离：
 * - 中文页 → 英文：/patterns/modal → /en/patterns/modal
 * - 英文页 → 中文：/en/patterns/modal → /patterns/modal
 * 第二个方向最容易漏。usePathname() 拿到的是含 /en 前缀的当前路径，
 * 直接 return 就成了「英文页的中文按钮指向自己」—— 语言切换静默失效，
 * 而且这种页面永远 200，sweep 和 visual 都发现不了。
 *
 * 保留 query 和 hash，否则 /search?q=bottom+sheet 这类链接切语言后就丢了搜索词。
 */
export function href(path: string, locale: Locale): string {
  if (!path.startsWith('/')) return path;
  const stripped = path.startsWith(EN_PREFIX) ? path.slice(EN_PREFIX.length) || '/' : path;
  if (locale === DEFAULT_LOCALE) return stripped;
  return stripped === '/' ? EN_PREFIX : `${EN_PREFIX}${stripped}`;
}

/** 当前路径的「另一语言」版本，用于语言切换按钮。 */
export function switchLocaleHref(pathname: string, current: Locale): { href: string; locale: Locale } {
  const target: Locale = current === 'zh' ? 'en' : 'zh';
  return { href: href(pathname, target), locale: target };
}

/**
 * 匹配路径里的语言前缀，得出当前语言。
 * 根路径没有前缀，返回默认语言（中文）。
 */
export function localeFromPath(pathname: string): Locale {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? 'en' : DEFAULT_LOCALE;
}

/**
 * 构建 hreflang 语言组。zh 和 en 是同一内容的两种语言，
 * 必须互相声明 + x-default，否则搜索引擎会把它们当成重复内容丢掉一个。
 *
 * path 一律传「不带语言前缀的基础路径」（如 /patterns/modal），
 * canonical 按当前 locale 算 —— 否则英文页会自引用中文 URL，SEO 上等于自我否定。
 */
export function languageAlternates(path: string, locale: Locale) {
  return {
    canonical: href(path, locale),
    languages: {
      'zh-CN': href(path, 'zh'),
      en: href(path, 'en'),
      'x-default': href(path, 'zh'),
    },
  };
}