import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate chunks for large libraries
          'three': ['three'],
          'tensorflow': ['@tensorflow/tfjs'],
          'audio': ['tone'],
          'social': ['socket.io-client']
        }
      }
    },
    // Increase chunk size warning limit for 3D assets
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 12000,
    open: false,
    cors: true,
    allowedHosts: true,
    // Enable HTTPS for WebRTC and advanced features
    https: false, // Set to true in production with proper certificates
    headers: {
      // Enable SharedArrayBuffer for advanced audio processing
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 12001,
    cors: true,
  },
  optimizeDeps: {
    include: [
      'three',
      '@tensorflow/tfjs',
      'tone',
      'socket.io-client',
      'framer-motion',
      'react-spring'
    ],
    exclude: [
      // Exclude large files that should be loaded dynamically
      'three/examples/jsm/loaders/GLTFLoader.js'
    ]
  },
  define: {
    // Enable WebGL and advanced features
    __ENABLE_WEBGL__: true,
    __ENABLE_WEBRTC__: true,
    __ENABLE_WEBAUDIO__: true,
    __ENABLE_TENSORFLOW__: true,
  },
  worker: {
    format: 'es'
  }
});
