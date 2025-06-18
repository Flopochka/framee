import { defineStore } from "pinia";
import { TonConnectUI } from "@tonconnect/ui";

// Инициализация TonConnect UI
let tonConnectUI;
try {
  tonConnectUI = new TonConnectUI({
    manifestUrl: "https://frame-stars.com/tonconnect-manifest.json",
  });

  // Set global UI options for consistent behavior
  tonConnectUI.uiOptions = {
    actionsConfiguration: {
      modals: ["before", "success", "error"],
      notifications: ["before", "success", "error"],
      skipRedirectToWallet: "ios", // Default for iOS compatibility
      returnStrategy: "back", // Default return strategy
      twaReturnUrl: window.Telegram.WebApp.initDataUnsafe.start_param
        ? `https://t.me/${window.Telegram.WebApp.initDataUnsafe.user.username}?startapp=${window.Telegram.WebApp.initDataUnsafe.start_param}`
        : "https://t.me/framestars_bot?startapp", // Replace with your actual TMA URL
    },
  };

  console.log("[wallet] TonConnectUI инициализирован");
} catch (error) {
  console.error("[wallet] Ошибка инициализации TonConnectUI:", error);
  throw new Error("[wallet] Не удалось инициализировать TonConnectUI");
}

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    wallet: localStorage.getItem("walletAddress") || null,
    connectionError: null,
    isConnected: false, // Добавляем реактивное состояние подключения
  }),
  actions: {
    // Инициализация состояния кошелька при загрузке
    async initializeWallet() {
      try {
        if (!tonConnectUI) {
          throw new Error("[wallet] TonConnectUI не инициализирован");
        }

        // Подписываемся на изменения состояния кошелька
        tonConnectUI.onStatusChange((wallet) => {
          this.isConnected = wallet !== null;
          this.wallet = wallet?.account?.address || null;
          if (this.wallet) {
            localStorage.setItem("walletAddress", this.wallet);
          } else {
            localStorage.removeItem("walletAddress");
          }
        });

        const restored = await tonConnectUI.connectionRestored;
        this.isConnected = tonConnectUI.connected;
        console.log("[wallet] Connection status: ", this.isConnected);

        if (restored && tonConnectUI.connected) {
          this.wallet = tonConnectUI.wallet?.account?.address || null;
          if (this.wallet) {
            localStorage.setItem("walletAddress", this.wallet);
            console.log("[wallet] Connection restored. Wallet:", this.wallet);
          } else {
            localStorage.removeItem("walletAddress");
            console.log("[wallet] Connection restored but no wallet found.");
          }
        } else {
          this.wallet = null;
          localStorage.removeItem("walletAddress");
          console.log("[wallet] Connection was not restored.");
        }
        this.connectionError = null;
        tonConnectUI.uiOptions = {
          twaReturnUrl: "https://frame-stars.com",
        };
      } catch (error) {
        console.error(
          "[wallet] Ошибка при инициализации состояния кошелька:",
          error
        );
        this.connectionError = error.message;
        throw error;
      }
    },

    // Подключение кошелька
    async connectWallet() {
      try {
        if (!tonConnectUI) {
          throw new Error("[wallet] TonConnectUI не инициализирован");
        }
        await tonConnectUI.openModal();
        this.wallet = tonConnectUI.wallet?.account?.address || null;
        if (this.wallet) {
          localStorage.setItem("walletAddress", this.wallet);
          console.log("[wallet] Кошелек подключен:", this.wallet);
        }
        this.connectionError = null;
      } catch (error) {
        console.error("[wallet] Ошибка при подключении кошелька:", error);
        this.connectionError = error.message;
        throw error;
      }
    },

    // Отключение кошелька
    disconnectWallet() {
      try {
        if (!tonConnectUI) {
          throw new Error("[wallet] TonConnectUI не инициализирован");
        }
        tonConnectUI.disconnect();
        this.wallet = null;
        localStorage.removeItem("walletAddress");
        this.connectionError = null;
        console.log("[wallet] Кошелек отключен");
      } catch (error) {
        console.error("[wallet] Ошибка при отключении кошелька:", error);
        this.connectionError = error.message;
        throw error;
      }
    },

    // Получение состояния кошелька
    getWalletState() {
      console.log("[wallet] wallet state", this.isConnected);
      return this.isConnected;
    },

    // Отправка платежа
    async sendPayment(recipient, amount, message) {
      if (!this.getWalletState()) {
        throw new Error(
          "[wallet] Кошелек не подключен. Пожалуйста, подключите кошелек сначала."
        );
      }

      // Конвертируем сообщение в base64
      const messageBytes = new TextEncoder().encode(message);
      const base64Message = btoa(String.fromCharCode(...messageBytes));

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: recipient,
            amount: amount.toString(),
            payload: base64Message,
          },
        ],
      };

      try {
        const result = await tonConnectUI.sendTransaction(transaction, {
          modals: ["before", "success", "error"],
          notifications: ["before", "success", "error"],
          skipRedirectToWallet: "ios",
          returnStrategy: "back",
        });

        console.log("[wallet] Платеж отправлен:", result);
        return result;
      } catch (error) {
        console.error("[wallet] Ошибка при отправке платежа:", error);
        throw error;
      }
    },
  },
});
