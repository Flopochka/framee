import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userName = ref(null);
  const userLogin = ref(null);
  const userPhoto = ref(null);
  const userBalance = ref(0)
  const userId = ref(null)

  const updateUser = async (name, user, photo, balance, id) => {
    userName.value = name || userName.value;
    userLogin.value = user || userLogin.value;
    userPhoto.value = photo || userPhoto.value;
    userBalance.value = balance || userBalance.value;
    userId.value = id || userId.value;
  };
  const getUserName = () => userName.value;
  const getUser = () => userLogin.value;
  const getUserPhoto = () => userPhoto.value;
  const getUserBalance = () => userBalance.value;
  const getUserId = () => userId.value;

  return {
    updateUser,
    getUserName,
    getUser,
    getUserPhoto,
    getUserBalance,
    getUserId,
  };
});
