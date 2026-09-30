'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  Bold,
  ChevronDown,
  Copy,
  FileText,
  Italic,
  Plus,
  RotateCcw,
  Search,
  Share2,
  Star,
  Trash2,
  Undo2,
} from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';

/* ---------------- Button ---------------- */

export function ButtonDemo() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    }, 1100);
  };

  return (
    <DemoStage caption="点「保存」：按钮会进入 loading 并禁用。文案用动词，不用「确定」。">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2.5">
          <DemoButton variant="secondary" disabled={saving}>
            取消
          </DemoButton>
          <DemoButton onClick={save} disabled={saving} aria-busy={saving} className="min-w-[104px]">
            {saving && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {saving ? '保存中…' : '保存'}
          </DemoButton>
        </div>
        <p className="text-xs text-muted" role="status" aria-live="polite">
          {saving ? '正在写入…' : saved ? '已保存到相册' : '试试禁用态：'}{' '}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => setSaving((v) => !v)}
            disabled={saved}
          >
            {saving ? '取消禁用' : '手动禁用'}
          </button>
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- CTA ---------------- */

export function CtaDemo() {
  const [clicked, setClicked] = useState(false);

  return (
    <DemoStage caption="整页只有这一个按钮是深色实心的 —— 它就是「你希望用户做的事」。">
      <div className="mx-auto w-full max-w-[360px] rounded-xl border border-line bg-[#FCFBF8] p-6 text-center">
        <p className="text-base font-semibold text-ink">开始整理你的相册</p>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
          扫描、找出重复照片，一键释放空间。
        </p>
        <button
          type="button"
          onClick={() => setClicked(true)}
          className="mt-5 h-[52px] w-full rounded-lg bg-ink text-[0.9375rem] font-medium text-white transition-colors hover:bg-[#35322C] active:bg-[#0D0C0B]"
        >
          免费开始使用
        </button>
        <p className="mt-2 text-xs text-muted">无需信用卡 · 不上传照片</p>
        {clicked && (
          <p className="mt-2 text-xs text-[#2C7355]" role="status">
            这是页面上唯一的 CTA —— 别的按钮都不会长这样。
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Icon Button + Tooltip ---------------- */

export function IconButtonDemo() {
  return (
    <DemoStage caption="悬停（或用 Tab 聚焦）任意图标，会出现 Tooltip。图标按钮必须配它，否则用户不知道是什么。">
      <div className="flex flex-wrap items-center justify-center gap-1">
        {[
          { icon: Bold, label: '加粗' },
          { icon: Italic, label: '斜体' },
          { icon: Copy, label: '复制' },
          { icon: Search, label: '搜索' },
          { icon: Share2, label: '分享' },
        ].map(({ icon: Icon, label }) => (
          <IconButtonWithTooltip key={label} icon={<Icon size={18} />} label={label} />
        ))}
        <span className="mx-2 hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
        <IconButtonWithTooltip
          icon={<Trash2 size={18} />}
          label="删除"
          danger
        />
      </div>
    </DemoStage>
  );
}

function IconButtonWithTooltip({
  icon,
  label,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = `tip-${label}`;

  const enter = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(true), 400);
  };
  const leave = () => {
    if (timer.current) clearTimeout(timer.current);
    setShow(false);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-describedby={show ? id : undefined}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={() => setShow(true)}
        onBlur={leave}
        onKeyDown={(e) => e.key === 'Escape' && setShow(false)}
        className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
          danger
            ? 'text-[#A8342C] hover:bg-[#FAEDEC]'
            : 'text-ink2 hover:bg-[#F2F0EB] hover:text-ink'
        }`}
      >
        {icon}
      </button>
      {show && (
        <span
          id={id}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-2xs text-white shadow-pop animate-fade-in"
        >
          {label}
        </span>
      )}
    </span>
  );
}

/* ---------------- FAB ---------------- */

export function FabDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DemoStage caption="它一直浮在右下角，不随内容滚走 —— 无论你在多深的页面都能「新建」。">
      <div className="relative h-[240px] rounded-lg border border-dashed border-line bg-[#FCFBF8]">
        <p className="p-4 text-xs text-muted">页面内容（可以滚很长）</p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="新建相册"
          aria-expanded={open}
          className="absolute bottom-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-[0_4px_12px_rgba(26,25,23,0.22)] transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={24} aria-hidden="true" className={open ? 'rotate-45 transition-transform' : 'transition-transform'} />
        </button>
        {open && (
          <div className="absolute bottom-20 right-4 z-10 w-40 rounded-lg border border-line bg-surface p-1.5 shadow-pop animate-rise-in">
            {['新建相册', '导入照片', '新建拼图'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-md px-2.5 py-2 text-left text-[0.8125rem] text-ink2 transition-colors hover:bg-[#F5F3EE]"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Split Button ---------------- */

export function SplitButtonDemo() {
  const [mode, setMode] = useState<'menu' | 'pasted'>('menu');
  const [open, setOpen] = useState(false);

  return (
    <DemoStage caption="左边是默认动作，右边才是下拉。点左边直接执行，点右边看变体。">
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex">
          <button
            type="button"
            onClick={() => {
              setMode('pasted');
              setOpen(false);
            }}
            className="flex min-h-[38px] items-center gap-1.5 rounded-l-lg bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-[#35322C]"
          >
            <Copy size={15} aria-hidden="true" />
            粘贴
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="更多粘贴选项"
            className="flex min-h-[38px] items-center rounded-r-lg border-l border-white/25 bg-ink px-2.5 text-white transition-colors hover:bg-[#35322C]"
          >
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </div>

        {open && (
          <ul
            role="menu"
            className="w-56 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in"
          >
            {[
              { icon: Copy, label: '保留源格式' },
              { icon: FileText, label: '只保留文本' },
              { icon: Star, label: '粘贴为纯文本' },
            ].map(({ icon: Icon, label }) => (
              <li key={label}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMode('pasted');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.8125rem] text-ink2 transition-colors hover:bg-[#F5F3EE]"
                >
                  <Icon size={14} aria-hidden="true" className="text-muted" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-muted" role="status" aria-live="polite">
          {mode === 'menu' ? '还没执行任何操作' : '已粘贴（默认格式）'}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Destructive Action ---------------- */

export function DestructiveActionDemo() {
  const [items, setItems] = useState(12);
  const [confirming, setConfirming] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  useEffect(() => {
    if (!snack) return;
    const t = setTimeout(() => setSnack(null), 5500);
    return () => clearTimeout(t);
  }, [snack]);

  return (
    <DemoStage caption="注意这个三件套：低调的红字 → 后果明确的确认 → 删除后还有撤销。">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">最近删除</p>
              <p className="mt-0.5 text-xs text-muted">{items} 项待清理</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={items === 0}
              className="rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium text-[#A8342C] transition-colors hover:bg-[#FAEDEC] disabled:opacity-40"
            >
              全部清除
            </button>
          </div>
        </div>

        {confirming && (
          <div className="mt-3 rounded-xl border border-line bg-surface p-4 shadow-lift animate-rise-in">
            <p className="text-sm font-semibold text-ink">清除全部 {items} 项？</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink2">
              这些内容将被永久删除，无法恢复。
            </p>
            <div className="mt-4 flex justify-end gap-2.5">
              <DemoButton
                variant="secondary"
                onClick={() => setConfirming(false)}
                autoFocus
              >
                取消
              </DemoButton>
              <DemoButton
                variant="danger"
                onClick={() => {
                  const n = items;
                  setItems(0);
                  setConfirming(false);
                  setSnack(`已清除 ${n} 项`);
                }}
              >
                永久删除
              </DemoButton>
            </div>
          </div>
        )}

        {snack && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2.5rem)] max-w-[340px] -translate-x-1/2 items-center justify-between gap-3 rounded-lg bg-ink px-3.5 py-2.5 text-white shadow-pop animate-snack-in"
          >
            <span className="text-[0.8125rem]">{snack}</span>
            <button
              type="button"
              onClick={() => {
                setItems(12);
                setSnack(null);
              }}
              className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-[0.8125rem] font-semibold underline-offset-4 hover:underline"
            >
              <Undo2 size={13} aria-hidden="true" />
              撤销
            </button>
          </div>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- File Upload ---------------- */

export function FileUploadDemo() {
  const [files, setFiles] = useState<
    { name: string; size: string; progress: number; status: 'uploading' | 'done' | 'error' }[]
  >([]);

  const simulate = (fail: boolean) => {
    setFiles([
      { name: 'IMG_0231.jpg', size: '3.2 MB', progress: 0, status: 'uploading' },
    ]);
    let p = 0;
    const t = setInterval(() => {
      p += 18;
      if (p >= 100) {
        clearInterval(t);
        setFiles((prev) =>
          prev.map((f) => ({ ...f, progress: 100, status: fail ? 'error' : 'done' }))
        );
        return;
      }
      setFiles((prev) => prev.map((f) => ({ ...f, progress: p })));
    }, 260);
  };

  return (
    <DemoStage caption="上传不只是「选个文件」—— 进度、取消、失败重试才是真正的体验。">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="rounded-xl border-2 border-dashed border-[#D8D5CD] bg-[#FCFBF8] p-6 text-center transition-colors hover:border-[#C9C5BB]">
          <ArrowDownToLine size={20} className="mx-auto text-muted" aria-hidden="true" />
          <p className="mt-2.5 text-sm text-ink">点击选择或拖拽文件到此处</p>
          <p className="mt-1 text-xs text-muted">JPG / PNG · 单张不超过 10MB</p>
          <div className="mt-3 flex justify-center gap-2">
            <DemoButton variant="secondary" onClick={() => simulate(false)}>
              模拟成功
            </DemoButton>
            <DemoButton variant="secondary" onClick={() => simulate(true)}>
              模拟失败
            </DemoButton>
          </div>
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((f) => (
              <li key={f.name} className="rounded-lg border border-line bg-surface p-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 shrink-0 rounded-md bg-[#DCE6EF]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] text-ink">{f.name}</p>
                    <p className="text-xs text-muted">{f.size}</p>
                  </div>
                  {f.status === 'uploading' && (
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="text-xs text-muted underline-offset-4 hover:underline"
                    >
                      取消
                    </button>
                  )}
                  {f.status === 'done' && (
                    <span className="text-xs text-[#2C7355]">已完成</span>
                  )}
                  {f.status === 'error' && (
                    <button
                      type="button"
                      onClick={() => simulate(false)}
                      className="text-xs font-medium text-[#A8342C] underline-offset-4 hover:underline"
                    >
                      <RotateCcw size={11} className="mr-0.5 inline" aria-hidden="true" />
                      重试
                    </button>
                  )}
                </div>
                {f.status === 'uploading' && (
                  <div
                    role="progressbar"
                    aria-valuenow={f.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#E6E3DB]"
                  >
                    <div
                      className="h-full rounded-full bg-ink transition-[width] duration-200"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
                {f.status === 'error' && (
                  <p className="mt-2 text-xs text-[#A8342C]">上传失败：网络中断</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DemoStage>
  );
}
