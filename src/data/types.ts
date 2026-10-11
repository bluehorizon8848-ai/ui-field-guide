export type Platform = 'web' | 'mobile' | 'desktop' | 'ios' | 'android' | 'harmonyos';
export type Ecosystem = 'all' | Platform;
export type Level = 1 | 2 | 3;
export type CategoryId =
  | 'navigation'
  | 'actions'
  | 'input'
  | 'containers'
  | 'feedback'
  | 'data'
  | 'interaction'
  | 'general'
  | 'layout';

export type Appearance = 'always' | 'on-click' | 'on-scroll' | 'on-hover' | 'auto';

/** 「它出现在哪儿」——独立于 Appearance。Appearance 讲「怎么出现」，Position 讲「在哪」。 */
export type Position =
  | 'top'
  | 'bottom'
  | 'center'
  | 'floating'
  | 'overlay'
  | 'inline'
  | 'side';

export type Job =
  | 'navigate'
  | 'select'
  | 'input'
  | 'inform'
  | 'expand'
  | 'status'
  | 'create'
  | 'confirm';

export interface AnatomyItem {
  label: string;
  labelZh: string;
  note: string;
}

export interface WhenRow {
  situation: string;
  recommended: boolean | 'mostly';
}

export interface UIPattern {
  id: string;
  name: string;
  chineseName: string;
  aliases: string[];
  category: CategoryId;
  level: Level;
  /** 「我不知道它叫什么」的分类标签 */
  appearance: Appearance[];
  /** 「它出现在哪儿」——Identify 工具第一问 */
  position: Position[];
  job: Job[];

  oneLine: string;
  description: string;

  platforms: Platform[];
  /** 所属专属平台/生态（若为空则为通用跨平台） */
  dedicatedPlatform?: Platform;
  /** 专有进阶徽标 */
  specialBadge?: string;
  /** 支持进行真实多端形态切换的系统列表 */
  supportedOS?: Platform[];
  difficulty: 'easy' | 'medium' | 'hard';

  /** 「它长什么样」——用生活化场景说，不写学术定义 */
  looksLike: string;

  whenToUse: WhenRow[];
  whenNotToUse: string[];

  anatomy: AnatomyItem[];
  similarPatterns: string[];
  compareWith?: string;

  aiPrompt: { basic: string; detailed: string; implementation: string };
  badPrompt: string;
  betterPrompt: string;

  /** 分享卡片底部一行 */
  fitsFor: string;
  tags: string[];
  /** 关联的对比页 slug */
  comparisonSlug?: string;
}

export interface Comparison {
  slug: string;
  title: string;
  subtitle: string;
  question: string;
  patterns: string[];
  /** 列定义 */
  columns: { key: string; label: string }[];
  rows: { pattern: string; cells: (string | boolean)[]; verdict: string }[];
  /** 选型决策 */
  decision: { if: string; then: string }[];
  takeaway: string;
  relatedComparisons: string[];
}

export interface Category {
  id: CategoryId;
  name: string;
  chineseName: string;
  blurb: string;
  tint: string;
  accent: string;
}
