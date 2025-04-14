import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: [
      'chunk-XEJOVDZX.js',
      'chunk-ELHDN2IB.js'
    ]
  }
})
