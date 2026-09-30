'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import type { UIPattern } from '@/data/types';
import { drawShareCard } from './renderCard';

const RATIOS = [
  { id: '3:4', w: 900, h: 1200, label: '3:4', hint: '小红书 / 中文内容平台' },
  { id: '1:1', w: 1000, h: 1000, label: '1:1', hint: 'X / Reddit / 社交媒体' },
] as const;

type RatioId = (typeof RATIOS)[number]['id'];

export function ShareCardModal({
  pattern,
  onClose,
}: {
  pattern: UIPattern;
  onClose: () => void;
}) {
  const [ratio, setRatio] = useState<RatioId>('3:4');
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spec = RATIOS.find((r) => r.id === ratio)!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    drawShareCard(c, pattern, spec.w, spec.h);
  }, [pattern, spec.w, spec.h]);

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    setBusy(true);
    c.toBlob((blob) => {
      setBusy(false);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pattern.id}-${ratio.replace(':', 'x')}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-[rgba(26,25,23,0.5)] p-4 animate-fade-in sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="分享卡片预览"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex max-h-full w-full max-w-[520px] flex-col overflow-hidden rounded-xl border border-line bg-canvas shadow-pop">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">分享卡片</h2>
            <p className="mt-0.5 text-2xs text-muted">
              {pattern.name} · 在浏览器里生成并保存，无后端
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="max-h-[52vh] w-auto max-w-full rounded-lg border border-line shadow-card"
              aria-label={`${pattern.name} 分享卡片预览`}
            />
          </div>
        </div>

        <footer className="shrink-0 border-t border-line px-4 py-3">
          <div
            role="radiogroup"
            aria-label="卡片比例"
            className="mb-3 flex gap-1.5"
          >
            {RATIOS.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={ratio === r.id}
                onClick={() => setRatio(r.id)}
                className={`flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                  ratio === r.id
                    ? 'border-ink bg-surface'
                    : 'border-line bg-transparent hover:border-[#C9C5BB]'
                }`}
              >
                <span className="block text-[0.8125rem] font-semibold text-ink">
                  {r.label}
                </span>
                <span className="mt-0.5 block text-2xs text-muted">{r.hint}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#35322C] disabled:opacity-50"
          >
            <Download size={15} aria-hidden="true" />
            {busy ? '正在生成…' : '保存为 PNG'}
          </button>
        </footer>
      </div>
    </div>
  );
}
