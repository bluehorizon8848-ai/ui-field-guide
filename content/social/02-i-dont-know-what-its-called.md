# 02 · 「我想要那个从下面弹出来的」—— 一句模糊需求能浪费多少时间

> 首发第 2 篇 · 引入 Identify 工具

## 痛点

「帮我做一个从底部弹出的选择面板」

这句话说出来很自然。但它至少指向三个不同的组件：

- **Bottom Sheet** —— 贴着屏幕底部，承载一组选择
- **Action Sheet** —— iOS 专属，从底部升起的一列动作
- **Drawer** —— 从**侧边**滑出，导航用

如果你不说清楚，AI 会挑一个。挑得对不对？纯看运气。

## 分辨方法：问自己两个问题

### 问题一：它出现在哪儿？

不是问「它怎么动」，是问「它占据屏幕的哪一块」。

- 底部 → Bottom Sheet / Action Sheet
- 侧边 → Drawer
- 正中间 → Dialog / Modal
- 跟着某个元素 → Popover / Tooltip

### 问题二：它主要是干什么的？

- 跳到别处 → 导航类
- 从几个里挑一个 → 选择类
- 打字 → 输入类
- 显示状态 → 反馈类
- 要用户点头 → 确认类

**两个答案交叉，基本就锁定了。**

底部 + 选择 → Bottom Sheet
侧边 + 跳转 → Drawer
中间 + 确认 → Dialog

## 为什么这一步值得花时间

因为这不只是「选对组件」，是**让 AI 少猜一步**。

我测试过同一个需求的两种问法：

❌
> 帮我做一个选择面板，从底部弹出来的

AI 给的：完整屏 Modal + 列表 + 搜索框。功能齐全，但你要的全部都有、还多了一堆。

✅
> 用 Bottom Sheet 做移动端的选择面板。从底部升起，最大高度 60% 屏高，顶部有拖拽 handle。点遮罩关闭，关闭时向下滑动 200ms。里面是一组 4 个选项，选中后高亮并自动关闭。用 role="dialog"，打开时焦点移到第一个选项。

区别不是「AI 更聪明了」，是**你把决策做了，AI 只负责执行**。

## 一个更省事的做法

如果连「它在哪儿」都说不清，直接用反向工具：

1. 打开 https://ui-field-guide.pages.dev/identify
2. 回答两个问题（位置 / 作用）
3. 得到候选列表，每个带示意图

不用查文档，不用搜索，靠规则匹配。

## 延伸

- Bottom Sheet：https://ui-field-guide.pages.dev/patterns/bottom-sheet
- Drawer：https://ui-field-guide.pages.dev/patterns/drawer
- 三者完整对比：https://ui-field-guide.pages.dev/compare/dialog-vs-bottom-sheet-vs-drawer

---

**一句话记住：** 说不清叫什么，就回答「在哪」和「干什么」。
