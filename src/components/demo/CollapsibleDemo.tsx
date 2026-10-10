'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function CollapsibleDemo() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DemoStage caption={t(locale, 'demo.caption.collapsible')}>
      <div className="mx-auto w-full max-w-[440px] rounded-xl border border-line bg-surface p-4 shadow-xs">
        {/* 卡片头部与基础信息 */}
        <div className="flex items-center justify-between pb-3 border-b border-line2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-muted" aria-hidden="true" />
            <span className="text-sm font-medium text-ink">{t(locale, 'demo.collapsible.title')}</span>
          </div>
          <span className="text-xs text-muted">PNG · 24-bit</span>
        </div>

        {/* 独立单体折叠区域 */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="collapsible-panel"
            id="collapsible-trigger"
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-ink transition-colors hover:bg-[#F7F5F0]"
          >
            <span>{t(locale, 'demo.collapsible.trigger')}</span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`shrink-0 text-muted transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-ink' : ''
              }`}
            />
          </button>

          <div
            id="collapsible-panel"
            role="region"
            aria-labelledby="collapsible-trigger"
            className={`grid transition-[grid-template-rows] duration-250 ${
              isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-2 space-y-2.5 rounded-lg border border-line2 bg-[#FCFBF8] p-3 text-xs text-ink2">
                <p className="text-[0.75rem] text-muted">{t(locale, 'demo.collapsible.tip')}</p>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-line text-accent" />
                  <span>{t(locale, 'demo.collapsible.opt1')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="rounded border-line text-accent" />
                  <span>{t(locale, 'demo.collapsible.opt2')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-line text-accent" />
                  <span>{t(locale, 'demo.collapsible.opt3')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}
