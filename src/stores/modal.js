import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const activeModal = ref(null);
  const toggleModal = async (modalName) => {
    activeModal.value = activeModal.value === modalName ? null : modalName;
  };
  const getActiveModal = () => activeModal.value;

  return {
    toggleModal,
    activeModal,
    getActiveModal
  };
});
