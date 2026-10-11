import type { UIPattern } from '../types';
import { navigationPatterns } from './navigation';
import { actionPatterns } from './actions';
import { inputPatterns } from './input';
import { containerPatterns } from './containers';
import { feedbackPatterns } from './feedback';
import { dataPatterns } from './data';
import { interactionPatterns } from './interaction';
import { generalPatterns } from './general';
import { layoutPatterns } from './layout';

export const patterns: UIPattern[] = [
  ...navigationPatterns,
  ...actionPatterns,
  ...inputPatterns,
  ...containerPatterns,
  ...feedbackPatterns,
  ...dataPatterns,
  ...interactionPatterns,
  ...generalPatterns,
  ...layoutPatterns,
];

export const patternMap: Record<string, UIPattern> = Object.fromEntries(
  patterns.map((p) => [p.id, p])
);

export function getPattern(id: string): UIPattern | undefined {
  return patternMap[id];
}

/** 供静态导出使用的全部 slug */
export const allPatternIds = patterns.map((p) => p.id);
