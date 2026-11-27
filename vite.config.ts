import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  // Same-origin path for product photos (see src/lib/report.ts); production uses public/_redirects.
  server: { proxy: { '/img91': { target: 'https://img.91app.com', changeOrigin: true, rewrite: p => p.replace(/^\/img91/, '') } } },
})
