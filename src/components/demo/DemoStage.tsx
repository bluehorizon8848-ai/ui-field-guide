'use client';

import type { ReactNode } from 'react';
import { forwardRef } from 'react';

/**
 * 所有 Demo 的统一舞台。
 *
 * 高度策略：给最小高度 + 垂直居中，内容少也能撑出体量感。
 * 手机端用较小的 min-height 并收紧内边距，避免舞台在窄屏上占满整屏。
 */
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
  return (
    <figure className="m-0">
      <div
        className={`demo-stage flex min-h-[240px] flex-col justify-center sm:min-h-[280px] ${
          pad ? 'p-5 sm:p-7' : ''
        } ${className}`}
        role="group"
      >
        {children}
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

/** 小号 chip 式次要操作 */
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
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-ink text-white'
          : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
      }`}
    >
      {children}
    </button>
  );
}
