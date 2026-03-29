import type { Destroyable } from '../types';

export type ScrollIntent =
  | { type: 'delta'; pixels: number }
  | { type: 'fling'; velocityPxPerSec: number }
  | { type: 'pinch'; scale: number }
  | { type: 'scroll-to'; position: 'start' | 'end' };

export class InputManager implements Destroyable {
  private touchStartY = 0;
  private touchStartTime = 0;
  private lastTouchY = 0;
  private lastTouchTime = 0;
  private isTouching = false;
  private pinchStartDist = 0;
  private pinchStartFontSize = 0;
  private isPinching = false;
  private abortController: AbortController;

  constructor(
    private canvas: HTMLCanvasElement,
    private onIntent: (intent: ScrollIntent) => void,
    private onActivity: () => void,
    private keyboardEnabled: boolean,
    private getCurrentFontSize: () => number,
  ) {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    // Touch events
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false, signal });
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: false, signal });
    canvas.addEventListener('touchend', this.onTouchEnd, { passive: true, signal });
    canvas.addEventListener('touchcancel', this.onTouchEnd, { passive: true, signal });

    // Mouse wheel
    canvas.addEventListener('wheel', this.onWheel, { passive: false, signal });

    // Keyboard
    if (keyboardEnabled) {
      document.addEventListener('keydown', this.onKeyDown, { signal });
    }
  }

  destroy(): void {
    this.abortController.abort();
  }

  private onTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    this.onActivity();

    if (e.touches.length === 2) {
      this.isPinching = true;
      this.pinchStartDist = this.getTouchDistance(e.touches);
      this.pinchStartFontSize = this.getCurrentFontSize();
      return;
    }

    if (e.touches.length === 1) {
      this.isTouching = true;
      this.isPinching = false;
      const touch = e.touches[0];
      this.touchStartY = touch.clientY;
      this.touchStartTime = performance.now();
      this.lastTouchY = touch.clientY;
      this.lastTouchTime = this.touchStartTime;
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    this.onActivity();

    if (this.isPinching && e.touches.length === 2) {
      const dist = this.getTouchDistance(e.touches);
      const scale = dist / this.pinchStartDist;
      this.onIntent({ type: 'pinch', scale: scale * this.pinchStartFontSize });
      return;
    }

    if (this.isTouching && e.touches.length === 1) {
      const touch = e.touches[0];
      const now = performance.now();
      const dy = this.lastTouchY - touch.clientY;

      this.onIntent({ type: 'delta', pixels: dy });

      this.lastTouchY = touch.clientY;
      this.lastTouchTime = now;
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    if (this.isPinching) {
      this.isPinching = false;
      return;
    }

    if (this.isTouching) {
      this.isTouching = false;
      const now = performance.now();
      const dt = now - this.lastTouchTime;

      if (dt < 100) {
        const dy = this.lastTouchY - this.touchStartY;
        const totalDt = (now - this.touchStartTime) / 1000;
        if (totalDt > 0) {
          const velocity = -dy / totalDt;
          if (Math.abs(velocity) > 50) {
            this.onIntent({ type: 'fling', velocityPxPerSec: velocity });
          }
        }
      }
    }
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.onActivity();

    let deltaY = e.deltaY;
    if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      deltaY *= 20;
    } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      deltaY *= window.innerHeight;
    }

    this.onIntent({ type: 'delta', pixels: deltaY });
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const scrollAmount = 60;
    const pageAmount = window.innerHeight * 0.8;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.onActivity();
        this.onIntent({ type: 'delta', pixels: scrollAmount });
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.onActivity();
        this.onIntent({ type: 'delta', pixels: -scrollAmount });
        break;
      case 'PageDown':
      case ' ':
        e.preventDefault();
        this.onActivity();
        this.onIntent({ type: 'delta', pixels: pageAmount });
        break;
      case 'PageUp':
        e.preventDefault();
        this.onActivity();
        this.onIntent({ type: 'delta', pixels: -pageAmount });
        break;
      case 'Home':
        e.preventDefault();
        this.onActivity();
        this.onIntent({ type: 'scroll-to', position: 'start' });
        break;
      case 'End':
        e.preventDefault();
        this.onActivity();
        this.onIntent({ type: 'scroll-to', position: 'end' });
        break;
    }
  };

  private getTouchDistance(touches: TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
