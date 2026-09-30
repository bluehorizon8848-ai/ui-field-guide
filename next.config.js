/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 纯静态导出：无后端、无服务器运行时。
  // 产物在 out/，可直接托管到 Cloudflare Pages / Netlify / GitHub Pages。
  output: 'export',

  // 静态导出没有图片优化服务器，必须关掉。
  images: { unoptimized: true },

  // 导出到 out/ 后，静态资源不再带哈希长缓存（CDN 层面按路径缓存）。
  trailingSlash: true,
};

module.exports = nextConfig;
