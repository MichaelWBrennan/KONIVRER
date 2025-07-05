#!/usr/bin/env node
/**
 * KONIVRER Deck Database - Build Optimization Script
 *
 * This script optimizes the build process for better performance
 * It performs the following tasks:
 * 1. Updates Vite configuration for better optimization
 * 2. Implements code splitting
 * 3. Adds bundle analysis
 * 4. Optimizes images and assets
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const VITE_CONFIG_PATH = path.resolve(process.cwd(), 'vite.config.js');
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// Helper functions
function log(): void {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',    // Cyan
    success: '\x1b[32m%s\x1b[0m',  // Green
    warning: '\x1b[33m%s\x1b[0m',  // Yellow
    error: '\x1b[31m%s\x1b[0m'     // Red
  };
  
  console.log(colors[type], message);
}

// Update Vite configuration
function updateViteConfig(): void {
  try {
    const content = fs.readFileSync(VITE_CONFIG_PATH, 'utf8');
    
    // Enhanced configuration with optimizations
    const optimizedConfig = `/**
 * KONIVRER Deck Database - Optimized Vite Configuration
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { imagetools } from 'vite-imagetools';
import { compression } from 'vite-plugin-compression';
import { splitVendorChunkPlugin } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Enable React automatic runtime
        jsxRuntime: 'automatic',
        // Babel options
        babel: {
          plugins: [
            // Enable emotion for styled components if needed
            // ['@emotion/babel-plugin', { sourceMap: true, autoLabel: 'dev-only' }]
          ],
        },
      }),
      // PWA plugin configuration
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'KONIVRER Deck Database',
          short_name: 'KONIVRER',
          description: 'Professional deck building and card database for KONIVRER trading card game',
          theme_color: '#1a202c',
          background_color: '#1a202c',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          // Cache strategies
          runtimeCaching: [
            {
              urlPattern: /^https:\\/\\/fonts\\.googleapis\\.com\\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\\/\\/fonts\\.gstatic\\.com\\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\\.(?:png|jpg|jpeg|svg|gif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            {
              urlPattern: /\\/api\\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60, // 1 hour
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
      // Bundle visualization in production
      mode === 'production' && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
      // Image optimization
      imagetools(),
      // Compression for production builds
      mode === 'production' && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      // Split vendor chunks for better caching
      splitVendorChunkPlugin(),
    ],
    // Resolve aliases for cleaner imports
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@data': path.resolve(__dirname, './src/data'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@config': path.resolve(__dirname, './src/config'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@services': path.resolve(__dirname, './src/services'),
        '@types': path.resolve(__dirname, './src/types'),
      },
    },
    // Server configuration
    server: {
      host: '0.0.0.0',
      port: 12000,
      strictPort: true,
      cors: true,
      proxy: {
        // Proxy API requests to backend server
        '/api': {
          target: 'http://localhost:12001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    // Preview server configuration
    preview: {
      host: '0.0.0.0',
      port: 12001,
      strictPort: true,
      cors: true,
    },
    // Build optimization
    build: {
      // Target modern browsers for smaller bundle size
      target: 'es2020',
      // Output directory
      outDir: 'dist',
      // Enable source maps in production for debugging
      sourcemap: mode !== 'production',
      // Minification options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // CSS code splitting
      cssCodeSplit: true,
      // Asset handling
      assetsInlineLimit: 4096, // 4kb
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000, // 1000kb
      // Rollup options
      rollupOptions: {
        output: {
          // Chunk naming
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Manual chunks for better code splitting
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: ['framer-motion', 'lucide-react', 'react-spring'],
            utils: ['axios', 'zustand', 'zod'],
          },
        },
      },
    },
    // Optimizations
    optimizeDeps: {
      // Include dependencies that need to be pre-bundled
      include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand'],
      // Exclude dependencies that should not be pre-bundled
      exclude: [],
    },
    // Environment variables
    define: {
      'process.env': env,
    },
  };
});
`;
    
    if (!DRY_RUN) {
      fs.writeFileSync(VITE_CONFIG_PATH, optimizedConfig);
      log('Updated Vite configuration with optimizations', 'success');
    } else {
      log('Would update Vite configuration with optimizations', 'info');
      if (VERBOSE) {
        console.log(optimizedConfig);
      }
    }
  } catch (error) {
    log(`Error updating Vite configuration: ${error.message}`, 'error');
  }
}

// Install optimization dependencies
function installDependencies(): void {
  try {
    if (!DRY_RUN) {
      log('Installing optimization dependencies...', 'info');
      execSync('npm install --save-dev rollup-plugin-visualizer vite-imagetools vite-plugin-compression', { stdio: 'inherit' });
      log('Optimization dependencies installed', 'success');
    } else {
      log('Would install optimization dependencies', 'info');
    }
  } catch (error) {
    log(`Error installing optimization dependencies: ${error.message}`, 'error');
  }
}

// Implement code splitting in main entry point
function implementCodeSplitting(): void {
  const mainPath = path.resolve(process.cwd(), 'src/main.jsx');
  
  try {
    if (fs.existsSync(mainPath)) {
      const content = fs.readFileSync(mainPath, 'utf8');
      
      // Add React.lazy imports for code splitting
      const optimizedContent = content.replace(
        /import App from ['"]\.\/App['"];/,
        `import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';

// Use lazy loading for main app component
const App = lazy(() => import('./App'));

// Use lazy loading for major page components
const HomePage = lazy(() => import('./pages/Home'));
const DeckBuilderPage = lazy(() => import('./pages/DeckBuilder'));
const CardSearchPage = lazy(() => import('./pages/CardSearch'));
const TournamentsPage = lazy(() => import('./pages/Tournaments'));`
      );
      
      // Add Suspense wrapper
      const updatedContent = optimizedContent.replace(
        /<App \/>/,
        `<Suspense fallback={<LoadingSpinner />}>
      <App />
    </Suspense>`
      );
      
      if (!DRY_RUN) {
        fs.writeFileSync(mainPath, updatedContent);
        log('Implemented code splitting in main entry point', 'success');
      } else {
        log('Would implement code splitting in main entry point', 'info');
        if (VERBOSE) {
          console.log(updatedContent);
        }
      }
    } else {
      log(`Main entry point not found at ${mainPath}`, 'warning');
    }
  } catch (error) {
    log(`Error implementing code splitting: ${error.message}`, 'error');
  }
}

// Create a loading spinner component
function createLoadingSpinner(): void {
  const spinnerDir = path.resolve(process.cwd(), 'src/components/common');
  const spinnerPath = path.join(spinnerDir, 'LoadingSpinner.jsx');
  
  const spinnerContent = `/**
 * KONIVRER Deck Database - Loading Spinner Component
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import React from 'react';

const LoadingSpinner = (LoadingSpinner: any) => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-900">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-600 border-solid rounded-full" />
        <div className="w-16 h-16 border-4 border-transparent border-solid rounded-full border-t-purple-600 animate-spin absolute top-0 left-0" />
      </div>
      <div className="ml-4 text-xl font-semibold text-white">Loading KONIVRER...</div>
  );
};

export default LoadingSpinner;
`;
  
  try {
    if (!DRY_RUN) {
      if (!fs.existsSync(spinnerDir)) {
        fs.mkdirSync(spinnerDir, { recursive: true });
      }
      fs.writeFileSync(spinnerPath, spinnerContent);
      log('Created LoadingSpinner component', 'success');
    } else {
      log('Would create LoadingSpinner component', 'info');
      if (VERBOSE) {
        console.log(spinnerContent);
      }
    }
  } catch (error) {
    log(`Error creating LoadingSpinner component: ${error.message}`, 'error');
  }
}

// Update package.json scripts
function updatePackageScripts(): void {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Add optimization scripts
    const updatedScripts = {
      ...packageJson.scripts,
      "build:optimized": "vite build --mode production",
      "analyze": "vite build --mode production && open dist/stats.html",
      "preview:optimized": "vite preview --host 0.0.0.0 --port 12001",
      "migrate:ts": "node scripts/migrate-to-typescript.js",
      "migrate:ts:dry": "node scripts/migrate-to-typescript.js --dry-run",
      "migrate:ts:interactive": "node scripts/migrate-to-typescript.js --interactive",
      "optimize:build": "node scripts/optimize-build.js",
      "optimize:all": "npm run migrate:ts && npm run optimize:build && npm run build:optimized"
    };
    
    const updatedPackageJson = {
      ...packageJson,
      scripts: updatedScripts
    };
    
    if (!DRY_RUN) {
      fs.writeFileSync(packagePath, JSON.stringify(updatedPackageJson, null, 2));
      log('Updated package.json scripts', 'success');
    } else {
      log('Would update package.json scripts', 'info');
      if (VERBOSE) {
        console.log(JSON.stringify(updatedScripts, null, 2));
      }
    }
  } catch (error) {
    log(`Error updating package.json scripts: ${error.message}`, 'error');
  }
}

// Main function
function main(): void {
  log('Starting build optimization...', 'info');
  
  if (DRY_RUN) {
    log('DRY RUN: No files will be modified', 'warning');
  }
  
  // Update Vite configuration
  updateViteConfig();
  
  // Install optimization dependencies
  installDependencies();
  
  // Implement code splitting
  implementCodeSplitting();
  
  // Create loading spinner component
  createLoadingSpinner();
  
  // Update package.json scripts
  updatePackageScripts();
  
  log('Build optimization complete', 'success');
}

// Run the script
main();