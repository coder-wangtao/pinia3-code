import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __DEV__: true,
    __USE_DEVTOOLS__: true,
    __TEST__: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // pinia: fileURLToPath(new URL('../pinia/src/index.ts', import.meta.url)),
    },
  },
})
