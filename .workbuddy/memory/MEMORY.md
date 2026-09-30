# UI Field Guide — 项目长期记忆

## 项目定位

AI 独立开发者的 UI/UX 可视化词典。核心路径：**看到 → 理解 → 知道名字 → 知道什么时候用 → 学会如何告诉 AI**。

纯静态，无账号、无数据库、无后端、无 AI API。

## 硬性约定

**提交前必须 `npm run check`（typecheck + verify），全绿才提交。**

`verify` 是自建的，校验 TypeScript 抓不到的问题（全是 string，写错不报错但会变成 404 死链）：
交叉引用 / 必填字段 / Comparison cells 数量 / demoIds↔registry 一致性 / MiniPreview 覆盖。

## 三条内容原则（不可妥协）

1. **Example First** — 每个词条第一个元素是能点的 Demo，不是定义
2. **Plain Language First** — 先说人话，再给术语
3. **AI Translation** — 每条必须有 aiPrompt 三层 + badPrompt/betterPrompt。这是与所有词典的根本区别

## 环境坑（每次都会踩）

```bash
# 构建必须去掉 FS shim，否则 EEXIST: mkdir '.next/server'
env -u NODE_OPTIONS -u CODEBUDDY_BROKERED_FS_HOOK_ENABLED npm run build

# 请求 localhost 必须绕过代理，否则全部 502
export no_proxy="*"; unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY

# 长驻 server 用 Bash 工具的 run_in_background，nohup+disown 无效
```

**真实路径是 `Workbuddy`（小写 b），不是 `WorkBuddy`。**

## 架构要点

### Appearance vs Position（别搞混）

- `Appearance` = 怎么出现：always / on-click / on-scroll / on-hover / auto
- `Position` = 在哪：top / bottom / center / floating / overlay / side / inline

`position` 驱动 Identify 工具，`job` 驱动第二问。**加新 Pattern 必须填 `position`，否则 Identify 覆盖不到。**

### Server/Client 边界

`components/demo/registry.ts` 是 `'use client'`，Server Component 不能 import 它的对象查表。

| 场景 | 用什么 |
| --- | --- |
| Server Component 判断有无 Demo | `@/data/demoIds` 的 `hasDemo()` |
| Server Component 渲染 Demo | `<DemoById id="..." />` |
| Client Component 用 Demo | 直接 `demoRegistry[id]` |

`registry.ts` 顶部有 dev 断言校验 `demoIds` 与 `demoRegistry` 一致。

### id 一律用 useId

Demo 里任何 `id` / `aria-labelledby` / `aria-describedby` / `htmlFor` 都必须 `useId()` 生成。
对比页会同时渲染多个 Demo，硬编码必然撞。

### pattern id 是唯一的真相

`modal` 存在，`dialog` **不存在**（dialog 是 modal 的别名）。写内容引用前先确认 id 存在。
`npm run verify` 会抓这类错误。

## 加一个 Pattern 的步骤

1. `src/data/patterns/<分类>.ts` 加 `UIPattern`（填全必填字段，含 `position`）
2. 需要 Demo 就在 `components/demo/` 实现并注册到 `registry.ts`
3. 同步在 `src/data/demoIds.ts` 加 id
4. `components/patterns/MiniPreview.tsx` 加 SVG 示意图
5. `npm run check`

详见 `docs/CONTENT_MODEL.md`。

## 视觉规范

- 底 `#FAF9F6` / 卡 `#FFFFFF` / 正文 `#1A1917` / 次要 `#4A4740` / 弱化 `#6E6A61`
- **`muted` 必须是 `#6E6A61`** —— 原 `#7A766D` 对比度 4.3:1，低于 AA
- 分类色只用于小圆点和标签，不做大面积色块
- 禁用：企业后台冷灰蓝、紫蓝渐变、毛玻璃、巨大营销 Hero、emoji 图标
- 触控热区 ≥ 44px（内联文本链接除外，WCAG 2.5.5 豁免）

## 测试

Playwright 四个脚本，**在项目内 `scripts/e2e/`**，跑在静态导出产物上：

| 脚本 | 覆盖 | 期望 |
| --- | --- | --- |
| `sweep.mjs` | 全站 78 页 console error / 死链 / 空 body | 78/78 |
| `interact.mjs` | 40 项交互：Dialog 焦点、口语搜索、LocalStorage、键盘、响应式、Share Card | 40/40 |
| `visual.mjs` | 对比度、触控热区、语义化 HTML、字号、布局 | 5/5 |
| `download.mjs` | 分享卡片真实 PNG 下载：文件名、magic bytes、IHDR 像素 | 9/9 |

```bash
npm run build
npm run serve      # 127.0.0.1:3111，静态预览 out/
npm run e2e        # 串跑四项；也可 npm run e2e:visual 等单跑
```

打其他端口用 `BASE_URL='http://127.0.0.1:4173' node scripts/e2e/sweep.mjs`。

**必须打 `out/` 产物，不能用 `next start`** —— 静态导出模式下 `next start` 已失效。

## 静态导出

`output: 'export'`，产物在 `out/`（约 7.6 MB / 187 文件），`trailingSlash: true` 产出 `patterns/modal/index.html` 形式。

**Route Handler 必须显式声明静态**，否则构建失败：

```ts
export const dynamic = 'force-static';
```

`robots.ts` 和 `sitemap.ts` 都加了。以后加 Route Handler 别忘了。

**本地预览必须用 `npm run serve`**（`scripts/serve-export.mjs`），不能用 `python -m http.server`：
后者不回退 `404.html`（会让 404 页测试误报），改写其重定向行为还容易把正常路径判成 404。

Cloudflare Pages 配置：Build `npm run build` / Output `out` / Node 22。

## Git

首次提交 `0f06544`（2026-09-30），98 文件 / 18,064 行。**尚未推远端**（无 remote）。
