# UI Field Guide · Cloudflare D1 Schema & API 文档

**Task ID:** UFG-FEEDBACK-R1-20261023  
**Database Name:** `ufg-feedback-db`  
**Database ID:** `b9ee7d6b-c8de-4d45-ba76-f922d8b881fb`  
**Wrangler Binding:** `DB`  
**Hosting Architecture:** Cloudflare Pages Functions (`functions/api/`)

---

## 1. 数据库表结构 (D1 Schema)

### 表 1: `pattern_feedback` (Pattern 详情页有益度反馈)

```sql
CREATE TABLE IF NOT EXISTS pattern_feedback (
  feedback_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  feedback_type TEXT NOT NULL,
  pattern_id TEXT NOT NULL,
  vote TEXT NOT NULL,
  reason TEXT,
  optional_comment TEXT,
  locale TEXT NOT NULL,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_pattern_feedback_pattern ON pattern_feedback(pattern_id);
CREATE INDEX IF NOT EXISTS idx_pattern_feedback_created ON pattern_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_pattern_feedback_vote ON pattern_feedback(vote);
```

**字段说明**:
- `feedback_id`: 客户端或边缘生成的 UUID v4，主键。
- `created_at`: ISO 8601 UTC 时间字符串（例如 `2026-10-23T15:30:00.000Z`）。
- `feedback_type`: 业务类型，固定为 `'pattern_helpful'`。
- `pattern_id`: Pattern 唯一英文字符串（如 `modal`, `bottom-sheet`）。
- `vote`: 投票类型，`'yes'`（有帮助）或 `'no'`（有待改进）。
- `reason`: 负面反馈原因白名单：`'unclear_explanation'` \| `'demo_issue'` \| `'prompt_not_useful'` \| `'other'`。正面反馈时为 `NULL`。
- `optional_comment`: 用户可选文字补充，限制最大 500 字符，过滤控制字符。
- `locale`: 页面语言 (`'zh'` \| `'en'`)。
- `country`: 从边缘请求头提取的粗粒度国家地区代码（如 `CN`, `US`, `HK`）。不保存原始 IP。
- `status`: 运维与环境隔离状态（生产正常提交：`'new'`；测试/预览提交：`'staging_test'`；已复盘处理：`'reviewed'`；已归档：`'archived'`）。生产导出接口默认自动过滤排除 `'staging_test'` 与 `'test'`。

---

### 表 2: `feature_request` (搜索无结果时的组件需求征集)

```sql
CREATE TABLE IF NOT EXISTS feature_request (
  request_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  request_type TEXT NOT NULL,
  query TEXT,
  pattern_name TEXT NOT NULL,
  use_case TEXT,
  reference_url TEXT,
  locale TEXT NOT NULL,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_feature_request_created ON feature_request(created_at);
CREATE INDEX IF NOT EXISTS idx_feature_request_type ON feature_request(request_type);
```

**字段说明**:
- `request_id`: UUID v4 主键。
- `created_at`: ISO 8601 UTC 时间。
- `request_type`: 业务类型，固定为 `'missing_pattern'`。
- `query`: 用户搜索时的原词（选填，最大 100 字符）。
- `pattern_name`: 用户希望看到的组件或交互名称（必填，最大 100 字符）。
- `use_case`: 使用场景描述（选填，最大 500 字符）。
- `reference_url`: 参考链接（选填，校验需以 `http://` 或 `https://` 开头，最大 300 字符）。
- `locale`: 页面语言 (`'zh'` \| `'en'`)。
- `country`: 粗粒度国家地区代码。
- `status`: 状态 (`'new'` \| `'reviewed'` \| `'archived'`)。

---

## 2. 边缘 API 接口规范 (Pages Functions)

所有 API 均位于同域 `/api/*` 下，静态资源不经过 Worker 路由，零多余配额消耗。

### 接口 1: 提交 Pattern 反馈
- **Path**: `POST /api/feedback`
- **CORS**: 支持同源及 `ui.lutivelab.com`、`*.pages.dev` 与本地开发端口。
- **Rate Limit**: 基于边缘 IP 内存桶限流（单个 IP 每 5 分钟最多 15 次）。
- **Request Body (JSON)**:
  ```json
  {
    "pattern_id": "modal",
    "vote": "no",
    "reason": "unclear_explanation",
    "optional_comment": "希望增加移动端适配说明",
    "locale": "zh"
  }
  ```
- **Response 201 Created**:
  ```json
  {
    "ok": true,
    "feedback_id": "4b07234b-3675-437d-9f4f-c0a43d6268b7"
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: 参数不合法（如 pattern_id 非法字符、字数超限、vote 取值错误）。
  - `429 Too Many Requests`: 触发速率限制。
  - `503 Service Unavailable`: D1 绑定不可用。

---

### 接口 2: 提交缺失组件需求
- **Path**: `POST /api/feature-request`
- **Rate Limit**: 基于边缘 IP 内存桶限流（单个 IP 每 5 分钟最多 10 次）。
- **Request Body (JSON)**:
  ```json
  {
    "pattern_name": "Color Picker",
    "query": "取色器",
    "use_case": "画板应用选色",
    "reference_url": "https://developer.mozilla.org",
    "locale": "zh"
  }
  ```
- **Response 201 Created**:
  ```json
  {
    "ok": true,
    "request_id": "50d28670-22c5-4597-a358-91fdb53a6f8f"
  }
  ```

---

### 接口 3: 安全导出与只读查询 (Protected Admin Endpoint)
- **Path**: `GET /api/admin/export`
- **Auth**: **仅支持 Header 鉴权**：请求头必须携带 `x-admin-key: <ADMIN_API_KEY>`。为彻底杜绝日志泄露、历史记录痕迹及 Referer 泄漏隐患，**严禁在 URL Query 中传递 key**。未配置密钥或不匹配严格返回 `401 Unauthorized`。
- **Query Params**:
  - `table`: `'all'` \| `'feedback'` \| `'feature_requests'` (默认 `'all'`)
  - `limit`: 最大获取条数（默认 100，最高 1000）
  - `include_test`: 是否包含 Staging/测试数据（`'true'` \| `'false'`，默认 `'false'`，即默认严格隔离只返回生产纯净数据）
- **Response 200 OK**:
  ```json
  {
    "ok": true,
    "timestamp": "2026-10-24T11:20:00.000Z",
    "feedback": [...],
    "requests": [...]
  }
  ```

---

## 4. 边缘限流机制与边界说明 (Rate Limiting Architecture)

- **实现机制**：在 Cloudflare Pages Functions 内存中维护针对客户端 IP 的请求计数桶（反馈接口：15 次 / 5 分钟；需求征集：10 次 / 5 分钟）。
- **边界与防护层级**：该机制为 **V8 Isolate 边缘突发防护（Burst Protection）**，直接抵御单个连接或恶意自动化脚本的高频循环调用；Map 集合上限设定为 1,000 个 IP，并自动淘汰过期条目以防止边缘节点内存膨胀。
- **多机房跨地域限流**：如需跨 Cloudflare 全球 300+ 数据中心的全局协同限流，可在 Cloudflare Dashboard 的 **Security > WAF > Rate Limiting** 页面配置免费限流规则，无需改动任何业务代码。

---

## 5. 本地与运维命令行查询工具

无需依赖网络 API，开发者及管理员在本地随时可通过 CLI 快速巡检：

```bash
# 1. 打印全站统计看板（投票总览、负面原因分布、Top 10 Pattern、Top 10 需求）
node scripts/query-feedback.mjs summary

# 2. 查询最近 30 条详细反馈
node scripts/query-feedback.mjs feedback 30

# 3. 查询最近 30 条组件需求
node scripts/query-feedback.mjs requests 30

# 4. 导出全量数据为本地 JSON 归档文件
node scripts/query-feedback.mjs export-json
```
