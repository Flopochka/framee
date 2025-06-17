<script setup>
import { ref } from "vue";
import { useLanguageStore } from "../../stores/language";
import { useWalletStore } from "../../stores/wallet";
import { useModalStore } from "../../stores/modal";

const { getTranslation } = useLanguageStore();
const { connectWallet, fetchWalletInfo } = useWalletStore();
const { toggleModal } = useModalStore();
const userId = ref(window.Telegram?.WebApp?.initDataUnsafe?.user?.id);
const conList = [
  "Wallet",
  "Tonkeeper",
  "MyTonWallet",
  "Tonhub",
  "Bitget Wallet",
  "OKX Mini Wallet",
  "Binance Wallet",
  "Fintopio",
  "OKX Wallet",
  "HOT",
  "Bybit Wallet",
  "DeWallet",
  "SafePal",
  "GateWallet",
  "BitgetWeb3",
  "Tobi",
  "Bitget Wallet Lite",
  "Tomo Wallet",
  "Mirai Mini App",
  "Architec.ton",
  "TokenPocket",
  "UXUY Wallet",
];
const tryConnect = (e) => {
  connectWallet(e);
  toggleModal();
  const handleVisibilityChangeWC = () => {
    if (document.visibilityState === "visible") {
      console.log("User returned to tab");
      fetchWalletInfo();
      document.removeEventListener("visibilitychange", handleVisibilityChangeWC);
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChangeWC);
  const handleFocusWC = () => {
    console.log("Tab focused");
    fetchWalletInfo();
    window.removeEventListener("focus", handleFocusWC);
  };
  window.addEventListener("focus", handleFocusWC);
};
</script>

<template>
  <div class="user-connect-body">
    <div class="connect-box flex-col gap-8">
      <div
        @click="tryConnect(key)"
        v-for="(value, key) in conList"
        class="connect-card btn bg-blue-900 usen"
      >
        <p class="text-16 font-400 text-white-75">
          {{ getTranslation(value) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-connect-body {
}
.connect-box {
}
.connect-card {
  width: 100%;
  border: 2px solid var(--blue-900);
}
</style>
