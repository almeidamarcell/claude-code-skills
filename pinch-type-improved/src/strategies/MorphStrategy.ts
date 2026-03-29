import type { RenderStrategy } from './types';
import type { RenderContext } from '../types';

export class MorphStrategy implements RenderStrategy {
  supportsPinch = false;

  render(rctx: RenderContext): void {
    const { ctx, scroll, layout, config, fontSize, viewportHeight } = rctx;
    const { paddingX, fontFamily, textColor, morphRadius, morphCenterScale, morphEdgeScale } = config;
    const lineHeightPx = fontSize * config.lineHeight;
    const centerY = viewportHeight / 2;

    ctx.textBaseline = 'top';

    for (const line of layout.lines) {
      const scaledY = (line.y / line.height) * lineHeightPx;
      const screenY = scaledY - scroll.offset;

      // Frustum culling with generous margin for enlarged text
      if (screenY + lineHeightPx * morphCenterScale < -100) continue;
      if (screenY > viewportHeight + 100) break;

      // Distance from viewport center
      const lineCenterY = screenY + lineHeightPx / 2;
      const dist = Math.abs(lineCenterY - centerY);
      const t = Math.min(dist / morphRadius, 1);

      // Ease-out cubic for smooth falloff
      const easedT = 1 - Math.pow(1 - t, 3);

      // Interpolate font size
      const centerSize = fontSize * morphCenterScale;
      const edgeSize = fontSize * morphEdgeScale;
      const lineSize = centerSize + (edgeSize - centerSize) * easedT;

      // Interpolate opacity
      const opacity = 1 - easedT * 0.75;

      // Interpolate color (white at center, gray at edge)
      const r = Math.round(255 - easedT * 153);
      const g = r;
      const b = r;

      ctx.save();
      ctx.font = `${lineSize}px ${fontFamily}`;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.fillText(line.text, paddingX, screenY);
      ctx.restore();
    }
  }
}
