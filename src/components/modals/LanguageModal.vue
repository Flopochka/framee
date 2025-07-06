<script setup>
import { useLanguageStore } from '../../stores/language'

const { switchLanguage, langs, getCurrentLanguage } = useLanguageStore()
</script>

<template>
  <div class="lang-menu-body">
    <div class="lang-select-cards">
      <div
        v-for="(label, key) in langs"
        :key="key"
        @click="switchLanguage(key)"
        class="lang-select-card flex-row cupo usen"
      >
        <p class="text-16 font-400 lh-100">{{ label }}</p>
        <img
          src="../../assets/img/Check.svg"
          :alt="getCurrentLanguage() === key ? 'Selected' : 'Not selected'"
          class="img-24"
          :class="{ hidden: getCurrentLanguage() !== key }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.lang-menu-body {
  padding: 16px;
}

.lang-select-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lang-select-card {
  justify-content: space-between;
  padding: 8px 6px 8px 0;
  cursor: pointer;
}

.hidden {
  visibility: hidden;
}
</style>
