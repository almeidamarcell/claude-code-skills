export interface PinchTypeConfig {
  /** Container element or CSS selector */
  container: HTMLElement | string;
  /** Text content to render */
  text: string;
  /** Render strategy: 'uniform' (pinch-type), 'morph' (scroll-morph), 'combined' (pinch-morph) */
  strategy?: 'uniform' | 'morph' | 'combined';
  /** Font family (default: 'system-ui, -apple-system, sans-serif') */
  fontFamily?: string;
  /** Base font size in CSS px (default: 18) */
  baseFontSize?: number;
  /** Min font size when zooming out (default: 10) */
  minFontSize?: number;
  /** Max font size when zooming in (default: 72) */
  maxFontSize?: number;
  /** Line height multiplier (default: 1.5) */
  lineHeight?: number;
  /** Horizontal padding in CSS px (default: 20) */
  paddingX?: number;
  /** Vertical padding in CSS px (default: 20) */
  paddingY?: number;
  /** Background color (default: '#0a0a0a') */
  backgroundColor?: string;
  /** Text color (default: '#e5e5e5') */
  textColor?: string;
  /** Morph: radius in px defining the focal zone (default: 300) */
  morphRadius?: number;
  /** Morph: font size at center as multiplier of baseFontSize (default: 2.5) */
  morphCenterScale?: number;
  /** Morph: font size at edge as multiplier of baseFontSize (default: 0.6) */
  morphEdgeScale?: number;
  /** Momentum friction (0-1, higher = more friction, default: 0.97) */
  friction?: number;
  /** Enable keyboard scrolling (default: true) */
  keyboard?: boolean;
  /** Enable accessibility DOM mirror (default: true) */
  a11y?: boolean;
  /** Callback fired after pinch zoom completes */
  onZoom?: (fontSize: number) => void;
}

export interface ResolvedConfig {
  container: HTMLElement;
  text: string;
  strategy: 'uniform' | 'morph' | 'combined';
  fontFamily: string;
  baseFontSize: number;
  minFontSize: number;
  maxFontSize: number;
  lineHeight: number;
  paddingX: number;
  paddingY: number;
  backgroundColor: string;
  textColor: string;
  morphRadius: number;
  morphCenterScale: number;
  morphEdgeScale: number;
  friction: number;
  keyboard: boolean;
  a11y: boolean;
  onZoom: ((fontSize: number) => void) | null;
}

export interface Line {
  text: string;
  y: number;
  height: number;
  paragraphStart: boolean;
}

export interface LayoutResult {
  lines: Line[];
  totalHeight: number;
  contentWidth: number;
}

export interface ScrollState {
  offset: number;
  velocity: number;
  maxScroll: number;
  viewportHeight: number;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  scroll: ScrollState;
  layout: LayoutResult;
  config: ResolvedConfig;
  dpr: number;
  fontSize: number;
  viewportHeight: number;
  viewportWidth: number;
}

export interface Destroyable {
  destroy(): void;
}
