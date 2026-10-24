# UI Field Guide · GA4 Event Dictionary (埋点事件字典与配置手册)

**Task ID:** UFG-FEEDBACK-R1-RELEASE-GATE-01  
**Measurement ID:** `G-E67MRP4HKJ`  
**Site:** `https://ui.lutivelab.com/`  
**Consent Standard:** Google Consent Mode v2 (`analytics_storage: granted/denied`, `ad_storage: denied`, `ad_personalization: denied`, `ad_user_data: denied`)  
**Staging Separation:** `debug_mode: true` + `traffic_type: 'staging'` (自动识别 `*.pages.dev` 及 `localhost`)

---

## 1. 核心用户旅程事件架构

```
[Visit Page] ──► page_view (Standard & Deduplicated)
     │
     ├──► [Browse / Search] ──► guide_search / search_no_result
     │
     └──► [View Pattern] ────► pattern_view
               │
               ├──► [Try Interactive Demo] ──► demo_interact (Throttled ≤ 0.5Hz)
               ├──► [Copy Prompt] ──────────► prompt_copy (Success only)
               └──► [Submit Feedback] ──────► feedback_submit (Helpful / Unhelpful)
                         ▲
[Search Empty State] ────┴──────────────────► feature_request_submit (Missing Pattern)
```

---

## 2. 代码埋点事件与参数规范明细 (8 类核心事件)

| Event Name | 触发时机 (Trigger) | 附带参数 (Parameters) | 类型 | 示例值 | 隐私与防护规则 |
|---|---|---|---|---|---|
| `page_view` | 页面初次加载或客户端路由导航完成 | `page_path`<br>`page_location`<br>`page_title`<br>`locale`<br>`traffic_type` | string<br>string<br>string<br>string<br>string | `"/patterns/modal/"`<br>`"https://ui.lutivelab.com/patterns/modal/"`<br>`"Modal 模态对话框｜UI Field Guide"`<br>`"zh" \| "en"`<br>`"production" \| "staging"` | Next.js App Router 导航自动去重，避免重复上报；禁用 GA4 默认双重 page_view。 |
| `pattern_view` | 用户有效进入并渲染 Pattern 详情页 | `pattern_id`<br>`category`<br>`locale`<br>`traffic_type` | string<br>string<br>string<br>string | `"bottom-sheet"`<br>`"containers"`<br>`"zh"`<br>`"production"` | 中英文版本使用全局唯一的 `pattern_id`。 |
| `demo_interact` | 用户在 Live Demo 舞台中进行实质交互（点击按钮、切换开关、拖动滑块、切换 Tab） | `pattern_id`<br>`interaction_type`<br>`traffic_type` | string<br>string<br>string | `"bottom-sheet"`<br>`"click_button"` \| `"change_switch"` \| `"change_tab"`<br>`"production"` | **限流保护**：每个 Pattern 实例限制最高 2 秒触发一次（0.5Hz）。不监听鼠标移动或页面拖动，避免事件轰炸。 |
| `prompt_copy` | 用户点击并**真实成功**复制 Prompt 到剪贴板 | `pattern_id`<br>`variant`<br>`traffic_type` | string<br>string<br>string | `"bottom-sheet"`<br>`"conversational"` \| `"detailed"` \| `"implementation"` \| `"basic"` \| `"better_prompt"`<br>`"production"` | 仅在 Clipboard API 确认成功后触发。<br>**绝对禁止**向 GA4 发送完整 Prompt 文本。 |
| `guide_search` | 用户完成一次搜索（防抖 800ms 或回车确定提交） | `result_count`<br>`locale`<br>`traffic_type` | number<br>string<br>string | `6`<br>`"zh"`<br>`"production"` | **严防 PII**：不向 GA4 发送原始搜索词文本，仅上报命中数量与语言环境。 |
| `search_no_result` | 搜索确认无匹配结果 | `locale`<br>`traffic_type` | string<br>string | `"zh" \| "en"`<br>`"production"` | 零结果时触发，用于内容盲区和缺词率分析。 |
| `feedback_submit` | 用户在 Pattern 详情页成功提交内容评价 | `pattern_id`<br>`vote`<br>`reason`<br>`traffic_type` | string<br>string<br>string (可选)<br>string | `"modal"`<br>`"yes" \| "no"`<br>`"unclear_explanation" \| "demo_issue" \| "prompt_not_useful" \| "other"`<br>`"production"` | 单一会话 sessionStorage 防刷防重。<br>**绝对禁止**向 GA4 发送自由文本评论。 |
| `feature_request_submit` | 用户在搜索无结果时成功提交组件需求 | `request_type`<br>`traffic_type` | string<br>string | `"missing_pattern"`<br>`"production"` | 仅上报需求类型，真实组件名称和使用场景仅保存在受保护的 Cloudflare D1 中。 |

---

## 3. GA4 自定义维度与指标注册清单 `[HUMAN_ACTION_REQUIRED]`

> [!IMPORTANT]
> 由于 GA4 API 权限限制，以下自定义维度（Custom Dimensions）与指标（Custom Metrics）必须由拥有 `G-E67MRP4HKJ` 媒体资源管理权限的人员在 Google Analytics 控制台手动录入。录入路径：**管理 (Admin) ➔ 数据显示 (Data display) ➔ 自定义定义 (Custom definitions)**。

### A. 自定义维度 (Custom Dimensions)

| 维度名称 (Dimension Name) | 作用域 (Scope) | 事件参数 (Event Parameter) | 说明 |
|---|---|---|---|
| **Pattern ID** | 事件 (Event) | `pattern_id` | UI 模式唯一英文标识（如 `modal`, `tabs`, `bottom-sheet`） |
| **Pattern Category** | 事件 (Event) | `category` | 组件分类（如 `containers`, `navigation`, `feedback`） |
| **Interaction Type** | 事件 (Event) | `interaction_type` | Demo 交互动作（如 `click_button`, `change_switch`, `change_tab`） |
| **Prompt Variant** | 事件 (Event) | `variant` | Prompt 层级（`conversational`, `detailed`, `implementation`, `basic`, `better_prompt`） |
| **Feedback Vote** | 事件 (Event) | `vote` | 反馈正面/负面 (`yes` / `no`) |
| **Feedback Reason** | 事件 (Event) | `reason` | 负面评价原因归类 |
| **Locale** | 事件 (Event) | `locale` | 用户浏览语言 (`zh` / `en`) |
| **Traffic Type** | 事件 (Event) | `traffic_type` | 流量环境标识（`production` / `staging`） |

### B. 自定义指标 (Custom Metrics)

| 指标名称 (Metric Name) | 作用域 (Scope) | 事件参数 (Event Parameter) | 计量单位 (Unit of measurement) | 说明 |
|---|---|---|---|---|
| **Result Count** | 事件 (Event) | `result_count` | 标准 (Standard) | 搜索命中组件数量 |

---

## 4. Staging 流量隔离与开发者过滤器指引 `[HUMAN_ACTION_REQUIRED]`

为了保证 Staging 预览环境（`*.pages.dev`）及本地调试数据绝对不污染生产报表，前端工程已内嵌双重隔离：
1. **自动开启 DebugView**：在非 `ui.lutivelab.com` 域名下自动注入 `debug_mode: true`（网络请求附带 `_dbg=1`），GA4 会自动将其归类为 **Developer Traffic（开发者流量）**，并实时投递至 DebugView。
2. **流量环境打标**：自动打标 `traffic_type: 'staging'`。

### GA4 过滤器规范配置流程（优先使用 Developer Traffic Filter）

> [!CAUTION]
> **过滤器安全准则**：GA4 数据一旦被设为 Active 永久排除，被过滤的数据将**永久不可找回**。因此，严禁未经授权直接将任何过滤器启用为 Active (有效) 状态！必须严格遵循「先 Testing 后 Active」的流程。

#### 步骤 1: 启用 Developer Traffic 过滤器为「测试状态」
1. 进入 GA4 后台：**管理 (Admin) ➔ 数据设置 (Data Settings) ➔ 数据过滤器 (Data Filters)**。
2. 找到系统内建的 **Developer Traffic（开发者流量）** 过滤器（或新建一个开发者流量过滤器）。
3. 过滤器操作：**排除 (Exclude)**。
4. 过滤器状态：**务必选择「测试 (Testing)」**（切勿直接选「有效 (Active)」）。
   - **Testing 模式原理**：GA4 不会实际丢弃匹配数据，而是为该批流量打上维度 `Test data filter name = 'Developer Traffic'`。您可以在「探索 (Explore)」报表中按该维度拆分核对，确认生产真实用户的正常请求未被误杀。

#### 步骤 2: 7~14 天评估与转正审批
- 生产发布后第 7 天 / 第 14 天例行复盘时，检查 Testing 过滤器命中数据量。
- 确认只有 `*.pages.dev` 和内部开发者的调试访问被命中，且生产访问 100% 未被误判。
- 获得 Human 明确批准后，方可在控制台将该过滤器状态从 **「测试 (Testing)」** 变更为 **「有效 (Active)」**。

---

## 5. 验证与排查方法

1. **GA4 DebugView（实时接收验证）**：
   - 访问 `https://preview-feedback-r1.lutive-ui-a2u.pages.dev/patterns/bottom-sheet/`。
   - 打开 GA4 后台 **管理 ➔ DebugView**。
   - 应能实时观察到 `page_view`、`pattern_view`、`demo_interact`、`prompt_copy` 信号流（均附带 `traffic_type: 'staging'`）。
2. **浏览器开发者工具**：
   - Network 面板筛选 `collect?v=2`。
   - 确认 Query/Body 参数包含 `tid=G-E67MRP4HKJ` 及对应事件名称。
3. **Consent Mode v2 状态核验**：
   - 默认状态：网络请求携带 `gcs=G101`（广告拒绝、分析同意），无广告 ID。
   - 拒绝状态：网络请求携带 `gcs=G100`（广告拒绝、分析拒绝），且不写入 `_ga` Cookie。
