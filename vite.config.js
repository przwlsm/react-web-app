import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5173 (Vite's default) is often taken by another project on this machine.
  server: { port: 5180 },
  preview: { port: 5180 },
})
