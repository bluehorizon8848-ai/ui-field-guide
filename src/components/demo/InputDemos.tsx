'use client';

import { useId, useRef, useState } from 'react';
import { Check, ChevronDown, Minus, Plus, Search, X } from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

/* ---------------- Text Field ---------------- */

export function TextFieldDemo() {
  const locale = useLocale();
  const [value, setValue] = useState('photo@');
  const [touched, setTouched] = useState(false);
  const uid = useId();
  const fieldId = `${uid}-email`;
  const helpId = `${uid}-help`;
  const valid = /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(value);

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.text')}>
      <div className="mx-auto w-full max-w-[380px]">
        <label htmlFor={fieldId} className="mb-1.5 block text-sm text-ink2">
          {t(locale, 'demo.input.text.label')}
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
            ? t(locale, 'demo.input.text.error')
            : t(locale, 'demo.input.text.help')}
        </p>
        {touched && valid && (
          <p className="mt-1 flex items-center gap-1 text-[0.8125rem] text-[#2C7355]">
            <Check size={13} aria-hidden="true" />
            {t(locale, 'demo.input.text.ok')}
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Text Area ---------------- */

export function TextAreaDemo() {
  const locale = useLocale();
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
    <DemoStage caption={t(locale, 'demo.input.caption.textarea')}>
      <div className="mx-auto w-full max-w-[400px]">
        <label htmlFor={taId} className="mb-1.5 block text-sm text-ink2">
          {t(locale, 'demo.input.textarea.label')}
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
          placeholder={t(locale, 'demo.input.textarea.placeholder')}
          className="w-full resize-y rounded-lg border border-line bg-surface px-3.5 py-3 text-sm leading-relaxed text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-muted">{t(locale, 'demo.input.textarea.hint')}</span>
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

export function SearchFieldDemo() {
  const locale = useLocale();
  const [q, setQ] = useState('');
  const SUGGESTIONS = [
    t(locale, 'demo.input.search.sea'),
    t(locale, 'demo.input.search.night'),
    t(locale, 'demo.input.search.portrait'),
    t(locale, 'demo.input.search.files'),
  ];
  const results = SUGGESTIONS.filter((s) => s.includes(q.trim()));

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.search')}>
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
            placeholder={t(locale, 'demo.input.search.placeholder')}
            aria-label={t(locale, 'demo.input.search.placeholder')}
            className="h-11 w-full rounded-full border border-line bg-[#F5F3EE] pl-9 pr-9 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:bg-surface focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label={t(locale, 'demo.input.search.clear')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-black/5 hover:text-ink"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {q.trim() === '' ? (
          <div className="mt-4">
            <p className="meta mb-2">{t(locale, 'demo.input.search.popular')}</p>
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
            <p className="text-[0.8125rem] text-muted">
              {t(locale, 'demo.input.search.none', { q })}
            </p>
            <button
              type="button"
              onClick={() => setQ('')}
              className="mt-1.5 text-xs font-medium text-ink underline-offset-4 hover:underline"
            >
              {t(locale, 'demo.input.search.clear')}
            </button>
          </div>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- Checkbox ---------------- */

const TODO = [
  { id: 'dupes', labelKey: 'demo.input.checkbox.1' },
  { id: 'backup', labelKey: 'demo.input.checkbox.2' },
  { id: 'oversized', labelKey: 'demo.input.checkbox.3' },
] as const;

export function CheckboxDemo() {
  const locale = useLocale();
  const [checked, setChecked] = useState<string[]>([TODO[0].id]);
  const all = checked.length === TODO.length;
  const some = checked.length > 0 && !all;

  const toggle = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.checkbox')}>
      <div className="mx-auto w-full max-w-[400px]">
        <div className="overflow-hidden rounded-xl border border-line">
          <label className="flex cursor-pointer items-center gap-3 border-b border-line bg-[#FCFBF8] px-4 py-3">
            <Checkbox checked={all} indeterminate={some} onChange={() =>
              setChecked(all ? [] : TODO.map((item) => item.id))
            } />
            <span className="flex-1 text-sm font-medium text-ink">
              {t(locale, 'demo.input.checkbox.all')}
            </span>
            <span className="text-xs tabular-nums text-muted">
              {t(locale, 'demo.input.checkbox.count', { n: checked.length })}
            </span>
          </label>
          {TODO.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 hover:bg-[#F7F5F0]"
            >
              <Checkbox checked={checked.includes(item.id)} onChange={() => toggle(item.id)} />
              <span className="flex-1 text-sm text-ink">{t(locale, item.labelKey)}</span>
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
  const locale = useLocale();
  const [v, setV] = useState('personal');

  const OPTIONS = [
    {
      id: 'personal',
      labelKey: 'demo.input.radio.personal',
      descKey: 'demo.input.radio.personalDesc',
    },
    { id: 'team', labelKey: 'demo.input.radio.team', descKey: 'demo.input.radio.teamDesc' },
  ] as const;

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.radio')}>
      <fieldset className="mx-auto w-full max-w-[400px]">
        <legend className="mb-2 text-sm text-ink2">{t(locale, 'demo.input.radio.legend')}</legend>
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
                <span className="block text-sm font-medium text-ink">
                  {t(locale, o.labelKey)}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {t(locale, o.descKey)}
                </span>
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
  { id: 'dark', labelKey: 'demo.input.switch.dark', descKey: 'demo.input.switch.darkDesc' },
  { id: 'autoplay', labelKey: 'demo.input.switch.autoplay', descKey: 'demo.input.switch.autoplayDesc' },
  { id: 'sync', labelKey: 'demo.input.switch.sync', descKey: 'demo.input.switch.syncDesc' },
] as const;

export function SwitchDemo() {
  const locale = useLocale();
  const [state, setState] = useState<Record<string, boolean>>({
    dark: true,
    autoplay: false,
    sync: true,
  });
  const [toast, setToast] = useState<string | null>(null);

  const toggle = (id: string, label: string) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
    setToast(
      t(locale, !state[id] ? 'demo.input.switch.on' : 'demo.input.switch.off', {
        name: label,
      })
    );
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.switch')}>
      <div className="mx-auto w-full max-w-[420px]">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xs">
          {SWITCHES.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-center justify-between gap-3 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-[#F9F8F5] transition-colors"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{t(locale, s.labelKey)}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {t(locale, s.descKey)}
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={state[s.id]}
                aria-label={t(locale, s.labelKey)}
                onClick={() => toggle(s.id, t(locale, s.labelKey))}
                className="relative grid h-11 w-11 shrink-0 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={`relative block h-[26px] w-[46px] rounded-full transition-colors ${
                    state[s.id] ? 'bg-[#1D734C]' : 'bg-[#D8D5CD]'
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                      state[s.id] ? 'translate-x-[23px]' : 'translate-x-[3px]'
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
  const locale = useLocale();
  const [v, setV] = useState(42);
  const slId = useId();

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.slider')}>
      <div className="mx-auto w-full max-w-[400px]">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor={slId} className="text-sm text-ink2">
            {t(locale, 'demo.input.slider.label')}
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
          <span>{t(locale, 'demo.input.slider.min')}</span>
          <span>{t(locale, 'demo.input.slider.max')}</span>
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          {t(locale, 'demo.input.slider.preview', { n: v })}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Segmented Control ---------------- */

export function SegmentedControlDemo() {
  const locale = useLocale();
  const [v, setV] = useState('day');

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.seg')}>
      <div className="mx-auto w-full max-w-[400px]">
        <div
          role="tablist"
          aria-label={t(locale, 'demo.input.seg.aria')}
          className="flex rounded-lg bg-[#F2F0EB] p-[3px]"
        >
          {[
            ['day', t(locale, 'demo.input.seg.day')],
            ['week', t(locale, 'demo.input.seg.week')],
            ['month', t(locale, 'demo.input.seg.month')],
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
          {t(locale, 'demo.input.seg.summary', {
            v:
              v === 'day'
                ? t(locale, 'demo.input.seg.today')
                : v === 'week'
                  ? t(locale, 'demo.input.seg.thisWeek')
                  : t(locale, 'demo.input.seg.thisMonth'),
          })}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Select ---------------- */

const CITY_KEYS = [
  'demo.input.select.beijing',
  'demo.input.select.shanghai',
  'demo.input.select.guangzhou',
  'demo.input.select.shenzhen',
  'demo.input.select.hangzhou',
  'demo.input.select.chengdu',
  'demo.input.select.xian',
  'demo.input.select.nanjing',
  'demo.input.select.wuhan',
  'demo.input.select.chongqing',
] as const;

export function SelectDemo() {
  const locale = useLocale();
  const CITIES = CITY_KEYS.map((key) => t(locale, key));
  const [v, setV] = useState('');
  const [open, setOpen] = useState(false);
  const selId = useId();

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.select')}>
      <div className="mx-auto w-full max-w-[340px]">
        <label htmlFor={selId} className="mb-1.5 block text-sm text-ink2">
          {t(locale, 'demo.input.select.label')}
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
            <span className={v ? '' : 'text-[#7A766D]'}>
              {v || t(locale, 'demo.input.select.placeholder')}
            </span>
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
                aria-label={t(locale, 'demo.input.select.aria')}
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
  const locale = useLocale();
  const [active, setActive] = useState<string[]>(['portrait']);

  const toggle = (c: string) => {
    setActive((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const FILTERS = [
    { id: 'all', labelKey: 'demo.input.chip.all' },
    { id: 'portrait', labelKey: 'demo.input.chip.portrait' },
    { id: 'landscape', labelKey: 'demo.input.chip.landscape' },
    { id: 'night', labelKey: 'demo.input.chip.night' },
    { id: 'screenshot', labelKey: 'demo.input.chip.screenshot' },
  ] as const;

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.chip')}>
      <div className="mx-auto w-full max-w-[400px]">
        <p className="meta mb-2">{t(locale, 'demo.input.chip.count', { n: active.length })}</p>
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
                {t(locale, f.labelKey)}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          {active.length === 0
            ? t(locale, 'demo.input.chip.showAll')
            : t(locale, 'demo.input.chip.filtered', {
                v: active
                  .map((a) => {
                    const f = FILTERS.find((x) => x.id === a);
                    return f ? t(locale, f.labelKey) : a;
                  })
                  .join(', '),
              })}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Number Stepper ---------------- */

export function NumberStepperDemo() {
  const locale = useLocale();
  const [n, setN] = useState(1);
  const MIN = 1;
  const MAX = 99;

  return (
    <DemoStage caption={t(locale, 'demo.input.caption.stepper')}>
      <div className="mx-auto w-full max-w-[340px]">
        <p className="mb-1.5 text-sm text-ink2">{t(locale, 'demo.input.stepper.label')}</p>
        <div className="flex items-center justify-between rounded-xl border border-line p-3">
          <DemoButton
            variant="secondary"
            onClick={() => setN((v) => Math.max(MIN, v - 1))}
            disabled={n <= MIN}
            aria-label={t(locale, 'demo.input.stepper.minus')}
            className="!min-h-[40px] !w-[40px] !px-0"
          >
            <Minus size={16} aria-hidden="true" />
          </DemoButton>
          <span className="w-16 text-center text-lg tabular-nums text-ink">{n}</span>
          <DemoButton
            variant="secondary"
            onClick={() => setN((v) => Math.min(MAX, v + 1))}
            disabled={n >= MAX}
            aria-label={t(locale, 'demo.input.stepper.plus')}
            className="!min-h-[40px] !w-[40px] !px-0"
          >
            <Plus size={16} aria-hidden="true" />
          </DemoButton>
        </div>
        <p className="mt-2 text-center text-xs text-muted">
          {t(locale, 'demo.input.stepper.range', { min: MIN, max: MAX })}
        </p>
      </div>
    </DemoStage>
  );
}
