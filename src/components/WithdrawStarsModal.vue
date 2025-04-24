<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";
import { onMounted, ref, watch } from "vue";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
const { getUserBalance, getUser } = useUserStore();

// Переменные для withdrawstars (уже есть)
const targetUserName = ref(""); // Имя пользователя для withdrawstars
const recipientName = ref(""); // Имя найденного получателя
const recipientPhoto = ref(""); // Фото получателя
const recipient = ref(null); // Данные получателя
const recipientCorrect = ref(true); // Флаг валидности получателя
const withdrawAmount = ref(null);
const searchTimeout = ref(null);
const kef = ref(187.265917);
const valueCorrect = ref(true);

watch(targetUserName, (newValue) => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(async () => {
    if (newValue && newValue.length >= 3) {
      await searchRecipient(newValue, "stars");
    } else {
      recipient.value = null;
      recipientCorrect.value = false;
    }
  }, 300);
});

const fetchStarsPrice = async () => {
  const payload = {
    user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
    amount: 1000000,
  };
  try {
    const result = await sendToBackend("/get_price_stars", payload);
    console.log("Response:", result);
    var data = result.data.data;
    kef.value = data.count_stars / 1000000;
  } catch (error) {
    console.error("Failed:", error);
  }
};

const searchRecipient = async (username, context) => {
  console.log("Searching for:", username);
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

const buyformyself = async () => {
  targetUserName.value = getUser(); // Для withdrawstars
};

const withdraw = async () => {
  if (
    100 < (withdrawAmount.value || 0) &&
    (withdrawAmount.value || 0) < 1000000 &&
    (withdrawAmount.value || 0) <= getUserBalance()
  ) {
    valueCorrect.value = true;
  } else {
    valueCorrect.value = false;
  }
  if (await searchRecipient(targetUserName, "stars")) {
    recipientCorrect.value = true;
  } else {
    recipientCorrect.value = false;
  }
  if (valueCorrect.value && recipientCorrect.value) {
    const payload = {
      user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
      amount: Math.floor(withdrawAmount.value * kef.value),
      adress: targetUserName.value,
    };
    try {
      const result = await sendToBackend("/withdraw", payload);
      console.log("Response:", result.data);
      toggleModal("popupstars");
    } catch (error) {
      console.error("Failed:", error);
      toggleModal("Error");
    }
  }
};

onMounted(() => {
  fetchStarsPrice();
});
</script>

<template>
  <div @click.stop class="withdrawstars-head madal-screen-head items-start cude">
    <div class="madal-screen-swipka cugr"></div>
    <p class="text-20 lh-120 madal-screen-title flex-row gap-14 items-center">
      {{ getTranslation("Yourbalance") }}:
      <span class="lh-115 flex-row items-center"
        >{{ getUserBalance() }}&nbsp;<img
          src="../assets/img/TONMinimal.svg"
          alt=""
          class="img-20"
      /></span>
    </p>
    <div @click="toggleModal(null)" class="madal-screen-close cupo">
      <img src="../assets/img/Cross.svg" alt="" class="img-24" />
    </div>
  </div>
  <div
    @click.stop
    class="withdrawstars-body madal-screen-body madal-screen-body-high jcsb"
  >
    <div class="withdraw-inputs flex-col gap-8">
      <p class="pl-14 text-neutral-300 text-14">
        {{ getTranslation("amount") }}
      </p>
      <input
        type="number"
        :class="valueCorrect ? '' : 'incorrect'"
        class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
        placeholder="Min 100"
        :min="getUserBalance() > 0.3 ? 0.3 : 0"
        :max="getUserBalance() > 0.3 ? min(1000000, getUserBalance()) : 0"
        v-model="withdrawAmount"
      />
      <span
        class="with-dog flex-col gap-6"
        :class="targetUserName ? 'with-dog-inputed' : ''"
      >
        <p class="pl-14 text-neutral-300 text-14">
          {{ getTranslation("username") }}
        </p>
        <input
          type="text"
          :class="recipientCorrect ? '' : 'incorrect'"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
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
      </span>
      <div class="withdraw-info gap-12">
        <p style="grid-area: A" class="text-16 font-400 text-white">
          {{ getTranslation("Yougetfor") }} {{ withdrawAmount || 0 }} TON ≈
        </p>
        <p class="text-24 text-white">
          {{ Math.floor(withdrawAmount * kef) || 0 }} Stars
        </p>
      </div>
    </div>
    <div
      @click="withdraw()"
      class="withdraw-btn font-600 letter-spacing-04 btn text-17 cupo"
    >
      {{ getTranslation("WithdrawinStars") }}
    </div>
  </div>
</template>

<style scoped>
.withdraw-inp {
  padding: 15px 12px;
  border: 0;
  border: 2px solid #00000000;
}
.withdraw-inp:focus-visible {
  border: 2px solid var(--blue-500);
  outline: none;
}
.withdraw-info {
  display: grid;
  grid-template-areas: "A A" "B C";
}
.withdraw-btn {
  margin-top: 18px;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
}
</style>
