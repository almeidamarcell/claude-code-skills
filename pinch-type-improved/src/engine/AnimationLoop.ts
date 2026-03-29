import type { Destroyable } from '../types';

export type FrameCallback = (deltaMs: number) => boolean;

const IDLE_THRESHOLD = 3;

export class AnimationLoop implements Destroyable {
  private rafId: number | null = null;
  private lastTimestamp = 0;
  private hasFirstFrame = false;
  private idleFrames = 0;
  private running = false;

  constructor(private callback: FrameCallback) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTimestamp = 0;
    this.hasFirstFrame = false;
    this.idleFrames = 0;
    this.scheduleFrame();
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  wake(): void {
    this.idleFrames = 0;
    if (!this.running) {
      this.start();
    }
  }

  get isRunning(): boolean {
    return this.running;
  }

  destroy(): void {
    this.stop();
  }

  private scheduleFrame(): void {
    this.rafId = requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  private tick(timestamp: number): void {
    if (!this.running) return;

    const deltaMs = !this.hasFirstFrame
      ? 16.67
      : Math.min(timestamp - this.lastTimestamp, 100); // cap at 100ms to prevent spiral
    this.hasFirstFrame = true;
    this.lastTimestamp = timestamp;

    const changed = this.callback(deltaMs);

    if (changed) {
      this.idleFrames = 0;
    } else {
      this.idleFrames++;
    }

    if (this.idleFrames >= IDLE_THRESHOLD) {
      this.running = false;
      this.rafId = null;
      return;
    }

    this.scheduleFrame();
  }
}
