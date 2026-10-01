'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function Tocs({ sections }: { sections: { id: string; label: string }[] }) {
  const locale = useLocale();
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const onScroll = () => {
      let current = sections[0]?.id ?? '';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  return (
    <nav
      aria-label={locale === 'zh' ? '页面目录' : 'On this page'}
      className="border-l border-line pl-4"
    >
      <p className="meta mb-2.5">{locale === 'zh' ? '本页' : 'On this page'}</p>
      <ul className="space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className={`block text-[0.8125rem] leading-snug transition-colors ${
                active === s.id ? 'font-medium text-ink' : 'text-muted hover:text-ink2'
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
