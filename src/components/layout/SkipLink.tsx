/**
 * 跳转到主内容。
 *
 * 刻意写成服务端组件并用 props 传语言：它没有任何交互，
 * 没必要为了一个静态 <a> 把整棵树拖进客户端边界。
 */
export function SkipLink({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
    >
      {locale === 'zh' ? '跳到主要内容' : 'Skip to main content'}
    </a>
  );
}
