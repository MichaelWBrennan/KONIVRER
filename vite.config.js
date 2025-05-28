import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    port: 12000,
    open: false,
    cors: true,
    allowedHosts: [
      'work-1-apevqqdrkcwquzlo.prod-runtime.all-hands.dev',
      'work-2-apevqqdrkcwquzlo.prod-runtime.all-hands.dev',
      'localhost',
      '127.0.0.1'
    ]
  },
});
