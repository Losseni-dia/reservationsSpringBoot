import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Cette règle couvre désormais /api/shows, /api/users/login, /api/users/profile, etc.
      '/api': { 
        target: 'http://localhost:8080', 
        changeOrigin: true,
        secure: false 
      },
      '/uploads': { 
        target: 'http://localhost:8080', 
        changeOrigin: true 
      }
    }
  }
});