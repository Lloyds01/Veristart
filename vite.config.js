import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://208.68.37.100',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://208.68.37.100',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
