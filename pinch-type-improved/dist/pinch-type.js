class D extends Error {
  constructor(t) {
    super(`[pinch-type] ${t}`), this.name = "PinchTypeError";
  }
}
function R(r) {
  if (typeof r == "string") {
    const t = document.querySelector(r);
    if (!t)
      throw new D(`Container not found: "${r}"`);
    return t;
  }
  if (!(r instanceof HTMLElement))
    throw new D("Container must be an HTMLElement or a CSS selector string");
  return r;
}
const P = 3;
class I {
  constructor(t, e) {
    this.container = t, this.onResize = e, this._width = 0, this._height = 0, this.element = document.createElement("canvas"), this.element.style.display = "block", this.element.style.width = "100%", this.element.style.height = "100%", this.element.style.touchAction = "none", this.element.setAttribute("role", "img"), this.element.setAttribute("aria-label", "Text display area");
    const s = this.element.getContext("2d");
    if (!s)
      throw new D("Failed to get 2D rendering context");
    this.ctx = s, this._dpr = Math.min(window.devicePixelRatio || 1, P), this.container.appendChild(this.element), this.resizeObserver = new ResizeObserver((a) => {
      for (const o of a) {
        const { width: i, height: h } = o.contentRect;
        this.updateSize(i, h);
      }
    }), this.resizeObserver.observe(this.container);
    const n = this.container.getBoundingClientRect();
    this.updateSize(n.width, n.height);
  }
  get dpr() {
    return this._dpr;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  clear(t) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.fillStyle = t, this.ctx.fillRect(0, 0, this.element.width, this.element.height), this.ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
  }
  updateSize(t, e) {
    this._dpr = Math.min(window.devicePixelRatio || 1, P), this._width = t, this._height = e, this.element.width = Math.round(t * this._dpr), this.element.height = Math.round(e * this._dpr), this.ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0), this.onResize(t, e);
  }
  destroy() {
    this.resizeObserver.disconnect(), this.element.remove();
  }
}
class _ {
  constructor() {
    this.lines = [], this.totalHeight = 0;
  }
  layout(t, e, s, n, a, o, i, h) {
    const u = `${s}px ${h}`;
    e.font = u;
    const p = a - o * 2, c = s * n, d = t.split(/\n\s*\n/), y = c * 0.5;
    this.lines = [];
    let l = i;
    for (let g = 0; g < d.length; g++) {
      const v = d[g].trim();
      if (!v) continue;
      g > 0 && (l += y);
      const w = v.split(/\s+/);
      let f = "", S = !0;
      for (const x of w) {
        const m = f ? `${f} ${x}` : x;
        e.measureText(m).width > p && f ? (this.lines.push({
          text: f,
          y: l,
          height: c,
          paragraphStart: S
        }), l += c, f = x, S = !1) : f = m;
      }
      f && (this.lines.push({
        text: f,
        y: l,
        height: c,
        paragraphStart: S
      }), l += c);
    }
    return this.totalHeight = l + i, {
      lines: this.lines,
      totalHeight: this.totalHeight,
      contentWidth: a
    };
  }
  getLines() {
    return this.lines;
  }
  getTotalHeight() {
    return this.totalHeight;
  }
}
const M = 0.5, A = 0.15, k = 0.5;
class $ {
  // px per second
  constructor(t = 0.97) {
    this.friction = t, this.offset = 0, this.velocity = 0;
  }
  applyDelta(t) {
    this.offset += t;
  }
  fling(t) {
    this.velocity = t;
  }
  step(t, e, s) {
    const n = Math.max(0, e - s), a = t / 1e3;
    if (Math.abs(this.velocity) > M) {
      this.offset += this.velocity * a;
      const i = Math.pow(this.friction, t / 16.67);
      this.velocity *= i, Math.abs(this.velocity) < M && (this.velocity = 0);
    }
    let o = !1;
    if (this.offset < 0)
      this.offset += -this.offset * A, this.velocity *= k, o = !0, Math.abs(this.offset) < 0.5 && (this.offset = 0, this.velocity = 0);
    else if (this.offset > n) {
      const i = this.offset - n;
      this.offset -= i * A, this.velocity *= k, o = !0, Math.abs(this.offset - n) < 0.5 && (this.offset = n, this.velocity = 0);
    }
    return Math.abs(this.velocity) > M || o;
  }
  get maxScroll() {
    return this.offset;
  }
  get isMoving() {
    return Math.abs(this.velocity) > M;
  }
}
const O = 3;
class X {
  constructor(t) {
    this.callback = t, this.rafId = null, this.lastTimestamp = 0, this.hasFirstFrame = !1, this.idleFrames = 0, this.running = !1;
  }
  start() {
    this.running || (this.running = !0, this.lastTimestamp = 0, this.hasFirstFrame = !1, this.idleFrames = 0, this.scheduleFrame());
  }
  stop() {
    this.running = !1, this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null);
  }
  wake() {
    this.idleFrames = 0, this.running || this.start();
  }
  get isRunning() {
    return this.running;
  }
  destroy() {
    this.stop();
  }
  scheduleFrame() {
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }
  tick(t) {
    if (!this.running) return;
    const e = this.hasFirstFrame ? Math.min(t - this.lastTimestamp, 100) : 16.67;
    if (this.hasFirstFrame = !0, this.lastTimestamp = t, this.callback(e) ? this.idleFrames = 0 : this.idleFrames++, this.idleFrames >= O) {
      this.running = !1, this.rafId = null;
      return;
    }
    this.scheduleFrame();
  }
}
class W {
  constructor(t, e, s, n, a) {
    this.canvas = t, this.onIntent = e, this.onActivity = s, this.keyboardEnabled = n, this.getCurrentFontSize = a, this.touchStartY = 0, this.touchStartTime = 0, this.lastTouchY = 0, this.lastTouchTime = 0, this.isTouching = !1, this.pinchStartDist = 0, this.pinchStartFontSize = 0, this.isPinching = !1, this.onTouchStart = (i) => {
      if (i.preventDefault(), this.onActivity(), i.touches.length === 2) {
        this.isPinching = !0, this.pinchStartDist = this.getTouchDistance(i.touches), this.pinchStartFontSize = this.getCurrentFontSize();
        return;
      }
      if (i.touches.length === 1) {
        this.isTouching = !0, this.isPinching = !1;
        const h = i.touches[0];
        this.touchStartY = h.clientY, this.touchStartTime = performance.now(), this.lastTouchY = h.clientY, this.lastTouchTime = this.touchStartTime;
      }
    }, this.onTouchMove = (i) => {
      if (i.preventDefault(), this.onActivity(), this.isPinching && i.touches.length === 2) {
        const u = this.getTouchDistance(i.touches) / this.pinchStartDist;
        this.onIntent({ type: "pinch", scale: u * this.pinchStartFontSize });
        return;
      }
      if (this.isTouching && i.touches.length === 1) {
        const h = i.touches[0], u = performance.now(), p = this.lastTouchY - h.clientY;
        this.onIntent({ type: "delta", pixels: p }), this.lastTouchY = h.clientY, this.lastTouchTime = u;
      }
    }, this.onTouchEnd = (i) => {
      if (this.isPinching) {
        this.isPinching = !1;
        return;
      }
      if (this.isTouching) {
        this.isTouching = !1;
        const h = performance.now();
        if (h - this.lastTouchTime < 100) {
          const p = this.lastTouchY - this.touchStartY, c = (h - this.touchStartTime) / 1e3;
          if (c > 0) {
            const d = -p / c;
            Math.abs(d) > 50 && this.onIntent({ type: "fling", velocityPxPerSec: d });
          }
        }
      }
    }, this.onWheel = (i) => {
      i.preventDefault(), this.onActivity();
      let h = i.deltaY;
      i.deltaMode === WheelEvent.DOM_DELTA_LINE ? h *= 20 : i.deltaMode === WheelEvent.DOM_DELTA_PAGE && (h *= window.innerHeight), this.onIntent({ type: "delta", pixels: h });
    }, this.onKeyDown = (i) => {
      const u = window.innerHeight * 0.8;
      switch (i.key) {
        case "ArrowDown":
          i.preventDefault(), this.onActivity(), this.onIntent({ type: "delta", pixels: 60 });
          break;
        case "ArrowUp":
          i.preventDefault(), this.onActivity(), this.onIntent({ type: "delta", pixels: -60 });
          break;
        case "PageDown":
        case " ":
          i.preventDefault(), this.onActivity(), this.onIntent({ type: "delta", pixels: u });
          break;
        case "PageUp":
          i.preventDefault(), this.onActivity(), this.onIntent({ type: "delta", pixels: -u });
          break;
        case "Home":
          i.preventDefault(), this.onActivity(), this.onIntent({ type: "scroll-to", position: "start" });
          break;
        case "End":
          i.preventDefault(), this.onActivity(), this.onIntent({ type: "scroll-to", position: "end" });
          break;
      }
    }, this.abortController = new AbortController();
    const o = this.abortController.signal;
    t.addEventListener("touchstart", this.onTouchStart, { passive: !1, signal: o }), t.addEventListener("touchmove", this.onTouchMove, { passive: !1, signal: o }), t.addEventListener("touchend", this.onTouchEnd, { passive: !0, signal: o }), t.addEventListener("touchcancel", this.onTouchEnd, { passive: !0, signal: o }), t.addEventListener("wheel", this.onWheel, { passive: !1, signal: o }), n && document.addEventListener("keydown", this.onKeyDown, { signal: o });
  }
  destroy() {
    this.abortController.abort();
  }
  getTouchDistance(t) {
    const e = t[0].clientX - t[1].clientX, s = t[0].clientY - t[1].clientY;
    return Math.sqrt(e * e + s * s);
  }
}
class j {
  constructor() {
    this.loaded = !1;
  }
  async waitForFont(t) {
    if (!this.loaded) {
      if (typeof document > "u" || !document.fonts) {
        this.loaded = !0;
        return;
      }
      try {
        await document.fonts.ready;
        const e = ["16px", "24px"];
        for (const s of e)
          await document.fonts.load(`${s} ${t}`);
      } catch {
      }
      this.loaded = !0;
    }
  }
  get isLoaded() {
    return this.loaded;
  }
}
class B {
  constructor(t) {
    this.root = document.createElement("div"), this.root.setAttribute("role", "document"), this.root.setAttribute("aria-label", "Text content"), this.root.setAttribute("tabindex", "0"), Object.assign(this.root.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0"
    }), t.appendChild(this.root);
  }
  update(t) {
    const e = [[]];
    for (const n of t)
      n.paragraphStart && e[e.length - 1].length > 0 && e.push([]), e[e.length - 1].push(n.text);
    const s = e.map((n) => n.join(" ")).join(`

`);
    if (this.root.dataset.content !== s) {
      this.root.dataset.content = s, this.root.innerHTML = "";
      for (const n of e) {
        const a = document.createElement("p");
        a.textContent = n.join(" "), this.root.appendChild(a);
      }
    }
  }
  destroy() {
    this.root.remove();
  }
}
class U {
  constructor() {
    this.supportsPinch = !0;
  }
  render(t) {
    const { ctx: e, scroll: s, layout: n, config: a, fontSize: o } = t, { paddingX: i, fontFamily: h, textColor: u } = a, p = o * a.lineHeight;
    e.font = `${o}px ${h}`, e.fillStyle = u, e.textBaseline = "top";
    const c = s.offset;
    c + s.viewportHeight;
    for (const d of n.lines) {
      const l = d.y / d.height * p - c;
      l + p < -50 || l > s.viewportHeight + 50 || e.fillText(d.text, i, l);
    }
  }
}
class Z {
  constructor() {
    this.supportsPinch = !1;
  }
  render(t) {
    const { ctx: e, scroll: s, layout: n, config: a, fontSize: o, viewportHeight: i } = t, { paddingX: h, fontFamily: u, textColor: p, morphRadius: c, morphCenterScale: d, morphEdgeScale: y } = a, l = o * a.lineHeight, g = i / 2;
    e.textBaseline = "top";
    for (const v of n.lines) {
      const f = v.y / v.height * l - s.offset;
      if (f + l * d < -100) continue;
      if (f > i + 100) break;
      const S = f + l / 2, x = Math.abs(S - g), m = Math.min(x / c, 1), T = 1 - Math.pow(1 - m, 3), F = o * d, z = o * y, L = F + (z - F) * T, E = 1 - T * 0.75, b = Math.round(255 - T * 153), Y = b, C = b;
      e.save(), e.font = `${L}px ${u}`, e.fillStyle = `rgba(${b}, ${Y}, ${C}, ${E})`, e.fillText(v.text, h, f), e.restore();
    }
  }
}
class q {
  constructor() {
    this.supportsPinch = !0;
  }
  render(t) {
    const { ctx: e, scroll: s, layout: n, config: a, fontSize: o, viewportHeight: i } = t, { paddingX: h, fontFamily: u, morphRadius: p, morphCenterScale: c, morphEdgeScale: d } = a, y = o * a.lineHeight, l = i / 2;
    e.textBaseline = "top";
    for (const g of n.lines) {
      const w = g.y / g.height * y - s.offset;
      if (w + y * c < -100) continue;
      if (w > i + 100) break;
      const f = w + y / 2, S = Math.abs(f - l), x = Math.min(S / p, 1), m = 1 - Math.pow(1 - x, 3), T = o / a.baseFontSize, F = a.baseFontSize * c * T, z = a.baseFontSize * d * T, L = F + (z - F) * m, E = 1 - m * 0.75, b = Math.round(255 - m * 153);
      e.save(), e.font = `${L}px ${u}`, e.fillStyle = `rgba(${b}, ${b}, ${b}, ${E})`, e.fillText(g.text, h, w), e.restore();
    }
  }
}
const G = {
  strategy: "uniform",
  fontFamily: "system-ui, -apple-system, sans-serif",
  baseFontSize: 18,
  minFontSize: 10,
  maxFontSize: 72,
  lineHeight: 1.5,
  paddingX: 20,
  paddingY: 20,
  backgroundColor: "#0a0a0a",
  textColor: "#e5e5e5",
  morphRadius: 300,
  morphCenterScale: 2.5,
  morphEdgeScale: 0.6,
  friction: 0.97,
  keyboard: !0,
  a11y: !0,
  onZoom: null
};
class H {
  constructor(t) {
    this.mirror = null, this.currentLayout = null, this.needsRelayout = !0;
    const e = R(t.container);
    this.config = {
      ...G,
      ...t,
      container: e,
      onZoom: t.onZoom ?? null
    }, this.fontSize = this.config.baseFontSize, this.layout = new _(), this.physics = new $(this.config.friction), this.strategy = this.createStrategy(this.config.strategy), this.canvas = new I(e, () => {
      this.needsRelayout = !0, this.loop.wake();
    }), this.input = new W(
      this.canvas.element,
      (s) => this.handleIntent(s),
      () => this.loop.wake(),
      this.config.keyboard,
      () => this.fontSize
    ), this.config.a11y && (this.mirror = new B(e)), this.loop = new X((s) => this.tick(s)), this.fontLoader = new j(), this.fontLoader.waitForFont(this.config.fontFamily).then(() => {
      this.needsRelayout = !0, this.loop.wake();
    }), this.needsRelayout = !0, this.loop.start();
  }
  setText(t) {
    this.config.text = t, this.needsRelayout = !0, this.physics.offset = 0, this.physics.velocity = 0, this.loop.wake();
  }
  setStrategy(t) {
    this.config.strategy = t, this.strategy = this.createStrategy(t), this.loop.wake();
  }
  destroy() {
    var t;
    this.loop.destroy(), this.input.destroy(), this.canvas.destroy(), (t = this.mirror) == null || t.destroy();
  }
  createStrategy(t) {
    switch (t) {
      case "morph":
        return new Z();
      case "combined":
        return new q();
      default:
        return new U();
    }
  }
  handleIntent(t) {
    var e, s;
    switch (t.type) {
      case "delta":
        this.physics.applyDelta(t.pixels), this.physics.velocity = 0;
        break;
      case "fling":
        this.physics.fling(t.velocityPxPerSec);
        break;
      case "pinch":
        this.strategy.supportsPinch && (this.fontSize = Math.max(
          this.config.minFontSize,
          Math.min(this.config.maxFontSize, t.scale)
        ), this.needsRelayout = !0, (s = (e = this.config).onZoom) == null || s.call(e, this.fontSize));
        break;
      case "scroll-to":
        t.position === "start" ? (this.physics.offset = 0, this.physics.velocity = 0) : this.currentLayout && (this.physics.offset = Math.max(0, this.currentLayout.totalHeight - this.canvas.height), this.physics.velocity = 0);
        break;
    }
  }
  tick(t) {
    if (this.needsRelayout && (this.currentLayout = this.layout.layout(
      this.config.text,
      this.canvas.ctx,
      this.fontSize,
      this.config.lineHeight,
      this.canvas.width,
      this.config.paddingX,
      this.config.paddingY,
      this.config.fontFamily
    ), this.needsRelayout = !1, this.mirror && this.currentLayout && this.mirror.update(this.currentLayout.lines)), !this.currentLayout) return !1;
    const e = this.physics.step(
      t,
      this.currentLayout.totalHeight,
      this.canvas.height
    );
    return this.canvas.clear(this.config.backgroundColor), this.strategy.render({
      ctx: this.canvas.ctx,
      scroll: {
        offset: this.physics.offset,
        velocity: this.physics.velocity,
        maxScroll: Math.max(0, this.currentLayout.totalHeight - this.canvas.height),
        viewportHeight: this.canvas.height
      },
      layout: this.currentLayout,
      config: this.config,
      dpr: this.canvas.dpr,
      fontSize: this.fontSize,
      viewportHeight: this.canvas.height,
      viewportWidth: this.canvas.width
    }), e || this.needsRelayout;
  }
}
function N(r) {
  return new H({ ...r, strategy: "uniform" });
}
function V(r) {
  return new H({ ...r, strategy: "morph" });
}
function K(r) {
  return new H({ ...r, strategy: "combined" });
}
export {
  H as PinchType,
  K as createPinchMorph,
  N as createPinchType,
  V as createScrollMorph
};
//# sourceMappingURL=pinch-type.js.map
