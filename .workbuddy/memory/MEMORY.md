# UI Field Guide — 项目长期记忆

## 项目定位

AI 独立开发者的 UI/UX 可视化词典。核心路径：**看到 → 理解 → 知道名字 → 知道什么时候用 → 学会如何告诉 AI**。

纯静态，无账号、无数据库、无后端、无 AI API。

## 国际化（2026-10 完成）

**URL 策略**：中文在根路径（`/patterns/modal`），英文在 `/en` 前缀（`/en/patterns/modal`）。
选路由前缀而非纯客户端切换，是因为静态导出下英文术语需要被独立收录、可分享。

**双 root layout**：`src/app/(zh)/layout.tsx`（`lang="zh-CN"`）+ `src/app/(en)/en/layout.tsx`（`lang="en"`）。
根 `src/app/layout.tsx` 是**透传 layout**（只 return children），只为了满足 Next 对根目录 root layout 的要求。
根 `not-found.tsx` 因为拿不到 LocaleProvider，**必须自带 `<html>`/`<body>`**，文案中英并排 + 自带两套导航（否则是死胡同，且 e2e 会因 body <200 字符报空）。

页面 JSX 全部走 `src/app/shared/` 的工厂函数（`pattern-page.tsx` / `pages.tsx`），
ZH/EN 各语言目录只做薄封装。**改页面逻辑只能改 shared，改一处两个语言同时生效，不会漂移。**

**数据是 overlay 不是覆盖**：中文 `src/data/patterns/*.ts` 是唯一真相源，
英文在 `src/data/i18n/*.en.ts`，只放需要翻译的散文字段（不含 id 引用 / 枚举 / 结构字段）。
`src/data/i18n/resolve.ts` 是唯一数据出口：`getPattern` / `getPatterns` / `getComparison` / `getLearningLevels` / `localizePatterns`。
缺翻译时**优雅降级到中文**，绝不渲染空白区块。

### 三个必须记住的 i18n 坑

1. **`href(path, locale)` 两个方向都要剥 `/en` 前缀**。只加不剥的话，
   英文页的「中文」按钮会指向自己 —— 页面永远 200，sweep / visual / i18n 之外的任何测试都发现不了，
   只有显式断言「切换后的 href」才能抓到。

2. **`languageAlternates(path, locale)` 必须传 locale**。canonical 要 `href(path, locale)`，
   不传的话英文页 canonical 指向中文 URL，等于 SEO 自我否定。hreflang 三个值
   （`zh-CN` / `en` / `x-default`）都要自指正确。

3. **「用源数据筛、用本地化数据渲染」是硬模式**。搜索索引（别名、口语映射）全是中文的，
   筛选必须跑在中文 `patterns` 上，但命中的结果要显示英文 `oneLine`。
   一律用 `localizePatterns(source, locale)`，**不要在组件里手写 byId 映射**
   （ExploreClient 和 IdentifyClient 都因此漏翻过一次）。

### 英文版刻意保留中文的地方（不是漏翻）

- 词条详情页的 `chineseName`、Anatomy 的 `labelZh`、分类中文名
- 根 404 页中英并排

这是**双语词典**而非纯英文站 —— 中国用户看到 `Feedback` 完全对不上自己正在做的产品。
校验时按页面类型分级，不能一刀切断言「零中文」。

## 硬性约定

**提交前必须 `npm run check`，全绿才提交。** 现在是四段：

```bash
npm run typecheck        # tsc --noEmit
npm run verify           # scripts/verify-content.mjs   中文内容完整性
npm run verify:i18n      # scripts/verify-i18n.mjs      63 词条 / 8 对比 / 8 分类 / 689 文案键
npm run verify:search    # scripts/verify-search.mjs    72 条中英口语搜索（需 tsx）
```

`verify-content.mjs` 用**花括号配对**切 `search.ts` 里的口语映射表，
不能用 `indexOf` 找下一个声明 —— 中间夹着 `STOPWORDS` 数组会被误当映射表，把 `'the'` 当成不存在的 pattern id 报一堆假错。

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
- **Toggle 类组件视觉尺寸可以小于热区，但热区必须独立存在**：Switch 轨道 26px，命中区用外层 `button` 撑 44×44 + 内部 `span` 管视觉
- 移动端优先（这是主分享场景，自身布局垮了内容就没说服力）：
  - 全局 `touch-action: manipulation`，弹层/横向滚动容器加 `scroll-contain`（`overscroll-behavior: contain`）
  - 安全区用工具类：`pb-safe` / `pb-safe-4` / `pt-safe` / `bottom-safe`
  - 可交互元素加 `active:` 态（触屏没有 hover）

## Demo 布局约定

**舞台高度是内容测量出来的，不是固定值。** `DemoStage` 先以 auto 渲染，量 `scrollHeight`，再取 `clamp(内容高 × 放大系数, 下限, 上限)`，用 `useLayoutEffect` + `ResizeObserver` 在绘制前同步。当前区间 **260~620px，中位 302px**；手机上上限收紧到 460px。

- **`.demo-stage` 在 CSS 里必须有默认 `min-height: 260px`** —— SSR 阶段没 JS，缺了它首帧比 hydrate 后矮一截（CLS）
- 测量容器是 `flex-col items-center`。**改成 `flex-row` 会让 Demo 里多个并列顶层元素挤成左右并排**（skeleton 的按钮曾被压到 77px）
- `items-center` 会让子元素收缩包裹，**需要撑满舞台宽度的容器（表格等）必须显式加 `w-full`**
- `min-h-[180px]` 这种偏矮的内部容器已全部提到 220px
- **例外**：`ActionDemos` 的 FAB 演示区 `h-[240px]`、`InteractionDemos` 的拖拽放置区 `min-h-[150px]` 是**场景模拟的一部分**，不要动
- 横向排列一律加 `flex-wrap`；侧栏类布局用 `flex-col sm:flex-row` 让手机端堆叠
- 窄屏下侧边导航项用 `overflow-x-auto` 横向滚动，不要压成 60px

## 分享卡片：必须用真实 Demo 截图

**不要用 Canvas 重绘简化示意图** —— 缩小后完全丢失辨识度，等于没画。用 `html-to-image` 截真实 Demo。

三个坑，每一个都单独导致截图失败，且**都不抛异常**：

| 坑 | 现象 | 修法 |
| --- | --- | --- |
| 离屏容器用 `opacity: 0` | html-to-image 跳过不可见元素 | `position: fixed; left: -12000px` |
| 克隆体继承 `position: fixed; left: -12000px` | **成功返回但画面纯色**（内容画到画布外 12000px） | `toPng({ style: { position: 'static', left: '0', top: '0', margin: '0' } })` |
| Demo 自带 `.demo-stage` | 组件被撑在 260px 空盒居中，只占卡片 ~2% | 截图时 `[&_.demo-stage]:!min-h-0 !border-0 !bg-transparent !p-0` 压平 |

再按 `[data-shot-content]` 的紧致框裁剪（`width`/`height`），小组件才能真正放大。卡片里用 `drawImageCover` 等比裁切，**不拉伸、不留 letterbox**。

卡片截图区高度**必须由剩余空间驱动**，不能设硬编码下限 —— 会让 1:1 比例底部溢出。测试用 `data-shot-state` 属性判断真实状态（`ready` / `failed`），比采样颜色可靠。

## 测试

Playwright 七个脚本，**在项目内 `scripts/e2e/`**，跑在静态导出产物上：

| 脚本 | 覆盖 | 期望 |
| --- | --- | --- |
| `sweep.mjs` | 全站 155 页 console error / 死链 / 空 body | 155/155 |
| `interact.mjs` | 40 项交互：Dialog 焦点、口语搜索、LocalStorage、键盘、响应式、Share Card | 40/40 |
| `visual.mjs` | 对比度、触控热区、语义化 HTML、字号、布局、Demo 高度与手机适配 | 6/6 |
| `i18n.mjs` | 78 项：html lang / canonical / hreflang 互指 / 双向切换 / query 保留 / 英文搜索 / 404 / 中文残留 / Demo 内部 | 78/78 |
| `download.mjs` | 分享卡片真实 PNG 下载：文件名、magic bytes、IHDR 像素 | 9/9 |
| `verify-sharecard.mjs` | 真实截图状态、两种比例底部溢出、PNG 尺寸 | 16/16 |
| `mobile.mjs` | 移动端专项：3 视口 × 11 页 × 6 类问题 | 3/3 |

### i18n 测试为什么必须独立存在

**i18n 的失败模式是静默的**：页面照样 200、截图照样好看，只是 canonical 指错语言、
或者某个角落漏了一句中文。`sweep` 只看状态码和 body 长度，`visual` 只看样式，
**两者都发现不了这类问题**。新增的 `i18n.mjs` 专门测「看起来正常但语义错」这一类。

写这个测试时它一次性抓出 4 个真 bug（都是页面 200、无 console error 的静默失败）：
`href()` 没剥 `/en` 前缀导致英文页中文按钮自指、canonical 未按 locale 计算、
ExploreClient/IdentifyClient 直接用中文源数据渲染、
`HeroDemos` / `InteractiveStrip` 全硬编码中文。

### 写断言前先量测

`scripts/verify-search.mjs` 里的 72 条口语断言是量测出来的，不是猜的：
`expand and collapse` 一开始把 Checkbox 排第一，逐词条查分才定位到
`colloquialScore` 的精确匹配加权条件太宽（只看词数相等、不看同序），
单词短语 `toggle` 因此和任意多词查询拿到同一档加权。**先打印分数再改代码。**

另有量测工具（不参与 e2e判定，用于调布局）：

| 脚本 | 用途 |
| --- | --- |
| `measure-demos.mjs` | 各视口下 63 个 Demo 的舞台宽高对比，找最矮/最扁的 |
| `measure-crush.mjs` | 挤压与溢出排查，`W=320` 可换视口 |

```bash
npm run build
npm run serve      # 127.0.0.1:3111，静态预览 out/
npm run e2e        # 串跑七项；也可 npm run e2e:visual / npm run e2e:i18n 等单跑
```

打其他端口用 `BASE_URL='http://127.0.0.1:4173' node scripts/e2e/sweep.mjs`。

**必须打 `out/` 产物，不能用 `next start`** —— 静态导出模式下 `next start` 已失效。

**量测 Demo 高度前必须等 hydrate 完成**（等 `.demo-stage` 的 `style.minHeight !== ''`），否则量到 SSR 首帧高度会假失败。

### 写断言的三条经验

1. **测试报错先假设「测试错了」，量测确认后再决定改代码还是改阈值。** 最近 4 次报错里 2 次是真 bug、2 次是真 bug 被误报成假警告，**没有一次是调阈值能解决的**。
2. **必须排除的误报源**：视觉隐藏元素（SkipLink 的 `clip: rect(0,0,0,0)`）、刻意设计的单行省略号、`overflow-x` 祖先内的合法横向滚动、`flex-shrink: 0` 的固定侧栏。
3. **状态位比像素采样可靠** —— 加 `data-*` 属性暴露内部状态给测试，别去猜渲染结果长什么样。

## 静态导出

`output: 'export'`，产物在 `out/`（约 20 MB / 356 文件 / **155 个 HTML 页面**），
`trailingSlash: true` 产出 `patterns/modal/index.html` 形式。

**155 = 中文 77 + 英文 77 + 404**，由 sitemap 定义（63 词条 + 8 对比 + 6 静态页，两种语言）。
`sitemap.xml` 里中英数量必须对称。

**Route Handler 必须显式声明静态**，否则构建失败：

```ts
export const dynamic = 'force-static';
```

`robots.ts` 和 `sitemap.ts` 都加了。以后加 Route Handler 别忘了。

**本地预览必须用 `npm run serve`**（`scripts/serve-export.mjs`），不能用 `python -m http.server`：
后者不回退 `404.html`（会让 404 页测试误报），改写其重定向行为还容易把正常路径判成 404。

Cloudflare Pages 配置：Build `npm run build` / Output `out` / Node 22。

## Git

远端：**`git@github-bluehorizon:bluehorizon8848-ai/ui-field-guide.git`**（公开仓库 https://github.com/bluehorizon8848-ai/ui-field-guide）

### 必须用专用 SSH host，不要用 `git@github.com`

本机 `~/.ssh/config` 里 `github.com` 这个 host 绑的是 `id_ed25519_github`，
认证身份是**另一个账号 `Xiaolong-writer/software-process-quality`**。
用它推 `bluehorizon8848-ai` 的仓库会报：

```
ERROR: Permission to bluehorizon8848-ai/ui-field-guide.git denied to deploy key
```

配置里已有专用 host 指向正确密钥：

```
Host github-bluehorizon
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_bluehorizon
  IdentitiesOnly yes
```

验证身份：`ssh -T git@github-bluehorizon` → 应回 `Hi bluehorizon8848-ai!`

### 不要用 token 推送

`gh` 登录的 token 走 HTTPS 也能推，但**不要把 token 放进命令行**：
`GH_TOKEN=xxx git push` 写错位置（`git GH_TOKEN=xxx push`）会把 token 当成子命令，
且 `echo` 出来的 token 会留在会话日志里。用 SSH 一劳永逸。

如需重新登录 gh：`gh auth login`（撤销后 token 立即失效，但 SSH 推送不受影响）。
