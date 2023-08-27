import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.vue', '.js', '.jsx', '.ts', '.tsx']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          console.log(id)
          if (id.includes('/element-ui/lib/utils')) {
            return 'element-ui-util'
          } else if (id.includes('/element-ui/lib/')) {
            return 'element-ui'
          }
          if (id.includes('/node_modules/axios')) {
            return 'axios'
          }
        }
      }
    },
    minify: true
  }
})
