// src/stores/userStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { sendToBackend } from "../modules/fetch";

export const useWalletStore = defineStore("wallet", () => {
  const IsWalletConected = ref(false);
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
  const userId = ref(window.Telegram?.WebApp?.initDataUnsafe?.user?.id);
  const connectWallet = async (e) => {
    const payload = {
      user_id: userId.value,
      wallet: e,
    };
    try {
      const result = await sendToBackend("/generate_url", payload);
      const data = result.data.data;
      linkTo(data.url);
      fetchWalletInfo();
      console.log("Response:", result.data);
    } catch (error) {
      console.error("Failed:", error);
    }
  };
  const disconnectWallet = async () => {
    try {
      const payload = {
        user_id: userId.value,
      };
      const result = await sendToBackend("/disconnect_wallet", payload);
      fetchWalletInfo();
      console.log("Response:", result.data);
    } catch (error) {
      console.error("Failed:", error);
    }
  };
  const fetchWalletInfo = async () => {
    try {
      const payload = {
        user_id: userId.value,
      };
      const result = await sendToBackend("/check_connect_wallet", payload);
      const data = result.data.data;
      IsWalletConected.value = data.connection;
      console.log("Response:", result.data);
    } catch (error) {
      IsWalletConected.value = false
      console.error("Failed:", error);
    }
  };
  const getWalletState = () => IsWalletConected.value;
  return { connectWallet, disconnectWallet, fetchWalletInfo, getWalletState };
});
