<script setup>
import { useLanguageStore } from "../stores/language";

const { getTranslation } = useLanguageStore();
</script>

<template>
  <div class="terms-menu-body">
    <p class="text-14">{{ getTranslation("termstext") }}</p>
  </div>
</template>

<style scoped>
.terms-menu-body {
  padding: 16px;
}
</style>
