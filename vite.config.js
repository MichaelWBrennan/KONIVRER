import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize React for production
      jsxRuntime: 'automatic',
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    cssCodeSplit: true,
    assetsDir: 'assets',
    minify: 'terser',
    target: ['es2022', 'chrome91', 'firefox90', 'safari15'], // Ultra-modern browsers only
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3, // More passes for maximum compression
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        dead_code: true,
        collapse_vars: true,
        reduce_vars: true,
        hoist_funs: true,
        hoist_vars: true,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
        ecma: 2022,
      },
      ecma: 2022,
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500, // Stricter warning limit
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More granular code splitting
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('@dnd-kit')) {
              return 'dnd';
            }
            if (id.includes('axios')) {
              return 'http';
            }
            return 'vendor';
          }
          // Split by feature/page
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('/')[0];
            return `page-${pageName}`;
          }
          if (id.includes('/components/')) {
            return 'components';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      external: [], // Don't externalize anything for better bundling
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    reportCompressedSize: false, // Faster builds
    assetsInlineLimit: 4096, // Inline small assets
  },
  esbuild: {
    target: 'es2022',
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@data': path.resolve(__dirname, './src/data'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 12000,
    open: false,
    cors: true,
    allowedHosts: [
      'work-1-yxjvidvyzjtfdnks.prod-runtime.all-hands.dev',
      'work-2-yxjvidvyzjtfdnks.prod-runtime.all-hands.dev',
      'work-1-uqjylmppmftqniux.prod-runtime.all-hands.dev',
      'work-2-uqjylmppmftqniux.prod-runtime.all-hands.dev',
      'work-1-guqzfyqfzkivdmon.prod-runtime.all-hands.dev',
      'work-2-guqzfyqfzkivdmon.prod-runtime.all-hands.dev',
      'work-1-ksbqqolzfuevfyxu.prod-runtime.all-hands.dev',
      'work-2-ksbqqolzfuevfyxu.prod-runtime.all-hands.dev',
      'work-1-kuvjjrfmovharowh.prod-runtime.all-hands.dev',
      'work-2-kuvjjrfmovharowh.prod-runtime.all-hands.dev',
      'work-1-boxcmpdvhkyxeisg.prod-runtime.all-hands.dev',
      'work-2-boxcmpdvhkyxeisg.prod-runtime.all-hands.dev',
      'work-1-gobalavagfmfizdh.prod-runtime.all-hands.dev',
      'work-2-gobalavagfmfizdh.prod-runtime.all-hands.dev',
      'work-1-jayaxwuhdxtmrikg.prod-runtime.all-hands.dev',
      'work-2-jayaxwuhdxtmrikg.prod-runtime.all-hands.dev',
      'work-1-rilpcjvkehxujmwd.prod-runtime.all-hands.dev',
      'work-2-rilpcjvkehxujmwd.prod-runtime.all-hands.dev',
      'work-1-sasrceqnuwjcbjvx.prod-runtime.all-hands.dev',
      'work-2-sasrceqnuwjcbjvx.prod-runtime.all-hands.dev',
      'localhost',
      '127.0.0.1'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 12001,
    cors: true,
  },
});
