const VELOCITY_THRESHOLD = 0.5; // px/s below which we stop
const OVERSCROLL_SPRING = 0.15;
const OVERSCROLL_DAMPING = 0.5;

export class ScrollPhysics {
  offset = 0;
  velocity = 0; // px per second

  constructor(
    private friction: number = 0.97,
  ) {}

  applyDelta(deltaPixels: number): void {
    this.offset += deltaPixels;
  }

  fling(velocityPxPerSec: number): void {
    this.velocity = velocityPxPerSec;
  }

  step(deltaMs: number, contentHeight: number, viewportHeight: number): boolean {
    const maxScroll = Math.max(0, contentHeight - viewportHeight);
    const dt = deltaMs / 1000; // convert to seconds

    // Apply velocity
    if (Math.abs(this.velocity) > VELOCITY_THRESHOLD) {
      this.offset += this.velocity * dt;

      // Frame-rate independent friction: v *= friction^(dt/frameTime)
      const frictionFactor = Math.pow(this.friction, deltaMs / 16.67);
      this.velocity *= frictionFactor;

      // Kill very small velocities
      if (Math.abs(this.velocity) < VELOCITY_THRESHOLD) {
        this.velocity = 0;
      }
    }

    // Elastic overscroll (spring back)
    let springing = false;
    if (this.offset < 0) {
      this.offset += -this.offset * OVERSCROLL_SPRING;
      this.velocity *= OVERSCROLL_DAMPING;
      springing = true;
      if (Math.abs(this.offset) < 0.5) {
        this.offset = 0;
        this.velocity = 0;
      }
    } else if (this.offset > maxScroll) {
      const overshoot = this.offset - maxScroll;
      this.offset -= overshoot * OVERSCROLL_SPRING;
      this.velocity *= OVERSCROLL_DAMPING;
      springing = true;
      if (Math.abs(this.offset - maxScroll) < 0.5) {
        this.offset = maxScroll;
        this.velocity = 0;
      }
    }

    return Math.abs(this.velocity) > VELOCITY_THRESHOLD || springing;
  }

  get maxScroll(): number {
    return this.offset; // computed externally
  }

  get isMoving(): boolean {
    return Math.abs(this.velocity) > VELOCITY_THRESHOLD;
  }
}
