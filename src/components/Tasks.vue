<script setup>
import { ref, onMounted } from 'vue';
import { useLanguageStore } from "../stores/language";
import axios from 'axios';
const { getTranslation } = useLanguageStore();

const traffyContainer = ref(null);
const tasks = ref([]);
const loadingError = ref(false);

// Список альтернативных источников
const TRAFFY_SOURCES = [
  'https://dvq1zz1g273yl.cloudfront.net/index_v1.1.0.min.js',
  'https://cdn.traffy.site/v1.1.0/index.min.js',
  'https://unpkg.com/traffy-js-sdk@latest/dist/index.min.js'
];

// Загрузка скрипта
const loadTraffy = async () => {
  for (const url of TRAFFY_SOURCES) {
    try {
      await loadScript(url);
      if (window.Traffy) {
        initTraffy();
        return;
      }
    } catch (error) {
      console.warn(`Ошибка загрузки ${url}:`, error);
    }
  }
  throw new Error('Не удалось загрузить Traffy');
};

// Вспомогательная функция загрузки скрипта
const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Инициализация Traffy
const initTraffy = () => {
  window.Traffy.renderTasks(traffyContainer.value, {
    max_tasks: 1,
    onTaskLoad: (loadedTasks) => {
      tasks.value = loadedTasks || [];
    },
    onTaskRender: (changeReward) => {
      changeReward('10 ★');
    }
  });
};

// Фолбэк задания
const loadFallbackTasks = async () => {
  try {
    const response = await axios.get('https://your-api-fallback/tasks');
    tasks.value = response.data;
  } catch (error) {
    tasks.value = [{
      id: 'fallback-1',
      title: 'Demo Task',
      description: 'Subscribe to our channel',
      reward: '10 ★'
    }];
  }
};

onMounted(async () => {
  try {
    await loadTraffy();
  } catch (error) {
    console.error('Ошибка инициализации Traffy:', error);
    loadingError.value = true;
    await loadFallbackTasks();
  }
});
</script>

<template>
  <main class="gap-12 p-24">
    <p class="text-20 text-white">{{ getTranslation("tasks") }}</p>
    <div class="tasks-cards flex-col gap-8">
      <!-- Контейнер для Traffy -->
      <div
        class="traffyTasks traffy-custom"
        ref="traffyTasks"
        data-testid="traffy-container"
      ></div>

      <!-- Fallback сообщение -->
      <template v-if="!tasks || tasks.length === 0">
        <p class="text-32 lh-120">{{ getTranslation("Notasksforyou") }}</p>
        <p class="text-16 lh-120">
          {{ getTranslation("Takeabreakorcheckbacklaterfornewassignments") }}
        </p>
      </template>
    </div>
  </main>
</template>

<style scoped>
/* Стили для контейнера заданий */
.traffy-custom {
    --traffy-buttonRewardImage-background-image: url('https://d36t0rmxsg07e0.cloudfront.net/arrow.webp');
    --traffy-buttonRewardImage-background-size: 24px;
    --traffy-taskElementButtonContOuter-padding: 0;
    --traffy-taskElementButtonText-padding-left: 0;
    --traffy-taskElementButtonContOuter-background-color: none;

    --traffy-buttonLoader-border: 2px solid rgba(142, 142, 147, 1);

    --traffy-buttonCheckRewardImage-background-image: none;
    --traffy-buttonCheckRewardImage-background-size: 0;

    --traffy-taskElementButtonCheckText-color: rgba(0, 122, 255, 1);
    --traffy-taskElementButtonCheckText-font-size: 14px; 

    --traffy-taskElementChannelText-color: black;
    --traffy-taskElementButtonText-padding-left: 4px;

    --traffy-taskElementInstructionInfoCont-flex-direction: row;
    --traffy-taskElementInstructionInfoCont-gap: 0px;

    --traffy-taskElementInstructionDescriptionCont-display: flex;
    --traffy-taskElementInstructionDescriptionCont-gap: 2px;
    --traffy-taskElementInstructionDescriptionImg-image: url('https://d36t0rmxsg07e0.cloudfront.net/coin.webp');
    --traffy-taskElementInstructionDescriptionImg-size: 14px;
    --traffy-taskElementInstructionDescriptionText-color: rgba(142, 142, 147, 1);
}
</style>
