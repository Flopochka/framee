<script setup>
import { ref, onMounted } from 'vue';
import { useLanguageStore } from "../stores/language";

const { getTranslation } = useLanguageStore();
const traffyTasks = ref(null);
const tasks = ref([]);
const loadingError = ref(false);

// Конфигурация Traffy
const TRAFFY_CONFIG = {
  resourceId: "YOUR_TRAFFY_KEY", // Замените на ваш ключ
  scriptUrl: "https://embed.traffy.site/v0.0.7/traffy-wrapper.min.js",
  mode: "mock" // или "production" для реального режима
};

// Загрузка скрипта Traffy
const loadTraffyScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Traffy) {
      console.log('Traffy уже загружен');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = TRAFFY_CONFIG.scriptUrl;
    script.setAttribute('resource-id', TRAFFY_CONFIG.resourceId);
    script.setAttribute('mode', TRAFFY_CONFIG.mode);
    script.async = true;

    script.onload = () => {
      console.log('Traffy скрипт загружен');
      resolve();
    };

    script.onerror = (error) => {
      console.error('Ошибка загрузки Traffy:', error);
      reject(error);
    };

    document.head.appendChild(script);
  });
};

// Обработчики заданий
const onTaskLoad = (loadedTasks) => {
  console.log('Задания загружены:', loadedTasks);
  tasks.value = loadedTasks || [];
};

const onTaskRender = (changeReward, changeCardTitle, changeDescription, changeButtonCheckText) => {
  changeReward("10 ★");
  changeCardTitle(getTranslation("subscribeTo"));
  changeButtonCheckText(getTranslation("check"));
};

const onTaskReward = (task, signedToken) => {
  console.log('Задание выполнено:', task);
  // Здесь отправка токена на ваш сервер для верификации
};

const onTaskReject = (task) => {
  console.warn('Задание отклонено:', task);
};

// Инициализация Traffy
const initTraffy = () => {
  try {
    window.Traffy.renderTasks(traffyTasks.value, {
      max_tasks: 3, // Максимальное количество заданий
      onTaskLoad,
      onTaskRender,
      onTaskReward,
      onTaskReject
    });
  } catch (error) {
    console.error('Ошибка инициализации Traffy:', error);
    loadingError.value = true;
  }
};

// Загрузка фолбэк заданий
const loadFallbackTasks = () => {
  tasks.value = [{
    id: 'fallback-1',
    title: getTranslation("demoTaskTitle"),
    description: getTranslation("demoTaskDescription"),
    reward: '10 ★'
  }];
};

onMounted(async () => {
  try {
    await loadTraffyScript();
    initTraffy();
    
    // Фолбэк если задания не загрузились
    setTimeout(() => {
      if (!tasks.value.length) {
        loadFallbackTasks();
      }
    }, 3000);
  } catch (error) {
    console.error('Не удалось загрузить Traffy:', error);
    loadFallbackTasks();
  }
});
</script>

<template>
  <main class="gap-12 p-24">
    <p class="text-20 text-white">{{ getTranslation("tasks") }}</p>
    
    <!-- Контейнер для Traffy -->
    <div class="traffy-custom" ref="traffyTasks"></div>
    
    <!-- Фолбэк если Traffy не загрузился -->
    <template v-if="loadingError || tasks.length">
      <div v-for="task in tasks" :key="task.id" class="task-card">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <div class="reward">{{ task.reward }}</div>
      </div>
    </template>
  </main>
</template>

<style scoped>
/* Стили для контейнера Traffy */
.traffy-custom {
  --traffy-buttonRewardImage-background-image: url("../assets/img/Star.svg");
  --traffy-buttonRewardImage-background-size: 16px;
  --traffy-buttonCheckRewardImage-background-image: none;
  --traffy-buttonCheckRewardImage-background-size: 0;
  --traffy-taskElementButtonText-padding-left: 4px;
  --traffy-taskElementImageCont-display: block;
  --traffy-taskElementInfoCont-gap: 10px;
  --traffy-taskElementInstructionCont-width: 150px;
  --traffy-taskElementCont-bg: #2C3E50;
  --traffy-taskElementCont-border-radius: 12px;
  --traffy-taskElementCont-padding: 16px;
}

/* Стили для фолбэк заданий */
.task-card {
  background: #2C3E50;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  color: white;
}

.reward {
  color: gold;
  font-weight: bold;
  margin-top: 8px;
}
</style>