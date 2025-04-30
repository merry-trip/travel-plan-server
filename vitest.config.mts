// vitest.config.mts
import { defineConfig } from 'vitest/config'; // ← ✅ これが必要！
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname), // ← ルート向き
    },
  },
  test: {
    include: ['app/test/unit/**/*.test.mjs'],
    globals: true,
  },
});
