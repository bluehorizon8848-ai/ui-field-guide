'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { identifyCandidates, identifySteps } from '@/data/search';
import type { IdentifyOption } from '@/data/search';
import { localizePatterns } from '@/data/i18n/resolve';
import { categoryMap } from '@/data/categories';
import { MiniPreview } from '@/components/patterns/MiniPreview';
import { useLocale, useHref } from '@/components/layout/LocaleProvider';
import type { Position, Job } from '@/data/types';
import { t, type UIKey } from '@/lib/ui-strings';
import type { Locale } from '@/lib/i18n';

/**
 * 两问的选项文案。
 *
 * label / hint 原本硬编码在 data/search.ts 的 identifySteps 里，只有中文。
 * 那份数据不能改（它同时是词条的 position / job 字段来源），所以这里按枚举值
 * 建两张映射表，标签与提示改从词典取。
 *
 * 用 Record<Position, UIKey> 而不是 Record<string, ...>：
 * 前者缺一个枚举值就编译不过，后者漏了要等运行时才发现。
 */
const POS_LABEL: Record<Position, UIKey> = {
  top: 'identify.pos.top.label',
  bottom: 'identify.pos.bottom.label',
  center: 'identify.pos.center.label',
  floating: 'identify.pos.floating.label',
  overlay: 'identify.pos.overlay.label',
  side: 'identify.pos.side.label',
  inline: 'identify.pos.inline.label',
};

const POS_HINT: Record<Position, UIKey> = {
  top: 'identify.pos.top.hint',
  bottom: 'identify.pos.bottom.hint',
  center: 'identify.pos.center.hint',
  floating: 'identify.pos.floating.hint',
  overlay: 'identify.pos.overlay.hint',
  side: 'identify.pos.side.hint',
  inline: 'identify.pos.inline.hint',
};

const JOB_LABEL: Record<Job, UIKey> = {
  navigate: 'identify.job.navigate.label',
  select: 'identify.job.select.label',
  input: 'identify.job.input.label',
  inform: 'identify.job.inform.label',
  expand: 'identify.job.expand.label',
  status: 'identify.job.status.label',
  create: 'identify.job.create.label',
  confirm: 'identify.job.confirm.label',
};

const JOB_HINT: Record<Job, UIKey> = {
  navigate: 'identify.job.navigate.hint',
  select: 'identify.job.select.hint',
  input: 'identify.job.input.hint',
  inform: 'identify.job.inform.hint',
  expand: 'identify.job.expand.hint',
  status: 'identify.job.status.hint',
  create: 'identify.job.create.hint',
  confirm: 'identify.job.confirm.hint',
};

/**
 * 两问的选项 + 标签回显，一次算完。
 *
 * 返回的 posLabel / jobLabel 用于「按 X 筛选」「只看 X」这类把选中项
 * 显示回给用户的地方；value 原样保留，因为它要和词条的 position / job 字段对得上。
 */
function useIdentifyOptions() {
  const locale = useLocale();

  return useMemo(() => {
    const build = (
      steps: IdentifyOption[],
      labelMap: Record<Position & Job, UIKey>,
      hintMap: Record<Position & Job, UIKey>
    ) =>
      steps.map((o) => {
        const v = o.value as Position & Job;
        return { value: o.value, label: t(locale, labelMap[v]), hint: t(locale, hintMap[v]) };
      });

    const posOptions = build(identifySteps.position, POS_LABEL, POS_HINT);
    const jobOptions = build(identifySteps.job, JOB_LABEL, JOB_HINT);

    const pos = new Map(posOptions.map((o) => [o.value, o.label]));
    const job = new Map(jobOptions.map((o) => [o.value, o.label]));

    return {
      posOptions,
      jobOptions,
      posLabel: (v: string | null) => (v ? pos.get(v) : undefined),
      jobLabel: (v: string | null) => (v ? job.get(v) : undefined),
    };
  }, [locale]);
}

/**
 * identifyCandidates 里的 reasons 是用中文标签拼出来的（「位置：页面底部」），
 * 属于数据层产物。这里按同样的前缀反查回枚举值，换成当前语言的文案，
 * 避免为了翻译去改 data/search.ts。
 */
function useReasonFormatter() {
  const locale = useLocale();
  const { posLabel, jobLabel } = useIdentifyOptions();

  return useMemo(() => {
    const map = new Map<string, string>();
    for (const o of identifySteps.position) {
      map.set(
        `位置：${o.label}`,
        t(locale, 'identify.reasonPosition', { v: posLabel(o.value) ?? '' })
      );
    }
    for (const o of identifySteps.job) {
      map.set(`作用：${o.label}`, t(locale, 'identify.reasonJob', { v: jobLabel(o.value) ?? '' }));
    }
    return (reason: string) => map.get(reason) ?? reason;
  }, [locale, posLabel, jobLabel]);
}

export function IdentifyClient() {
  const locale = useLocale();
  const h = useHref();
  const [position, setPosition] = useState<string | null>(null);
  const [job, setJob] = useState<string | null>(null);

  const { posOptions, jobOptions, posLabel, jobLabel } = useIdentifyOptions();
  const formatReason = useReasonFormatter();

  const answered = position !== null || job !== null;

  /**
   * 筛选跑在中文源数据上（identifyCandidates 内部要按中文标签拼 reasons），
   * 但渲染要用本地化版本，否则英文页结果卡片会露出中文 oneLine。
   * reasons 里的中文由 useReasonFormatter 反查枚举换成当前语言，不用动数据层。
   */
  const hits = useMemo(() => {
    if (!answered) return [];
    const raw = identifyCandidates(position, job, patterns);
    const byId = new Map(localizePatterns(patterns, locale).map((p) => [p.id, p]));
    return raw.map((hit) => ({
      ...hit,
      pattern: byId.get(hit.pattern.id) ?? hit.pattern,
    }));
  }, [position, job, answered, locale]);

  const shownPosLabel = posLabel(position);
  const shownJobLabel = jobLabel(job);

  return (
    <div>
      {/* 两个问题，上下两张卡 */}
      <div className="grid gap-3 lg:grid-cols-2">
        <QuestionCard
          step="1"
          title={t(locale, 'identify.qTitle')}
          options={posOptions}
          value={position}
          onChange={setPosition}
        />
        <QuestionCard
          step="2"
          title={t(locale, 'identify.qJob')}
          options={jobOptions}
          value={job}
          onChange={setJob}
        />
      </div>

      {/* 结果 */}
      <div className="mt-8" aria-live="polite">
        {!answered ? (
          <div className="rounded-card border border-dashed border-line px-6 py-16 text-center">
            <p className="text-sm text-ink2">{t(locale, 'identify.emptyHint')}</p>
            <p className="mt-1.5 text-xs text-muted">{t(locale, 'identify.emptyHintSub')}</p>
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
                {hits.length === 1
                  ? t(locale, 'identify.resultOne')
                  : t(locale, 'identify.resultCount', { n: hits.length })}
              </p>
              {(shownPosLabel || shownJobLabel) && (
                <span className="text-xs text-muted">
                  {t(locale, 'identify.filteredBy', {
                    v: [shownPosLabel, shownJobLabel].filter(Boolean).join(' + '),
                  })}
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
                {t(locale, 'identify.again')}
              </button>
            </div>

            <ul className="space-y-2">
              {hits.map((hit) => {
                const cat = categoryMap[hit.pattern.category];
                return (
                  <li key={hit.pattern.id}>
                    <Link
                      href={h(`/patterns/${hit.pattern.id}`)}
                      className="group flex gap-3.5 rounded-card border border-line bg-surface p-3.5 card-hover"
                    >
                      <span className="h-[76px] w-[104px] shrink-0 overflow-hidden rounded-lg border border-line bg-[#FCFBF8]">
                        <MiniPreview id={hit.pattern.id} />
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
                            {t(locale, 'card.level')} {hit.pattern.level}
                          </span>
                        </span>

                        <span className="mt-1.5 block text-[0.9375rem] font-semibold leading-snug text-ink">
                          {hit.pattern.name}
                          <span className="ml-1.5 text-xs font-normal text-muted">
                            {hit.pattern.chineseName}
                          </span>
                        </span>

                        <span className="mt-1.5 block line-clamp-2 text-[0.8125rem] leading-relaxed text-ink2">
                          {hit.pattern.oneLine}
                        </span>

                        <span className="mt-2 flex flex-wrap items-center gap-1.5">
                          {hit.reasons.map((r) => (
                            <span
                              key={r}
                              className="rounded bg-[#F2F0EB] px-1.5 py-0.5 text-2xs text-ink2"
                            >
                              {formatReason(r)}
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
              {t(locale, 'identify.sortNote')}
            </p>
          </>
        )}
      </div>

      {/* 兜底路径 */}
      <div className="mt-12 border-t border-line pt-8">
        <h2 className="text-base font-semibold tracking-tight text-ink">
          {t(locale, 'identify.fallbackTitle')}
        </h2>
        <p className="mt-1.5 max-w-[520px] text-[0.875rem] leading-relaxed text-ink2">
          {t(locale, 'identify.fallbackSub')}
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <Link
            href={h('/search')}
            className="group flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 card-hover"
          >
            <span>
              <span className="block text-sm font-medium text-ink">
                {t(locale, 'identify.fallbackSearch')}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                {t(locale, 'identify.fallbackSearchSub')}
              </span>
            </span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="shrink-0 text-[#C9C5BB] transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href={h('/compare')}
            className="group flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 card-hover"
          >
            <span>
              <span className="block text-sm font-medium text-ink">
                {t(locale, 'identify.fallbackCompare')}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                {t(locale, 'identify.fallbackCompareSub')}
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
  const locale = useLocale();
  const h = useHref();
  const { posLabel, jobLabel } = useIdentifyOptions();

  // 放宽到只匹配其中一个条件，看看是不是选太窄了
  const posOnly = position ? identifyCandidates(position, null, patterns) : [];
  const jobOnly = job ? identifyCandidates(null, job, patterns) : [];

  return (
    <div className="rounded-card border border-dashed border-line px-6 py-12 text-center">
      <p className="text-sm text-ink">{t(locale, 'identify.noneCombo')}</p>
      <p className="mx-auto mt-1.5 max-w-[420px] text-xs leading-relaxed text-muted">
        {t(locale, 'identify.noneComboHint')}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#35322C]"
        >
          <RotateCcw size={13} aria-hidden="true" />
          {t(locale, 'identify.resetAll')}
        </button>
      </div>

      {(posOnly.length > 0 || jobOnly.length > 0) && (
        <div className="mt-8 border-t border-line pt-6 text-left">
          <p className="meta mb-3">{t(locale, 'identify.relaxTitle')}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {posOnly.length > 0 && (
              <RelaxGroup
                title={t(locale, 'identify.relaxOnly', { v: posLabel(position) ?? '' })}
                patterns={posOnly.map((hit) => hit.pattern)}
              />
            )}
            {jobOnly.length > 0 && (
              <RelaxGroup
                title={t(locale, 'identify.relaxOnly', { v: jobLabel(job) ?? '' })}
                patterns={jobOnly.map((hit) => hit.pattern)}
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
  patterns: list,
}: {
  title: string;
  patterns: { id: string; name: string; chineseName: string }[];
}) {
  const h = useHref();

  return (
    <div>
      <p className="meta mb-2">{title}</p>
      <ul className="flex flex-wrap gap-1.5">
        {list.map((p) => (
          <li key={p.id}>
            <Link
              href={h(`/patterns/${p.id}`)}
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