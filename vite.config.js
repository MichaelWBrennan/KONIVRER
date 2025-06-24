import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Custom plugin to exclude card images from build
const excludeCardImages = () => {
  return {
    name: 'exclude-card-images',
    generateBundle(options, bundle) {
      // Remove card images from the bundle
      Object.keys(bundle).forEach(fileName => {
        if (fileName.includes('assets/cards/') && fileName.endsWith('.png')) {
          delete bundle[fileName];
        }
      });
    },
    writeBundle() {
      // Remove card images directory from dist after build
      const cardsDir = path.join('dist', 'assets', 'cards');
      if (fs.existsSync(cardsDir)) {
        fs.rmSync(cardsDir, { recursive: true, force: true });
        console.log('🗑️  Removed card images from dist (served via CDN)');
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), excludeCardImages()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      external: []
    }
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
  }
});
