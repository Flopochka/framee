import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2015' // Для поддержки старых браузеров
  },
  assetsInclude: ['**/*.webp', '**/*.json'] // Поддержка .webp и .json
});