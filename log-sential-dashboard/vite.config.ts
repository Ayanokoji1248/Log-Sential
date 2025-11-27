import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; connect-src 'self' https://*.supabase.co"
    }
  }
})
