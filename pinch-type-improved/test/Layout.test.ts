import { describe, test, expect } from 'bun:test';
import { Layout } from '../src/engine/Layout';

// Create a mock canvas context for measuring text
function createMockCtx(): CanvasRenderingContext2D {
  const ctx = {
    font: '',
    measureText(text: string) {
      // Approximate: each character is ~8px wide
      return { width: text.length * 8 };
    },
  } as unknown as CanvasRenderingContext2D;
  return ctx;
}

describe('Layout', () => {
  test('wraps long lines', () => {
    const layout = new Layout();
    const ctx = createMockCtx();

    // With 8px per char and 200px available width (240 - 20*2),
    // each line can hold ~25 chars
    const result = layout.layout(
      'This is a test sentence that should wrap to multiple lines because it is quite long',
      ctx,
      16,
      1.5,
      240,
      20,
      20,
      'sans-serif',
    );

    expect(result.lines.length).toBeGreaterThan(1);
    expect(result.totalHeight).toBeGreaterThan(0);
  });

  test('handles paragraph breaks', () => {
    const layout = new Layout();
    const ctx = createMockCtx();

    const result = layout.layout(
      'First paragraph.\n\nSecond paragraph.',
      ctx,
      16,
      1.5,
      400,
      20,
      20,
      'sans-serif',
    );

    expect(result.lines.length).toBe(2);
    expect(result.lines[0].text).toBe('First paragraph.');
    expect(result.lines[1].text).toBe('Second paragraph.');
    expect(result.lines[1].paragraphStart).toBe(true);
  });

  test('marks first line of each paragraph', () => {
    const layout = new Layout();
    const ctx = createMockCtx();

    const result = layout.layout(
      'Paragraph one.\n\nParagraph two.\n\nParagraph three.',
      ctx,
      16,
      1.5,
      400,
      20,
      20,
      'sans-serif',
    );

    expect(result.lines.length).toBe(3);
    for (const line of result.lines) {
      expect(line.paragraphStart).toBe(true);
    }
  });

  test('empty text produces no lines', () => {
    const layout = new Layout();
    const ctx = createMockCtx();

    const result = layout.layout('', ctx, 16, 1.5, 400, 20, 20, 'sans-serif');

    expect(result.lines.length).toBe(0);
    expect(result.totalHeight).toBe(40); // paddingY * 2
  });

  test('line height is fontSize * lineHeight multiplier', () => {
    const layout = new Layout();
    const ctx = createMockCtx();

    const result = layout.layout(
      'Hello world',
      ctx,
      20,
      1.5,
      400,
      20,
      20,
      'sans-serif',
    );

    expect(result.lines[0].height).toBe(30); // 20 * 1.5
  });

  test('respects padding', () => {
    const layout = new Layout();
    const ctx = createMockCtx();

    const result = layout.layout(
      'Short',
      ctx,
      16,
      1.5,
      400,
      30,
      40,
      'sans-serif',
    );

    // First line Y should start at paddingY
    expect(result.lines[0].y).toBe(40);
    // Total height should include bottom padding
    expect(result.totalHeight).toBe(40 + 24 + 40); // paddingY + lineHeight + paddingY
  });
});
