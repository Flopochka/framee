<script setup>
import { computed } from "vue";
import tonsvg from "../assets/img/TON Network.svg";
import usdtsvg from "../assets/img/USDT.svg";
import sbpsvg from "../assets/img/SBP.webp";
import visamastercardsvg from "../assets/img/VISA & MasterCard.svg";
import { useUserStore } from "../stores/user";
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { ref, onMounted, watch, nextTick } from "vue";
import { sendToBackend } from "../modules/fetch";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
const { getUser } = useUserStore();

const targetUserName = ref(null);
const targetUserNameChanged = ref(0);
const currentType = ref(0);
const currentPremium = ref(0);
const currentPayment = ref(0);
const currentPaymentSub = ref(0);
const stars = ref(null);
const paymentlist = ["TON", "USDT", "SBP", "VM"];
const paymentlistanother = ["TON", "PUNK", "GLITCH"];
const paymentsvg = ref([tonsvg, usdtsvg, sbpsvg, visamastercardsvg]);
const recipientName = ref(null);
const recipientPhoto = ref(null);
const recipient = ref(null);
const recipientCorrect = ref(true);
const valueCorrect = ref(true);
const holdDelay = ref(1000);
const minDelay = ref(50);
const speedFactor = ref(1.33);
const incrementInterval = ref(null);
const holdTimer = ref(null);
const currentAmount = ref(0);

const startIncrement = (amount) => {
  if (stars.value > 1000000 - amount) return;

  currentAmount.value = amount;
  stars.value += amount; // Мгновенное первое увеличение

  // Очищаем предыдущий интервал, если он есть
  clearInterval(incrementInterval.value);

  // Функция для запуска и обновления интервала
  const runInterval = () => {
    clearInterval(incrementInterval.value); // Очищаем текущий интервал
    incrementInterval.value = setInterval(() => {
      if (stars.value <= 1000000 - amount) {
        stars.value += amount;
      } else {
        stopIncrement();
        return;
      }

      // Уменьшаем задержку
      if (holdDelay.value > minDelay.value) {
        holdDelay.value = Math.max(
          minDelay.value,
          holdDelay.value / speedFactor.value
        );
        // Перезапускаем интервал с новой задержкой
        runInterval();
      }
    }, holdDelay.value);
  };

  // Запускаем таймер для начала автоинкремента
  holdTimer.value = setTimeout(runInterval, 500); // Задержка перед началом автоинкремента
};

const stopIncrement = () => {
  clearTimeout(holdTimer.value);
  clearInterval(incrementInterval.value);
  holdDelay.value = 1000; // Сбрасываем задержку до начальной
};

const switchType = (type) => (currentType.value = type);
const switchPremium = (type) => (currentPremium.value = type);
const switchPayment = (type) => (currentPayment.value = type);
const switchSubmethod = (type) => (currentPaymentSub.value = type);
const isPremiumActive = (index) => currentPremium.value === index;
const isPaymentActive = (index) => currentPayment.value === index;
const isSubmethodActive = (index) => currentPaymentSub.value === index;

const premiumBox = ref(null); // Ref для premiumBox
const premiumBoxHeight = ref(0); // Реактивная высота premiumBox

const starBox = ref(null); // Ref
const starBoxHeight = ref(0); //

const searchRecipient = async (username) => {
  console.log("Searching for:", username); // Заглушка
  const payload = { username: username };
  try {
    const result = await sendToBackend("/search_recipient", payload);
    console.log("Response:", result);
    var data = result.data.data;
    if (result.data.status.message != "Пользователь не найден") {
      recipientName.value = data.name;
      recipientPhoto.value = data.photo;
      recipient.value = data.recipient;
      recipientCorrect.value = true;
    } else {
      recipient.value = null;
      recipientCorrect.value = false;
    }
  } catch (error) {
    console.error("Failed:", error);
  }
};

const createorder = async () => {
  if (
    !(currentType.value == 0 && (stars.value < 100 || stars.value > 1000000))
  ) {
    valueCorrect.value = true;
  } else {
    valueCorrect.value = false;
  }
  if ((await searchRecipient(targetUserName)) && targetUserName) {
    recipientCorrect.value = true;
  } else {
    recipientCorrect.value = false;
  }
  if (recipientCorrect.value && valueCorrect.value) {
    const payload = {
      sender_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
      count:
        currentType.value == 0
          ? stars.value
          : 3 * Math.pow(2, currentPremium.value),
      to_user: targetUserName.value,
      payment_method: paymentlistanother[currentPaymentSub.value],
      payment_network: paymentlist[currentPayment.value],
    };
    console.log(payload);
    try {
      const result = await sendToBackend("/create_order", payload);
      console.log("Response:", result);
      var data = result.data.data;
      window.Telegram.WebApp.openLink(data.payment_link);
      toggleModal(currentType.value == 0 ? "popupstars" : "popuppremium");
      setTimeout(getorderinfo(data.order_id), 1000);
    } catch (error) {
      console.error("Failed:", error);
      toggleModal("Error");
    }
  }
};

const getorderinfo = async (order_id) => {
  console.log("Searching for:", order_id); // Заглушка
  const payload = { order_id: order_id };
  try {
    const result = await sendToBackend("/get_status_order", payload);
    console.log("Response:", result);
  } catch (error) {
    console.error("Failed:", error);
  }
};

const buyformyself = async () => {
  targetUserName.value = getUser();
};

watch(targetUserName, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    targetUserNameChanged.value = Date.now(); // Записываем время изменения

    // Debounce: ждём 300 мс перед запросом
    clearTimeout(window.searchTimeout); // Очищаем предыдущий таймер
    window.searchTimeout = setTimeout(async () => {
      if (newValue) {
        // Проверяем, что значение не пустое
        await searchRecipient(newValue);
      }
    }, 300);
  }
});

// Функция для получения высоты premiumBox
const updatePremiumBoxHeight = () => {
  if (premiumBox.value) {
    premiumBoxHeight.value = premiumBox.value.offsetHeight;
  }
  if (starBox.value) {
    starBoxHeight.value = starBox.value.offsetHeight;
  }
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
    <div class="select-type flex-row gap-10 bg-blue-900 rounded-10 p-2">
      <div
        @click="switchType(0)"
        class="select-type-item letter-spacing-04 flex-row items-center justify-center gap-4 text-white p-6 rounded-8 cupo"
        :class="{ 'select-type-item-selected': currentType === 0 }"
      >
        {{ getTranslation("stars") }}
        <img src="../assets/img/StarGold.svg" alt="" class="img-16" />
      </div>
      <div
        @click="switchType(1)"
        class="select-type-item letter-spacing-04 flex-row items-center justify-center gap-4 text-white p-6 rounded-8 cupo"
        :class="{ 'select-type-item-selected': currentType === 1 }"
      >
        {{ getTranslation("premium") }}
        <img src="../assets/img/StarPremium.svg" alt="" class="img-16" />
      </div>
    </div>
    <div class="select-top flex-col gap-16">
      <div
        :class="targetUserName ? 'with-dog-inputed' : ''"
        class="select-top-item with-dog flex-col gap-6"
      >
        <p class="pl-12">{{ getTranslation("username") }}</p>
        <input
          type="text"
          :class="recipientCorrect ? '' : 'incorrect'"
          class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16"
          style="padding-left: 24px"
          placeholder="username"
          v-model="targetUserName"
          maxlength="45"
        />
        <div
          class="input-recipient flex-row gap-16 items-center text-neutral-700"
          v-if="recipient"
        >
          <p>{{ recipientName }}</p>
          <img
            class="img-32 rounded-50p"
            :src="'data:image/png;base64,' + recipientPhoto"
            alt=""
          />
        </div>
        <p class="buyformyself cupo" @click="buyformyself()">
          {{ getTranslation("BuyForMyself") }}
        </p>
      </div>
      <div
        class="select-top-swith"
        :style="{
          transform: currentType === 0 ? 'translateX(0)' : 'translateX(-100vw)',
          maxHeight:
            currentType === 0 ? starBoxHeight + 'px' : premiumBoxHeight + 'px',
          paddingBottom:
            currentType === 0 ? '0px' : premiumBoxHeight - starBoxHeight + 'px',
        }"
      >
        <div class="select-top-stars flex-col gap-16" ref="starBox">
          <div class="select-top-item flex-col gap-6">
            <p class="pl-12">{{ getTranslation("amount") }}</p>
            <input
              v-model.number="stars"
              type="number"
              :class="valueCorrect ? '' : 'incorrect'"
              class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16"
              placeholder="Min 100"
              min="100"
              max="1000000"
            />
          </div>
          <div class="select-top-item select-top-stars-box">
            <div
              v-for="amount in [100, 1000, 10000]"
              :key="amount"
              @mousedown="startIncrement(amount)"
              @mouseup="stopIncrement"
              @mouseleave="stopIncrement"
              @touchstart="startIncrement(amount)"
              @touchend="stopIncrement"
              class="select-top-stars-card letter-spacing-04 font-600 flex-row items-center justify-center gap-4 rounded-12 text-white cupo"
            >
              +{{ amount.toLocaleString() }}
              <img src="../assets/img/Star.svg" alt="" class="img-16" />
            </div>
          </div>
        </div>
        <div class="select-top-premium flex-col gap-6" ref="premiumBox">
          <p class="pl-12 text-14 text-neutral-300">
            {{ getTranslation("subscription") }}
          </p>
          <div class="select-top-item select-top-premium-box">
            <div
              v-for="(premium, index) in getTranslation('subscriptions')"
              :key="index"
              @click="switchPremium(index)"
              class="select-top-premium-card flex-col gap-4 rounded-12 text-white letter-spacing-04 bg-blue-900 p-12 cupo"
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
      <p class="pl-12 text-white-70">{{ getTranslation("payment") }}</p>

      <div class="select-botoom-cards grid-row gap-8">
        <template
          v-for="(payment, index) in getTranslation('paymentmetdods')"
          :key="index"
        >
          <div
            @click="switchPayment(index)"
            class="select-bottom-card card bg-blue-900 grid-col items-center gap-8 cupo"
            :class="{ 'select-bottom-card-active': isPaymentActive(index) }"
          >
            <div
              class="custom-radio"
              :class="{ 'custom-radio-active': isPaymentActive(index) }"
            ></div>
            <p class="text-16 font-400 text-white-75">
              {{ typeof payment === "object" ? payment.name : payment }}
            </p>
            <img :src="paymentsvg[index]" alt="" class="img-28" />
          </div>
          <div
            v-if="typeof payment === 'object' && payment.submethods"
            :class="{ 'select-botoom-subcards-active': isPaymentActive(0) }"
            class="select-botoom-subcards grid-row gap-8"
          >
            <div
              v-for="(submethod, subIndex) in payment.submethods"
              :key="subIndex"
              @click="switchSubmethod(subIndex)"
              class="select-bottom-subcard card bg-white-10 grid-col items-center gap-8 cupo tac"
              :class="{
                'select-bottom-subcard-active': isSubmethodActive(subIndex),
              }"
            >
              <p class="text-16 font-400 text-white-75">{{ submethod }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      @click="createorder()"
      class="bottom-button btn bg-gradient-blue flex-col cupo"
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
  transition: transform 0.3s ease-in-out, max-height 0.3s ease-in-out,
    padding-bottom 0.3s ease-in-out;
}
.select-top-item {
  gap: 6px;
  position: relative;
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
  border: 2px solid var(--blue-900);
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
.select-botoom-subcards {
  grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
  transition: max-height 0.2s, display 0s 0.2s;
  max-height: 0px;
  overflow-y: hidden;
  display: none;
}
.select-botoom-subcards-active {
  max-height: 200px;
  display: grid;
}
.select-bottom-subcard {
  transition: background 0.2s;
}
.select-bottom-subcard-active {
  background: var(--white-100);
  color: var(--blue-500);
}
.select-bottom-subcard-active p {
  color: var(--blue-500);
}
.select-bottom-card {
  width: 100%;
  grid-template-columns: auto auto 1fr;
  justify-items: end;
  border: 2px solid var(--blue-900);
}
.select-bottom-card-active {
  border: 2px solid var(--System-azure-700-80, #007affcc);
}
.select-bottom-card-active p {
  font-weight: 500;
  color: var(--white-100);
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
@media (max-width: 350px) {
  .select-top-stars-card {
    flex-direction: column-reverse;
  }
}
@media (max-width: 375px) {
  .select-top-premium-card p {
    line-height: 115%;
  }
}
</style>
