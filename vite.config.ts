import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React and routing - needed immediately
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI and animation libraries
          'ui-vendor': ['framer-motion', '@vercel/analytics', '@vercel/speed-insights'],
          // 3D and game libraries - lazy loaded
          'babylon-vendor': ['babylonjs', 'babylon'],
          'three-vendor': ['three'],
          // AI and ML libraries - lazy loaded
          'ai-vendor': ['@tensorflow/tfjs', '@xenova/transformers', '@mediapipe/tasks-vision'],
          // Audio libraries - lazy loaded
          'audio-vendor': ['tone'],
          // Other heavy libraries
          'heavy-vendor': ['d3', 'lodash-es', 'socket.io-client'],
        },
      },
    },
    // Increase chunk size warning limit for 3D libraries
    chunkSizeWarningLimit: 1000,
    // Optimize for faster startup
    target: 'esnext',
    minify: 'esbuild',
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
