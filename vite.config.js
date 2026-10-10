import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { globeLifecyclePlugin, globeLifecycleOptimizer } from './build/globe-lifecycle.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [globeLifecyclePlugin(), react()],
  optimizeDeps: {
    esbuildOptions: { plugins: [globeLifecycleOptimizer()] },
  },
  resolve: {
    alias: {
      '@': root,
    },
  },
  base: process.env.BASE_PATH || '/',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
})
