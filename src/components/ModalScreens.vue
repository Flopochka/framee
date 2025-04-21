<script setup>
import { computed } from "vue";
import { useModalStore } from "../stores/modal";
import LanguageModal from "./LanguageModal.vue";
import HistoryModal from "./HistoryModal.vue";
import WithdrawTonModal from "./WithdrawTonModal.vue";
import WithdrawStarsModal from "./WithdrawStarsModal.vue";
import StarsPopup from "./StarsPopup.vue";
import PremiumPopup from "./StarsPopup.vue"; // Проверьте, это тот же компонент?
import WalletPopup from "./StarsPopup.vue"; // Проверьте, это тот же компонент?
import ErrorPopup from "./ErrorPopup.vue";

const modalStore = useModalStore();
const { toggleModal, getActiveModal } = modalStore;

// Определяем конфигурацию модалок и попапов
const modals = [
  {
    id: "lang",
    component: LanguageModal,
    type: "modal",
    class: "lang-menu madal-screen",
  },
  {
    id: "history",
    component: HistoryModal,
    type: "modal",
    class: "user-history madal-screen",
  },
  {
    id: "withdrawton",
    type: "modal",
    component: WithdrawTonModal,
    class: "withdrawton madal-screen",
  },
  {
    id: "withdrawstars",
    type: "modal",
    component: WithdrawStarsModal,
    class: "withdrawstars madal-screen",
  },
  {
    id: "popupstars",
    type: "popup",
    component: StarsPopup,
    class: "popup",
  },
  {
    id: "popuppremium",
    type: "popup",
    component: PremiumPopup,
    class: "popup",
  },
  {
    id: "popupwalletnc",
    type: "popup",
    component: WalletPopup,
    class: "popup",
  },
  {
    id: "error",
    type: "popup",
    component: ErrorPopup,
    class: "popup",
  },
];

// Вычисляем активную модалку один раз
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
    <component :is="modal.component" />
  </div>
</template>

<style scoped></style>
