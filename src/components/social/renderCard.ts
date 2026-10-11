import type { UIPattern } from '@/data/types';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/ui-strings';

/**
 * 分享卡片渲染（纯 Canvas 2D，无外部依赖）。
 * 设计取向：商业级设计知识卡片，精简克制、突出组件、优雅一句话提示词。
 *
 * 核心优化：
 * 1. 彻底解决组件压扁问题：剥离内部假窗口套娃与杂乱 caption，采用纯净自适应舞台，居中等比呈现。
 * 2. 国际化精准适配：英文模式下（locale === 'en'）严格隐藏中文名称，呈现地道纯英文设计卡片。
 * 3. 布局极大精简：移除冗余的 BEST FOR 场景块，将 AI 提示词浓缩为极简优雅的一行胶囊，视觉重心彻底还给组件。
 */

const C = {
  canvas: '#FAF9F6',
  surface: '#FFFFFF',
  stageBg: '#FFFFFF',
  ink: '#0F172A',
  ink2: '#334155',
  muted: '#64748B',
  line: '#E2E8F0',
  line2: '#F1F5F9',
  soft: '#F8FAFC',
  accent: '#2563EB',
  accentBg: '#EFF6FF',
  accentBorder: '#BFDBFE',
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
 * 精纯组件居中展台。
 * 规范：极简单层视窗，去除冗余标签，严格 Contain 等比居中呈现，保留舒适呼吸感。
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

  // 展台微边框与柔和投影
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1.2;
  roundRect(ctx, x, y, w, h, radius);
  ctx.stroke();

  // 2. 视窗顶部装饰栏（Apple 极简风格微圆点）
  const headerH = Math.round(W * 0.042);
  ctx.fillStyle = '#FAFAFA';
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

  // 窗口三色微圆点
  const dotR = Math.max(3.5, Math.round(W * 0.0055));
  const dotY = y + headerH / 2;
  const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
  dotColors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(x + Math.round(W * 0.026) + i * Math.round(W * 0.018), dotY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // 3. 居中渲染真实组件截图（严格 1:1 纵横比，绝不拉伸压扁）
  const stageX = x;
  const stageY = y + headerH;
  const stageW = w;
  const stageH = h - headerH;

  ctx.save();
  roundRect(ctx, stageX, stageY, stageW, stageH, radius);
  ctx.clip();

  if (img && img.width > 0 && img.height > 0) {
    const ir = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    // 可用内容区域留出舒适内边距
    const innerPadX = Math.round(stageW * 0.08);
    const innerPadY = Math.round(stageH * 0.1);
    const maxDrawW = stageW - innerPadX * 2;
    const maxDrawH = stageH - innerPadY * 2;

    // Contain 严格等比例
    const scale = Math.min(1.0, maxDrawW / ir, maxDrawH / ih);
    const drawW = Math.round(ir * scale);
    const drawH = Math.round(ih * scale);

    const drawX = stageX + Math.round((stageW - drawW) / 2);
    const drawY = stageY + Math.round((stageH - drawH) / 2);

    // 柔和微外投影
    ctx.shadowColor = 'rgba(15, 23, 42, 0.04)';
    ctx.shadowBlur = Math.round(W * 0.02);
    ctx.shadowOffsetY = Math.round(W * 0.006);

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

  y += badgeSize + Math.round(W * 0.045);

  // ---------- 2. 组件名 ----------
  const nameSize = Math.round(W * 0.072);
  ctx.fillStyle = C.ink;
  ctx.font = `700 ${nameSize}px ${SANS}`;
  y = wrapTextTop(ctx, pattern.name, pad, y, innerW, nameSize * 1.15, 2);
  y += Math.round(W * 0.016);

  // ---------- 3. 核心介绍（英文不展示中文名，突出纯粹组件介绍） ----------
  const isEn = locale === 'en';
  const introText = isEn
    ? pattern.oneLine
    : `${pattern.chineseName} · ${pattern.oneLine}`;

  const introSize = Math.round(W * 0.034);
  ctx.fillStyle = C.muted;
  ctx.font = `400 ${introSize}px ${SANS}`;
  y = wrapTextTop(ctx, introText, pad, y, innerW, introSize * 1.45, 2);
  y += Math.round(W * 0.04);

  // ---------- 4. 展台主体（Showcase Window） ----------
  // 底部精简后仅保留一句话提示词与页脚，释放出极大纵向高度给组件展示
  const promptH = Math.round(W * 0.075);
  const footH = Math.round(W * 0.042);
  const bottomSpace = promptH + Math.round(W * 0.035) + footH + Math.round(W * 0.02);

  const availStageH = H - y - bottomSpace;
  const shotH = Math.max(Math.round(innerW * 0.42), availStageH);
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

  y = shotY + shotH + Math.round(W * 0.032);

  // ---------- 5. 一句话提示词卡片（极简优雅） ----------
  const promptY = y;
  const promptCardH = promptH;
  ctx.fillStyle = C.surface;
  roundRect(ctx, pad, promptY, innerW, promptCardH, Math.round(W * 0.018));
  ctx.fill();

  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  roundRect(ctx, pad, promptY, innerW, promptCardH, Math.round(W * 0.018));
  ctx.stroke();

  // PROMPT 微胶囊标识
  const badgeW = Math.round(W * 0.125);
  const badgeH = Math.round(promptCardH * 0.46);
  const badgeX = pad + Math.round(W * 0.024);
  const badgeY = promptY + Math.round((promptCardH - badgeH) / 2);

  ctx.fillStyle = C.accentBg;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.fill();

  ctx.strokeStyle = C.accentBorder;
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.stroke();

  ctx.fillStyle = C.accent;
  ctx.font = `700 ${Math.round(W * 0.0145)}px ${MONO}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('PROMPT', badgeX + badgeW / 2, badgeY + badgeH / 2);
  ctx.textAlign = 'left';

  // 一句话提示词正文
  const promptText = `“${t(locale, 'share.useIt', { name: pattern.name })}”`;
  const textX = badgeX + badgeW + Math.round(W * 0.02);
  const textY = promptY + promptCardH / 2;
  const promptTextSize = Math.round(W * 0.026);
  ctx.fillStyle = C.ink;
  ctx.font = `italic 500 ${promptTextSize}px ${SERIF}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(promptText, textX, textY);

  // ---------- 6. 底部品牌与网址 ----------
  const footY = H - Math.round(W * 0.028);
  hLine(ctx, pad, footY - Math.round(W * 0.014), innerW, C.line);

  ctx.fillStyle = C.muted;
  ctx.font = `400 ${Math.round(W * 0.014)}px ${MONO}`;
  ctx.textBaseline = 'top';
  ctx.fillText('ui.lutivelab.com · LutiveLab', pad, footY);
}
