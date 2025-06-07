<script setup>
import tonsvg from "../assets/img/TON Network.svg";
import usdtsvg from "../assets/img/USDT.svg";
import sbpsvg from "../assets/img/SBP.webp";
import visamastercardsvg from "../assets/img/VISA & MasterCard.svg";
import { useUserStore } from "../stores/user";
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { useHistoryStore } from "../stores/history";
import { usePaymentStore } from "../stores/payment";
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useWalletStore } from "../stores/wallet";
import { sendToBackend } from "../modules/fetch";
import { getImageSrc } from "../modules/base64img.js";

const { toggleModal } = useModalStore();
const { setPaymentLink } = usePaymentStore();
const { getTranslation } = useLanguageStore();
const { getUser } = useUserStore();
const { fetchUserHistory } = useHistoryStore();
const { getWalletState, sendPayment, connectWallet } = useWalletStore();

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
const recipientIncorrects = ref([]);
const valueCorrect = ref(true);
const valueIncorrects = ref([]);
const holdDelay = ref(1000);
const minDelay = ref(50);
const speedFactor = ref(1.33);
const incrementInterval = ref(null);
const holdTimer = ref(null);
const currentAmount = ref(0);
const minCount = ref(50);
const hasTouch = ref(false);
const isRussianUser = ref(false);
const MAX_LENGTH = 45;

watch(targetUserName, (newVal, oldVal) => {
  if (newVal) {
    let cleanedVal = newVal.startsWith("@") ? newVal.slice(1) : newVal;
    if (cleanedVal.length > MAX_LENGTH) {
      cleanedVal = cleanedVal.slice(0, MAX_LENGTH);
    }
    targetUserName.value = cleanedVal;
    console.log("Очищенное имя пользователя:", cleanedVal);
  }
});

const MAX_NUMBER = 1000000;

watch(stars, (newVal, oldVal) => {
  if (newVal === "") return;
  if (/^\d+\.$/.test(newVal)) return;
  const parsed = parseFloat(newVal);
  if (!isNaN(parsed) && parsed > MAX_NUMBER) {
    if (Number.isInteger(parsed) && parsed === MAX_NUMBER + 1) {
      stars.value = newVal.slice(0, -1);
    } else {
      stars.value = String(MAX_NUMBER);
    }
  }
});

const startIncrement = (amount, event) => {
  if (event.type === "touchstart") {
    hasTouch.value = true;
  }
  if (event.type === "mousedown" && hasTouch.value) {
    return;
  }
  if (stars.value > 1000000 - amount) return;
  currentAmount.value = amount;
  stars.value += amount;
  clearInterval(incrementInterval.value);
  const runInterval = () => {
    clearInterval(incrementInterval.value);
    incrementInterval.value = setInterval(() => {
      if (stars.value <= 1000000 - amount) {
        stars.value = Number(stars.value) + Number(amount);
      } else {
        stopIncrement();
        return;
      }
      if (holdDelay.value > minDelay.value) {
        holdDelay.value = Math.max(
          minDelay.value,
          holdDelay.value / speedFactor.value
        );
        runInterval();
      }
    }, holdDelay.value);
  };
  holdTimer.value = setTimeout(runInterval, 500);
};

const stopIncrement = () => {
  clearTimeout(holdTimer.value);
  clearInterval(incrementInterval.value);
  holdDelay.value = 1000;
};

const clearStars = () => {
  stars.value = null;
};

const switchType = (type) => (currentType.value = type);
const switchPremium = (type) => (currentPremium.value = type);
const switchPayment = (type) => {
  if (type == 0) {
    minCount.value = 50;
  } else {
    minCount.value = 100;
  }
  currentPayment.value = type;
};
const switchSubmethod = (type) => (currentPaymentSub.value = type);
const isPremiumActive = (index) => currentPremium.value === index;
const isPaymentActive = (index) => currentPayment.value === index;
const isSubmethodActive = (index) => currentPaymentSub.value === index;

const premiumBox = ref(null);
const premiumBoxHeight = ref(0);
const starBox = ref(null);
const starBoxHeight = ref(0);

const searchRecipient = async (username) => {
  if (username && username != "") {
    console.log("Searching for:", username);
    const payload = { username: username };
    sendToBackend("/search_recipient", payload)
      .then((result) => {
        var data = result.data;
        if (result.status.message == "Пользователь не найден") {
          recipient.value = null;
          recipientCorrect.value = false;
        } else {
          recipientName.value = data.name;
          recipientPhoto.value = data.photo;
          recipient.value = data.recipient;
          recipientCorrect.value = true;
          console.log(
            recipientName.value,
            recipientPhoto.value,
            recipient.value,
            recipientCorrect.value
          );
        }
      })
      .catch(() => {});
  } else {
    recipient.value = null;
    recipientCorrect.value = false;
  }
};

const createorder = async () => {
  valueIncorrects.value = [];
  recipientIncorrects.value = [];
  if (!currentType.value) {
    if (stars.value >= minCount.value && stars.value <= 1000000) {
      valueCorrect.value = true;
    } else {
      valueCorrect.value = false;
      valueIncorrects.value.push(
        minCount.value > (stars.value || 0)
          ? ["Min100", minCount.value]
          : ["Max1000000", 1000000]
      );
      console.log(valueIncorrects.value[0], typeof valueIncorrects.value[0]);
    }
  }
  await searchRecipient(targetUserName.value);
  if (!recipientCorrect.value) {
    recipientIncorrects.value.push("Recipientnotavalible");
  }
  if (currentPayment.value == 0) {
    if (!getWalletState()) {
      connectWallet();
      return;
    }
  }
  starBoxHeight.value = starBox.value.offsetHeight;
  if (
    recipientCorrect.value &&
    valueCorrect.value &&
    (currentPayment.value == 0 ? getWalletState() : true)
  ) {
    const payload = {
      sender_id: useUserStore().getUserId(),
      count:
        currentType.value == 0
          ? stars.value
          : 3 * Math.pow(2, currentPremium.value),
      to_user: targetUserName.value,
      payment_method:
        currentPayment.value > 0
          ? paymentlist[currentPayment.value]
          : paymentlistanother[currentPaymentSub.value],
      payment_network:
        currentPayment.value > 0
          ? currentPayment.value == 1
            ? "USDT"
            : "CARD"
          : paymentlistanother[currentPaymentSub.value],
    };

    try {
      toggleModal("filler");
      const result = await sendToBackend("/create_order", payload);
      if (result == null) {
        toggleModal("error");
        return;
      }
      const data = result.data;
      if (currentPayment.value === 0) {
        console.log(data)
        // Handle TON payment
        const transactionResult = await sendPayment("frame-stars.ton",data.amount)
        // Send transaction result to server for verification
        const verificationPayload = {
          order_id: data.order_id,
          transaction_boc: transactionResult.boc, // Send Base64-encoded Cell
        };
        // await sendToBackend("/verify_ton_transaction", verificationPayload);
        setupTabReturnListener(data.order_id);
      } else {
        // Non-TON payment (existing behavior)
        setPaymentLink(data.payment_link || data.redirectLink);
        Telegram.WebApp.openLink(data.payment_link || data.redirectLink);
        setupTabReturnListener(data.order_id);
      }
    } catch (error) {
      console.error("Failed:", error);
      toggleModal("error");
    }
  }
};

const getorderinfo = async (order_id) => {
  console.log("Searching for:", order_id);
  const payload = { order_id: order_id };
  try {
    const result = await sendToBackend("/get_status_order", payload);
    return result.data;
  } catch (e) {
    console.error("getorderinfo failed:", e);
    throw e;
  }
};

const idkhin = async (order_id) => {
  const retryDelays = [
    1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000,
    13000, 14000, 15000,
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const status = ref(null);

  const extractStatus = (orderStatus) => {
    if (orderStatus === "Wait payment") return null;
    if (orderStatus === "Accepted") return true;
    if (orderStatus === "Expired") return false;
    return false;
  };

  try {
    const data = await getorderinfo(order_id);
    console.log(data);
    const orderStatus = data.order_status || data.status;
    status.value = extractStatus(orderStatus);
    console.log("Initial payment check:", status.value, orderStatus);
    if (status.value != null) return status.value;
  } catch (error) {
    console.error("Initial payment check failed:", error);
  }

  for (const delay of retryDelays) {
    await sleep(delay);
    try {
      const data = await getorderinfo(order_id);
      const orderStatus = data.order_status || data.status;
      status.value = extractStatus(orderStatus);
      console.log(`Retry after ${delay}ms:`, orderStatus);
      if (status.value != null) return status.value;
    } catch (error) {
      console.error(`Retry after ${delay}ms failed:`, error);
    }
  }

  status.value = false;
  console.log("All payment status checks failed");
  return status.value;
};

const fetchResult = async (order_id) => {
  toggleModal(null);
  fetchUserHistory();
  const result = await idkhin(order_id);
  if (result) {
    toggleModal(currentType.value == 0 ? "popupstars" : "popuppremium");
  } else {
    toggleModal("error");
  }
};

const setupTabReturnListener = (order_id) => {
  let isReturned = false;
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      console.log("User returned to tab");
      if (isReturned) return;
      isReturned = true;
      fetchResult(order_id);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);
  const handleFocus = () => {
    console.log("Tab focused");
    if (isReturned) return;
    isReturned = true;
    fetchResult(order_id);
    window.removeEventListener("focus", handleFocus);
  };
  window.addEventListener("focus", handleFocus);
};

const buyformyself = async () => {
  targetUserName.value = getUser();
};

const formattedRecipientName = computed(() => {
  const inputWidth = getTextWidth(targetUserName.value, "16px");
  const recipientNameWidth = getTextWidth(recipientName.value, "16px");
  const availableWidth =
    document.querySelector(".select-top-item-input-text")?.offsetWidth - 84;
  console.log(inputWidth, recipientNameWidth, availableWidth);
  if (recipientNameWidth + inputWidth > availableWidth) {
    return `${recipientName.value.slice(0, 8)}...`;
  }
  return recipientName.value;
});

const getTextWidth = (text, fontSize) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `${fontSize} Arial`;
  return context.measureText(text).width;
};

watch(targetUserName, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    targetUserNameChanged.value = Date.now();
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(async () => {
      if (newValue) {
        await searchRecipient(newValue);
      }
    }, 300);
  }
});

const updatePremiumBoxHeight = () => {
  if (premiumBox.value) {
    premiumBoxHeight.value = premiumBox.value.offsetHeight;
  }
  if (starBox.value) {
    starBoxHeight.value = starBox.value.offsetHeight;
  }
};

onMounted(async () => {
  await nextTick();
  updatePremiumBoxHeight();
});

watch(currentType, async () => {
  await nextTick();
  updatePremiumBoxHeight();
});

onMounted(() => {
  if (premiumBox.value) {
    const resizeObserver = new ResizeObserver(() => {
      updatePremiumBoxHeight();
    });
    resizeObserver.observe(premiumBox.value);
    return () => {
      resizeObserver.disconnect();
    };
  }
});

onMounted(() => {
  const RUSSIAN_TIMEZONES = [
    "Asia/Anadyr",
    "Asia/Barnaul",
    "Asia/Chita",
    "Asia/Irkutsk",
    "Asia/Kamchatka",
    "Asia/Khandyga",
    "Asia/Krasnoyarsk",
    "Asia/Magadan",
    "Asia/Novokuznetsk",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Sakhalin",
    "Asia/Srednekolymsk",
    "Asia/Tomsk",
    "Asia/Ust",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yekaterinburg",
    "Europe/Astrakhan",
    "Europe/Kaliningrad",
    "Europe/Kirov",
    "Europe/Moscow",
    "Europe/Samara",
    "Europe/Saratov",
    "Europe/Ulyanovsk",
    "Europe/Volgograd",
  ];
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  console.log('[timezone] current timezone: ',currentTimezone)
  if (RUSSIAN_TIMEZONES.includes(currentTimezone)) {
    isRussianUser.value = true
    console.log('[timezone] russian timezone')
  }
});
</script>

<template>
  <main class="gap-28 p-24">
    <div class="select-type flex-row gap-10 bg-blue-900 rounded-10 p-2 usen">
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
        <p class="pl-12 usen">{{ getTranslation("username") }}</p>
        <input
          type="text"
          :class="recipientCorrect ? '' : 'incorrect'"
          class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
          style="padding-left: 24px"
          placeholder="username"
          v-model="targetUserName"
          maxlength="45"
        />
        <div
          class="input-recipient flex-row gap-16 items-center text-neutral-700"
          v-if="recipient"
        >
          <p>{{ formattedRecipientName }}</p>
          <img
            class="img-32 rounded-50p"
            :src="getImageSrc(recipientPhoto)"
            alt=""
          />
        </div>
        <p class="buyformyself cupo usen" @click="buyformyself()">
          {{ getTranslation("BuyForMyself") }}
        </p>
      </div>
      <template v-if="recipientIncorrects" v-for="e in recipientIncorrects">
        <p class="pl-14 text-red text-14">{{ getTranslation(e) }}</p>
      </template>
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
            <p class="pl-12 usen">{{ getTranslation("amount") }}</p>
            <input
              v-model="stars"
              type="number"
              :class="valueCorrect ? '' : 'incorrect'"
              class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
              :placeholder="'Min ' + minCount"
              :min="minCount"
              max="1000000"
            />
            <img
              v-if="stars"
              @click="clearStars()"
              class="input-clear img-32 cupo"
              src="../assets/img/CrossRed.svg"
              alt=""
            />
          </div>
          <template v-if="valueIncorrects" v-for="e in valueIncorrects">
            <p class="pl-14 text-red text-14">
              <template v-if="typeof e == 'object'">{{
                getTranslation(e[0]) + e[1]
              }}</template>
              <template v-else>{{ getTranslation(e) }}</template>
            </p>
          </template>
          <div class="select-top-item select-top-stars-box">
            <div
              v-for="amount in [100, 1000, 10000]"
              :key="amount"
              @mousedown="startIncrement(amount, $event)"
              @mouseup="stopIncrement"
              @mouseleave="stopIncrement"
              @touchstart="startIncrement(amount, $event)"
              @touchend="stopIncrement"
              class="select-top-stars-card letter-spacing-04 font-600 flex-row items-center justify-center gap-4 rounded-12 text-white cupo usen"
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
              class="select-top-premium-card flex-col gap-4 rounded-12 text-white letter-spacing-04 bg-blue-900 p-12 cupo usen"
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
            v-if="index == 0 || isRussianUser"
            @click="switchPayment(index)"
            class="select-bottom-card card bg-blue-900 grid-col items-center gap-8 cupo usen"
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
            v-if="typeof payment === 'object' && payment.submethods && false"
            :class="{ 'select-botoom-subcards-active': isPaymentActive(0) }"
            class="select-botoom-subcards grid-row gap-8 usen"
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
    <p class="text-16 tac">
      {{
        getTranslation(
          "By buying Telegram Stars or Telegram Premium, you affirm compliance with and agree to"
        )
      }}
      <span class="text-16 text-blue-600 cupo" @click="toggleModal('terms')">{{
        getTranslation("our Terms")
      }}</span>
      {{ getTranslation(", and confirm that you are not U.S. resident") }}
    </p>
    <div
      @click="createorder()"
      class="bottom-button btn bg-gradient-blue flex-col cupo usen"
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
        <img src="../assets/img/StarPremium.svg" alt="" class="img-16" />
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
  background-image: url("../assets/img/Premium1.svg");
  background-color: var(--blue-900);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.select-top-premium-card:nth-of-type(2) {
  background-image: url("../assets/img/Premium2.svg");
  background-color: var(--blue-900);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.select-top-premium-card:nth-of-type(3) {
  background-image: url("../assets/img/Premium3.svg");
  background-color: var(--blue-900);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
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
