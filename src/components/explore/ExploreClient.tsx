'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { patterns } from '@/data/patterns';
import { categories, categoryMap } from '@/data/categories';
import { getCategory, localizePatterns } from '@/data/i18n/resolve';
import { searchPatterns } from '@/data/search';
import { PatternCard } from '@/components/patterns/PatternCard';
import { useLocale } from '@/components/layout/LocaleProvider';
import { t } from '@/lib/ui-strings';

export function ExploreClient() {
  const locale = useLocale();
  const params = useSearchParams();
  const initialCat = params.get('c') ?? 'all';
  const [cat, setCat] = useState(
    categories.some((c) => c.id === initialCat && patterns.some((p) => p.category === c.id))
      ? initialCat
      : 'all'
  );
  const [level, setLevel] = useState('all');
  const [eco, setEco] = useState<'all' | 'web' | 'ios' | 'android' | 'harmonyos'>(
    (params.get('eco') as any) ?? 'all'
  );
  const [q, setQ] = useState('');

  /**
   * 搜索必须跑在中文源数据上 —— 索引里全是中文别名和口语映射，
   * 拿英文数据去搜会一个都命中不了。但命中之后要渲染本地化版本，
   * 否则英文页的卡片会露出中文 oneLine 和中文标签。
   * localizePatterns 负责「用源数据筛、用本地化数据渲染」这个分裂。
   */
  const list = useMemo(() => {
    let ids = patterns;
    if (eco !== 'all') {
      ids = ids.filter((p) => {
        if (p.dedicatedPlatform) return p.dedicatedPlatform === eco;
        if (eco === 'web') return p.platforms.includes('web') || p.platforms.includes('desktop');
        if (eco === 'ios') return p.platforms.includes('mobile') || p.platforms.includes('ios');
        if (eco === 'android') return p.platforms.includes('mobile') || p.platforms.includes('android');
        if (eco === 'harmonyos') return p.platforms.includes('mobile') || p.platforms.includes('harmonyos');
        return true;
      });
    }
    if (cat !== 'all') ids = ids.filter((p) => p.category === cat);
    if (level !== 'all') ids = ids.filter((p) => p.level === Number(level));
    if (q.trim()) {
      const hits = new Set(searchPatterns(q, patterns).map((h) => h.pattern.id));
      ids = patterns.filter((p) => hits.has(p.id));
      if (eco !== 'all') {
        ids = ids.filter((p) => {
          if (p.dedicatedPlatform) return p.dedicatedPlatform === eco;
          if (eco === 'web') return p.platforms.includes('web') || p.platforms.includes('desktop');
          if (eco === 'ios') return p.platforms.includes('mobile') || p.platforms.includes('ios');
          if (eco === 'android') return p.platforms.includes('mobile') || p.platforms.includes('android');
          if (eco === 'harmonyos') return p.platforms.includes('mobile') || p.platforms.includes('harmonyos');
          return true;
        });
      }
      if (cat !== 'all') ids = ids.filter((p) => p.category === cat);
      if (level !== 'all') ids = ids.filter((p) => p.level === Number(level));
    }
    return localizePatterns(ids, locale);
  }, [cat, level, eco, q, locale]);

  const activeCat = categoryMap[cat];
  // 分类的中文名对做中国市场的英文用户仍有价值，但英文页的主标签应该是英文名
  const catName = (id: string) => {
    const c = categoryMap[id];
    return c ? (locale === 'en' ? c.name : c.chineseName) : '';
  };

  const levels = [
    { v: 'all', label: t(locale, 'explore.levelAll') },
    { v: '1', label: 'Level 1' },
    { v: '2', label: 'Level 2' },
    { v: '3', label: 'Level 3' },
  ];

  return (
    <div>
      {/* 搜索框：规范比例与视觉焦点 */}
      <div className="mb-6 max-w-[600px]">
        <label htmlFor="explore-q" className="sr-only">
          {t(locale, 'explore.searchLabel')}
        </label>
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="explore-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(locale, 'explore.searchPlaceholder')}
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-10 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#7A766D] focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,25,23,0.07)]"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label={t(locale, 'explore.clearSearch')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-[#F2F0EB] hover:text-ink"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* 筛选控制器组：移动端横向顺滑滚动，桌面端平铺对齐 */}
      <div className="mb-6 space-y-3">
        {/* 多端平台生态筛选：支持 Web / iOS / Android / 鸿蒙专有与通用 */}
        <div className="-mx-5 flex items-center gap-1.5 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          <span className="shrink-0 text-2xs font-mono uppercase tracking-wider text-muted mr-1">
            {locale === 'zh' ? '生态体系' : 'ECOSYSTEM'}
          </span>
          {[
            { id: 'all', labelZh: '全部生态', labelEn: 'All Ecosystems' },
            { id: 'web', labelZh: 'Web / SaaS', labelEn: 'Web & SaaS' },
            { id: 'ios', labelZh: 'iOS (Apple HIG)', labelEn: 'iOS (HIG)' },
            { id: 'android', labelZh: 'Android (MD3)', labelEn: 'Android (MD3)' },
            { id: 'harmonyos', labelZh: '鸿蒙 (HarmonyOS)', labelEn: 'HarmonyOS ArkUI' },
          ].map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setEco(e.id as any)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                eco === e.id
                  ? 'bg-ink text-white font-semibold shadow-2xs'
                  : 'bg-[#F2F0EB] text-ink2 hover:bg-[#E9E6DF]'
              }`}
            >
              {locale === 'zh' ? e.labelZh : e.labelEn}
            </button>
          ))}
        </div>

        {/* 分类药丸：支持手机横滑，规范高度与微型计数胶囊 */}
        <div className="-mx-5 flex items-center gap-1.5 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          <FilterChip
            active={cat === 'all'}
            onClick={() => setCat('all')}
            label={t(locale, 'explore.allCount', { n: '' }).trim()}
            count={patterns.length}
          />
          {categories.map((c) => {
            const count = patterns.filter((p) => p.category === c.id).length;
            if (count === 0) return null;
            return (
              <FilterChip
                key={c.id}
                active={cat === c.id}
                onClick={() => setCat(c.id)}
                label={catName(c.id)}
                count={count}
              />
            );
          })}
        </div>

        {/* 难度等级筛选：文字标签基线对齐，统一按钮微设计 */}
        <div className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          <span className="shrink-0 text-2xs font-mono uppercase tracking-wider text-muted">
            {t(locale, 'explore.levelLabel')}
          </span>
          <div className="flex items-center gap-1.5">
            {levels.map((l) => (
              <LevelChip
                key={l.v}
                active={level === l.v}
                onClick={() => setLevel(l.v)}
              >
                {l.label}
              </LevelChip>
            ))}
          </div>
        </div>
      </div>

      {/* 上下文概览信息条：将分类导言与结果统计规范融合 */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-line bg-[#FAF9F6] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
          {activeCat && cat !== 'all' ? (
            <>
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full sm:mt-0 ${activeCat.tint ?? 'bg-ink'}`} />
              <p className="text-[0.8125rem] leading-relaxed text-ink2">
                <span className="mr-1.5 font-semibold text-ink">{catName(cat)}</span>
                {getCategory(cat, locale)?.blurb}
              </p>
            </>
          ) : (
            <p className="text-[0.8125rem] leading-relaxed text-ink2">
              {locale === 'zh'
                ? '全收录 UI 组件库，每个组件均包含交互演示与 AI Prompt。'
                : 'Complete collection of UI patterns with live interactive demos and prompts.'}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line/60 pt-2.5 sm:border-t-0 sm:pt-0">
          <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center rounded-md border border-line bg-surface px-2 py-0.5 text-xs font-mono font-medium text-ink2 shadow-2xs"
          >
            {q.trim()
              ? t(locale, 'explore.resultMatched', { n: list.length, q })
              : t(locale, 'explore.resultCount', { n: list.length })}
          </span>
          {(cat !== 'all' || level !== 'all' || eco !== 'all' || q.trim()) && (
            <button
              type="button"
              onClick={() => {
                setCat('all');
                setLevel('all');
                setEco('all');
                setQ('');
              }}
              className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-ink"
            >
              {t(locale, 'explore.clearFilters')}
            </button>
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-card border border-dashed border-line px-6 py-14 text-center">
          <p className="text-sm font-medium text-ink">{t(locale, 'explore.empty')}</p>
          <button
            type="button"
            onClick={() => {
              setCat('all');
              setLevel('all');
              setEco('all');
              setQ('');
            }}
            className="mt-2 text-xs text-ink2 underline underline-offset-4 hover:text-ink"
          >
            {t(locale, 'explore.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <PatternCard key={p.id} pattern={p} headingLevel={2} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-8 shrink-0 items-center rounded-lg px-2.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-ink text-white shadow-xs'
          : 'border border-transparent bg-[#F2F0EB] text-ink2 hover:border-[#DDD9CF] hover:bg-[#EAE7DF] hover:text-ink'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-mono tabular-nums ${
            active ? 'bg-white/20 text-white' : 'bg-black/5 text-muted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function LevelChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-7 shrink-0 items-center rounded-md px-2.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-ink text-white shadow-xs'
          : 'border border-transparent bg-transparent text-ink2 hover:border-line hover:bg-surface hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}