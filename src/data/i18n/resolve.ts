import type { UIPattern, Comparison, Category } from '../types';
import { patterns, patternMap } from '../patterns';
import { comparisonMap, allComparisonSlugs } from '../comparisons';
import { categories, categoryMap } from '../categories';
import { learningLevels, contrastCards } from '../learning';
import type { Locale } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import { patternTranslations } from './patterns.en';
import { comparisonTranslations } from './comparisons.en';
import { categoryTranslations } from './categories.en';
import { learningTranslations, contrastCardsEn } from './learning.en';

/**
 * 按语言返回「已经完全本地化」的数据对象。
 *
 * 为什么要这一层：组件只认 UIPattern，不该到处写 locale === 'en' ? ... : ...。
 * 中文调用方拿到的是原对象（零成本），英文调用方拿到的是散文部分被替换过的副本。
 *
 * 刻意不翻译的字段：
 *  - name / chineseName：name 本来就是英文术语；chineseName 对做中国市场的英文用户仍有价值
 *  - 所有枚举与 id 引用：category / position / job / appearance / platforms / similarPatterns
 */

export function getPattern(id: string, locale: Locale = DEFAULT_LOCALE): UIPattern | undefined {
  const base = patternMap[id];
  if (!base) return undefined;
  if (locale === DEFAULT_LOCALE) return base;

  const t = patternTranslations[id];
  if (!t) return base; // 缺翻译时优雅降级到中文，绝不出现空白区块

  return {
    ...base,
    oneLine: t.oneLine,
    description: t.description,
    looksLike: t.looksLike,
    fitsFor: t.fitsFor,
    aliases: t.aliases,
    tags: t.tags,
    whenToUse: t.whenToUse,
    whenNotToUse: t.whenNotToUse,
    // label 保持英文术语原样（本来就是），labelZh 保留中文名，note 译成英文
    anatomy: t.anatomy.map((a, i) => ({
      label: a.label,
      labelZh: base.anatomy[i]?.labelZh ?? '',
      note: a.note,
    })),
    aiPrompt: t.aiPrompt,
    badPrompt: t.badPrompt,
    betterPrompt: t.betterPrompt,
  };
}

export function getPatterns(locale: Locale = DEFAULT_LOCALE): UIPattern[] {
  if (locale === DEFAULT_LOCALE) return patterns;
  return patterns.map((p) => getPattern(p.id, locale)!);
}

/**
 * 把「搜索/筛选用中文源数据、渲染用本地化数据」这个模式收在一处。
 *
 * 为什么需要：搜索索引（别名、口语映射）全是中文的，筛选必须跑在源数据上；
 * 但命中的结果要显示英文 oneLine，于是就出现了「用 A 筛、用 B 显示」的分裂。
 * 每个组件自己写一遍 byId 映射很容易漏（Identify 和 Explore 都漏过一次），
 * 统一到这里，谁漏了 typecheck 会报。
 */
export function localizePatterns(
  source: readonly UIPattern[],
  locale: Locale = DEFAULT_LOCALE
): UIPattern[] {
  if (locale === DEFAULT_LOCALE) return [...source];
  const byId = new Map(getPatterns(locale).map((p) => [p.id, p]));
  return source.map((p) => byId.get(p.id) ?? p);
}

export function getComparison(slug: string, locale: Locale = DEFAULT_LOCALE): Comparison | undefined {
  const base = comparisonMap[slug];
  if (!base) return undefined;
  if (locale === DEFAULT_LOCALE) return base;

  const t = comparisonTranslations[slug];
  if (!t) return base;

  return { ...base, ...t };
}

export function getComparisons(locale: Locale = DEFAULT_LOCALE): Comparison[] {
  return allComparisonSlugs.map((s) => getComparison(s, locale)!);
}

export function getCategory(id: string, locale: Locale = DEFAULT_LOCALE): Category | undefined {
  const base = categoryMap[id];
  if (!base) return undefined;
  if (locale === DEFAULT_LOCALE) return base;
  const t = categoryTranslations[id];
  return t ? { ...base, blurb: t.blurb } : base;
}

export function getCategories(locale: Locale = DEFAULT_LOCALE): Category[] {
  if (locale === DEFAULT_LOCALE) return categories;
  return categories.map((c) => getCategory(c.id, locale)!);
}

export function getLearningLevels(locale: Locale = DEFAULT_LOCALE) {
  if (locale === DEFAULT_LOCALE) return learningLevels;
  return learningLevels.map((l) => {
    const t = learningTranslations[l.level];
    return t ? { ...l, name: t.name, description: t.description } : l;
  });
}

export function getContrastCards(locale: Locale = DEFAULT_LOCALE) {
  return locale === DEFAULT_LOCALE ? contrastCards : contrastCardsEn;
}

import { FAQ_CATEGORIES, FAQ_ITEMS } from '../faq';
import { FAQ_CATEGORIES_EN, FAQ_ITEMS_EN } from './faq.en';

export function getFaqData(locale: Locale = DEFAULT_LOCALE) {
  if (locale === 'en') {
    return {
      categories: FAQ_CATEGORIES_EN,
      items: FAQ_ITEMS_EN,
    };
  }
  return {
    categories: FAQ_CATEGORIES,
    items: FAQ_ITEMS,
  };
}

import { TERMS_DATA, TERM_CATEGORIES } from '../terms';
import { TERMS_DATA_EN, TERM_CATEGORIES_EN } from './terms.en';

export function getTermsData(locale: Locale = DEFAULT_LOCALE) {
  if (locale === 'en') {
    return {
      categories: TERM_CATEGORIES_EN,
      items: TERMS_DATA_EN,
    };
  }
  return {
    categories: TERM_CATEGORIES,
    items: TERMS_DATA,
  };
}

export function getTerm(id: string, locale: Locale = DEFAULT_LOCALE) {
  const { items } = getTermsData(locale);
  return items.find((t) => t.id === id);
}