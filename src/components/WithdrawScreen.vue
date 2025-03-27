<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
</script>

<template>
  <main class="flex-col gap-28 p-24">
    <div class="withdraw-info">
      <p class="text-20 text-white">{{ getTranslation("Yourbalance") }}</p>
      <p class="text-24 text-white jse">
        10.23<img src="../assets/img/TONMinimal.svg" alt="" class="img-20" />
      </p>
      <div
        @click="toggleModal('withdrawton')"
        style="grid-area: C"
        class="withdraw-ton-btn btn text-17 text-white letter-spacing-04"
      >
        {{ getTranslation("WithdrawinTON") }}
      </div>
      <div
        @click="toggleModal('withdrawstars')"
        style="grid-area: D"
        class="withdraw-stars-btn btn"
      >
        <p class="wis text-17 letter-spacing-04">
          {{ getTranslation("WithdrawinStars") }}
        </p>
      </div>
    </div>
    <div class="referal-info flex-col">
      <p class="text-20 text-white">{{ getTranslation("YourReferals") }}</p>
      <div class="referal-cards gap-8">
        <div class="referal-card-head items-center">
          <img
            style="grid-area: A"
            src="../assets/img/TESTUserPhoto.png"
            alt=""
            class="img-44 rounded-22"
          />
          <p class="text-20 text-white">Alex Makit</p>
          <p class="text-16 text-white-60">@alexafani</p>
        </div>
        <div v-for="i in [, , , ,]" class="referal-card items-center gap-8">
          <img
            src="../assets/img/TESTReferalPhoto.png"
            alt=""
            class="img-40 rounded-20"
          />
          <p class="text-16 text-white-60">Pavel</p>
          <p class="text-16 jse">
            + 15000<img
              src="../assets/img/TONMinimal.svg"
              alt=""
              class="img-16"
            />
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.withdraw-info {
  display: grid;
  grid-template-areas: "A B" "C C" "D D";
  gap: 20px;
}
.withdraw-ton-btn {
  background: var(--but-blue-2);
}
.withdraw-stars-btn {
  background: var(--white-100);
}
.wis {
  display: table;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.referal-info {
  gap: 13px;
}
.text-16 {
}
.referal-cards {
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: 14px;
  background: var(--Surface-white-5, #ffffff0d);
  overflow: hidden;
  padding-bottom: 16px;
}
.referal-card-head {
  background: var(--Surface-white-10, #ffffff1a);
  padding: 14px 12px;
  display: grid;
  grid-template-areas: "A B" "A C";
  justify-content: start;
  gap: 12px;
}
.referal-card {
  display: grid;
  grid-template-columns: auto auto 1fr;
  padding: 0 16px;
  width: 100%;
  position: relative;
}
.referal-card:nth-child(n + 3)::after {
  content: "";
  position: absolute;
  width: 80%;
  height: 1px;
  background: var(--blue-900-60);
  left: 10%;
  top: -4px;
}
</style>
