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
    allowedHosts: ['work-1-hvckvmgjiulxhimz.prod-runtime.all-hands.dev', 'work-2-hvckvmgjiulxhimz.prod-runtime.all-hands.dev']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
});