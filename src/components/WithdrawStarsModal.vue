<script setup>
import { ref, watch, onMounted } from "vue";
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { useUserStore } from "../stores/user";
import { sendToBackend } from "../modules/fetch";
import { useHistoryStore } from "../stores/history";
 

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();

// Переменные для withdrawstars (уже есть)
const targetUserName = ref(""); // Имя пользователя для withdrawstars
const recipientName = ref(""); // Имя найденного получателя
const recipientPhoto = ref(""); // Фото получателя
const recipient = ref(null); // Данные получателя
const recipientCorrect = ref(true); // Флаг валидности получателя
const recipientIncorrects = ref([]);
const withdrawAmount = ref(null);
const searchTimeout = ref(null);
const kef = ref(187.265917);
const valueCorrect = ref(true);
const valueIncorrects = ref([]);

const MAX_LENGTH = 45;

// Максимальное допустимое значение
const MAX_NUMBER = 1000000; // замените на нужное значение

// Watcher — ограничивает ввод чисел по max
watch(withdrawAmount, (newVal, oldVal) => {
  if (newVal === "") return;

  // Разрешаем числа с точкой на конце (например, "1.")
  if (/^\d+\.$/.test(newVal)) return;

  const parsed = parseFloat(newVal);
  if (!isNaN(parsed) && parsed > MAX_NUMBER) {
    // Если на единицу больше max и это целое — удаляем последнюю цифру
    if (Number.isInteger(parsed) && parsed === MAX_NUMBER + 1) {
      withdrawAmount.value = newVal.slice(0, -1);
    } else {
      withdrawAmount.value = String(MAX_NUMBER);
    }
  }
});

const clearStars = () => {
  withdrawAmount.value = null;
};

watch(targetUserName, (newValue) => {
  if (newVal && newVal.length > MAX_LENGTH) {
    targetUserName.value = newVal.slice(0, MAX_LENGTH);
  }
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(async () => {
    if (newValue && newValue.length >= 3) {
      await searchRecipient(newValue);
    } else {
      recipient.value = null;
      recipientCorrect.value = false;
    }
  }, 300);
});

const fetchStarsPrice = async () => {
  const payload = {
    user_id: useUserStore().getUserId(),
    amount: 1000000,
  };
  try {
    const result = await sendToBackend("/get_price_stars", payload);
    const data = result.data;
    kef.value = data.count_stars / 1000000;
  } catch (error) {
    console.error("Failed to fetch stars price:", error);
  }
};

const searchRecipient = async (username) => {
  if (!username) return;
  const payload = { username };
  try {
    const result = await sendToBackend("/search_recipient", payload);
    const data = result.data;
    if (result.status.message !== "Пользователь не найден") {
      recipientName.value = data.name;
      recipientPhoto.value = data.photo;
      recipient.value = data.recipient;
      recipientCorrect.value = true;
    } else {
      recipient.value = null;
      recipientCorrect.value = false;
    }
  } catch (error) {
    console.error("Failed to search recipient:", error);
    recipientCorrect.value = false;
  }
};

const buyForMyself = () => {
  targetUserName.value = useUserStore().getUser();
};

const withdraw = async () => {
  valueIncorrects.value = [];
  recipientIncorrects.value = [];

  const amount = withdrawAmount.value || 0;
  if (amount >= 0.5 && amount <= 1000000 && amount <= useUserStore().getUserBalance()) {
    valueCorrect.value = true;
  } else {
    valueCorrect.value = false;
    valueIncorrects.value.push(
      amount < 0.5 ? "Min01" : amount > 1000000 ? "Max1000000" : "Notenoughbalace"
    );
  }

  await searchRecipient(targetUserName.value);
  if (!recipient.value) {
    recipientCorrect.value = false;
    recipientIncorrects.value.push("Recipientnotavalible");
  }

  if (valueCorrect.value && recipientCorrect.value) {
    
    const payload = {
      user_id: useUserStore().getUserId(),
      amount: Math.floor(withdrawAmount.value * kef.value),
      adress: targetUserName.value,
    };
    try {
      await sendToBackend("/withdraw", payload);
      toggleModal("popupstars");
      useHistoryStore().fetchUserHistory();
    } catch (error) {
      console.error("Withdraw failed:", error);
      toggleModal("Error");
    }
  }
};

onMounted(() => {
  fetchStarsPrice();
});
</script>

<template>
  <div class="withdrawstars-body jcsb">
    <div class="withdraw-inputs flex-col gap-8" style="position: relative;">
      <p class="pl-14 text-neutral-300 text-14">{{ getTranslation("amount") }}</p>
      <input
        type="number"
        :class="{ incorrect: !valueCorrect }"
        class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
        placeholder="Min 0.5"
        min="0.5"
        max="1000000"
        v-model="withdrawAmount"
      />
      <img
        v-if="withdrawAmount"
        @click="clearStars()"
        class="input-clear img-32"
        style="top: 36px"
        src="../assets/img/CrossRed.svg"
        alt=""
      />
      <p v-for="error in valueIncorrects" :key="error" class="pl-14 text-red text-14">
        {{ getTranslation(error) }}
      </p>
      <span :class="{ 'with-dog-inputed': targetUserName }" class="with-dog flex-col gap-6">
        <p class="pl-14 text-neutral-300 text-14">{{ getTranslation("username") }}</p>
        <input
          type="text"
          :class="{ incorrect: !recipientCorrect }"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
          style="padding-left: 24px"
          placeholder="username"
          v-model="targetUserName"
          maxlength="45"
        />
        <div v-if="recipient" class="input-recipient flex-row gap-16 items-center text-neutral-700">
          <p>{{ recipientName }}</p>
          <img
            class="img-32 rounded-50p"
            :src="'data:image/png;base64,' + recipientPhoto"
            alt="Recipient"
          />
        </div>
        <p class="buyformyself cupo usen" @click="buyForMyself">
          {{ getTranslation("BuyForMyself") }}
        </p>
      </span>
      <p v-for="error in recipientIncorrects" :key="error" class="pl-14 text-red text-14">
        {{ getTranslation(error) }}
      </p>
      <div class="withdraw-info gap-12">
        <p style="grid-area: A" class="text-16 font-400 text-white">
          {{ getTranslation("For") }} {{ withdrawAmount || 0 }} TON {{ getTranslation("Youget") }} ≈
        </p>
        <p class="text-24 text-white">{{ Math.floor((withdrawAmount || 0) * kef) }} Stars</p>
      </div>
    </div>
    <div
      @click="withdraw"
      class="withdraw-btn font-600 letter-spacing-04 btn text-17 cupo usen"
    >
      {{ getTranslation("WithdrawinStars") }}
    </div>
  </div>
</template>

<style scoped>
.withdrawstars-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.withdraw-inp {
  padding: 15px 12px;
  border: 2px solid transparent;
}

.withdraw-inp:focus-visible {
  border: 2px solid var(--blue-500);
  outline: none;
}

.withdraw-inp.incorrect {
  border: 2px solid var(--red);
}

.withdraw-info {
  display: grid;
  grid-template-areas: "A A" "B C";
}

.withdraw-btn {
  margin-top: 18px;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 16px;
  text-align: center;
  border-radius: 12px;
  cursor: pointer;
}
</style>