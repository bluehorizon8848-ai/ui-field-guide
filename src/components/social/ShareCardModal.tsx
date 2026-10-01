'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Loader2, X } from 'lucide-react';
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
  const [shotState, setShotState] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** 隐藏的离屏容器：把真实 Demo 渲染一份用于截图 */
  const shotRef = useRef<HTMLDivElement>(null);
  const shotImgRef = useRef<HTMLImageElement | null>(null);
  const spec = RATIOS.find((r) => r.id === ratio)!;

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
      // 离屏容器是 max-content，但 Demo 内部常有 w-full / 拉伸类，
      // 实测宽度常常大于内容真实宽度。先量出内容的紧致框再按它裁剪，
      // 否则组件左侧留一大片空白，在卡片里依旧偏小、看不清。
      const box = (() => {
        const root = node.querySelector<HTMLElement>('[data-shot-content]');
        if (!root) return null;
        const r = root.getBoundingClientRect();
        return { w: Math.ceil(r.width), h: Math.ceil(r.height) };
      })();

      const dataUrl = await toPng(node, {
        width: box?.w,
        height: box?.h,
        pixelRatio: 2,
        backgroundColor: '#F5F3EE',
        cacheBust: true,
        // 关键：离屏节点用 position:fixed + left:-12000px 移出视口。
        // html-to-image 会把克隆节点塞进 SVG <foreignObject>，若沿用该定位，
        // 内容会被画到画布外 12000px 处，结果是一张纯背景色的空白图。
        // 这里在克隆体上把定位复位成正常流式布局。
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

          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#35322C] disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={15} aria-hidden="true" className="animate-spin" />
            ) : (
              <Download size={15} aria-hidden="true" />
            )}
            {busy ? t(locale, 'share.exporting') : t(locale, 'share.saving')}
          </button>
        </footer>
      </div>

      {/* ---------- 离屏截图容器：渲染真实 Demo ---------- */}
      {/* 用 clip 移出视口而不是 opacity:0 —— html-to-image 会跳过不可见元素 */}
      {/* 容器用 max-content 收缩包裹实际组件：固定尺寸会让小组件在卡片里
          只占很小一块（就是「看不出是哪个组件」的根因），按内容裁剪才清晰。 */}
      <div
        ref={shotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-12000px',
          top: '0',
          width: 'max-content',
          maxWidth: '820px',
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
 * 独立于页面上的 Demo 实例，避免截图抓到用户交互后的状态。
 *
 * 尺寸策略：宽度给一个上限（820px，和卡片视觉密度匹配），高度跟随内容。
 * 小组件（按钮、Badge）会自然收缩成贴合内容的小图；
 * 复杂组件（表格、时间线）撑满上限宽度。两种情况在卡片里都清晰。
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
    <div className="w-[820px] max-w-full bg-[#F5F3EE] p-4">
      <div className="w-fit min-w-[260px] max-w-full rounded-xl border border-line bg-surface p-4">
        {/*
          Demo 组件内部自带 .demo-stage（固定边框 + padding + 最小高度）。
          截图时把它压平：去掉边框/背景/内边距和最小高度，
          让组件按内容自然尺寸排版 —— 否则组件被撑在 260px 高的空盒子里居中，
          在卡片里就只占很小一块，看不出是哪个组件。
          用继承式 CSS 覆盖，不改 Demo 组件本身。
        */}
        <div
          data-shot-content=""
          className="w-fit [&_.demo-stage]:!min-h-0 [&_.demo-stage]:!border-0 [&_.demo-stage]:!bg-transparent [&_.demo-stage]:!p-0 [&_.demo-stage]:!rounded-none"
        >
          {Demo ? <Demo /> : null}
        </div>
      </div>
    </div>
  );
}
