'use client';

import Link from 'next/link';
import { MiniPreview } from '@/components/patterns/MiniPreview';
import { hasDemo } from '@/data/demoIds';
import { useHref, useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

const LIVE = [
  { id: 'accordion', name: 'Accordion', zh: '手风琴' },
  { id: 'modal', name: 'Modal', zh: '模态框' },
  { id: 'toast', name: 'Toast', zh: '轻提示' },
  { id: 'tabs', name: 'Tabs', zh: '标签页' },
  { id: 'switch', name: 'Switch', zh: '开关' },
  { id: 'slider', name: 'Slider', zh: '滑块' },
  { id: 'bottom-sheet', name: 'Bottom Sheet', zh: '底部面板' },
  { id: 'skeleton', name: 'Skeleton', zh: '骨架屏' },
];

/**
 * 首页主视觉：8 个组件的静态示意图拼贴。
 * 真正的交互放在它下面的 InteractiveStrip —— 保证上面的网格纯粹、快速、可扫读。
 *
 * 中文名是刻意保留的：英文读者看到 "Bottom Sheet / 底部面板" 反而更容易对上号，
 * 这是给中文母语者看的双语词典，不是纯英文站。
 */
export function HeroDemos() {
  const locale = useLocale();
  const h = useHref();
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {LIVE.map((d) => (
        <Link
          key={d.id}
          href={h(`/patterns/${d.id}`)}
          className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface card-hover hover:-translate-y-0.5"
        >
          <div className="h-[108px] overflow-hidden border-b border-line bg-[#F8F7F3]">
            <MiniPreview id={d.id} />
          </div>
          <div className="flex items-baseline gap-1.5 px-3 py-2.5">
            <span className="truncate text-[0.8125rem] font-semibold tracking-tight text-ink">
              {d.name}
            </span>
            <span className="truncate text-2xs text-muted">{d.zh}</span>
            {hasDemo(d.id) && (
              <span className="ml-auto shrink-0 text-2xs text-[#2C7355] opacity-0 transition-opacity group-hover:opacity-100">
                {t(locale, 'card.interactive')}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}