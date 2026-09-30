'use client';

import type { ReactNode } from 'react';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Demo 舞台的高度策略。
 *
 * 不用固定 min-height，也不用「简单/复杂」手工分级——两者都会失准：
 * 固定值对 badge 太高对 skeleton 太矮，手工分级要维护 63 份标注。
 *
 * 做法是**测内容，再按内容分配**：
 * 1. 先以 auto 渲染一遍，量出内容的自然高度
 * 2. 舞台高度 = clamp(内容高 × 放大系数, 最小值, 最大值)
 * 3. 放大系数让简单组件也有体量感，复杂组件不被压缩
 *
 * 为什么要分两次渲染：内容高度只有挂载后才知道，而高度本身又影响布局。
 * 用 useLayoutEffect 在浏览器绘制前同步调整，避免用户看到跳动。
 */

/** 内容高度乘这个系数作为舞台高度，让简单组件撑出体量 */
const SCALE = 1.9;
/** 舞台高度下限：低于这个值再简单的组件也显得局促 */
const MIN_H = 260;
/** 舞台高度上限：再复杂也不该占满整屏 */
const MAX_H = 620;
/** 低于这个内容高度，认为是「简单组件」，用更大的系数 */
const SIMPLE_CONTENT_H = 130;

function computeStageHeight(contentH: number, viewportH: number): number {
  // 手机上限制得比桌面更紧，避免 Demo 占满整屏把正文挤到屏幕外
  const max = viewportH < 640 ? 460 : MAX_H;
  const min = viewportH < 640 ? 220 : MIN_H;

  const scaled = contentH * (contentH < SIMPLE_CONTENT_H ? SCALE + 0.7 : SCALE);
  return Math.round(Math.min(Math.max(scaled, min), max));
}

/** 读取视口高度（SSR 安全） */
function useViewportHeight(): number {
  const [vh, setVh] = useState(900);
  useEffect(() => {
    const read = () => setVh(window.innerHeight);
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);
  return vh;
}

export function DemoStage({
  children,
  caption,
  className = '',
  pad = true,
}: {
  children: ReactNode;
  caption?: string;
  className?: string;
  pad?: boolean;
}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [stageH, setStageH] = useState<number | null>(null);
  const viewportH = useViewportHeight();

  // 先按内容自然高度渲染，量一次
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      // 减去 padding，得到纯内容高度
      const cs = getComputedStyle(el);
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const contentH = el.scrollHeight - padY;
      if (contentH > 0) {
        setStageH(computeStageHeight(contentH, viewportH));
      }
    };

    measure();

    // 内容尺寸变化时重量（字体加载完成、图片加载、窗口旋转）
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, viewportH, pad]);

  return (
    <figure className="m-0">
      <div
        className={`demo-stage overflow-hidden ${pad ? 'p-5 sm:p-7' : ''} ${className}`}
        style={stageH ? { minHeight: stageH } : undefined}
        role="group"
      >
        {/*
          测量容器：纵向排列 + 水平居中。
          必须是 flex-col —— 早期用 flex-row 时，Demo 里多个并列的顶层元素
          （比如 SkeletonDemo 的「重新加载」按钮 + 卡片列表）会被挤成左右并排，
          按钮只剩 77px 宽。纵向排列才符合「一个 Demo 一摞」的直觉。
          量完高度后用 justify-center 保持垂直居中。
        */}
        <div
          ref={measureRef}
          className="flex h-full w-full flex-col items-center justify-center"
          style={stageH ? { minHeight: 0 } : undefined}
        >
          {children}
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2.5 text-2xs leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Demo 内部的一行操作区 */
export function DemoRow({
  children,
  label,
  className = '',
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label ? <p className="meta mb-2">{label}</p> : null}
      <div className="flex flex-wrap items-center gap-2.5">{children}</div>
    </div>
  );
}

/** Demo 内的演示用按钮 */
export const DemoButton = forwardRef<
  HTMLButtonElement,
  {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    disabled?: boolean;
    className?: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function DemoButton(
  { children, onClick, variant = 'primary', disabled, className = '', type, ...rest },
  ref
) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 min-h-[44px] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40';
  const variants: Record<string, string> = {
    primary: 'bg-ink text-white hover:bg-[#35322C] active:bg-[#0D0C0B]',
    secondary:
      'border border-line bg-surface text-ink hover:bg-[#F5F3EE] active:bg-[#EDEae3]',
    ghost: 'text-ink2 hover:bg-[#F2F0EB] active:bg-[#E9E6DF]',
    danger: 'bg-[#A8342C] text-white hover:bg-[#8F2B25] active:bg-[#7A241F]',
  };
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

/**
 * 小号 chip 式次要操作。
 * 视觉上保持紧凑的胶囊形，但热区补到 44px —— 触屏上手指没那么精准。
 */
export function DemoChip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:opacity-80 ${
        active
          ? 'bg-ink text-white'
          : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
      }`}
    >
      {children}
    </button>
  );
}
