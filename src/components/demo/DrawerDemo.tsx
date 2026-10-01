'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function DrawerDemo() {
  const locale = useLocale();
  // 导航项按语言取；分组用下标标记当前项，不拿标题字符串比对——
  // 标题一翻译，g.title === '工作区' 就永远不成立，aria-current 会失效
  const GROUPS = [
    {
      title: t(locale, 'demo.drawer.groupWork'),
      items: [
        t(locale, 'demo.drawer.overview'),
        t(locale, 'demo.drawer.library'),
        t(locale, 'demo.drawer.albums'),
      ],
    },
    {
      title: t(locale, 'demo.drawer.groupPersonal'),
      items: [
        t(locale, 'demo.drawer.favorites'),
        t(locale, 'demo.drawer.recentlyDeleted'),
        t(locale, 'demo.drawer.settings'),
      ],
    },
  ];
  const CURRENT_GROUP = 0;
  const CURRENT_ITEM = 0;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
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

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <DemoStage caption={t(locale, 'demo.caption.drawer')}>
      <div className="flex flex-col items-center justify-center gap-3">
        <DemoButton
          ref={triggerRef}
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          <Menu size={15} aria-hidden="true" />
          {t(locale, 'demo.drawer.open')}
        </DemoButton>
        <p className="text-xs text-muted">{t(locale, 'demo.drawer.hint')}</p>
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
            role="dialog"
            aria-modal="true"
            aria-label={t(locale, 'nav.main')}
            className="absolute inset-y-0 left-0 flex w-[78%] max-w-[280px] flex-col border-r border-line bg-surface shadow-pop animate-slide-in-left"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <span className="text-sm font-semibold text-ink">{t(locale, 'demo.drawer.appName')}</span>
              <button
                type="button"
                onClick={close}
                aria-label={t(locale, 'demo.drawer.close')}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {GROUPS.map((g, gi) => (
                <div key={g.title} className="mb-4 last:mb-0">
                  <p className="meta mb-1.5 px-1.5">{g.title}</p>
                  <ul className="space-y-0.5">
                    {g.items.map((item, i) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={close}
                          aria-current={gi === CURRENT_GROUP && i === CURRENT_ITEM ? 'page' : undefined}
                          className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                            gi === CURRENT_GROUP && i === CURRENT_ITEM
                              ? 'bg-[#F2F0EB] font-medium text-ink'
                              : 'text-ink2 hover:bg-[#F7F5F0]'
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </DemoStage>
  );
}
