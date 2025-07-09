import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 12000,
    cors: true,
    hmr: {
      host: 'localhost',
    },
    allowedHosts: ['work-1-bbpidtjmsgeajnap.prod-runtime.all-hands.dev', 'work-2-bbpidtjmsgeajnap.prod-runtime.all-hands.dev'],
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'ai': ['@tensorflow/tfjs'],
          '3d': ['three'],
          'audio': ['tone'],
          'multiplayer': ['socket.io-client'],
          'analytics': ['d3'],
          'ui': ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: [
      '@tensorflow/tfjs',
      'three',
      'tone',
      'socket.io-client',
      'd3',
      'zustand'
    ]
  },
  define: {
    global: 'globalThis',
  }
});