import { defineStore } from "pinia";
import axios from "axios";
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
      twaReturnUrl: "https://t.me/your_tma_bot", // Replace with your actual TMA URL
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
  }),
  actions: {
    // Инициализация состояния кошелька при загрузке
    async initializeWallet() {
      try {
        if (!tonConnectUI) {
          throw new Error("[wallet] TonConnectUI не инициализирован");
        }

        // Wait for connection restoration
        const restored = await tonConnectUI.connectionRestored;
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
      console.log("[wallet] wallet state", tonConnectUI.connected);
      return tonConnectUI.connected;
    },

    // Отправка платежа
    async sendPayment(recipient, amount, extraCurrency = null) {
      if (!this.wallet) {
        throw new Error(
          "[wallet] Кошелек не подключен. Пожалуйста, подключите кошелек сначала."
        );
      }

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: recipient,
            amount: amount.toString(),
            ...(extraCurrency && { extraCurrency }), // Conditionally include extraCurrency
          },
        ],
      };

      try {
        const result = await tonConnectUI.sendTransaction(transaction, {
          modals: ["before", "success", "error"],
          notifications: ["before", "success", "error"],
          skipRedirectToWallet: "ios", // Ensure iOS compatibility
          returnStrategy: "back", // Default return strategy
        });

        console.log("[wallet] Платеж отправлен, boc:", result.boc);
        return result.boc;
      } catch (error) {
        console.error("[wallet] Ошибка при отправке платежа:", error);
        throw error;
      }
    },

    // Проверка статуса платежа через TONX API
    async checkPaymentStatus(boc) {
      const apiKey = "your_tonx_api_key"; // Замените на ваш реальный API-ключ (лучше хранить на бэкенде)
      const url = "https://api.tonxapi.com/v1/tonx/transaction/GetBoCStatus";

      try {
        const response = await axios.post(url, {
          boc: boc,
          api_key: apiKey,
        });
        console.log("[wallet] Статус платежа:", response.data.status);
        return response.data.status;
      } catch (error) {
        console.error("[wallet] Ошибка при проверке статуса платежа:", error);
        throw error;
      }
    },
  },
});
