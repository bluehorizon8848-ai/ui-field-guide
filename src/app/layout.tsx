/**
 * 透传式 root layout。
 *
 * 双 root layout（(zh) / (en)）下，真实的 <html lang> 由两个分组各自的
 * layout 提供（zh-CN / en 必须不同，这是 SEO 硬要求，没法在一个 layout 里动态取）。
 *
 * Next.js 要求根目录存在 root layout（哪怕是全局 not-found 也需要一个），
 * 但它不能同时拥有 <html>/<body>——那会和分组里的冲突。
 * 所以这里只透传 children：真正渲染文档骨架的在 (zh)/layout.tsx 和 (en)/en/layout.tsx。
 */
export default function PassThroughRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}