import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __FIREBASE_API_KEY__: JSON.stringify(process.env.GOOGLE_API_KEY || ''),
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
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
