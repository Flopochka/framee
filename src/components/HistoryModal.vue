<script setup>
import { ref } from "vue";
import { useLanguageStore } from "../stores/language";
import { useHistoryStore } from "../stores/history";
import StarGold from "../assets/img/StarGold.svg";
import StarPremium from "../assets/img/StarPremium.svg";
import TONMinimal from "../assets/img/TONMinimal.svg";
import Processing from "../assets/img/Processing.svg";
import Cancelled from "../assets/img/Cancelled.svg";

const { getHistory } = useHistoryStore();
const { getTranslation } = useLanguageStore();

const history = getHistory();
const withdrawType = ref(["TON", "Stars", "Stars", "Stars"]);

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
}

const historyLoop = setInterval(fetchUserHistory(),30000);
</script>

<template>
  <div class="user-history-body">
    <template v-if="history">
      <template v-for="(group, index) in history" :key="index">
        <p class="text-white-70 text-14 pl-12">
          {{ getTranslation(group.date.month) }}, {{ group.date.day }}
          {{ group.date.year === currentYear ? "" : ", " + group.date.year }}
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
                class="img-20"
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

.processing-icon {
  transform: rotate(360deg);
  transition: transform 1s;
}
</style>
