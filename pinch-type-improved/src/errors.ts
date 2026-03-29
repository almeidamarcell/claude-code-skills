export class PinchTypeError extends Error {
  constructor(message: string) {
    super(`[pinch-type] ${message}`);
    this.name = 'PinchTypeError';
  }
}

export function resolveContainer(containerOrSelector: HTMLElement | string): HTMLElement {
  if (typeof containerOrSelector === 'string') {
    const el = document.querySelector<HTMLElement>(containerOrSelector);
    if (!el) {
      throw new PinchTypeError(`Container not found: "${containerOrSelector}"`);
    }
    return el;
  }
  if (!(containerOrSelector instanceof HTMLElement)) {
    throw new PinchTypeError('Container must be an HTMLElement or a CSS selector string');
  }
  return containerOrSelector;
}
