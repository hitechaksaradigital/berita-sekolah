import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// cPanel: hasil build (dist/) di-upload ke public_html atau folder subdomain.
// base '/' meyakinkan React Router bekerja dengan .htaccess pada domain utama.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
