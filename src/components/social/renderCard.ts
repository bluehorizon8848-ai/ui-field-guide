import type { UIPattern } from '@/data/types';

/**
 * 分享卡片渲染（纯 Canvas 2D，无外部依赖）。
 * 设计取向：知识卡片，不是营销海报。留白大、字号层级强、只讲一件事。
 */

const C = {
  canvas: '#FAF9F6',
  surface: '#FFFFFF',
  ink: '#1A1917',
  ink2: '#4A4740',
  muted: '#7A766D',
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
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** 卡片中部的小型示意图（按 pattern 类型绘制） */
function drawMini(
  ctx: CanvasRenderingContext2D,
  pattern: UIPattern,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.translate(x, y);

  const s = Math.min(w / 240, h / 132);
  ctx.scale(s, s);
  const ox = (w / s - 240) / 2;
  const oy = (h / s - 132) / 2;
  ctx.translate(ox, oy);

  const bar = (bx: number, by: number, bw: number, fill = C.line) => {
    ctx.fillStyle = fill;
    roundRect(ctx, bx, by, bw, 4, 2);
    ctx.fill();
  };
  const rect = (bx: number, by: number, bw: number, bh: number, fill = C.soft, r = 4) => {
    ctx.fillStyle = fill;
    roundRect(ctx, bx, by, bw, bh, r);
    ctx.fill();
  };
  const strokeRect = (
    bx: number,
    by: number,
    bw: number,
    bh: number,
    color = C.line,
    r = 6
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    roundRect(ctx, bx, by, bw, bh, r);
    ctx.stroke();
  };

  const id = pattern.id;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (id === 'accordion' || id === 'collapsible') {
    for (let i = 0; i < 3; i++) {
      const y = 26 + i * 34;
      bar(24, y, i === 0 ? 110 : 88, i === 0 ? C.ink : C.ink2);
      if (i === 0) rect(24, y + 12, 192, 20, C.line2, 3);
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(202, y + 2);
      ctx.lineTo(208, y + 8);
      ctx.lineTo(202, y + 14);
      ctx.stroke();
    }
  } else if (id === 'modal' || id === 'dialog' || id === 'modal-stateful' || id === 'destructive-action') {
    rect(20, 22, 200, 88, '#DEDBD3', 8);
    rect(56, 38, 128, 58, C.surface, 8);
    strokeRect(56, 38, 128, 58);
    bar(72, 54, 76, C.ink);
    bar(72, 70, 92, C.line);
    rect(126, 80, 42, 10, C.ink, 3);
  } else if (id === 'bottom-sheet') {
    rect(20, 18, 200, 54, '#DEDBD3', 8);
    rect(20, 66, 200, 50, C.surface, 12);
    ctx.fillStyle = C.surface;
    roundRect(ctx, 20, 66, 200, 20, 12);
    ctx.fill();
    rect(102, 72, 36, 4, C.line, 2);
    bar(40, 86, 92, C.ink);
    bar(40, 98, 64, C.line);
  } else if (id === 'drawer') {
    rect(20, 20, 200, 92, '#DEDBD3', 8);
    rect(20, 20, 88, 92, C.surface, 8);
    rect(84, 20, 24, 92, C.surface, 0);
    bar(34, 36, 28, C.ink);
    bar(34, 54, 56, C.line);
    bar(34, 72, 44, C.line);
    bar(34, 90, 32, C.line);
  } else if (id === 'toast' || id === 'snackbar') {
    rect(78, 20, 84, 26, C.ink, 6);
    if (id === 'snackbar') {
      rect(48, 62, 144, 40, C.surface, 6);
      strokeRect(48, 62, 144, 40);
      bar(62, 76, 74, C.ink);
      bar(62, 88, 46, C.line);
      rect(40, 112, 160, 26, C.ink, 6);
    } else {
      rect(48, 66, 144, 42, C.surface, 6);
      strokeRect(48, 66, 144, 42);
      bar(62, 80, 84, C.ink);
      bar(62, 92, 56, C.line);
    }
  } else if (id === 'skeleton' || id === 'list') {
    for (let i = 0; i < 3; i++) {
      const y = 28 + i * 32;
      rect(20, y, 200, 26, C.surface, 5);
      strokeRect(20, y, 200, 26);
      rect(26, y + 5, 16, 16, id === 'skeleton' ? C.line2 : C.soft, 3);
      bar(50, y + 9, 70, id === 'skeleton' ? C.line2 : C.ink2);
      bar(50, y + 17, 42, C.line2);
    }
  } else if (id === 'tabs' || id === 'segmented-control') {
    bar(20, 34, 46, C.ink);
    bar(76, 34, 40, C.line);
    bar(126, 34, 52, C.line);
    rect(20, 48, 200, 56, C.soft, 6);
    bar(38, 62, 96, C.ink2);
    bar(38, 78, 66, C.line);
  } else if (id === 'switch' || id === 'checkbox' || id === 'radio') {
    for (let i = 0; i < 2; i++) {
      const y = 42 + i * 40;
      bar(20, y, 84);
      if (id === 'switch') {
        rect(150, y - 10, 46, 26, i === 0 ? '#2C7355' : '#D8D5CD', 13);
        ctx.fillStyle = C.surface;
        ctx.beginPath();
        ctx.arc(i === 0 ? 183 : 163, y + 3, 10, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = C.muted;
        ctx.lineWidth = 1.6;
        if (id === 'radio') {
          ctx.beginPath();
          ctx.arc(30, y + 3, 9, 0, Math.PI * 2);
          ctx.stroke();
          if (i === 0) {
            ctx.fillStyle = C.ink;
            ctx.beginPath();
            ctx.arc(30, y + 3, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          roundRect(ctx, 21, y - 6, 18, 18, 4);
          ctx.stroke();
          if (i === 0) {
            ctx.fillStyle = C.ink;
            roundRect(ctx, 21, y - 6, 18, 18, 4);
            ctx.fill();
          }
        }
      }
    }
  } else if (id === 'slider' || id === 'progress-bar') {
    rect(20, 62, 200, 6, C.line, 3);
    rect(20, 62, 108, 6, C.ink, 3);
    ctx.fillStyle = C.surface;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(128, 65, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (id === 'tabs-never' || id === 'empty-state' || id === 'error-state' || id === 'success-state') {
    const tone = id === 'error-state' ? '#FAEDEC' : id === 'success-state' ? '#E6F2EC' : C.soft;
    const mark = id === 'error-state' ? '#A8342C' : id === 'success-state' ? '#2C7355' : C.muted;
    ctx.fillStyle = tone;
    ctx.beginPath();
    ctx.arc(120, 46, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = mark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (id === 'error-state') {
      ctx.moveTo(120, 36);
      ctx.lineTo(120, 48);
      ctx.moveTo(120, 55);
      ctx.lineTo(120, 56);
    } else {
      ctx.moveTo(110, 46);
      ctx.lineTo(118, 54);
      ctx.lineTo(131, 39);
    }
    ctx.stroke();
    bar(78, 82, 84, C.ink);
    bar(94, 98, 52, C.line);
    rect(88, 110, 64, 16, C.ink, 4);
  } else if (id === 'spinner') {
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(120, 60, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = C.ink;
    ctx.beginPath();
    ctx.arc(120, 60, 20, -Math.PI / 2, Math.PI * 2);
    ctx.stroke();
  } else if (id === 'tooltip') {
    ctx.fillStyle = C.soft;
    ctx.beginPath();
    ctx.arc(56, 60, 18, 0, Math.PI * 2);
    ctx.fill();
    rect(80, 44, 88, 30, C.ink, 6);
    ctx.fillStyle = C.surface;
    ctx.beginPath();
    ctx.moveTo(86, 44);
    ctx.lineTo(94, 36);
    ctx.lineTo(102, 44);
    ctx.closePath();
    ctx.fill();
  } else if (id === 'fab') {
    rect(20, 20, 160, 88, C.surface, 6);
    strokeRect(20, 20, 160, 88);
    bar(38, 40, 78);
    bar(38, 58, 104, C.line);
    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.arc(190, 88, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = C.surface;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(182, 88);
    ctx.lineTo(198, 88);
    ctx.moveTo(190, 80);
    ctx.lineTo(190, 96);
    ctx.stroke();
  } else {
    // 兜底：抽象块
    rect(24, 26, 192, 80, C.surface, 8);
    strokeRect(24, 26, 192, 80);
    bar(44, 44, 80, C.ink);
    bar(44, 62, 120, C.line);
    bar(44, 80, 64, C.line);
  }

  ctx.restore();
}

export function drawShareCard(
  canvas: HTMLCanvasElement,
  pattern: UIPattern,
  W: number,
  H: number
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

  const pad = Math.round(W * 0.093);
  let y = pad;

  // 顶部标识
  ctx.fillStyle = C.ink;
  roundRect(ctx, pad, y, 46, 46, 12);
  ctx.fill();
  ctx.fillStyle = C.canvas;
  ctx.font = `600 17px ${SANS}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('UF', pad + 23, y + 24);

  ctx.fillStyle = C.muted;
  ctx.font = `400 12px ${MONO}`;
  ctx.fillText('UI FIELD GUIDE', pad + 60, y + 16);
  ctx.fillStyle = C.ink2;
  ctx.font = `500 12px ${SANS}`;
  ctx.fillText('AI 独立开发者的 UI 词典', pad + 60, y + 34);

  y += 46 + 52;

  // 英文名（大）
  ctx.fillStyle = C.ink;
  ctx.font = `600 ${Math.round(W * 0.093)}px ${SANS}`;
  const nameEnd = wrapText(ctx, pattern.name, pad, y, W - pad * 2, Math.round(W * 0.093) * 1.18, 2);
  y = nameEnd + 10;

  // 中文名
  ctx.fillStyle = C.muted;
  ctx.font = `400 ${Math.round(W * 0.042)}px ${SANS}`;
  y = wrapText(ctx, pattern.chineseName, pad, y, W - pad * 2, Math.round(W * 0.042) * 1.5, 2) + 6;

  // 分类标签
  const tagText = `LEVEL ${pattern.level}`;
  ctx.font = `500 12px ${MONO}`;
  const tagW = ctx.measureText(tagText).width + 22;
  ctx.fillStyle = C.soft;
  roundRect(ctx, pad, y, tagW, 26, 13);
  ctx.fill();
  ctx.fillStyle = C.ink2;
  ctx.fillText(tagText, pad + 11, y + 14);
  y += 26 + 34;

  // 一句话解释
  ctx.fillStyle = C.ink;
  ctx.font = `400 ${Math.round(W * 0.045)}px ${SANS}`;
  y = wrapText(ctx, `「${pattern.oneLine}」`, pad, y, W - pad * 2, Math.round(W * 0.045) * 1.7, 4) + 34;

  // 中部示意图
  const previewH = Math.round((H - y - pad * 2) * 0.42);
  ctx.fillStyle = C.surface;
  roundRect(ctx, pad, y, W - pad * 2, previewH, 18);
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  drawMini(ctx, pattern, pad + 24, y + 20, W - pad * 2 - 48, previewH - 40);
  y += previewH + 34;

  // 适合什么场景
  ctx.fillStyle = C.muted;
  ctx.font = `500 12px ${MONO}`;
  ctx.fillText('适合', pad, y);
  y += 24;

  ctx.fillStyle = C.ink2;
  ctx.font = `400 ${Math.round(W * 0.033)}px ${SANS}`;
  y = wrapText(ctx, pattern.fitsFor, pad, y, W - pad * 2, Math.round(W * 0.033) * 1.6, 2) + 26;

  // 底部 Ask AI
  const askText = `Use a ${pattern.name} to…`;
  const boxY = Math.max(y, H - pad - 92);
  ctx.fillStyle = C.soft;
  roundRect(ctx, pad, boxY, W - pad * 2, 76, 14);
  ctx.fill();
  ctx.fillStyle = C.muted;
  ctx.font = `500 11px ${MONO}`;
  ctx.fillText('ASK AI', pad + 20, boxY + 26);
  ctx.fillStyle = C.ink;
  ctx.font = `italic 400 ${Math.round(W * 0.033)}px ${SERIF}`;
  wrapText(ctx, askText, pad + 20, boxY + 54, W - pad * 2 - 40, Math.round(W * 0.033) * 1.4, 1);
}
