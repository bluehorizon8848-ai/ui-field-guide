import type { PatternTranslations } from './types';
import { navigationActionPatterns } from './patterns.navigation-actions.en';
import { inputPatterns } from './patterns.input.en';
import { containerFeedbackPatterns } from './patterns.containers-feedback.en';
import { dataInteractionGeneralPatterns } from './patterns.data-interaction-general.en';

/**
 * 63 个词条的英文翻译，按分类文件分批写、在这里合并。
 * 合并时后者覆盖前者，但四批的 key 互不重叠（verify 会校验这一点）。
 */
export const patternTranslations: PatternTranslations = {
  ...navigationActionPatterns,
  ...inputPatterns,
  ...containerFeedbackPatterns,
  ...dataInteractionGeneralPatterns,
};