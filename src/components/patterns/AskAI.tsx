'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, AlertCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import type { UIPattern } from '@/data/types';
import { CopyButton } from '@/components/ui/CopyButton';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import type { UIKey } from '@/lib/ui-strings';

type PromptLevel = 'conversational' | 'detailed' | 'implementation' | 'basic';

const LEVELS: { key: PromptLevel; label: string; nameKey: UIKey; hintKey: UIKey }[] = [
  {
    key: 'conversational',
    label: 'Recommended',
    nameKey: 'ask.conversationalName',
    hintKey: 'ask.conversationalHint',
  },
  { key: 'detailed', label: 'Level 2', nameKey: 'ask.l2name', hintKey: 'ask.l2hint' },
  {
    key: 'implementation',
    label: 'Level 3',
    nameKey: 'ask.l3name',
    hintKey: 'ask.l3hint',
  },
  { key: 'basic', label: 'Level 1', nameKey: 'ask.l1name', hintKey: 'ask.l1hint' },
];

function generateConversationalPrompt(pattern: UIPattern, locale: 'zh' | 'en'): string {
  const parts = pattern.anatomy?.slice(0, 3).map((a) => a.labelZh || a.label) || [];
  const partsDesc = parts.length > 0 ? `（包含关键结构：${parts.join('、')}）` : '';

  if (locale === 'zh') {
    return `我想在我的页面中做一个【${pattern.chineseName}】（标准的 ${pattern.name} 组件）。
它的核心设计意图是：${pattern.oneLine} ${partsDesc}

请以资深前端架构师的视角协助我。在直接编写最终代码之前，请先向我确认以下 3 个关键细节：
1. 组件的核心尺寸规格、关键状态（如加载态、空状态或禁用态）以及响应式布局预期；
2. 触发与退出的关键交互逻辑（如点击背景关闭、手势滑动阻尼或展开动画过渡）；
3. 键盘与屏幕阅读器无障碍支持（如 ESC 键退出、焦点锁定 Focus Trap 与 ARIA 属性）。

请先列出这三项的简要推测并向我确认，待我确认后再输出基于 React + Tailwind CSS 的完整代码。`;
  }

  const partsEn = pattern.anatomy?.slice(0, 3).map((a) => a.label) || [];
  const partsEnDesc = partsEn.length > 0 ? ` (key parts: ${partsEn.join(', ')})` : '';

  return `I want to implement a standard ${pattern.name} (${pattern.chineseName}) component in my application.
The design intent is: ${pattern.oneLine} ${partsEnDesc}

Please act as a senior frontend architect. Before writing the final code, please first clarify and confirm with me:
1. Sizing specifications, component states (e.g. loading, empty, disabled), and responsive layout expectations;
2. Key transition & interaction behaviors (e.g. backdrop dismiss, motion easing curves, or swipe gestures);
3. Keyboard accessibility and focus management (e.g. ESC key dismiss, focus trapping, and ARIA roles).

Please summarize these 3 assumptions for my confirmation first, and once I approve, generate the production-ready React + Tailwind CSS code.`;
}

export function AskAI({ pattern }: { pattern: UIPattern }) {
  const locale = useLocale();
  const h = useHref();
  const [level, setLevel] = useState<PromptLevel>('conversational');
  const current = LEVELS.find((l) => l.key === level)!;

  const currentPromptText =
    level === 'conversational'
      ? generateConversationalPrompt(pattern, locale)
      : pattern.aiPrompt[level];

  return (
    <div>
      <div
        role="tablist"
        aria-label={t(locale, 'ask.tablist')}
        className="flex flex-wrap gap-1.5"
      >
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            role="tab"
            aria-selected={level === l.key}
            onClick={() => setLevel(l.key)}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-left transition-colors ${
              level === l.key ? 'bg-ink text-white' : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
            }`}
          >
            <span className="flex items-center gap-1 text-2xs uppercase tracking-wider opacity-70">
              {l.key === 'conversational' && <Sparkles size={11} aria-hidden="true" />}
              <span>{l.label}</span>
            </span>
            <span className="mt-0.5 block text-[0.8125rem] font-medium">
              {t(locale, l.nameKey)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-card border border-line bg-[#FCFBF8]">
        <div className="flex items-center justify-between gap-2 border-b border-line px-3.5 py-2">
          <p className="text-2xs text-muted">{t(locale, current.hintKey)}</p>
          <CopyButton text={currentPromptText} label={t(locale, 'ask.copyPrompt')} />
        </div>
        <p className="whitespace-pre-wrap px-3.5 py-3.5 font-mono text-[0.8125rem] leading-relaxed text-ink2">
          {currentPromptText}
        </p>
      </div>

      {/* 底部贴士与直达 FAQ 指南 / 名词百科 */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#FAF8F5] px-3.5 py-2 text-xs">
        <span className="text-muted">{t(locale, 'ask.viewFaqGuide')}</span>
        <div className="flex items-center gap-2.5">
          <Link
            href={h('/faq')}
            className="inline-flex items-center gap-1 font-medium text-ink underline-offset-4 hover:underline"
          >
            <BookOpen size={13} aria-hidden="true" />
            <span>{locale === 'zh' ? '交流指南' : 'AI Guide'}</span>
          </Link>
          <span className="text-muted">·</span>
          <Link
            href={h('/glossary')}
            className="inline-flex items-center gap-1 font-medium text-ink underline-offset-4 hover:underline"
          >
            <span>{locale === 'zh' ? '名词百科' : 'Glossary'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function BadPrompt({ pattern }: { pattern: UIPattern }) {
  const locale = useLocale();
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-[#FCFBF8] p-3.5">
        <p className="mb-2 flex items-center gap-1.5 text-2xs font-medium text-[#A8342C]">
          <X size={13} aria-hidden="true" />
          {t(locale, 'ask.dontSay')}
        </p>
        <p className="text-[0.875rem] leading-relaxed text-ink2 line-through decoration-[#C9C5BB] decoration-1">
          {pattern.badPrompt}
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface p-3.5">
        <p className="mb-2 flex items-center justify-between gap-2 text-2xs font-medium text-[#2C7355]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} aria-hidden="true" />
            {t(locale, 'ask.sayInstead')}
          </span>
          <CopyButton text={pattern.betterPrompt} label={t(locale, 'common.copy')} />
        </p>
        <p className="text-[0.875rem] leading-relaxed text-ink">{pattern.betterPrompt}</p>
      </div>
    </div>
  );
}

export function AlertNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted">
      <AlertCircle size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}