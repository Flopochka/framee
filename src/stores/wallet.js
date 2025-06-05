import { defineStore } from 'pinia';
import { TonConnect } from '@tonconnect/sdk';
import axios from 'axios';
import { WebApp } from '@twa-dev/sdk'; // Импортируем Telegram Web Apps SDK для совместимости

// Инициализация Telegram Web Apps SDK
try {
  WebApp.ready(); // Сообщаем Telegram, что приложение готово
  console.log('Telegram Web App инициализирован');
} catch (error) {
  console.error('Ошибка инициализации Telegram Web App:', error);
}

// Проверяем версию и инициализируем TonConnect
let tonConnect;
try {
  tonConnect = new TonConnect({
    manifestUrl: 'https://frame-stars.com/tonconnect-manifest.json'
  });
  console.log('TonConnect инициализирован, версия SDK:', TonConnect.version);
} catch (error) {
  console.error('Ошибка инициализации TonConnect:', error);
  throw new Error('Не удалось инициализировать TonConnect');
}

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: null,
    connectionError: null,
  }),
  actions: {
    // Подключение кошелька
    async connectWallet() {
      try {
        if (!tonConnect || typeof tonConnect.connectWallet !== 'function') {
          throw new Error('Метод connectWallet не найден в TonConnect. Проверьте версию @tonconnect/sdk.');
        }
        await tonConnect.connectWallet();
        this.wallet = tonConnect.wallet?.account?.address || null;
        this.connectionError = null;
        console.log('Кошелек подключен:', this.wallet);
      } catch (error) {
        console.error('Ошибка при подключении кошелька:', error);
        this.connectionError = error.message;
        throw error;
      }
    },

    // Отключение кошелька
    disconnectWallet() {
      try {
        if (!tonConnect || typeof tonConnect.disconnect !== 'function') {
          throw new Error('Метод disconnect не найден в TonConnect');
        }
        tonConnect.disconnect();
        this.wallet = null;
        this.connectionError = null;
        console.log('Кошелек отключен');
      } catch (error) {
        console.error('Ошибка при отключении кошелька:', error);
        this.connectionError = error.message;
        throw error;
      }
    },

    // Получение информации о кошельке
    fetchWalletInfo() {
      if (tonConnect.connected) {
        this.wallet = tonConnect.wallet?.account?.address || null;
        console.log('Информация о кошельке обновлена:', this.wallet);
      } else {
        this.wallet = null;
        console.log('Кошелек не подключен');
      }
    },

    // Получение состояния кошелька
    getWalletState() {
      const isConnected = !!this.wallet;
      console.log('Состояние кошелька:', isConnected);
      return isConnected;
    },

    // Отправка платежа
    async sendPayment(recipient, amount) {
      if (!this.wallet) {
        throw new Error('Кошелек не подключен. Пожалуйста, подключите кошелек сначала.');
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
        if (!tonConnect || typeof tonConnect.sendTransaction !== 'function') {
          throw new Error('Метод sendTransaction не найден в TonConnect');
        }
        const result = await tonConnect.sendTransaction(transaction);
        console.log('Платеж отправлен, boc:', result.boc);
        return result.boc;
      } catch (error) {
        console.error('Ошибка при отправке платежа:', error);
        throw error;
      }
    },

    // Проверка статуса платежа через TONX API
    async checkPaymentStatus(boc) {
      const apiKey = 'your_tonx_api_key'; // Замените на ваш реальный API-ключ (лучше хранить на бэкенде)
      const url = 'https://api.tonxapi.com/v1/tonx/transaction/GetBoCStatus';

      try {
        const response = await axios.post(url, {
          boc: boc,
          api_key: apiKey,
        });
        console.log('Статус платежа:', response.data.status);
        return response.data.status;
      } catch (error) {
        console.error('Ошибка при проверке статуса платежа:', error);
        throw error;
      }
    },
  },
});