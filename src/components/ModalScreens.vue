<script setup>
import { computed } from "vue";
import { useModalStore } from "../stores/modal";
import { useUserStore } from "../stores/user";
import { useLanguageStore } from "../stores/language";
import BaseModal from "./BaseModal.vue";
import LanguageModal from "./modals/LanguageModal.vue";
import HistoryModal from "./modals/HistoryModal.vue";
import WithdrawTonModal from "./modals/WithdrawTonModal.vue";
import WithdrawStarsModal from "./modals/WithdrawStarsModal.vue";
import PrivacyModal from "./modals/PrivacyModal.vue";
import ConnectModal from "./modals/ConnectModal.vue";
import FillerModal from "./modals/FillerModal.vue";
import TermsModal from "./modals/TermsModal.vue";
import StarsPopup from "./popups/StarsPopup.vue";
import PremiumPopup from "./popups/StarsPopup.vue";
import WalletNCPopup from "./popups/WalletNCPopup.vue";
import WalletPopup from "./popups/WalletPopup.vue";
import ErrorPopup from "./popups/ErrorPopup.vue";
import CopiedPopup from "./popups/CopiedPopup.vue";

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
    id: "terms",
    component: TermsModal,
    type: "modal",
    class: "user-terms madal-screen",
    title: "Termsofservice",
  },
  {
    id: "privacy",
    component: PrivacyModal,
    type: "modal",
    class: "user-privacy madal-screen",
    title: "privacytitle",
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
    <BaseModal v-if="modal.type === 'modal'" :modal-id="modal.id">
      <template #title>
        <p v-if="modal.hasBalance" class="flex-row gap-14 items-center">
          <span style="text-wrap-mode: nowrap"
            >{{ getTranslation("Yourbalance") }}:</span
          >
          <span class="lh-115 flex-row items-center">
            {{ getUserBalance() }}
            <img
              src="../assets/img/TONMinimal.svg"
              alt="TON"
              class="img-20 lazy-img"
            />
          </span>
        </p>
        <p v-else>{{ getTranslation(modal.title) }}</p>
      </template>
      <component :is="modal.component" />
    </BaseModal>
    <component v-else-if="modal.type === 'popup'" :is="modal.component" />
  </div>
</template>

<style scoped>
/* Стили для модалок и попапов, если нужны */
</style>
