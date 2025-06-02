import { TonConnect, toUserFriendlyAddress } from '@tonconnect/sdk';

export const tonConnect = new TonConnect({
  manifestUrl: 'https://your-server.com/tonconnect-manifest.json' // замени на свой
});

export async function connectWallet() {
  await tonConnect.connectWallet();
}

export async function disconnectWallet() {
  tonConnect.disconnect();
}

export function getWalletInfo() {
  const wallet = tonConnect.wallet;
  if (!wallet) return null;
  return {
    address: toUserFriendlyAddress(wallet.account.address, true),
    network: wallet.account.chain,
    walletApp: wallet.device.appName
  };
}

export async function sendTransaction({ to, amountTon, stateInit, payload }) {
  if (!tonConnect.connected) throw new Error('Кошелёк не подключен');

  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
      {
        address: to,
        amount: (amountTon * 1e9).toString(), // в нанотонах
        payload,
        stateInit
      }
    ]
  };

  await tonConnect.sendTransaction(tx);
}
