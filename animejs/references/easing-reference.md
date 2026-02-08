# anime.js v4 Easing Reference

Complete catalog of all easing functions available in anime.js v4.

## Built-in Easings (27)

All easing names use the v4 format (no `ease` prefix). Example: `ease: 'outQuad'`

### Quad (Power of 2) — Subtle, natural
| Easing | Motion Character |
|--------|-----------------|
| `inQuad` | Gentle acceleration from rest |
| `outQuad` | Gentle deceleration to rest — **default, good for most entrances** |
| `inOutQuad` | Smooth acceleration then deceleration |

### Cubic (Power of 3) — Moderate
| Easing | Motion Character |
|--------|-----------------|
| `inCubic` | Moderate acceleration, more noticeable than Quad |
| `outCubic` | Moderate deceleration — snappier entrance than outQuad |
| `inOutCubic` | Smooth but with more contrast between fast/slow phases |

### Quart (Power of 4) — Pronounced
| Easing | Motion Character |
|--------|-----------------|
| `inQuart` | Strong acceleration, slow start |
| `outQuart` | Quick snap then long settle |
| `inOutQuart` | Dramatic speed change at midpoint |

### Quint (Power of 5) — Dramatic
| Easing | Motion Character |
|--------|-----------------|
| `inQuint` | Very slow start, explosive acceleration |
| `outQuint` | Explosive start, long gentle settle |
| `inOutQuint` | Most dramatic midpoint speed change |

### Sine — Gentle, organic
| Easing | Motion Character |
|--------|-----------------|
| `inSine` | Very gentle acceleration, barely noticeable |
| `outSine` | Very gentle deceleration — subtlest of all |
| `inOutSine` | Smooth wave-like motion |

### Expo (Exponential) — Sharp, dynamic
| Easing | Motion Character |
|--------|-----------------|
| `inExpo` | Near-still start then sudden burst |
| `outExpo` | Sudden start then near-instant stop |
| `inOutExpo` | Dramatic: almost pauses at start/end, fast through middle |

### Circ (Circular) — Clean, mechanical
| Easing | Motion Character |
|--------|-----------------|
| `inCirc` | Gradual then suddenly fast — like a ball rolling off an edge |
| `outCirc` | Fast then suddenly stops — clean, decisive landing |
| `inOutCirc` | Rounded acceleration curve |

### Back — Overshoot
| Easing | Motion Character |
|--------|-----------------|
| `inBack` | Pulls back slightly before moving forward |
| `outBack` | Overshoots target then settles back — **playful, attention-grabbing** |
| `inOutBack` | Pull back + overshoot — dramatic entrance/exit |

### Elastic — Bouncy spring
| Easing | Motion Character |
|--------|-----------------|
| `inElastic` | Oscillates before launching |
| `outElastic` | Springs past target, oscillates to rest — **very bouncy** |
| `inOutElastic` | Spring oscillation at both ends |

---

## Custom Easings

### `cubicBezier(x1, y1, x2, y2)`

Same as CSS `cubic-bezier()`. Common presets:

| Preset | Values | Equivalent |
|--------|--------|------------|
| CSS `ease` | `cubicBezier(0.25, 0.1, 0.25, 1.0)` | Similar to `outQuad` |
| CSS `ease-in` | `cubicBezier(0.42, 0, 1, 1)` | Similar to `inCubic` |
| CSS `ease-out` | `cubicBezier(0, 0, 0.58, 1)` | Similar to `outCubic` |
| CSS `ease-in-out` | `cubicBezier(0.42, 0, 0.58, 1)` | Similar to `inOutCubic` |
| Material Deceleration | `cubicBezier(0, 0, 0.2, 1)` | Quick entrance, gentle stop |
| Material Acceleration | `cubicBezier(0.4, 0, 1, 1)` | Gradual start, quick exit |

### `spring(mass, stiffness, damping, velocity)`

Physics-based spring easing. Duration is determined by the spring parameters, not the `duration` property.

| Recipe | Values | Character |
|--------|--------|-----------|
| Snappy | `spring(1, 200, 20, 0)` | Quick, barely any bounce |
| Bouncy | `spring(1, 100, 10, 0)` | Visible bounce, playful |
| Gentle | `spring(1, 50, 8, 0)` | Slow, soft bounce |
| Stiff | `spring(2, 300, 15, 0)` | Heavy, strong snap |
| Wobbly | `spring(1, 80, 5, 0)` | Multiple bounces, loose feel |

**Parameters:**
- `mass` — Weight of the object (higher = slower, more momentum)
- `stiffness` — Spring tension (higher = faster, snappier)
- `damping` — Friction (higher = fewer bounces, settles faster)
- `velocity` — Initial velocity (0 = starts from rest)

### `steps(count)`

Discrete steps instead of smooth interpolation. Use for:
- Frame-by-frame sprite animations
- Typewriter effects
- Clock/timer displays
- Retro pixel art animations

```js
ease: 'steps(5)'   // Jumps through 5 discrete values
```

### `linear`

Constant speed, no acceleration. Use for:
- Continuous rotation (spinners, loading)
- Marquee/ticker scrolling
- Progress bars

---

## Decision Guide

| Situation | Recommended Easing |
|-----------|-------------------|
| **Element enters view** | `outQuad`, `outCubic`, `outExpo` |
| **Element exits view** | `inQuad`, `inCubic` |
| **Hover / state change** | `outQuad` (fast, 200-300ms) |
| **Modal / overlay open** | `outCubic`, `outBack` |
| **Modal close** | `inCubic` (faster than open) |
| **Page transition** | `inOutQuad`, `inOutCubic` |
| **Attention / notification** | `outElastic`, `outBack` |
| **Continuous loop** | `linear` |
| **Interactive / playful UI** | `spring()`, `outBack` |
| **Stagger delays** | `inOutQuad` (even distribution feel) |
| **Subtle / professional** | `outSine`, `outQuad` |
| **Dramatic / impactful** | `outExpo`, `outQuint` |
| **Parallax layers** | `linear` or `outSine` |
