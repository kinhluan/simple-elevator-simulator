import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/simple-elevator-simulator/',
  server: {
    port: 3000, // Custom port
    open: true, // Auto-open browser
  }
})
