'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DemoStage } from './DemoStage';

const SECTIONS = [
  { t: '照片与视频', d: '扫描相册中的图片和视频文件，识别重复项与相似项。' },
  { t: '存储空间', d: '查看各类文件占用的空间，定位可清理的大文件。' },
  { t: '回收站', d: '已删除内容保留 30 天，可随时恢复。' },
];

export function CollapsibleDemo() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <DemoStage caption="点第二条试试 —— 第一条会自动收起。任何时刻最多只有一项展开，这就是 Collapsible。">
      <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-xl border border-line">
        {SECTIONS.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-line last:border-b-0">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`col-panel-${i}`}
                  className="flex w-full items-center justify-between gap-3 bg-surface px-4 py-3.5 text-left transition-colors hover:bg-[#F7F5F0]"
                >
                  <span className="text-sm font-medium text-ink">{s.t}</span>
                  <ChevronDown
                    size={17}
                    aria-hidden="true"
                    className={`shrink-0 text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-ink' : ''
                    }`}
                  />
                </button>
              </h3>
              <div
                id={`col-panel-${i}`}
                role="region"
                className={`grid transition-[grid-template-rows] duration-250 ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-line2 bg-[#FCFBF8] px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ink2">
                    {s.d}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DemoStage>
  );
}
