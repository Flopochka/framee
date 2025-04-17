<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";

const { toggleModal } = useModalStore();
const { getTranslation, switchLanguage, langs, getCurrentLanguage } =
  useLanguageStore();
</script>

<template>
  <div @click.stop class="lang-menu-head madal-screen-head">
    <div class="madal-screen-swipka"></div>
    <p class="text-20 madal-screen-title lh-120">
      {{ getTranslation("Systemlanguage") }}
    </p>
    <div @click="toggleModal(null)" class="madal-screen-close">
      <img src="../assets/img/Cross.svg" alt="" class="img-24" />
    </div>
  </div>
  <div @click.stop class="lang-menu-body madal-screen-body">
    <div class="lang-select-cards">
      <div
        v-for="(label, key) in langs"
        :key="key"
        @click="switchLanguage(key)"
        class="lang-select-card flex-row"
      >
        <p class="text-16 font-400">{{ label }}</p>
        <img
          src="../assets/img/Check.svg"
          :alt="getCurrentLanguage() === key ? 'Галочки нет' : 'Галочка'"
          class="img-24"
          :class="{ hidden: getCurrentLanguage() !== key }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.lang-select-card {
  justify-content: space-between;
  padding: 8px 6px 8px 0;
}
</style>
