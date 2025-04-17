<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { useUserStore } from "../stores/user";
import { ref } from "vue";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
const { getUserBalance } = useUserStore();

const withdrawTonAmmount = ref(null);
const targetUserName = ref(null);

const withdraw = async () => {
  const payload = {
    user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
    amount:
      withdrawTonAmmount.value % 1 === 0
        ? withdrawTonAmmount.value + ".0"
        : withdrawTonAmmount.value,
    adress: targetUserName.value,
  };
  try {
    const result = await sendToBackend("/withdraw", payload);
    const data = result.data.data;
    referals_count.value = result.data.data.count_referrals; // Обновляем счетчик рефералов
    if (getCurrentLanguage() != data.language.slice(0, 2)) {
      switchLanguage(data.language.slice(0, 2));
    }
    console.log("Response:", result.data);
  } catch (error) {
    console.error("Failed:", error);
  }
};
</script>

<template>
  <div @click.stop class="withdrawton-head madal-screen-head">
    <div class="madal-screen-swipka"></div>
    <p class="text-20 lh-120 madal-screen-title flex-row gap-14 items-center">
      {{ getTranslation("Yourbalance") }}:
      <span class="lh-115 flex-row items-center"
        >{{ getUserBalance() }}&nbsp;<img
          src="../assets/img/TONMinimal.svg"
          alt=""
          class="img-20"
      /></span>
    </p>
    <div @click="toggleModal(null)" class="madal-screen-close">
      <img src="../assets/img/Cross.svg" alt="" class="img-24" />
    </div>
  </div>
  <div
    @click.stop
    class="withdrawton-body madal-screen-body madal-screen-body-high jcsb"
  >
    <div class="withdraw-inputs flex-col gap-8">
      <p class="pl-14 text-neutral-300 text-14">
        {{ getTranslation("Ammount") }}
      </p>
      <input
        type="number"
        class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
        placeholder="Min 0.3"
        :min="getUserBalance() > 0.3 ? 0.3 : 0"
        :max="getUserBalance() > 0.3 ? min(getUserBalance(), 1000000) : 0"
        v-model="withdrawTonAmmount"
      />
      <span
        class="with-dog flex-col gap-6"
        :class="targetUserName ? 'with-dog-inputed' : ''"
      >
        <p class="pl-14 text-neutral-300 text-14">
          {{ getTranslation("Wallet") }}
        </p>
        <input
          type="text"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
          style="padding-left: 24px"
          placeholder="UQA63stAKU17GZ80mcHctRX3DBSbm4Ks_dBwGiX9JTrIAi2"
          v-model="targetUserName"
        />
      </span>
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
      class="withdraw-btn font-600 letter-spacing-04 btn text-17"
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
