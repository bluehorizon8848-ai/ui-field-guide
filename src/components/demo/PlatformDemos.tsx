'use client';

import { useState, useEffect } from 'react';
import {
  Share2,
  Trash2,
  Copy,
  Heart,
  Search,
  Command,
  Plus,
  ArrowRight,
  Sun,
  CloudSun,
  Play,
  Pause,
  SkipForward,
  RotateCw,
  ExternalLink,
  Sparkles,
  Check,
} from 'lucide-react';
import { DemoStage, DemoButton } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';

/* ---------------- 1. Action Sheet Demo (iOS HIG 规范) ---------------- */

export function ActionSheetDemo() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleAction = (name: string) => {
    setLastAction(name);
    setOpen(false);
  };

  return (
    <DemoStage caption="Apple iOS HIG 规范：底部毛玻璃行动列表，将危险选项突出显示，底部物理脱离出独立的取消胶囊岛。">
      <div className="relative mx-auto flex w-full max-w-[380px] flex-col items-center justify-center py-4">
        {/* 模拟手机卡片容器 */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <p className="text-sm font-semibold text-ink">海边日落.heic</p>
              <p className="text-2xs text-muted">拍摄于 2026年10月 · 4.2 MB</p>
            </div>
            <span className="rounded-full bg-[#F2F0EB] px-2 py-0.5 text-2xs font-medium text-ink2">
               iOS
            </span>
          </div>

          <div className="my-6 flex h-36 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FFDEE9] to-[#B5FFFC] text-center">
            <span className="text-xs font-medium text-[#4A4740]/80">相册图像预览</span>
          </div>

          <div className="flex items-center justify-center">
            <DemoButton onClick={() => setOpen(true)} variant="primary" className="w-full">
              打开 iOS 操作单 (Action Sheet)
            </DemoButton>
          </div>

          {lastAction && (
            <p className="mt-3 text-center text-xs text-muted" role="status">
              已触发操作：<span className="font-semibold text-ink">{lastAction}</span>
            </p>
          )}

          {/* iOS Action Sheet 浮层 */}
          {open && (
            <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/40 p-3 transition-opacity duration-200">
              {/* 点击背景退出 */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute inset-0 h-full w-full cursor-default"
                aria-label="关闭"
              />

              {/* 上层功能卡片岛 */}
              <div className="relative z-10 overflow-hidden rounded-2xl border border-white/40 bg-white/90 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-[#E6E3DB]/80 px-4 py-2.5 text-center">
                  <p className="text-xs font-semibold text-muted">照片管理选项</p>
                  <p className="text-[0.6875rem] text-muted/80">操作将直接作用于当前 iCloud 图库</p>
                </div>

                <div className="divide-y divide-[#E6E3DB]/80 text-center">
                  <button
                    type="button"
                    onClick={() => handleAction('隔空投送 (AirDrop)')}
                    className="flex w-full items-center justify-center gap-2 py-3.5 text-sm font-medium text-[#007AFF] transition-colors active:bg-[#F2F0EB]"
                  >
                    <Share2 size={15} /> 隔空投送 (AirDrop)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('复制链接')}
                    className="flex w-full items-center justify-center gap-2 py-3.5 text-sm font-medium text-[#007AFF] transition-colors active:bg-[#F2F0EB]"
                  >
                    <Copy size={15} /> 复制 iCloud 共享链接
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('添加至个人收藏')}
                    className="flex w-full items-center justify-center gap-2 py-3.5 text-sm font-medium text-[#007AFF] transition-colors active:bg-[#F2F0EB]"
                  >
                    <Heart size={15} /> 添加至个人收藏
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('删除照片')}
                    className="flex w-full items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#FF3B30] transition-colors active:bg-[#F2F0EB]"
                  >
                    <Trash2 size={15} /> 永久删除照片
                  </button>
                </div>
              </div>

              {/* 独立取消按钮岛（物理分离） */}
              <div className="relative z-10 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-2xl border border-white/40 bg-white/95 py-3.5 text-center text-sm font-semibold text-[#007AFF] shadow-lg backdrop-blur-xl active:bg-[#F2F0EB]"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 2. Command Palette Demo (Web/SaaS 专属 ⌘K) ---------------- */

interface CommandItem {
  id: string;
  group: 'Navigation' | 'Actions' | 'Recent';
  icon: string;
  title: string;
  shortcut: string;
}

const COMMAND_DATA: CommandItem[] = [
  { id: '1', group: 'Actions', icon: '⚡️', title: '新建 Issue / 任务工单', shortcut: '⌘N' },
  { id: '2', group: 'Actions', icon: '🔗', title: '复制当前卡片链接', shortcut: '⌘L' },
  { id: '3', group: 'Actions', icon: '🌓', title: '切换深浅主题配色', shortcut: '⌘T' },
  { id: '4', group: 'Navigation', icon: '🧭', title: '前往组件图鉴库 (Explore)', shortcut: '⌘E' },
  { id: '5', group: 'Navigation', icon: '⚖️', title: '前往多端设计对比 (Compare)', shortcut: '⌘C' },
  { id: '6', group: 'Recent', icon: '🔘', title: '查看 Switch 多端开关规范', shortcut: '↵' },
  { id: '7', group: 'Recent', icon: '📊', title: '查看 Stat Card 核心指标卡', shortcut: '↵' },
];

export function CommandPaletteDemo() {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = COMMAND_DATA.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const runCommand = (item: CommandItem) => {
    setNotice(`已触发命令: ${item.title}`);
    setActive(false);
    setQuery('');
    setTimeout(() => setNotice(null), 2500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActive((prev) => !prev);
      }
      if (e.key === 'Escape' && active) {
        setActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return (
    <DemoStage caption="Linear / Raycast 规范：键盘流核心效率中枢，通过 ⌘K / Ctrl+K 快速检索全站页面与快捷动作。">
      <div className="mx-auto flex w-full max-w-[540px] flex-col items-center py-2">
        {/* 唤起触发条 */}
        <div className="flex w-full items-center justify-between rounded-xl border border-line bg-surface p-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="rounded bg-[#F2F0EB] px-1.5 py-0.5 font-mono text-ink2">⌘K</span>
            <span>按下快捷键或点击按钮呼出面板</span>
          </div>
          <DemoButton onClick={() => setActive(true)} variant="secondary" className="!min-h-[36px] !py-1 text-xs">
            唤起命令面板
          </DemoButton>
        </div>

        {notice && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#E8F3ED] px-3.5 py-1.5 text-xs font-medium text-[#1D734C]">
            <Check size={14} /> {notice}
          </div>
        )}

        {/* 模拟展开的 Command Palette 视窗 */}
        {active && (
          <div className="mt-4 w-full overflow-hidden rounded-2xl border border-ink/20 bg-surface shadow-2xl ring-1 ring-black/5 animate-rise-in">
            {/* 顶部搜索条 */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={18} className="text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIdx(0);
                }}
                autoFocus
                placeholder="搜索命令或快速跳转页面 (Type a command...)"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setActive(false)}
                className="rounded border border-line bg-[#FAF9F6] px-1.5 py-0.5 text-2xs font-mono text-muted hover:text-ink"
              >
                ESC
              </button>
            </div>

            {/* 指令列表 */}
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted">未找到匹配指令</div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item, idx) => {
                    const isSelected = idx === selectedIdx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => runCommand(item)}
                        onMouseEnter={() => setSelectedIdx(idx)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                          isSelected ? 'bg-ink text-white' : 'text-ink2 hover:bg-[#F5F3EE]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">{item.icon}</span>
                          <span className="font-medium">{item.title}</span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[0.625rem] ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#F2F0EB] text-muted'
                            }`}
                          >
                            {item.group}
                          </span>
                        </div>
                        <kbd
                          className={`rounded px-1.5 py-0.5 font-mono text-[0.6875rem] ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF9F6] text-muted border border-line'
                          }`}
                        >
                          {item.shortcut}
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 底栏快捷说明 */}
            <div className="flex items-center justify-between border-t border-line bg-[#FAF9F6] px-3.5 py-2 text-[0.6875rem] text-muted">
              <span>使用 ↑ / ↓ 键切换高亮项</span>
              <span>按 Enter 执行命令 · ESC 退出</span>
            </div>
          </div>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- 3. Extended FAB Demo (Android MD3 规范) ---------------- */

export function ExtendedFabDemo() {
  const [scrolled, setScrolled] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);

  return (
    <DemoStage caption="Material Design 3 规范：静止时展开展示图标与文字，模拟向下滚动时自动折叠为小圆点以让渡正文阅读空间。">
      <div className="mx-auto flex w-full max-w-[380px] flex-col items-center">
        {/* 控制条 */}
        <div className="mb-3 flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-2 text-xs">
          <span className="text-muted">模拟页面滚动状态：</span>
          <button
            type="button"
            onClick={() => setScrolled((prev) => !prev)}
            className="rounded-lg bg-[#F2F0EB] px-3 py-1 font-medium text-ink2 transition-colors hover:bg-[#E9E6DF]"
          >
            {scrolled ? '🔄 回滚到顶部 (展开)' : '⬇️ 向下滚动列表 (收起)'}
          </button>
        </div>

        {/* 模拟移动端内容流画板 */}
        <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-sm">
          {/* 模拟列表内容项 */}
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-line/70 bg-[#FAF9F6] p-3">
                <div className="h-3 w-1/3 rounded bg-[#E6E3DB]" />
                <div className="mt-2 h-2.5 w-4/5 rounded bg-[#F0EDE6]" />
              </div>
            ))}
          </div>

          {/* Android MD3 Extended FAB */}
          <div className="absolute bottom-4 right-4 z-20">
            <button
              type="button"
              onClick={() => setCreatedCount((c) => c + 1)}
              aria-label="新建动态"
              className={`group flex items-center justify-center overflow-hidden rounded-2xl bg-ink text-white shadow-xl transition-all duration-300 active:scale-95 active:shadow-md ${
                scrolled ? 'h-14 w-14' : 'h-14 px-5'
              }`}
            >
              <Plus size={22} className="shrink-0 transition-transform duration-200 group-hover:rotate-90" />
              <span
                className={`overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                  scrolled ? 'w-0 opacity-0' : 'ml-2.5 w-auto opacity-100'
                }`}
              >
                新建记录
              </span>
            </button>
          </div>
        </div>

        {createdCount > 0 && (
          <p className="mt-2.5 text-xs text-muted">
            已触发创建操作：<span className="font-semibold text-ink">{createdCount} 次</span>
          </p>
        )}
      </div>
    </DemoStage>
  );
}

/* ---------------- 4. Service Card Demo (鸿蒙 HarmonyOS ArkUI 规范) ---------------- */

export function ServiceCardDemo() {
  const [size, setSize] = useState<'2x2' | '2x4'>('2x2');
  const [playing, setPlaying] = useState(false);
  const [temp, setTemp] = useState(25);

  return (
    <DemoStage caption="HarmonyOS ArkUI 规范：桌面原子化万能卡片，将应用的核心动态与服务外显于桌面，支持免安装交互与一触即达。">
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
        {/* 规格切换器 */}
        <div className="mb-4 flex items-center gap-1 rounded-xl border border-line bg-[#F2F0EB] p-1 text-xs">
          <button
            type="button"
            onClick={() => setSize('2x2')}
            className={`rounded-lg px-3.5 py-1.5 font-medium transition-colors ${
              size === '2x2' ? 'bg-surface text-ink shadow-2xs' : 'text-ink2 hover:text-ink'
            }`}
          >
            2×2 方形小卡片 (1:1)
          </button>
          <button
            type="button"
            onClick={() => setSize('2x4')}
            className={`rounded-lg px-3.5 py-1.5 font-medium transition-colors ${
              size === '2x4' ? 'bg-surface text-ink shadow-2xs' : 'text-ink2 hover:text-ink'
            }`}
          >
            2×4 横向中卡片 (2:1)
          </button>
        </div>

        {/* 桌面背景模拟 */}
        <div className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-b from-[#2E3440] to-[#1E222A] p-6 shadow-inner">
          {size === '2x2' ? (
            /* 2x2 天气原子化卡片 */
            <div className="relative flex h-[164px] w-[164px] flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#E6F0FA]/95 to-[#CFE2F7]/90 p-3.5 text-ink shadow-xl backdrop-blur-xl transition-all duration-300">
              {/* 卡片头部 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0A59F7] text-[0.625rem] text-white">
                    ☁️
                  </span>
                  <span className="text-2xs font-semibold text-ink2">实时天气</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTemp((t) => (t >= 28 ? 22 : t + 1))}
                  className="rounded-full p-1 text-muted hover:text-ink"
                  title="刷新数据"
                >
                  <RotateCw size={12} />
                </button>
              </div>

              {/* 核心气温与图标 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-ink">{temp}°</p>
                  <p className="text-2xs font-medium text-ink2">多云转晴 · 深圳</p>
                </div>
                <CloudSun size={36} className="text-[#F59E0B]" />
              </div>

              {/* 底部微胶囊状态 */}
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-2 py-1 text-[0.625rem]">
                <span className="text-[#1D734C] font-semibold">空气优 24</span>
                <span className="text-muted">免安装直达 ›</span>
              </div>
            </div>
          ) : (
            /* 2x4 音乐流转原子化卡片 */
            <div className="relative flex h-[164px] w-[340px] flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#2D3748]/95 to-[#1A202C]/90 p-4 text-white shadow-xl backdrop-blur-xl transition-all duration-300">
              {/* 头部微标识 */}
              <div className="flex items-center justify-between text-2xs text-white/70">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FA2D48] text-white">
                    🎵
                  </span>
                  <span className="font-semibold text-white">华为音乐 · 超级终端流转</span>
                </div>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.625rem]">
                  ArkUI 2×4
                </span>
              </div>

              {/* 音乐曲目信息与控制条 */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5E3A] to-[#FF2A68] shadow-md">
                  <span className="text-xl">🎧</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">Summer Resonance</p>
                  <p className="truncate text-2xs text-white/60">Blue Horizon · 空间音频高解析</p>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-2/3 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              {/* 底部操作区 */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[0.625rem] text-white/50">已流转至智慧屏播放</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-md active:scale-95"
                    aria-label={playing ? '暂停' : '播放'}
                  >
                    {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95"
                    aria-label="下一曲"
                  >
                    <SkipForward size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoStage>
  );
}
