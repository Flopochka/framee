import { defineStore } from 'pinia';
import { TonConnect } from '@tonconnect/sdk';
import axios from 'axios';

const tonConnect = new TonConnect({
  manifestUrl: 'https://frame-stars.com/tonconnect-manifest.json'
});

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: null,
  }),
  actions: {
    // Подключение кошелька
    async connectWallet() {
      try {
        await tonConnect.connectWallet();
        this.wallet = tonConnect.wallet?.account?.address || null;
      } catch (error) {
        console.error("Ошибка при подключении кошелька:", error);
        throw error;
      }
    },

    // Отключение кошелька
    disconnectWallet() {
      tonConnect.disconnect();
      this.wallet = null;
    },

    // Получение информации о кошельке
    fetchWalletInfo() {
      if (tonConnect.connected) {
        this.wallet = tonConnect.wallet?.account?.address;
      }
    },

    // Получение состояния кошелька (подключен или нет)
    getWalletState() {
      return !!this.wallet;
    },

    // Отправка платежа
    async sendPayment(recipient, amount) {
      if (!this.wallet) {
        throw new Error("Кошелек не подключен. Пожалуйста, подключите кошелек сначала.");
      }

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 секунд на выполнение
        messages: [
          {
            address: recipient,
            amount: amount.toString(), // Сумма в нанотонах
          },
        ],
      };

      try {
        const result = await tonConnect.sendTransaction(transaction);
        return result.boc; // Возвращаем boc для проверки статуса
      } catch (error) {
        console.error("Ошибка при отправке платежа:", error);
        throw error;
      }
    },

    // Проверка статуса платежа через TONX API
    async checkPaymentStatus(boc) {
      const apiKey = "your_tonx_api_key"; // Замените на ваш реальный API-ключ
      const url = "https://api.tonxapi.com/v1/tonx/transaction/GetBoCStatus";

      try {
        const response = await axios.post(url, {
          boc: boc,
          api_key: apiKey,
        });

        return response.data.status; // Возвращает "broadcasted" или "confirm"
      } catch (error) {
        console.error("Ошибка при проверке статуса платежа:", error);
        throw error;
      }
    }
  }
});