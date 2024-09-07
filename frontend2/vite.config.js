import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to a backend server during development
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrite path if needed
      },
    },
  },
  build: {
    outDir: 'dist', // Directory to output the build files
    sourcemap: true, // Optional: generate sourcemaps for debugging
  },
});
