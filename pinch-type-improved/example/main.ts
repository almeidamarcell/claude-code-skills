import { PinchType } from '../src/index';
import type { PinchTypeConfig } from '../src/index';

const SAMPLE_TEXT = `The Art of Reading

In the age of infinite scrolling and rapid content consumption, the act of deep reading has become a rare and precious skill. When we read deeply, we engage not just our eyes but our entire cognitive apparatus — making connections, forming mental models, and constructing meaning from the raw materials of language.

Typography and Readability

The relationship between typography and comprehension is profound. Font size, line height, contrast, and spacing all play crucial roles in how easily we can process text. Research has shown that optimal line lengths of 50-75 characters per line lead to the best reading speeds and comprehension.

The Physics of Touch

Mobile devices have transformed how we interact with text. The pinch-to-zoom gesture, first popularized by the iPhone in 2007, has become second nature to billions of people. It provides a direct, physical metaphor for getting closer to content — much like leaning forward to examine a printed page more carefully.

Canvas Rendering

Drawing text on an HTML canvas element gives us pixel-level control over every aspect of rendering. Unlike DOM-based text, canvas text can be smoothly animated, scaled, and transformed in real-time without triggering browser layout recalculations.

Momentum Scrolling

The physics of momentum scrolling creates a sense of weight and physicality. When you flick the content and it gradually decelerates, it feels like a real physical object. The friction coefficient, the elastic overscroll at boundaries, and the velocity threshold for stopping all contribute to this illusion.

The Fisheye Effect

The morphing text effect draws inspiration from fisheye lenses in photography. Text near the center of the viewport appears larger and more prominent, while text toward the edges recedes. This creates a natural focal point and helps guide the reader's attention.

Accessibility Matters

Even when rendering text on a canvas element, it is essential to provide accessible alternatives. Screen readers cannot access canvas-drawn text, so a hidden DOM mirror provides the same content in an accessible format. This ensures that all users can access the content regardless of their abilities.

Performance and Battery Life

On mobile devices, battery life is a precious resource. Running animation frames continuously — even when nothing on screen has changed — wastes energy. An idle detection system that pauses the animation loop when the content is static can significantly reduce power consumption.

Frame Rate Independence

Modern devices run at various refresh rates: 30Hz, 60Hz, 90Hz, 120Hz, and even 144Hz. Physics simulations that assume a fixed frame rate will behave differently on different devices. By using delta-time calculations, the same flick gesture produces the same scrolling distance regardless of the device's refresh rate.

The Future of Reading

As display technology continues to evolve — with higher resolutions, variable refresh rates, and new input modalities — the fundamental challenge remains the same: presenting text in a way that is comfortable, accessible, and even delightful to read. The tools may change, but the goal endures.`;

const container = document.getElementById('canvas-container')!;
const buttons = {
  uniform: document.getElementById('btn-uniform')!,
  morph: document.getElementById('btn-morph')!,
  combined: document.getElementById('btn-combined')!,
};

const config: PinchTypeConfig = {
  container,
  text: SAMPLE_TEXT,
  strategy: 'uniform',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  baseFontSize: 18,
  lineHeight: 1.6,
  paddingX: 24,
  paddingY: 32,
  morphRadius: 280,
  morphCenterScale: 2.2,
  morphEdgeScale: 0.65,
};

let engine = new PinchType(config);

function switchStrategy(name: 'uniform' | 'morph' | 'combined') {
  // Update button states
  Object.values(buttons).forEach(b => b.classList.remove('active'));
  buttons[name].classList.add('active');

  // Switch strategy
  engine.setStrategy(name);
}

buttons.uniform.addEventListener('click', () => switchStrategy('uniform'));
buttons.morph.addEventListener('click', () => switchStrategy('morph'));
buttons.combined.addEventListener('click', () => switchStrategy('combined'));
