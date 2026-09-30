'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';
import { useScrollLock } from '@/hooks/useScrollLock';

const GROUPS = [
  { title: '工作区', items: ['概览', '媒体库', '相册'] },
  { title: '个人', items: ['收藏', '最近删除', '设置'] },
];

export function DrawerDemo() {
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
    <DemoStage caption="从左侧滑出（这里限制在演示区内）。它和 Bottom Sheet 的区别是：Drawer 停靠在侧边，用来承载一整片内容。">
      <div className="flex flex-col items-center justify-center gap-3">
        <DemoButton
          ref={triggerRef}
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          <Menu size={15} aria-hidden="true" />
          打开菜单
        </DemoButton>
        <p className="text-xs text-muted">抽屉会盖住这一半页面</p>
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
            aria-label="主导航"
            className="absolute inset-y-0 left-0 flex w-[78%] max-w-[280px] flex-col border-r border-line bg-surface shadow-pop animate-slide-in-left"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <span className="text-sm font-semibold text-ink">拾光清理</span>
              <button
                type="button"
                onClick={close}
                aria-label="关闭菜单"
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {GROUPS.map((g) => (
                <div key={g.title} className="mb-4 last:mb-0">
                  <p className="meta mb-1.5 px-1.5">{g.title}</p>
                  <ul className="space-y-0.5">
                    {g.items.map((item, i) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={close}
                          aria-current={g.title === '工作区' && i === 0 ? 'page' : undefined}
                          className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                            g.title === '工作区' && i === 0
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
