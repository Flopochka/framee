<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useLanguageStore } from '../../stores/language.js'
import { useUserStore } from '../../stores/user.js'
import { useModalStore } from '../../stores/modal.js'
import { sendToBackend } from '../../modules/fetch.js'
import { showPopup } from '../../utils/telegram.js'

const { getTranslation } = useLanguageStore()
const { toggleModal } = useModalStore()
const userStore = useUserStore()
const traffyTasks = ref(null)
const tasks = ref([])
const loadingError = ref(false)
const tasksBalance = ref(0)
const isLoadingBalance = ref(false)

// Обработчики заданий
const onTaskLoad = (loadedTasks) => {
  console.log('[Tasks] Задания загружены:', loadedTasks)
  tasks.value = loadedTasks || []
}

const onTaskRender = (
  changeReward,
  changeCardTitle,
  changeDescription,
  changeButtonCheckText
) => {
  changeReward('10')
  changeCardTitle(getTranslation('subscribe:'))
  changeButtonCheckText(getTranslation('check'))
}

const onTaskReward = async (task, signedToken) => {
  console.log('[Tasks] Задание выполнено:', task)
  try {
    const backendPayload = {
      user_id: userStore.getUserId(),
      signed_token: signedToken
    }

    const backendResult = await sendToBackend(
      '/verify_traffy_token',
      backendPayload
    )

    if (backendResult.status === 'success') {
      // Обновляем баланс после успешного выполнения задания
      await fetchTasksBalance()

      showPopup(
        {
          title: getTranslation('taskCompleted'),
          message: getTranslation('rewardWillBeCreditedWithin10Minutes'),
          buttons: [
            {
              id: 'default',
              type: 'default'
            }
          ]
        },
        function (buttonId) {
          console.log('Нажата кнопка:', buttonId)
        }
      )
    } else {
      throw new Error(backendResult.message || 'Ошибка верификации задания')
    }
  } catch (error) {
    console.error('[Tasks] Ошибка при верификации задания:', error)
    showPopup(
      {
        title: getTranslation('error'),
        message: getTranslation('failedToVerifyTask'),
        buttons: [
          {
            id: 'cancel',
            type: 'cancel'
          }
        ]
      },
      function (buttonId) {
        console.log('Нажата кнопка:', buttonId)
      }
    )
  }
}

const onTaskReject = (task) => {
  console.warn('[Tasks] Задание отклонено:', task)
  showPopup(
    {
      title: getTranslation('taskRejected'),
      message: getTranslation('taskExecutionRejected'),
      buttons: [
        {
          id: 'cancel',
          type: 'cancel' // или 'default', 'cancel', 'destructive'
        }
      ]
    },
    function (buttonId) {
      console.log('Нажата кнопка:', buttonId) // 'ok'
    }
  )
}

// Функция для клика на оригинальную кнопку Traffy по индексу
const clickOriginalButton = (taskIndex) => {
  nextTick(() => {
    // Находим все оригинальные кнопки Traffy
    const originalButtons = document.querySelectorAll(
      '.traffy-custom .traffy-taskElementButtonContOuter'
    )

    if (originalButtons && originalButtons.length > taskIndex) {
      originalButtons[taskIndex].click()
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
  isLoadingBalance.value = true
  try {
    const payload = {
      user_id: userStore.getUserId()
    }
    const result = await sendToBackend('/get_user_balance_stars', payload)
    if (result.status === 'success') {
      tasksBalance.value = result.data.balance || 0
    }
  } catch (error) {
    console.error('[Tasks] Failed to fetch tasks balance:', error)
  } finally {
    isLoadingBalance.value = false
  }
}

// Открытие модального окна вывода с обновлением баланса
const openWithdrawModal = async () => {
  await fetchTasksBalance()
  toggleModal('withdrawtasksstars')
}

// Инициализация Traffy
const initTraffy = () => {
  try {
    window.Traffy.renderTasks(traffyTasks.value, {
      max_tasks: 10, // Максимальное количество заданий
      onTaskLoad,
      onTaskRender,
      onTaskReward,
      onTaskReject
    })
  } catch (error) {
    console.error('[Tasks] Ошибка инициализации Traffy:', error)
    loadingError.value = true
  }
}

onMounted(async () => {
  try {
    await fetchTasksBalance()
    initTraffy()
  } catch (error) {
    console.error('[Tasks] Не удалось загрузить Traffy:', error)
  }
})
</script>

<template>
  <main class="gap-12 p-24">
    <!-- Полоска с балансом и кнопкой вывода -->
    <div
      class="balance-section flex-row items-center jcsb bg-blue-900 rounded-12 p-16 text-16 gap-4"
    >
      <div
      class="flex-row items-center gap-4">
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
    <div
      v-if="tasks && tasks.length > 0"
      v-for="(task, index) in tasks"
      :key="task.id"
      class="task-card bg-blue-900 rounded-12 items-center"
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
