import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
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
})
