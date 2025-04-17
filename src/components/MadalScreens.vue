<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";
import { ref, onMounted, watch } from "vue";
import StarGold from "../assets/img/StarGold.svg";
import StarPremium from "../assets/img/StarPremium.svg";
import TONMinimal from "../assets/img/TONMinimal.svg";
import LanguageMadal from "./LanguageMadal.vue";
import HistoryModal from "./HistoryModal.vue";
import WithdrawTonModal from "./WithdrawTonModal.vue";
import WithdrawStarsModal from "./WithdrawStarsModal.vue";
import StarsPopup from "./StarsPopup.vue";

const { toggleModal, getActiveModal } = useModalStore();
const { getTranslation, switchLanguage, langs, getCurrentLanguage } =
  useLanguageStore();
const { getUserBalance, getUserId, getUser } = useUserStore();

const userId = ref(null);
const withdrawTonAmmount = ref(null);

// Переменные для withdrawstars (уже есть)
const targetUserName = ref(""); // Имя пользователя для withdrawstars
const recipientName = ref(""); // Имя найденного получателя
const recipientPhoto = ref(""); // Фото получателя
const recipient = ref(null); // Данные получателя
const recipientCorrect = ref(false); // Флаг валидности получателя
const targetUserNameChanged = ref(0); // Время изменения имени

// Новые переменные для withdrawton
const targetUserNameTon = ref(""); // Имя пользователя для withdrawton

const searchTimeout = ref(null);

watch(targetUserName, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    targetUserNameChanged.value = Date.now();
    clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(async () => {
      if (newValue) {
        await searchRecipient(newValue, "stars");
      }
    }, 300);
  }
});

const searchRecipient = async (username, context) => {
  console.log("Searching for:", username);
  const payload = { username: username };
  try {
    const result = await sendToBackend("/search_recipient", payload);
    console.log("Response:", result);
    var data = result.data.data;
    if (result.data.status.message != "Пользователь не найден") {
      if (context === "stars") {
        recipientName.value = data.name;
        recipientPhoto.value = data.photo;
        recipient.value = data.recipient;
        recipientCorrect.value = true;
      } else if (context === "ton") {
        recipientNameTon.value = data.name;
        recipientPhotoTon.value = data.photo;
        recipientTon.value = data.recipient;
        recipientCorrectTon.value = true;
      }
    } else {
      if (context === "stars") {
        recipient.value = null;
        recipientCorrect.value = false;
      } else if (context === "ton") {
        recipientTon.value = null;
        recipientCorrectTon.value = false;
      }
    }
  } catch (error) {
    console.error("Failed:", error);
  }
};

const buyformyself = async () => {
  targetUserName.value = getUser(); // Для withdrawstars
};

const buyformyselfTon = async () => {
  targetUserNameTon.value = getUser(); // Для withdrawton
};

watch(targetUserName, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    targetUserNameChanged.value = Date.now(); // Записываем время изменения

    // Debounce: ждём 300 мс перед запросом
    clearTimeout(window.searchTimeout); // Очищаем предыдущий таймер
    window.searchTimeout = setTimeout(async () => {
      if (newValue) {
        // Проверяем, что значение не пустое
        await searchRecipient(newValue);
      }
    }, 300);
  }
});

function getIconPath(type) {
  switch (type) {
    case 0:
      return StarGold; // Покупка звёзд
    case 1:
      return StarPremium; // Покупка премиума
    case 2:
      return TONMinimal; // Вывод TON
    default:
      return "../assets/img/default.svg"; // На случай неизвестного типа
  }
}
</script>

<template>
  <div
    @click="toggleModal(null)"
    class="lang-menu madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'lang' }"
  >
    <LanguageMadal />
  </div>
  <div
    @click="toggleModal(null)"
    class="user-history madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'history' }"
  >
    <HistoryModal />
  </div>
  <div
    @click="toggleModal(null)"
    class="withdrawton madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'withdrawton' }"
  >
    <WithdrawTonModal />
  </div>
  <div
    @click="toggleModal(null)"
    class="withdrawstars madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'withdrawstars' }"
  >
    <WithdrawStarsModal />
  </div>
  <div
    class="popup"
    :class="{ 'popup-active': getActiveModal() == 'popupstars' }"
  >
    <StarsPopup />
  </div>
  <div
    class="popup"
    :class="{ 'popup-active': getActiveModal() == 'popuppremium' }"
  >
    <div class="popup-img flex-row items-center justify-center">
      <img src="../assets/img/Star.svg" alt="" class="img-32" />
    </div>
    <div class="popup-block flex-col">
      <p class="text-16 text-white letter-spacing-2">
        {{ getTranslation("Premiumhavebeensent") }}
      </p>
      <p class="text-14 font-400 text-neutral-300 letter-spacing-2 lh-120">
        {{ getTranslation("Youraccountwillbeupdatedwithinafewminutes") }}
      </p>
      <div
        @click="toggleModal(null)"
        class="popup-btn letter-spacing-04 font-600 btn rounded-12"
      >
        {{ getTranslation("Close") }}
      </div>
    </div>
  </div>
  <div
    class="popup"
    :class="{ 'popup-active': getActiveModal() == 'popupwalletnc' }"
  >
    <div class="popup-img flex-row items-center justify-center">
      <img src="../assets/img/Star.svg" alt="" class="img-32" />
    </div>
    <div class="popup-block flex-col">
      <p class="text-16 text-white letter-spacing-2">
        {{ getTranslation("Walletnotconnected") }}
      </p>
      <p class="text-14 font-400 text-neutral-300 letter-spacing-2 lh-120">
        {{
          getTranslation(
            "PleaseconnectyourTONwalletonthemainpagetostartpurchasing"
          )
        }}
      </p>
      <div
        @click="toggleModal(null)"
        class="popup-btn letter-spacing-04 font-600 btn rounded-12"
      >
        {{ getTranslation("Close") }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-history-body {
  gap: 8px;
}
.history-cards {
  background: var(--Surface-white-5, #ffffff0d);
  padding: 16px;
  margin-bottom: 12px;
  gap: 8px;
}
.history-card {
  gap: 8px;
}
.history-img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--Surface-white-20, #ffffff33);
}
.withdraw-inp {
  padding: 15px 12px;
  border: 0;
  border: 2px solid #00000000;
}
.withdraw-inp:focus-visible {
  border: 2px solid var(--blue-500);
  outline: none;
}
.withdraw-info {
  display: grid;
  grid-template-areas: "A A" "B C";
}
.withdraw-btn {
  margin-top: 18px;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
}
</style>
