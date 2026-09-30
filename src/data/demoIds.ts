/**
 * 有可交互 Demo 的 Pattern ID 列表。
 *
 * 单独拆出来是因为 registry.ts 里的 Demo 组件都是 Client Component，
 * Server Component（如 PatternCard）只能读这份纯数据，不能调用 registry 里的函数。
 * 两者必须保持一致 —— registry.ts 在模块加载时会断言。
 */
export const demoIds: readonly string[] = [
  'breadcrumb',
  'tabs',
  'bottom-navigation',
  'navigation-rail',
  'sidebar',
  'pagination',
  'stepper',
  'back-button',
  'infinite-scroll',
  'load-more',
  'button',
  'cta',
  'icon-button',
  'fab',
  'split-button',
  'destructive-action',
  'text-field',
  'text-area',
  'search-field',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'segmented-control',
  'select',
  'chip',
  'date-picker',
  'file-upload',
  'stepper-input',
  'card',
  'accordion',
  'collapsible',
  'modal',
  'bottom-sheet',
  'drawer',
  'popover',
  'tooltip',
  'modal-stateful',
  'toast',
  'snackbar',
  'alert',
  'banner',
  'progress-bar',
  'spinner',
  'skeleton',
  'empty-state',
  'error-state',
  'success-state',
  'list',
  'table',
  'badge',
  'chip-display',
  'avatar',
  'timeline',
  'stat-card',
  'swipe-action',
  'pull-to-refresh',
  'drag-and-drop',
  'long-press',
  'context-menu',
  'progressive-disclosure',
  'optimistic-ui',
  'inline-validation',
] as const;

const demoIdSet = new Set<string>(demoIds);

export function hasDemo(id: string): boolean {
  return demoIdSet.has(id);
}
