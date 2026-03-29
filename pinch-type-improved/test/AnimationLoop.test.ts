import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test';
import { AnimationLoop } from '../src/engine/AnimationLoop';

// Mock requestAnimationFrame for testing
let rafCallbacks: Array<(timestamp: number) => void> = [];
let rafId = 0;

beforeEach(() => {
  rafCallbacks = [];
  rafId = 0;

  globalThis.requestAnimationFrame = (cb: (timestamp: number) => void): number => {
    rafCallbacks.push(cb);
    return ++rafId;
  };

  globalThis.cancelAnimationFrame = (_id: number): void => {
    // In tests, we just clear callbacks
  };
});

function flushFrame(timestamp: number): void {
  const callbacks = [...rafCallbacks];
  rafCallbacks = [];
  for (const cb of callbacks) {
    cb(timestamp);
  }
}

describe('AnimationLoop', () => {
  test('calls callback with delta time', () => {
    const deltas: number[] = [];
    const loop = new AnimationLoop((dt) => {
      deltas.push(dt);
      return true;
    });

    loop.start();
    flushFrame(0);
    flushFrame(16.67);
    flushFrame(33.34);

    expect(deltas.length).toBe(3);
    // First frame gets default ~16.67ms
    expect(deltas[0]).toBeCloseTo(16.67, 0);
    expect(deltas[1]).toBeCloseTo(16.67, 0);
    expect(deltas[2]).toBeCloseTo(16.67, 0);

    loop.destroy();
  });

  test('stops after idle threshold', () => {
    let callCount = 0;
    const loop = new AnimationLoop((_dt) => {
      callCount++;
      return false; // signal idle
    });

    loop.start();

    // Flush 5 frames, all returning false (idle)
    for (let i = 0; i < 5; i++) {
      flushFrame(i * 16.67);
    }

    // Should have stopped after 3 idle frames
    expect(callCount).toBe(3);
    expect(loop.isRunning).toBe(false);

    loop.destroy();
  });

  test('wake restarts the loop', () => {
    let callCount = 0;
    const loop = new AnimationLoop((_dt) => {
      callCount++;
      return false;
    });

    loop.start();
    // Let it go idle
    for (let i = 0; i < 5; i++) {
      flushFrame(i * 16.67);
    }
    expect(loop.isRunning).toBe(false);

    // Wake it
    loop.wake();
    expect(loop.isRunning).toBe(true);
    flushFrame(100);
    expect(callCount).toBe(4); // 3 + 1

    loop.destroy();
  });

  test('caps delta time at 100ms', () => {
    const deltas: number[] = [];
    const loop = new AnimationLoop((dt) => {
      deltas.push(dt);
      return true;
    });

    loop.start();
    flushFrame(0);
    flushFrame(500); // 500ms gap - should be capped at 100ms

    expect(deltas[1]).toBe(100);

    loop.destroy();
  });

  test('destroy stops the loop', () => {
    const loop = new AnimationLoop(() => true);
    loop.start();
    expect(loop.isRunning).toBe(true);
    loop.destroy();
    expect(loop.isRunning).toBe(false);
  });
});
