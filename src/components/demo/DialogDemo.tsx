'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';
import { useScrollLock } from '@/hooks/useScrollLock';

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // 用 useId 而非硬编码 id —— 同一页面可能出现两个 Dialog（如对比页）
  const uid = useId();
  const titleId = `${uid}-dialog-title`;
  const descId = `${uid}-dialog-desc`;
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    surfaceRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !surfaceRef.current) return;
      // focus trap
      const focusables = surfaceRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <DemoStage
      caption="点「删除照片」，弹窗会拦住你。试试 Tab 键（焦点被困在弹窗内）和 Esc（关闭）。"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <DemoButton
          ref={triggerRef}
          variant="secondary"
          onClick={() => {
            setResult(null);
            setOpen(true);
          }}
        >
          <Trash2 size={15} aria-hidden="true" />
          删除照片
        </DemoButton>
        {result && (
          <p className="text-xs text-muted" role="status">
            {result}
          </p>
        )}
      </div>

      {open && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center p-4 animate-fade-in"
          role="presentation"
        >
          <div
            className="absolute inset-0 bg-[rgba(26,25,23,0.42)]"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={surfaceRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            className="relative w-full max-w-[400px] rounded-xl border border-line bg-surface p-5 shadow-pop animate-rise-in focus:outline-none"
          >
            <button
              type="button"
              onClick={close}
              aria-label="关闭"
              className="absolute right-3.5 top-3.5 rounded-md p-1.5 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
            >
              <X size={16} aria-hidden="true" />
            </button>
            <h3 id={titleId} className="pr-7 text-base font-semibold text-ink">
              删除 3 张照片？
            </h3>
            <p id={descId} className="mt-2 text-[0.8125rem] leading-relaxed text-ink2">
              这些照片会移到「最近删除」，30 天后自动清除。你可以随时从「最近删除」恢复。
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <DemoButton variant="secondary" onClick={close}>
                取消
              </DemoButton>
              <DemoButton
                variant="danger"
                onClick={() => {
                  setOpen(false);
                  setResult('已删除 3 张照片（可在「最近删除」恢复）');
                }}
              >
                删除
              </DemoButton>
            </div>
          </div>
        </div>
      )}
    </DemoStage>
  );
}
