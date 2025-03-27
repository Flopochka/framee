import { defineStore } from "pinia";
import { ref } from "vue";

export const useScreenStore = defineStore("screen", () => {
  const currentScreen = ref(0);
  const switchScreen = async (type) => {
    currentScreen.value = type;
  };
  const getCurrentScreen = () => currentScreen.value;

  return {
    currentScreen,
    switchScreen,
    getCurrentScreen,
  };
});
