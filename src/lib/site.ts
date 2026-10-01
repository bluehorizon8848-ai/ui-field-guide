import type { Locale } from './i18n';
import { OG_LOCALE, HTML_LANG } from './i18n';

export const site = {
  name: 'UI Field Guide',
  chineseName: 'UI Field Guide',
  url: 'https://ui-field-guide.pages.dev',
};

/**
 * 按语言取站点级文案。
 * 中文是原始定位（面向国内独立开发者），英文面向海外开发者，
 * 关键词也换了一套——用中文关键词做英文页的 SEO 是无效的。
 */
export const siteMeta: Record<Locale, {
  tagline: string;
  description: string;
  keywords: string[];
  locale: string;
}> = {
  zh: {
    tagline: 'AI 独立开发者的 UI / UX 可视化词典',
    description:
      '给 AI 独立开发者的 UI / UX 可视化词典。看示例、学名字、理解场景，然后直接告诉 AI。',
    keywords: [
      'UI 术语',
      'UI 组件',
      'UI pattern',
      '独立开发',
      'Vibe Coding',
      '设计术语',
      'Bottom Sheet',
      'Accordion',
    ],
    locale: OG_LOCALE.zh,
  },
  en: {
    tagline: 'A visual UI/UX dictionary for indie developers',
    description:
      'A visual dictionary of UI patterns for indie developers. See a working demo, learn the name, understand when to use it — then tell AI exactly what you want.',
    keywords: [
      'UI patterns',
      'UI components',
      'design terminology',
      'mobile UI patterns',
      'indie developer',
      'bottom sheet',
      'modal vs bottom sheet',
      'design tokens',
      'Vibe Coding',
    ],
    locale: OG_LOCALE.en,
  },
};

/**
 * layout.tsx 的 title.template 是 `%s｜UI Field Guide`，
 * 所以这里只返回前半段，不要自己再拼一次站名。
 */
export function patternTitle(name: string, locale: Locale) {
  return locale === 'zh' ? `${name} 是什么？` : `What is ${name}?`;
}

export function patternDescription(
  name: string,
  chineseName: string,
  oneLine: string,
  locale: Locale
) {
  // 中文页保留中文名，英文页也带中文名——做中国市场的英文用户需要它
  return locale === 'zh'
    ? `用真实交互示例理解 ${name}（${chineseName}）的含义、适用场景，以及如何准确告诉 AI 实现它。${oneLine}`
    : `Understand ${name} with a real interactive example: what it is, when to use it, and how to describe it to AI so you get exactly what you want. ${oneLine}`;
}

export function absoluteUrl(path = '') {
  return `${site.url}${path}`;
}

export function htmlLang(locale: Locale) {
  return HTML_LANG[locale];
}