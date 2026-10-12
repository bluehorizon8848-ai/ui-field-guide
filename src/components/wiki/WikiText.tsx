'use client';

import React, { useMemo } from 'react';
import { getTermsData } from '@/data/i18n/resolve';
import { useLocale } from '@/components/layout/LocaleProvider';
import { TermPopover } from './TermPopover';
import type { TermItem } from '@/data/terms';

interface WikiTextProps {
  text: string;
  className?: string;
}

export function WikiText({ text, className }: WikiTextProps) {
  const locale = useLocale();
  const { items } = getTermsData(locale);

  const elements = useMemo(() => {
    if (!text || typeof text !== 'string') return text;

    // 收集所有关键词映射 (排除过短的单字)
    const keywordMap = new Map<string, TermItem>();
    const allKeywords: string[] = [];

    for (const item of items) {
      const candidates = [item.term, item.termZh, ...(item.aliases || [])].filter(
        (c): c is string => Boolean(c && c.trim().length >= 2)
      );

      for (const cand of candidates) {
        const clean = cand.trim();
        if (!keywordMap.has(clean.toLowerCase())) {
          keywordMap.set(clean.toLowerCase(), item);
          allKeywords.push(clean);
        }
      }
    }

    if (allKeywords.length === 0) return text;

    // 长度降序排序
    allKeywords.sort((a, b) => b.length - a.length);

    // 正则转义
    const escaped = allKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

    const parts = text.split(pattern);
    const highlightedTerms = new Set<string>();

    return parts.map((part, index) => {
      const lower = part.toLowerCase();
      const termItem = keywordMap.get(lower);

      if (termItem && !highlightedTerms.has(termItem.id)) {
        // 同一段落同一词条仅高亮首次出现，避免下划线泛滥影响阅读
        highlightedTerms.add(termItem.id);
        return (
          <TermPopover key={`${termItem.id}-${index}`} term={termItem}>
            {part}
          </TermPopover>
        );
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  }, [text, items]);

  return <span className={className}>{elements}</span>;
}
