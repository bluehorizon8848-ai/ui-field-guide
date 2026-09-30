import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchClient } from '@/components/search/SearchClient';

export const metadata: Metadata = {
  title: '搜索 UI 术语',
  description:
    '用中文、英文、别名或你的口语描述搜索 UI Pattern。比如「底下弹出来」能找到 Bottom Sheet。',
  alternates: { canonical: '/search' },
};

export default function SearchPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <header className="mb-7 max-w-[640px]">
        <p className="meta mb-2.5">Search</p>
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
          用你记得的任何方式搜
        </h1>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
          中文、英文、别名，甚至你当时随口说的那句话。这里都能找到对应的专业术语。
        </p>
      </header>

      <Suspense fallback={<div className="h-40" />}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
