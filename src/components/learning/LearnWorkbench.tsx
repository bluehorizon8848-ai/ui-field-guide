'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useHref, useLocale } from '@/components/layout/LocaleProvider';
import { DemoById } from '@/components/demo/DemoById';
import {
  allLessonItems,
  learnWorkbenchData,
  lessonItemById,
  type LearnLessonItem,
  type LearnLevelGroup,
} from '@/data/learnWorkbenchData';
import { MiniPreview } from './MiniPreview';

const TOTAL_LESSONS = 36;
const LAST_LESSON_KEY = 'uifg.lastLesson.v1';

export function LearnWorkbench() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const h = useHref();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { learned, isLearned, toggle, mark, unmark } = useProgress();

  // 过滤出 36 项学习路径中的已学项，保证分母 strictly 36
  const learned36Set = useMemo(() => {
    const validIds = new Set(allLessonItems.map((it) => it.id));
    return new Set(learned.filter((id) => validIds.has(id)));
  }, [learned]);

  const totalLearnedCount = learned36Set.size;
  const overallPct = Math.round((totalLearnedCount / TOTAL_LESSONS) * 100);

  // 视图与选中状态
  const [viewMode, setViewMode] = useState<'level' | 'lesson'>('level');
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [currentSlug, setCurrentSlug] = useState<string>('button');
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1]));

  // 单课微交互状态
  const [quizRevealed, setQuizRevealed] = useState<boolean>(false);
  const [selfMastered, setSelfMastered] = useState<boolean>(false);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 弹窗与抽屉
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [showReturnBanner, setShowReturnBanner] = useState<boolean>(false);
  const [undoToast, setUndoToast] = useState<{ id: string; name: string } | null>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 当前课程对象
  const currentItem = useMemo(() => {
    return lessonItemById.get(currentSlug) || allLessonItems[0];
  }, [currentSlug]);

  // 当前 Level 对象
  const currentLevelGroup = useMemo(() => {
    return (
      learnWorkbenchData.levels.find((l) => l.level === currentLevel) ||
      learnWorkbenchData.levels[0]
    );
  }, [currentLevel]);

  // 从 URL 读取参数
  const parseUrlState = useCallback(() => {
    const itemParam = searchParams.get('item');
    const levelParam = searchParams.get('level');
    const fromParam = searchParams.get('from');

    if (fromParam === 'learn') {
      setShowReturnBanner(true);
    }

    if (itemParam && lessonItemById.has(itemParam)) {
      const it = lessonItemById.get(itemParam)!;
      setViewMode('lesson');
      setCurrentSlug(it.id);
      setCurrentLevel(it.level);
      setExpandedLevels((prev) => new Set([...prev, it.level]));
      try {
        localStorage.setItem(LAST_LESSON_KEY, it.id);
      } catch {}
    } else if (levelParam && ['1', '2', '3'].includes(levelParam)) {
      const lvlNum = parseInt(levelParam, 10) as 1 | 2 | 3;
      setViewMode('level');
      setCurrentLevel(lvlNum);
      setExpandedLevels((prev) => new Set([...prev, lvlNum]));
    } else {
      // 默认策略：若本地有记录则恢复，若无则展示 Level 1 总览
      let lastId: string | null = null;
      try {
        lastId = localStorage.getItem(LAST_LESSON_KEY);
      } catch {}
      if (lastId && lessonItemById.has(lastId)) {
        const it = lessonItemById.get(lastId)!;
        setViewMode('lesson');
        setCurrentSlug(it.id);
        setCurrentLevel(it.level);
        setExpandedLevels((prev) => new Set([...prev, it.level]));
      } else {
        setViewMode('level');
        setCurrentLevel(1);
        setExpandedLevels(new Set([1]));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    parseUrlState();
  }, [parseUrlState]);

  // 切换课程后重置单课瞬时状态
  useEffect(() => {
    setQuizRevealed(false);
    setSelfMastered(false);
  }, [currentSlug]);

  // URL 同步辅助函数
  const syncUrl = useCallback(
    (mode: 'level' | 'lesson', slugOrLevel: string | number) => {
      const url = new URL(window.location.href);
      url.searchParams.delete('item');
      url.searchParams.delete('level');
      url.searchParams.delete('from');

      if (mode === 'level') {
        url.searchParams.set('level', String(slugOrLevel));
      } else {
        url.searchParams.set('item', String(slugOrLevel));
      }

      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new Event('locationchange'));
    },
    []
  );

  // 动作：进入章节总览
  const handleSelectLevelOverview = (lvl: 1 | 2 | 3) => {
    setViewMode('level');
    setCurrentLevel(lvl);
    setExpandedLevels((prev) => new Set([...prev, lvl]));
    setMobileDrawerOpen(false);
    syncUrl('level', lvl);
  };

  // 动作：折叠/展开左侧手风琴
  const handleToggleAccordion = (lvl: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(lvl)) {
        next.delete(lvl);
      } else {
        next.add(lvl);
      }
      return next;
    });
  };

  // 动作：选中并进入课程
  const handleSelectLesson = (slug: string) => {
    const item = lessonItemById.get(slug);
    if (!item) return;

    setViewMode('lesson');
    setCurrentSlug(slug);
    setCurrentLevel(item.level);
    setExpandedLevels((prev) => new Set([...prev, item.level]));
    setMobileDrawerOpen(false);
    try {
      localStorage.setItem(LAST_LESSON_KEY, slug);
    } catch {}
    syncUrl('lesson', slug);
  };

  // 动作：开始或继续本章学习
  const handleStartOrResumeLevel = (lvlGroup: LearnLevelGroup) => {
    const unlearned = lvlGroup.items.find((it) => !learned36Set.has(it.id));
    if (unlearned) {
      handleSelectLesson(unlearned.id);
    } else {
      handleSelectLesson(lvlGroup.items[0].id);
    }
  };

  // 动作：上一课 / 下一课
  const handlePrevLesson = () => {
    const curIdx = currentItem.globalIndex;
    if (curIdx > 0) {
      handleSelectLesson(allLessonItems[curIdx - 1].id);
    }
  };

  const handleNextLesson = () => {
    const curIdx = currentItem.globalIndex;
    if (curIdx < allLessonItems.length - 1) {
      handleSelectLesson(allLessonItems[curIdx + 1].id);
    }
  };

  // 动作：标记完成 / 撤销完成
  const handleToggleCurrentCompletion = () => {
    const isDone = learned36Set.has(currentItem.id);
    if (isDone) {
      unmark(currentItem.id);
      if (undoToast?.id === currentItem.id) {
        setUndoToast(null);
      }
    } else {
      mark(currentItem.id);
      // 触发 6 秒可撤销 Toast
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      setUndoToast({ id: currentItem.id, name: currentItem.name });
      undoTimerRef.current = setTimeout(() => {
        setUndoToast(null);
      }, 6000);
    }
  };

  const handleUndoToastAction = () => {
    if (undoToast) {
      unmark(undoToast.id);
      setUndoToast(null);
    }
  };

  // 动作：复制 Prompt
  const handleCopyPrompt = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isCurrentDone = learned36Set.has(currentItem.id);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-canvas text-ink">
      {/* 词条页返回提示横幅 */}
      {showReturnBanner && (
        <div
          id="return-from-detail-banner"
          className="border-b border-accent/20 bg-[#EBF4F0] px-4 py-2.5 text-xs text-ink"
        >
          <div className="container-page flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-medium">
                {isZh
                  ? '您已从完整词条返回学习工作台。已为您保留当前课程上下文。'
                  : 'Returned to Learn workbench from full pattern entry. Context preserved.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowReturnBanner(false)}
              className="text-muted hover:text-ink font-bold"
              aria-label="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 顶部轻量全局进度条与断点续学 */}
      <div className="border-b border-line bg-surface/60 backdrop-blur-xs">
        <div className="container-page flex h-11 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {isZh ? '学习进度' : 'Progress'}
            </span>
            <div className="flex items-center gap-2">
              <div
                role="progressbar"
                aria-valuenow={totalLearnedCount}
                aria-valuemin={0}
                aria-valuemax={TOTAL_LESSONS}
                className="h-1.5 w-24 sm:w-36 overflow-hidden rounded-full bg-line"
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold tabular-nums text-ink">
                {totalLearnedCount} / {TOTAL_LESSONS}
              </span>
              <span className="hidden text-2xs text-muted sm:inline">({overallPct}%)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 续学入口胶囊 */}
            {totalLearnedCount > 0 && totalLearnedCount < TOTAL_LESSONS && (
              <button
                type="button"
                onClick={() => {
                  const unlearned = allLessonItems.find((it) => !learned36Set.has(it.id));
                  if (unlearned) handleSelectLesson(unlearned.id);
                }}
                className="hidden min-h-[36px] items-center gap-1.5 rounded-full border border-accent/30 bg-[#EBF4F0] px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent hover:text-white sm:inline-flex"
              >
                <Sparkles size={13} aria-hidden="true" />
                <span>{isZh ? '继续学习' : 'Resume'}</span>
              </button>
            )}

            {/* 移动端打开目录按钮 */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1 text-xs font-medium text-ink md:hidden"
            >
              <BookOpen size={14} aria-hidden="true" />
              <span>{isZh ? '学习大纲' : 'Outline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 工作台主体双栏架构 (Minimal Documentation Workspace) */}
      <div className="container-page flex min-h-[calc(100vh-6.25rem)]">
        {/* ================= 左侧课程目录 (Desktop) ================= */}
        <aside
          aria-label={isZh ? '课程大纲' : 'Curriculum'}
          className="hidden w-64 shrink-0 border-r border-line py-5 pr-4 md:block lg:w-72"
        >
          {/* 目录标题区：纯净文字，无浅色填充背景 */}
          <div className="mb-3 flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              {isZh ? '课程体系' : 'Curriculum'}
            </h2>
            <span className="text-2xs text-muted font-mono">
              3 Levels · 36 Items
            </span>
          </div>

          {/* 三级手风琴列表 */}
          <nav className="space-y-3">
            {learnWorkbenchData.levels.map((lvl) => {
              const isExpanded = expandedLevels.has(lvl.level);
              const lvlDone = lvl.items.filter((it) => learned36Set.has(it.id)).length;
              const lvlTotal = lvl.items.length;
              const isLvlComplete = lvlDone === lvlTotal;
              const isLvlActive = viewMode === 'level' && currentLevel === lvl.level;

              return (
                <div key={lvl.level} className="overflow-hidden">
                  {/* Level 标题行：点击标题进总览，独立箭头控折叠 */}
                  <div
                    className={`flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors ${
                      isLvlActive
                        ? 'bg-line/50 font-semibold text-ink'
                        : 'hover:bg-line/30 text-ink2'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectLevelOverview(lvl.level)}
                      className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isLvlComplete
                            ? 'bg-accent'
                            : lvlDone > 0
                            ? 'bg-amber-500'
                            : 'bg-muted/40'
                        }`}
                      />
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-bold text-ink">{lvl.subtitle}</span>
                          <span className="truncate text-muted">
                            {isZh ? lvl.nameZh : lvl.nameEn}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0 pl-1">
                      <span className="font-mono text-2xs tabular-nums text-muted">
                        {lvlDone}/{lvlTotal}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleToggleAccordion(lvl.level, e)}
                        aria-label={`Toggle ${lvl.subtitle} accordion`}
                        aria-expanded={isExpanded}
                        className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-line/60 hover:text-ink transition"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* 展开的课程条目 */}
                  {isExpanded && (
                    <ul className="mt-1 space-y-0.5 border-l border-line/80 ml-3.5 pl-2">
                      {lvl.items.map((it) => {
                        const isSelected = viewMode === 'lesson' && it.id === currentSlug;
                        const isDone = learned36Set.has(it.id);

                        return (
                          <li key={it.id}>
                            <button
                              type="button"
                              onClick={() => handleSelectLesson(it.id)}
                              className={`group flex min-h-[44px] w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                                isSelected
                                  ? 'border-l-2 border-accent bg-accent/5 font-semibold text-accent'
                                  : isDone
                                  ? 'text-accent/90 hover:bg-line/30'
                                  : 'text-ink2 hover:bg-line/30 hover:text-ink'
                              }`}
                              aria-current={isSelected ? 'true' : undefined}
                            >
                              <div className="flex min-w-0 items-center gap-2 truncate">
                                {isDone ? (
                                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-line text-[9px] text-muted">
                                    {it.globalIndex + 1}
                                  </span>
                                )}
                                <span className="truncate">
                                  {it.name}{' '}
                                  <span className="text-muted font-normal">
                                    {isZh ? it.chineseName : ''}
                                  </span>
                                </span>
                              </div>
                              {isSelected && (
                                <span className="shrink-0 text-2xs font-mono text-accent">
                                  {isZh ? '当前' : 'Active'}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ================= 右侧工作台正文 ================= */}
        <main className="flex-1 min-w-0 py-6 md:pl-8">
          {/* 模式 A：Chapter Overview 章节总览视图 */}
          {viewMode === 'level' && (
            <div className="animate-fade-in space-y-8">
              {/* 总览头部 */}
              <div className="border-b border-line pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="meta">{currentLevelGroup.subtitle}</span>
                  <span aria-hidden="true" className="text-lineDark">·</span>
                  <span className="meta">
                    {isZh ? '核心界面知识库' : 'Core UI Knowledge'}
                  </span>
                </div>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {isZh ? currentLevelGroup.nameZh : currentLevelGroup.nameEn}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink2">
                  {isZh
                    ? currentLevelGroup.descriptionZh
                    : currentLevelGroup.descriptionEn}
                </p>

                {/* 章节完成度与主行动 CTA */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4">
                  <div>
                    <p className="text-xs font-semibold text-muted">
                      {isZh ? '本章掌握度' : 'Chapter Mastery'}
                    </p>
                    <p className="mt-1 font-mono text-xl font-bold text-ink">
                      {currentLevelGroup.items.filter((it) => learned36Set.has(it.id)).length} /{' '}
                      {currentLevelGroup.items.length}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartOrResumeLevel(currentLevelGroup)}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-ink2"
                  >
                    <span>
                      {currentLevelGroup.items.every((it) => learned36Set.has(it.id))
                        ? isZh
                          ? '🎉 本章已全部掌握 (点击温习)'
                          : '🎉 Chapter Completed (Review)'
                        : isZh
                        ? `开始本章学习: ${
                            currentLevelGroup.items.find((it) => !learned36Set.has(it.id))?.name ||
                            currentLevelGroup.items[0].name
                          }`
                        : `Start Lesson: ${
                            currentLevelGroup.items.find((it) => !learned36Set.has(it.id))?.name ||
                            currentLevelGroup.items[0].name
                          }`}
                    </span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* 组件微缩视觉网格目录 */}
              <div>
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="text-sm font-bold text-ink">
                    {isZh ? '组件视觉目录' : 'Visual Catalog'}
                  </h3>
                  <span className="text-xs text-muted">
                    {currentLevelGroup.items.length} {isZh ? '项组件' : 'Items'}
                  </span>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {currentLevelGroup.items.map((it) => {
                    const isDone = learned36Set.has(it.id);

                    return (
                      <div
                        key={it.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectLesson(it.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectLesson(it.id);
                          }
                        }}
                        className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-lineDark hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {/* 真实的微缩视觉预览画布 */}
                        <div className="relative flex h-28 w-full items-center justify-center border-b border-line/60 bg-[#FAF9F5] p-3 transition-colors group-hover:bg-[#F4F1EA]">
                          <MiniPreview id={it.id} />
                          <div className="absolute top-2 right-2">
                            {isDone ? (
                              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                ✓ {isZh ? '已学' : 'Done'}
                              </span>
                            ) : (
                              <span className="inline-block h-2 w-2 rounded-full bg-lineDark" />
                            )}
                          </div>
                        </div>

                        {/* 组件信息 */}
                        <div className="p-3.5 space-y-1">
                          <div className="flex items-baseline justify-between gap-1.5">
                            <span className="truncate text-sm font-bold text-ink group-hover:text-accent transition-colors">
                              {it.name}
                            </span>
                            <span className="truncate text-xs font-medium text-muted">
                              {it.chineseName}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-2xs leading-relaxed text-ink2">
                            {isZh ? it.oneLineZh : it.oneLineEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 模式 B：Lesson Detail 单课学习台视图 */}
          {viewMode === 'lesson' && (
            <div className="animate-fade-in space-y-8 pb-16">
              {/* 返回总览面包屑与课程元信息 */}
              <div>
                <nav aria-label="Breadcrumb" className="mb-3">
                  <button
                    type="button"
                    onClick={() => handleSelectLevelOverview(currentItem.level)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors"
                  >
                    <ArrowLeft size={13} aria-hidden="true" />
                    <span>
                      {isZh
                        ? `返回 Level ${currentItem.level} 章节总览`
                        : `Return to Level ${currentItem.level} Overview`}
                    </span>
                  </button>
                </nav>

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="meta">{currentItem.category.toUpperCase()}</span>
                      <span aria-hidden="true" className="text-lineDark">·</span>
                      <span className="meta">
                        {isZh
                          ? `第 ${currentItem.globalIndex + 1} / 36 课`
                          : `Lesson ${currentItem.globalIndex + 1} of 36`}
                      </span>
                      {isCurrentDone && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-2xs font-semibold text-emerald-800">
                          ✓ {isZh ? '本课已学完' : 'Completed'}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
                      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        {currentItem.name}
                      </h1>
                      <span className="text-base text-muted font-normal">
                        {currentItem.chineseName}
                      </span>
                    </div>
                  </div>

                  {/* 独立完整词条跳转链接（支持 ?from=learn 往返） */}
                  <Link
                    href={h(`/patterns/${currentItem.id}?from=learn`)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-line/40 hover:text-accent"
                  >
                    <span>{isZh ? '查看完整词条' : 'View Full Entry'}</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </Link>
                </div>

                <p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink">
                  {isZh ? currentItem.oneLineZh : currentItem.oneLineEn}
                </p>
              </div>

              {/* STEP 1: 认出它 · Live Interactive Demo (真正复用 React 组件) */}
              <section className="space-y-3">
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                      {isZh ? '01 · 认出它' : '01 · IDENTIFY'}
                    </h2>
                    <span className="text-lineDark">/</span>
                    <span className="text-xs font-medium text-ink2">
                      Live Interactive Demo
                    </span>
                  </div>
                </header>

                <div className="rounded-lg bg-surface/70 border border-line/60 p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#F2F0EB] px-2 py-0.5 text-2xs font-medium text-ink2">
                      {isZh ? currentItem.analogyBadgeZh : currentItem.analogyBadgeEn}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {isZh ? currentItem.analogyDescZh : currentItem.analogyDescEn}
                  </p>
                </div>

                {/* 真实 Demo 边界宿主（无嵌套白色在浅灰之类套娃，保持纯净） */}
                <div className="mt-3">
                  <DemoById id={currentItem.id} key={currentItem.id} />
                </div>
              </section>

              {/* STEP 2: 选对它 · 适用边界与核心辨析 */}
              <section className="space-y-4 pt-4 border-t border-line">
                <header className="flex items-center gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                    {isZh ? '02 · 选对它' : '02 · SELECTION'}
                  </h2>
                  <span className="text-lineDark">/</span>
                  <span className="text-xs font-medium text-ink2">
                    {isZh ? '适用边界与核心辨析' : 'Boundary & Comparison'}
                  </span>
                </header>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* When to use */}
                  <div className="rounded-xl border border-line bg-surface p-4">
                    <h3 className="text-xs font-bold text-accent">
                      {isZh ? '什么时候该用' : 'When to Use'}
                    </h3>
                    <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-ink2">
                      {((isZh ? currentItem.whenToUseZh : currentItem.whenToUseEn) || []).map(
                        (w, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-accent">•</span>
                            <span>{typeof w === 'string' ? w : w.situation}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* When not to use */}
                  <div className="rounded-xl border border-line bg-surface p-4">
                    <h3 className="text-xs font-bold text-danger">
                      {isZh ? '什么时候不该用' : 'When NOT to Use'}
                    </h3>
                    <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-ink2">
                      {((isZh ? currentItem.whenNotToUseZh : currentItem.whenNotToUseEn) || []).map(
                        (nw, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-danger">•</span>
                            <span>{nw}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* 核心对比法则 */}
                <div
                  className="rounded-xl border border-line/80 bg-surface/50 p-4 text-xs leading-relaxed text-ink2"
                  dangerouslySetInnerHTML={{
                    __html: isZh ? currentItem.comparisonZh : currentItem.comparisonEn,
                  }}
                />
              </section>

              {/* STEP 3: 记住它 · 场景微自检 (非强制翻转卡) */}
              <section className="space-y-3 pt-4 border-t border-line">
                <header className="flex items-center gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                    {isZh ? '03 · 记住它' : '03 · RECALL'}
                  </h2>
                  <span className="text-lineDark">/</span>
                  <span className="text-xs font-medium text-ink2">
                    {isZh ? '场景微自检 (非强制)' : 'Scenario Self-Check (Optional)'}
                  </span>
                </header>

                <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
                  <p className="text-xs font-semibold text-muted">
                    {isZh ? '场景思考题：' : 'Scenario Question:'}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {isZh ? currentItem.quizQuestionZh : currentItem.quizQuestionEn}
                  </p>

                  {!quizRevealed ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setQuizRevealed(true)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-[#FAF9F5] px-4 py-2 text-xs font-semibold text-ink transition hover:bg-line/40"
                      >
                        <span>
                          {isZh
                            ? '点击翻转查看推荐解法与解析'
                            : 'Click to Reveal Solution & Rationale'}
                        </span>
                        <ChevronRight size={13} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg border border-accent/20 bg-[#EBF4F0] p-3.5 animate-fade-in">
                      <p className="text-xs font-bold text-accent">
                        {isZh ? '【设计推荐解析】' : '[Design Rationale]'}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">
                        {isZh ? currentItem.quizAnswerZh : currentItem.quizAnswerEn}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-accent/20 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelfMastered(true)}
                          className={`inline-flex min-h-[36px] items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                            selfMastered
                              ? 'bg-accent text-white'
                              : 'text-accent hover:bg-accent/10'
                          }`}
                        >
                          <Check size={13} aria-hidden="true" />
                          <span>
                            {selfMastered
                              ? isZh
                                ? '已记录：能自如说明'
                                : 'Recorded: Clear on usage'
                              : isZh
                              ? '✓ 我能说明它的适用场景了'
                              : 'I can explain its use case'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuizRevealed(false)}
                          className="text-2xs text-muted hover:text-ink"
                        >
                          {isZh ? '收起解析' : 'Hide'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* STEP 4: 抄走它 · 交付给 AI 的 Prompt 模板 (可折叠) */}
              <section className="space-y-3 pt-4 border-t border-line">
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                      {isZh ? '04 · 抄走它' : '04 · PROMPT'}
                    </h2>
                    <span className="text-lineDark">/</span>
                    <span className="text-xs font-medium text-ink2">
                      {isZh ? '交付给 AI 的需求模板' : 'Production Spec for AI'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPromptOpen(!promptOpen)}
                    className="flex min-h-[44px] items-center gap-1 text-xs font-medium text-muted hover:text-ink"
                  >
                    <span>{promptOpen ? (isZh ? '收起' : 'Collapse') : isZh ? '展开' : 'Expand'}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        promptOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </header>

                {promptOpen && (
                  <div className="space-y-3 rounded-xl border border-line bg-surface p-4 text-xs animate-fade-in">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">
                          {isZh ? '精细需求描述 (Detailed Spec)' : 'Detailed Spec'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyPrompt(
                              (isZh ? currentItem.aiPromptZh : currentItem.aiPromptEn).detailed,
                              'detailed'
                            )
                          }
                          className="inline-flex min-h-[32px] items-center gap-1 rounded bg-[#FAF9F5] px-2 py-1 font-mono text-2xs font-medium text-ink2 hover:bg-line/40"
                        >
                          <Copy size={11} aria-hidden="true" />
                          <span>{copiedKey === 'detailed' ? (isZh ? '已复制' : 'Copied!') : isZh ? '复制' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="mt-1 rounded bg-[#FAF9F5] p-2.5 font-mono text-ink2 leading-relaxed">
                        {(isZh ? currentItem.aiPromptZh : currentItem.aiPromptEn).detailed}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">
                          {isZh ? '工程实现要求 (Implementation)' : 'Implementation Spec'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyPrompt(
                              (isZh ? currentItem.aiPromptZh : currentItem.aiPromptEn).implementation,
                              'impl'
                            )
                          }
                          className="inline-flex min-h-[32px] items-center gap-1 rounded bg-[#FAF9F5] px-2 py-1 font-mono text-2xs font-medium text-ink2 hover:bg-line/40"
                        >
                          <Copy size={11} aria-hidden="true" />
                          <span>{copiedKey === 'impl' ? (isZh ? '已复制' : 'Copied!') : isZh ? '复制' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="mt-1 rounded bg-[#FAF9F5] p-2.5 font-mono text-ink2 leading-relaxed">
                        {(isZh ? currentItem.aiPromptZh : currentItem.aiPromptEn).implementation}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* 底部课程操作栏 (Desktop) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                <button
                  type="button"
                  onClick={handlePrevLesson}
                  disabled={currentItem.globalIndex === 0}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink transition hover:bg-line/40 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  <span>{isZh ? '上一课' : 'Previous'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleCurrentCompletion}
                  aria-pressed={isCurrentDone}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs transition ${
                    isCurrentDone
                      ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'border border-accent bg-accent text-white hover:bg-accentHover'
                  }`}
                >
                  <span>
                    {isCurrentDone
                      ? isZh
                        ? '✓ 已学完 (点击可撤销)'
                        : '✓ Completed (Click to undo)'
                      : isZh
                      ? '标记本课已学'
                      : 'Mark as Completed'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleNextLesson}
                  disabled={currentItem.globalIndex === allLessonItems.length - 1}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink transition hover:bg-line/40 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <span>{isZh ? '下一课' : 'Next'}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 移动端 64px 固底操作栏 (满足 44px 热区与状态机隔离) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 px-4 py-2 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-2">
          {/* 打开目录 */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line text-xs font-semibold text-ink"
            aria-label="Open catalog drawer"
          >
            <BookOpen size={16} aria-hidden="true" />
          </button>

          {/* 状态机互斥：章节总览模式下展示主行动，单课模式下展示上一课/标记/下一课 */}
          {viewMode === 'level' ? (
            <button
              type="button"
              onClick={() => handleStartOrResumeLevel(currentLevelGroup)}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink px-3 text-xs font-semibold text-white shadow-xs"
            >
              <span>
                {isZh ? '▶ 开始本章学习' : '▶ Start Chapter'}
              </span>
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={handlePrevLesson}
                disabled={currentItem.globalIndex === 0}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line text-xs text-ink disabled:opacity-30"
                aria-label="Previous lesson"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleToggleCurrentCompletion}
                aria-pressed={isCurrentDone}
                className={`flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-2 text-xs font-bold ${
                  isCurrentDone
                    ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'bg-accent text-white'
                }`}
              >
                {isCurrentDone ? (isZh ? '✓ 已学完' : '✓ Done') : isZh ? '标记已学' : 'Mark'}
              </button>
              <button
                type="button"
                onClick={handleNextLesson}
                disabled={currentItem.globalIndex === allLessonItems.length - 1}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line text-xs text-ink disabled:opacity-30"
                aria-label="Next lesson"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6 秒可撤销 Floating Toast */}
      {undoToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 z-50 flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-lg animate-fade-in sm:bottom-6"
        >
          <div className="flex items-center gap-2 text-xs text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white font-bold">
              ✓
            </span>
            <span>
              {isZh ? `已标记「${undoToast.name}」为已学` : `Marked "${undoToast.name}" as done`}
            </span>
          </div>
          <button
            type="button"
            onClick={handleUndoToastAction}
            className="flex min-h-[36px] items-center gap-1 rounded-md bg-[#FAF9F5] px-2.5 py-1 text-xs font-bold text-accent hover:bg-line/40 transition"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>{isZh ? '撤销' : 'Undo'}</span>
          </button>
          <button
            type="button"
            onClick={() => setUndoToast(null)}
            className="text-muted hover:text-ink text-sm font-bold pl-1"
            aria-label="Close toast"
          >
            ✕
          </button>
        </aside>
      )}

      {/* 移动端目录抽屉 (Bottom Sheet / Slide-over) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs md:hidden animate-fade-in">
          <div
            className="flex max-h-[80vh] flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-label={isZh ? '课程目录' : 'Curriculum Drawer'}
          >
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="text-sm font-bold text-ink">
                {isZh ? '学习大纲' : 'Curriculum'}
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted hover:text-ink"
                aria-label="Close drawer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {learnWorkbenchData.levels.map((lvl) => {
                const lvlDone = lvl.items.filter((it) => learned36Set.has(it.id)).length;
                const lvlTotal = lvl.items.length;

                return (
                  <div key={lvl.level} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectLevelOverview(lvl.level)}
                      className="flex min-h-[44px] w-full items-center justify-between text-left text-xs font-bold text-ink"
                    >
                      <span>
                        {lvl.subtitle} · {isZh ? lvl.nameZh : lvl.nameEn}
                      </span>
                      <span className="font-mono text-2xs text-muted">
                        {lvlDone}/{lvlTotal}
                      </span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5">
                      {lvl.items.map((it) => {
                        const isSelected = viewMode === 'lesson' && it.id === currentSlug;
                        const isDone = learned36Set.has(it.id);

                        return (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => handleSelectLesson(it.id)}
                            className={`flex min-h-[44px] items-center justify-between rounded-lg border p-2 text-left text-xs transition ${
                              isSelected
                                ? 'border-accent bg-accent/5 font-bold text-accent'
                                : isDone
                                ? 'border-line text-accent'
                                : 'border-line text-ink2'
                            }`}
                          >
                            <span className="truncate">{it.name}</span>
                            {isDone && (
                              <span className="text-2xs font-bold text-accent">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
