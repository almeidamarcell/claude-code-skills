import type { RenderStrategy } from './types';
import type { RenderContext } from '../types';

export class UniformStrategy implements RenderStrategy {
  supportsPinch = true;

  render(rctx: RenderContext): void {
    const { ctx, scroll, layout, config, fontSize } = rctx;
    const { paddingX, fontFamily, textColor } = config;
    const lineHeightPx = fontSize * config.lineHeight;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';

    const viewTop = scroll.offset;
    const viewBottom = viewTop + scroll.viewportHeight;

    for (const line of layout.lines) {
      // Scale line position proportionally to font size change
      const scaledY = (line.y / line.height) * lineHeightPx;
      const screenY = scaledY - viewTop;

      // Frustum culling
      if (screenY + lineHeightPx < -50) continue;
      if (screenY > scroll.viewportHeight + 50) continue;

      ctx.fillText(line.text, paddingX, screenY);
    }
  }
}
