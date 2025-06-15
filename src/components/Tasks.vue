<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useLanguageStore } from "../stores/language";

const { getTranslation } = useLanguageStore();
const traffyTasks = ref(null);
const tasks = ref([]);
const loadingError = ref(false);

// Обработчики заданий
const onTaskLoad = (loadedTasks) => {
  console.log("[Tasks] Задания загружены:", loadedTasks);
  tasks.value = loadedTasks || [];
};

const onTaskRender = (
  changeReward,
  changeCardTitle,
  changeDescription,
  changeButtonCheckText
) => {
  changeReward("10");
  changeCardTitle(getTranslation("subscribe:"));
  changeButtonCheckText(getTranslation("check"));
};

const onTaskReward = (task, signedToken) => {
  console.log("[Tasks] Задание выполнено:", task);
  alert("Таска выполнена")
  // Здесь отправка токена на ваш сервер для верификации
};

const onTaskReject = (task) => {
  console.warn("[Tasks] Задание отклонено:", task);
  alert("Таска отклонена")
};

// Функция для клика на оригинальную кнопку Traffy по индексу
const clickOriginalButton = (taskIndex) => {
  nextTick(() => {
    // Находим все оригинальные кнопки Traffy
    const originalButtons = document.querySelectorAll('.traffy-custom .traffy-taskElementButtonContOuter');
    
    if (originalButtons && originalButtons.length > taskIndex) {
      originalButtons[taskIndex].click();
      console.log(`[Tasks] Клик на оригинальную кнопку для задания с индексом ${taskIndex}`);
    } else {
      console.warn(`[Tasks] Оригинальная кнопка для задания с индексом ${taskIndex} не найдена`);
    }
  });
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
    console.error("[Tasks] Ошибка инициализации Traffy:", error);
    loadingError.value = true;
  }
};

onMounted(async () => {
  try {
    initTraffy();
  } catch (error) {
    console.error("[Tasks] Не удалось загрузить Traffy:", error);
  }
});
</script>

<template>
  <main class="gap-12 p-24">
    <p class="text-20 text-white">{{ getTranslation("tasks") }}</p>

    <!-- Контейнер для Traffy -->
    <div class="traffy-custom" ref="traffyTasks"></div>
    <div
      v-if="tasks && tasks.length > 0"
      v-for="(task, index) in tasks"
      :key="task.id"
      class="task-card bg-blue-900 rounded-12 items-center"
    >
      <p class="text-16 text-white">
        {{ task.title || "Task title" }}{{ task.description ? (", "+task.description) : "" }}
      </p>
      <div
        class="task-btn rounded-8 lh-22 letter-spacing-04 text-white cupo usen"
        @click="clickOriginalButton(index)"
      >
        {{ getTranslation("start") }}
      </div>
      <p class="text-14 text-white flex-row gap-2">
        <img src="../assets/img/Star.svg" alt="" class="img-16" />
        {{ task.reward || 0 }}
      </p>
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
}
.task-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 3px 11px;
  grid-area: B;
  width: fit-content;
  justify-self: end;
}
</style>