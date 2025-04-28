// app/vitest.config.mts

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.mjs'], // ✅ ここを変更！
    globals: true,
  },
})
