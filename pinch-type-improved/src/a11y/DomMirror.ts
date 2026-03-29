import type { Line, Destroyable } from '../types';

export class DomMirror implements Destroyable {
  private root: HTMLDivElement;

  constructor(container: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('role', 'document');
    this.root.setAttribute('aria-label', 'Text content');
    this.root.setAttribute('tabindex', '0');

    // Visually hidden but accessible to screen readers
    Object.assign(this.root.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });

    container.appendChild(this.root);
  }

  update(lines: Line[]): void {
    // Group lines by paragraph
    const paragraphs: string[][] = [[]];
    for (const line of lines) {
      if (line.paragraphStart && paragraphs[paragraphs.length - 1].length > 0) {
        paragraphs.push([]);
      }
      paragraphs[paragraphs.length - 1].push(line.text);
    }

    // Only rebuild DOM if content changed
    const newContent = paragraphs.map(p => p.join(' ')).join('\n\n');
    if (this.root.dataset.content === newContent) return;
    this.root.dataset.content = newContent;

    this.root.innerHTML = '';
    for (const paragraph of paragraphs) {
      const p = document.createElement('p');
      p.textContent = paragraph.join(' ');
      this.root.appendChild(p);
    }
  }

  destroy(): void {
    this.root.remove();
  }
}
