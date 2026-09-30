# UI Field Guide

> AI 独立开发者的 UI / UX 可视化词典

你知道自己想要什么，只是不知道它叫什么。

这个站点把 63 个 UI Pattern 拆成「先看 → 再理解 → 知道名字 → 知道什么时候用 → 会怎么告诉 AI」五步。每一个词条都有可交互 Demo、三层 Prompt、和一张能存下来的分享卡片。

**纯静态。没有账号，没有数据库，没有 AI API，没有后端。**

---

## 快速开始

```bash
npm install
npm run dev      # http://localhost:3000
```

其他命令：

```bash
npm run build      # 生产构建（静态导出，产物在 out/）
npm run serve      # 本地预览 out/，端口 3111
npm run typecheck  # TypeScript 检查
npm run verify     # 内容完整性校验（交叉引用 / 必填字段 / Demo 一致性）
npm run check      # typecheck + verify
npm run e2e        # Playwright 端到端（需先 build + serve）
```

**提交前请跑 `npm run check`。** 端到端测试细节见 `scripts/e2e/README.md`。

`verify` 校验的是 TypeScript 抓不到的问题 —— 全部是字符串，拼错了也不会报错，但会直接变成 404 死链或空白区块：

- `similarPatterns` / `comparisonSlug` / `patternIds` 引用了不存在的 id
- `oneLine` / `description` / `looksLike` 为空或过短
- `aiPrompt` 三层缺任意一层
- Comparison 的 `cells` 数量与 `columns` 不一致
- `demoIds` 与 `demoRegistry` 不一致
- MiniPreview 缺示意图（警告）

## 环境要求

- Node.js 18.17+（开发使用 22.x）
- npm 9+

## 技术栈

| 项 | 选择 | 原因 |
| --- | --- | --- |
| 框架 | Next.js 15（App Router） | SSG + 每词条独立 metadata，静态导出即可部署 |
| UI | React 19 + Tailwind CSS 3.4 | 无组件库，保持视觉克制 |
| 图标 | lucide-react | 唯一一个运行时依赖 |
| 数据 | 本地 TS 模块 | 内容即代码，可 review、可 diff |

**零后端、零 API Key、零付费依赖。**

## 部署

站点是**纯静态导出**（`output: 'export'`），没有 Node 运行时、没有 Server Component 动态渲染、没有图片优化服务器。

```bash
npm run build     # 产物在 out/，约 7.6 MB / 187 个文件
npm run serve     # 本地预览 out/，行为对齐 Cloudflare Pages
```

本地预览用 `npm run serve` 而不是 `next start` —— 导出模式下没有 `next start` 可用。预览服务器会补齐托管环境的两个行为：目录请求 301 到尾斜杠、404 回退到 `404.html` 且保留 404 状态码。

### Cloudflare Pages

| 配置项 | 值 |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | 22 |

### 其他托管

- **Netlify**：Build `npm run build`，Publish `out`
- **GitHub Pages**：同上，产物推到 `gh-pages` 分支
- **Nginx / 对象存储**：直接上传 `out/`，需把 404 指向 `404.html`

`next.config.js` 里 `trailingSlash: true` 是为静态托管准备的 —— 导出产物是 `patterns/modal/index.html` 形式，Cloudflare Pages 和 Nginx 都能直接命中，不需要 URL 重写规则。

环境变量：**无。** 站点不依赖任何后端服务。

---

## 站点结构

| 路由 | 作用 |
| --- | --- |
| `/` | 学习入口。首屏即真实组件，不是营销页 |
| `/explore` | 图鉴。8 分类 × 3 难度 + 搜索 |
| `/patterns/[slug]` | 词条详情。63 个，每个都有独立 URL 和 metadata |
| `/compare` | 8 组最常被搞混的 Pattern |
| `/compare/[slug]` | 对比详情。对比表 + 真实 Demo + 选型规则 |
| `/learn` | 三级学习路径，进度存 LocalStorage |
| `/identify` | 「我不知道它叫什么」——两步本地规则筛选 |
| `/search` | 中英文 / 别名 / 中文口语模糊搜索 |

## 核心设计原则

**Example First.** 每个词条第一个元素就是能点的 Demo，定义在后面。

**Plain Language First.** 先说人话（「操作完成后屏幕角落飘出来的小提示」），再给术语（Toast）。

**AI Translation.** 每个词条都有三层 Prompt：
- Level 1 —— 你平时怎么说话
- Level 2 —— 加准确的限定
- Level 3 —— 实现级描述（ARIA、焦点、动效参数）

外加一组 Bad Prompt → Better Prompt，展示同一个需求怎么问才有好结果。

## 内容规模

- 63 个 Pattern，覆盖 8 个分类
- 63 个可交互 Demo（每个词条都有）
- 8 组完整 Comparison
- 100+ 条中文口语关键词映射
- 83 个静态页面（含 sitemap / robots / 404）

## 已验证

| 项目 | 结果 |
| --- | --- |
| `npm run build` | 83 页导出到 `out/`，7.6 MB / 187 文件 |
| `npm run check` | 类型 + 内容完整性全绿（63 Pattern / 8 对比 / 63 Demo） |
| 全站浏览器冒烟（78 页） | 78 / 78 通过，无 console error |
| 交互测试（40 项） | 40 / 40 通过 |
| 视觉与可访问性（6 项） | 6 / 6 通过 |
| 分享卡片下载（9 项） | 9 / 9 通过，两种比例均为合法 PNG |
| 静态托管路由 | 301 补尾斜杠、深链接 200、404 保留状态码并回退自定义页 |
| 响应式 | 375 / 393 / 768 / 1440px 无横向溢出 |
| Reduced Motion | 动画降级为 0s |
| 键盘导航 | Skip Link、焦点可见、回车激活 |
| Dialog | 焦点陷阱、Esc、body 滚动锁、焦点归还 |
| 颜色对比度 | 19 种文字样式全部 AA，最低 5.12:1 |
| 触控热区 | 390px 视口下按钮与块级链接全部 ≥ 44px |
| LocalStorage | 勾选写入、刷新保留、跨页同步 |
| Demo 展示区域 | 63 个 Demo 高度 240~460px，无挤压、无横向溢出 |

以上全部在**静态导出产物**（`out/`）上跑通，不是 `next start`。浏览器测试用 Playwright 覆盖真实点击、键盘、剪贴板和文件下载；分享卡片下载会真实落盘到 `/tmp/uifg-downloads`，校验 PNG magic 与 IHDR 实际像素。

## 已知限制

- **部分 Pattern 共用 Demo**：`tooltip` 复用 IconButtonDemo、`card` 复用 ListDemo、`back-button` 复用 BreadcrumbDemo。先保证覆盖率，后续可拆。
- **静态导出放弃了什么**：`images.unoptimized` 关闭了图片优化（本站无 `next/image` 用法，零损失）；无法用 ISR / 增量构建 / revalidate，内容改动必须重新构建；无 Server Actions、无 API Routes、无运行时中间件。
- **无 ESLint**：靠 `npm run typecheck` + `npm run verify` 兜底。

---

## 目录结构

```
src/
  app/                # 路由与页面（App Router）
    patterns/[slug]/  # 词条详情
    compare/[slug]/   # 对比详情
  components/
    demo/             # 所有可交互 Demo（37 个真实组件）
    patterns/         # 词条展示组件
    social/           # Canvas 分享卡片
    identify/         # 我不知道它叫什么
  data/
    patterns/         # 词条数据，按分类分文件
    comparisons.ts    # 8 组对比
    search.ts         # 加权搜索 + Identify 规则
    learning.ts       # 三级学习路径
  hooks/              # useProgress / useScrollLock
docs/                 # 产品与内容模型文档
content/social/       # 首发选题
```

## 加一个 Pattern

1. 在 `src/data/patterns/<分类>.ts` 里加一条 `UIPattern`
2. 如果要交互 Demo，在 `src/components/demo/` 里实现
3. 在 `src/components/demo/registry.ts` 注册
4. 在 `src/components/patterns/MiniPreview.tsx` 加一个 SVG 示意图

内容模型详见 [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md)。

## 隐私

- 学习进度存在浏览器 LocalStorage（key: `uifg.learned.v1`），**不联网**
- 不收集任何用户数据，没有埋点，没有分析脚本
- 分享卡片在浏览器端用 Canvas 生成，**图片不上传**
- 清除浏览器数据即清空全部状态

## 文档

- [`docs/PRODUCT.md`](docs/PRODUCT.md) —— 产品定位、用户路径、边界
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) —— UIPattern / Comparison 数据模型与写作规范
- [`content/social/`](content/social/) —— 10 个首发内容选题

## 浏览器支持

Chrome / Edge / Safari / Firefox 最近两个大版本。需要 `localStorage`、CSS Grid、Canvas 2D。

已适配 Reduced Motion（`prefers-reduced-motion`），动画会降级为无位移。
