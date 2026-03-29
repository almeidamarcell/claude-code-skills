export class FontLoader {
  private loaded = false;

  async waitForFont(fontFamily: string): Promise<void> {
    if (this.loaded) return;

    if (typeof document === 'undefined' || !document.fonts) {
      this.loaded = true;
      return;
    }

    try {
      await document.fonts.ready;
      // Check if the specific font is available
      const testSizes = ['16px', '24px'];
      for (const size of testSizes) {
        await document.fonts.load(`${size} ${fontFamily}`);
      }
    } catch {
      // Font loading failed, proceed with fallback
    }

    this.loaded = true;
  }

  get isLoaded(): boolean {
    return this.loaded;
  }
}
