<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { useUserStore } from "../stores/user";
import { ref } from "vue";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
const { getUserBalance } = useUserStore();

const withdrawTonAmmount = ref(null);
const targetWallet = ref(null);
const valueCorrect = ref(true);
const valueIncorrects = ref([]);
const walletCorrect = ref(true);
const walletIncorrects = ref([]);

const withdraw = async () => {
  valueIncorrects.value = [];
  walletIncorrects.value = [];
  if (
    100 < withdrawTonAmmount.value &&
    withdrawTonAmmount.value < 1000000 &&
    withdrawTonAmmount.value <= getUserBalance()
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
      user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
      amount:
        withdrawTonAmmount.value % 1 === 0
          ? withdrawTonAmmount.value + ".0"
          : withdrawTonAmmount.value,
      adress: targetWallet.value,
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
</script>

<template>
  <div @click.stop class="withdrawton-head madal-screen-head items-start cude">
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
    class="withdrawton-body madal-screen-body madal-screen-body-high jcsb"
  >
    <div class="withdraw-inputs flex-col gap-8">
      <p class="pl-14 text-neutral-300 text-14">
        {{ getTranslation("amount") }}
      </p>
      <input
        type="number"
        :class="valueCorrect ? '' : 'incorrect'"
        class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
        placeholder="Min 0.3"
        min="0.3"
        max="1000000"
        v-model="withdrawTonAmmount"
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
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
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
        <p class="text-14 font-400 text-white-60 jse">
          {{ getTranslation("Fee") }} 0.3 TON
        </p>
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
