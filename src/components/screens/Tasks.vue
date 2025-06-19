<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useLanguageStore } from "../../stores/language";
import { sendToBackend } from "../../modules/fetch";
import WebApp from "@twa-dev/sdk";

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

const onTaskReward = async (task, signedToken) => {
  console.log("[Tasks] Задание выполнено:", task);
  try {
    // Формируем payload для TON транзакции
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 секунд на подпись
      messages: [
        {
          address: task.address, // Адрес получателя из задания
          amount: task.amount, // Сумма из задания
          payload: signedToken // Подписанный токен как payload
        }
      ]
    };

    // Отправляем транзакцию через TonConnect
    const result = await window.TonConnectUI.sendTransaction(transaction, {
      modals: ['before', 'success', 'error'],
      notifications: ['before', 'success', 'error']
    });

    console.log("[Tasks] Транзакция отправлена:", result);

    // После успешной отправки транзакции, отправляем данные на наш бэкенд
    const backendPayload = {
      user_id: useUserStore().getUserId(),
      task_id: task.id,
      signed_token: signedToken,
      transaction_boc: result.boc // Добавляем BOC транзакции
    };
    
    const backendResult = await sendToBackend("/verify_traffy_task", backendPayload);
    
    if (backendResult.status === "success") {
      WebApp.showPopup(
        {
          title: "Задание выполнено",
          message: "Задание выполнено, красава машина вау",
          buttons: [
            {
              id: "default",
              type: "default",
            },
          ],
        },
        function (buttonId) {
          console.log("Нажата кнопка:", buttonId);
        }
      );
    } else {
      throw new Error(backendResult.message || "Ошибка верификации задания");
    }
  } catch (error) {
    console.error("[Tasks] Ошибка при верификации задания:", error);
    WebApp.showPopup(
      {
        title: "Ошибка",
        message: "Не удалось верифицировать задание. Попробуйте позже.",
        buttons: [
          {
            id: "cancel",
            type: "cancel",
          },
        ],
      },
      function (buttonId) {
        console.log("Нажата кнопка:", buttonId);
      }
    );
  }
};

const onTaskReject = (task) => {
  console.warn("[Tasks] Задание отклонено:", task);
  WebApp.showPopup(
    {
      title: "Задание отклонено",
      message: "Выполнение задания отклонено, попробуйте снова",
      buttons: [
        {
          id: "cancel",
          type: "cancel", // или 'default', 'cancel', 'destructive'
        },
      ],
    },
    function (buttonId) {
      console.log("Нажата кнопка:", buttonId); // 'ok'
    }
  );
};

// Функция для клика на оригинальную кнопку Traffy по индексу
const clickOriginalButton = (taskIndex) => {
  nextTick(() => {
    // Находим все оригинальные кнопки Traffy
    const originalButtons = document.querySelectorAll(
      ".traffy-custom .traffy-taskElementButtonContOuter"
    );

    if (originalButtons && originalButtons.length > taskIndex) {
      originalButtons[taskIndex].click();
      console.log(
        `[Tasks] Клик на оригинальную кнопку для задания с индексом ${taskIndex}`
      );
    } else {
      console.warn(
        `[Tasks] Оригинальная кнопка для задания с индексом ${taskIndex} не найдена`
      );
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
        {{ task.title || "Task title"
        }}{{ task.description ? ", " + task.description : "" }}
      </p>
      <div
        class="task-btn rounded-8 lh-22 letter-spacing-04 text-white cupo usen"
        @click="clickOriginalButton(index)"
      >
        {{ getTranslation("start") }}
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
.task-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 3px 11px;
  grid-area: B;
  width: fit-content;
  justify-self: end;
}
</style>
