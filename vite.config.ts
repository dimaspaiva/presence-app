import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
    testMatch: ['*.test.tsx'],
  }
} as UserConfig)
