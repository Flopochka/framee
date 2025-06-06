import { defineStore } from "pinia";
import axios from "axios";
import { TonConnectUI } from '@tonconnect/ui';

// Инициализация TonConnect UI

let tonConnectUI;
try {
  tonConnectUI = new TonConnectUI({
    manifestUrl: "https://frame-stars.com/tonconnect-manifest.json",
  });
  console.log("TonConnectUI инициализирован");
} catch (error) {
  console.error("Ошибка инициализации TonConnectUI:", error);
  throw new Error("Не удалось инициализировать TonConnectUI");
}

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    wallet: null,
    connectionError: null,
  }),
  actions: {
    async newConnect(e) {
      tonConnectUI = e;
    },
    // Подключение кошелька
    async connectWallet() {
      try {
        if (!tonConnectUI) {
          throw new Error("TonConnectUI не инициализирован");
        }
        await tonConnectUI.openModal();
        this.wallet = tonConnectUI.wallet?.account?.address || null;
        this.connectionError = null;
        console.log("Кошелек подключен:", this.wallet);
      } catch (error) {
        console.error("Ошибка при подключении кошелька:", error);
        this.connectionError = error.message;
        throw error;
      }
    },

    // Отключение кошелька
    disconnectWallet() {
      try {
        if (!tonConnectUI) {
          throw new Error("TonConnectUI не инициализирован");
        }
        tonConnectUI.disconnect();
        this.wallet = null;
        this.connectionError = null;
        console.log("Кошелек отключен");
      } catch (error) {
        console.error("Ошибка при отключении кошелька:", error);
        this.connectionError = error.message;
        throw error;
      }
    },

    // Получение информации о кошельке
    fetchWalletInfo() {
      if (tonConnectUI.isConnected) {
        this.wallet = tonConnectUI.wallet?.account?.address || null;
        console.log("Информация о кошельке обновлена:", this.wallet);
      } else {
        this.wallet = null;
        console.log("Кошелек не подключен");
      }
    },

    // Получение состояния кошелька
    getWalletState() {
      console.log(tonConnectUI.conected);
      return tonConnectUI.conected;
    },

    // Отправка платежа
    async sendPayment(recipient, amount) {
      if (!this.wallet) {
        throw new Error(
          "Кошелек не подключен. Пожалуйста, подключите кошелек сначала."
        );
      }

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: recipient,
            amount: amount.toString(),
          },
        ],
      };

      try {
        const result = await tonConnectUI.sendTransaction(transaction);
        console.log("Платеж отправлен, boc:", result.boc);
        return result.boc;
      } catch (error) {
        console.error("Ошибка при отправке платежа:", error);
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
        console.log("Статус платежа:", response.data.status);
        return response.data.status;
      } catch (error) {
        console.error("Ошибка при проверке статуса платежа:", error);
        throw error;
      }
    },
  },
});
