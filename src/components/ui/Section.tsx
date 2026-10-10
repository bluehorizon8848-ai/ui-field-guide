import type { ReactNode } from 'react';

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = '',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 ${className}`}>
      <header className="mb-4">
        {eyebrow ? <p className="meta mb-1.5">{eyebrow}</p> : null}
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-[1.375rem]">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

export function PlatformTag({ platform }: { platform: 'web' | 'mobile' | 'desktop' | 'ios' | 'android' | 'harmonyos' }) {
  const label = {
    web: 'Web',
    mobile: 'Mobile',
    desktop: 'Desktop',
    ios: 'iOS',
    android: 'Android',
    harmonyos: '鸿蒙',
  }[platform] ?? platform;
  return (
    <span className="inline-block rounded-md border border-line bg-surface px-1.5 py-0.5 text-2xs font-medium text-ink2">
      {label}
    </span>
  );
}

export function DifficultyTag({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const label = { easy: '容易', medium: '中等', hard: '进阶' }[level];
  const cls = {
    easy: 'text-[#2C7355]',
    medium: 'text-[#94701C]',
    hard: 'text-[#A8342C]',
  }[level];
  return <span className={`text-2xs font-medium ${cls}`}>{label}</span>;
}
