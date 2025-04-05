import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "zustand": path.resolve(__dirname, "node_modules", "zustand")
    },
  },
  optimizeDeps: {
    include: ['@iconify/react', 'zustand']
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'HUGGINGFACE'],
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    target: 'es2020',
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
            'react-helmet-async',
            'sonner',
            '@iconify/react',
            'zustand'
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: isDevelopment ? {
      // Proxy API requests to Netlify Functions during development
      '/api': {
        target: 'http://localhost:9999/.netlify/functions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    } : undefined
  }
});
