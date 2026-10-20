'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function AccordionDemo() {
  const locale = useLocale();
  // FAQ 内容按语言取：中文是原稿，英文版每条都要对应得上，不能只翻标题
  const FAQ = [
    { q: t(locale, 'demo.accordion.faq1q'), a: t(locale, 'demo.accordion.faq1a') },
    { q: t(locale, 'demo.accordion.faq2q'), a: t(locale, 'demo.accordion.faq2a') },
    { q: t(locale, 'demo.accordion.faq3q'), a: t(locale, 'demo.accordion.faq3a') },
  ];
  const [open, setOpen] = useState<number[]>([0]);

  const toggle = (i: number) => {
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  return (
    <DemoStage caption={t(locale, 'demo.caption.accordion')}>
      <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-xl border border-line">
        <div className="flex items-center justify-between border-b border-line bg-[#F8F7F3] px-3.5 py-1.5 text-2xs text-muted">
          <span>{t(locale, 'demo.accordion.scenarioNotice')}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted/80">
            {locale === 'zh' ? '场景模拟' : 'MOCKUP'}
          </span>
        </div>
        <div className="divide-y divide-line">
        {FAQ.map((item, i) => {
          const isOpen = open.includes(i);
          return (
            <div key={i}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-header-${i}`}
                  className="flex w-full items-center justify-between gap-3 bg-surface px-4 py-3.5 text-left transition-colors hover:bg-[#F7F5F0]"
                >
                  <span className="text-sm font-medium text-ink">{item.q}</span>
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
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-header-${i}`}
                className={`grid transition-[grid-template-rows] duration-250 ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-line2 bg-[#FCFBF8] px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ink2">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </DemoStage>
  );
}
