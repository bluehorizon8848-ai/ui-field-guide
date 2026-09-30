# E2E 测试

Playwright 端到端测试，覆盖全站冒烟、交互、视觉/可访问性和分享卡片下载。

## 前置

```bash
npm install                    # 会带上 devDependency playwright
npx playwright install chromium
```

`npx playwright install` 只需要执行一次。如果下载过程末尾报 dirlock 错误但浏览器目录已生成，可以忽略。

## 运行

先构建并启动静态预览服务器（测试打的是 `out/` 产物，不是 dev server）：

```bash
npm run build
npm run serve      # 127.0.0.1:3111
```

然后在另一个终端：

```bash
npm run e2e              # 串跑下面四项
node scripts/e2e/sweep.mjs      # 全站 78 页冒烟
node scripts/e2e/interact.mjs   # 40 项交互
node scripts/e2e/visual.mjs     # 6 项视觉 / 可访问性
node scripts/e2e/download.mjs   # 9 项分享卡片 PNG 下载
```

每个脚本独立以退出码表示结果，可直接串进 CI。

### 量测脚本（不参与 e2e 判定，用于调布局）

```bash
npm run e2e:measure      # 各视口下 63 个 Demo 的舞台宽高对比
npm run e2e:crush        # 挤压 / 溢出排查，W=320 可换视口
```

`measure-crush.mjs` 会区分三种情况，避免误报：

- **页面级横向滚动** → 真问题
- **元素超出舞台边界** → 排除 `overflow-x-auto` 容器内的合法横向滚动
- **flex `nowrap` 挤压** → 排除「固定侧栏 + 主内容区」这类刻意设计

打其他端口用 `BASE_URL`：

```bash
BASE_URL='http://127.0.0.1:4173' node scripts/e2e/sweep.mjs
```

## 环境注意事项

在 WorkBuddy 环境下运行时需要清掉两个坑：

```bash
# 1. NODE_OPTIONS 注入的 FS Shim 会让 Next 构建失败
env -u NODE_OPTIONS -u CODEBUDDY_BROKERED_FS_HOOK_ENABLED npm run build

# 2. 代理会把 127.0.0.1 请求劫走返回 502
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY no_proxy='*' node scripts/e2e/sweep.mjs
```

脚本内的 base URL 默认 `http://127.0.0.1:3111`，可用 `BASE_URL` 覆盖。页面列表从 `sitemap.xml` 派生。

## 静态服务器和真托管的差异

`npm run serve`（`scripts/serve-export.mjs`）刻意对齐 Cloudflare Pages 的两个行为，否则测试会误报：

| 行为 | `python -m http.server` | `npm run serve` | Cloudflare Pages |
| --- | --- | --- | --- |
| 目录补尾斜杠 | 301 ✓ | 301 ✓ | 301 ✓ |
| 404 回退 `404.html` | ✗ 返回 Python 错误页 | ✓ 保留 404 状态码 | ✓ |

Python 默认服务器会让 `/nope-404` 拿到一个 500 字节的英文错误页，冒烟测试会判成「body 几乎为空」失败——这是服务器问题，不是产物问题。
