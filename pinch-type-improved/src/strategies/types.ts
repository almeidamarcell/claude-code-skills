import type { RenderContext } from '../types';

export interface RenderStrategy {
  /** Render all visible lines to the canvas */
  render(ctx: RenderContext): void;

  /** Whether this strategy supports pinch-to-zoom */
  supportsPinch: boolean;
}
