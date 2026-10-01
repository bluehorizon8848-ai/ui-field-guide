'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function CollapsibleDemo() {
  const locale = useLocale();
  // 分组标题与说明都要跟着语言走，只译标题会在英文版里露出中文说明
  const SECTIONS = [
    { t: t(locale, 'demo.collapsible.sec1t'), d: t(locale, 'demo.collapsible.sec1d') },
    { t: t(locale, 'demo.collapsible.sec2t'), d: t(locale, 'demo.collapsible.sec2d') },
    { t: t(locale, 'demo.collapsible.sec3t'), d: t(locale, 'demo.collapsible.sec3d') },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <DemoStage caption={t(locale, 'demo.caption.collapsible')}>
      <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-xl border border-line">
        {SECTIONS.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-line last:border-b-0">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`col-panel-${i}`}
                  className="flex w-full items-center justify-between gap-3 bg-surface px-4 py-3.5 text-left transition-colors hover:bg-[#F7F5F0]"
                >
                  <span className="text-sm font-medium text-ink">{s.t}</span>
                  <ChevronDown
                    size={17}
                    aria-hidden="true"
                    className={`shrink-0 text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-ink' : ''
                    }`}
                  />
                </button>
              </h3>
              <div
                id={`col-panel-${i}`}
                role="region"
                className={`grid transition-[grid-template-rows] duration-250 ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-line2 bg-[#FCFBF8] px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ink2">
                    {s.d}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DemoStage>
  );
}
