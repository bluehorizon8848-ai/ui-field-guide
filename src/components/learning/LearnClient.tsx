'use client';

import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { patternMap } from '@/data/patterns';
import { learningLevels } from '@/data/learning';

export function LearnClient({ total }: { total: number }) {
  const { learned, ready, toggle, reset } = useProgress();
  const pct = total > 0 ? Math.round((learned.length / total) * 100) : 0;

  return (
    <div>
      {/* 进度总览 */}
      <div className="rounded-card border border-line bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="meta mb-1.5">学习进度</p>
            <p className="text-[1.75rem] font-semibold leading-none tabular-nums text-ink">
              {ready ? learned.length : 0}
              <span className="text-base font-normal text-muted"> / {total}</span>
            </p>
            <p className="mt-1.5 text-xs text-muted">
              你已经认识 {ready ? learned.length : 0} 个 UI Pattern
            </p>
          </div>
          {ready && learned.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              清空进度
            </button>
          )}
        </div>

        <div
          role="progressbar"
          aria-valuenow={ready ? learned.length : 0}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="总体学习进度"
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#E6E3DB]"
        >
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-2xs text-muted">
          进度保存在本机浏览器（LocalStorage），不会上传任何数据。
        </p>
      </div>

      {/* 三级路径 */}
      <div className="mt-8 space-y-8">
        {learningLevels.map((level) => {
          const items = level.patternIds.map((id) => patternMap[id]).filter(Boolean);
          const done = items.filter((p) => learned.includes(p.id)).length;

          return (
            <section key={level.level}>
              <header className="mb-4 flex flex-wrap items-baseline gap-2.5">
                <span className="meta">{level.subtitle}</span>
                <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  {level.name}
                </h2>
                <span className="ml-auto text-xs tabular-nums text-muted">
                  {done} / {items.length}
                </span>
              </header>

              <p className="mb-4 max-w-[600px] text-[0.875rem] leading-relaxed text-ink2">
                {level.description}
              </p>

              <ul className="grid gap-2 sm:grid-cols-2">
                {items.map((p) => {
                  const on = learned.includes(p.id);
                  return (
                    <li key={p.id}>
                      <div
                        className={`flex items-center gap-3 rounded-card border bg-surface p-3.5 transition-colors ${
                          on ? 'border-[#2C7355]' : 'border-line'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(p.id)}
                          aria-pressed={on}
                          aria-label={`${on ? '取消标记' : '标记为已认识'} ${p.name}`}
                          className={`group flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            on ? 'text-[#2C7355]' : 'text-muted hover:text-ink'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                              on
                                ? 'border-[#2C7355] bg-[#2C7355] text-white'
                                : 'border-[#C9C5BB] group-hover:border-ink'                            }`}
                          >
                            {on && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M2.5 6.2 L4.8 8.5 L9.5 3.5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                        </button>

                        <Link href={`/patterns/${p.id}`} className="flex min-h-[44px] min-w-0 flex-1 flex-col justify-center py-1">
                          <span className="block text-[0.875rem] font-semibold text-ink">
                            {p.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {p.chineseName}
                          </span>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
