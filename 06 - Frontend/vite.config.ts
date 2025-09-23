import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    cors: true,
    proxy: {
      // Proxy health check requests to localhost services during development
      // This solves the DNS resolution issue when running frontend locally
      '^/api/proxy/teamgenerator': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/teamgenerator/, ''),
      },
      '^/api/proxy/bettingservice': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/bettingservice/, ''),
      },
      '^/api/proxy/matchscheduler': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/matchscheduler/, ''),
      },
      '^/api/proxy/statsaggregator': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/statsaggregator/, ''),
      },
      '^/api/proxy/notificationcenter': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/notificationcenter/, ''),
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3001,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})