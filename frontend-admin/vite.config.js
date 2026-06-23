import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    allowedHosts: [
      'dancing-prewar-wok.ngrok-free.dev',
      '.ngrok-free.dev', // Allow all ngrok-free.dev subdomains
    ],
    proxy: {
      // Proxy for backend API
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
      // All /tripo-api/* calls are forwarded to Tripo's REST API.
      // This runs server-side, so the browser never sees the CORS preflight.
      '/tripo-api': {
        target: 'https://api.tripo3d.ai/v2/openapi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tripo-api/, ''),
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['@headlessui/react'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
});
