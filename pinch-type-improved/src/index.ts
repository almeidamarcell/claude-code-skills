export { Engine as PinchType } from './engine/Engine';
export type { PinchTypeConfig, Destroyable } from './types';
export type { RenderStrategy } from './strategies/types';

import { Engine } from './engine/Engine';
import type { PinchTypeConfig } from './types';

/** Create a uniform text renderer with pinch-to-zoom */
export function createPinchType(config: PinchTypeConfig): Engine {
  return new Engine({ ...config, strategy: 'uniform' });
}

/** Create a fisheye scroll-morph text renderer */
export function createScrollMorph(config: PinchTypeConfig): Engine {
  return new Engine({ ...config, strategy: 'morph' });
}

/** Create a combined pinch-zoom + fisheye morph renderer */
export function createPinchMorph(config: PinchTypeConfig): Engine {
  return new Engine({ ...config, strategy: 'combined' });
}
