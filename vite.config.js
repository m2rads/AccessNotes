import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),     
  ],
  build: {
    target: 'es2018', // Set your target if needed
    assetsInlineLimit: 0, // Inline all assets
    cssCodeSplit: false, // Disable CSS code splitting
    rollupOptions: {
      output: {
        entryFileNames: 'main.js', // Output JavaScript bundle as main.js
        chunkFileNames: '', // Disable chunk file names
        assetFileNames: 'main.css', // Output CSS bundle as main.css
      },
    },
  },
})