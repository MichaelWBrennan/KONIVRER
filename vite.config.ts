import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Enable JSX runtime
      jsxRuntime: "automatic",
    }),
    vanillaExtractPlugin({
      // Enable CSS source maps in development
      identifiers: process.env.NODE_ENV === "development" ? "debug" : "short",
    }),
  ],
  root: ".",
  server: {
    port: 3000,
    host: true,
    // Enable HMR for better development experience
    hmr: {
      overlay: true,
    },
    // Proxy API requests to backend
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
          ui: ["react-bootstrap", "lucide-react"],
        },
      },
    },
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  publicDir: "public",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@services": resolve(__dirname, "src/services"),
      "@types": resolve(__dirname, "src/types"),
      "@utils": resolve(__dirname, "src/utils"),
      "@pages": resolve(__dirname, "src/pages"),
      "@stores": resolve(__dirname, "src/stores"),
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "react-bootstrap",
      "lucide-react",
      "zustand",
      "axios",
    ],
  },
  // Define environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  },
});
