import type { PinchTypeConfig, ResolvedConfig, LayoutResult, Destroyable } from '../types';
import type { RenderStrategy } from '../strategies/types';
import type { ScrollIntent } from './InputManager';
import { resolveContainer } from '../errors';
import { Canvas } from './Canvas';
import { Layout } from './Layout';
import { ScrollPhysics } from './ScrollPhysics';
import { AnimationLoop } from './AnimationLoop';
import { InputManager } from './InputManager';
import { FontLoader } from './FontLoader';
import { DomMirror } from '../a11y/DomMirror';
import { UniformStrategy } from '../strategies/UniformStrategy';
import { MorphStrategy } from '../strategies/MorphStrategy';
import { CombinedStrategy } from '../strategies/CombinedStrategy';

const DEFAULTS: Omit<ResolvedConfig, 'container' | 'text'> = {
  strategy: 'uniform',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  baseFontSize: 18,
  minFontSize: 10,
  maxFontSize: 72,
  lineHeight: 1.5,
  paddingX: 20,
  paddingY: 20,
  backgroundColor: '#0a0a0a',
  textColor: '#e5e5e5',
  morphRadius: 300,
  morphCenterScale: 2.5,
  morphEdgeScale: 0.6,
  friction: 0.97,
  keyboard: true,
  a11y: true,
  onZoom: null,
};

export class Engine implements Destroyable {
  private canvas: Canvas;
  private layout: Layout;
  private physics: ScrollPhysics;
  private loop: AnimationLoop;
  private input: InputManager;
  private strategy: RenderStrategy;
  private mirror: DomMirror | null = null;
  private fontLoader: FontLoader;
  private config: ResolvedConfig;
  private currentLayout: LayoutResult | null = null;
  private fontSize: number;
  private needsRelayout = true;

  constructor(userConfig: PinchTypeConfig) {
    const container = resolveContainer(userConfig.container);
    this.config = {
      ...DEFAULTS,
      ...userConfig,
      container,
      onZoom: userConfig.onZoom ?? null,
    } as ResolvedConfig;

    this.fontSize = this.config.baseFontSize;
    this.layout = new Layout();
    this.physics = new ScrollPhysics(this.config.friction);
    this.strategy = this.createStrategy(this.config.strategy);

    // Canvas
    this.canvas = new Canvas(container, () => {
      this.needsRelayout = true;
      this.loop.wake();
    });

    // Input
    this.input = new InputManager(
      this.canvas.element,
      (intent) => this.handleIntent(intent),
      () => this.loop.wake(),
      this.config.keyboard,
      () => this.fontSize,
    );

    // Accessibility
    if (this.config.a11y) {
      this.mirror = new DomMirror(container);
    }

    // Animation loop
    this.loop = new AnimationLoop((deltaMs) => this.tick(deltaMs));

    // Font loading
    this.fontLoader = new FontLoader();
    this.fontLoader.waitForFont(this.config.fontFamily).then(() => {
      this.needsRelayout = true;
      this.loop.wake();
    });

    // Initial layout and start
    this.needsRelayout = true;
    this.loop.start();
  }

  setText(text: string): void {
    this.config.text = text;
    this.needsRelayout = true;
    this.physics.offset = 0;
    this.physics.velocity = 0;
    this.loop.wake();
  }

  setStrategy(name: 'uniform' | 'morph' | 'combined'): void {
    this.config.strategy = name;
    this.strategy = this.createStrategy(name);
    this.loop.wake();
  }

  destroy(): void {
    this.loop.destroy();
    this.input.destroy();
    this.canvas.destroy();
    this.mirror?.destroy();
  }

  private createStrategy(name: string): RenderStrategy {
    switch (name) {
      case 'morph': return new MorphStrategy();
      case 'combined': return new CombinedStrategy();
      default: return new UniformStrategy();
    }
  }

  private handleIntent(intent: ScrollIntent): void {
    switch (intent.type) {
      case 'delta':
        this.physics.applyDelta(intent.pixels);
        this.physics.velocity = 0;
        break;
      case 'fling':
        this.physics.fling(intent.velocityPxPerSec);
        break;
      case 'pinch':
        if (this.strategy.supportsPinch) {
          this.fontSize = Math.max(
            this.config.minFontSize,
            Math.min(this.config.maxFontSize, intent.scale),
          );
          this.needsRelayout = true;
          this.config.onZoom?.(this.fontSize);
        }
        break;
      case 'scroll-to':
        if (intent.position === 'start') {
          this.physics.offset = 0;
          this.physics.velocity = 0;
        } else if (this.currentLayout) {
          this.physics.offset = Math.max(0, this.currentLayout.totalHeight - this.canvas.height);
          this.physics.velocity = 0;
        }
        break;
    }
  }

  private tick(deltaMs: number): boolean {
    // Relayout if needed
    if (this.needsRelayout) {
      this.currentLayout = this.layout.layout(
        this.config.text,
        this.canvas.ctx,
        this.fontSize,
        this.config.lineHeight,
        this.canvas.width,
        this.config.paddingX,
        this.config.paddingY,
        this.config.fontFamily,
      );
      this.needsRelayout = false;

      // Update accessibility mirror
      if (this.mirror && this.currentLayout) {
        this.mirror.update(this.currentLayout.lines);
      }
    }

    if (!this.currentLayout) return false;

    // Step physics
    const moving = this.physics.step(
      deltaMs,
      this.currentLayout.totalHeight,
      this.canvas.height,
    );

    // Render
    this.canvas.clear(this.config.backgroundColor);
    this.strategy.render({
      ctx: this.canvas.ctx,
      scroll: {
        offset: this.physics.offset,
        velocity: this.physics.velocity,
        maxScroll: Math.max(0, this.currentLayout.totalHeight - this.canvas.height),
        viewportHeight: this.canvas.height,
      },
      layout: this.currentLayout,
      config: this.config,
      dpr: this.canvas.dpr,
      fontSize: this.fontSize,
      viewportHeight: this.canvas.height,
      viewportWidth: this.canvas.width,
    });

    return moving || this.needsRelayout;
  }
}
