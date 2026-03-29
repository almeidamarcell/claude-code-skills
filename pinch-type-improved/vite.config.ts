import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PinchType',
      fileName: 'pinch-type',
      formats: ['es'],
    },
    outDir: 'dist',
    sourcemap: true,
  },
});
