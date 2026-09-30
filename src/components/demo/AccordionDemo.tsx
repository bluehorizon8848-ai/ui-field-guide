'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DemoStage } from './DemoStage';

const FAQ = [
  {
    q: '照片会占用手机多少空间？',
    a: '原图约 3–5MB，缩略图约 200KB。清理时可以选择「删除原图，保留缩略图」，这样浏览不受影响但能省下大部分空间。',
  },
  {
    q: '删除的照片还能找回吗？',
    a: '可以。删除后的照片会进入「最近删除」，保留 30 天。在「最近删除」里选择「恢复」即可回到原位置。',
  },
  {
    q: '为什么有些照片被识别为「重复」？',
    a: '系统会比较图片的内容哈希和拍摄参数。同一张图的不同分辨率、不同格式会被判定为重复，你可以选择保留画质最好的一张。',
  },
];

export function AccordionDemo() {
  const [open, setOpen] = useState<number[]>([0]);

  const toggle = (i: number) => {
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  return (
    <DemoStage caption="点标题展开，再点收起。可以同时展开多条 —— 这是 Accordion 的特点。">
      <div className="mx-auto w-full max-w-[440px] divide-y divide-line overflow-hidden rounded-xl border border-line">
        {FAQ.map((item, i) => {
          const isOpen = open.includes(i);
          return (
            <div key={i}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-header-${i}`}
                  className="flex w-full items-center justify-between gap-3 bg-surface px-4 py-3.5 text-left transition-colors hover:bg-[#F7F5F0]"
                >
                  <span className="text-sm font-medium text-ink">{item.q}</span>
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
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-header-${i}`}
                className={`grid transition-[grid-template-rows] duration-250 ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-line2 bg-[#FCFBF8] px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ink2">
                    {item.a}
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
