import type { RenderStrategy } from './types';
import type { RenderContext } from '../types';

export class CombinedStrategy implements RenderStrategy {
  supportsPinch = true;

  render(rctx: RenderContext): void {
    const { ctx, scroll, layout, config, fontSize, viewportHeight } = rctx;
    const { paddingX, fontFamily, morphRadius, morphCenterScale, morphEdgeScale } = config;
    const lineHeightPx = fontSize * config.lineHeight;
    const centerY = viewportHeight / 2;

    ctx.textBaseline = 'top';

    for (const line of layout.lines) {
      const scaledY = (line.y / line.height) * lineHeightPx;
      const screenY = scaledY - scroll.offset;

      // Frustum culling
      if (screenY + lineHeightPx * morphCenterScale < -100) continue;
      if (screenY > viewportHeight + 100) break;

      // Distance from viewport center
      const lineCenterY = screenY + lineHeightPx / 2;
      const dist = Math.abs(lineCenterY - centerY);
      const t = Math.min(dist / morphRadius, 1);

      // Ease-out cubic
      const easedT = 1 - Math.pow(1 - t, 3);

      // Interpolate sizes (pinch zoom scales both center and edge proportionally)
      const zoomRatio = fontSize / config.baseFontSize;
      const centerSize = config.baseFontSize * morphCenterScale * zoomRatio;
      const edgeSize = config.baseFontSize * morphEdgeScale * zoomRatio;
      const lineSize = centerSize + (edgeSize - centerSize) * easedT;

      // Interpolate opacity and color
      const opacity = 1 - easedT * 0.75;
      const r = Math.round(255 - easedT * 153);

      ctx.save();
      ctx.font = `${lineSize}px ${fontFamily}`;
      ctx.fillStyle = `rgba(${r}, ${r}, ${r}, ${opacity})`;
      ctx.fillText(line.text, paddingX, screenY);
      ctx.restore();
    }
  }
}
