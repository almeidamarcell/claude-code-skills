# Cursor sub-composition (HyperFrames + GSAP)

Drop-in pointer for any onboarding beat that involves a tap. Load this only when authoring or modifying a tap beat — it's not needed for purely illustrative beats.

The cursor is a sub-composition (`compositions/cursor.html`) loaded into beats via `data-composition-src`. It exposes three composition variables — entry point, target list, and tap timing — so the same component drives single-tap and multi-tap interactions on the same UI.

## Rules this component encodes

These mirror the operating rules in `SKILL.md` — re-read them before changing the component:

- **Fade-in at center → one straight glide → tap.** No off-frame entry, no curves, no multi-segment paths.
- **Single straight segment per move.** Diagonals are allowed (x and y can both change), but only as one straight line.
- **Multi-tap on the same UI: stay visible.** Glide directly from target N to target N+1 without fading out. The pointer only fades out after the **last** tap in the beat.
- **New UI / new beat: full reset.** Fade out at end, then the next beat does its own fade-in at center.
- **Decelerating ease only.** `power3.out`, `expo.out`, or a custom `0.16, 1, 0.3, 1` cubic-bezier. Never linear, never `back.out`.

## File: `compositions/cursor.html`

```html
<template id="cursor-template">
  <div data-composition-id="cursor" data-width="1080" data-height="1920">
    <div class="cursor-root">
      <svg class="cursor-arrow" viewBox="0 0 32 32" width="56" height="56" aria-hidden="true">
        <!-- iOS-style pointer. Subtle drop shadow keeps it readable on light + dark UI. -->
        <defs>
          <filter id="cursor-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35" />
          </filter>
        </defs>
        <path
          d="M5 3 L5 24 L11 19 L14.5 27 L18 25.5 L14.5 17.5 L22 17.5 Z"
          fill="#ffffff"
          stroke="#111111"
          stroke-width="1.4"
          stroke-linejoin="round"
          filter="url(#cursor-shadow)"
        />
      </svg>
      <div class="cursor-ripple" aria-hidden="true"></div>
    </div>

    <style>
      [data-composition-id="cursor"] {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      [data-composition-id="cursor"] .cursor-root {
        position: absolute;
        left: 0;
        top: 0;
        width: 56px;
        height: 56px;
        opacity: 0;
        will-change: transform, opacity;
      }
      [data-composition-id="cursor"] .cursor-arrow {
        position: absolute;
        left: 0;
        top: 0;
      }
      [data-composition-id="cursor"] .cursor-ripple {
        position: absolute;
        left: 8px;
        top: 8px;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.18);
        transform: scale(0);
        opacity: 0;
        will-change: transform, opacity;
      }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};

      // Variables (declare on the host clip's data-variable-values, or default below).
      // entry:    { x, y }        — visual center the pointer fades in at
      // targets:  [{ x, y, tapAt }, ...]   — ordered list of tap points (seconds, beat-local)
      // fadeOut:  number          — beat-local seconds at which the pointer fades out
      const v = (window.__hfVariables && window.__hfVariables["cursor"]) || {};
      const entry = v.entry || { x: 540, y: 960 };
      const targets = Array.isArray(v.targets) && v.targets.length ? v.targets : [];
      const fadeOut = typeof v.fadeOut === "number" ? v.fadeOut : null;

      const root = document.querySelector('[data-composition-id="cursor"] .cursor-root');
      const ripple = document.querySelector('[data-composition-id="cursor"] .cursor-ripple');

      const EASE = "power3.out"; // decelerating only
      const FADE_IN = 0.28;
      const GLIDE = 0.55;
      const TAP = 0.22;
      const FADE_OUT = 0.22;

      const tl = gsap.timeline({ paused: true });

      // 1) Fade in at center (entry point). No motion, just opacity.
      gsap.set(root, { x: entry.x - 8, y: entry.y - 8 });
      tl.to(root, { opacity: 1, duration: FADE_IN, ease: EASE }, 0);

      // 2) For each target: glide in one straight line, then fire the tap ripple.
      //    Between targets the cursor stays visible (do NOT fade out mid-list).
      let prev = entry;
      targets.forEach((t, i) => {
        const tapAt = typeof t.tapAt === "number" ? t.tapAt : FADE_IN + (i + 1) * (GLIDE + 0.1);
        const arriveAt = Math.max(tapAt - 0.04, FADE_IN); // arrive just before the tap fires
        const moveStart = Math.max(arriveAt - GLIDE, i === 0 ? FADE_IN : prev.tapAt || FADE_IN);

        tl.to(
          root,
          {
            x: t.x - 8,
            y: t.y - 8,
            duration: arriveAt - moveStart,
            ease: EASE,
          },
          moveStart
        );

        // Ripple at the tap point. Re-position on each tap.
        tl.set(ripple, { x: t.x - 14, y: t.y - 14 }, tapAt);
        tl.fromTo(
          ripple,
          { scale: 0, opacity: 0.55 },
          { scale: 3.2, opacity: 0, duration: TAP, ease: "power2.out" },
          tapAt
        );

        prev = { ...t, tapAt };
      });

      // 3) Fade out only after the last tap (or at an explicit fadeOut time).
      const last = targets[targets.length - 1];
      const outAt =
        fadeOut !== null
          ? fadeOut
          : last
          ? (last.tapAt || FADE_IN) + TAP + 0.1
          : FADE_IN + 0.4;
      tl.to(root, { opacity: 0, duration: FADE_OUT, ease: "power2.in" }, outAt);

      window.__timelines["cursor"] = tl;
    </script>
  </div>
</template>
```

## Usage in a beat

Load the cursor as a sub-composition layered above the focal UI slice. Pass entry + targets via `data-variable-values`. Coordinates are in the cursor composition's own coordinate space — match it to the host beat (typically 1080×1920).

```html
<!-- Beat: tap the day cell, then tap the Create button on the same form. -->
<div
  id="cursor-beat-2"
  data-composition-id="cursor"
  data-composition-src="compositions/cursor.html"
  data-start="0"
  data-duration="3.4"
  data-track-index="9"
  data-variable-values='{
    "entry":   { "x": 540, "y": 960 },
    "targets": [
      { "x": 412, "y": 880, "tapAt": 0.85 },
      { "x": 720, "y": 1320, "tapAt": 2.10 }
    ],
    "fadeOut": 2.55
  }'
></div>
```

## Picking entry + target coordinates

- **`entry`** — the visual center of the focal slice for this beat. If the beat shows a cropped form starting at `(160, 720)` sized `760×800`, entry is roughly `(540, 1120)`.
- **`targets[i].x/y`** — the pixel center of the thing being tapped, in the host composition's coordinate space.
- **`targets[i].tapAt`** — beat-local seconds when the ripple fires. The cursor needs ~0.5s to glide; budget at least that between the previous tap (or entry) and `tapAt`. The component arrives ~40ms before the tap so the ripple visibly fires *under* the pointer.

## Multi-tap on the same UI: don't insert a fade-out

The component above already handles this: it fades in once, glides through every target in order, and only fades out after the last one. **Do not** instantiate two cursor sub-compositions back-to-back for taps on the same form — that produces the forbidden fade-out + fade-in flicker. Use one cursor instance with multiple targets.

## New UI / new beat: instantiate a fresh cursor

When the next interaction is on a *different* UI (next screen, next beat with a different focal slice), end the current cursor instance with its built-in fade-out and instantiate a new cursor sub-composition in the next beat. The reset is intentional — it's how the viewer reads "we moved somewhere new."

## What the component will not do

- It will not enter from off-frame. There's no API for that — the entry point is the visual center, full stop.
- It will not curve, zig-zag, or hit intermediate keyframes between two targets. Each segment is one straight `gsap.to({x, y})` call.
- It will not fade out between taps on the same UI. The single timeline guarantees continuity.

If a beat needs something this component refuses to do, the beat is fighting the rules in `SKILL.md` — restage the beat, don't fork the cursor.
