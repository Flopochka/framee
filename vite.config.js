import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2015', // Для поддержки старых браузеров
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем вендоры на отдельные чанки
          'vue-vendor': ['vue', 'vue-router'],
          'telegram-vendor': ['@twa-dev/sdk', '@telegram-apps/analytics'],
          'ton-vendor': ['ton', 'ton-core', 'tonweb', '@tonconnect/ui'],
          'utils-vendor': ['axios', 'buffer', 'lottie-web', 'lozad']
        }
      }
    },
    // Оптимизация размера бандла
    chunkSizeWarningLimit: 1000,
    // Минификация CSS
    cssMinify: true,
    // Оптимизация изображений
    assetsInlineLimit: 4096
  },
  // Поддержка .webp и .json
  assetsInclude: ['**/*.webp', '**/*.json'],
  // Оптимизация dev сервера
  server: {
    hmr: {
      overlay: false
    }
  },
  // Оптимизация CSS
  css: {
    devSourcemap: true
  }
})
