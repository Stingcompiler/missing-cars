import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // This line is great for Production, keep it.
  base: command === 'build' ? '/static/' : '/',
  
  // ADD THIS SECTION
  server: {
    // This tells Vite: "If you are running, use port 5173"
    port: 5173, 
    proxy: {
      // "If the frontend asks for /api, send it to the backend on port 8000"
      // Change '/api' to whatever prefix your backend uses (e.g., '/users', '/admin')
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    manifest: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      },
    },
  },
}))