import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      /* ⚠️ 不能 rewrite 掉 /api：后端 server.servlet.context-path 就是 /api
         （nginx.conf 也是 /api/ → http://backend:8081/api/，保留前缀）。
         删前缀会让所有请求 404。 */
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
