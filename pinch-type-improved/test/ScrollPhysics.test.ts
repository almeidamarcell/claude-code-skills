import { describe, test, expect } from 'bun:test';
import { ScrollPhysics } from '../src/engine/ScrollPhysics';

describe('ScrollPhysics', () => {
  test('applyDelta changes offset', () => {
    const physics = new ScrollPhysics();
    physics.applyDelta(100);
    expect(physics.offset).toBe(100);
    physics.applyDelta(-50);
    expect(physics.offset).toBe(50);
  });

  test('fling sets velocity', () => {
    const physics = new ScrollPhysics();
    physics.fling(500);
    expect(physics.velocity).toBe(500);
  });

  test('step applies velocity and friction', () => {
    const physics = new ScrollPhysics(0.97);
    physics.fling(1000);

    const contentHeight = 2000;
    const viewportHeight = 500;

    physics.step(16.67, contentHeight, viewportHeight);
    expect(physics.offset).toBeGreaterThan(0);
    expect(physics.velocity).toBeLessThan(1000);
    expect(physics.velocity).toBeGreaterThan(0);
  });

  test('velocity decays to zero over time', () => {
    const physics = new ScrollPhysics(0.97);
    physics.fling(100);

    for (let i = 0; i < 300; i++) {
      physics.step(16.67, 5000, 500);
    }

    expect(physics.velocity).toBe(0);
  });

  test('elastic overscroll springs back from negative', () => {
    const physics = new ScrollPhysics();
    physics.offset = -100;
    physics.velocity = 0;

    for (let i = 0; i < 100; i++) {
      physics.step(16.67, 2000, 500);
    }

    expect(physics.offset).toBeCloseTo(0, 0);
  });

  test('elastic overscroll springs back from past max', () => {
    const physics = new ScrollPhysics();
    const contentHeight = 2000;
    const viewportHeight = 500;
    const maxScroll = contentHeight - viewportHeight;

    physics.offset = maxScroll + 100;
    physics.velocity = 0;

    for (let i = 0; i < 100; i++) {
      physics.step(16.67, contentHeight, viewportHeight);
    }

    expect(physics.offset).toBeCloseTo(maxScroll, 0);
  });

  test('frame-rate independence: same distance regardless of dt', () => {
    // Run at 60fps (16.67ms per frame)
    const physics60 = new ScrollPhysics(0.97);
    physics60.fling(1000);
    for (let i = 0; i < 120; i++) {
      physics60.step(16.67, 5000, 500);
    }

    // Run at 120fps (8.33ms per frame) for the same total time
    const physics120 = new ScrollPhysics(0.97);
    physics120.fling(1000);
    for (let i = 0; i < 240; i++) {
      physics120.step(8.33, 5000, 500);
    }

    // Offsets should be very close (within 5% of each other)
    const ratio = physics60.offset / physics120.offset;
    expect(ratio).toBeGreaterThan(0.95);
    expect(ratio).toBeLessThan(1.05);
  });

  test('step returns false when idle', () => {
    const physics = new ScrollPhysics();
    physics.offset = 50;
    physics.velocity = 0;

    const moving = physics.step(16.67, 2000, 500);
    expect(moving).toBe(false);
  });

  test('step returns true when moving', () => {
    const physics = new ScrollPhysics();
    physics.fling(500);

    const moving = physics.step(16.67, 2000, 500);
    expect(moving).toBe(true);
  });

  test('maxScroll is 0 when content fits viewport', () => {
    const physics = new ScrollPhysics();
    physics.offset = 50;
    physics.velocity = 0;

    // Content smaller than viewport
    physics.step(16.67, 300, 500);

    // Should spring back since maxScroll is 0
    for (let i = 0; i < 100; i++) {
      physics.step(16.67, 300, 500);
    }
    expect(physics.offset).toBeCloseTo(0, 0);
  });
});
