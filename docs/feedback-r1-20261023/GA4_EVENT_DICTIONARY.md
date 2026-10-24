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

## 4. Staging 流量隔离与数据过滤器设置 `[HUMAN_ACTION_REQUIRED]`

为了保证 Staging 预览环境（`*.pages.dev`）及本地调试数据绝对不污染生产报表，前端工程已内嵌双重隔离：
1. **自动开启 DebugView**：在非 `ui.lutivelab.com` 域名下自动注入 `debug_mode: true`，所有事件实时投递至 GA4 DebugView。
2. **流量标记**：自动打标 `traffic_type: 'staging'`。

### GA4 过滤器激活步骤（由管理员操作）：
1. 进入 GA4 后台：**管理 ➔ 数据流 (Data Streams) ➔ 选择 Web 数据流 ➔ 配置代码设置 (Configure tag settings)**。
2. 点击 **管理内部流量 (Define internal traffic)**：
   - 规则名称：`Staging Traffic`
   - `traffic_type` 值：`staging`
   - IP 地址匹配或条件保留默认。
3. 返回 **管理 ➔ 数据设置 (Data Settings) ➔ 数据过滤器 (Data Filters)**：
   - 找到或新建过滤器 `Traffic Type Filter`（类型为内部流量或开发者流量）。
   - 过滤器操作：**排除 (Exclude)**。
   - 过滤器状态设置为 **有效 (Active)**。

---

## 5. 验证与排查方法

1. **GA4 DebugView**：
   - 访问 `https://preview-feedback-r1.lutive-ui-a2u.pages.dev`。
   - 打开 GA4 后台 **管理 ➔ DebugView**。
   - 应能实时观察到 `page_view`、`pattern_view`、`demo_interact`、`prompt_copy` 信号流，所有事件均包含 `traffic_type: 'staging'`。
2. **浏览器开发者工具**：
   - Network 面板筛选 `collect?v=2`。
   - 确认 Query 参数包含 `tid=G-E67MRP4HKJ` 及对应事件名称。
