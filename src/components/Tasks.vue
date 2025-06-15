<script setup>
import { ref, onMounted } from "vue";
import { useLanguageStore } from "../stores/language";

const { getTranslation } = useLanguageStore();
const traffyTasks = ref(null);
const tasks = ref([]);
const loadingError = ref(false);

// Конфигурация Traffy
const TRAFFY_CONFIG = {
  resourceId: "6e1c73ca-e60f-4359-920f-e1d98f2a3d32", // Замените на ваш ключ
  scriptUrl: "https://embed.traffy.site/v0.0.7/traffy-wrapper.min.js",
  mode: "mock", // или "production" для реального режима
};

// Обработчики заданий
const onTaskLoad = (loadedTasks) => {
  console.log("Задания загружены:", loadedTasks);
  tasks.value = loadedTasks || [];
};

const onTaskRender = (
  changeReward,
  changeCardTitle,
  changeDescription,
  changeButtonCheckText
) => {
  changeReward("10 ★");
  changeCardTitle(getTranslation("subscribe:"));
  changeButtonCheckText(getTranslation("check"));
};

const onTaskReward = (task, signedToken) => {
  console.log("Задание выполнено:", task);
  // Здесь отправка токена на ваш сервер для верификации
};

const onTaskReject = (task) => {
  console.warn("Задание отклонено:", task);
};

// Инициализация Traffy
const initTraffy = () => {
  try {
    window.Traffy.renderTasks(traffyTasks.value, {
      max_tasks: 10, // Максимальное количество заданий
      onTaskLoad,
      onTaskRender,
      onTaskReward,
      onTaskReject,
    });
  } catch (error) {
    console.error("Ошибка инициализации Traffy:", error);
    loadingError.value = true;
  }
};

// Загрузка фолбэк заданий
const loadFallbackTasks = () => {
  tasks.value = [
    {
      id: "fallback-1",
      title: getTranslation("demoTaskTitle"),
      description: getTranslation("demoTaskDescription"),
      reward: "10 ★",
    },
  ];
};

onMounted(async () => {
  try {
    initTraffy();

    // Фолбэк если задания не загрузились
    setTimeout(() => {
      if (!tasks.value.length) {
        loadFallbackTasks();
      }
    }, 3000);
  } catch (error) {
    console.error("Не удалось загрузить Traffy:", error);
    loadFallbackTasks();
  }
});
</script>

<template>
  <main class="gap-12 p-24">
    <p class="text-20 text-white">{{ getTranslation("tasks") }}</p>

    <!-- Контейнер для Traffy -->
    <div class="traffy-custom" ref="traffyTasks"></div>
    <template v-if="!tasks || tasks.length === 0">
      <p class="text-32 lh-120">{{ getTranslation("Notasksforyou") }}</p>
      <p class="text-16 lh-120">
        {{ getTranslation("Takeabreakorcheckbacklaterfornewassignments") }}
      </p>
    </template>

    <div v-for="task in tasks" :key="task.id" class="task-card">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <div class="reward">{{ task.reward }}</div>
    </div>
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
}
.task-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 3px 11px;
  grid-area: B;
  width: fit-content;
  justify-self: end;
}
</style>
