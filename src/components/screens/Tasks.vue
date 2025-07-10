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

const onTaskReward = async (task, signedToken) => {
  console.log('[Tasks] Задание выполнено:', task)
  try {
    const backendPayload = {
      user_id: userStore.getUserId(),
      signed_token: signedToken,
    }
    const backendResult = await sendToBackend(
      '/verify_traffy_token',
      backendPayload
    )
    console.log('[fetch] Response from /verify_traffy_token : ', backendResult)
    if (backendResult.data && backendResult.data.success) {
      await fetchTasksBalance()
      modalStore.modal = {
        name: 'stars',
        title: getTranslation('taskCompleted'),
        message: getTranslation('rewardWillBeCreditedWithin10Minutes'),
        closeText: getTranslation('Close'),
      }
      toggleModal('stars')
      // Анимация исчезновения задания
      const idx = tasks.value.findIndex((t) => t.id === task.id)
      console.log('[Tasks] Анимация исчезновения задания idx:', idx)
      animateAndRemoveTask(idx)
    } else {
      throw new Error(
        backendResult.data?.message || 'Ошибка верификации задания'
      )
    }
  } catch (error) {
    console.error('[Tasks] Ошибка при верификации задания:', error)
    // Анимация исчезновения задания
    const idx = tasks.value.findIndex((t) => t.id === task.id)
    console.log('[Tasks] Анимация исчезновения задания idx:', idx)
    animateAndRemoveTask(idx)
    modalStore.modal = {
      name: 'error',
      title: getTranslation('error'),
      message: getTranslation('failedToVerifyTask'),
      closeText: getTranslation('Close'),
    }
    toggleModal('error')
  }
}

const onTaskReject = (task) => {
  console.warn('[Tasks] Задание отклонено:', task)
  modalStore.modal = {
    name: 'error',
    title: getTranslation('taskRejected'),
    message: getTranslation('taskExecutionRejected'),
    closeText: getTranslation('Close'),
  }
  toggleModal('error')
  // Анимация исчезновения задания
  const idx = tasks.value.findIndex((t) => t.id === task.id)
  animateAndRemoveTask(idx)
}

// Функция для плавного исчезновения задания
const animateAndRemoveTask = (taskIndex) => {
  console.log('[Tasks] Запуск анимации исчезновения для taskIndex:', taskIndex)
  disappearingTasks.value.push(taskIndex)
  setTimeout(() => {
    // Используем сохранённый DOM-элемент
    const btn = disappearingTaskElements[taskIndex]
    const isGone = !btn || btn.offsetParent === null || btn.style.display === 'none'
    if (isGone) {
      tasks.value.splice(taskIndex, 1)
      console.log('[Tasks] Задание удалено из списка, т.к. оригинальный элемент исчез')
    } else {
      console.log('[Tasks] Оригинальный элемент Traffy еще есть, задание не удаляем')
    }
    // Удалить из исчезающих
    const idx = disappearingTasks.value.indexOf(taskIndex)
    if (idx !== -1) disappearingTasks.value.splice(idx, 1)
    // Очищаем ссылку
    delete disappearingTaskElements[taskIndex]
  }, 200)
}

// Функция для клика на оригинальную кнопку Traffy по индексу
const clickOriginalButton = (taskIndex) => {
  nextTick(() => {
    const originalButtons = document.querySelectorAll(
      '.traffy-custom .traffy-taskElementButtonContOuter'
    )
    if (originalButtons && originalButtons.length > taskIndex) {
      originalButtons[taskIndex].click()
      activeTaskIndex.value = taskIndex
      // Сохраняем DOM-элемент для дальнейшей проверки
      disappearingTaskElements[taskIndex] = originalButtons[taskIndex]
      // Устанавливаем обработчик возврата на страницу
      if (!visibilityHandler) {
        visibilityHandler = () => {
          if (
            document.visibilityState === 'visible' &&
            activeTaskIndex.value !== null
          ) {
            // Клик "Проверить" (второй этап)
            nextTick(() => {
              const checkButtons = document.querySelectorAll(
                '.traffy-custom .traffy-taskElementButtonContOuter'
              )
              console.log(
                '[Tasks] Автоклик по кнопке проверки для индекса:',
                activeTaskIndex.value
              )
              if (checkButtons && checkButtons.length > activeTaskIndex.value) {
                checkButtons[activeTaskIndex.value].click()
                // Сохраняем DOM-элемент для дальнейшей проверки (на случай автопроверки)
                disappearingTaskElements[activeTaskIndex.value] = checkButtons[activeTaskIndex.value]
              }
              activeTaskIndex.value = null
            })
          }
        }
        document.addEventListener('visibilitychange', visibilityHandler)
      }
      console.log(
        `[Tasks] Клик на оригинальную кнопку для задания с индексом ${taskIndex}`
      )
    } else {
      console.warn(
        `[Tasks] Оригинальная кнопка для задания с индексом ${taskIndex} не найдена`
      )
    }
  })
}

// Получение баланса звезд из заданий
const fetchTasksBalance = async () => {
  isLoadingBalance.value = true;
  try {
    const payload = {
      user_id: userStore.getUserId(),
    };
    const result = await sendToBackend("/get_user_balance_stars", payload);
    if (result.status.code === 200) {
      tasksBalance.value = result.data.balance;
      console.log("[Tasks] Баланс звезд:", tasksBalance.value);
    }
  } catch (error) {
    console.error("[Tasks] Failed to fetch tasks balance:", error);
  } finally {
    isLoadingBalance.value = false;
  }
};

// Открытие модального окна вывода с обновлением баланса
const openWithdrawModal = async () => {
  await fetchTasksBalance();
  toggleModal("withdrawtasksstars");
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
