'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { identifyCandidates, identifySteps } from '@/data/search';
import { categoryMap } from '@/data/categories';
import { MiniPreview } from '@/components/patterns/MiniPreview';

export function IdentifyClient() {
  const [position, setPosition] = useState<string | null>(null);
  const [job, setJob] = useState<string | null>(null);

  const answered = position !== null || job !== null;

  const hits = useMemo(
    () => (answered ? identifyCandidates(position, job, patterns) : []),
    [position, job, answered]
  );

  const posLabel = identifySteps.position.find((s) => s.value === position)?.label;
  const jobLabel = identifySteps.job.find((s) => s.value === job)?.label;

  return (
    <div>
      {/* 两个问题，上下两张卡 */}
      <div className="grid gap-3 lg:grid-cols-2">
        <QuestionCard
          step="1"
          title="它出现在哪儿？"
          options={identifySteps.position}
          value={position}
          onChange={setPosition}
        />
        <QuestionCard
          step="2"
          title="它主要是干什么的？"
          options={identifySteps.job}
          value={job}
          onChange={setJob}
        />
      </div>

      {/* 结果 */}
      <div className="mt-8" aria-live="polite">
        {!answered ? (
          <div className="rounded-card border border-dashed border-line px-6 py-16 text-center">
            <p className="text-sm text-ink2">
              选一个位置试试 —— 只选一个也能得到结果。
            </p>
            <p className="mt-1.5 text-xs text-muted">
              两个都选，候选会更准。
            </p>
          </div>
        ) : hits.length === 0 ? (
          <NoResult
            position={position}
            job={job}
            onReset={() => {
              setPosition(null);
              setJob(null);
            }}
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="text-sm text-ink">
                {hits.length === 1 ? '可能是这个' : `可能是这几个 · ${hits.length}`}
              </p>
              {(posLabel || jobLabel) && (
                <span className="text-xs text-muted">
                  按
                  {[posLabel, jobLabel].filter(Boolean).join(' + ')}
                  筛选
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setPosition(null);
                  setJob(null);
                }}
                className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                <RotateCcw size={13} aria-hidden="true" />
                重选
              </button>
            </div>

            <ul className="space-y-2">
              {hits.map((h) => {
                const cat = categoryMap[h.pattern.category];
                return (
                  <li key={h.pattern.id}>
                    <Link
                      href={`/patterns/${h.pattern.id}`}
                      className="group flex gap-3.5 rounded-card border border-line bg-surface p-3.5 card-hover"
                    >
                      <span className="h-[76px] w-[104px] shrink-0 overflow-hidden rounded-lg border border-line bg-[#FCFBF8]">
                        <MiniPreview id={h.pattern.id} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${cat?.tint ?? 'bg-[#F2F0EB]'}`}
                          />
                          <span className="meta !text-[0.625rem]">
                            {cat?.chineseName}
                          </span>
                          <span className="meta !text-[0.625rem]">
                            Level {h.pattern.level}
                          </span>
                        </span>

                        <span className="mt-1.5 block text-[0.9375rem] font-semibold leading-snug text-ink">
                          {h.pattern.name}
                          <span className="ml-1.5 text-xs font-normal text-muted">
                            {h.pattern.chineseName}
                          </span>
                        </span>

                        <span className="mt-1.5 block line-clamp-2 text-[0.8125rem] leading-relaxed text-ink2">
                          {h.pattern.oneLine}
                        </span>

                        <span className="mt-2 flex flex-wrap items-center gap-1.5">
                          {h.reasons.map((r) => (
                            <span
                              key={r}
                              className="rounded bg-[#F2F0EB] px-1.5 py-0.5 text-2xs text-ink2"
                            >
                              {r}
                            </span>
                          ))}
                        </span>
                      </span>

                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="mt-1 shrink-0 self-start text-[#C9C5BB] transition-all group-hover:translate-x-0.5 group-hover:text-ink"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="mt-5 border-l-2 border-line pl-3.5 text-[0.8125rem] leading-relaxed text-muted">
              结果按「同时命中两项」和「Level 越低越常见」排序。
              还是不对？多半是第二问选错了 —— 回到上面把「主要作用」换一个。
            </p>
          </>
        )}
      </div>

      {/* 兜底路径 */}
      <div className="mt-12 border-t border-line pt-8">
        <h2 className="text-base font-semibold tracking-tight text-ink">
          它不在结果里？
        </h2>
        <p className="mt-1.5 max-w-[520px] text-[0.875rem] leading-relaxed text-ink2">
          这两条路往往更快。
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <Link
            href="/search"
            className="group flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 card-hover"
          >
            <span>
              <span className="block text-sm font-medium text-ink">
                用口语描述搜
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                「底下弹出来」「一步步填写」这类描述也能搜到
              </span>
            </span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="shrink-0 text-[#C9C5BB] transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href="/compare"
            className="group flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 card-hover"
          >
            <span>
              <span className="block text-sm font-medium text-ink">
                看它和别的有什么区别
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                8 组最常被搞混的 Pattern，附选型规则
              </span>
            </span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="shrink-0 text-[#C9C5BB] transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  step,
  title,
  options,
  value,
  onChange,
}: {
  step: string;
  title: string;
  options: { value: string; label: string; hint: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[0.6875rem] font-semibold text-white"
        >
          {step}
        </span>
        <h2 className="text-[0.9375rem] font-semibold text-ink">{title}</h2>
      </div>

      <div
        role="radiogroup"
        aria-label={title}
        className="grid grid-cols-1 gap-1.5 sm:grid-cols-2"
      >
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(on ? null : o.value)}
              className={`flex min-h-[44px] flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors ${
                on
                  ? 'border-ink bg-[#F2F0EB]'
                  : 'border-line hover:border-[#C9C5BB] hover:bg-[#FCFBF8]'
              }`}
            >
              <span className="text-[0.8125rem] font-medium text-ink">{o.label}</span>
              <span className="mt-0.5 text-2xs leading-snug text-muted">{o.hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function NoResult({
  position,
  job,
  onReset,
}: {
  position: string | null;
  job: string | null;
  onReset: () => void;
}) {
  // 放宽到只匹配其中一个条件，看看是不是选太窄了
  const posOnly = position ? identifyCandidates(position, null, patterns) : [];
  const jobOnly = job ? identifyCandidates(null, job, patterns) : [];

  return (
    <div className="rounded-card border border-dashed border-line px-6 py-12 text-center">
      <p className="text-sm text-ink">这个组合暂时没有对应的 Pattern</p>
      <p className="mx-auto mt-1.5 max-w-[420px] text-xs leading-relaxed text-muted">
        换个说法试试 —— 要么放宽其中一个条件，要么干脆重选。
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#35322C]"
        >
          <RotateCcw size={13} aria-hidden="true" />
          全部重选
        </button>
      </div>

      {(posOnly.length > 0 || jobOnly.length > 0) && (
        <div className="mt-8 border-t border-line pt-6 text-left">
          <p className="meta mb-3">放宽一个条件试试</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {posOnly.length > 0 && (
              <RelaxGroup
                title={`只看「${
                  identifySteps.position.find((s) => s.value === position)?.label
                }」`}
                names={posOnly.map((h) => h.pattern)}
              />
            )}
            {jobOnly.length > 0 && (
              <RelaxGroup
                title={`只看「${
                  identifySteps.job.find((s) => s.value === job)?.label
                }」`}
                names={jobOnly.map((h) => h.pattern)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RelaxGroup({
  title,
  names,
}: {
  title: string;
  names: { id: string; name: string; chineseName: string }[];
}) {
  return (
    <div>
      <p className="meta mb-2">{title}</p>
      <ul className="flex flex-wrap gap-1.5">
        {names.map((p) => (
          <li key={p.id}>
            <Link
              href={`/patterns/${p.id}`}
              className="inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink transition-colors hover:border-[#C9C5BB] hover:bg-[#F5F3EE]"
            >
              <span className="font-medium">{p.name}</span>
              <span className="text-muted">{p.chineseName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
