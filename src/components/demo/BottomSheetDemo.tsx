'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function BottomSheetDemo() {
  const locale = useLocale();
  const FILTERS = [
    { id: 'date', label: t(locale, 'demo.sheet.byDate') },
    { id: 'type', label: t(locale, 'demo.sheet.byType') },
    { id: 'rating', label: t(locale, 'demo.sheet.byRating') },
  ];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['date']);
  const [result, setResult] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetUid = useId();
  const sheetTitleId = `${sheetUid}-sheet-title`;
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <DemoStage caption={t(locale, 'demo.caption.sheet')}>
      <div className="flex flex-col items-center justify-center gap-3">
        <DemoButton
          ref={triggerRef}
          variant="secondary"
          onClick={() => {
            setResult(null);
            setOpen(true);
          }}
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          {t(locale, 'demo.sheet.filterPhotos')}
        </DemoButton>
        {result && (
          <p className="text-xs text-muted" role="status">
            {result}
          </p>
        )}
      </div>

      {open && (
        <div
          className="absolute inset-0 z-20"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="absolute inset-0 bg-[rgba(26,25,23,0.4)] animate-fade-in" aria-hidden="true" />

          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={sheetTitleId}
            className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-surface shadow-pop animate-sheet-up"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2.5 pb-1" aria-hidden="true">
              <div className="h-1 w-9 rounded-full bg-[#D8D5CD]" />
            </div>

            <div className="flex items-center justify-between px-5 pb-2 pt-1.5">
              <h3 id={sheetTitleId} className="text-base font-semibold text-ink">
                {t(locale, 'demo.sheet.title')}
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label={t(locale, 'demo.sheet.close')}
                className="-mr-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <ul className="scroll-contain max-h-[46vh] space-y-1 overflow-y-auto px-3 pb-3">
              {FILTERS.map((f) => {
                const checked = selected.includes(f.id);
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => toggle(f.id)}
                      aria-pressed={checked}
                      className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-[#F7F5F0] active:bg-[#F0EDE6]"
                    >
                      <span className="text-sm text-ink">{f.label}</span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          checked
                            ? 'border-ink bg-ink text-white'
                            : 'border-[#D8D5CD] bg-surface'
                        }`}
                        aria-hidden="true"
                      >
                        {checked && <Check size={13} strokeWidth={3} />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-line px-5 py-3.5 pb-safe-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="min-h-[44px] shrink-0 px-1 text-xs text-muted underline-offset-4 hover:underline"
                >
                  {t(locale, 'demo.sheet.clear')}
                </button>
                <DemoButton
                  onClick={() => {
                    setOpen(false);
                    setResult(t(locale, 'demo.sheet.applied', { n: selected.length }));
                  }}
                  disabled={selected.length === 0}
                >
                  {t(locale, 'demo.sheet.apply')}
                  {selected.length > 0 ? ` (${selected.length})` : ''}
                </DemoButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </DemoStage>
  );
}
