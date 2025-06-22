import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import glsl from 'vite-plugin-glsl';
import compression from 'vite-plugin-compression';
import imageOptimizer from 'vite-plugin-image-optimizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import inspect from 'vite-plugin-inspect';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isAnalyze = mode === 'analyze';
  
  return {
    plugins: [
      react({
        plugins: [
          ['@swc/plugin-styled-components', {
            displayName: true,
            ssr: false
          }]
        ]
      }),
      wasm(),
      topLevelAwait(),
      glsl(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'KONIVRER Next-Gen Platform',
          short_name: 'KONIVRER',
          description: 'State-of-the-art TCG platform with AI, blockchain, WebGPU, WebXR, and edge computing capabilities',
          theme_color: '#646cff',
          background_color: '#242424',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      }),
      isProduction && compression({
        algorithm: 'brotliCompress',
        ext: '.br'
      }),
      isProduction && compression({
        algorithm: 'gzip',
        ext: '.gz'
      }),
      isProduction && ViteImageOptimizer({
        png: {
          quality: 80,
          compressionLevel: 9
        },
        jpeg: {
          quality: 80,
          progressive: true
        },
        jpg: {
          quality: 80,
          progressive: true
        },
        webp: {
          lossless: false,
          quality: 85,
          alphaQuality: 90,
          force: false
        },
        avif: {
          lossless: false,
          quality: 85,
          alphaQuality: 90,
          force: false
        },
        gif: {
          optimizationLevel: 3
        },
        svg: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  removeTitle: false,
                  removeDesc: false
                }
              }
            },
            'removeDimensions'
          ]
        }
      }),
      isAnalyze && visualizer({
        open: true,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true
      }),
      inspect()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'ai-vendor': ['@tensorflow/tfjs', '@xenova/transformers', 'onnxruntime-web'],
            'blockchain-vendor': ['ethers', 'viem', 'wagmi', 'solana-web3.js', 'near-api-js'],
            'ui-vendor': ['framer-motion', 'gsap', 'leva'],
            'state-vendor': ['zustand', 'jotai', 'recoil', 'immer'],
            'data-vendor': ['tanstack-query', 'trpc', 'zod', 'superjson'],
            'webgpu-vendor': ['webgpu', '@webgpu/types']
          }
        }
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
        supported: {
          'top-level-await': true
        }
      },
      include: [
        'react',
        'react-dom',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        'zustand',
        'framer-motion',
        'gsap'
      ],
      exclude: [
        '@tensorflow/tfjs',
        'onnxruntime-web',
        'webgpu'
      ]
    },
    server: {
      host: '0.0.0.0',
      port: 12000,
      strictPort: true,
      cors: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      },
      hmr: {
        overlay: true
      },
      allowedHosts: 'all'
    },
    preview: {
      host: '0.0.0.0',
      port: 12000,
      strictPort: true,
      cors: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      },
      allowedHosts: 'all'
    }
  };
});