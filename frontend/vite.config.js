import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/auth': { target: 'http://localhost:8001', changeOrigin: true },
      '/pitches': { target: 'http://localhost:8001', changeOrigin: true },
      '/investors': { target: 'http://localhost:8001', changeOrigin: true },
      '/education': { target: 'http://localhost:8001', changeOrigin: true },
      '/community': { target: 'http://localhost:8001', changeOrigin: true },
      '/health': { target: 'http://localhost:8001', changeOrigin: true },
    },
  },
})
