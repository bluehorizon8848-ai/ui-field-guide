import type { Metadata } from 'next';
import { IdentifyClient } from '@/components/identify/IdentifyClient';

export const metadata: Metadata = {
  title: '我不知道它叫什么',
  description:
    '按「它出现在哪儿」和「它主要干什么」两步筛出可能的 UI Pattern。纯本地规则，不需要 AI，不需要账号。',
  alternates: { canonical: '/identify' },
};

export default function IdentifyPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <header className="mb-8 max-w-[600px]">
        <p className="meta mb-2.5">Identify · 本地规则探索</p>
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.875rem]">
          我不知道它叫什么
        </h1>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink2">
          不用背术语。回答两个问题，我把它可能的身份列出来。
        </p>
        <p className="mt-1.5 text-xs text-muted">
          规则跑在你自己的浏览器里，不调用任何 AI 接口，也不上传选择。
        </p>
      </header>

      <IdentifyClient />
    </div>
  );
}
