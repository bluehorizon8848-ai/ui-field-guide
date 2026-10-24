# UI Field Guide · Data Review Playbook (GA4 分析配置与 7/14 天复盘手册)

**Task ID:** UFG-FEEDBACK-R1-RELEASE-GATE-01  
**Measurement ID:** `G-E67MRP4HKJ`  
**Target Roles:** Product Analytics Engineer / Full-stack Lead / Community Growth  
**Review Cadence:** 发布后第 7 天 / 第 14 天例行复盘

---

## 1. 核心 KPI 定义与计算口径

为避免虚荣指标与基数失真，本规范统一各项 KPI 的分子、分母、去重方式与统计口径：

| KPI 名称 | 统计目标 | 分子 (Numerator) | 分母 (Denominator) | 去重口径 | 不可观测情况与局限 |
|---|---|---|---|---|---|
| **Pattern Detail Active Users** | 实际消费 Pattern 知识的用户规模 | 触发 `pattern_view` 的独立用户数 (`user_pseudo_id`) | 全站访问用户数 (`user_pseudo_id`) | 按用户维度去重 | 用户禁用 Cookie / 离线阅读时无法统计 |
| **Demo Interaction Rate (DIR)** | 用户动手试玩 Demo 的活跃深度 | 触发至少 1 次 `demo_interact` 的会话数 | 发生 `pattern_view` 的会话数 (`ga_session_id`) | 按会话维度去重 | 纯静态文本阅读型 Pattern（无 Demo）需排除 |
| **Prompt Copy Rate (PCR)** | 核心转化率：从理解到将 Prompt 复制给 AI | 触发 `prompt_copy` 的会话数 | 发生 `pattern_view` 的会话数 | 按会话去重 | 部分用户直接屏幕选中文本复制未点按钮 |
| **Search No-Result Rate (SNRR)** | 搜索体验盲区与内容缺口率 | `search_no_result` 事件总数 | `guide_search` 事件总数 | 事件级比率 | 恶意乱敲键盘或无意义字符串会导致比率虚高 |
| **Feedback Submission Rate (FSR)** | 用户主动反馈参与度 | 触发 `feedback_submit` 的会话数 | 发生 `pattern_view` 的会话数 | 按会话去重 | 绝大多数满意用户倾向于「用完即走」不留评价 |
| **Negative Feedback Ratio (NFR)** | 负面评价占比与原因分布 | `vote = 'no'` 的反馈条数 | `pattern_feedback` 总反馈条数 | 数据表记录级 | 样本量小于 30 时原因分布仅作定性参考 |
| **Social Referral Quality (SRQ)** | 社交媒体（小红书/X/Reddit）引流转化度 | 来源为 Social 且触发 `demo_interact` 或 `prompt_copy` 的用户数 | 来源为 Social 的着陆用户数 | 用户级归因 | 微信/App 内置浏览器剥离 Referrer 时归入 direct |

---

## 2. GA4 核心漏斗与路径探索配置指引 `[HUMAN_ACTION_REQUIRED]`

> [!NOTE]
> 请在 Google Analytics 4 左侧导航进入 **「探索 (Explore)」**，新建空白探索 (Blank Exploration)，并按以下步骤配置分析看板。

### 看板 1: Core Funnel (发现 ➔ 深入 ➔ 交互 ➔ 转化核心漏斗)
- **技术结构**: 漏斗探索 (Funnel Exploration)
- **漏斗步骤设置**:
  1. **步骤 1: 搜索或浏览探索 (Discovery)**
     - 事件名称包含 `guide_search` 或 页面路径 `page_path` 包含 `/explore/`
  2. **步骤 2: 打开 Pattern 详情页 (Exploration)**
     - 事件名称精确匹配 `pattern_view`
  3. **步骤 3: 试玩 Live Demo (Engagement)**
     - 事件名称精确匹配 `demo_interact`
  4. **步骤 4: 复制 Prompt 转化 (Conversion)**
     - 事件名称精确匹配 `prompt_copy`
- **拆分维度 (Breakdown)**: `sessionSource / medium` 或 `variant`
- **复盘指标**: 步骤流失率（Drop-off Rate）、全流程完成率、耗时中位数。

### 看板 2: Path Exploration (用户探索路径分析)
- **技术结构**: 路径探索 (Path Exploration)
- **起始点 (Starting Point)**:
  - 选择 **事件名称 (Event name)** ➔ `page_view`，或特定着陆页。
- **节点类型 (Node type)**: 事件名称 + 网页标题和屏幕名称。
- **关注点**: 用户进入首页后，是倾向于直接使用搜索框，还是按分类浏览？在查看 Pattern 遇到疑惑时，是流失还是触发了负面反馈？

### 看板 3: Prompt Variant 偏好分析
- **技术结构**: 任意格式自由表格 (Free-form Table)
- **行 (Rows)**: `pattern_id` (自定义维度)
- **列 (Columns)**: `variant` (`conversational`, `detailed`, `implementation`, `basic`, `better_prompt`)
- **度量 (Values)**: 事件计数 (`Event count`)、活跃用户数 (`Active users`)
- **分析结论**: 了解开发者更青睐“资深对话版 Prompt”还是“代码实现级 Prompt”，指导未来 Prompt 模版优化。

### 看板 4: Gap Analysis (内容盲区与零结果搜索)
- **技术结构**: 自由表格 + D1 数据库联合分析
- **GA4 分析**: 筛选 `search_no_result` 事件，观察发生时段与语言分布 (`locale`)。
- **D1 分析**: 运行 `node scripts/query-feedback.mjs requests`，提取用户在搜索无结果时主动提交的组件名称（如 Tree View、Color Picker、Virtual List 等）。

---

## 3. 流量来源与 UTM 规范 (Acquisition & Campaigns)

为准确归因各渠道流量并衡量 SRQ（社交引流转化度），推广链接需统一遵循以下 UTM 规范：

| 渠道场景 | `utm_source` | `utm_medium` | `utm_campaign` | 示例链接 |
|---|---|---|---|---|
| **小红书笔记/主页** | `xiaohongshu` | `social` | `ufg_launch` | `https://ui.lutivelab.com/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=ufg_launch` |
| **X (Twitter)** | `twitter` | `social` | `ufg_launch` | `https://ui.lutivelab.com/en/?utm_source=twitter&utm_medium=social&utm_campaign=ufg_launch` |
| **即刻 / Jike** | `jike` | `social` | `ufg_launch` | `https://ui.lutivelab.com/?utm_source=jike&utm_medium=social&utm_campaign=ufg_launch` |
| **微信公众号/社群** | `wechat` | `community` | `ufg_share` | `https://ui.lutivelab.com/?utm_source=wechat&utm_medium=community&utm_campaign=ufg_share` |
| **特定 Pattern 分享** | 自定义 | `referral` | `share_card` | `https://ui.lutivelab.com/patterns/modal/?utm_source=user_share&utm_medium=referral&utm_campaign=share_card` |

---

## 4. 7 天 / 14 天例行复盘执行清单

### Day 7 快速复盘 (上线 1 周)
- [ ] **运行 D1 汇总**: `node scripts/query-feedback.mjs summary` 查看整体反馈有益率（Yes vs No 比例）。
- [ ] **排查体验阻碍**: 若有任何 `reason = 'demo_issue'` 的负面评价，立即提取 `pattern_id` 并定位修复 Demo 运行异常。
- [ ] **监控零结果率**: 检查 `search_no_result` 占比，若 > 20%，审查是否有高频搜索词未覆盖在 alias 或 keywords 中。
- [ ] **Top 5 热门 Pattern**: 提取 `prompt_copy` 次数最高的 5 个 Pattern，作为二次社交卡片宣发重点。

### Day 14 深度决策复盘 (上线 2 周)
- [ ] **导出需求征集清单**: `node scripts/query-feedback.mjs export-json`。
- [ ] **新组件排期**: 按用户请求频次排序，筛选出 Top 3 呼声最高的新 Pattern 列入下一阶段生产任务。
- [ ] **负面原因整改**:
  - 若 `unclear_explanation` 居多：重构该词条的「一句话释义」与「Anatomy」图解。
  - 若 `prompt_not_useful` 居多：重构该词条的 Prompt 提示词模版。
- [ ] **渠道质量 ROI**: 对比各 UTM 渠道的 PCR（Prompt Copy Rate）与 DIR（Demo Interaction Rate），找出高质量工程师聚集社区。
