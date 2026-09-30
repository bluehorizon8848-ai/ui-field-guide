import type { Category } from './types';

export const categories: Category[] = [
  {
    id: 'navigation',
    name: 'Navigation',
    chineseName: '导航',
    blurb: '让用户在页面和层级之间移动，并且始终知道自己在哪。',
    tint: 'tint-navigation',
    accent: 'text-accent-navigation',
  },
  {
    id: 'actions',
    name: 'Actions',
    chineseName: '操作',
    blurb: '让用户可以触发一件事——这是界面上「能按的东西」。',
    tint: 'tint-actions',
    accent: 'text-accent-actions',
  },
  {
    id: 'input',
    name: 'Input',
    chineseName: '输入',
    blurb: '接收用户的信息：打字、选择、开关、拖动、上传。',
    tint: 'tint-input',
    accent: 'text-accent-input',
  },
  {
    id: 'containers',
    name: 'Containers',
    chineseName: '容器与展开',
    blurb: '把东西装起来，或者临时展开一层——浮在页面上的那一层。',
    tint: 'tint-containers',
    accent: 'text-accent-containers',
  },
  {
    id: 'feedback',
    name: 'Feedback',
    chineseName: '状态反馈',
    blurb: '告诉用户「刚才发生了什么」「现在是什么状态」「接下来能干什么」。',
    tint: 'tint-feedback',
    accent: 'text-accent-feedback',
  },
  {
    id: 'data',
    name: 'Data Display',
    chineseName: '信息展示',
    blurb: '把一批信息摆出来让人读：列表、表格、标签、统计。',
    tint: 'tint-data',
    accent: 'text-accent-data',
  },
  {
    id: 'interaction',
    name: 'Interaction',
    chineseName: '交互模式',
    blurb: '不只是组件，而是「一套操作习惯」——长按、滑动、下拉刷新。',
    tint: 'tint-interaction',
    accent: 'text-accent-interaction',
  },
  {
    id: 'general',
    name: 'General',
    chineseName: '通用',
    blurb: '不属于任何单一分类，但你会天天见到的基础件。',
    tint: 'tint-general',
    accent: 'text-accent-general',
  },
];

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c])
);

export const categoryOrder = categories.map((c) => c.id);
