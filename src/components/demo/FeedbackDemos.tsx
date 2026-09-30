'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Info, RefreshCw, Undo2, X } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';

/* ---------------- Toast ---------------- */

export function ToastDemo() {
  const [toast, setToast] = useState<{ id: number; msg: string; ok: boolean } | null>(
    null
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const show = (ok: boolean) => {
    // 重复触发时替换而非堆叠
    setToast({ id: Date.now(), msg: ok ? '照片已保存' : '保存失败，请重试', ok });
  };

  return (
    <DemoStage caption="点按钮看提示浮出顶部，3 秒后自动消失。它没有按钮 —— 需要按钮就该用 Snackbar。">
      <div className="flex flex-col items-center justify-center gap-3 pt-8">
        <div className="flex gap-2.5">
          <DemoButton variant="secondary" onClick={() => show(true)}>
            <Check size={15} aria-hidden="true" />
            模拟保存成功
          </DemoButton>
          <DemoButton variant="secondary" onClick={() => show(false)}>
            <X size={15} aria-hidden="true" />
            模拟失败
          </DemoButton>
        </div>
      </div>

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-ink px-3.5 py-2.5 text-white shadow-pop animate-toast-in"
        >
          {toast.ok ? (
            <Check size={15} className="shrink-0" aria-hidden="true" />
          ) : (
            <X size={15} className="shrink-0" aria-hidden="true" />
          )}
          <span className="whitespace-nowrap text-[0.8125rem]">{toast.msg}</span>
        </div>
      )}
    </DemoStage>
  );
}

/* ---------------- Snackbar ---------------- */

export function SnackbarDemo() {
  const [snack, setSnack] = useState<{ msg: string; undone: boolean } | null>(null);
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!snack) return;
    if (snack.undone) return;
    const t = setTimeout(() => setSnack(null), 6000);
    return () => clearTimeout(t);
  }, [snack]);

  return (
    <DemoStage caption="删除后底部出现带「撤销」的提示条。注意它和 Toast 的区别：多了一个可以点的东西。">
      <div className="flex flex-col items-center justify-center gap-3">
        <DemoButton
          variant="secondary"
          onClick={() => {
            setCount((c) => c - 1);
            setSnack({ msg: `已删除 1 张照片（剩余 ${count - 1} 张）`, undone: false });
          }}
          disabled={count === 0}
        >
          删除一张照片
        </DemoButton>
        <p className="text-xs text-muted">当前：{count} 张</p>
      </div>

      {snack && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-x-4 bottom-4 z-10 mx-auto flex max-w-[360px] items-center justify-between gap-3 rounded-lg bg-ink px-3.5 py-2.5 text-white shadow-pop animate-snack-in"
        >
          <span className="text-[0.8125rem]">{snack.msg}</span>
          <button
            type="button"
            onClick={() => {
              setCount((c) => c + 1);
              setSnack(null);
            }}
            className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-[0.8125rem] font-semibold text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            <Undo2 size={13} aria-hidden="true" />
            撤销
          </button>
        </div>
      )}
    </DemoStage>
  );
}

/* ---------------- Alert ---------------- */

export function AlertDemo() {
  const [alert, setAlert] = useState(true);

  return (
    <DemoStage caption="注意它不会自动消失，也不会自动收起 —— 因为用户必须处理这个问题。">
      <div className="mx-auto w-full max-w-[460px] space-y-3">
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border-l-[3px] border-[#A8342C] bg-[#FAEDEC] py-3 pl-3.5 pr-3.5"
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#A8342C]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-semibold text-[#7A241F]">邮箱已被注册</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#7A241F]/85">
              换个邮箱地址，或直接登录已有账号。
            </p>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setAlert(false)}
                className="text-xs font-semibold text-[#7A241F] underline-offset-4 hover:underline"
              >
                去登录
              </button>
              <button
                type="button"
                onClick={() => setAlert(false)}
                className="text-xs font-semibold text-[#7A241F] underline-offset-4 hover:underline"
              >
                换个邮箱
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border-l-[3px] border-[#94701C] bg-[#F8F2E4] py-3 pl-3.5 pr-3.5">
          <Info size={16} className="mt-0.5 shrink-0 text-[#94701C]" aria-hidden="true" />
          <p className="text-[0.8125rem] leading-relaxed text-[#6B520F]">
            你的云备份已满，清理后可以继续备份。
          </p>
        </div>

        {!alert && (
          <button
            type="button"
            onClick={() => setAlert(true)}
            className="w-full rounded-lg border border-dashed border-line py-3 text-xs text-muted transition-colors hover:border-[#C9C5BB] hover:text-ink2"
          >
            重新显示红色 Alert
          </button>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Banner ---------------- */

export function BannerDemo() {
  const [hidden, setHidden] = useState(false);

  return (
    <DemoStage caption="通栏的全局消息。Banner 是「整个应用都受影响」时用的，比如断网。">
      <div className="-m-5 -mt-7 sm:-m-7 sm:-mt-7">
        {!hidden ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 bg-[#F8F2E4] px-4 py-2.5"
          >
            <Info size={15} className="shrink-0 text-[#94701C]" aria-hidden="true" />
            <p className="text-[0.8125rem] text-[#6B520F]">
              网络连接已断开，内容可能不是最新的
            </p>
            <button
              type="button"
              className="shrink-0 text-xs font-semibold text-[#6B520F] underline-offset-4 hover:underline"
            >
              重试
            </button>
            <button
              type="button"
              onClick={() => setHidden(true)}
              aria-label="关闭提示"
              className="shrink-0 rounded p-1 text-[#6B520F] transition-colors hover:bg-black/5"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setHidden(false)}
            className="w-full border-b border-dashed border-line py-2.5 text-xs text-muted transition-colors hover:text-ink2"
          >
            重新显示 Banner
          </button>
        )}
        <div className="grid-lines flex h-24 items-center justify-center bg-[#FCFBF8]">
          <p className="text-xs text-muted">页面内容在这里</p>
        </div>
      </div>
    </DemoStage>
  );
}
