import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    ViteImageOptimizer({
      webp: { quality: 82, effort: 6 },
      png:  { quality: 85 },
      jpg:  { quality: 82 },
    }),
  ],
})
