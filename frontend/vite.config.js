import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Isse localhost aur network access open ho jata hai
    port: 5173,
    strictPort: true, // Agar port occupied hoga toh error dikha dega
  },
})