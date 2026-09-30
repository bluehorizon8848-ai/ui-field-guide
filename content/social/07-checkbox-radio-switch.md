# 07 · Checkbox、Radio、Switch：选错一个，表单体验差一截

> 首发第 7 篇 · 引入「表单控件的语义边界」

## 痛点

这三兄弟长得都是「一个小方块或圆点」，用的时候基本靠手感：

- 要选多个 → Checkbox
- 要选一个 → Radio
- 要开/关 → Switch

听着没问题。但**「选一个」和「开关」的区别**不是审美问题，是用户心智问题。

## 真正的分界

### Radio：多个选项，选一个

关键：**选项是互斥的、且要看得见。**

```
○ 照片
○ 视频
○ 文档
```

用户要**看**有哪些选项才能选。所以选项必须同时可见。

### Switch：一个状态的两种取值

关键：**这是一个东西，不是选项集合。**

```
[ 自动同步  ( ●━━ )  ]
```

用户不需要知道「还有别的选项」——他只想把这个东西打开或关闭。

**如果你的设置项有 3 个或更多可能的状态，就不是 Switch。** 该用 Radio、Segmented Control 或 Select。

### Checkbox：多个选项，各自独立

关键：**每个选项的开/关状态都有意义。**

```
☑ 自动上传
☐ 压缩原图
☐ 保存 EXIF
```

三个可以任意组合。

## 最常见的错误用法

### 错误 1：用 Switch 表示「关」

```
[ 通知  ( ━━● )  ]     ← 关着，但用户不知道关掉之后会怎样
```

改成 Radio：

```
● 全部通知
○ 只通知重要联系人
○ 完全关闭
```

**Switch 关掉后，界面上「什么都不发生」是好的；用户没法知道「关掉」的具体含义就不够好。** 如果有多个档位，用 Radio 或 Segmented。

### 错误 2：用 Checkbox 表示单选

```
☐ 照片
☑ 视频
☐ 文档
```

这在技术上可行，但用户会困惑：「为什么能同时勾两个？我是不是勾错了？」

**互斥就用 Radio，别让用户自己发现规则。**

### 错误 3：用 Radio 做「确认」

```
○ 删除
○ 保留
```

这不是选择，是**命令**。应该是一个确认 Dialog 加两个按钮。Radio 是「从选项中挑一个」，不是「挑一个然后执行」。

## 无障碍的硬差异

这三者的 ARIA 完全不一样，选对了不用额外工作，选错了要额外补救：

| 控件 | 语义 | 键盘 |
| --- | --- | --- |
| Checkbox | `<input type="checkbox">` | 空格切换 |
| Radio | `role="radiogroup"` + `role="radio"` | **方向键**在组内移动 |
| Switch | `role="switch"` + `aria-checked` | 空格切换 |

最常搞错的是 Radio：**必须用方向键，不能只用 Tab**。Tab 应该只在整组停一次。

## 怎么告诉 AI

❌
> 弄几个选择项让用户选照片还是视频

AI 可能给你 Checkbox，可能给你 Radio，随机。

✅
> 用 Radio 组做类型选择，两个选项：照片 / 视频，互斥，必须同时可见且默认不选中。
> - 语义：`role="radiogroup"`，容器 `aria-label="照片类型"`，每个选项 `role="radio"` + `aria-checked`
> - 键盘：Tab 进入组内一次，↑↓←→ 在选项间移动并同时选中，Esc 不需要处理
> - 布局：纵向排列选项，单选圆点在左，点击整行都能选中（label 包住 radio）
> - 不要用 Checkbox 实现互斥

## 延伸

- Checkbox：https://ui-field-guide.pages.dev/patterns/checkbox
- Radio：https://ui-field-guide.pages.dev/patterns/radio
- Switch：https://ui-field-guide.pages.dev/patterns/switch
- 完整对比：https://ui-field-guide.pages.dev/compare/checkbox-vs-radio-vs-switch

---

**一句话记住：** 有几个互斥选项用 Radio；只有一个东西的开关用 Switch；能各自独立开关用 Checkbox。
