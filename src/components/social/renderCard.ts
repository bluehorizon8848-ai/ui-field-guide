import type { UIPattern } from '@/data/types';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/ui-strings';

/**
 * 分享卡片渲染（纯 Canvas 2D，无外部依赖）。
 * 设计取向：知识卡片，不是营销海报。留白大、字号层级强、只讲一件事。
 *
 * 关键约定：卡片中部是**真实 Demo 截图**（由 html-to-image 在运行时抓取），
 * 不用简化重绘 —— 重绘既认不出是哪个组件，缩放后还会糊。
 */

const C = {
  canvas: '#FAF9F6',
  surface: '#FFFFFF',
  ink: '#1A1917',
  ink2: '#4A4740',
  muted: '#6E6A61',
  line: '#E6E3DB',
  line2: '#F0EDE6',
  soft: '#F2F0EB',
};

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const SERIF = 'ui-serif, Georgia, "Songti SC", serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/** 按宽度换行 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
): number {
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
        // 截断并加省略号
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

/** 画一条圆角线（分隔用） */
function hLine(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, Math.round(y) + 0.5);
  ctx.lineTo(x + w, Math.round(y) + 0.5);
  ctx.stroke();
}

/**
 * 把一张图片按「覆盖裁切」方式画进指定矩形，保持原图宽高比，不留白不变形。
 * 这是解决「同一张图被压缩变形」的关键：不用 contain（会有letterbox），
 * 也不用 stretch（会变形），而是按需裁掉溢出部分。
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const ir = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!ir || !ih) return;

  // 目标框的宽高比
  const target = w / h;
  const src = ir / ih;

  ctx.save();
  roundRect(ctx, x, y, w, h, radius);
  ctx.clip();

  if (src > target) {
    // 原图更宽：按高度铺满，裁掉左右
    const drawW = ih * target;
    const cropX = (ir - drawW) / 2;
    ctx.drawImage(img, cropX, 0, drawW, ih, x, y, w, h);
  } else {
    // 原图更高或等比：按宽度铺满，裁掉上下（偏上，保留组件顶部）
    const drawH = ir / target;
    const cropY = (ih - drawH) * 0.28; // 28% 偏上，组件标题通常在顶部
    ctx.drawImage(img, 0, cropY, ir, drawH, x, y, w, h);
  }

  ctx.restore();
}

export interface ShareCardImage {
  /** 真实 Demo 截图 */
  demo: HTMLImageElement | null;
  /** 截图失败时的兜底提示 */
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

  // 底
  ctx.fillStyle = C.canvas;
  ctx.fillRect(0, 0, W, H);

  const pad = Math.round(W * 0.085);
  const innerW = W - pad * 2;
  let y = pad;

  // ---------- 顶部标识 ----------
  const badgeSize = Math.round(W * 0.052);
  ctx.fillStyle = C.ink;
  roundRect(ctx, pad, y, badgeSize, badgeSize, badgeSize * 0.26);
  ctx.fill();
  ctx.fillStyle = C.canvas;
  ctx.font = `600 ${Math.round(badgeSize * 0.37)}px ${SANS}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('UF', pad + badgeSize / 2, y + badgeSize / 2);

  ctx.fillStyle = C.muted;
  ctx.font = `500 ${Math.round(W * 0.0145)}px ${MONO}`;
  ctx.fillText('UI FIELD GUIDE', pad + badgeSize + 14, y + badgeSize * 0.38);
  ctx.fillStyle = C.ink2;
  ctx.font = `500 ${Math.round(W * 0.0165)}px ${SANS}`;
  ctx.fillText(t(locale, 'meta.tagline'), pad + badgeSize + 14, y + badgeSize * 0.72);

  y += badgeSize + Math.round(W * 0.055);

  // ---------- 英文名（大） ----------
  const nameSize = Math.round(W * 0.108);
  ctx.fillStyle = C.ink;
  ctx.font = `600 ${nameSize}px ${SANS}`;
  y = wrapText(ctx, pattern.name, pad, y, innerW, nameSize * 1.16, 2) + Math.round(W * 0.012);

  // ---------- 中文名 ----------
  const zhSize = Math.round(W * 0.045);
  ctx.fillStyle = C.muted;
  ctx.font = `400 ${zhSize}px ${SANS}`;
  y = wrapText(ctx, pattern.chineseName, pad, y, innerW, zhSize * 1.45, 2) + Math.round(W * 0.026);

  // ---------- LEVEL 标签 ----------
  const tagText = `LEVEL ${pattern.level}`;
  const tagSize = Math.round(W * 0.0145);
  ctx.font = `500 ${tagSize}px ${MONO}`;
  const tagW = ctx.measureText(tagText).width + 24;
  const tagH = Math.round(W * 0.032);
  ctx.fillStyle = C.soft;
  roundRect(ctx, pad, y, tagW, tagH, tagH / 2);
  ctx.fill();
  ctx.fillStyle = C.ink2;
  ctx.textBaseline = 'middle';
  ctx.fillText(tagText, pad + 12, y + tagH / 2);
  ctx.textBaseline = 'alphabetic';
  y += tagH + Math.round(W * 0.042);

  // ---------- 真实 Demo 截图（卡片主体） ----------
  // 高度完全由「剩余空间」驱动：先给底部区块留够，再把剩下的都给截图。
  // 之前用固定最小值会撑破 1:1 卡片（底部溢出），这里改成先算底部实际占用。
  const fitLabelSize = Math.round(W * 0.0145);
  const fitSize = Math.round(W * 0.035);
  const askSize = Math.round(W * 0.034);
  const askH = Math.round(W * 0.105);

  // 底部区块 = 「适合」标签 + 2 行正文 + Ask AI 框 + 分隔线/站点名
  const bottomReserve =
    fitLabelSize * 1.7 + // 标签行
    fitSize * 1.55 * 2 + // 正文两行
    W * 0.03 + // 间距
    askH + // Ask AI 框
    W * 0.052 + // 间距
    W * 0.022 + // 分隔线
    W * 0.032; // 站点名基线

  const availH = Math.max(H - y - bottomReserve, Math.round(innerW * 0.45));

  // 理想比例 4:3，但在可用空间内浮动，并留出 45% 的下限保证不塌
  const idealH = Math.round(innerW * 0.75);
  const minH = Math.min(Math.round(innerW * 0.5), availH);
  const shotH = Math.max(minH, Math.min(idealH, availH));

  const shotX = pad;
  const shotY = y;
  const shotW = innerW;

  // 截图底板
  ctx.fillStyle = C.surface;
  roundRect(ctx, shotX, shotY, shotW, shotH, Math.round(W * 0.022));
  ctx.fill();

  if (image?.demo) {
    try {
      drawImageCover(ctx, image.demo, shotX, shotY, shotW, shotH, Math.round(W * 0.022));
    } catch {
      drawFallback(ctx, shotX, shotY, shotW, shotH, W, locale);
    }
  } else {
    drawFallback(ctx, shotX, shotY, shotW, shotH, W, locale, image?.fallbackReason);
  }

  // 内描边，压住截图边缘
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1.5;
  roundRect(ctx, shotX, shotY, shotW, shotH, Math.round(W * 0.022));
  ctx.stroke();

  y = shotY + shotH + Math.round(W * 0.052);

  // ---------- 适合什么场景 ----------
  ctx.fillStyle = C.muted;
  ctx.font = `500 ${fitLabelSize}px ${MONO}`;
  ctx.fillText(t(locale, 'share.fitsFor'), pad, y);
  y += Math.round(fitLabelSize * 1.7);

  ctx.fillStyle = C.ink2;
  ctx.font = `400 ${fitSize}px ${SANS}`;
  y = wrapText(ctx, pattern.fitsFor, pad, y, innerW, fitSize * 1.55, 2) + Math.round(W * 0.03);

  // ---------- 底部 Ask AI ----------
  const askY = Math.min(y, H - pad - askH);
  ctx.fillStyle = C.soft;
  roundRect(ctx, pad, askY, innerW, askH, Math.round(W * 0.018));
  ctx.fill();

  ctx.fillStyle = C.muted;
  ctx.font = `500 ${Math.round(W * 0.0135)}px ${MONO}`;
  ctx.fillText('ASK AI', pad + Math.round(W * 0.024), askY + Math.round(askH * 0.32));

  ctx.fillStyle = C.ink;
  ctx.font = `italic 400 ${askSize}px ${SERIF}`;
  wrapText(
    ctx,
    t(locale, 'share.useIt', { name: pattern.name }),
    pad + Math.round(W * 0.024),
    askY + Math.round(askH * 0.68),
    innerW - Math.round(W * 0.048),
    askSize * 1.35,
    1
  );

  // 底部分隔线 + 站点
  const footY = H - Math.round(W * 0.032);
  hLine(ctx, pad, footY - Math.round(W * 0.022), innerW, C.line);
  ctx.fillStyle = C.muted;
  ctx.font = `400 ${Math.round(W * 0.0155)}px ${MONO}`;
  ctx.fillText('ui.lutivelab.com · LutiveLab', pad, footY);
}

function drawFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  W: number,
  locale: Locale,
  reason?: string
) {
  ctx.save();
  ctx.fillStyle = C.surface;
  roundRect(ctx, x, y, w, h, Math.round(W * 0.022));
  ctx.fill();

  // 居中提示
  ctx.fillStyle = C.muted;
  ctx.font = `400 ${Math.round(W * 0.032)}px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText(reason || t(locale, 'share.previewGenerating'), x + w / 2, y + h / 2);
  ctx.textAlign = 'left';
  ctx.restore();
}
