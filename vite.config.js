import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function wsKeepalive(intervalMs = 10000) {
  return {
    name: 'ws-keepalive',
    apply: 'serve',
    configureServer(server) {
      server.hot.on('vite:client:connect', (_data, client) => {
        const socket = client.socket;
        if (!socket) return;
        const timer = setInterval(() => {
          if (socket.readyState === 1) {
            socket.ping();
            socket.send(JSON.stringify({ type: 'custom', event: 'keepalive' }));
          } else {
            clearInterval(timer);
          }
        }, intervalMs);
        socket.once('close', () => clearInterval(timer));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), wsKeepalive(10000)],
  resolve: {
    alias: {
      '@shared': path.resolve(import.meta.dirname, 'shared'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas') || id.includes('node_modules/html-to-image')) {
            return 'pdf-vendor';
          }
          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: [
        '**/.local/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/artifacts/**',
      ],
    },
  },
})
