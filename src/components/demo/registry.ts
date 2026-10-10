'use client';

import type { ComponentType } from 'react';
import { demoIds } from '@/data/demoIds';
import { AccordionDemo } from './AccordionDemo';
import { CollapsibleDemo } from './CollapsibleDemo';
import { DialogDemo } from './DialogDemo';
import { BottomSheetDemo } from './BottomSheetDemo';
import { DrawerDemo } from './DrawerDemo';
import {
  ToastDemo,
  SnackbarDemo,
  AlertDemo,
  BannerDemo,
} from './FeedbackDemos';
import {
  SkeletonDemo,
  SpinnerDemo,
  ProgressBarDemo,
  EmptyStateDemo,
  ErrorStateDemo,
  SuccessStateDemo,
} from './LoadingDemos';
import {
  TextFieldDemo,
  TextAreaDemo,
  SearchFieldDemo,
  CheckboxDemo,
  RadioDemo,
  SwitchDemo,
  SliderDemo,
  SegmentedControlDemo,
  SelectDemo,
  ChipDemo,
  NumberStepperDemo,
} from './InputDemos';
import {
  BreadcrumbDemo,
  TabsDemo,
  BottomNavigationDemo,
  SidebarDemo,
  StepperDemo,
  PaginationDemo,
  InfiniteScrollDemo,
  LoadMoreDemo,
} from './NavigationDemos';
import {
  ButtonDemo,
  CtaDemo,
  IconButtonDemo,
  FabDemo,
  SplitButtonDemo,
  DestructiveActionDemo,
  FileUploadDemo,
} from './ActionDemos';
import {
  ListDemo,
  TableDemo,
  BadgeDemo,
  TagDemo,
  StatCardDemo,
  AvatarDemo,
  TimelineDemo,
  DatePickerDemo,
  PopoverDemo,
  ContextMenuDemo,
} from './DataDemos';
import {
  SwipeActionDemo,
  PullToRefreshDemo,
  LongPressDemo,
  DragDropDemo,
  OptimisticDemo,
  InlineValidationDemo,
  ProgressiveDisclosureDemo,
} from './InteractionDemos';
import {
  ActionSheetDemo,
  CommandPaletteDemo,
  ExtendedFabDemo,
  ServiceCardDemo,
} from './PlatformDemos';


export const demoRegistry: Record<string, ComponentType> = {
  // Navigation
  breadcrumb: BreadcrumbDemo,
  tabs: TabsDemo,
  'bottom-navigation': BottomNavigationDemo,
  'navigation-rail': SidebarDemo,
  sidebar: SidebarDemo,
  pagination: PaginationDemo,
  stepper: StepperDemo,
  'back-button': BreadcrumbDemo,
  'infinite-scroll': InfiniteScrollDemo,
  'load-more': LoadMoreDemo,

  // Actions
  button: ButtonDemo,
  cta: CtaDemo,
  'icon-button': IconButtonDemo,
  fab: FabDemo,
  'split-button': SplitButtonDemo,
  'destructive-action': DestructiveActionDemo,
  'action-sheet': ActionSheetDemo,
  'command-palette': CommandPaletteDemo,
  'extended-fab': ExtendedFabDemo,

  // Input
  'text-field': TextFieldDemo,
  'text-area': TextAreaDemo,
  'search-field': SearchFieldDemo,
  checkbox: CheckboxDemo,
  radio: RadioDemo,
  switch: SwitchDemo,
  slider: SliderDemo,
  'segmented-control': SegmentedControlDemo,
  select: SelectDemo,
  chip: ChipDemo,
  'date-picker': DatePickerDemo,
  'file-upload': FileUploadDemo,
  'stepper-input': NumberStepperDemo,

  // Containers
  card: ListDemo,
  accordion: AccordionDemo,
  collapsible: CollapsibleDemo,
  modal: DialogDemo,
  'bottom-sheet': BottomSheetDemo,
  drawer: DrawerDemo,
  popover: PopoverDemo,
  tooltip: IconButtonDemo,
  'modal-stateful': DialogDemo,
  'service-card': ServiceCardDemo,

  // Feedback
  toast: ToastDemo,
  snackbar: SnackbarDemo,
  alert: AlertDemo,
  banner: BannerDemo,
  'progress-bar': ProgressBarDemo,
  spinner: SpinnerDemo,
  skeleton: SkeletonDemo,
  'empty-state': EmptyStateDemo,
  'error-state': ErrorStateDemo,
  'success-state': SuccessStateDemo,

  // Data
  list: ListDemo,
  table: TableDemo,
  badge: BadgeDemo,
  'chip-display': TagDemo,
  avatar: AvatarDemo,
  timeline: TimelineDemo,
  'stat-card': StatCardDemo,

  // Interaction
  'swipe-action': SwipeActionDemo,
  'pull-to-refresh': PullToRefreshDemo,
  'drag-and-drop': DragDropDemo,
  'long-press': LongPressDemo,
  'context-menu': ContextMenuDemo,
  'progressive-disclosure': ProgressiveDisclosureDemo,
  'optimistic-ui': OptimisticDemo,
  'inline-validation': InlineValidationDemo,
};

export function hasDemo(id: string): boolean {
  return id in demoRegistry;
}

// 开发期断言：demoIds 与 demoRegistry 必须完全一致。
// 只在 dev 下跑，生产构建会摇掉。
if (process.env.NODE_ENV !== 'production') {
  const registered = Object.keys(demoRegistry);
  const missing = demoIds.filter((id) => !(id in demoRegistry));
  const extra = registered.filter((id) => !demoIds.includes(id));
  if (missing.length || extra.length) {
    console.error(
      `[demoIds] 与 demoRegistry 不一致 —— missing: ${missing.join(', ') || '无'} | extra: ${extra.join(', ') || '无'}`
    );
  }
}
