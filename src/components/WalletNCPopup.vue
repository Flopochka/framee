<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
</script>

<template>
  <div class="popup-img flex-row items-center justify-center">
    <img src="../assets/img/Star.svg" alt="" class="img-32 lazy-img" />
  </div>
  <div class="popup-block flex-col">
    <p class="text-16 text-white letter-spacing-2">
      {{ getTranslation("Walletnotconnected") }}
    </p>
    <p class="text-14 font-400 text-neutral-300 letter-spacing-2 lh-120">
      {{
        getTranslation(
          "PleaseconnectyourTONwalletonthemainpagetostartpurchasing"
        )
      }}
    </p>
    <div
      @click="toggleModal(null)"
      class="popup-btn letter-spacing-04 font-600 btn rounded-12"
    >
      {{ getTranslation("Close") }}
    </div>
  </div>
</template>

<style scoped></style>
