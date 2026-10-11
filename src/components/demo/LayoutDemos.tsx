'use client';

import { useState } from 'react';
import {
  Columns2,
  Columns3,
  Compass,
  Laptop,
  Layers,
  Layout,
  Maximize2,
  Menu,
  Minimize2,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Smartphone,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DemoButton, DemoStage } from './DemoStage';
import { useLocale } from '@/components/layout/LocaleProvider';

/* ---------------- 1. Container (版心) ---------------- */

export function ContainerDemo() {
  const locale = useLocale();
  const [viewportWidth, setViewportWidth] = useState<'wide' | 'laptop' | 'mobile'>('wide');

  const widthClasses = {
    wide: 'w-full max-w-[520px]',
    laptop: 'w-[380px]',
    mobile: 'w-[240px]',
  };

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Switch simulated viewport to observe how max-width container keeps content centered and readable.'
          : '切换模拟屏幕宽度，观察版心如何始终将内容限制在居中舒适区，两侧保留自适应安全留白。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        {/* 控制条 */}
        <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface p-1 shadow-card">
          <button
            onClick={() => setViewportWidth('wide')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              viewportWidth === 'wide' ? 'bg-[#584B8A] text-white' : 'text-muted hover:text-ink'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            {locale === 'en' ? 'Desktop' : '宽屏桌面'}
          </button>
          <button
            onClick={() => setViewportWidth('laptop')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              viewportWidth === 'laptop' ? 'bg-[#584B8A] text-white' : 'text-muted hover:text-ink'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            {locale === 'en' ? 'Laptop' : '标准笔记本'}
          </button>
          <button
            onClick={() => setViewportWidth('mobile')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              viewportWidth === 'mobile' ? 'bg-[#584B8A] text-white' : 'text-muted hover:text-ink'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            {locale === 'en' ? 'Mobile' : '手机视口'}
          </button>
        </div>

        {/* 模拟物理显示屏 */}
        <div className="flex w-full justify-center overflow-hidden rounded-xl border border-line bg-[#ECE9E2] p-3 transition-all duration-300">
          <div
            className={`flex flex-col rounded-lg border border-line2 bg-surface shadow-lift transition-all duration-300 ${widthClasses[viewportWidth]}`}
          >
            {/* 顶栏 */}
            <div className="flex h-7 items-center justify-between border-b border-line px-3 text-[11px] text-muted">
              <span className="font-mono text-[10px]">example.com</span>
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-line" />
                <span className="h-1.5 w-1.5 rounded-full bg-line" />
              </div>
            </div>

            {/* 页面内容区：展示版心边界 */}
            <div className="p-3">
              <div className="rounded-md border border-dashed border-[#584B8A]/40 bg-[#F2F0F7]/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-[#584B8A]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#584B8A]">
                    max-w-7xl (Container)
                  </span>
                  <span className="font-mono text-[9px] text-muted">mx-auto</span>
                </div>
                <div className="h-3 w-3/4 rounded bg-ink/15" />
                <div className="mt-1.5 h-2 w-full rounded bg-ink/10" />
                <div className="mt-1 h-2 w-5/6 rounded bg-ink/10" />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded border border-line bg-surface p-2 text-center text-[10px] text-muted">
                    Feature A
                  </div>
                  <div className="rounded border border-line bg-surface p-2 text-center text-[10px] text-muted">
                    Feature B
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 2. Hero (首屏焦点区) ---------------- */

export function HeroDemo() {
  const locale = useLocale();
  const [layoutMode, setLayoutMode] = useState<'centered' | 'split'>('centered');

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Switch Hero layouts: Centered showcases prominent copy; Split balances narrative with product preview.'
          : '切换 Hero 版式：居中模式视觉重心聚焦文案与核心行动；分屏模式左右均衡展示价值与界面。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        {/* 控制条 */}
        <div className="flex items-center gap-2">
          <DemoButton
            variant={layoutMode === 'centered' ? 'primary' : 'secondary'}
            onClick={() => setLayoutMode('centered')}
          >
            {locale === 'en' ? 'Centered Hero' : '经典居中版式'}
          </DemoButton>
          <DemoButton
            variant={layoutMode === 'split' ? 'primary' : 'secondary'}
            onClick={() => setLayoutMode('split')}
          >
            {locale === 'en' ? 'Split Hero' : '左右对半分屏'}
          </DemoButton>
        </div>

        {/* 视窗舞台 */}
        <div className="w-full max-w-[500px] overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-card transition-all">
          {layoutMode === 'centered' ? (
            <div className="flex flex-col items-center text-center">
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#F2F0F7] px-2 py-0.5 text-[11px] font-medium text-[#584B8A]">
                <Sparkles className="h-3 w-3" />
                {locale === 'en' ? 'v2.0 Released' : '新特性已发布'}
              </span>
              <h3 className="text-base font-bold text-ink">
                {locale === 'en' ? 'Build Software with AI Fluency' : '用直觉构建现代人机界面'}
              </h3>
              <p className="mt-1.5 max-w-[340px] text-xs text-muted">
                {locale === 'en'
                  ? 'Turn design patterns into production code without cognitive translation friction.'
                  : '将模糊的交互设想转化为精准的高质量代码，消灭自然语言与工程落地的鸿沟。'}
              </p>
              <div className="mt-3.5 flex items-center gap-2">
                <button className="rounded-md bg-[#584B8A] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90">
                  {locale === 'en' ? 'Get Started' : '免费开始'}
                </button>
                <button className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink2 hover:bg-canvas">
                  {locale === 'en' ? 'Documentation' : '查看文档'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex flex-col text-left">
                <span className="mb-1 text-[10px] font-bold tracking-wider text-[#584B8A] uppercase">
                  Next-Gen UI
                </span>
                <h3 className="text-sm font-bold text-ink">
                  {locale === 'en' ? 'Design Systems for Coders' : '专为独立开发者设计的交互指南'}
                </h3>
                <p className="mt-1 text-[11px] text-muted">
                  {locale === 'en' ? 'Instant patterns & ready prompts.' : '看得懂、叫得出名字、说得清 Prompt。'}
                </p>
                <div className="mt-3">
                  <button className="rounded bg-[#584B8A] px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                    {locale === 'en' ? 'Explore 70+ Patterns' : '浏览 70+ 图鉴'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-line bg-canvas p-2.5 shadow-sm">
                <div className="mb-2 flex items-center justify-between border-b border-line2 pb-1.5">
                  <span className="h-2 w-10 rounded bg-ink/20" />
                  <span className="h-2 w-4 rounded bg-[#584B8A]/30" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded bg-ink/10" />
                  <div className="h-2 w-4/5 rounded bg-ink/10" />
                  <div className="h-5 w-full rounded border border-line bg-surface" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 3. Bento Grid (便当盒网格) ---------------- */

export function BentoGridDemo() {
  const locale = useLocale();
  const [activeLayout, setActiveLayout] = useState<'A' | 'B'>('A');

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Bento Grid combines asymmetric cards of different weights into an orderly, modern mosaic.'
          : '便当盒网格通过主次分明的非对称卡片，在不打破统一外轮廓的前提下形成现代拼图节奏。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <DemoButton
            variant={activeLayout === 'A' ? 'primary' : 'secondary'}
            onClick={() => setActiveLayout('A')}
          >
            {locale === 'en' ? 'Layout A (Hero Left)' : '排列 A：核心居左'}
          </DemoButton>
          <DemoButton
            variant={activeLayout === 'B' ? 'primary' : 'secondary'}
            onClick={() => setActiveLayout('B')}
          >
            {locale === 'en' ? 'Layout B (Hero Top)' : '排列 B：核心通栏'}
          </DemoButton>
        </div>

        <div className="w-full max-w-[480px]">
          {activeLayout === 'A' ? (
            <div className="grid grid-cols-3 gap-2.5 transition-all">
              {/* 大焦点卡片 */}
              <div className="col-span-2 flex flex-col justify-between rounded-xl border border-line bg-gradient-to-br from-[#F2F0F7] to-surface p-3.5 shadow-card">
                <div>
                  <div className="inline-block rounded bg-[#584B8A] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                    Core AI
                  </div>
                  <h4 className="mt-1.5 text-xs font-bold text-ink">
                    {locale === 'en' ? 'Intelligent Pattern Synthesis' : '智能交互模式解构'}
                  </h4>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {locale === 'en' ? 'Decomposes UI into 3-tier actionable prompts.' : '将界面需求拆分为三层高可用提示词。'}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between rounded border border-line bg-surface/80 p-2">
                  <TrendingUp className="h-3.5 w-3.5 text-[#584B8A]" />
                  <span className="font-mono text-[10px] font-semibold text-[#584B8A]">99.8% Precision</span>
                </div>
              </div>

              {/* 右侧两个紧凑卡片 */}
              <div className="col-span-1 flex flex-col gap-2.5">
                <div className="rounded-xl border border-line bg-surface p-2.5 shadow-card">
                  <span className="text-[10px] font-bold text-ink">
                    {locale === 'en' ? 'Zero Latency' : '零依赖'}
                  </span>
                  <p className="text-[9px] text-muted">
                    {locale === 'en' ? 'Pure SSG static.' : '静态纯净无运行时。'}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-surface p-2.5 shadow-card">
                  <span className="text-[10px] font-bold text-ink">
                    {locale === 'en' ? 'WCAG AA' : '无障碍'}
                  </span>
                  <p className="text-[9px] text-muted">
                    {locale === 'en' ? 'High contrast.' : '高对比色彩校验。'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 transition-all">
              {/* 顶部通栏大卡 */}
              <div className="col-span-2 flex items-center justify-between rounded-xl border border-line bg-surface p-3 shadow-card">
                <div>
                  <span className="text-[11px] font-bold text-ink">
                    {locale === 'en' ? 'Global Multi-Platform Design' : '全生态设计资产'}
                  </span>
                  <p className="text-[10px] text-muted">
                    {locale === 'en' ? 'Supporting Web, iOS, Android and HarmonyOS.' : '覆盖 Web、iOS、安卓及鸿蒙专属组件。'}
                  </p>
                </div>
                <div className="rounded bg-[#584B8A]/10 px-2 py-1 font-mono text-[10px] font-bold text-[#584B8A]">
                  4 Platforms
                </div>
              </div>
              <div className="rounded-xl border border-line bg-surface p-3 shadow-card">
                <span className="text-[10px] font-bold text-ink">
                  {locale === 'en' ? 'Interactive Sandbox' : '可交互沙盒'}
                </span>
                <p className="text-[9px] text-muted">
                  {locale === 'en' ? 'Live micro-demos.' : '即点即测组件行为。'}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-surface p-3 shadow-card">
                <span className="text-[10px] font-bold text-ink">
                  {locale === 'en' ? 'Natural Search' : '自然口语映射'}
                </span>
                <p className="text-[9px] text-muted">
                  {locale === 'en' ? 'Fuzzy colloquial index.' : '小白日常用语秒查。'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 4. Masonry (瀑布流) ---------------- */

export function MasonryDemo() {
  const locale = useLocale();
  const [cols, setCols] = useState<2 | 3>(2);

  const items = [
    { id: 1, h: 'h-20', title: 'Mountain Cabin', tag: 'Landscape', color: 'bg-emerald-50' },
    { id: 2, h: 'h-32', title: 'Minimal Watchmaker Product', tag: 'Industrial', color: 'bg-blue-50' },
    { id: 3, h: 'h-24', title: 'Typography Specimen', tag: 'Editorial', color: 'bg-amber-50' },
    { id: 4, h: 'h-28', title: 'Architectural Shadow', tag: 'Architecture', color: 'bg-purple-50' },
    { id: 5, h: 'h-16', title: 'Color Palette Card', tag: 'Branding', color: 'bg-rose-50' },
  ];

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Masonry flows variable-height cards tightly without awkward vertical gaps at the bottom.'
          : '瀑布流让不同高矮的卡片自适应贴合填补缝隙，彻底消灭底部大面积割裂空白。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <DemoButton
            variant={cols === 2 ? 'primary' : 'secondary'}
            onClick={() => setCols(2)}
          >
            <Columns2 className="mr-1 h-3.5 w-3.5" />
            {locale === 'en' ? '2 Columns' : '双列排列'}
          </DemoButton>
          <DemoButton
            variant={cols === 3 ? 'primary' : 'secondary'}
            onClick={() => setCols(3)}
          >
            <Columns3 className="mr-1 h-3.5 w-3.5" />
            {locale === 'en' ? '3 Columns' : '三列排列'}
          </DemoButton>
        </div>

        <div className={`w-full max-w-[480px] gap-2.5 transition-all ${cols === 2 ? 'columns-2' : 'columns-3'}`}>
          {items.map((item) => (
            <div
              key={item.id}
              className={`mb-2.5 break-inside-avoid rounded-xl border border-line bg-surface p-2.5 shadow-card transition-all ${item.color}`}
            >
              <div className={`w-full rounded-md border border-line/60 bg-white/70 ${item.h} flex items-center justify-center`}>
                <span className="font-mono text-[9px] text-muted">{item.tag}</span>
              </div>
              <div className="mt-2">
                <span className="block text-[10px] font-semibold text-ink">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 5. Split Screen (双栏分屏) ---------------- */

export function SplitScreenDemo() {
  const locale = useLocale();
  const [isMobile, setIsMobile] = useState(false);

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Desktop splits brand storytelling and interactive forms 50/50, collapsing to a single pane on mobile.'
          : '桌面端 50/50 均衡兼顾品牌故事与任务表单，移动端智能折叠聚焦操作区。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <DemoButton
          variant={isMobile ? 'primary' : 'secondary'}
          onClick={() => setIsMobile(!isMobile)}
        >
          {isMobile ? (
            <>
              <Monitor className="mr-1.5 h-3.5 w-3.5" />
              {locale === 'en' ? 'Switch to Desktop (50/50)' : '切换到桌面端 (50/50 对分)'}
            </>
          ) : (
            <>
              <Smartphone className="mr-1.5 h-3.5 w-3.5" />
              {locale === 'en' ? 'Simulate Mobile Collapse' : '模拟移动端智能折叠'}
            </>
          )}
        </DemoButton>

        <div
          className={`overflow-hidden rounded-xl border border-line bg-surface shadow-lift transition-all duration-300 ${
            isMobile ? 'w-[260px]' : 'w-full max-w-[480px]'
          }`}
        >
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {/* 品牌视觉侧 */}
            <div
              className={`flex flex-col justify-between bg-ink p-4 text-surface transition-all ${
                isMobile ? 'border-b border-line py-3' : 'min-h-[180px]'
              }`}
            >
              <div>
                <span className="font-mono text-[10px] text-[#584B8A] uppercase">Field Guide</span>
                <h4 className="mt-1 text-xs font-bold leading-tight">
                  {locale === 'en' ? 'Craft Meets Code' : '设计与工程合流'}
                </h4>
              </div>
              {!isMobile && (
                <p className="text-[9px] text-[#A6A29A]">
                  {locale === 'en' ? '“The definitive visual dictionary for builders.”' : '“AI 独立开发者的常备视觉词典。”'}
                </p>
              )}
            </div>

            {/* 交互表单侧 */}
            <div className="flex flex-col justify-center bg-surface p-4">
              <span className="text-[11px] font-bold text-ink">
                {locale === 'en' ? 'Sign In' : '账号登录'}
              </span>
              <div className="mt-2 space-y-1.5">
                <div className="h-6 w-full rounded border border-line bg-canvas px-2 text-[9px] leading-6 text-muted">
                  name@company.com
                </div>
                <div className="h-6 w-full rounded border border-line bg-canvas px-2 text-[9px] leading-6 text-muted">
                  ••••••••••••
                </div>
              </div>
              <button className="mt-3 w-full rounded bg-[#584B8A] py-1 text-[10px] font-medium text-white shadow-sm">
                {locale === 'en' ? 'Continue' : '立即进入'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 6. Sidebar Layout (应用侧栏架构) ---------------- */

export function SidebarLayoutDemo() {
  const locale = useLocale();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Sidebar App Shell isolates navigation from workspace scrolling, supporting collapsible rail states.'
          : '应用外壳锁死视口高度，侧栏保持独立常驻，主画布区域独立滚动。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <DemoButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <>
              <PanelLeftOpen className="mr-1.5 h-3.5 w-3.5" />
              {locale === 'en' ? 'Expand Sidebar' : '展开完整侧栏'}
            </>
          ) : (
            <>
              <PanelLeftClose className="mr-1.5 h-3.5 w-3.5" />
              {locale === 'en' ? 'Collapse to Rail' : '折叠为紧凑导轨 (Rail)'}
            </>
          )}
        </DemoButton>

        <div className="flex h-[200px] w-full max-w-[480px] overflow-hidden rounded-xl border border-line bg-surface shadow-card">
          {/* 侧栏 */}
          <div
            className={`flex flex-col border-r border-line bg-canvas p-2.5 transition-all duration-300 ${
              collapsed ? 'w-12 items-center' : 'w-36'
            }`}
          >
            <div className="flex items-center gap-2 pb-2">
              <div className="h-4 w-4 rounded bg-[#584B8A]" />
              {!collapsed && <span className="font-bold text-[10px] text-ink">Workspace</span>}
            </div>
            <div className="mt-2 flex flex-1 flex-col gap-1">
              <div className="flex h-5 items-center rounded bg-surface px-1.5 text-[9px] font-medium text-ink shadow-sm">
                <Layout className="h-3 w-3 text-[#584B8A]" />
                {!collapsed && <span className="ml-1.5 truncate">Overview</span>}
              </div>
              <div className="flex h-5 items-center rounded px-1.5 text-[9px] text-muted hover:bg-surface/50">
                <Layers className="h-3 w-3" />
                {!collapsed && <span className="ml-1.5 truncate">Projects</span>}
              </div>
            </div>
          </div>

          {/* 主画布与独立滚动区 */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* 顶栏 */}
            <div className="flex h-7 items-center justify-between border-b border-line px-3 text-[10px] text-muted">
              <span>Home / Overview</span>
              <span className="rounded bg-canvas px-1 text-[9px]">⌘K</span>
            </div>
            {/* 滚动区 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="rounded-lg border border-line bg-surface p-2 shadow-card">
                <span className="text-[10px] font-bold text-ink">Active Sprint</span>
                <div className="mt-1 h-2 w-3/4 rounded bg-ink/10" />
              </div>
              <div className="rounded-lg border border-line bg-surface p-2 shadow-card">
                <span className="text-[10px] font-bold text-ink">Team Activity</span>
                <div className="mt-1 h-2 w-1/2 rounded bg-ink/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 7. Sticky Bar (粘性悬浮栏) ---------------- */

export function StickyBarDemo() {
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Sticky Bar pins to the viewport top when scrolled past, acquiring frosted glass and subtle elevation.'
          : '粘性悬浮栏滚动越过阈值后自动吸附于顶部，呈现毛玻璃与防视觉穿透微阴影。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <DemoButton onClick={() => setScrolled(!scrolled)}>
          {scrolled ? (
            locale === 'en' ? 'Reset to Top' : '回到顶部状态'
          ) : (
            locale === 'en' ? 'Simulate Scroll Down' : '模拟向下滚动'
          )}
        </DemoButton>

        <div className="relative h-[200px] w-full max-w-[460px] overflow-hidden rounded-xl border border-line bg-canvas shadow-card">
          {/* 吸顶栏 */}
          <div
            className={`sticky top-0 z-10 flex h-9 items-center justify-between px-3 transition-all duration-300 ${
              scrolled
                ? 'border-b border-line bg-surface/85 shadow-sm backdrop-blur-md'
                : 'border-b border-transparent bg-surface'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#584B8A]" />
              <span className="text-[11px] font-bold text-ink">Acme Cloud</span>
            </div>
            <button className="rounded bg-[#584B8A] px-2 py-0.5 text-[9px] font-medium text-white shadow-sm">
              {locale === 'en' ? 'Deploy' : '立即部署'}
            </button>
          </div>

          {/* 可视滚动内容 */}
          <div className="p-3 space-y-3">
            <div className="rounded-lg border border-line bg-surface p-3">
              <span className="text-[11px] font-bold text-ink">Section 1: Setup</span>
              <p className="mt-1 text-[10px] text-muted">
                Configure build settings and environmental variables before deployment.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-3">
              <span className="text-[11px] font-bold text-ink">Section 2: Build Pipeline</span>
              <p className="mt-1 text-[10px] text-muted">
                Automated continuous integration triggers static SSG exports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ---------------- 8. Full-Bleed (全宽通栏带) ---------------- */

export function FullBleedDemo() {
  const locale = useLocale();
  const [isFullBleed, setIsFullBleed] = useState(true);

  return (
    <DemoStage
      caption={
        locale === 'en'
          ? 'Full-Bleed sections stretch edge-to-edge across the screen while keeping internal content constrained.'
          : '全宽通栏带在背景上突破版心横向铺满视口两端，内部文本依然对齐版心，注入空间节奏感。'
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <DemoButton onClick={() => setIsFullBleed(!isFullBleed)}>
          {isFullBleed ? (
            <>
              <Minimize2 className="mr-1.5 h-3.5 w-3.5" />
              {locale === 'en' ? 'Constrain to Box' : '普通版心收拢'}
            </>
          ) : (
            <>
              <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
              {locale === 'en' ? 'Breakout to Full-Bleed' : '突破版心全宽通栏'}
            </>
          )}
        </DemoButton>

        {/* 视窗沙盒 */}
        <div className="w-full max-w-[480px] overflow-hidden rounded-xl border border-line bg-[#ECE9E2] p-3 shadow-card">
          <div className="flex flex-col gap-2 rounded-lg bg-surface p-2 shadow-sm">
            {/* 上节段（版心内） */}
            <div className="mx-auto w-3/4 rounded border border-dashed border-line p-2 text-center text-[10px] text-muted">
              Standard Section (In Container)
            </div>

            {/* 通栏对比区 */}
            <div
              className={`rounded py-3 text-center transition-all duration-300 ${
                isFullBleed
                  ? '-mx-2 w-[calc(100%+16px)] bg-ink text-surface shadow-sm'
                  : 'mx-auto w-3/4 border border-line bg-canvas text-ink'
              }`}
            >
              <span className="block text-[11px] font-bold">
                {isFullBleed ? 'Full-Bleed Metric Band' : 'Boxed Metric Band'}
              </span>
              <span className="text-[9px] opacity-75">
                {isFullBleed ? 'Edge-to-edge background breakout' : 'Constrained within container'}
              </span>
            </div>

            {/* 下节段（版心内） */}
            <div className="mx-auto w-3/4 rounded border border-dashed border-line p-2 text-center text-[10px] text-muted">
              Follow-up Section (In Container)
            </div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}
