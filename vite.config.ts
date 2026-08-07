import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// The frontend calls VITE_API_BASE_URL directly (no more dev-server proxy) —
// see src/api/axiosClient.ts. The backend must allow CORS from this origin.
export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    proxy: {
      '/API': {
        target: 'http://172.16.0.151',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
})
