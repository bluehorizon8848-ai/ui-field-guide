'use client';

import { Suspense } from 'react';
import { LearnWorkbench } from './LearnWorkbench';

export function LearnClient() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-12 text-center text-sm text-muted">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
          <p className="mt-3">加载学习工作台...</p>
        </div>
      }
    >
      <LearnWorkbench />
    </Suspense>
  );
}
