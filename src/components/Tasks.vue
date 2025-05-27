<script setup>
import { useLanguageStore } from "../stores/language";
import { ref, onMounted } from "vue";

const { getTranslation } = useLanguageStore();

// Реактивная переменная для заданий
const tasks = ref(null);
const traffyTasks = ref(null);

// Функция загрузки скрипта Traffy
function loadTraffyScript() {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://embed.traffy.site/v0.0.7/traffy-wrapper.min.js"]'
    );
    if (existingScript) {
      console.log("Скрипт traffy-wrapper.min.js уже загружен");
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://embed.traffy.site/v0.0.7/traffy-wrapper.min.js";
    script.setAttribute("resource-id", "6e1c73ca-e60f-4359-920f-e1d98f2a3d32");
    script.setAttribute("mode", "mock");
    script.async = true;

    script.onload = () => {
      console.log("Скрипт traffy-wrapper.min.js успешно загружен");
      resolve();
    };

    script.onerror = (error) => {
      console.error("Ошибка при загрузке скрипта traffy-wrapper.min.js:", error);
      reject(error);
    };

    document.head.appendChild(script);
  });
}

// Функция обработки base64-строк (для image_url)
function getImageSrc(base64) {
  if (!base64 || typeof base64 !== 'string') {
    console.error('Base64 строка не передана или не является строкой');
    return '';
  }

  let cleaned = base64.replace(/^data:image\/(png|svg\+xml);base64,/, '').trim();
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (e) {
    console.warn('Не удалось декодировать URL-кодированную строку:', e);
  }

  cleaned = cleaned.replace(/\s+/g, '').replace(/=+$/, '');
  if (!/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
    console.error('Строка содержит недопустимые символы для base64:', cleaned);
    return '';
  }

  if (cleaned.length % 4 !== 0) {
    console.warn('Некорректная длина base64-строки, добавляем padding');
    cleaned = cleaned.padEnd(cleaned.length + (4 - (cleaned.length % 4)), '=');
  }

  try {
    atob(cleaned);
  } catch (e) {
    console.error('Некорректная base64 строка:', e);
    return '';
  }

  const mime = cleaned.startsWith('PHN2') ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,${cleaned}`;
}

// Функции для Traffy
function onTaskLoad(tasksData) {
  console.log('Задания загружены:', tasksData);
  tasks.value = tasksData; // Сохраняем задания в реактивную переменную
}

function onTaskRender(changeReward, changeCardTitle, changeDescription, changeButtonCheckText) {
  changeReward(getTranslation('rewardText', '200K')); // Локализованная награда
  changeCardTitle(getTranslation('subscribeOn', 'Subscribe on: '));
  changeDescription(getTranslation('taskDescription', 'Follow in Telegram'));
  changeButtonCheckText(getTranslation('checkButton', 'Check'));
}

function onTaskReward(task, signedToken) {
  console.log('Задание выполнено:', task, 'Токен:', signedToken);
  // Пример отправки токена на сервер (в production)
  /*
  fetch('YOUR_SERVER_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify({ hash: signedToken }),
  })
    .then((res) => {
      if (res.status === 200) {
        console.log('Награда начислена для задания:', task.title);
      }
    })
    .catch((error) => {
      console.error('Ошибка при начислении награды:', error);
    });
  */
}

function onTaskReject(task) {
  console.log('Задание не прошло проверку:', task.title);
  // Можно показать уведомление
  alert(getTranslation('taskRejected', `Задание не прошло проверку: ${task.title}`));
}

// Инициализация Traffy после монтирования компонента
onMounted(() => {
  loadTraffyScript()
    .then(() => {
      if (traffyTasks.value && window.Traffy) {
        window.Traffy.renderTasks(traffyTasks.value, {
          max_tasks: 3,
          onTaskLoad,
          onTaskRender,
          onTaskReward,
          onTaskReject,
        });
      } else {
        console.error('Контейнер traffyTasks или window.Traffy не найдены');
      }
    })
    .catch((error) => {
      console.error('Не удалось загрузить Traffy:', error);
    });
});
</script>

<template>
  <main class="gap-12 p-24">
    <p class="text-20 text-white">{{ getTranslation("tasks") }}</p>
    <div class="tasks-cards flex-col gap-8">
      <!-- Контейнер для заданий Traffy -->
      <div class="traffyTasks traffy-custom" ref="traffyTasks"></div>
      <!-- Fallback, если заданий нет -->
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

/* Стили для Traffy */
.traffy-custom {
  --traffy-buttonRewardImage-background-image: url("../assets/img/Star.svg");
  --traffy-buttonRewardImage-background-size: 16px;
  --traffy-buttonCheckRewardImage-background-image: none;
  --traffy-buttonCheckRewardImage-background-size: 0;
  --traffy-taskElementButtonText-padding-left: 4px;
  --traffy-taskElementImageCont-display: block;
  --traffy-taskElementInfoCont-gap: 10px;
  --traffy-taskElementInstructionCont-width: 150px;
}
</style>