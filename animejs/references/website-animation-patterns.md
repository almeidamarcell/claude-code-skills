# anime.js v4 Website Animation Patterns

Production-ready patterns for common website animations. Each includes the assumed HTML, required CSS, and anime.js code.

---

## 1. Hero Section Entrance

Staggered text reveal with subtitle and CTA button using timeline + splitText.

```html
<section class="hero">
  <h1 class="hero-title">Build Something Amazing</h1>
  <p class="hero-subtitle">The fastest way to ship your next product.</p>
  <a class="hero-cta" href="#">Get Started</a>
</section>
```

```css
.hero-subtitle, .hero-cta { opacity: 0; }
```

```js
import { createTimeline, stagger, splitText } from 'animejs';

const splitter = splitText('.hero-title', { chars: true, accessible: true });

const tl = createTimeline({
  defaults: { ease: 'outCubic' },
});

tl.add(splitter.chars, {
    opacity: [0, 1],
    translateY: [30, 0],
    delay: stagger(25),
    duration: 400,
  })
  .add('.hero-subtitle', {
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 600,
  }, '-=200')
  .add('.hero-cta', {
    opacity: [0, 1],
    translateY: [10, 0],
    scale: [0.95, 1],
    duration: 500,
  }, '-=300');
```

---

## 2. Navigation Shrink on Scroll

Navbar shrinks and gains shadow when user scrolls down.

```html
<nav class="navbar">
  <a class="logo" href="#">Logo</a>
  <div class="nav-links">...</div>
</nav>
```

```css
.navbar {
  position: fixed; top: 0; width: 100%;
  padding: 24px 32px;
  transition: box-shadow 0.3s;
}
```

```js
import { createAnimatable, onScroll } from 'animejs';

const nav = createAnimatable('.navbar', {
  padding: { duration: 300, ease: 'outQuad' },
});

let scrolled = false;

window.addEventListener('scroll', () => {
  const isScrolled = window.scrollY > 50;
  if (isScrolled !== scrolled) {
    scrolled = isScrolled;
    nav.padding(isScrolled ? 12 : 24);
    document.querySelector('.navbar').style.boxShadow =
      isScrolled ? '0 2px 12px rgba(0,0,0,0.1)' : 'none';
  }
});
```

---

## 3. Card Grid Reveal on Scroll

Cards fade in with stagger when section scrolls into view.

```html
<section class="cards-section">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</section>
```

```css
.card { opacity: 0; }
```

```js
import { animate, stagger, onScroll } from 'animejs';

onScroll('.cards-section', {
  enter: 'top 80%',       // Trigger when section top hits 80% viewport height
  onEnter: () => {
    animate('.cards-section .card', {
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.95, 1],
      delay: stagger(80, { from: 'first' }),
      duration: 600,
      ease: 'outCubic',
    });
  },
});
```

---

## 4. Testimonial Carousel Transition

Cross-fade between testimonial items.

```html
<div class="testimonial-slider">
  <div class="testimonial active">
    <p class="quote">"First testimonial..."</p>
    <span class="author">Author 1</span>
  </div>
  <div class="testimonial">
    <p class="quote">"Second testimonial..."</p>
    <span class="author">Author 2</span>
  </div>
</div>
```

```css
.testimonial-slider { position: relative; }
.testimonial { position: absolute; inset: 0; opacity: 0; }
.testimonial.active { opacity: 1; }
```

```js
import { createTimeline } from 'animejs';

function switchTestimonial(current, next) {
  const tl = createTimeline({ defaults: { ease: 'inOutQuad' } });

  tl.add(current, {
      opacity: [1, 0],
      translateX: [0, -30],
      duration: 400,
      onComplete: () => current.classList.remove('active'),
    })
    .add(next, {
      opacity: [0, 1],
      translateX: [30, 0],
      duration: 400,
      onBegin: () => next.classList.add('active'),
    }, '-=150');
}
```

---

## 5. Parallax Scroll Layers

Multiple elements move at different speeds synced to scroll.

```html
<section class="parallax-section">
  <div class="parallax-bg"></div>
  <div class="parallax-mid"></div>
  <div class="parallax-fg"></div>
</section>
```

```css
.parallax-section { position: relative; height: 100vh; overflow: hidden; }
.parallax-bg, .parallax-mid, .parallax-fg {
  position: absolute; inset: 0; will-change: transform;
}
```

```js
import { animate, onScroll } from 'animejs';

const layers = [
  { target: '.parallax-bg', range: [-50, 50] },
  { target: '.parallax-mid', range: [-100, 100] },
  { target: '.parallax-fg', range: [-200, 200] },
];

layers.forEach(({ target, range }) => {
  const anim = animate(target, {
    translateY: range,
    ease: 'linear',
    autoplay: false,
  });

  onScroll('.parallax-section', {
    sync: 'playback',
    link: anim,
  });
});
```

---

## 6. Modal Open / Close

Scale + opacity with backdrop using layout animations.

```html
<div class="modal-backdrop" hidden>
  <div class="modal">
    <h2>Modal Title</h2>
    <p>Modal content...</p>
    <button class="modal-close">Close</button>
  </div>
</div>
```

```css
.modal-backdrop {
  position: fixed; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.5); opacity: 0;
}
.modal { transform: scale(0.9) translateY(20px); opacity: 0; }
```

```js
import { createTimeline } from 'animejs';

function openModal() {
  const backdrop = document.querySelector('.modal-backdrop');
  backdrop.hidden = false;

  createTimeline({ defaults: { ease: 'outCubic' } })
    .add('.modal-backdrop', { opacity: [0, 1], duration: 300 })
    .add('.modal', {
      opacity: [0, 1],
      scale: [0.9, 1],
      translateY: [20, 0],
      duration: 400,
    }, '-=200');
}

function closeModal() {
  createTimeline({ defaults: { ease: 'inCubic' } })
    .add('.modal', {
      opacity: [1, 0],
      scale: [1, 0.95],
      duration: 250,
    })
    .add('.modal-backdrop', {
      opacity: [1, 0],
      duration: 200,
      onComplete: () => {
        document.querySelector('.modal-backdrop').hidden = true;
      },
    }, '-=100');
}
```

---

## 7. Tab Content Switch

Animate out current tab content, swap, animate in new content.

```html
<div class="tabs">
  <button class="tab active" data-tab="1">Tab 1</button>
  <button class="tab" data-tab="2">Tab 2</button>
</div>
<div class="tab-content">
  <div class="tab-panel active" id="panel-1">Content 1</div>
  <div class="tab-panel" id="panel-2">Content 2</div>
</div>
```

```css
.tab-panel { display: none; }
.tab-panel.active { display: block; }
```

```js
import { animate } from 'animejs';

function switchTab(currentPanel, nextPanel) {
  // Exit animation
  animate(currentPanel, {
    opacity: [1, 0],
    translateY: [0, -10],
    duration: 200,
    ease: 'inQuad',
    onComplete: () => {
      currentPanel.classList.remove('active');
      nextPanel.classList.add('active');

      // Enter animation
      animate(nextPanel, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 300,
        ease: 'outQuad',
      });
    },
  });
}
```

---

## 8. Toast Notification

Slide in from right, auto-dismiss with progress bar.

```html
<div class="toast" hidden>
  <span class="toast-message">Changes saved successfully</span>
  <div class="toast-progress"></div>
</div>
```

```css
.toast {
  position: fixed; bottom: 24px; right: 24px;
  padding: 16px 24px; border-radius: 8px;
  background: #333; color: #fff;
  transform: translateX(120%);
}
.toast-progress {
  position: absolute; bottom: 0; left: 0;
  height: 3px; width: 100%; background: #4CAF50;
  transform-origin: left;
}
```

```js
import { createTimeline } from 'animejs';

function showToast(duration = 4000) {
  const toast = document.querySelector('.toast');
  toast.hidden = false;

  createTimeline()
    .add('.toast', {
      translateX: ['120%', '0%'],
      duration: 400,
      ease: 'outCubic',
    })
    .add('.toast-progress', {
      scaleX: [1, 0],
      duration: duration,
      ease: 'linear',
    })
    .add('.toast', {
      translateX: ['0%', '120%'],
      duration: 300,
      ease: 'inCubic',
      onComplete: () => { toast.hidden = true; },
    });
}
```

---

## 9. Draggable Image Slider

Horizontal slider with snap-to-slide behavior.

```html
<div class="slider-container">
  <div class="slider-track">
    <div class="slide">Slide 1</div>
    <div class="slide">Slide 2</div>
    <div class="slide">Slide 3</div>
  </div>
</div>
```

```css
.slider-container { overflow: hidden; width: 100%; }
.slider-track { display: flex; }
.slide { min-width: 100%; }
```

```js
import { createDraggable } from 'animejs';

const slideWidth = document.querySelector('.slide').offsetWidth;
const slideCount = document.querySelectorAll('.slide').length;

createDraggable('.slider-track', {
  x: {
    snap: slideWidth,          // Snap to each slide width
    modifier: (x) => Math.max(Math.min(x, 0), -(slideCount - 1) * slideWidth),
  },
  y: false,                    // Horizontal only
  friction: 0.6,
  container: '.slider-container',
});
```

---

## 10. Counter / Stats on Scroll

Animate numbers when stats section enters viewport.

```html
<section class="stats">
  <div class="stat">
    <span class="stat-number" data-target="2500">0</span>
    <span class="stat-label">Customers</span>
  </div>
  <div class="stat">
    <span class="stat-number" data-target="99.9">0</span>
    <span class="stat-label">Uptime %</span>
  </div>
  <div class="stat">
    <span class="stat-number" data-target="150">0</span>
    <span class="stat-label">Countries</span>
  </div>
</section>
```

```js
import { animate, onScroll } from 'animejs';

onScroll('.stats', {
  enter: 'top 75%',
  onEnter: () => {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseFloat(el.dataset.target);
      const isFloat = target % 1 !== 0;
      const obj = { value: 0 };

      animate(obj, {
        value: target,
        duration: 2000,
        ease: 'outExpo',
        onUpdate: () => {
          el.textContent = isFloat
            ? obj.value.toFixed(1)
            : Math.round(obj.value).toLocaleString();
        },
      });
    });
  },
});
```

---

## Performance Notes

- **Use `will-change: transform`** on elements that animate `transform` or `opacity` for GPU acceleration
- **Prefer `translateX`/`translateY`** over `left`/`top` — transforms don't trigger layout reflow
- **Use `waapi.animate()`** for simple transform/opacity animations on many elements simultaneously
- **Avoid animating `width`/`height`** — use `scale` instead when possible
- **Use `frameRate`** to throttle non-critical animations (e.g., `frameRate: 30` for background elements)
- **Set `autoplay: false`** for scroll-synced animations to avoid unnecessary computation
- **Clean up** with `anim.revert()` when removing animated elements from the DOM
