import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  esbuild: {
    target: 'esnext'
  },
  server: {
    host: true,
    port: 5173,
    fs: {
      allow: ['..']
    }
  },
  assetsInclude: ["**/*.JPG"],
});