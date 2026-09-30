'use client';

import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, House, Image as ImageIcon, User } from 'lucide-react';
import { DemoStage } from './DemoStage';

/* ---------------- Breadcrumb ---------------- */

export function BreadcrumbDemo() {
  const [depth, setDepth] = useState(3);
  const path = ['相册', '2026', 'IMG_0231'].slice(0, depth);

  return (
    <DemoStage
      caption="点任意一级退回上层 —— 面包屑的价值不在「显示路径」，在「让你退回」。"
    >
      <nav aria-label="面包屑" className="min-w-0">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {path.map((item, i) => {
            const isLast = i === path.length - 1;
            return (
              <li key={item} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="select-none text-[#C9C5BB]">
                    ›
                  </span>
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="block max-w-[150px] truncate rounded px-1 py-0.5 font-medium text-ink"
                  >
                    {item}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDepth(i + 1)}
                    className="rounded px-1 py-0.5 text-ink2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {item}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <p className="mt-4 text-xs text-muted">
        当前层级：<span className="text-ink2">{path.join(' / ')}</span>
        {depth < 3 && (
          <button
            type="button"
            onClick={() => setDepth(3)}
            className="ml-2 text-ink2 underline underline-offset-4 hover:text-ink"
          >
            回到深层
          </button>
        )}
      </p>
    </DemoStage>
  );
}

/* ---------------- Tabs ---------------- */

export function TabsDemo() {
  const [tab, setTab] = useState('posts');

  const TABS = [
    { k: 'posts', label: '主页' },
    { k: 'works', label: '作品' },
    { k: 'likes', label: '喜欢' },
    { k: 'saved', label: '收藏' },
  ];

  return (
    <DemoStage caption="点标签切换下面的整块内容。标签多的时候在手机上可以左右滑。">
      <div>
        <div role="tablist" aria-label="用户主页分区" className="flex gap-1 border-b border-line">
          {TABS.map((t) => (
            <button
              key={t.k}
              type="button"
              role="tab"
              id={`tab-${t.k}`}
              aria-selected={tab === t.k}
              aria-controls={`panel-${t.k}`}
              onClick={() => setTab(t.k)}
              className={`relative -mb-px whitespace-nowrap px-3.5 py-2.5 text-sm transition-colors ${
                tab === t.k ? 'font-medium text-ink' : 'text-muted hover:text-ink2'
              }`}
            >
              {t.label}
              {tab === t.k && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ink" />
              )}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="py-4"
        >
          {(() => {
            const CONTENT: Record<string, string[]> = {
              posts: ['今天去了海边，捡到一块很特别的海玻璃', '拍了一下午，其实就为了这一张', '阴天也很好，光很柔'],
              works: ['《城市边缘》系列 · 第 3 组', '《无人知晓的房间》', '《光的重量》短片'],
              likes: ['这张构图我喜欢', '想记住这个颜色', '旅行时拍的，不记得哪了'],
              saved: ['周末去的地方清单', '想在家复刻的菜', '下次要去的城市'],
            };
            const content = CONTENT[tab] ?? [];
            return (
              <ul className="space-y-2">
                {content.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8125rem] text-ink2"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9C5BB]" />
                    {c}
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Bottom Navigation ---------------- */

export function BottomNavigationDemo() {
  const [active, setActive] = useState('home');

  const ITEMS = [
    { k: 'home', label: '首页', icon: House },
    { k: 'album', label: '相册', icon: ImageIcon, badge: 5 },
    { k: 'me', label: '我的', icon: User },
  ];

  return (
    <DemoStage caption="点一下切换。选中项的图标和文字都会高亮 —— 它负责的是「在主功能之间切换」。">
      <div className="mx-auto w-full max-w-[320px]">
        <div className="mb-3 h-16 rounded-lg border border-dashed border-line bg-[#FCFBF8]" />
        <nav
          aria-label="主导航"
          className="flex items-stretch border-t border-line bg-surface pt-1.5"
        >
          {ITEMS.map((it) => {
            const on = active === it.k;
            const Icon = it.icon;
            return (
              <button
                key={it.k}
                type="button"
                onClick={() => setActive(it.k)}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-1 flex-col items-center gap-1 py-1.5 transition-colors ${
                  on ? 'text-ink' : 'text-muted'
                }`}
              >
                <span className="relative">
                  <Icon size={21} aria-hidden="true" strokeWidth={on ? 2.2 : 1.8} />
                  {it.badge && (
                    <span className="absolute -right-1.5 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#A8342C] px-1 text-[9px] font-semibold text-white">
                      {it.badge}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] ${on ? 'font-medium' : ''}`}>{it.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </DemoStage>
  );
}

/* ---------------- Navigation Rail / Sidebar ---------------- */

export function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('概览');

  const ITEMS = ['概览', '媒体库', '相册', '回收站', '设置'];

  return (
    <DemoStage caption="点「切换」看导航轨和 Sidebar 之间的差别：图标态 vs 展开态（本质是同一套东西的两种宽度）。">
      <div className="flex min-h-[240px] flex-col overflow-hidden rounded-xl border border-line sm:flex-row">
        <nav
          aria-label="侧边导航"
          className={`flex shrink-0 flex-row border-b border-line bg-[#FCFBF8] transition-[width] duration-200 sm:flex-col sm:border-b-0 sm:border-r ${
            open ? 'w-full sm:w-[150px]' : 'w-full sm:w-[60px]'
          }`}
        >
          <div className="flex h-11 shrink-0 items-center border-b border-line px-3 sm:border-b-0">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-[10px] font-semibold text-white">
              拾
            </span>
            {open && <span className="ml-2 text-xs font-medium text-ink">拾光清理</span>}
          </div>
          <ul className="flex flex-1 gap-1 overflow-x-auto p-1.5 sm:flex-col sm:overflow-x-visible">
            {ITEMS.map((it) => (
              <li key={it} className="shrink-0 sm:shrink">
                <button
                  type="button"
                  onClick={() => setActive(it)}
                  aria-current={active === it ? 'page' : undefined}
                  title={it}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.8125rem] transition-colors ${
                    active === it
                      ? 'bg-[#EFEDE7] font-medium text-ink'
                      : 'text-ink2 hover:bg-[#F2F0EB]'
                  }`}
                >
                  <span className="h-4 w-4 shrink-0 rounded bg-[#D8D5CD]" aria-hidden="true" />
                  {open && <span className="truncate">{it}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-11 items-center border-b border-line px-3">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="rounded-md px-2 py-1 text-xs text-ink2 transition-colors hover:bg-[#F2F0EB]"
            >
              切换
            </button>
            <span className="ml-2 text-xs text-muted">{open ? '展开态 (240px)' : '图标态 (80px)'}</span>
          </div>
          <div className="grid-lines flex flex-1 items-center justify-center p-4">
            <p className="text-xs text-muted">主内容区</p>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Stepper ---------------- */

export function StepperDemo() {
  const [current, setCurrent] = useState(1);

  const STEPS = ['购物车', '填写地址', '支付', '完成'];

  return (
    <DemoStage caption="点已完成的步骤可以回退。移动端通常会简化成「第 2 步 / 共 4 步」。">
      <div className="w-full">
        <ol className="flex items-center" aria-label="结算步骤">
          {STEPS.map((s, i) => {
            const state = i < current ? 'done' : i === current ? 'active' : 'upcoming';
            return (
              <li key={s} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  disabled={state === 'upcoming'}
                  onClick={() => setCurrent(i)}
                  aria-current={state === 'active' ? 'step' : undefined}
                  className="flex shrink-0 flex-col items-center gap-1.5 disabled:cursor-default"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                      state === 'done'
                        ? 'border-ink bg-ink text-white'
                        : state === 'active'
                          ? 'border-ink bg-surface text-ink'
                          : 'border-line bg-surface text-[#C9C5BB]'
                    }`}
                  >
                    {state === 'done' ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : i + 1}
                  </span>
                  <span
                    className={`whitespace-nowrap text-[0.6875rem] ${
                      state === 'upcoming' ? 'text-[#C9C5BB]' : state === 'active' ? 'font-medium text-ink' : 'text-muted'
                    }`}
                  >
                    {s}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span
                    className={`mx-2 mb-5 h-px flex-1 transition-colors ${
                      i < current ? 'bg-ink' : 'bg-line'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-center text-xs text-muted">
          第 {current + 1} 步 / 共 {STEPS.length} 步 · {STEPS[current]}
        </p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Pagination ---------------- */

export function PaginationDemo() {
  const [page, setPage] = useState(3);

  return (
    <DemoStage caption="点数字试试。分页的价值是「可定位」—— 你能记住第 3 页有东西。">
      <div className="w-full">
        <div className="mb-4 flex items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-[#FCFBF8] py-6">
          <p className="text-sm text-ink2">正在看第 {page} 页的结果</p>
        </div>
        <nav aria-label="分页" className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="上一页"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={page === n ? 'page' : undefined}
              className={`h-8 min-w-8 rounded-md px-2 text-sm tabular-nums transition-colors ${
                page === n
                  ? 'bg-ink font-medium text-white'
                  : 'text-ink2 hover:bg-[#F2F0EB]'
              }`}
            >
              {n}
            </button>
          ))}

          <span className="px-1 text-sm text-[#C9C5BB]" aria-hidden="true">
            …
          </span>
          <button
            type="button"
            onClick={() => setPage(48)}
            aria-current={page === 48 ? 'page' : undefined}
            className={`h-8 min-w-8 rounded-md px-2 text-sm tabular-nums transition-colors ${
              page === 48 ? 'bg-ink font-medium text-white' : 'text-ink2 hover:bg-[#F2F0EB]'
            }`}
          >
            48
          </button>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(48, p + 1))}
            disabled={page === 48}
            aria-label="下一页"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
        <p className="mt-3 text-center text-xs text-muted">共 48 页 · 每页 20 条</p>
      </div>
    </DemoStage>
  );
}

/* ---------------- Infinite Scroll ---------------- */

export function InfiniteScrollDemo() {
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading || count >= 18) return;
    setLoading(true);
    setTimeout(() => {
      setCount((c) => Math.min(18, c + 6));
      setLoading(false);
    }, 900);
  };

  const done = count >= 18;

  return (
    <DemoStage caption="滑到底部或点「加载更多」试试。加载完会显示「已经到底了」—— 不然用户不知道还能不能继续。">
      <div className="mx-auto w-full max-w-[400px]">
        <div className="max-h-[240px] space-y-2 overflow-y-auto pr-1">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2.5"
            >
              <div
                className="h-9 w-9 shrink-0 rounded-lg"
                style={{
                  background: ['#DCE6EF', '#E9E2D4', '#E2EAE4', '#EFE1E1'][i % 4],
                }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] text-ink">内容 {i + 1}</p>
                <p className="text-xs text-muted">3 分钟前</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center">
          {loading ? (
            <span
              className="flex items-center gap-2 text-xs text-muted"
              role="status"
              aria-live="polite"
            >
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9C5BB] [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9C5BB] [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9C5BB]" />
              </span>
              正在加载…
            </span>
          ) : done ? (
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="h-px w-6 bg-line" aria-hidden="true" />
              已经到底了
              <span className="h-px w-6 bg-line" aria-hidden="true" />
            </span>
          ) : (
            <button
              type="button"
              onClick={loadMore}
              className="rounded-lg border border-line px-4 py-2 text-xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
            >
              加载更多
            </button>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- Load More ---------------- */

export function LoadMoreDemo() {
  const [n, setN] = useState(3);
  const all = Array.from({ length: n }, (_, i) => i);
  const done = n >= 9;

  return (
    <DemoStage caption="「加载更多」是分页和无限滚动之间的中间解：用户自己控制节奏。">
      <div className="mx-auto w-full max-w-[400px]">
        <div className="space-y-2">
          {all.map((i) => (
            <div
              key={i}
              className="rounded-lg border border-line bg-surface px-3.5 py-3 text-[0.8125rem] leading-relaxed text-ink2"
            >
              第 {i + 1} 条内容。这是一段演示文本，用来占据一些空间。
            </div>
          ))}
        </div>
        <div className="mt-3.5 flex justify-center">
          {done ? (
            <span className="text-xs text-muted">没有更多了</span>
          ) : (
            <button
              type="button"
              onClick={() => setN((v) => Math.min(9, v + 3))}
              className="rounded-lg border border-line px-4 py-2 text-xs text-ink2 transition-colors hover:bg-[#F5F3EE]"
            >
              加载更多
            </button>
          )}
        </div>
      </div>
    </DemoStage>
  );
}
