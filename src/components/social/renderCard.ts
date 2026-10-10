import type { UIPattern } from '@/data/types';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/ui-strings';

/**
 * 分享卡片渲染（纯 Canvas 2D，无外部依赖）。
 * 设计取向：商业级设计知识卡片，严格自顶向下盒模型排版（Box Model）。
 *
 * 关键修正：
 * 全局统一使用 `textBaseline = 'top'` 进行流式排版，彻底杜绝 alphabetic 基线导致的
 * 大字号向上重叠、文字压盖、以及展台底边遮挡「适合场景」的排版缺陷。
 */

const C = {
  canvas: '#FAF9F6',
  surface: '#FFFFFF',
  stageBg: '#F8F7F3',
  ink: '#1A1917',
  ink2: '#4A4740',
  muted: '#767269',
  line: '#E6E3DB',
  line2: '#F0EDE6',
  soft: '#F2F0EB',
  accent: '#1D734C',
};

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const SERIF = 'ui-serif, Georgia, "Songti SC", serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/**
 * 基于 textBaseline = 'top' 的按宽度换行排版。
 * (x, y) 为文本块左上角，返回绘制完毕后的底边 y 坐标。
 */
function wrapTextTop(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
): number {
  ctx.textBaseline = 'top';
  const chars = Array.from(text);
  let line = '';
  let lines = 0;

  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      lines++;
      line = chars[i];
      if (lines >= maxLines) {
        let rest = chars.slice(i).join('');
        while (ctx.measureText(rest + '…').width > maxWidth && rest.length > 1) {
          rest = rest.slice(0, -1);
        }
        ctx.fillText(rest + '…', x, y + (maxLines - 1) * lineHeight);
        return y + maxLines * lineHeight;
      }
    } else {
      line = test;
    }
  }

  if (line) {
    ctx.fillText(line, x, y + lines * lineHeight);
    lines++;
  }
  return y + lines * lineHeight;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/** 分隔线 */
function hLine(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, Math.round(y) + 0.5);
  ctx.lineTo(x + w, Math.round(y) + 0.5);
  ctx.stroke();
}

/**
 * 展台化组件居中展示。
 * 规范：采用 Contain 模式居中放置在微视窗内，限制最大放大比例不超过 1.05x，
 * 绝不过度放大截断，保留完整组件设计细节与周围舒适呼吸感。
 */
function drawShowcaseDemo(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number,
  W: number,
  locale: Locale,
  fallbackReason?: string
) {
  const radius = Math.round(W * 0.024);

  ctx.save();
  // 1. 展台外框与底色
  ctx.fillStyle = C.stageBg;
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();

  // 展台微边框
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, radius);
  ctx.stroke();

  // 2. 视窗标题栏（Window Chrome）
  const headerH = Math.round(W * 0.046);
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + headerH);
  ctx.lineTo(x, y + headerH);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  // 视窗底分割线
  hLine(ctx, x, y + headerH, w, C.line);

  // 窗口三色微圆点（Apple 极简风格）
  const dotR = Math.max(3.5, Math.round(W * 0.0055));
  const dotY = y + headerH / 2;
  const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
  dotColors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(x + Math.round(W * 0.028) + i * Math.round(W * 0.018), dotY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // 视窗居中小标签
  ctx.fillStyle = C.muted;
  ctx.font = `600 ${Math.round(W * 0.0135)}px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SHOWCASE VIEW', x + w / 2, dotY);
  ctx.textAlign = 'left';

  // 3. 视窗内部舞台点阵底纹（微网格质感）
  const stageX = x;
  const stageY = y + headerH;
  const stageW = w;
  const stageH = h - headerH;

  ctx.save();
  roundRect(ctx, stageX, stageY, stageW, stageH, radius);
  ctx.clip();

  // 浅淡点阵
  const dotGap = Math.round(W * 0.038);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
  for (let px = stageX + dotGap / 2; px < stageX + stageW; px += dotGap) {
    for (let py = stageY + dotGap / 2; py < stageY + stageH; py += dotGap) {
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. 居中渲染真实组件截图
  if (img && img.width > 0 && img.height > 0) {
    const ir = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    // 可用内容区域留出呼吸内边距
    const innerPadX = Math.round(stageW * 0.06);
    const innerPadY = Math.round(stageH * 0.08);
    const maxDrawW = stageW - innerPadX * 2;
    const maxDrawH = stageH - innerPadY * 2;

    // 关键算法：Contain 且限制最大缩放倍率不超过 1.05x，保证锐利且绝不裁切截断
    const scale = Math.min(1.05, maxDrawW / ir, maxDrawH / ih);
    const drawW = Math.round(ir * scale);
    const drawH = Math.round(ih * scale);

    const drawX = stageX + Math.round((stageW - drawW) / 2);
    const drawY = stageY + Math.round((stageH - drawH) / 2);

    // 柔和微外投影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
    ctx.shadowBlur = Math.round(W * 0.02);
    ctx.shadowOffsetY = Math.round(W * 0.008);

    ctx.drawImage(img, 0, 0, ir, ih, drawX, drawY, drawW, drawH);
  } else {
    // 兜底提示居中
    ctx.fillStyle = C.muted;
    ctx.font = `400 ${Math.round(W * 0.024)}px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fallbackReason || t(locale, 'share.previewGenerating'), stageX + stageW / 2, stageY + stageH / 2);
    ctx.textAlign = 'left';
  }

  ctx.restore();
  ctx.restore();
}

export interface ShareCardImage {
  demo: HTMLImageElement | null;
  fallbackReason?: string;
}

export function drawShareCard(
  canvas: HTMLCanvasElement,
  pattern: UIPattern,
  W: number,
  H: number,
  locale: Locale,
  image?: ShareCardImage
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  // 全局卡片画布底色
  ctx.fillStyle = C.canvas;
  ctx.fillRect(0, 0, W, H);

  // 严格自顶向下的盒模型排版
  ctx.textBaseline = 'top';

  const pad = Math.round(W * 0.075);
  const innerW = W - pad * 2;
  let y = pad;

  // ---------- 1. 顶部品牌与导航条 ----------
  const badgeSize = Math.round(W * 0.046);
  ctx.fillStyle = C.ink;
  roundRect(ctx, pad, y, badgeSize, badgeSize, badgeSize * 0.28);
  ctx.fill();

  ctx.fillStyle = C.canvas;
  ctx.font = `700 ${Math.round(badgeSize * 0.44)}px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('UF', pad + badgeSize / 2, y + badgeSize / 2);
  ctx.textAlign = 'left';

  // 品牌文字采用 top 基线
  ctx.fillStyle = C.ink;
  ctx.font = `600 ${Math.round(W * 0.017)}px ${MONO}`;
  ctx.textBaseline = 'top';
  ctx.fillText('UI FIELD GUIDE', pad + badgeSize + 12, y + 2);

  ctx.fillStyle = C.muted;
  ctx.font = `400 ${Math.round(W * 0.0145)}px ${SANS}`;
  ctx.fillText(t(locale, 'meta.tagline'), pad + badgeSize + 12, y + Math.round(badgeSize * 0.52));

  // 右上角 Level 标签
  const levelText = `LEVEL ${pattern.level}`;
  const tagSize = Math.round(W * 0.015);
  ctx.font = `600 ${tagSize}px ${MONO}`;
  const tagW = ctx.measureText(levelText).width + 20;
  const tagH = Math.round(W * 0.034);
  const tagX = W - pad - tagW;
  const tagY = y + (badgeSize - tagH) / 2;

  ctx.fillStyle = C.soft;
  roundRect(ctx, tagX, tagY, tagW, tagH, tagH / 2);
  ctx.fill();

  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  roundRect(ctx, tagX, tagY, tagW, tagH, tagH / 2);
  ctx.stroke();

  ctx.fillStyle = C.ink2;
  ctx.textBaseline = 'middle';
  ctx.fillText(levelText, tagX + 10, tagY + tagH / 2);
  ctx.textBaseline = 'top';

  // Header 区域结束，留出充足间距（彻底解决标题向上重叠）
  y += badgeSize + Math.round(W * 0.045);

  // ---------- 2. 英文组件名（向下自然流动） ----------
  const nameSize = Math.round(W * 0.068);
  ctx.fillStyle = C.ink;
  ctx.font = `700 ${nameSize}px ${SANS}`;
  y = wrapTextTop(ctx, pattern.name, pad, y, innerW, nameSize * 1.15, 2);
  y += Math.round(W * 0.016);

  // ---------- 3. 中文名与一句话简介 ----------
  const zhSize = Math.round(W * 0.033);
  ctx.fillStyle = C.muted;
  ctx.font = `400 ${zhSize}px ${SANS}`;
  const zhLabel = `${pattern.chineseName} · ${pattern.oneLine}`;
  y = wrapTextTop(ctx, zhLabel, pad, y, innerW, zhSize * 1.4, 2);
  y += Math.round(W * 0.036);

  // ---------- 4. 展台主体（Showcase Window） ----------
  const fitLabelSize = Math.round(W * 0.015);
  const fitSize = Math.round(W * 0.032);
  const askH = Math.round(W * 0.105);
  const footH = Math.round(W * 0.045);

  // 底部保留高度计算（留有充足的安全内衬，绝不相互挤压）
  const bottomSpace =
    Math.round(W * 0.035) + // 展台与“适合”的间距
    fitLabelSize + // 适合标签
    Math.round(W * 0.012) + // 标签与正文间距
    fitSize * 1.45 * 2 + // 正文两行
    Math.round(W * 0.028) + // 正文与 Ask AI 间距
    askH + // Ask AI 框
    Math.round(W * 0.025) + // Ask AI 与底部分割线间距
    footH; // 页脚

  const availStageH = H - y - bottomSpace;
  // 保持展台高宽比在 4:3 ~ 16:9 之间自适应
  const shotH = Math.max(Math.round(innerW * 0.38), Math.min(availStageH, Math.round(innerW * 0.58)));
  const shotX = pad;
  const shotY = y;
  const shotW = innerW;

  drawShowcaseDemo(
    ctx,
    image?.demo ?? null,
    shotX,
    shotY,
    shotW,
    shotH,
    W,
    locale,
    image?.fallbackReason
  );

  // 展台结束，推进 y 坐标并留出清晰间距
  y = shotY + shotH + Math.round(W * 0.038);

  // ---------- 5. 适合场景（顶部对齐，绝不被展台压挡） ----------
  ctx.fillStyle = C.muted;
  ctx.font = `600 ${fitLabelSize}px ${MONO}`;
  ctx.textBaseline = 'top';
  ctx.fillText(t(locale, 'share.fitsFor').toUpperCase(), pad, y);
  y += fitLabelSize + Math.round(W * 0.012);

  ctx.fillStyle = C.ink2;
  ctx.font = `400 ${fitSize}px ${SANS}`;
  y = wrapTextTop(ctx, pattern.fitsFor, pad, y, innerW, fitSize * 1.45, 2);
  y += Math.round(W * 0.025);

  // ---------- 6. 底部 Ask AI 精致提示卡 ----------
  const askY = Math.min(y, H - pad - askH - footH + Math.round(W * 0.01));
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, pad, askY, innerW, askH, Math.round(W * 0.02));
  ctx.fill();

  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  roundRect(ctx, pad, askY, innerW, askH, Math.round(W * 0.02));
  ctx.stroke();

  // Ask AI 标识
  const askBadgeSize = Math.round(W * 0.013);
  ctx.fillStyle = C.accent;
  ctx.font = `700 ${askBadgeSize}px ${MONO}`;
  ctx.textBaseline = 'top';
  ctx.fillText('ASK AI PROMPT', pad + Math.round(W * 0.028), askY + Math.round(askH * 0.22));

  // 提示词正文
  const askTextSize = Math.round(W * 0.028);
  ctx.fillStyle = C.ink;
  ctx.font = `italic 400 ${askTextSize}px ${SERIF}`;
  wrapTextTop(
    ctx,
    `“${t(locale, 'share.useIt', { name: pattern.name })}”`,
    pad + Math.round(W * 0.028),
    askY + Math.round(askH * 0.54),
    innerW - Math.round(W * 0.056),
    askTextSize * 1.35,
    1
  );

  // ---------- 7. 底部品牌与网址 ----------
  const footY = H - Math.round(W * 0.028);
  hLine(ctx, pad, footY - Math.round(W * 0.016), innerW, C.line);

  ctx.fillStyle = C.muted;
  ctx.font = `400 ${Math.round(W * 0.014)}px ${MONO}`;
  ctx.textBaseline = 'top';
  ctx.fillText('ui.lutivelab.com · LutiveLab Workflow Ecosystem', pad, footY);
}
