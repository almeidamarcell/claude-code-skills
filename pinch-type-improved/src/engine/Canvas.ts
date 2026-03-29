import type { Destroyable } from '../types';
import { PinchTypeError } from '../errors';

const MAX_DPR = 3;

export class Canvas implements Destroyable {
  readonly element: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private resizeObserver: ResizeObserver;
  private _dpr: number;
  private _width = 0;
  private _height = 0;

  constructor(
    private container: HTMLElement,
    private onResize: (width: number, height: number) => void,
  ) {
    this.element = document.createElement('canvas');
    this.element.style.display = 'block';
    this.element.style.width = '100%';
    this.element.style.height = '100%';
    this.element.style.touchAction = 'none';
    this.element.setAttribute('role', 'img');
    this.element.setAttribute('aria-label', 'Text display area');

    const ctx = this.element.getContext('2d');
    if (!ctx) {
      throw new PinchTypeError('Failed to get 2D rendering context');
    }
    this.ctx = ctx;
    this._dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    this.container.appendChild(this.element);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.updateSize(width, height);
      }
    });
    this.resizeObserver.observe(this.container);

    // Initial size
    const rect = this.container.getBoundingClientRect();
    this.updateSize(rect.width, rect.height);
  }

  get dpr(): number {
    return this._dpr;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  clear(backgroundColor: string): void {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.element.width, this.element.height);
    this.ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
  }

  private updateSize(width: number, height: number): void {
    this._dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    this._width = width;
    this._height = height;
    this.element.width = Math.round(width * this._dpr);
    this.element.height = Math.round(height * this._dpr);
    this.ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
    this.onResize(width, height);
  }

  destroy(): void {
    this.resizeObserver.disconnect();
    this.element.remove();
  }
}
