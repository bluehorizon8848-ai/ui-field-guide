import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ExploreClient } from '@/components/explore/ExploreClient';
import { patterns } from '@/data/patterns';

export const metadata: Metadata = {
  title: 'UI 图鉴',
  description: `按分类浏览全部 ${patterns.length} 个 UI Pattern，每个都有可交互 Demo、使用场景和可以直接告诉 AI 的 Prompt。`,
  alternates: { canonical: '/explore' },
};

export default function ExplorePage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <header className="mb-8 max-w-[640px]">
        <p className="meta mb-2.5">Explore · UI 图鉴</p>
        <h1 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.875rem]">
          全部 {patterns.length} 个 UI Pattern
        </h1>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
          按用途分类。点任意一张卡片进去，先玩 Demo，再看它叫什么、什么时候用，最后抄一段 Prompt 给 AI。
        </p>
      </header>

      <Suspense fallback={<div className="h-40" />}>
        <ExploreClient />
      </Suspense>
    </div>
  );
}
