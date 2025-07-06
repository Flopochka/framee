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
          'utils-vendor': ['axios', 'buffer', 'lottie-web', 'lozad']
        }
      },
      // Оптимизация для CommonJS модулей
      external: [],
      onwarn(warning, warn) {
        // Игнорируем предупреждения о циклических зависимостях
        if (warning.code === 'CIRCULAR_DEPENDENCY') return
        warn(warning)
      }
    },
    // Оптимизация размера бандла
    chunkSizeWarningLimit: 1000,
    // Минификация CSS
    cssMinify: true,
    // Оптимизация изображений
    assetsInlineLimit: 4096,
    // Оптимизация для CommonJS
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
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
  },
  // Оптимизация для CommonJS модулей
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
    exclude: ['ton', 'ton-core', 'tonweb']
  },
  // Разрешение модулей
  resolve: {
    alias: {
      // Алиасы для лучшей совместимости
      ton: 'ton/dist/index.js'
    }
  }
})
