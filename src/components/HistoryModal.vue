<script setup>
import { ref, watchEffect } from "vue";
import { useLanguageStore } from "../stores/language";
import { useHistoryStore } from "../stores/history";
import StarGold from "../assets/img/StarGold.svg";
import StarPremium from "../assets/img/StarPremium.svg";
import TONMinimal from "../assets/img/TONMinimal.svg";
import Processing from "../assets/img/Processing.svg";
import Cancelled from "../assets/img/Cancelled.svg";

const { getTranslation } = useLanguageStore();
const {
  getHistory,
  fetchUserHistory,
  setPage,
  getVisiblePages,
  getCurrentPage,
  getPagesCount,
} = useHistoryStore();

const history = ref([]);
const withdrawType = ref(["TON", "Stars", "Stars", "Stars"]);
const currentYear = new Date().getFullYear();

// Подгружаем первую страницу при монтировании
watchEffect(async () => {
  await fetchUserHistory(0);
  history.value = getHistory();
});

// Обновляем данные при смене страницы
watchEffect(() => {
  history.value = getHistory();
});

const getIconPath = (type, count) => {
  switch (type) {
    case 0:
      return Cancelled;
    case 1:
      return Processing;
    case 2:
      return count < 15 ? StarPremium : StarGold;
    case 3:
      return TONMinimal;
    case 4:
    default:
      return StarGold;
  }
};
</script>

<template>
  <div class="user-history-body">
    <template v-if="history">
      <template v-for="(group, index) in history" :key="index">
        <p
          class="text-white-70 text-14 pl-12 lh-120"
          style="margin-bottom: 4px"
        >
          {{ getTranslation(group.date.month) }}, {{ group.date.day }}
          {{ group.date.year === currentYear ? "" : " " + group.date.year }}
        </p>
        <div class="history-cards flex-col rounded-24">
          <div
            v-for="(item, itemIndex) in group.data"
            :key="itemIndex"
            class="history-card flex-row items-center"
          >
            <div class="history-img flex-row justify-center items-center">
              <img
                :src="getIconPath(item.type, item.Count)"
                alt=""
                class="img-20 lazy-img"
                :class="{ 'processing-icon': item.type === 1 }"
              />
            </div>
            <p class="text-14 flex-row twp">
              <template v-if="item.type <= 2">
                {{ getTranslation("buy") }} 
                <span class="font-400 twp" style="display: contents">
                  {{
                    item.Count < 15
                      ? getTranslation("subscriptions")[item.Count]
                      : item.Count
                  }}
                  {{ getTranslation(item.Count < 15 ? "Premium" : "Stars") }}
                </span>
                {{ getTranslation("for") }} @{{ item.Destination }}
              </template>
              <template v-else>
                {{ getTranslation("Withdraw") }} {{ item.Count }}
                {{ getTranslation(withdrawType[item.type] || "Stars") }}
              </template>
            </p>
          </div>
        </div>
      </template>
      <div class="history-pages" v-if="getPagesCount() > 0">
        <!-- Кнопка первой страницы -->
        <div
          class="page-btn"
          @click="setPage(0)"
          :class="getCurrentPage() == 0 ? 'page-btn-current' : ''"
        >
          <p class="text-14">1</p>
        </div>

        <!-- Динамический диапазон -->
        <div
          v-for="page in getVisiblePages()"
          :key="page"
          class="page-btn"
          :class="{ 'page-btn-current': page === getCurrentPage() }"
          @click="setPage(page)"
        >
          <p class="text-14">{{ page + 1 }}</p>
        </div>

        <!-- Кнопка последней страницы -->
        <div
          v-if="getPagesCount() > 0"
          class="page-btn"
          @click="setPage(getPagesCount())"
          :class="
            getCurrentPage() == getPagesCount() ? 'page-btn-current' : ''
          "
        >
          <p class="text-14">{{ getPagesCount() + 1 }}</p>
        </div>
      </div>
    </template>
    <template v-else>
      <span style="padding: 6px 14px" class="flex-col gap-8">
        <p class="text-24">{{ getTranslation("Nohistoryyet") }}</p>
        <p class="text-16">
          {{ getTranslation("Makeapurchaseorwithdrawaltoseeyouractivityhere") }}
        </p>
      </span>
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

.madal_active .processing-icon {
  transform: rotate(3600deg);
  transition: transform 10s;
}
.history-pages {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 64px));
  gap: 16px;
  justify-content: space-between;
  align-content: center;
  padding: 16px;
}
.page-btn {
  background: var(--blue-600);
  padding: 12px;
  border-radius: 12px;
  aspect-ratio: 1/1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn-current {
  background: var(--blue-900);
}
</style>
