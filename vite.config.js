import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Custom plugin to include card images in build (removed CDN exclusion)
// Card images are now served locally instead of via CDN

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 12000,
    host: '0.0.0.0',
    cors: true,
    open: false,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 12001,
    cors: true,
  },
});
