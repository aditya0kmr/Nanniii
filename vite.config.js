import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Nanniii/', // GitHub Pages base path for https://aditya0kmr.github.io/Nanniii/
  build: {
    rollupOptions: {
      output: {
        manualChunks: {

          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'three-stdlib', 'postprocessing'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
