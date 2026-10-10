'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Loader2, Share2, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { UIPattern } from '@/data/types';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';
import { drawShareCard, type ShareCardImage } from './renderCard';

/**
 * 比例选项。label 是尺寸比（两种语言都一样），hint 是界面文案，
 * 所以按 id 映射到 ui-strings 的 key，而不是把文案写在这里。
 */
const RATIOS = [
  { id: '3:4', w: 900, h: 1200, label: '3:4', hintKey: 'share.ratio34' },
  { id: '1:1', w: 1000, h: 1000, label: '1:1', hintKey: 'share.ratio11' },
] as const;

type RatioId = (typeof RATIOS)[number]['id'];

export function ShareCardModal({
  pattern,
  onClose,
}: {
  pattern: UIPattern;
  onClose: () => void;
}) {
  const locale = useLocale();
  const [ratio, setRatio] = useState<RatioId>('3:4');
  const [busy, setBusy] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [canShare, setCanShare] = useState(false);
  const [shotState, setShotState] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** 隐藏的离屏容器：把真实 Demo 渲染一份用于截图 */
  const shotRef = useRef<HTMLDivElement>(null);
  const shotImgRef = useRef<HTMLImageElement | null>(null);
  const spec = RATIOS.find((r) => r.id === ratio)!;

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true);
    }
  }, []);

  /* ---------- Esc 关闭 + body 滚动锁 ---------- */
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

  /* ---------- 抓取真实 Demo 截图 ---------- */
  const capture = useCallback(async () => {
    const node = shotRef.current;
    if (!node) return;

    setShotState('loading');
    try {
      // 获取规范化的快照舞台容器
      const stage = node.querySelector<HTMLElement>('[data-shot-stage]');
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const stageW = Math.ceil(rect.width);
      const stageH = Math.ceil(rect.height);

      const dataUrl = await toPng(stage, {
        width: stageW,
        height: stageH,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
        cacheBust: true,
        style: {
          position: 'static',
          left: '0',
          top: '0',
          right: 'auto',
          bottom: 'auto',
          margin: '0',
        },
      });

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('screenshot decode failed'));
        img.src = dataUrl;
      });

      shotImgRef.current = img;
      setShotState('ready');
    } catch (err) {
      // 保留到 console 便于排查，但不影响用户界面
      console.warn('[share-card] Demo 截图失败，回退到占位图：', err);
      shotImgRef.current = null;
      setShotState('failed');
    }
  }, []);

  useEffect(() => {
    // 等一帧，确保离屏节点已挂载并完成样式计算
    const raf = requestAnimationFrame(() => {
      void capture();
    });
    return () => cancelAnimationFrame(raf);
  }, [capture]);

  /* ---------- 重绘卡片 ---------- */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const payload: ShareCardImage = {
      demo: shotImgRef.current,
      fallbackReason:
        shotState === 'loading'
          ? t(locale, 'share.shotPreparing')
          : shotState === 'failed'
            ? t(locale, 'share.shotUnsupported')
            : t(locale, 'share.shotPreparing'),
    };
    drawShareCard(c, pattern, spec.w, spec.h, locale, payload);
  }, [pattern, spec.w, spec.h, shotState, locale]);

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

  const copyImage = () => {
    const c = canvasRef.current;
    if (!c || busy) return;
    setBusy(true);
    c.toBlob(async (blob) => {
      try {
        if (!blob) throw new Error('Blob creation failed');
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopyState('copied');
          setTimeout(() => setCopyState('idle'), 2500);
        } else {
          setCopyState('failed');
          setTimeout(() => setCopyState('idle'), 2500);
        }
      } catch {
        setCopyState('failed');
        setTimeout(() => setCopyState('idle'), 2500);
      } finally {
        setBusy(false);
      }
    }, 'image/png');
  };

  const shareSystem = () => {
    const c = canvasRef.current;
    if (!c || busy) return;
    setBusy(true);
    c.toBlob(async (blob) => {
      try {
        if (!blob) return;
        const file = new File([blob], `${pattern.id}-${ratio.replace(':', 'x')}.png`, {
          type: 'image/png',
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${pattern.name} — UI Field Guide`,
            text: `${pattern.name} (${pattern.chineseName}) · UI Field Guide by LutiveLab`,
            files: [file],
          });
        } else {
          await navigator.share({
            title: `${pattern.name} — UI Field Guide`,
            text: `${pattern.name} (${pattern.chineseName}) · UI Field Guide by LutiveLab`,
            url: window.location.href,
          });
        }
      } catch {
        /* user cancelled */
      } finally {
        setBusy(false);
      }
    }, 'image/png');
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-[rgba(26,25,23,0.5)] p-3 animate-fade-in sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t(locale, 'share.canvasAria')}
      data-shot-state={shotState}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex max-h-full w-full max-w-[520px] flex-col overflow-hidden rounded-xl border border-line bg-canvas shadow-pop">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ink">{t(locale, 'share.modalTitle')}</h2>
            <p className="mt-0.5 text-2xs text-muted">
              {t(locale, 'share.modalSub', { name: pattern.name })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t(locale, 'common.close')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="h-auto max-h-[54vh] w-auto max-w-full rounded-lg border border-line shadow-card"
              aria-label={t(locale, 'share.canvasLabel', { name: pattern.name })}
            />
          </div>
        </div>

        <footer className="shrink-0 border-t border-line px-3 pb-3 pt-2 sm:px-4">
          <div role="radiogroup" aria-label={t(locale, 'share.ratioAria')} className="mb-2.5 flex gap-1.5">
            {RATIOS.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={ratio === r.id}
                onClick={() => setRatio(r.id)}
                className={`min-h-[44px] flex-1 rounded-lg border px-2.5 py-1.5 text-left transition-colors ${
                  ratio === r.id
                    ? 'border-ink bg-surface'
                    : 'border-line bg-transparent hover:border-[#C9C5BB]'
                }`}
              >
                <span className="block text-[0.8125rem] font-semibold text-ink">
                  {r.label}
                </span>
                <span className="mt-0.5 block text-2xs text-muted">{t(locale, r.hintKey)}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#35322C] disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} aria-hidden="true" className="animate-spin" />
              ) : (
                <Download size={15} aria-hidden="true" />
              )}
              {busy ? t(locale, 'share.exporting') : t(locale, 'share.saving')}
            </button>

            <button
              type="button"
              onClick={copyImage}
              disabled={busy}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-[#F2F0EB] disabled:opacity-50"
            >
              {copyState === 'copied' ? (
                <Check size={15} className="text-[#2C7355]" aria-hidden="true" />
              ) : (
                <Copy size={15} aria-hidden="true" />
              )}
              {copyState === 'copied'
                ? t(locale, 'share.copiedImage')
                : copyState === 'failed'
                  ? t(locale, 'share.copyImageFailed')
                  : t(locale, 'share.copyImage')}
            </button>

            {canShare && (
              <button
                type="button"
                onClick={shareSystem}
                disabled={busy}
                aria-label={t(locale, 'share.systemShare')}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-[#F2F0EB] disabled:opacity-50"
              >
                <Share2 size={15} aria-hidden="true" />
                <span className="sm:hidden">{t(locale, 'share.systemShare')}</span>
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* ---------- 离屏截图容器：渲染真实 Demo ---------- */}
      <div
        ref={shotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-12000px',
          top: '0',
          width: 'max-content',
          pointerEvents: 'none',
        }}
      >
        <ShareCardDemoSnapshot pattern={pattern} />
      </div>
    </div>
  );
}

/**
 * 离屏渲染用的 Demo 快照。
 * 独立于页面上的 Demo 实例，自带高质感微舞台包装与自然内容流式展开。
 */
function ShareCardDemoSnapshot({ pattern }: { pattern: UIPattern }) {
  const [Demo, setDemo] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { demoRegistry } = await import('@/components/demo/registry');
      if (!cancelled) {
        setDemo(() => demoRegistry[pattern.id] ?? null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pattern.id]);

  return (
    <div
      data-shot-stage=""
      className="w-fit max-w-[700px] min-w-[280px] rounded-2xl border border-line bg-surface p-5 shadow-sm"
    >
      {/*
        Demo 组件内部自带 .demo-stage（固定边框 + padding + 最小高度）。
        截图时把它压平：去掉边框/背景/内边距和最小高度，
        让组件按内容自然尺寸排版，由外部舞台提供统一的呼吸感与质感。
      */}
      <div className="w-fit [&_.demo-stage]:!min-h-0 [&_.demo-stage]:!border-0 [&_.demo-stage]:!bg-transparent [&_.demo-stage]:!p-0 [&_.demo-stage]:!rounded-none">
        {Demo ? <Demo /> : null}
      </div>
    </div>
  );
}
