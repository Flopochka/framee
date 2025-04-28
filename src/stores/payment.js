import { defineStore } from "pinia";
import { ref } from "vue";

export const usePaymentStore = defineStore("payment", () => {
  const src = ref(null);
  const getPaymentLink = () => src.value;
  const setPaymentLink = (e) => (src.value = e);

  return {
    getPaymentLink,
    setPaymentLink,
  };
});
