import { defineStore } from "pinia";
import { ref } from "vue";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user"

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
  const connectWallet = async (e) => {
    const payload = {
      user_id: useUserStore().getUserId(),
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
        user_id: useUserStore().getUserId(),
      };
      const result = await sendToBackend("/disconnect_wallet", payload);
      fetchWalletInfo();
      console.log("Response:", result.data);
    } catch (error) {
      console.error("Failed:", error);
    }
  };
  const fetchWalletInfo = async () => {
    const retryDelays = [1000, 2000, 4000, 8000, 10000]; // 1, 2, 4, 8, 10 seconds

    const tryFetch = async () => {
      const payload = {
        user_id: useUserStore().getUserId(),
      };
      const result = await sendToBackend("/check_connect_wallet", payload);
      return result.data.data.connection;
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const connection = await tryFetch();
      IsWalletConected.value = connection;
      console.log("Initial wallet check:", connection);
      return;
    } catch (error) {
      console.error("Initial wallet check failed:", error);
    }

    // Retry logic if initial attempt fails or returns disconnected
    for (const delay of retryDelays) {
      await sleep(delay);
      try {
        const connection = await tryFetch();
        IsWalletConected.value = connection;
        console.log(`Retry after ${delay}ms:`, connection);
        if (connection) return; // Exit if connected
      } catch (error) {
        console.error(`Retry after ${delay}ms failed:`, error);
      }
    }

    // Final state after all retries
    IsWalletConected.value = false;
    console.log("All wallet connection attempts failed");
  };
  const getWalletState = () => IsWalletConected.value;
  return { connectWallet, disconnectWallet, fetchWalletInfo, getWalletState };
});
