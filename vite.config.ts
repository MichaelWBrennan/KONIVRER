import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 12001,
    cors: true,
    hmr: {
      host: 'localhost',
    },
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL',
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
          'ai': ['@tensorflow/tfjs', '@xenova/transformers'],
          '3d': ['three', 'babylon'],
          'audio': ['tone'],
          'multiplayer': ['socket.io-client'],
          'analytics': ['d3'],
          'gaming': ['phaser'],
          'vision': ['@mediapipe/tasks-vision'],
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
      'zustand',
      'phaser',
      '@xenova/transformers'
    ]
  },
  define: {
    global: 'globalThis',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts']
  }
});