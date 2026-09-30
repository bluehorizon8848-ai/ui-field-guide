'use client';

import { useId, useRef, useState } from 'react';
import { Check, ChevronDown, Minus, Plus, Search, X } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';

/* ---------------- Text Field ---------------- */

export function TextFieldDemo() {
  const [value, setValue] = useState('photo@');
  const [touched, setTouched] = useState(false);
  const uid = useId();
  const fieldId = `${uid}-email`;
  const helpId = `${uid}-help`;
  const valid = /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(value);

  return (
    <DemoStage caption="失焦时才校验 —— 不是每敲一个键就报红。错误文案要说「怎么改」。">
      <div className="mx-auto w-full max-w-[380px]">
        <label htmlFor={fieldId} className="mb-1.5 block text-sm text-ink2">
          邮箱
        </label>
        <input
          id={fieldId}
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@example.com"
          aria-invalid={touched && !valid}
          aria-describedby={helpId}
          className={`h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)] ${
            touched && !valid ? 'border-[#A8342C]' : 'border-line'
          }`}
        />
        <p
          id={helpId}
          className={`mt-1.5 text-[0.8125rem] ${
            touched && !valid ? 'text-[#A8342C]' : 'text-muted'
          }`}
          role={touched && !valid ? 'alert' : undefined}
        >
          {touched && !valid
            ? '需要包含 @ 的完整邮箱地址，例如 you@example.com'
            : '用于接收清理报告，不会对外公开'}
        </p>
        {touched && valid && (
          <p className="mt-1 flex items-center gap-1 text-[0.8125rem] text-[#2C7355]">
            <Check size={13} aria-hidden="true" />
            格式正确
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Text Area ---------------- */

export function TextAreaDemo() {
  const [text, setText] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const taId = useId();
  const MAX = 300;

  const autoGrow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, 320);
    el.style.height = `${Math.max(next, 96)}px`;
  };

  return (
    <DemoStage caption="输入越多框越长（上限 320px），右下角实时显示字数。">
      <div className="mx-auto w-full max-w-[400px]">
        <label htmlFor={taId} className="mb-1.5 block text-sm text-ink2">
          评论
        </label>
        <textarea
          id={taId}
          ref={ref}
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, MAX));
            autoGrow();
          }}
          rows={4}
          placeholder="说点什么，比如这张照片哪里拍得好…"
          className="w-full resize-y rounded-lg border border-line bg-surface px-3.5 py-3 text-sm leading-relaxed text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-muted">支持换行</span>
          <span
            className={`text-xs tabular-nums ${
              text.length > 280 ? 'text-[#94701C]' : 'text-muted'
            }`}
          >
            {text.length} / {MAX}
          </span>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Search Field ---------------- */

const SUGGESTIONS = ['海边', '夜景', '人像', '文件'];

export function SearchFieldDemo() {
  const [q, setQ] = useState('');
  const results = SUGGESTIONS.filter((s) => s.includes(q.trim()));

  return (
    <DemoStage caption="点一下输入框试试 —— 会实时出结果，并显示热门搜索标签。">
      <div className="mx-auto w-full max-w-[400px]">
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索照片"
            aria-label="搜索照片"
            className="h-11 w-full rounded-full border border-line bg-[#F5F3EE] pl-9 pr-9 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:bg-surface focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label="清除搜索"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-black/5 hover:text-ink"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {q.trim() === '' ? (
          <div className="mt-4">
            <p className="meta mb-2">热门搜索</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQ(s)}
                  className="rounded-full bg-[#F2F0EB] px-3 py-1.5 text-xs text-ink2 transition-colors hover:bg-[#E9E6DF]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <ul className="mt-3 space-y-0.5">
            {results.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  onClick={() => setQ(r)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-ink transition-colors hover:bg-[#F7F5F0]"
                >
                  <Search size={14} className="text-muted" aria-hidden="true" />
                  {r}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-line px-4 py-4 text-center">
            <p className="text-[0.8125rem] text-muted">没有找到「{q}」相关内容</p>
            <button
              type="button"
              onClick={() => setQ('')}
              className="mt-1.5 text-xs font-medium text-ink underline-offset-4 hover:underline"
            >
              清除搜索
            </button>
          </div>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Checkbox ---------------- */

const TODO = ['清理重复照片', '导出 2024 备份', '检查超大文件'];

export function CheckboxDemo() {
  const [checked, setChecked] = useState<string[]>([TODO[0]]);
  const all = checked.length === TODO.length;
  const some = checked.length > 0 && !all;

  const toggle = (t: string) => {
    setChecked((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  return (
    <DemoStage caption="注意「全选」框支持半选态（横线）。整行文字都可以点。">
      <div className="mx-auto w-full max-w-[400px]">
        <div className="overflow-hidden rounded-xl border border-line">
          <label className="flex cursor-pointer items-center gap-3 border-b border-line bg-[#FCFBF8] px-4 py-3">
            <Checkbox checked={all} indeterminate={some} onChange={() =>
              setChecked(all ? [] : [...TODO])
            } />
            <span className="flex-1 text-sm font-medium text-ink">全选</span>
            <span className="text-xs tabular-nums text-muted">已选 {checked.length}</span>
          </label>
          {TODO.map((t) => (
            <label
              key={t}
              className="flex cursor-pointer items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 hover:bg-[#F7F5F0]"
            >
              <Checkbox checked={checked.includes(t)} onChange={() => toggle(t)} />
              <span className="flex-1 text-sm text-ink">{t}</span>
            </label>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  if (ref.current) ref.current.indeterminate = !!indeterminate;
  return (
    <span className="relative flex h-[18px] w-[18px] shrink-0">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer h-full w-full cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-[#C9C5BB] bg-surface transition-colors checked:border-ink checked:bg-ink indeterminate:border-ink indeterminate:bg-ink"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white peer-checked:opacity-100 peer-indeterminate:opacity-100">
        {indeterminate ? (
          <span className="h-[1.5px] w-2.5 rounded-full bg-white" />
        ) : (
          <Check size={12} strokeWidth={3.5} className="opacity-0 peer-checked:opacity-100" />
        )}
      </span>
    </span>
  );
}

/* ---------------- Radio ---------------- */

export function RadioDemo() {
  const [v, setV] = useState('personal');

  const OPTIONS = [
    { id: 'personal', t: '个人使用', d: '只有自己能管理这些数据' },
    { id: 'team', t: '小团队', d: '最多 5 人共享，按成员分配' },
  ];

  return (
    <DemoStage caption="选项互斥，整行可点。用 ↑ ↓ 键可以在选项间移动。">
      <fieldset className="mx-auto w-full max-w-[400px]">
        <legend className="mb-2 text-sm text-ink2">账户类型</legend>
        <div className="space-y-1.5">
          {OPTIONS.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors ${
                v === o.id
                  ? 'border-ink bg-[#F7F5F0]'
                  : 'border-line hover:bg-[#F7F5F0]'
              }`}
            >
              <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0">
                <input
                  type="radio"
                  name="demo-account"
                  value={o.id}
                  checked={v === o.id}
                  onChange={() => setV(o.id)}
                  className="peer h-full w-full cursor-pointer appearance-none rounded-full border-[1.5px] border-[#C9C5BB] bg-surface transition-colors checked:border-ink"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span
                    className={`h-2 w-2 scale-0 rounded-full bg-ink transition-transform peer-checked:scale-100`}
                  />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{o.t}</span>
                <span className="mt-0.5 block text-xs text-muted">{o.d}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </DemoStage>
  );
}

/* ---------------- Switch ---------------- */

const SWITCHES = [
  { id: 'dark', t: '深色模式', d: '跟随系统或手动指定' },
  { id: 'autoplay', t: '自动播放视频', d: '在 Wi-Fi 下自动播放' },
  { id: 'sync', t: 'iCloud 同步', d: '在设备间同步清理记录' },
];

export function SwitchDemo() {
  const [state, setState] = useState<Record<string, boolean>>({
    dark: true,
    autoplay: false,
    sync: true,
  });
  const [toast, setToast] = useState<string | null>(null);

  const toggle = (id: string, t: string) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
    setToast(`${t} 已${!state[id] ? '开启' : '关闭'}`);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <DemoStage caption="切换立即生效 —— 注意它和 Checkbox 的区别：Switch 改的是「状态」，不是「收集一个选择」。">
      <div className="mx-auto w-full max-w-[400px]">
        <div className="overflow-hidden rounded-xl border border-line">
          {SWITCHES.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-center justify-between gap-3 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-[#F7F5F0]"
            >
              <span className="min-w-0">
                <span className="block text-sm text-ink">{s.t}</span>
                <span className="mt-0.5 block text-xs text-muted">{s.d}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={state[s.id]}
                aria-label={s.t}
                onClick={() => toggle(s.id, s.t)}
                className="relative grid h-11 w-11 shrink-0 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={`relative block h-[26px] w-[44px] rounded-full transition-colors ${
                    state[s.id] ? 'bg-[#2C7355]' : 'bg-[#D8D5CD]'
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      state[s.id] ? 'translate-x-[21px]' : 'translate-x-[3px]'
                    }`}
                  />
                </span>
              </button>
            </label>
          ))}
        </div>
        {toast && (
          <p className="mt-3 text-center text-xs text-muted" role="status" aria-live="polite">
            {toast}
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Slider ---------------- */

export function SliderDemo() {
  const [v, setV] = useState(42);
  const slId = useId();

  return (
    <DemoStage caption="拖动试试，也可以用 ← → 键（每次 5）。数值一定要显示出来。">
      <div className="mx-auto w-full max-w-[400px]">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor={slId} className="text-sm text-ink2">
            滤镜强度
          </label>
          <span className="w-11 text-right text-sm tabular-nums text-ink">{v}</span>
        </div>
        <input
          id={slId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          aria-valuetext={`${v} / 100`}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform focus-visible:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:active:scale-95"
          style={{
            background: `linear-gradient(to right, #1A1917 0%, #1A1917 ${v}%, #E6E3DB ${v}%, #E6E3DB 100%)`,
          }}
        />
        <div className="mt-2 flex justify-between text-2xs text-muted">
          <span>原片 0</span>
          <span>100 最强</span>
        </div>
        <p className="mt-3 text-center text-xs text-muted">当前预览：滤镜强度 {v}%</p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Segmented Control ---------------- */

export function SegmentedControlDemo() {
  const [v, setV] = useState('day');

  return (
    <DemoStage caption="一个紧凑的按钮组。它和 Tabs 的区别：这里切换不改变 URL。">
      <div className="mx-auto w-full max-w-[400px]">
        <div
          role="tablist"
          aria-label="时间范围"
          className="flex rounded-lg bg-[#F2F0EB] p-[3px]"
        >
          {[
            ['day', '日'],
            ['week', '周'],
            ['month', '月'],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={v === k}
              onClick={() => setV(k)}
              className={`flex-1 rounded-[6px] px-3 py-1.5 text-[0.8125rem] font-medium transition-all ${
                v === k
                  ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(26,25,23,0.1)]'
                  : 'text-muted hover:text-ink2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          当前显示：{v === 'day' ? '今天' : v === 'week' ? '本周' : '本月'}的清理记录
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Select ---------------- */

const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '南京', '武汉', '重庆'];

export function SelectDemo() {
  const [v, setV] = useState('');
  const [open, setOpen] = useState(false);
  const selId = useId();

  return (
    <DemoStage caption="点开看看：↑↓ 移动、Enter 选中、Esc 关闭。">
      <div className="mx-auto w-full max-w-[340px]">
        <label htmlFor={selId} className="mb-1.5 block text-sm text-ink2">
          城市
        </label>
        <div className="relative">
          <button
            id={selId}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-full items-center justify-between rounded-lg border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors hover:border-[#C9C5BB] focus:border-ink"
          >
            <span className={v ? '' : 'text-[#7A766D]'}>{v || '请选择城市'}</span>
            <ChevronDown
              size={15}
              aria-hidden="true"
              className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <ul
                role="listbox"
                aria-label="城市列表"
                tabIndex={-1}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false);
                }}
                className="absolute inset-x-0 top-full z-20 mt-1 max-h-[180px] overflow-y-auto rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in"
              >
                {CITIES.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={v === c}
                      onClick={() => {
                        setV(c);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-[#F5F3EE] ${
                        v === c ? 'font-medium text-ink' : 'text-ink2'
                      }`}
                    >
                      {c}
                      {v === c && <Check size={14} aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Chip ---------------- */

export function ChipDemo() {
  const [active, setActive] = useState<string[]>(['portrait']);

  const toggle = (c: string) => {
    setActive((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const FILTERS = [
    { id: 'all', label: '全部' },
    { id: 'portrait', label: '人像' },
    { id: 'landscape', label: '风景' },
    { id: 'night', label: '夜景' },
    { id: 'screenshot', label: '截图' },
  ];

  return (
    <DemoStage caption="可筛选的 Chip：可以多选，选中态填充主色，再点一次可以取消。">
      <div className="mx-auto w-full max-w-[400px]">
        <p className="meta mb-2">已选 {active.length} 个条件</p>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isAll = f.id === 'all';
            const on = isAll ? active.length === 0 : active.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => (isAll ? setActive([]) : toggle(f.id))}
                className={`rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                  on ? 'bg-ink text-white' : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          {active.length === 0
            ? '显示全部照片'
            : `筛选：${active.map((a) => FILTERS.find((f) => f.id === a)?.label).join('、')}`}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Number Stepper ---------------- */

export function NumberStepperDemo() {
  const [n, setN] = useState(1);
  const MIN = 1;
  const MAX = 99;

  return (
    <DemoStage caption="减到最小值时减号会禁用 —— 给用户一个明确的边界反馈。">
      <div className="mx-auto w-full max-w-[340px]">
        <p className="mb-1.5 text-sm text-ink2">导出数量</p>
        <div className="flex items-center justify-between rounded-xl border border-line p-3">
          <DemoButton
            variant="secondary"
            onClick={() => setN((v) => Math.max(MIN, v - 1))}
            disabled={n <= MIN}
            aria-label="减少"
            className="!min-h-[40px] !w-[40px] !px-0"
          >
            <Minus size={16} aria-hidden="true" />
          </DemoButton>
          <span className="w-16 text-center text-lg tabular-nums text-ink">{n}</span>
          <DemoButton
            variant="secondary"
            onClick={() => setN((v) => Math.min(MAX, v + 1))}
            disabled={n >= MAX}
            aria-label="增加"
            className="!min-h-[40px] !w-[40px] !px-0"
          >
            <Plus size={16} aria-hidden="true" />
          </DemoButton>
        </div>
        <p className="mt-2 text-center text-xs text-muted">
          范围 {MIN} – {MAX}
        </p>
      </div>
    </DemoStage>
  );
}
