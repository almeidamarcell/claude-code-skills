import type { Line, LayoutResult } from '../types';

export class Layout {
  private lines: Line[] = [];
  private totalHeight = 0;

  layout(
    text: string,
    ctx: CanvasRenderingContext2D,
    fontSize: number,
    lineHeight: number,
    maxWidth: number,
    paddingX: number,
    paddingY: number,
    fontFamily: string,
  ): LayoutResult {
    const font = `${fontSize}px ${fontFamily}`;
    ctx.font = font;

    const availableWidth = maxWidth - paddingX * 2;
    const lineHeightPx = fontSize * lineHeight;
    const paragraphs = text.split(/\n\s*\n/);
    const paragraphSpacing = lineHeightPx * 0.5;

    this.lines = [];
    let y = paddingY;

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const paragraph = paragraphs[pIdx].trim();
      if (!paragraph) continue;

      if (pIdx > 0) {
        y += paragraphSpacing;
      }

      const words = paragraph.split(/\s+/);
      let currentLine = '';
      let isFirstLineOfParagraph = true;

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > availableWidth && currentLine) {
          this.lines.push({
            text: currentLine,
            y,
            height: lineHeightPx,
            paragraphStart: isFirstLineOfParagraph,
          });
          y += lineHeightPx;
          currentLine = word;
          isFirstLineOfParagraph = false;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        this.lines.push({
          text: currentLine,
          y,
          height: lineHeightPx,
          paragraphStart: isFirstLineOfParagraph,
        });
        y += lineHeightPx;
      }
    }

    this.totalHeight = y + paddingY;

    return {
      lines: this.lines,
      totalHeight: this.totalHeight,
      contentWidth: maxWidth,
    };
  }

  getLines(): Line[] {
    return this.lines;
  }

  getTotalHeight(): number {
    return this.totalHeight;
  }
}
