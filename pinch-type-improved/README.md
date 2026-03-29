# pinch-type-improved

A high-performance, canvas-based text rendering library with pinch-to-zoom and fisheye scroll effects for mobile web. An improved reimplementation of [pinch-type](https://github.com/lucascrespo23/pinch-type).

## Improvements over the original

- **No code duplication** — shared engine with pluggable render strategies (Strategy pattern)
- **Frame-rate independent physics** — uses delta-time instead of assuming 60fps
- **Battery-friendly** — animation loop auto-pauses when content is idle
- **Keyboard scrolling** — Arrow keys, Page Up/Down, Home/End, Space
- **Accessibility** — hidden DOM mirror for screen readers
- **Font loading** — waits for web fonts before computing layout
- **Error handling** — meaningful error messages for misconfiguration
- **Unit tests** — tested with Bun test runner
- **Zero dependencies** — no runtime dependencies, pure TypeScript

## Usage

```typescript
import { createPinchType, createScrollMorph, createPinchMorph } from 'pinch-type-improved';

// Uniform text with pinch-to-zoom
const instance = createPinchType({
  container: '#my-container',
  text: 'Your text content here...',
  fontFamily: 'Inter, sans-serif',
  baseFontSize: 18,
});

// Fisheye scroll-morph effect
const morph = createScrollMorph({
  container: '#my-container',
  text: 'Your text content here...',
  morphRadius: 300,
  morphCenterScale: 2.5,
});

// Combined: pinch-zoom + fisheye
const combined = createPinchMorph({
  container: '#my-container',
  text: 'Your text content here...',
});

// Update text dynamically
instance.setText('New content...');

// Switch strategy at runtime
instance.setStrategy('morph');

// Clean up
instance.destroy();
```

## Render Strategies

| Strategy | Pinch Zoom | Fisheye Morph | Description |
|----------|-----------|---------------|-------------|
| `uniform` | Yes | No | All text same size, pinch to scale |
| `morph` | No | Yes | Text near center is larger/brighter |
| `combined` | Yes | Yes | Both pinch zoom and fisheye effect |

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `HTMLElement \| string` | (required) | Container element or CSS selector |
| `text` | `string` | (required) | Text content to render |
| `strategy` | `'uniform' \| 'morph' \| 'combined'` | `'uniform'` | Render strategy |
| `fontFamily` | `string` | `'system-ui, ...'` | CSS font family |
| `baseFontSize` | `number` | `18` | Base font size in px |
| `minFontSize` | `number` | `10` | Min zoom font size |
| `maxFontSize` | `number` | `72` | Max zoom font size |
| `lineHeight` | `number` | `1.5` | Line height multiplier |
| `paddingX` | `number` | `20` | Horizontal padding |
| `paddingY` | `number` | `20` | Vertical padding |
| `backgroundColor` | `string` | `'#0a0a0a'` | Canvas background |
| `textColor` | `string` | `'#e5e5e5'` | Text color |
| `morphRadius` | `number` | `300` | Fisheye focal zone radius |
| `morphCenterScale` | `number` | `2.5` | Center text scale factor |
| `morphEdgeScale` | `number` | `0.6` | Edge text scale factor |
| `friction` | `number` | `0.97` | Scroll momentum friction |
| `keyboard` | `boolean` | `true` | Enable keyboard scrolling |
| `a11y` | `boolean` | `true` | Enable accessibility DOM mirror |
| `onZoom` | `(fontSize: number) => void` | — | Pinch zoom callback |

## Development

```bash
# Install dependencies
bun install

# Run dev server with example
bun run dev

# Run tests
bun test

# Build library
bun run build
```

## Architecture

```
src/
├── engine/
│   ├── Engine.ts          # Orchestrator
│   ├── AnimationLoop.ts   # rAF with idle detection
│   ├── ScrollPhysics.ts   # Delta-time momentum + elastic overscroll
│   ├── Canvas.ts          # HiDPI canvas + resize observer
│   ├── Layout.ts          # Text measurement + line wrapping
│   ├── InputManager.ts    # Touch, wheel, keyboard input
│   └── FontLoader.ts      # Web font loading
├── strategies/
│   ├── UniformStrategy.ts # Same-size text with pinch zoom
│   ├── MorphStrategy.ts   # Fisheye scroll effect
│   └── CombinedStrategy.ts# Pinch + fisheye
├── a11y/
│   └── DomMirror.ts       # Hidden DOM for screen readers
├── types.ts
├── errors.ts
└── index.ts               # Public API
```

## License

MIT
