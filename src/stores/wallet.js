import { defineStore } from 'pinia';
import { TonConnect, toUserFriendlyAddress } from '@tonconnect/sdk';

const tonConnect = new TonConnect({
  manifestUrl: 'https://frame-stars.com/tonconnect-manifest.json'
});

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: null,
  }),
  actions: {
    async connectWallet() {
      await tonConnect.connectWallet();
      this.wallet = tonConnect.wallet?.account?.address || null;
    },
    disconnectWallet() {
      tonConnect.disconnect();
      this.wallet = null;
    },
    fetchWalletInfo() {
      if (tonConnect.connected) {
        this.wallet = tonConnect.wallet?.account?.address;
      }
    },
    getWalletState() {
      return !!this.wallet;
    }
  }
});
