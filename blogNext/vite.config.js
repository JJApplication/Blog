import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.vue', '.js', '.jsx', '.ts', '.tsx'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('/node_modules/element-ui/lib/utils')) {
            return 'element-ui-util'
          } else if (id.includes('/node_modules/element-ui/lib/locale/')) {
            return 'element-ui-locale'
          } else if (id.includes('/node_modules/element-ui/lib/')) {
            return 'element-ui'
          }
          if (id.includes('/node_modules/axios')) {
            return 'axios'
          }
        },
      },
    },
    minify: true,
  },
})
