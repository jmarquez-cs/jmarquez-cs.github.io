
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        manualChunks: {
          'mermaid-core': ['mermaid'],
          'kaplay-game': ['kaplay'],
          'react-vendor': ['react', 'react-dom'],
          'icons': ['react-icons']
        }
      }
    }
  },
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
