<script setup>
import { ref } from "vue";
import { useLanguageStore } from "../stores/language";
import { sendToBackend } from "../modules/fetch";
import { useModalStore } from "../stores/modal";

const { getTranslation } = useLanguageStore();
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

function linkTo(url, options = { tryInstantView: false, target: "_blank" }) {
  // Проверяем валидность URL
  try {
    new URL(url);
  } catch (error) {
    console.error("Invalid URL:", url, error);
    if (Telegram?.WebApp?.showAlert) {
      Telegram.WebApp.showAlert("Invalid link. Please try another.");
    } else {
      alert("Invalid link. Please try another.");
    }
    return;
  }

  // 1. Telegram Web App: используем openLink или openTelegramLink
  if (Telegram?.WebApp) {
    try {
      if (url.startsWith("https://t.me/") || url.startsWith("tg://")) {
        // Для Telegram-ссылок (например, каналы, чаты)
        Telegram.WebApp.openTelegramLink(url);
      } else {
        // Для внешних ссылок с возможностью Instant View
        Telegram.WebApp.openLink(url, {
          try_instant_view: options.tryInstantView,
        });
      }
      return;
    } catch (error) {
      console.error("Telegram Web App link error:", error);
      Telegram.WebApp.showAlert("Failed to open link. Trying alternative...");
    }
  }

  // 2. Fallback: открытие ссылки в браузере
  try {
    window.open(url, options.target, "noopener,noreferrer");
  } catch (error) {
    console.error("Failed to open link:", error);
    // Последний fallback: показываем URL для ручного копирования
    if (Telegram?.WebApp?.showAlert) {
      Telegram.WebApp.showAlert(`Please open this link manually: ${url}`);
    } else {
      prompt("Please open this link manually:", url);
    }
  }
}
const connectWallet = async (e) => {
  const payload = {
    user_id: userId.value,
    wallet: e,
  };
  try {
    const result = await sendToBackend("/generate_url", payload);
    const data = result.data.data;
    linkTo(data.url)
    toggleModal()
    console.log("Response:", result.data);
  } catch (error) {
    console.error("Failed:", error);
  }
};
</script>

<template>
  <div class="user-connect-body">
    <div class="connect-box flex-col gap-8">
      <div
        @click="connectWallet(key)"
        v-for="(value, key) in conList"
        class="connect-card btn bg-blue-900"
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
