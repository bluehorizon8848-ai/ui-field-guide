# 内容模型

内容即代码。全部词条在 `src/data/patterns/*.ts` 里，是可 review、可 diff、可回滚的普通 TypeScript。

## 为什么不用 CMS

- 63 条数据，一次性写完，修改频率极低
- 内容有强结构约束（每个词条必须有 anatomy、aiPrompt 三层、badPrompt）
- CMS 会带来鉴权、部署、备份成本 —— 独立开发者承担不起
- 本地文件可以直接跑 TypeScript 检查，写错字段编译就失败

## 目录

```
src/data/
  types.ts           # 所有类型定义
  categories.ts      # 8 个一级分类
  patterns/
    navigation.ts    # 按分类分文件，每个文件一个 UIPattern[]
    actions.ts
    input.ts
    containers.ts
    feedback.ts
    data.ts
    interaction.ts
    general.ts
    index.ts         # 汇总 + patternMap + 工具函数
  comparisons.ts     # 8 组对比
  learning.ts        # 三级学习路径
  search.ts          # 加权搜索 + Identify 规则
  demoIds.ts         # 哪些 Pattern 有 Demo（纯数据，供 Server Component 用）
```

## UIPattern

```ts
interface UIPattern {
  // ── 身份 ──────────────────────────────────
  id: string;              // URL slug，同时是 registry 键
  name: string;            // 英文规范名
  chineseName: string;     // 中文常用叫法
  aliases: string[];       // 别名，用于搜索

  // ── 归类 ──────────────────────────────────
  category: CategoryId;    // 8 个一级分类之一
  level: 1 | 2 | 3;        // 学习路径层级
  appearance: Appearance[];// 怎么出现：always / on-click / on-scroll / on-hover / auto
  position: Position[];    // 在哪：top / bottom / center / floating / overlay / side / inline
  job: Job[];              // 干什么：navigate / select / input / inform / expand / status / create / confirm

  // ── 内容 ──────────────────────────────────
  oneLine: string;         // 一句话人话解释（≤ 30 字）
  description: string;     // 2-3 段展开
  looksLike: string;       // 「它长什么样」——用生活场景说，不写学术定义
  platforms: Platform[];   // web / mobile / desktop
  difficulty: 'easy' | 'medium' | 'hard';

  // ── 选型 ──────────────────────────────────
  whenToUse: WhenRow[];    // 场景 → 是否推荐（true / false / 'mostly'）
  whenNotToUse: string[];  // 明确不该用的情形
  anatomy: AnatomyItem[];  // 结构拆解
  similarPatterns: string[];// 相关词条 id
  compareWith?: string;    // 关联的 comparison slug
  comparisonSlug?: string;

  // ── AI Translation（本产品的核心）─────────
  aiPrompt: {
    basic: string;         // Level 1 口语
    detailed: string;      // Level 2 加术语和约束
    implementation: string;// Level 3 实现级（ARIA / 焦点 / 动效参数）
  };
  badPrompt: string;       // 反例
  betterPrompt: string;    // 正例

  // ── 其他 ──────────────────────────────────
  fitsFor: string;         // 分享卡片底部一行
  tags: string[];          // 搜索加权字段
}
```

### 各字段的写作要求

| 字段 | 要求 | 反例 |
| --- | --- | --- |
| `oneLine` | 人话，≤ 30 字，不含英文术语以外的抽象词 | ❌「一种瞬时反馈机制」 |
| `looksLike` | 必须是用户见过的具体场景 | ❌「通常位于内容区上方」 |
| `whenNotToUse` | 说清**为什么**不该用，不只是「不建议」 | ❌「视情况而定」 |
| `anatomy` | 2-5 项，每项说清「没有它会怎样」 | ❌「包含标题」 |
| `aiPrompt.basic` | 就是用户平时会说的话，不要专业 | ❌「请实现一个符合 WAI-ARIA 的模态对话框」 |
| `aiPrompt.implementation` | 必须含具体数字或具体 API | ❌「做好无障碍支持」 |
| `badPrompt` | 必须是**真实会说的话**，不是故意写坏的 | ❌「随便做点什么」 |
| `fitsFor` | 分享卡片上的一句场景描述 | ❌「通用组件」 |

## Appearance vs Position

这两个字段容易被混淆，务必区分：

- **Appearance** = 怎么出现的（`always` 一直在 / `on-click` 点一下 / `on-hover` 悬停 / `on-scroll` 滚动时 / `auto` 自动）
- **Position** = 在哪的（`top` / `bottom` / `center` / `floating` / `overlay` / `side` / `inline`）

例：`toast` 的 appearance 是 `auto`（自动出现），position 是 `bottom`（在底部）。
`tooltip` 的 appearance 是 `on-hover`，position 是 `floating`。

`position` 直接驱动 Identify 工具，**不能留空**。

## Comparison

```ts
interface Comparison {
  slug: string;              // URL slug
  title: string;             // "Toast vs Snackbar vs Alert"
  subtitle: string;          // 一句话说明这组在解决什么
  question: string;          // 用户真正想问的那句话

  patterns: string[];        // 参与对比的 pattern id
  columns: { key: string; label: string }[];  // 对比维度

  rows: {
    pattern: string;
    cells: (string | boolean)[];  // true/false 或具体描述
    verdict: string;               // 「怎么判断」——这一行的选型结论
  }[];

  decision: { if: string; then: string }[];  // 决策规则
  takeaway: string;              // 一句话记住
  relatedComparisons: string[];
}
```

`cells` 长度必须等于 `columns` 长度。

`verdict` 是最容易偷懒的字段，但它才是对比页真正的价值 —— 表格只是索引，verdict 才是答案。

## Learning Path

```ts
interface LearningLevel {
  level: 1 | 2 | 3;
  name: string;
  subtitle: string;
  description: string;
  patternIds: string[];   // 必须全部存在于 patternMap
}
```

三层划分标准：

| Level | 判断标准 | 例子 |
| --- | --- | --- |
| 1 | 任何 App 里都见过，只是不知道名字 | Button, Tabs, Toast, List |
| 2 | 知道有多个选择，需要会挑 | Bottom Sheet vs Drawer, Skeleton vs Spinner |
| 3 | 不是组件，是一套做事的习惯 | Progressive Disclosure, Optimistic UI |

## 搜索加权

`search.ts` 里定义了字段权重：

| 字段 | 权重 | 前缀匹配加成 |
| --- | --- | --- |
| 英文名 | 12 | +3 |
| 中文名 | 12 | +3 |
| 别名 | 8 | +3 |
| 标签 | 5 | +3 |
| 一句话解释 | 4 | +3 |
| 场景描述（looksLike） | 3 | +3 |
| 详细解释 | 2 | +3 |

**中文口语映射**（`colloquialMap`）是搜索质量的关键：

```ts
'底下弹出来': ['bottom-sheet', 'action-sheet', 'drawer'],
'一步步填写': ['stepper', 'wizard'],
'转圈圈': ['spinner', 'progress-bar'],
```

数组顺序即优先级，`indexOf` 越小分越高。

## Identify 规则

**不维护手工矩阵。** `identifyCandidates()` 直接按 `position` + `job` 过滤 `patterns` 数组。

```
用户选：position = bottom, job = select
     ↓
筛出 position 含 'bottom' 且 job 含 'select' 的所有 Pattern
     ↓
按 (命中项数降序, level 升序) 排序，取前 12
```

这样加新 Pattern 时 Identify 自动覆盖，不需要改两处。

## 加一个 Pattern 的完整步骤

1. 在 `src/data/patterns/<分类>.ts` 加一条 `UIPattern`（**填全所有必填字段**，`position` 不能空**）
2. 需要交互 Demo：在 `src/components/demo/` 实现，导出到 `registry.ts`
3. 同步在 `src/data/demoIds.ts` 加 id（**registry.ts 有 dev 断言会检查一致性**）
4. 在 `src/components/patterns/MiniPreview.tsx` 加 SVG 示意图
5. 跑 `npx tsc --noEmit`，字段漏了会直接报错

## Server / Client 边界（重要）

`registry.ts` 里全是 Client Component（Demo 都要用 state）。**Server Component 不能 import 那个对象做查表** —— 会拿到 client reference，构建时报：

> Attempted to call hasDemo() from the server but hasDemo is on the client.

所以拆成两处：

| 需求 | 用什么 |
| --- | --- |
| Server Component 判断「有没有 Demo」 | `@/data/demoIds` 的 `hasDemo()`（纯数据） |
| Server Component 渲染 Demo 本身 | `<DemoById id="..." />`（Client 组件，内部查 registry） |
| Client Component 需要 Demo | 直接 `demoRegistry[id]` |

`demoIds.ts` 与 `registry.ts` 的一致性由 `registry.ts` 顶部的 dev 断言保证。
