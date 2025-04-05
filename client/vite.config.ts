import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true, // Fail if port 3000 is not available
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [], // Remove external modules - React must be in the bundle
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-slot'
          ],
        },
        // Ensure proper paths for chunks
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Improve debugging
    sourcemap: true,
    // Split chunks for better caching
    cssCodeSplit: true,
    // Reduce chunk size
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    jsx: 'automatic', // Use automatic JSX runtime
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: 'automatic',
      target: 'es2020',
    }
  }
}) 