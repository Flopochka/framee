import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useScreenStore = defineStore("screen", () => {
  const currentScreen = ref(0);
  const router = useRouter();
  const routes = ["/", "/tasks", "/about", "/profile", "/withdraw"];
  const switchScreen = async (type) => {
    currentScreen.value = type;
    router.push(routes[type]);
  };
  const getCurrentScreen = () => currentScreen.value;
  const syncWithRoute = (path) => {
    const screenMap = {
      "/": 0,
      "/tasks": 1,
      "/about": 2,
      "/profile": 3,
      "/withdraw": 4,
    };
    currentScreen.value = screenMap[path] ?? 0;
    router.push(path);
  };

  return {
    switchScreen,
    getCurrentScreen,
    syncWithRoute,
  };
});
