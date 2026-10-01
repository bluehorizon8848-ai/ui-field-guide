/**
 * 英文内容的形状。
 *
 * 关键设计：只有「需要人读的文字」进 overlay，结构字段不进。
 * id / category / level / appearance / position / job / platforms /
 * difficulty / similarPatterns / compareWith / comparisonSlug 全都是
 * 枚举或 id 引用，两种语言完全一致，没必要复制。
 *
 * 另一个刻意保留的字段是 chineseName：英文用户如果要做中国市场的 App，
 * 需要知道这个组件在中国叫什么，所以英文版依然显示中文名。
 */
export interface AnatomyTranslation {
  label: string;
  note: string;
}

export interface WhenToUseTranslation {
  situation: string;
  recommended: boolean | 'mostly';
}

export interface PatternTranslation {
  oneLine: string;
  description: string;
  looksLike: string;
  fitsFor: string;
  whenToUse: WhenToUseTranslation[];
  whenNotToUse: string[];
  anatomy: AnatomyTranslation[];
  aiPrompt: { basic: string; detailed: string; implementation: string };
  badPrompt: string;
  betterPrompt: string;
  /** 英文别名/口语，直接进搜索索引 */
  aliases: string[];
  tags: string[];
}

export interface ComparisonTranslation {
  title: string;
  subtitle: string;
  question: string;
  columns: { key: string; label: string }[];
  rows: { pattern: string; cells: (string | boolean)[]; verdict: string }[];
  decision: { if: string; then: string }[];
  takeaway: string;
}

export interface CategoryTranslation {
  blurb: string;
}

export interface LearningTranslation {
  name: string;
  description: string;
}

export type PatternTranslations = Record<string, PatternTranslation>;
export type ComparisonTranslations = Record<string, ComparisonTranslation>;
export type CategoryTranslations = Record<string, CategoryTranslation>;
export type LearningTranslations = Record<number, LearningTranslation>;