<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { ref, onMounted } from "vue";
import StarGold from "../assets/img/StarGold.svg";
import StarPremium from "../assets/img/StarPremium.svg";
import TONMinimal from "../assets/img/TONMinimal.svg";
// Добавлены новые иконки для обработки и отмены
import Processing from "../assets/img/Processing.svg"; // Новая иконка для состояния обработки
import Cancelled from "../assets/img/Cancelled.svg"; // Новая иконка для состояния отмены

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();

const history = ref([]);
const purchaseStatus = ref([
  "PurchaseCancelled",
  "PurchaseProcessing",
  "PurchaseSuccessful",
]);
const withdrawType = ref(["TON", "Stars", "Stars", "Stars"]);

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
    year: year,
  };
}

function getIconPath(type, count) {
  // Добавлен параметр count для определения иконки в зависимости от количества (Premium или Stars)
  switch (type) {
    case 0:
      // Состояние 0: Покупка отменена — используем иконку Cancelled
      return Cancelled;
    case 1:
      // Состояние 1: Обработка покупки — используем иконку Processing
      return Processing;
    case 2:
      // Состояние 2: Покупка успешна — выбираем иконку в зависимости от count
      return count < 15 ? StarPremium : StarGold; // Premium для count < 15, Stars для count >= 15
    case 3:
      // Состояние 3: Вывод TON — используем TONMinimal
      return TONMinimal;
    case 4:
    default:
      // Состояние 4 и выше: Вывод Stars (или неизвестный тип) — используем StarGold
      return StarGold;
  }
}

const historyCache = ref(null);

const fetchUserHistory = async () => {
  if (historyCache.value) {
    history.value = historyCache.value;
  }
  const payload = {
    // user_id: 227363776,
    user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id
  };
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
  fetchUserHistory();
});
</script>

<template>
  <div @click.stop class="user-history-head madal-screen-head items-start cude">
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
            <!-- Передаем item.Count в getIconPath для type=2 -->
            <img
              :src="getIconPath(item.type, item.Count)"
              alt=""
              class="img-20"
              :class="{ 'processing-icon': item.type === 1 }"
            />
          </div>
          <p class="text-14 flex-row twp">
            <template v-if="item.type <= 2">
              <!-- Состояния 0-2: Покупка (отменена, обработка, успешна) -->
              {{ getTranslation('buy') }} 
              <span class="font-400 twp" style="display:contents">
                {{ item.Count }}
                {{
                  getTranslation(item.Count < 15 ? "Premium" : "Stars")
                }} </span
              >  {{ getTranslation("for") }} @{{ item.Destination }}
            </template>
            <template v-else>
              <!-- Состояния 3-6: Вывод -->
              {{ getTranslation("Withdraw") }} {{ item.Count }}
              {{ getTranslation(withdrawType[item.type] || "Stars") }}
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
  border-radius: 20px;
  aspect-ratio: 1/1;
  background: var(--Surface-white-20, #ffffff33);
}
.processing-icon {
  transform: rotate(360deg);
  transition: transform 1s;
}
</style>
