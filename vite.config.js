import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// You might need to manually set this during build or load from .env files
const localMode = process.env.REACT_APP_LOCAL === 'true';

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    __LOCAL_MODE__: localMode,
  },
  build: {
    target: 'es2018',
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: '',
        assetFileNames: 'main.css',
      },
    },
  },
});
