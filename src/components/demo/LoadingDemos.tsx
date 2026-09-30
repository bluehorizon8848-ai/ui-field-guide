'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, RefreshCw, WifiOff } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';

/* ---------------- Skeleton ---------------- */

function SkeletonCard() {
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-surface p-3">
      <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-[#E9E6DF]" />
      <div className="min-w-0 flex-1 space-y-2 py-0.5">
        <div className="h-3 w-[62%] animate-pulse rounded bg-[#E9E6DF]" />
        <div className="h-2.5 w-[40%] animate-pulse rounded bg-[#F0EDE6]" />
        <div className="h-2.5 w-[28%] animate-pulse rounded bg-[#F0EDE6]" />
      </div>
    </div>
  );
}

function RealCard({ i }: { i: number }) {
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-surface p-3">
      <div
        className="h-14 w-14 shrink-0 rounded-lg"
        style={{
          background: ['#DCE6EF', '#E9E2D4', '#E2EAE4', '#EFE1E1', '#E4E2EF'][i % 5],
        }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 py-0.5">
        <p className="truncate text-[0.8125rem] font-medium text-ink">
          {['IMG_0231 海岸线', 'DSC_4478 城市夜景', 'IMG_0190 房间一角', 'IMG_0155 旧照片'][i % 4]}
        </p>
        <p className="mt-1 text-xs text-muted">
          {['2026-03-12 14:22', '2026-03-08 20:41', '2026-02-27 09:15', '2026-02-14 16:03'][i % 4]}
        </p>
        <p className="mt-1 text-xs text-muted">{['3.2 MB', '4.8 MB', '1.1 MB', '2.6 MB'][i % 4]}</p>
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = () => {
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    // 最短显示 500ms，避免闪烁
    timer.current = setTimeout(() => setLoading(false), 1800);
  };

  useEffect(() => {
    if (loading && !timer.current) {
      timer.current = setTimeout(() => setLoading(false), 1800);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loading]);

  return (
    <DemoStage caption="先看骨架，再看内容 —— 用户在等的时候就已经知道页面长什么样了。点「重新加载」再看一次。">
      <div className="mb-4 flex justify-center">
        <DemoButton variant="secondary" onClick={reload}>
          <RefreshCw size={14} aria-hidden="true" />
          重新加载
        </DemoButton>
      </div>
      <div className="mx-auto w-full max-w-[440px] space-y-2.5" aria-busy={loading}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : Array.from({ length: 4 }).map((_, i) => <RealCard key={i} i={i} />)}
      </div>
    </DemoStage>
  );
}

/* ---------------- Spinner ---------------- */

export function SpinnerDemo() {
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);

  const run = (withSlow: boolean) => {
    setSlow(withSlow);
    setLoading(true);
    setTimeout(() => setLoading(false), withSlow ? 12000 : 900);
  };

  useEffect(() => {
    if (loading && slow) {
      const t = setTimeout(() => setSlow(false), 10);
      return () => clearTimeout(t);
    }
  }, [loading, slow]);

  return (
    <DemoStage caption="转圈只适合「短等待」。超过 10 秒还在转，该给出「重试」而不是让人干等。">
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2.5">
            <DemoButton variant="secondary" onClick={() => run(false)}>
              短加载 (0.9s)
            </DemoButton>
            <DemoButton variant="secondary" onClick={() => run(true)}>
              长加载 (12s)
            </DemoButton>
          </div>
          <DemoButton onClick={() => run(false)} disabled={loading}>
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                处理中…
              </>
            ) : (
              '按钮内加载'
            )}
          </DemoButton>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-2.5 border-t border-line pt-5">
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-[#E6E3DB] border-t-ink"
              role="status"
              aria-label="正在加载相册…"
            />
            {slow ? (
              <div className="text-center">
                <p className="text-xs text-muted">加载较慢</p>
                <button
                  type="button"
                  className="mt-1 text-xs font-medium text-ink underline-offset-4 hover:underline"
                >
                  取消等待
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted">正在加载相册…</p>
            )}
          </div>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Progress Bar ---------------- */

export function ProgressBarDemo() {
  const [p, setP] = useState(0);
  const [running, setRunning] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (mode: 'determinate' | 'indeterminate') => {
    if (timer.current) clearInterval(timer.current);
    setDone(false);
    if (mode === 'indeterminate') {
      setIndeterminate(true);
      setRunning(true);
      timer.current = setInterval(() => {}, 1000);
      return;
    }
    setIndeterminate(false);
    setP(0);
    setRunning(true);
    timer.current = setInterval(() => {
      setP((prev) => {
        if (prev >= 100) {
          if (timer.current) clearInterval(timer.current);
          setRunning(false);
          setDone(true);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 9 + 2);
      });
    }, 220);
  };

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  return (
    <DemoStage caption="知道总量就显示百分比；不知道就别假装有进度，用不确定态。">
      <div className="mx-auto w-full max-w-[400px] space-y-4">
        <div className="flex gap-2.5">
          <DemoButton variant="secondary" onClick={() => start('determinate')}>
            已知总量
          </DemoButton>
          <DemoButton variant="secondary" onClick={() => start('indeterminate')}>
            未知总量
          </DemoButton>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-ink2">
              {indeterminate ? '正在处理…' : done ? '完成' : `已上传 ${((p / 100) * 8).toFixed(1)} MB / 8 MB`}
            </span>
            {!indeterminate && <span className="tabular-nums text-muted">{Math.round(p)}%</span>}
          </div>
          <div
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : Math.round(p)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="上传进度"
            className="h-1.5 w-full overflow-hidden rounded-full bg-[#E6E3DB]"
          >
            {indeterminate ? (
              <div className="h-full w-1/3 animate-indeterminate rounded-full bg-ink" />
            ) : (
              <div
                className={`h-full rounded-full transition-[width] duration-200 ${
                  done ? 'bg-[#2C7355]' : 'bg-ink'
                }`}
                style={{ width: `${p}%` }}
              />
            )}
          </div>
        </div>

        {done && (
          <p className="flex items-center gap-1.5 text-xs text-[#2C7355]">
            <Check size={14} aria-hidden="true" />
            上传完成
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Empty / Error / Success ---------------- */

export function EmptyStateDemo() {
  const [kind, setKind] = useState<'first' | 'filtered' | 'done'>('first');

  const content = {
    first: {
      icon: '📷',
      title: '还没有照片',
      desc: '把手机里的照片导入这里，就能开始分析和清理。',
      action: '导入照片',
    },
    filtered: {
      icon: '🔍',
      title: '没有找到匹配的照片',
      desc: '当前筛选条件下没有结果，试试减少条件或换个关键词。',
      action: '清除全部筛选',
    },
    done: {
      icon: '✨',
      title: '全部清理完成',
      desc: '本次释放了 2.4 GB 空间，收益最大的 12 张重复照片已处理。',
      action: '查看清理报告',
    },
  }[kind];

  return (
    <DemoStage caption="空状态不是「暂无数据」四个字。它要说清：为什么空、现在能做什么。">
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {(
          [
            ['first', '首次使用'],
            ['filtered', '筛选无结果'],
            ['done', '已完成'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              kind === k ? 'bg-ink text-white' : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2.5 py-4 text-center">
        <span className="text-3xl" aria-hidden="true">
          {content.icon}
        </span>
        <p className="text-sm font-semibold text-ink">{content.title}</p>
        <p className="max-w-[280px] text-[0.8125rem] leading-relaxed text-muted">
          {content.desc}
        </p>
        <button
          type="button"
          className="mt-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
        >
          {content.action}
        </button>
      </div>
    </DemoStage>
  );
}

export function ErrorStateDemo() {
  const [kind, setKind] = useState<'network' | 'permission' | 'missing'>('network');

  const content = {
    network: {
      icon: <WifiOff size={26} className="text-muted" aria-hidden="true" />,
      title: '没能加载照片',
      desc: '请检查网络连接后重试。',
      action: '重试',
    },
    permission: {
      icon: <span className="text-3xl" aria-hidden="true">🔒</span>,
      title: '没有相册访问权限',
      desc: '需要访问相册才能扫描重复照片，你可以去系统设置开启。',
      action: '去设置',
    },
    missing: {
      icon: <span className="text-3xl" aria-hidden="true">🕳️</span>,
      title: '这个内容可能已被删除',
      desc: '它可能被移动到了「最近删除」。',
      action: '返回',
    },
  }[kind];

  return (
    <DemoStage caption="错误状态 ≠ 空状态。错误必须说清原因，并给一个能解决问题的按钮。">
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {(
          [
            ['network', '网络失败'],
            ['permission', '权限不足'],
            ['missing', '内容已删'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              kind === k ? 'bg-ink text-white' : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="alert"
        className="flex flex-col items-center gap-2.5 py-4 text-center"
      >
        {content.icon}
        <p className="text-sm font-semibold text-ink">{content.title}</p>
        <p className="max-w-[300px] text-[0.8125rem] leading-relaxed text-muted">
          {content.desc}
        </p>
        <button
          type="button"
          className="mt-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
        >
          {content.action}
        </button>
        <details className="mt-1 text-xs text-muted">
          <summary className="cursor-pointer underline-offset-4 hover:underline">
            详细信息
          </summary>
          <p className="mt-1 font-mono text-[11px]">HTTP 503 · upstream timeout</p>
        </details>
      </div>
    </DemoStage>
  );
}

export function SuccessStateDemo() {
  return (
    <DemoStage caption="完成一个流程值得一个专属页面：确认 + 展示成果 + 下一步。">
      <div className="flex flex-col items-center gap-2.5 py-4 text-center">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F2EC] text-[#2C7355]"
          aria-hidden="true"
        >
          <Check size={24} strokeWidth={2.5} />
        </span>
        <p className="text-base font-semibold text-ink">发布成功</p>
        <p className="max-w-[280px] text-[0.8125rem] leading-relaxed text-muted">
          你的内容已经上线，所有人都能看到。
        </p>

        <div className="mt-2 w-full max-w-[260px] rounded-xl border border-line bg-[#FCFBF8] p-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-[#E2EAE4]" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink">海岸线的一天</p>
              <p className="mt-0.5 text-[11px] text-muted">刚刚 · 128 次浏览</p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex gap-2.5">
          <button
            type="button"
            className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-ink transition-colors hover:bg-[#F5F3EE]"
          >
            回到首页
          </button>
          <button
            type="button"
            className="rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
          >
            查看
          </button>
        </div>
      </div>
    </DemoStage>
  );
}
