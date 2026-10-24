'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function CopyButton({
  text,
  label,
  className = '',
  onCopySuccess,
}: {
  text: string;
  /** 不传则用「复制」/ "Copy" 的本地化默认值 */
  label?: string;
  className?: string;
  onCopySuccess?: () => void;
}) {
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const text_ = label ?? t(locale, 'common.copy');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API 不可用时回退
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* 忽略 */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    onCopySuccess?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? t(locale, 'common.copied') : text_}
      className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-ink2 transition-colors hover:bg-[#F5F3EE] hover:text-ink ${className}`}
    >
      {copied ? (
        <Check size={13} className="text-[#2C7355]" aria-hidden="true" />
      ) : (
        <Copy size={13} aria-hidden="true" />
      )}
      {copied ? t(locale, 'common.copied') : text_}
    </button>
  );
}
