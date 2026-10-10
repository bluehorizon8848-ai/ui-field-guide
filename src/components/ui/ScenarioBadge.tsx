import type { ReactElement } from 'react';
import {
  Command,
  Undo2,
  Smartphone,
  Component,
  PlusCircle,
  BarChart3,
  ListOrdered,
  Loader2,
  type LucideIcon,
} from 'lucide-react';

interface BadgeConfig {
  icon: LucideIcon;
  bg: string;
  text: string;
  border: string;
}

const BADGE_MAP: Record<string, BadgeConfig> = {
  command: {
    icon: Command,
    bg: 'bg-[#F3E8FF]',
    text: 'text-[#7E22CE]',
    border: 'border-[#E9D5FF]',
  },
  undo: {
    icon: Undo2,
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#DC2626]',
    border: 'border-[#FECACA]',
  },
  smartphone: {
    icon: Smartphone,
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#DBEAFE]',
  },
  component: {
    icon: Component,
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
  },
  'plus-circle': {
    icon: PlusCircle,
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#EA580C]',
    border: 'border-[#FFEDD5]',
  },
  'bar-chart': {
    icon: BarChart3,
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#6D28D9]',
    border: 'border-[#DDD6FE]',
  },
  'list-ordered': {
    icon: ListOrdered,
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#16A34A]',
    border: 'border-[#BBF7D0]',
  },
  loader: {
    icon: Loader2,
    bg: 'bg-[#F8FAFC]',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
  },
};

export function ScenarioBadge({
  icon,
  size = 15,
  className = '',
}: {
  icon: string;
  size?: number;
  className?: string;
}): ReactElement {
  const conf = BADGE_MAP[icon] ?? BADGE_MAP.command;
  const IconComp = conf.icon;

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${conf.border} ${conf.bg} ${conf.text} shadow-2xs ${className}`}
      aria-hidden="true"
    >
      <IconComp size={size} strokeWidth={2} />
    </span>
  );
}
