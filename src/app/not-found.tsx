import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[58vh] flex-col items-center justify-center py-16 text-center">
      <p className="meta mb-3">404</p>
      <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.75rem]">
        这个 Pattern 不在词典里
      </h1>
      <p className="mt-2.5 max-w-[420px] text-[0.9375rem] leading-relaxed text-ink2">
        可能是链接过期了，也可能是我们还没收录这个词条。
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <Link
          href="/search"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
        >
          <Search size={15} aria-hidden="true" />
          搜一下
        </Link>
        <Link
          href="/identify"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
        >
          我不知道它叫什么
        </Link>
        <Link
          href="/explore"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
        >
          逛图鉴
        </Link>
      </div>
    </div>
  );
}
