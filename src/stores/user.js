import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userName = ref(null);
  const userLogin = ref(null);
  const userPhoto = ref(null);
  const userBalance = ref(0);
  const userId = ref(window.Telegram?.WebApp?.initDataUnsafe?.user?.id);
  // const userId = ref(227363776);
  const isLoading = ref(false); // Для отслеживания загрузки

  // Инициализация: загрузка данных из localStorage
  const initialize = () => {
    const cachedData = localStorage.getItem("userStore");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        userName.value = parsed.userName ?? null;
        userLogin.value = parsed.userLogin ?? null;
        userPhoto.value = parsed.userPhoto ?? null;
        userBalance.value = parsed.userBalance ?? 0;
        console.log("Loaded cached user data:", parsed);
      } catch (error) {
        console.error("Failed to parse cached user data:", error);
      }
    }
  };

  // Обновление данных пользователя
  const updateUser = async (name, user, photo, balance, id) => {
    isLoading.value = true;
    try {
      userName.value = name || userName.value;
      userLogin.value = user || userLogin.value;
      userPhoto.value = photo || userPhoto.value;
      userBalance.value = balance || userBalance.value;
      userId.value = id || userId.value;

      // Сохранение в localStorage
      const dataToCache = {
        userName: userName.value,
        userLogin: userLogin.value,
        userPhoto: userPhoto.value,
        userBalance: userBalance.value,
        userId: userId.value,
      };
      localStorage.setItem("userStore", JSON.stringify(dataToCache));
      console.log("Updated and cached user data:", dataToCache);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Геттеры
  const getUserName = () => userName.value;
  const getUser = () => userLogin.value;
  const getUserPhoto = () => userPhoto.value;
  const getUserBalance = () => userBalance.value;
  const getUserId = () => userId.value;

  // Вызываем инициализацию сразу
  initialize();

  return {
    updateUser,
    getUserName,
    getUser,
    getUserPhoto,
    getUserBalance,
    getUserId,
    isLoading, // Для UI
  };
});
