<script setup>
import { useLanguageStore } from "../../stores/language";
import { useModalStore } from "../../stores/modal";
import { useUserStore } from "../../stores/user";
import { ref, watch } from "vue";
import { useHistoryStore } from "../../stores/history";
import { sendToBackend } from "../../modules/fetch";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();

const withdrawTonAmmount = ref(null);
const targetWallet = ref(null);
const valueCorrect = ref(true);
const valueIncorrects = ref([]);
const walletCorrect = ref(true);
const walletIncorrects = ref([]);


const MAX_LENGTH = 90;

watch(targetWallet, (newVal, oldVal) => {
  if (newVal && newVal.length > MAX_LENGTH) {
    targetWallet.value = newVal.slice(0, MAX_LENGTH);
  }
});

// Максимальное допустимое значение
const MAX_NUMBER = 1000000; // замените на нужное значение

// Watcher — ограничивает ввод чисел по max
watch(withdrawTonAmmount, (newVal, oldVal) => {
  if (newVal === "") return;

  // Разрешаем числа с точкой на конце (например, "1.")
  if (/^\d+\.$/.test(newVal)) return;

  const parsed = parseFloat(newVal);
  if (!isNaN(parsed) && parsed > MAX_NUMBER) {
    // Если на единицу больше max и это целое — удаляем последнюю цифру
    if (Number.isInteger(parsed) && parsed === MAX_NUMBER + 1) {
      withdrawTonAmmount.value = newVal.slice(0, -1);
    } else {
      withdrawTonAmmount.value = String(MAX_NUMBER);
    }
  }
});

const clearTON = () => {
  withdrawTonAmmount.value = null;
};

const withdraw = async () => {
  valueIncorrects.value = [];
  walletIncorrects.value = [];
  if (
    0.5 <= withdrawTonAmmount.value &&
    withdrawTonAmmount.value < 1000000 &&
    withdrawTonAmmount.value <= useUserStore().getUserBalance()
  ) {
    valueCorrect.value = true;
  } else {
    valueCorrect.value = false;
    valueIncorrects.value.push(
      0.1 > (withdrawTonAmmount.value || 0)
        ? "Min01"
        : (withdrawTonAmmount.value || 0) > 1000000
        ? "Max1000000"
        : "Notenoughbalace"
    );
  }
  if (targetWallet.value && targetWallet.value.length > 24) {
    walletCorrect.value = true;
  } else {
    walletCorrect.value = false;
    walletIncorrects.value.push("Walletincorrect");
  }
  if (valueCorrect.value && walletCorrect.value) {
    const payload = {
      user_id: useUserStore().getUserId(),
      amount:
        withdrawTonAmmount.value % 1 === 0
          ? withdrawTonAmmount.value + ".0"
          : withdrawTonAmmount.value,
      adress: targetWallet.value,
    };
    sendToBackend("/withdraw", payload)
    .then((result) => {
      toggleModal("popupwallet");
      useHistoryStore().fetchUserHistory();
    })
    .catch(() => {});
  }
};
</script>

<template>
  <div class="withdrawstars-body jcsb">
    <div class="withdraw-inputs flex-col gap-8" style="position: relative">
      <p class="pl-14 text-neutral-300 text-14">
        {{ getTranslation("amount") }}
      </p>
      <input
        type="number"
        :class="valueCorrect ? '' : 'incorrect'"
        class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
        placeholder="Min 0.5"
        min="0.5"
        max="1000000"
        v-model="withdrawTonAmmount"
      />
      <img
        v-if="withdrawTonAmmount"
        @click="clearTON()"
        class="input-clear img-32 cupo"
        style="top: 36px"
        src="../assets/img/CrossRed.svg"
        alt=""
      />
      <template v-if="valueIncorrects" v-for="e in valueIncorrects">
        <p class="pl-14 text-red text-14">{{ getTranslation(e) }}</p>
      </template>
      <span class="flex-col gap-6">
        <p class="pl-14 text-neutral-300 text-14">
          {{ getTranslation("Wallet") }}
        </p>
        <input
          type="text"
          :class="walletCorrect ? '' : 'incorrect'"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
          placeholder="UQA63stAKU17GZ80mcHctRX3DBSbm4Ks_dBwGiX9JTrIAi2"
          v-model="targetWallet"
          maxlength="90"
        />
      </span>
      <template v-if="walletIncorrects" v-for="e in walletIncorrects">
        <p class="pl-14 text-red text-14">{{ getTranslation(e) }}</p>
      </template>
      <div class="withdraw-info gap-12" v-if="withdrawTonAmmount">
        <p style="grid-area: A" class="text-16 font-400 text-white">
          {{ getTranslation("Youget") }}
        </p>
        <p class="text-24 text-white">{{ withdrawTonAmmount }} TON</p>
      </div>
    </div>
    <div
      @click="withdraw()"
      class="withdraw-btn font-600 letter-spacing-04 btn text-17 cupo usen"
    >
      {{ getTranslation("WithdrawinTON") }}
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
