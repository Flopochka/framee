<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useLanguageStore } from '../../stores/language.js'
import { useUserStore } from '../../stores/user.js'
import { useModalStore } from '../../stores/modal.js'
import { sendToBackend } from '../../modules/fetch.js'
// Для передачи данных в попап используем modalStore
const modalStore = useModalStore()

const { getTranslation } = useLanguageStore()
const { toggleModal } = useModalStore()
const userStore = useUserStore()
const traffyTasks = ref(null)
const tasks = ref([])
const loadingError = ref(false)
const tasksBalance = ref(0)
const isLoadingBalance = ref(false)
const activeTaskIndex = ref(null)
const disappearingTasks = ref([])
let visibilityHandler = null
const disappearingTaskElements = {} // taskIndex: DOM-элемент

// Обработчики заданий
const onTaskLoad = (loadedTasks) => {
  console.log("[Tasks] Задания загружены:", loadedTasks);
  // Убираем дубли по id
  const uniqueTasks = [];
  const seenIds = new Set();
  for (const t of loadedTasks || []) {
    if (!seenIds.has(t.id)) {
      uniqueTasks.push(t);
      seenIds.add(t.id);
    }
  }
  tasks.value = uniqueTasks;
};



onMounted(async () => {
  try {
    await fetchTasksBalance();
    initTraffy();
  } catch (error) {
    console.error("[Tasks] Не удалось загрузить Traffy:", error);
  }
});

// Очистка обработчика при размонтировании
onUnmounted(() => {
  if (visibilityHandler) {
    document.removeEventListener("visibilitychange", visibilityHandler);
    visibilityHandler = null;
  }
});
</script>

<template>
  <main class="gap-12 p-24">
    <!-- Полоска с балансом и кнопкой вывода -->
    <div
      class="balance-section flex-row items-center jcsb bg-blue-900 rounded-12 p-16 text-16 gap-4"
    >
      <div class="flex-row items-center gap-4">
        <p class="text-white">{{ getTranslation("TasksBalance") }}:</p>
        <p class="text-white font-600">
          {{ isLoadingBalance ? "..." : tasksBalance }}
        </p>
        <img src="../../assets/img/Star.svg" alt="" class="img-20" />
      </div>
      <div
        @click="openWithdrawModal"
        class="withdraw-btn rounded-8 bg-gradient-blue text-white font-600 p-12 cupo usen jse"
      >
        {{ getTranslation("Withdraw") }}
      </div>
    </div>

    <p class="text-20 text-white">{{ getTranslation("tasks") }}</p>

    <!-- Контейнер для Traffy -->
    <div class="traffy-custom" ref="traffyTasks"></div>
    <div v-if="tasks && tasks.length > 0" class="tasks-list">
      <div
        v-for="(task, index) in tasks"
        :key="task.id"
        class="task-card bg-blue-900 rounded-12 items-center"
        :class="{ disappearing: disappearingTasks.includes(index) }"
      >
        <p class="text-16 text-white">
          {{ task.title || "Task title"
          }}{{ task.description ? ", " + task.description : "" }}
        </p>
        <div class="task-buttons">
          <div
            class="task-btn rounded-8 lh-22 letter-spacing-04 text-white cupo usen"
            @click="clickOriginalButton(index)"
          >
            {{ getTranslation("start") }}
          </div>
        </div>
        <p class="text-14 text-white flex-row gap-2">
          <img src="../../assets/img/Star.svg" alt="" class="img-16" />
          {{ task.reward || 1 }}
        </p>
      </div>
    </div>
    <template v-else>
      <p class="text-32 lh-120">{{ getTranslation("Notasksforyou") }}</p>
      <p class="text-16 lh-120">
        {{ getTranslation("Takeabreakorcheckbacklaterfornewassignments") }}
      </p>
    </template>
  </main>
</template>

<style scoped>
.traffy-custom {
  display: none;
}
/* Стили для вашего компонента */
.task-card {
  padding: 14px 12px;
  display: grid;
  grid-template-areas: "A B" "C B";
  gap: 6px;
  transition:
    transform 0.2s,
    opacity 0.2s;
  margin-bottom: 12px;
}
.task-card.disappearing {
  transform: scale(0.8);
  opacity: 0;
}

.task-buttons {
  grid-area: B;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-self: end;
}

.task-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 3px 11px;
  width: fit-content;
}

.balance-section {
  border: 1px solid var(--blue-800);
  padding: 12px 16px;
}

.bg-gradient-blue {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
}
</style>
