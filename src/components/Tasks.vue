<script setup>
import { useLanguageStore } from "../stores/language";

const { getTranslation } = useLanguageStore();
</script>

<template>
  <main class="gap-12 p-24">
    <p class="text-20 text-white">{{ getTranslation("tasks") }}</p>
    <div class="tasks-cards flex-col gap-8">
      <div
        v-for="i in [, , , ,]"
        class="task-card bg-blue-900 rounded-12 items-center"
      >
        <p class="text-16 text-white">
          {{ getTranslation("followinTelegram") }}
        </p>
        <div class="task-btn rounded-8 lh-22 letter-spacing-04 text-white cupo">
          {{ getTranslation("start") }}
        </div>
        <p class="text-14 text-white flex-row gap-2">
          <img src="../assets/img/Star.svg" alt="" class="img-16" />
          0.15
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.task-card {
  padding: 14px 12px;
  display: grid;
  grid-template-areas: "A B" "C B";
  gap: 6px;
}
.task-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 3px 11px;
  grid-area: B;
  width: fit-content;
  justify-self: end;
}
</style>
