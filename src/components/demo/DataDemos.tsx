'use client';

import { useState } from 'react';
import { Calendar, Check, ChevronDown, Home, Image as ImageIcon, Star, User } from 'lucide-react';
import { DemoStage } from './DemoStage';

/* ---------------- List ---------------- */

export function ListDemo() {
  const [active, setActive] = useState<string | null>(null);

  const ITEMS = [
    { icon: ImageIcon, t: '照片与视频', v: '2,431 张' },
    { icon: Star, t: '收藏', v: '86 项' },
    { icon: User, t: '共享相簿', v: '3 个' },
    { icon: Home, t: '家庭位置', v: '已开启' },
  ];

  return (
    <DemoStage caption="每一行都是独立可点的。整行 hover 有反馈 —— 不是只有文字能点。">
      <ul className="mx-auto w-full max-w-[380px] overflow-hidden rounded-xl border border-line">
        {ITEMS.map(({ icon: Icon, t, v }) => (
          <li key={t}>
            <button
              type="button"
              onClick={() => setActive(active === t ? null : t)}
              aria-current={active === t ? 'true' : undefined}
              className={`flex w-full items-center gap-3 border-b border-line px-4 py-3.5 text-left transition-colors last:border-b-0 ${
                active === t ? 'bg-[#F2F0EB]' : 'hover:bg-[#F7F5F0]'
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F0EB] text-ink2">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm text-ink">{t}</span>
              <span className="text-[0.8125rem] text-muted">{v}</span>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className="-rotate-90 text-[#C9C5BB]"
              />
            </button>
          </li>
        ))}
      </ul>
    </DemoStage>
  );
}

/* ---------------- Table ---------------- */

export function TableDemo() {
  const [sort, setSort] = useState<'name' | 'size'>('size');

  const ROWS = [
    { name: 'IMG_0231.jpg', size: 3.2, type: '照片', status: '已清理' },
    { name: 'DSC_4478.jpg', size: 4.8, type: '照片', status: '保留' },
    { name: 'clip_01.mp4', size: 128.5, type: '视频', status: '已清理' },
    { name: 'screen.png', size: 0.4, type: '截图', status: '忽略' },
  ];

  const sorted = [...ROWS].sort((a, b) =>
    sort === 'size' ? a.size - b.size : a.name.localeCompare(b.name)
  );

  const badge: Record<string, string> = {
    已清理: 'bg-[#E6F2EC] text-[#2C7355]',
    保留: 'bg-[#F2F0EB] text-ink2',
    忽略: 'bg-[#F2F0EB] text-muted',
  };

  return (
    <DemoStage caption="点表头排序。数字右对齐 + 等宽数字，这样大小一眼能比出来。">
      <div className="table-scroll -mx-1 px-1">
        <table className="w-full min-w-[440px] text-sm">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="pb-2 pr-3 text-left">
                <button
                  type="button"
                  onClick={() => setSort('name')}
                  className="flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"
                >
                  文件名
                  {sort === 'name' && <span aria-hidden="true">↓</span>}
                </button>
              </th>
              <th scope="col" className="pb-2 pr-3 text-right">
                <button
                  type="button"
                  onClick={() => setSort('size')}
                  className="flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"
                >
                  大小
                  {sort === 'size' && <span aria-hidden="true">↓</span>}
                </button>
              </th>
              <th scope="col" className="pb-2 pr-3 text-left text-xs font-medium text-muted">
                类型
              </th>
              <th scope="col" className="pb-2 text-left text-xs font-medium text-muted">
                状态
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-b border-line2 last:border-b-0 hover:bg-[#FCFBF8]">
                <td className="py-2.5 pr-3 text-[0.8125rem] text-ink">{r.name}</td>
                <td className="py-2.5 pr-3 text-right text-[0.8125rem] tabular-nums text-ink2">
                  {r.size} MB
                </td>
                <td className="py-2.5 pr-3 text-[0.8125rem] text-muted">{r.type}</td>
                <td className="py-2.5">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-2xs font-medium ${badge[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoStage>
  );
}

/* ---------------- Badge ---------------- */

export function BadgeDemo() {
  const [counts, setCounts] = useState({ msg: 5, file: 128, cart: 0 });

  const items = [
    { k: 'msg' as const, label: '消息', icon: <User size={18} /> },
    { k: 'file' as const, label: '文件', icon: <ImageIcon size={18} /> },
    { k: 'cart' as const, label: '购物车', icon: <Star size={18} /> },
  ];

  return (
    <DemoStage caption=">99 显示「99+」，为 0 时整个隐藏。点一下看看。">
      <div className="flex flex-wrap items-center justify-center gap-8">
        {items.map((it) => {
          const n = counts[it.k];
          return (
            <button
              key={it.k}
              type="button"
              onClick={() =>
                setCounts((c) => ({
                  ...c,
                  [it.k]: c[it.k] >= 130 ? 0 : c[it.k] + 1,
                }))
              }
              className="relative flex flex-col items-center gap-2"
              aria-label={`${it.label}，未读 ${n}`}
            >
              <span className="relative text-ink2">
                {it.icon}
                {n > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#A8342C] px-1 text-[9px] font-semibold text-white">
                    {n > 99 ? '99+' : n}
                  </span>
                )}
              </span>
              <span className="text-xs text-muted">{it.label}</span>
            </button>
          );
        })}
      </div>
    </DemoStage>
  );
}

/* ---------------- Tag ---------------- */

export function TagDemo() {
  const tags = [
    { label: '视频', cls: 'bg-[#EEF3F8] text-[#35618E]' },
    { label: '已收藏', cls: 'bg-[#F8F2E4] text-[#94701C]' },
    { label: '已编辑', cls: 'bg-[#F2F0EB] text-muted' },
    { label: '原始', cls: 'bg-[#ECF5F0] text-[#2C7355]' },
  ];

  return (
    <DemoStage caption="Tag 是只读的（没有 hover、没有 pointer），这正是它和 Chip 的区别。">
      <div className="mx-auto w-full max-w-[400px] space-y-2.5">
        {['IMG_0231 海岸线', 'clip_01 延时摄影', 'IMG_0155 旧照片'].map((name, i) => (
          <div
            key={name}
            className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3.5 py-3"
          >
            <span className="min-w-0 truncate text-[0.8125rem] text-ink">{name}</span>
            <span className="flex shrink-0 gap-1.5">
              {tags.slice(0, (i % 2) + 1).map((t) => (
                <span
                  key={t.label}
                  className={`rounded-full px-2 py-0.5 text-2xs font-medium ${t.cls}`}
                >
                  {t.label}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

/* ---------------- Stat Card ---------------- */

export function StatCardDemo() {
  const STATS = [
    { label: '今日新增', value: '1,284', delta: '↑ 12%', up: true, base: '较昨日' },
    { label: '活跃用户', value: '8,420', delta: '↓ 3%', up: false, base: '较上周' },
    { label: '转化率', value: '4.2%', delta: '持平', up: null, base: '较上周' },
    { label: '今日清理', value: '0', delta: '—', up: null, base: '较昨日' },
  ];

  return (
    <DemoStage caption="注意变化率必须说清和什么比。国内习惯：红涨绿跌。">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-3.5">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-1.5 text-[1.375rem] font-semibold tabular-nums leading-none text-ink">
              {s.value}
            </p>
            <p
              className={`mt-2 text-xs ${
                s.up === true ? 'text-[#A8342C]' : s.up === false ? 'text-[#2C7355]' : 'text-muted'
              }`}
            >
              {s.delta}
              <span className="ml-1 text-muted">{s.base}</span>
            </p>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

/* ---------------- Avatar ---------------- */

export function AvatarDemo() {
  const PEOPLE = [
    { name: '陈小明', url: 'linear-gradient(135deg,#DCE6EF,#E9E2D4)' },
    { name: '林晓', url: 'linear-gradient(135deg,#E2EAE4,#EFE1E1)' },
    { name: '王大锤', url: 'linear-gradient(135deg,#EFE1E1,#E4E2EF)' },
    { name: '赵敏', url: 'linear-gradient(135deg,#E9E2D4,#DCE6EF)' },
  ];

  return (
    <DemoStage caption="真实场景是照片；这里是降级方案 —— 用名字首字母生成柔和底色。">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          {PEOPLE.map((p) => (
            <span key={p.name} className="flex flex-col items-center gap-1.5">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium text-ink2 ring-2 ring-white"
                style={{ background: p.url }}
                role="img"
                aria-label={p.name}
              >
                {p.name[0]}
              </span>
              <span className="text-2xs text-muted">{p.name}</span>
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-muted">
          头像永远要有降级方案：首字母 → 默认图标。
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Timeline ---------------- */

export function TimelineDemo() {
  const GROUPS = [
    {
      label: '今天',
      items: [
        { t: '完成清理 128 张重复照片', time: '14:20' },
        { t: '导出 2024 年度归档', time: '10:05' },
        { t: '开启 iCloud 同步', time: '09:12' },
      ],
    },
    {
      label: '昨天',
      items: [
        { t: '导入 342 张新照片', time: '21:40' },
        { t: '创建相簿「2024 旅行」', time: '16:22' },
      ],
    },
  ];

  return (
    <DemoStage caption="一条竖线把所有事件串起来 —— 它表达的是「发生过一串事」。">
      <div className="mx-auto w-full max-w-[400px]">
        {GROUPS.map((g, gi) => (
          <div key={g.label} className="mb-5 last:mb-0">
            <p className="meta sticky top-0 z-10 bg-surface py-1.5">{g.label}</p>
            <div className="relative mt-1 space-y-3.5 pl-6">
              <span
                className="absolute left-[5px] top-1.5 h-[calc(100%-1rem)] w-px bg-line"
                aria-hidden="true"
              />
              {g.items.map((it) => (
                <div key={it.t} className="relative">
                  <span
                    className="absolute -left-6 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-surface bg-ink"
                    aria-hidden="true"
                  />
                  <p className="text-[0.8125rem] leading-snug text-ink">{it.t}</p>
                  <p className="mt-0.5 text-xs tabular-nums text-muted">{it.time}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

/* ---------------- Date Picker ---------------- */

export function DatePickerDemo() {
  const [selected, setSelected] = useState<number | null>(12);
  const [month, setMonth] = useState(0); // 0 = 本月

  const today = 14;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <DemoStage caption="过去的日期置灰不可点。今天加一圈描边标记。">
      <div className="mx-auto w-full max-w-[300px]">
        <div className="rounded-xl border border-line bg-surface p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth((m) => Math.max(0, m - 1))}
              disabled={month === 0}
              className="rounded p-1 text-muted transition-colors hover:bg-[#F2F0EB] disabled:opacity-30"
              aria-label="上个月"
            >
              ‹
            </button>
            <span className="text-sm font-medium text-ink">
              {month === 0 ? '2026 年 3 月' : '2026 年 2 月'}
            </span>
            <button
              type="button"
              onClick={() => setMonth((m) => Math.min(1, m + 1))}
              disabled={month === 1}
              className="rounded p-1 text-muted transition-colors hover:bg-[#F2F0EB] disabled:opacity-30"
              aria-label="下个月"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {['一', '二', '三', '四', '五', '六', '日'].map((d) => (
              <span key={d} className="py-1 text-2xs text-muted">
                {d}
              </span>
            ))}
            {days.map((d) => {
              const past = month === 0 && d < today;
              const isToday = month === 0 && d === today;
              const isSel = selected === d && month === 0;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={past}
                  onClick={() => setSelected(d)}
                  className={`relative flex h-8 items-center justify-center rounded-lg text-[0.8125rem] tabular-nums transition-colors ${
                    isSel
                      ? 'bg-ink font-medium text-white'
                      : past
                        ? 'cursor-not-allowed text-[#C9C5BB]'
                        : 'text-ink hover:bg-[#F2F0EB]'
                  } ${isToday && !isSel ? 'ring-1 ring-inset ring-ink' : ''}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2.5 text-center text-xs text-muted">
          {selected ? `已选择 2026 年 ${month === 0 ? 3 : 2} 月 ${selected} 日` : '未选择日期'}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Popover ---------------- */

export function PopoverDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DemoStage caption="Popover 和 Tooltip 的区别：这里里面有可以点的东西（模板选择）。">
      <div className="flex min-h-[220px] items-center justify-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-[#F5F3EE]"
          >
            插入模板
            <ChevronDown size={14} aria-hidden="true" className="text-muted" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
              <div
                role="menu"
                className="absolute left-0 top-full z-20 mt-1.5 w-52 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in"
              >
                {[
                  { icon: Calendar, label: '日期轴模板' },
                  { icon: ImageIcon, label: '三图并排' },
                  { icon: Star, label: '评分卡片' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.8125rem] text-ink2 transition-colors hover:bg-[#F5F3EE]"
                  >
                    <Icon size={14} className="text-muted" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Context Menu ---------------- */

export function ContextMenuDemo() {
  const [pos, setPos] = useState<{ x: number | string; y: number | string } | null>(null);

  return (
    <DemoStage caption="在文字上点右键（或点「模拟右键」）—— 菜单内容只对这个对象有效。">
      <div
        className="relative flex min-h-[220px] flex-wrap items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-[#FCFBF8] p-4"
        onContextMenu={(e) => {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
      >
        <p className="select-none text-sm text-ink2">在这里点右键</p>
        <button
          type="button"
          onClick={() => setPos({ x: '50%', y: 60 })}
          className="rounded-md border border-line bg-surface px-2.5 py-1 text-2xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
        >
          模拟右键
        </button>

        {pos && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setPos(null)} onContextMenu={(e) => { e.preventDefault(); setPos(null); }} aria-hidden="true" />
            <div
              role="menu"
              style={{
                left: typeof pos.x === 'number' ? `${pos.x}px` : pos.x,
                top: typeof pos.y === 'number' ? `${pos.y}px` : pos.y,
              }}
              className="absolute z-20 w-44 -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-pop animate-rise-in"
            >
              {['复制', '移动到…', '重命名', '复制链接'].map((t) => (
                <button
                  key={t}
                  type="button"
                  role="menuitem"
                  onClick={() => setPos(null)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[0.8125rem] text-ink2 transition-colors hover:bg-[#F5F3EE]"
                >
                  {t}
                  {t === '复制' && <span className="text-2xs text-muted">⌘C</span>}
                </button>
              ))}
              <div className="my-1 h-px bg-line" role="separator" />
              <button
                type="button"
                role="menuitem"
                onClick={() => setPos(null)}
                className="flex w-full items-center px-3 py-1.5 text-left text-[0.8125rem] text-[#A8342C] transition-colors hover:bg-[#FAEDEC]"
              >
                删除
              </button>
            </div>
          </>
        )}
      </div>
    </DemoStage>
  );
}
