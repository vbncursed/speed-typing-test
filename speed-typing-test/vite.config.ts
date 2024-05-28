import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Это позволяет Vite слушать на всех сетевых интерфейсах
    port: 3000
  },
  preview: {
    host: true, // Это позволяет Vite слушать на всех сетевых интерфейсах при предпросмотре
    port: 3000
  }
})