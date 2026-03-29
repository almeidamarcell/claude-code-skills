import { describe, test, expect } from 'bun:test';
import { MorphStrategy } from '../src/strategies/MorphStrategy';

describe('MorphStrategy', () => {
  test('does not support pinch', () => {
    const strategy = new MorphStrategy();
    expect(strategy.supportsPinch).toBe(false);
  });

  test('render is callable with valid context', () => {
    const strategy = new MorphStrategy();

    // Create a minimal mock render context
    const calls: Array<{ font: string; fillStyle: string; text: string }> = [];
    const mockCtx = {
      textBaseline: '',
      font: '',
      fillStyle: '',
      save() {},
      restore() {},
      fillText(text: string, _x: number, _y: number) {
        calls.push({
          font: this.font,
          fillStyle: this.fillStyle,
          text,
        });
      },
    } as unknown as CanvasRenderingContext2D;

    strategy.render({
      ctx: mockCtx,
      scroll: { offset: 0, velocity: 0, maxScroll: 1000, viewportHeight: 500 },
      layout: {
        lines: [
          { text: 'Line at center', y: 250, height: 24, paragraphStart: true },
          { text: 'Line at edge', y: 10, height: 24, paragraphStart: false },
        ],
        totalHeight: 1500,
        contentWidth: 400,
      },
      config: {
        container: null as unknown as HTMLElement,
        text: '',
        strategy: 'morph',
        fontFamily: 'sans-serif',
        baseFontSize: 16,
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
      },
      dpr: 1,
      fontSize: 16,
      viewportHeight: 500,
      viewportWidth: 400,
    });

    // Both lines should have been rendered
    expect(calls.length).toBe(2);
  });
});
