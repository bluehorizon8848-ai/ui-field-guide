# 04 · Tabs 和 Segmented Control：它们不是「风格不同」

> 首发第 4 篇 · 引入「同一个东西的两种表达」

## 痛点

Tabs 还是 Segmented Control？

大部分人凭审美选。系统设计语言匹配的那种。

**这是错的。** 它们解决的不是同一个问题。

## 真正的区别：内容换没换「视角」

### Segmented Control —— 同一份数据的不同筛选

```
[ 全部 | 照片 | 视频 ]
```

切换的是**过滤条件**。底层还是那批东西，只是筛出来的不同。

在 iOS 上，Tab Bar 切的是**不同的功能区**（微信的「微信 / 通讯录 / 发现 / 我」），Segmented Control 切的是**同一功能的参数**（邮件的「收件箱 / 草稿箱」是 Tab，「全部 / 未读 / 已标记」是 Segmented）。

### Tabs —— 不同的内容域

```
┌─────────┬─────────┐
│ 概览    │ 详情    │
└─────────┴─────────┘
```

切换的是**完全不同的信息**。概览页有图表，详情页有表单。两者没有共同的数据源。

## 决策规则

| 情况 | 用什么 |
| --- | --- |
| 切换的是同一批数据的筛选 | Segmented Control |
| 切换的是完全不同的内容 | Tabs |
| 内容标签长度差异大 | Tabs（能换行、能滚动） |
| 需要显示数量徽标 | 两者都行，Tabs 空间更大 |
| 只有 2-3 项且都很短 | Segmented（更紧凑） |
| 移动端底部固定 | Tab Bar（不是 Tabs） |

## 一个常犯的错

把 Segmented Control 当成按钮组用：

```
[ 编辑 | 删除 | 分享 ]   ← 这是工具栏，不是 Segmented
```

**Segmented Control 的语义是「选项之一」，不是「动作」。** 动作是 Button 的活。

判据：能不能只选中一个？能 → Segmented。不能（可以同时触发）→ Button 组。

## 怎么告诉 AI

❌
> 加一个切换按钮，样式像 iOS 那种

AI 理解成什么全看运气。

✅
> 用 Segmented Control 做照片类型筛选。三个选项：全部 / 照片 / 视频，当前选中「全部」。
> - 语义：这是同一批数据的筛选，不是不同页面
> - 用 `role="radiogroup"` + 每个项 `role="radio"`，不要用 tab
> - 整组高度 32px，圆角 8px，选中项白底 + 轻微阴影，未选中透明
> - 切换时底下不要有滑动指示条（那是 Tabs 的视觉）
> - 键盘：左右方向键切换选中项，Tab 键整组只占一个停靠点

最后一条最容易被忽略：**Segmented 用 radio 语义，Tabs 用 tab 语义。** 屏幕阅读器的行为完全不同 —— radio 是「你在选一个」，tab 是「你要去某个区域」。

## 延伸

- Tabs 词条：https://ui-field-guide.pages.dev/patterns/tabs
- Segmented Control 词条：https://ui-field-guide.pages.dev/patterns/segmented-control
- 完整对比：https://ui-field-guide.pages.dev/compare/tabs-vs-segmented-control

---

**一句话记住：** 切的是数据的筛选，用 Segmented；切的是内容，用 Tabs。
