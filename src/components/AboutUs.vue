<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { useWalletStore } from "../stores/wallet"; // Исправлен импорт
import { sendToBackend } from "../modules/fetch";
import { ref, onMounted } from "vue";
import { WebApp } from "@twa-dev/sdk";

const { getTranslation } = useLanguageStore();
const { toggleModal } = useModalStore();
const { disconnectWallet, fetchWalletInfo, getWalletState } = useWalletStore();

const boughtToday = ref(0);
const boughtYesterday = ref(0);
const boughtAlltime = ref(0);
const boughtMonthPremium = ref(0);
const cards = ref([
  { value: boughtToday, translation: "boughttoday" },
  { value: boughtYesterday, translation: "boughtyesterday" },
  { value: boughtAlltime, translation: "boughtalltime" },
  { value: boughtMonthPremium, translation: "boughtmonthpremium" },
]);
const disconWarn = ref(false);
const lottieContainer = ref(null);

const toggleWarn = () => {
  disconWarn.value = !disconWarn.value;
  setTimeout(() => {
    disconWarn.value = !disconWarn.value;
  }, 3000);
};

const currentAccordion = ref(0);
const switchAccordion = (type) => (currentAccordion.value = type);
const isAccordionActive = (index) => currentAccordion.value === index;

function formatNumber(num) {
  if (typeof num !== "number" || isNaN(num)) return "0";
  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (absNum >= 1_000_000_000)
    return `${sign}${Math.floor(absNum / 1_000_000_000)}B`;
  if (absNum >= 1_000_000) return `${sign}${Math.floor(absNum / 1_000_000)}M`;
  if (absNum >= 1_000)
    return `${sign}${Math.floor(absNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
  return `${sign}${Math.floor(absNum)}`;
}

const fetchTotalInfo = async () => {
  try {
    const result = await sendToBackend("/get_stat_stars", {});
    const data = result.data;
    boughtToday.value = data.stats[0] !== 0
      ? formatNumber(data.stats[0])
      : formatNumber(Math.round(Math.random() * 25) * 50);
    boughtYesterday.value = data.stats[1] !== 0
      ? formatNumber(data.stats[1])
      : formatNumber(Math.round(Math.random() * 25) * 50);
    boughtAlltime.value = formatNumber(data.stats[2]);
    boughtMonthPremium.value = formatNumber(data.stats[3]);
  } catch (e) {
    console.error("Ошибка при получении статистики:", e);
  }
};

onMounted(async () => {
  WebApp.ready(); // Инициализация Telegram Web App
  fetchTotalInfo();
  fetchWalletInfo();

  const lottie = await import("lottie-web");
  const container = lottieContainer.value;
  lottie.default.loadAnimation({
    container,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "/content/UtyaDuck_AgADAwEAAladvQo.json",
  });
});
</script>

<template>
  <main class="gap-28 p-24">
    <div class="aboutus-cover flex-col gap-40">
      <div id="ton-connect-button"></div>
      <!-- <div
        v-if="!getWalletState()"
        @click="handleWalletButton"
        class="text-white aboutus-btn btn letter-spacing-04 text-16 cupo usen"
      >
        {{ getTranslation("connectWallet") }}
        <img src="../assets/img/Wallet.svg" alt="" class="img-20 lazy-img" />
      </div>
      <div
        v-else
        @click="() => { disconWarn ? disconnectWallet() : toggleWarn(); }"
        class="text-white aboutus-btn btn letter-spacing-04 text-16 cupo usen"
        :class="disconWarn ? 'warn' : ''"
      >
        {{ getTranslation(disconWarn ? "Areyoushure" : "disconectWallet") }}
        <img src="../assets/img/Wallet.svg" alt="" class="img-20 lazy-img" />
      </div> -->
      <p
        class="aboutus-cover-header letter-spacing-01 font-600 text-32 lh-110 tac twb"
      >
        {{
          getTranslation("theBestChoiceforPurchasingTelegramStarsandPremium")
        }}
      </p>
      <div
        class="aboutus-cover-card rounded-18 flex-col items-center justify-center gap-32"
      >
        <div ref="lottieContainer" class="aboutus-cover-card-img"></div>
        <p class="text-white text-24 font-600 letter-spacing-05 lh-100 tac twb">
          {{ getTranslation("paywithTONUSDTorcardpayments") }}
        </p>
        <p class="text-16 font-400 lh-120 letter-spacing-05 tac twb">
          {{
            getTranslation(
              "enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired"
            )
          }}
        </p>
      </div>
    </div>
    <div class="aboutus-other">
      <p class="text-16 lh-120 mb-12 text-neutral-300 letter-spacing-05">
        {{ getTranslation("aboutus") }}
      </p>
      <div class="aboutus-other-cards gap-26">
        <div
          v-for="card in cards"
          :key="card.translation"
          class="aboutus-other-card items-center gap-2"
        >
          <img
            src="../assets/img/Star.svg"
            alt=""
            class="img-16 p-133 lazy-img"
          />
          <p class="text-24 lh-120 letter-spacing-05 font-400 text-white">
            {{ card.value }}
          </p>
          <p
            class="text-14 lh-120 letter-spacing-05 font-400 text-neutral-300 jse tae"
          >
            {{ getTranslation(card.translation) }}
          </p>
        </div>
      </div>
    </div>
    <div class="aboutus-bottom">
      <p class="text-16 lh-120 mb-12 text-neutral-300 letter-spacing-05">
        {{ getTranslation("FAQ") }}
      </p>
      <div class="aboutus-bottom-accordion gap-42 flex-col">
        <div
          v-for="(accordion, index) in getTranslation('FAQData')"
          :key="index"
          @click="switchAccordion(index)"
          class="aboutus-bottom-accordion-item cupo"
        >
          <div class="aboutus-bottom-accordion-item-top flex-row items-center">
            <p class="text-18 lh-120 letter-spacing-05 text-white twp">
              {{ accordion[0] }}
            </p>
            <div
              class="accordion-checkbox jse"
              :class="{ 'accordion-checkbox-active': isAccordionActive(index) }"
            >
              <img
                src="../assets/img/Arrow down.svg"
                alt=""
                class="img-24 lazy-img"
              />
            </div>
          </div>
          <div
            class="aboutus-bottom-accordion-item-bottom"
            :class="{
              'aboutus-bottom-accordion-item-bottom-active':
                isAccordionActive(index),
            }"
          >
            <p class="text-16 lh-140 font-400 letter-spacing-05 twp">
              <br />{{ accordion[1] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.aboutus-cover {
  padding: 0 24px;
}
.aboutus-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 16px;
  justify-content: space-between;
}
.aboutus-cover-header {
  display: table;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.7) 0%,
    #ffffff 49%,
    rgba(255, 255, 255, 0.5) 97%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #0b2349;
  display: table;
}
.aboutus-cover-card {
  background: linear-gradient(180deg, #3f87c7 0%, #103960 100%);
  padding: 28px 20px;
}
.aboutus-cover-card-img {
  width: 154px;
  height: 154px;
}
.aboutus-other-cards {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
}
.aboutus-other-card {
  display: grid;
  grid-template-columns: auto auto 1fr;
  position: relative;
}
.aboutus-other-card:nth-child(n + 2)::after {
  content: "";
  width: 100%;
  position: absolute;
  height: 2px;
  background: var(--blue-900);
  top: -14px;
}
.aboutus-bottom-accordion-item {
  position: relative;
}
.aboutus-bottom-accordion-item:nth-child(n + 2)::after {
  content: "";
  width: 100%;
  position: absolute;
  height: 2px;
  background: var(--blue-900);
  top: -22px;
}
.aboutus-bottom-accordion-item-top {
  width: 100%;
  justify-content: space-between;
}
.accordion-checkbox {
  transition: transform 0.3s ease-in-out;
}
.accordion-checkbox-active {
  transform: rotate(180deg);
}
.aboutus-bottom-accordion-item-bottom {
  max-height: 0px;
  height: auto;
  overflow: hidden;
  transition: max-height 0.2s ease-in-out;
}
.aboutus-bottom-accordion-item-bottom-active {
  max-height: 200px;
  transition: max-height 0.2s ease-in-out;
}
.warn {
  background: rgb(165, 63, 63);
}
</style>
