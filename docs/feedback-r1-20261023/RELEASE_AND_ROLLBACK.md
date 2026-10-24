# UI Field Guide · 发布与回滚手册 (Release & Rollback Runbook)

**Task ID:** UFG-FEEDBACK-R1-RELEASE-GATE-01  
**Measurement ID:** `G-E67MRP4HKJ`  
**Project:** `lutive-ui` (Cloudflare Pages)  
**Cloudflare Account ID:** `47cab5b8509e60df406c7636d640cdc4`  
**Production Domain:** `https://ui.lutivelab.com/`  
**Safe Staging Preview URL:** `https://preview-feedback-r1.lutive-ui-a2u.pages.dev`

---

## 1. 生产发布门禁 (Release Gates Checklist)

在推进任何正式生产部署前，必须全部满足以下条件：

- [x] **本地类型与全量验证通过**: `npm run check` 零错误（Types, Content 75/8/75, i18n 759 keys, Search 85/85）。
- [x] **静态生产构建通过**: `npm run build` 成功导出全部 192 个静态 HTML 页面至 `out/`，GA4 ID 编译注入成功。
- [x] **国际化专项端到端测试通过**: `npm run e2e:i18n` 90/90 全部通过，无英文页残留中文。
- [x] **交互专项端到端测试通过**: `npm run e2e:interact` 40/40 全部通过。
- [x] **自动化埋点与反馈专项测试通过**: `node scripts/test-analytics-and-feedback.mjs` 47/47 全部通过。
- [x] **发布门禁收尾修复完成**:
  - [x] Admin API 移除 URL Query Key 传参，强制仅允许 Header `x-admin-key` 鉴权。
  - [x] 边缘内存限流设防 1000 IP 边界与淘汰，补齐分布式边界说明。
  - [x] Staging/Production D1 数据隔离机制就绪（自动打标 `staging_test`，导出默认排除）。
- [x] **远程 Cloudflare D1 数据库就绪**: `ufg-feedback-db` 已建表并建立索引，读写隔离验证通过。
- [x] **Staging 独立预览验证通过**: `https://preview-feedback-r1.lutive-ui-a2u.pages.dev` 运行正常。
- [ ] **Human 明确批准发布生产环境**（严守边界，未经授权禁止推送生产）。

---

## 2. 标准生产发布步骤 (待 Human 审批后执行)

### 步骤 1: 配置生产环境变量
在 Cloudflare Pages 控制台为项目 `lutive-ui` 的 Production 环境配置以下变量（如已由 Human 创建 GA4）：
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: 例如 `G-XXXXXXXXXX`
- `ADMIN_API_KEY`: 选填，后台只读导出密钥（若为空则自动关闭公网导出接口）
- `TURNSTILE_SECRET_KEY`: 选填，若需开启 Turnstile 严格防刷

### 步骤 2: 绑定 D1 数据库到生产 Pages 项目
在 Cloudflare Pages 控制台：
- 路径: `Workers & Pages` → `lutive-ui` → `Settings` → `Functions` → `D1 database bindings`
- 点击 `Add binding`:
  - Variable name: `DB`
  - D1 database: `ufg-feedback-db`

### 步骤 3: 触发生产部署发包
经 Human 批准后，在终端执行直接发包命令：
```bash
# 构建最新静态导出
npm run build

# 部署至生产环境 main 分支
CLOUDFLARE_ACCOUNT_ID=47cab5b8509e60df406c7636d640cdc4 npx wrangler pages deploy out/ --project-name lutive-ui --branch main --commit-dirty=true
```

### 步骤 4: 线上生产快速核验 (Smoke Test)
1. 访问 `https://ui.lutivelab.com/patterns/modal/`:
   - 检查页面底部是否正常展示反馈组件「这个内容对你有帮助吗？」
   - 点击「有帮助」后是否切换为「感谢你的反馈！」
2. 访问 `https://ui.lutivelab.com/search?q=test_missing`:
   - 检查空态是否展现「提交组件需求」入口
3. 检查控制台无任何阻断性 JavaScript 报错。

---

## 3. 生产秒级回滚方案 (Rollback Procedures)

若生产部署上线后发生任何不可预期异常，立即按以下优先级启动止血：

### 【方案 A：首选 0 秒止血】Cloudflare 控制台一键回滚
1. 浏览器打开控制台项目部署历史：
   `https://dash.cloudflare.com/47cab5b8509e60df406c7636d640cdc4/pages/view/lutive-ui`
2. 定位到本次发布前的基线活跃部署：
   - **基线部署 ID**: `37fdfed4-be41-4797-88a7-d66ff722119d` (Commit `7b7ba2e`)
3. 点击右侧 `...` 菜单，选择 **"Rollback to this deployment"** 并确认。
4. 全球 CDN 节点 0~5 秒内秒级切回历史静态镜像，无需重编译。

### 【方案 B：CLI 命令行快速回滚】
```bash
CLOUDFLARE_ACCOUNT_ID=47cab5b8509e60df406c7636d640cdc4 npx wrangler pages deployment rollback 37fdfed4-be41-4797-88a7-d66ff722119d --project-name lutive-ui
```

### 【方案 C：Git 标准代码回滚】
若已提交 Git，执行反向提交撤销：
```bash
git revert HEAD --no-edit
npm run build
```
