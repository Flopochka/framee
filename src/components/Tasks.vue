<script setup>
import { useLanguageStore } from "../stores/language";
import { ref, onMounted } from "vue";

const { getTranslation } = useLanguageStore();

const tasks = ref(null);
const traffyTasks = ref(null);

// Функция загрузки скрипта Traffy с расширенной отладкой
async function loadTraffyScript() {
  console.log("[Traffy] Начало загрузки скрипта");

  try {
    // Проверяем, возможно скрипт уже загружен
    if (window.Traffy) {
      console.log("[Traffy] Скрипт уже загружен в window.Traffy");
      initTraffy();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://dvq1zz1g273yl.cloudfront.net/index_v1.1.0.min.js";
    script.setAttribute("traffy-key", "6e1c73ca-e60f-4359-920f-e1d98f2a3d32");
    script.setAttribute("test", "true");
    script.async = true;

    script.onload = () => {
      console.log("[Traffy] Скрипт успешно загружен");
      console.log("window.Traffy:", window.Traffy);
      initTraffy();
    };

    script.onerror = (error) => {
      console.error("[Traffy] Ошибка загрузки скрипта:", error);
    };

    document.head.appendChild(script);
    console.log("[Traffy] Скрипт добавлен в head");
  } catch (error) {
    console.error("[Traffy] Ошибка в loadTraffyScript:", error);
  }
}

// Инициализация Traffy после загрузки скрипта
function initTraffy() {
  console.log("[Traffy] Инициализация Traffy");
  console.log("traffyTasks ref:", traffyTasks.value);

  if (!traffyTasks.value) {
    console.error("[Traffy] Контейнер не найден");
    return;
  }

  if (!window.Traffy) {
    console.error("[Traffy] window.Traffy не доступен");
    return;
  }

  try {
    window.Traffy.renderTasks(traffyTasks.value, {
      max_tasks: 10,
      onTaskLoad,
      onTaskRender,
      onTaskReward,
      onTaskReject,
    });
    console.log("[Traffy] renderTasks вызван");
  } catch (error) {
    console.error("[Traffy] Ошибка при вызове renderTasks:", error);
  }
}

// Обработчики заданий с подробным логгированием
function onTaskLoad(loadedTasks) {
  console.log("[Traffy] Задания загружены:", loadedTasks);
  tasks.value = loadedTasks;
}

function onTaskRender(
  changeReward,
  changeCardTitle,
  changeDescription,
  changeButtonCheckText
) {
  console.log("[Traffy] Рендеринг задания");

  try {
    // Модифицируем отображение задания
    const reward = "10 ★"; // Тестовая награда
    changeReward(reward);
    changeCardTitle("Тестовое задание");
    changeDescription("Подпишитесь на канал");
    changeButtonCheckText("Проверить");

    console.log("[Traffy] Параметры задания изменены");
  } catch (error) {
    console.error("[Traffy] Ошибка в onTaskRender:", error);
  }
}

function onTaskReward(task, signedToken) {
  console.log("[Traffy] Задание выполнено:", { task, signedToken });

  // Эмуляция отправки на сервер
  setTimeout(() => {
    console.log("[Traffy] Награда успешно обработана");
    // Здесь должна быть реальная логика начисления награды
  }, 1000);
}

function onTaskReject(task) {
  console.log("[Traffy] Задание отклонено:", task);
}

// Загрузка при монтировании компонента
onMounted(() => {
  console.log("[Traffy] Компонент смонтирован");
  loadTraffyScript();
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
