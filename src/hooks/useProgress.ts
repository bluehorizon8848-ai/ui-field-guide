'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'uifg.learned.v1';
const EVENT = 'uifg:progress';

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** 学习进度：LocalStorage 持久化 + 跨标签页同步 + 组件间广播 */
export function useProgress() {
  const [learned, setLearned] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLearned(read());
    setReady(true);

    const sync = () => setLearned(read());
    window.addEventListener('storage', sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  const write = useCallback((next: string[]) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* 隐私模式下忽略 */
    }
    window.dispatchEvent(new CustomEvent(EVENT));
  }, []);

  const mark = useCallback(
    (id: string) => {
      setLearned((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        write(next);
        return next;
      });
    },
    [write]
  );

  const unmark = useCallback(
    (id: string) => {
      setLearned((prev) => {
        const next = prev.filter((x) => x !== id);
        write(next);
        return next;
      });
    },
    [write]
  );

  const toggle = useCallback(
    (id: string) => {
      setLearned((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        write(next);
        return next;
      });
    },
    [write]
  );

  const reset = useCallback(() => {
    setLearned([]);
    write([]);
  }, [write]);

  return {
    learned,
    ready,
    isLearned: (id: string) => learned.includes(id),
    mark,
    unmark,
    toggle,
    reset,
  };
}
