<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";
import { ref, onMounted } from "vue";
import StarGold from "../assets/img/StarGold.svg";
import StarPremium from "../assets/img/StarPremium.svg";
import TONMinimal from "../assets/img/TONMinimal.svg";

const { toggleModal, getActiveModal } = useModalStore();
const { getTranslation, switchLanguage, langs, getCurrentLanguage } =
  useLanguageStore();
const { getUserBalance} = useUserStore();

const userId = ref(null);
const withdrawTonAmmount = ref(null);
const history = ref([]);

// Определяем константы вне функций
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const currentYear = new Date().getFullYear();

function normalizeDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return {
    day: day,
    month: month,
    // year: year === currentYear ? 0 : year,
    year: year,
  };
}

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

const fetchUserHistory = async () => {
  const payload = {
    user_id: userId.value,
  };
  try {
    const result = await sendToBackend("/get_user_history", payload);
    const data = result.data.data;
    console.log("Response:", result.data);

    const groupedByDate = data.history.reduce((acc, item) => {
      const { date, ...rest } = item;
      const dateOnly = date.split(" ")[0];
      if (!acc[dateOnly]) {
        acc[dateOnly] = [];
      }
      acc[dateOnly].push(rest);
      return acc;
    }, {});

    history.value = Object.keys(groupedByDate)
      .map((date) => ({
        date: normalizeDate(date),
        data: groupedByDate[date],
      }))
      .sort(
        (a, b) =>
          new Date(
            b.date.year || currentYear,
            months.indexOf(b.date.month),
            b.date.day
          ) -
          new Date(
            a.date.year || currentYear,
            months.indexOf(a.date.month),
            a.date.day
          )
      );
  } catch (error) {
    console.error("Failed:", error);
  }
};

// Инициализация user_id после загрузки компонента
onMounted(() => {
  if (window.Telegram?.WebApp?.initDataUnsafe) {
    userId.value = window.Telegram.WebApp.initDataUnsafe.user.id;
  } else {
    // userId.value = 1341978600; // Значение по умолчанию для отладки 227363776
    userId.value = 227363776; // Значение по умолчанию для отладки
  }

  fetchUserHistory(); // Вызываем запрос после установки userId
});
</script>

<template>
  <div
    @click="toggleModal(null)"
    class="lang-menu madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'lang' }"
  >
    <div @click.stop class="lang-menu-head madal-screen-head">
      <div class="madal-screen-swipka"></div>
      <p class="text-20 madal-screen-title lh-120">
        {{ getTranslation("Systemlanguage") }}
      </p>
      <div @click="toggleModal(null)" class="madal-screen-close">
        <img src="../assets/img/Cross.svg" alt="" class="img-24" />
      </div>
    </div>
    <div @click.stop class="lang-menu-body madal-screen-body">
      <div class="lang-select-cards">
        <div
          v-for="(label, key) in langs"
          :key="key"
          @click="switchLanguage(key)"
          class="lang-select-card flex-row"
        >
          <p class="text-16 font-400">{{ label }}</p>
          <img
            src="../assets/img/Check.svg"
            :alt="getCurrentLanguage() === key ? 'Галочки нет' : 'Галочка'"
            class="img-24"
            :class="{ hidden: getCurrentLanguage() !== key }"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    @click="toggleModal(null)"
    class="user-history madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'history' }"
  >
    <div @click.stop class="user-history-head madal-screen-head">
      <div class="madal-screen-swipka"></div>
      <p class="text-20 madal-screen-title">{{ getTranslation("History") }}</p>
      <div @click="toggleModal(null)" class="madal-screen-close">
        <img src="../assets/img/Cross.svg" alt="" class="img-24" />
      </div>
    </div>
    <div
      @click.stop
      class="user-history-body madal-screen-body madal-screen-body-high"
    >
      <template v-for="(group, index) in history" :key="index">
        <p class="text-white-70 text-14 pl-12">
          {{ getTranslation(group.date.month) }}, {{ group.date.day }}
          {{ group.date.year == currentYear ? "" : ", " + group.date.year }}
        </p>
        <div class="history-cards flex-col rounded-24">
          <div
            v-for="(item, itemIndex) in group.data"
            :key="itemIndex"
            class="history-card flex-row items-center"
          >
            <div class="history-img flex-row justify-center items-center">
              <img :src="getIconPath(item.type)" alt="" class="img-20" />
            </div>
            <p class="text-14 flex-row">
              <template v-if="item.type === 0">
                {{ getTranslation("buy") }}
                &nbsp;
                <span class="font-400">
                  {{ item.Count }} {{ getTranslation("stars") }}
                  &nbsp;
                </span>
                {{ getTranslation("for") }} @{{ item.Destination }}
              </template>
              <template v-else-if="item.type === 2">
                {{ getTranslation("Withdraw") }} {{ item.Count }} TON
              </template>
              <template v-else-if="item.type === 3">
                {{ getTranslation("buy") }}
                {{ getTranslation("Premium3months") }}
                {{ getTranslation("for") }} @{{ item.Destination }}
              </template>
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div
    @click="toggleModal(null)"
    class="withdrawton madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'withdrawton' }"
  >
    <div @click.stop class="withdrawton-head madal-screen-head">
      <div class="madal-screen-swipka"></div>
      <p class="text-20 lh-120 madal-screen-title flex-row gap-14 items-center">
        {{ getTranslation("Yourbalance") }}:
        <span class="lh-115 flex-row items-center"
          >{{ getUserBalance() }}&nbsp;<img
            src="../assets/img/TONMinimal.svg"
            alt=""
            class="img-20"
        /></span>
      </p>
      <div @click="toggleModal(null)" class="madal-screen-close">
        <img src="../assets/img/Cross.svg" alt="" class="img-24" />
      </div>
    </div>
    <div
      @click.stop
      class="withdrawton-body madal-screen-body madal-screen-body-high jcsb"
    >
      <div class="withdraw-inputs flex-col gap-8">
        <p class="pl-14 text-neutral-300 text-14">
          {{ getTranslation("Ammount") }}
        </p>
        <input
          type="number"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
          placeholder="Min 0.3"
          :min="getUserBalance() > 0.3 ? 0.3 : 0"
          :max="getUserBalance() > 0.3 ? min(getUserBalance(), 1000000) : 0"
          v-model="withdrawTonAmmount"
        />
        <p class="pl-14 text-neutral-300 text-14">
          {{ getTranslation("Wallet") }}
        </p>
        <input
          type="number"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
          placeholder="@UQA63stAKU17GZ80mcHctRX3DBSbm4Ks_dBwGiX9JTrIAi2"
        />
        <div class="withdraw-info gap-12" v-if="withdrawTonAmmount">
          <p style="grid-area: A" class="text-16 font-400 text-white">
            {{ getTranslation("Youget") }}
          </p>
          <p class="text-24 text-white">{{ withdrawTonAmmount }} TON</p>
          <p class="text-14 font-400 text-white-60 jse">
            {{ getTranslation("Fee") }} 0.3 TON
          </p>
        </div>
      </div>
      <div
        @click="toggleModal('popupwalletnc')"
        class="withdraw-btn font-600 letter-spacing-04 btn text-17"
      >
        {{ getTranslation("WithdrawinTON") }}
      </div>
    </div>
  </div>
  <div
    @click="toggleModal(null)"
    class="withdrawstars madal-screen"
    :class="{ 'madal-active': getActiveModal() == 'withdrawstars' }"
  >
    <div @click.stop class="withdrawstars-head madal-screen-head">
      <div class="madal-screen-swipka"></div>
      <p class="text-20 lh-120 madal-screen-title flex-row gap-14 items-center">
        {{ getTranslation("Yourbalance") }}:
        <span class="lh-115 flex-row items-center"
          >{{ getUserBalance() }}&nbsp;<img
            src="../assets/img/TONMinimal.svg"
            alt=""
            class="img-20"
        /></span>
      </p>
      <div @click="toggleModal(null)" class="madal-screen-close">
        <img src="../assets/img/Cross.svg" alt="" class="img-24" />
      </div>
    </div>
    <div
      @click.stop
      class="withdrawstars-body madal-screen-body madal-screen-body-high jcsb"
    >
      <div class="withdraw-inputs flex-col gap-8">
        <p class="pl-14 text-neutral-300 text-14">
          {{ getTranslation("Ammount") }}
        </p>
        <input
          type="number"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
          placeholder="Min 100"
          min="100"
          max="1000000"
        />
        <p class="pl-14 text-neutral-300 text-14">
          {{ getTranslation("Username") }}
        </p>
        <input
          type="number"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16"
          placeholder="@example"
        />
        <div class="withdraw-info gap-12">
          <p style="grid-area: A" class="text-16 font-400 text-white">
            {{ getTranslation("Yougetfor") }} 0.3 TON ≈
          </p>
          <p class="text-24 text-white">100 Stars</p>
          <p class="text-14 font-400 text-white-60 jse">
            {{ getTranslation("Fee") }} 0.3 TON
          </p>
        </div>
      </div>
      <div
        @click="toggleModal('popupstars')"
        class="withdraw-btn font-600 letter-spacing-04 btn text-17"
      >
        {{ getTranslation("WithdrawinStars") }}
      </div>
    </div>
  </div>
  <div
    class="popup"
    :class="{ 'popup-active': getActiveModal() == 'popupstars' }"
  >
    <div class="popup-img flex-row items-center justify-center">
      <img src="../assets/img/Star.svg" alt="" class="img-32" />
    </div>
    <div class="popup-block flex-col">
      <p class="text-16 text-white letter-spacing-2">
        {{ getTranslation("Starshavebeensent") }}
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
.madal-screen {
  height: auto;
  overflow: hidden;
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: none;
  z-index: -1;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.madal-screen-head {
  background: var(--blue-950);
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  padding: 12px 24px;
  display: grid;
  grid-template-areas: "A A" "B C";
  justify-content: space-between;
  transform: translateY(100vh);
  transition: transform 0.3s;
}
.madal-active .madal-screen-head {
  transform: translateY(0);
}
.madal-screen-swipka {
  grid-area: A;
  width: 36px;
  height: 4px;
  background: #ffffff26;
  justify-self: center;
  border-radius: 4px;
}
.madal-screen-title {
  font-family: Geist;
  font-weight: 500;
  font-size: 20px;
  line-height: 120%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: var(--white-100);
}
.madal-screen-close {
  padding: 4px;
  border-radius: 16px;
  background: #ffffff1a;
  display: flex;
}
.madal-screen-body {
  width: 100%;
  max-height: 60vh;
  overflow: auto;
  padding: 24px;
  padding-top: 0;
  padding-bottom: 52px;
  background: var(--blue-950);
  display: flex;
  flex-direction: column;
  transform: translatey(100vh);
  transition: transform 0.3s;
}
.madal-active .madal-screen-body {
  transform: translateY(0);
}
.hidden {
  opacity: 0;
}
.madal-active {
  background: var(--shadow-75);
  transition: background 0.3s;
  z-index: 5;
}
.popup {
  height: auto;
  overflow: hidden;
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: none;
  z-index: -1;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.popup-active {
  background: var(--shadow-75);
  transition: background 0.3s;
  z-index: 5;
}
.popup-block {
  width: 286px;
  height: 202px;
  background: #133e67;
  clip-path: path(
    "M0 11 0 190Q0 202 12 202L274 202Q286 202 286 190L286 12Q286 0 274 0L186 0A1 1 0 01100 0L12 0Q0 0 0 11"
  );
  position: absolute;
  top: calc(50% - 101px);
  left: calc(50% - 143px);
  padding: 24px 16px;
  padding-top: 60px;
  justify-content: space-between;
  text-align: center;
  transform: translatey(-100vh);
  transition: transform 0.3s;
}
.popup-img {
  width: 80px;
  height: 80px;
  position: absolute;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  border-radius: 50%;
  top: calc(50% - 141px);
  left: calc(50% - 40px);
  transform: translatey(-100vh);
  transition: transform 0.3s;
}
.popup-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  box-shadow: 0px 9px 20.2px 0px #10141c1a;
}
.popup-active .popup-img,
.popup-active .popup-block {
  transform: translateY(0);
}
.lang-select-card {
  justify-content: space-between;
  padding: 8px 6px 8px 0;
}
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
