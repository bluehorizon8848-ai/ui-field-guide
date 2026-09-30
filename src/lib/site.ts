export const site = {
  name: 'UI Field Guide',
  chineseName: 'UI Field Guide',
  tagline: 'AI 独立开发者的 UI / UX 可视化词典',
  description:
    '给 AI 独立开发者的 UI / UX 可视化词典。看示例、学名字、理解场景，然后直接告诉 AI。',
  url: 'https://ui-field-guide.pages.dev',
  locale: 'zh_CN',
};

/**
 * layout.tsx 的 title.template 是 `%s｜UI Field Guide`，
 * 所以这里只返回前半段，不要自己再拼一次站名。
 */
export function patternTitle(name: string) {
  return `${name} 是什么？`;
}

export function patternDescription(
  name: string,
  chineseName: string,
  oneLine: string
) {
  return `用真实交互示例理解 ${name}（${chineseName}）的含义、适用场景，以及如何准确告诉 AI 实现它。${oneLine}`;
}

export function absoluteUrl(path = '') {
  return `${site.url}${path}`;
}
