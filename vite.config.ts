import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Allow the Arena preview proxy host to reach the dev server.
      allowedHosts: true as const,
      // The browser only ever talks to this dev server; API and uploaded media
      // are proxied to the Express backend so requests stay same-origin and
      // cookies (HttpOnly, SameSite=Lax) behave exactly as they will in production.
      proxy: {
        '/api': { target: process.env.VITE_API_PROXY ?? 'http://127.0.0.1:3001', changeOrigin: false },
        '/uploads': { target: process.env.VITE_API_PROXY ?? 'http://127.0.0.1:3001', changeOrigin: false },
      },
      // HMR is disabled via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
