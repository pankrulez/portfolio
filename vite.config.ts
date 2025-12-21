
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Replaces process.env.API_KEY and process.env.FORMSPREE_ID with actual values at build time.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.FORMSPREE_ID': JSON.stringify(process.env.FORMSPREE_ID || '')
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 3000
  }
});
