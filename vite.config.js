// vite.config.js
// 🎯 Qué hace: Configura React, Tailwind v4 y la base relativa para GitHub Pages.
// 🧩 Cómo se integra: Vite lo lee al ejecutar npm run dev/build; base './' es clave para el despliegue.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Plugin oficial de Tailwind CSS v4
  ],
  css: {
    postcss: {}, // Blindaje para evitar interferencias
  },
  base: './',
})