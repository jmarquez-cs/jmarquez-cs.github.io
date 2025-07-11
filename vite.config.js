
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5001,
    strictPort: true,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 5001,
    strictPort: true
  }
})
