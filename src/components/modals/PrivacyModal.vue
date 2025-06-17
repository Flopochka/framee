<script setup>
import { useLanguageStore } from "../../stores/language";

const { getTranslation } = useLanguageStore();
</script>

<template>
  <div class="privacy-menu-body">
    <p class="text-14" v-html="getTranslation('privacytext')"></p>
  </div>
</template>

<style scoped>
.privacy-menu-body {
  padding: 16px;
}
</style>
