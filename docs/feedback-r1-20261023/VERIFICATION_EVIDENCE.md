# UI Field Guide · Verification Evidence & Test Results (全项验收与证据链)

**Task ID:** UFG-FEEDBACK-R1-RELEASE-GATE-01  
**Measurement ID:** `G-E67MRP4HKJ`  
**Execution Date:** 2026-10-24  
**Auditor:** Senior Full-stack Engineer + Product Analytics Engineer  
**Staging Preview URL:** `https://preview-feedback-r1.lutive-ui-a2u.pages.dev`  
**Google Drive Evidence Folder:** `https://drive.google.com/drive/folders/1rOVp__tSp3py0LJdGAbZ-LtWeLH33Wu1`

---

## 1. 测试套件全量指标矩阵 (Verification Matrix)

| 验证维度 | 测试套件 / 命令 | 覆盖指标与用例 | 结果 | 关键实测证据说明 |
|---|---|---|---|---|
| **静态语法与类型** | `npm run typecheck` | 0 errors | **PASS** | Strict TypeScript 检查完全通过 |
| **内容权威完整性** | `npm run verify` | 75 / 8 / 75 | **PASS** | 75 Pattern, 8 Comparison, 75 Demo 完整对齐 |
| **国际化词典完整性** | `npm run verify:i18n` | 759 keys | **PASS** | 759 个界面词条中英 100% 对齐，零英文漏翻与中文残留 |
| **语义搜索全量回归** | `npm run verify:search`| 85 / 85 | **PASS** | 口语词条、精准名、空态及负控用例全部通过 |
| **静态导出构建** | `npm run build` | 192 / 192 页 | **PASS** | 成功导出至 `out/`，GA4 ID 静态注入，零 Suspense 崩溃 |
| **国际化端到端回归** | `npm run e2e:i18n` | 90 / 90 | **PASS** | canonical、hreflang、双语切换保留 query、双语搜索全过 |
| **埋点与反馈专项套件** | `npm run test:analytics`| 47 / 47 | **PASS** | GA4 `G-E67MRP4HKJ`、Consent Mode v2、限流、隐私、D1 隔离全过 |

---

## 2. 核心场景实测证据链 (Core Journey Evidence)

### 证据 A: GA4 Measurement ID G-E67MRP4HKJ 与 Consent Mode v2 实测
- `gtag.js` 预加载与载入：静态产物中包含 `<link rel="preload" href="https://www.googletagmanager.com/gtag/js?id=G-E67MRP4HKJ" as="script"/>`，运行期成功注入并载入 Google Tag 官方库。
- **Consent Mode v2 初始化顺序**：`gtag('consent', 'default', { analytics_storage: ..., ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })` 在所有 `gtag('config')` 和 `gtag('js')` 之前第一序位执行。广告类权限默认绝对拒绝。
- **Staging 流量隔离**：非生产域名自动激活 `debug_mode: true` 与 `traffic_type: 'staging'`，所有事件实时直投 GA4 DebugView，并在生产数据过滤器生效时自动剔除。

### 证据 B: 8 类行为事件与隐私保护实测
- `page_view`: 路由切换与落地加载时触发，标准上报 `page_path`、`locale`、`traffic_type`，禁用 GA4 默认双重上报。
- `pattern_view`: 进入详情页时准确上报 `pattern_id` (`bottom-sheet`)、`category` (`containers`)、`locale` (`zh`)、`traffic_type` (`staging`)。
- `demo_interact`: 首次点击触发上报；2 秒内快速连击触发**限流抑制**（0.5Hz 物理阈值），避免拖动/高频交互轰炸事件总线。
- `prompt_copy`: 点击复制 Prompt 后仅在写入剪贴板成功后触发；严格校验 `pattern_id` 与 `variant`；**完全未发送原始 Prompt 文本**（满足隐私防护要求）。
- `guide_search` & `search_no_result`: 仅上报命中数量 `result_count` 与 `locale`；**不发送原始搜索词文本**，杜绝潜在个人敏感信息泄露。
- `feedback_submit` & `feature_request_submit`: 提交成功后仅上报枚举类型，无自由文本泄露到 GA4。

### 证据 C: 用户反馈 UI 与会话防刷实测
- 正面反馈：点击「有帮助 (Yes)」直接完成单步快速提交，界面平滑过渡至「感谢你的反馈！」，并将投票结果写入当前会话 `sessionStorage`，防止用户在单次会话内误触重复刷票。
- 负面反馈：点击「还有待改进 (Not yet)」展开 4 项原因单选（解释不够清晰、Demo 有问题、Prompt 不好用、其他原因）及 500 字上限的补充输入框，具备实时字数统计（如 `8/500`）。
- 异常兜底：支持网络故障捕获与重试按钮，不虚报成功。

### 证据 D: Admin API 安全防护（Header-Only 强制鉴权）
- 已彻底移除 `url.searchParams.get('key')`，彻底杜绝 URL 传参鉴权。
- 携带 `?key=<ADMIN_API_KEY>` 的请求被严格拒绝返回 `401 Unauthorized`。
- 仅当请求头携带有效的 `x-admin-key: <ADMIN_API_KEY>` 时方允许读取数据。

### 证据 E: Staging/Production D1 数据隔离与读写闭环
- 远程数据库 `ufg-feedback-db` (ID: `b9ee7d6b-c8de-4d45-ba76-f922d8b881fb`) 完成真实写入与回读。
- 来自 `*.pages.dev`、`localhost` 或自动化测试的提交均被自动打标为 `status = 'staging_test'`。
- 数据导出接口 `/api/admin/export` 默认过滤 `WHERE status != 'staging_test' AND status != 'test'`，生产报表天然纯净。
- 边缘请求捕获粗粒度国家地区代码（如 `HK`, `CN`, `US`），**绝不保存用户原始 IP 或完整设备指纹**。

### 证据 F: 远端真实网络数据包拦截与 Consent 状态实测
- **测试执行**：运行独立网络拦截套件 [test-ga4-network-and-consent.mjs](file:///Users/bluehorizon/Workbuddy/UI-Study/scripts/test-ga4-network-and-consent.mjs) 直接对准线上预览环境 `https://preview-feedback-r1.lutive-ui-a2u.pages.dev`。
- **默认同意状态 (Granted)**：抓包确认发往 `google-analytics.com/g/collect` 的请求携带 `tid=G-E67MRP4HKJ`、`tt=staging`、`ep.debug_mode=true`，Google 状态码精确为 `gcs=G101`（广告拒绝、分析同意），`_ga` Cookie 正常按规范存储。
- **拒绝同意状态 (Denied)**：用户通过 `setConsent(false)` 拒绝后，网络抓包确认上报状态码自动切换为 `gcs=G100`（广告拒绝、分析拒绝），实测 `_ga` Cookie 完全不被写入 (`_ga cookie present = false`)。
- **数据包 Payload 实测**：抓取到 POST Body 包含 `en=pattern_view&ep.pattern_id=bottom-sheet&ep.category=containers` 及 `en=prompt_copy&ep.variant=conversational`。
- **客户端发出 vs GA4 实际接收说明**：
  - **客户端发出 (实测验证 PASS)**：通过 Chromium 网络抓包 100% 确认事件已组装并成功发出到 Google 端点。
  - **GA4 后端接收 (NEED_HUMAN)**：GA4 控制台无免密只读 API，需由拥有管理权限的 Human 打开 **GA4 ➔ DebugView** 做最后的肉眼核验。
