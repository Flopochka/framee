<script setup>
import { computed } from "vue";
import { useModalStore } from "../stores/modal";
import { useUserStore } from "../stores/user";
import { useLanguageStore } from "../stores/language";
import BaseModal from "./BaseModal.vue";
import LanguageModal from "./LanguageModal.vue";
import HistoryModal from "./HistoryModal.vue";
import WithdrawTonModal from "./WithdrawTonModal.vue";
import WithdrawStarsModal from "./WithdrawStarsModal.vue";
import StarsPopup from "./StarsPopup.vue";
import PremiumPopup from "./StarsPopup.vue"; // Уточните, если нужен другой компонент
import WalletNCPopup from "./WalletNCPopup.vue"; // Уточните, если нужен другой компонент
import WalletPopup from "./WalletPopup.vue"; // Уточните, если нужен другой компонент
import ErrorPopup from "./ErrorPopup.vue";
import CopiedPopup from "./CopiedPopup.vue";
import FillerModal from "./FillerModal.vue";
import ConnectModal from "./ConnectModal.vue";

const modalStore = useModalStore();
const { toggleModal, getActiveModal } = modalStore;
const { getTranslation } = useLanguageStore();
const { getUserBalance } = useUserStore();

const modals = [
  {
    id: "lang",
    component: LanguageModal,
    type: "modal",
    class: "lang-menu madal-screen",
    title: "Systemlanguage",
  },
  {
    id: "history",
    component: HistoryModal,
    type: "modal",
    class: "user-history madal-screen",
    title: "History",
  },
  {
    id: "connect",
    component: ConnectModal,
    type: "modal",
    class: "user-connect madal-screen",
    title: "Connectyouwallet",
  },
  {
    id: "withdrawton",
    component: WithdrawTonModal,
    type: "modal",
    class: "withdrawton madal-screen",
    hasBalance: true, // Флаг для модалок с балансом
  },
  {
    id: "withdrawstars",
    component: WithdrawStarsModal,
    type: "modal",
    class: "withdrawstars madal-screen",
    hasBalance: true, // Флаг для модалок с балансом
  },
  {
    id: "popupstars",
    component: StarsPopup,
    type: "popup",
    class: "popup",
  },
  {
    id: "popuppremium",
    component: PremiumPopup,
    type: "popup",
    class: "popup",
  },
  {
    id: "popupwalletnc",
    component: WalletNCPopup,
    type: "popup",
    class: "popup",
  },
  {
    id: "popupwallet",
    component: WalletPopup,
    type: "popup",
    class: "popup",
  },
  {
    id: "error",
    component: ErrorPopup,
    type: "popup",
    class: "popup",
  },
  {
    id: "Copied",
    component: CopiedPopup,
    type: "popup",
    class: "popup",
  },
  {
    id: "filler",
    component: FillerModal,
    type: "modal",
    class: "filler madal-screen",
    title: "",
  },
];

const activeModal = computed(() => getActiveModal());
</script>

<template>
  <div
    v-for="modal in modals"
    :key="modal.id"
    :class="[
      modal.class,
      {
        'madal-active': modal.type === 'modal' && activeModal === modal.id,
        'popup-active': modal.type === 'popup' && activeModal === modal.id,
      },
    ]"
    @click="modal.type === 'modal' ? toggleModal(null) : null"
  >
    <BaseModal
      v-if="modal.type === 'modal' && activeModal === modal.id"
      :modal-id="modal.id"
    >
      <template #title>
        <p v-if="modal.hasBalance" class="flex-row gap-14 items-center">
          <p style="text-wrap-mode: nowrap;">{{ getTranslation("Yourbalance") }}:</p>
          <span class="lh-115 flex-row items-center">
            {{ getUserBalance() }}
            <img src="../assets/img/TONMinimal.svg" alt="TON" class="img-20 lazy-img" />
          </span>
        </p>
        <p v-else>{{ getTranslation(modal.title) }}</p>
      </template>
      <component :is="modal.component" />
    </BaseModal>
    <component v-else-if="modal.type === 'popup' && activeModal === modal.id" :is="modal.component" />
  </div>
</template>

<style scoped>
/* Стили для модалок и попапов, если нужны */
</style>