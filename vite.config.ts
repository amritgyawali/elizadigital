import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('postprocessing') || id.includes('@react-three/postprocessing'))
            return 'postprocessing';
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei'))
            return 'r3f';
          if (id.includes('node_modules/three/'))
            return 'three-core';
          if (id.includes('gsap'))
            return 'gsap';
        },
      },
    },
  },
})
