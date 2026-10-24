# UI Field Guide · Baseline Audit (M0 阶段工程与资源盘点)

**Task ID:** UFG-FEEDBACK-R1-20261023  
**Auditor:** Senior Full-stack Engineer + Product Analytics Engineer  
**Audit Date:** 2026-10-23  
**Target Domain:** `https://ui.lutivelab.com/` (UI Field Guide)

---

## 1. 代码库与构建部署基线

| 检查项 | 实测结果 | 证据与备注 |
|---|---|---|
| **代码仓库根目录** | `/Users/bluehorizon/Workbuddy/UI-Study` | 本地唯一工作区 |
| **Git 分支状态** | `main` (基线 Commit `7b7ba2e`) | 工作树无并发写锁，未提交修改已受控隔离 |
| **技术栈** | Next.js 15.1.6, React 19.0.0, TailwindCSS 3.4.17, TypeScript 5.7.3 | 现代 App Router 纯静态导出架构 (`output: 'export'`) |
| **构建产物** | `out/` (192 个静态 HTML/JSON 页面) | `npm run build` 生成，无 Node 运行时服务器 |
| **质量检查套件** | `npm run check` (types + content + i18n + search) | 85 项搜索校验 + 759 界面词条双语 100% 对齐 |

---

## 2. Cloudflare 边缘与云端资源盘点

通过 Wrangler 只读查验获取的 Cloudflare 实际配置：

| 资源类别 | 资源名称 / ID | 状态 / 配额情况 |
|---|---|---|
| **Cloudflare Account** | `Bluehorizon8848@gmail.com's Account` (`47cab5b8509e60df406c7636d640cdc4`) | 活跃免费层级 (Free Tier) |
| **Pages 生产项目** | `lutive-ui` | 生产域名：`ui.lutivelab.com`<br>Pages 默认域名：`lutive-ui-a2u.pages.dev` |
| **当前生产部署** | `37fdfed4-be41-4797-88a7-d66ff722119d` (Commit `7b7ba2e`) | 部署模式：Direct Upload (CLI / 无外部 Webhook) |
| **Workers / Functions** | 原先无独立 Worker 脚本；全站静态资源走 Pages CDN 缓存 | 本轮新增 Pages Functions (`functions/api/`)，仅 API 请求消耗配额 |
| **Cloudflare D1** | 盘点前：0 个数据库；配额上限 10 个免费数据库 | 本轮创建 `ufg-feedback-db` (ID: `b9ee7d6b-c8de-4d45-ba76-f922d8b881fb`)，完全处于 Free 额度内 |
| **Cloudflare Turnstile** | 基础架构已支持 `turnstile_token` 服务端校验 | 保持可选，不阻断合法匿名反馈 |

---

## 3. 分析、隐私与合规状态盘点

1. **GA4 / Google Tag / GTM 接入现状**:
   - 盘点前代码中无任何 GA4 埋点、Google Tag 脚本或 Measurement ID。
   - 站点仅有 Cloudflare CDN 边缘的 Web Analytics。
2. **SEO 与双语规范**:
   - 具有双根目录布局：中文 `(zh)`，英文 `(en)/en`。
   - `<html lang="zh-CN">` 与 `<html lang="en">` 严格隔离，Canonical 与 `hreflang` 互相指向。
3. **隐私与本地存储**:
   - 用户学习状态（如已认识 Pattern）保存在浏览器 LocalStorage `uifg.learned.v1` 中，100% 留存在本地设备。
   - 隐私政策原先声明完全无后端、零数据上传，本轮已精确更新：明确说明学习进度本地保存不变，主动提交的反馈与组件需求由边缘安全写入 Cloudflare D1，绝不长期持久化原始 IP 或完整设备指纹。
