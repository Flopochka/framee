<script setup>
import { computed } from "vue";
import tonsvg from "../assets/img/TON Network.svg";
import usdtsvg from "../assets/img/USDT.svg";
import sbpsvg from "../assets/img/SBP.svg";
import visamastercardsvg from "../assets/img/VISA & MasterCard.svg";
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { ref, onMounted, watch, nextTick } from "vue";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();

const currentType = ref(0);
const currentPremium = ref(0);
const currentPayment = ref(0);
const stars = ref(null);
const paymentsvg = ref([tonsvg, usdtsvg, sbpsvg, visamastercardsvg]);

const isPremiumSelected = computed(() => currentType.value == 1);
const switchType = (type) => (currentType.value = type);
const switchPremium = (type) => (currentPremium.value = type);
const switchPayment = (type) => (currentPayment.value = type);
const isPremiumActive = (index) => currentPremium.value === index;
const isPaymentActive = (index) => currentPayment.value === index;

const premiumBox = ref(null); // Ref для premiumBox
const premiumBoxHeight = ref(0); // Реактивная высота premiumBox

const starBox = ref(null); // Ref
const starBoxHeight = ref(0); //

// Функция для получения высоты premiumBox
const updatePremiumBoxHeight = () => {
  if (premiumBox.value) {
    premiumBoxHeight.value = premiumBox.value.offsetHeight;
  }
  if (starBox.value) {
    starBoxHeight.value = starBox.value.offsetHeight;
  }
  console.log(premiumBoxHeight.value, starBoxHeight.value)
};

// Вызываем при монтировании
onMounted(async () => {
  // Ждём, пока DOM обновится
  await nextTick();
  updatePremiumBoxHeight();
});

// Отслеживаем изменения currentType
watch(currentType, async () => {
  // Ждём, пока DOM обновится после изменения currentType
  await nextTick();
  updatePremiumBoxHeight();
});

// Отслеживаем изменения размеров premiumBox (например, при изменении содержимого)
onMounted(() => {
  if (premiumBox.value) {
    const resizeObserver = new ResizeObserver(() => {
      updatePremiumBoxHeight();
    });
    resizeObserver.observe(premiumBox.value);

    // Очищаем наблюдатель при размонтировании
    return () => {
      resizeObserver.disconnect();
    };
  }
});
</script>

<template>
  <main class="gap-28 p-24">
    <div class="select-type flex-row gap-4 bg-blue-900 rounded-10 p-2">
      <div
        @click="switchType(0)"
        class="select-type-item flex-row items-center justify-center gap-4 text-white p-6 rounded-8"
        :class="{ 'select-type-item-selected': currentType === 0 }"
      >
        {{ getTranslation("stars") }}
        <img src="../assets/img/StarGold.svg" alt="" class="img-16" />
      </div>
      <div
        @click="switchType(1)"
        class="select-type-item flex-row items-center justify-center gap-4 text-white p-6 rounded-8"
        :class="{ 'select-type-item-selected': currentType === 1 }"
      >
        {{ getTranslation("premium") }}
        <img src="../assets/img/StarPremium.svg" alt="" class="img-16" />
      </div>
    </div>
    <div class="select-top flex-col gap-16">
      <div class="select-top-item flex-col gap-6">
        <p class="pl-12">{{ getTranslation("username") }}</p>
        <input
          type="text"
          class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16"
          placeholder="@example"
        />
      </div>
      <div
        class="select-top-swith"
        :style="{
          transform: currentType === 0 ? 'translateX(0)' : 'translateX(-100vw)',
          maxHeight: currentType === 0
            ? starBoxHeight + 'px'
            : premiumBoxHeight + 'px',
            paddingBottom: currentType === 0
              ? '0px'
              : premiumBoxHeight-starBoxHeight + 'px',
        }"
      >
        <div
          class="select-top-stars flex-col gap-16"
          ref="starBox"
        >
          <div class="select-top-item flex-col gap-6">
            <p class="pl-12">{{ getTranslation("amount") }}</p>
            <input
              v-model.number="stars"
              type="number"
              class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16"
              placeholder="Min 100"
              min="100"
              max="1000000"
            />
          </div>
          <div class="select-top-item select-top-stars-box">
            <div
              @click="stars += 100"
              class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04"
            >
              +100
              <img src="../assets/img/Star.svg" alt="" class="img-16" />
            </div>
            <div
              @click="stars += 1000"
              class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04"
            >
              +1 000
              <img src="../assets/img/Star.svg" alt="" class="img-16" />
            </div>
            <div
              @click="stars += 10000"
              class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04"
            >
              +10 000
              <img src="../assets/img/Star.svg" alt="" class="img-16" />
            </div>
          </div>
        </div>
        <div class="select-top-premium flex-col gap-16" ref="premiumBox">
          <p class="pl-12 text-14 text-neutral-300">
            {{ getTranslation("subscription") }}
          </p>
          <div class="select-top-item select-top-premium-box">
            <div
              v-for="(premium, index) in getTranslation('subscriptions')"
              :key="index"
              @click="switchPremium(index)"
              class="select-top-premium-card flex-col gap-4 rounded-12 text-white letter-spacing-04 bg-blue-900 p-12"
              :class="{
                'select-top-premium-card-active': isPremiumActive(index),
              }"
            >
              <div
                class="custom-radio"
                :class="{ 'custom-radio-active': isPremiumActive(index) }"
              ></div>
              <p class="text-16">{{ premium }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="select-bottomm flex-col gap-4">
      <p class="pl-12">{{ getTranslation("payment") }}</p>
      <div class="select-botoom-cards grid-row gap-8">
        <div
          v-for="(payment, index) in getTranslation('paymentmetdods')"
          :key="index"
          @click="switchPayment(index)"
          class="select-bottom-card card bg-blue-900 grid-col items-center gap-8"
          :class="{ 'select-bottom-card-active': isPaymentActive(index) }"
        >
          <div
            class="custom-radio"
            :class="{ 'custom-radio-active': isPaymentActive(index) }"
          ></div>
          <p class="text-16 text-white">{{ payment }}</p>
          <img :src="paymentsvg[index]" alt="" class="img-28" />
        </div>
      </div>
    </div>
    <div
      @click="
        currentType ? toggleModal('popuppremium') : toggleModal('popupstars')
      "
      class="bottom-button btn bg-gradient-blue flex-col"
    >
      <div
        class="bottom-button-stars flex-row gap-4 items-center justify-center"
        :style="{ maxHeight: currentType === 0 ? '18px' : '0' }"
      >
        <img src="../assets/img/StarGold.svg" alt="" class="img-16" />
        <p class="text-17 font-geist font-600 letter-spacing-04 text-white">
          {{ getTranslation("buy") }} {{ stars ? stars : 100 }}
        </p>
        <img src="../assets/img/StarGold.svg" alt="" class="img-16" />
      </div>
      <div
        class="bottom-button-prem flex-row gap-4 items-center justify-center"
        :style="{ maxHeight: currentType === 1 ? '18px' : '0' }"
      >
        <p class="text-17 font-geist font-600 letter-spacing-04 text-white">
          {{ getTranslation("buyPremium") }}
        </p>
        <img src="../assets/img/StarPremium.svg" alt="" class="img-16" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  display: grid;
  grid-template-rows: repeat(3, auto) 1fr;
  align-items: end;
}
.select-type {
  width: 100%;
  padding: 2px;
}
.select-type-item {
  width: 100%;
  padding: 6px;
}
.select-type-item-selected {
  background: var(--blue-500);
}
.select-type-item-img {
  height: 16px;
}
.select-top {
  width: 100%;
  max-width: 100vw;
}
.select-top-swith {
  position: relative;
  transition: transform 0.3s ease-in-out, max-height 0.3s ease-in-out, padding-bottom 0.3s ease-in-out;
}
.select-top-item {
  gap: 6px;
}
.select-top-item-input-text {
  padding: 15px 12px;
  border: 0;
  border: 2px solid #00000000;
}
.select-top-item-input-text:focus-visible {
  border: 2px solid var(--blue-500);
  outline: none;
}
.select-top-stars {
  transition: max-height 0.3s;
  height: fit-content;
}
.select-top-stars-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  transition: height 1s;
}
.select-top-stars-card {
  width: 100%;
  background: linear-gradient(
    129.45deg,
    var(--blue-400) 9.38%,
    var(--but-blue-1) 117.65%
  );
  padding: 7px 12px;
  box-shadow: 0px 2px 6px 0px var(--shadow-25);
  letter-spacing: -0.4px;
  line-height: 22px;
}
.select-top-premium {
  position: absolute;
  top: 0;
  left: 100vw;
  width: 100%;
  height: auto;
  transition: max-height 0.3s;
}
.select-top-premium-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.select-top-premium-card {
  width: 100%;
  aspect-ratio: 1 / 1;
  box-shadow: 0px 2px 6px 0px var(--shadow-25);
  letter-spacing: -0.4px;
  line-height: 22px;
  justify-content: space-between;
}
.select-top-premium-card:nth-of-type(1) {
  background: url("../assets/img/Premium1.svg") no-repeat center,
    var(--blue-900);
  background-size: cover;
}
.select-top-premium-card:nth-of-type(2) {
  background: url("../assets/img/Premium2.svg") no-repeat center,
    var(--blue-900);
  background-size: cover;
}
.select-top-premium-card:nth-of-type(3) {
  background: url("../assets/img/Premium3.svg") no-repeat center,
    var(--blue-900);
  background-size: cover;
}
.select-top-premium-card-active {
  border: 2px solid var(--System-azure-700-80, #007affcc);
}
.select-botoom-cards {
  grid-template-rows: repeat(4, 1fr);
}
.select-bottom-card {
  width: 100%;
  grid-template-columns: auto auto 1fr;
  justify-items: end;
}
.select-bottom-card-active {
  border: 2px solid var(--System-azure-700-80, #007affcc);
}
.bottom-button {
  width: 100%;
  gap: 0;
}
.bottom-button-stars {
  overflow: hidden;
  transition: max-height 0.3s;
}
.bottom-button-prem {
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.3s;
}
</style>
