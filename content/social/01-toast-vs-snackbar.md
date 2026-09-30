# 01 · Toast 还是 Snackbar？我用了一天才想明白

> 首发第 1 篇 · 引入「你知道的比你以为的多」

## 痛点

「操作完弹个小提示」——这句话我说了三年。

直到某天我发现，我说的一直是 Snackbar，但我每次写的代码都是 Toast。

## 为什么分不清

因为它们长得太像：都在屏幕角落、深色底白字、几秒后消失。

所以大部分教程里它们是一张图。搜「Toast vs Snackbar」，出来的对比表通常是：

| | Toast | Snackbar |
| --- | --- | --- |
| 时长 | 2-4 秒 | 4-10 秒 |
| 位置 | 顶部/底部 | 底部 |
| 能否交互 | 否 | 能 |

看完还是不知道该选哪个。因为**参数不是决策依据**。

## 真正的区别只有一条

**用户需不需要做点什么。**

- 不需要 → Toast。「已保存」
- 需要 → Snackbar。「已删除」+「撤销」按钮

就这么一条。位置、时长、能不能交互，全都是这一条推出来的结果：

需要交互 → 停留时间必须够用户读完并伸手 → 所以是 4-10 秒 → 所以必须在拇指够得到的地方 → 所以在底部。

## 什么时候两个都别用

删了 20 张照片 —— 这不是 Snackbar，这是 Alert。
因为这个操作不可逆，而且后果严重。

Snackbar 适合的是「反悔成本低」的操作：归档、删除单条、标记已读。

## 怎么告诉 AI

❌
> 用户删除后弹个提示

这样 AI 大概率给你 Toast，或者给你一个没有按钮的假 Snackbar。

✅
> 删除成功后，在屏幕底部显示 Snackbar，停留 6 秒，左侧一个「撤销」文字按钮。点击后恢复该条并显示 Toast「已恢复」。用 role="status" 包裹，Esc 不关闭（因为有按钮需要焦点可达），点击遮罩不关闭。

最后一句是关键：**告诉 AI 什么不能关，比告诉它怎么开更重要。**

## 延伸

- 完整对比（含 Alert）：https://ui-field-guide.pages.dev/compare/toast-vs-snackbar-vs-alert
- Snackbar 词条：https://ui-field-guide.pages.dev/patterns/snackbar
- Toast 词条：https://ui-field-guide.pages.dev/patterns/toast

---

**一句话记住：** 需要用户点一下的，就不是 Toast。
