import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dir: resolve('./test'),
    globals: true,
    setupFiles: ['./test/setup.ts'],
    environment: 'jsdom',
  },
});
