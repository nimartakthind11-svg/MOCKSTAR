import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Forward all /api/* requests to the FastAPI backend — avoids CORS in dev
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})