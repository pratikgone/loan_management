import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      './adminpages/Signup': '/src/adminpages/Signup.jsx'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://loan-backend-cv1k.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    rollupOptions: {
      external: []
    }
  }
})
