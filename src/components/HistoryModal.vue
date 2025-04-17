<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";
import { ref, onMounted } from "vue";
import StarGold from "../assets/img/StarGold.svg";
import StarPremium from "../assets/img/StarPremium.svg";
import TONMinimal from "../assets/img/TONMinimal.svg";

const { toggleModal } = useModalStore();
const { getTranslation } =
  useLanguageStore();
const { getUserId } = useUserStore();

const userId = ref(null);
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

const historyCache = ref(null);

const fetchUserHistory = async () => {
  if (historyCache.value) {
    history.value = historyCache.value;
  }
  const payload = { user_id: userId.value };
  try {
    const result = await sendToBackend("/get_user_history", payload);
    const data = result.data.data;

    const groupedByDate = data.history.reduce((acc, item) => {
      const { date, ...rest } = item;
      const dateOnly = date.split(" ")[0];
      if (!acc[dateOnly]) acc[dateOnly] = [];
      acc[dateOnly].push(rest);
      return acc;
    }, {});

    historyCache.value = Object.keys(groupedByDate)
      .map((date) => ({
        date: normalizeDate(date),
        data: groupedByDate[date],
      }))
      .sort(
        (a, b) =>
          new Date(b.date.year, months.indexOf(b.date.month), b.date.day) -
          new Date(a.date.year, months.indexOf(a.date.month), a.date.day)
      );
    history.value = historyCache.value;
  } catch (error) {
    console.error("Failed:", error);
  }
};

// Инициализация user_id после загрузки компонента
onMounted(() => {
  userId.value = getUserId();

  fetchUserHistory(); // Вызываем запрос после установки userId
});
</script>

<template>
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
</style>
