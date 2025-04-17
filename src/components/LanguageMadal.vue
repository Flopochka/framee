<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";
import { ref, onMounted } from "vue";

const { toggleModal } = useModalStore();
const { getTranslation, switchLanguage, langs, getCurrentLanguage } =
  useLanguageStore();
const { getUserId } = useUserStore();

const userId = ref(null);
const withdrawTonAmmount = ref(null);
const history = ref([]);

// Определяем константы вне функций
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const currentYear = new Date().getFullYear();

function normalizeDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return {
    day: day,
    month: month,
    // year: year === currentYear ? 0 : year,
    year: year,
  };
}
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
