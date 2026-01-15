import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build'
  
  return {
    plugins: [react()],
    base: isProduction ? '/freelance/' : '/', // Use /freelance/ only for production build
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  }
})
