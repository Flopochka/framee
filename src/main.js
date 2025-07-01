import App from "./App.vue";
import router from "./router/index.js";
import WebApp from "@twa-dev/sdk";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { sendToBackend } from "./modules/fetch.js";
import { useScreenStore } from "./stores/screen";
import { useModalStore } from "./stores/modal";
import "./style.css";

console.log("[main.js] инициализация приложения...");

// Функция для проверки мобильного устройства
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
    navigator.userAgent
  );
}

// Инициализация приложения
async function initializeApp() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(router);

  app.mount("#app");
  WebApp.ready();

  // Ждём длительность видео, затем плавно скрываем прелоадер
  const preloader = document.getElementById("preloader-wrapper");
  const video = preloader?.querySelector(".preloader-video");
  let duration = 4000; // fallback 2 сек
  setTimeout(() => {
    if (preloader) {
      preloader.style.transition = "opacity 200ms";
      preloader.style.opacity = "0";
      setTimeout(() => preloader.remove(), 220);
    }
  }, duration);

  const isInsideTelegram = WebApp.platform !== "unknown";

  // Выход из полноэкранного режима для десктопов
  if (isInsideTelegram) {
    try {
      if (!isMobileDevice()) {
        console.log("[main.js] не мобильное устройство");
        WebApp.exitFullscreen();
      } else {
        WebApp.requestFullscreen();
      }
    } catch (e) {
      console.error("[main.js] ошибка при выходе из полноэкранного режима", e);
    }
  }

  // Обработка start_param
  const unsafe = WebApp.initDataUnsafe;
  const startParamProcessed = sessionStorage.getItem("start_param_processed");

  if (!startParamProcessed && unsafe?.start_param) {
    try {
      const parsed = JSON.parse(atob(unsafe.start_param));

      if (parsed?.path) {
        sessionStorage.setItem("start_param_processed", "1");

        // Разбираем путь и параметры
        const [path, queryString] = parsed.path.split("?");
        const queryParams = new URLSearchParams(queryString);
        const modalName = queryParams.get("modal");

        // Навигация к нужному экрану
        useScreenStore.syncWithRoute(path);

        // Открытие модального окна, если указано
        if (modalName) {
          useModalStore.toggleModal(modalName);
        }
      }
    } catch (e) {
      console.warn("[main.js] неверный start_param", e);
    }
  }

  // Отправка информации о пользователе
  const user = unsafe?.user;
  let start = {};
  try {
    start = JSON.parse(atob(unsafe?.start_param || ""));
  } catch {}

  if (isInsideTelegram) {
    sendToBackend("/update_user_info", {
      user_id: user?.id,
      referral: start.referal ? JSON.stringify(start.referal) : "0",
      lang: user?.language_code,
      username: user?.username,
      photo_url: user?.photo_url,
      name: user?.first_name,
    });
  }

  // Запрос прав на запись
  function requestAccessLoop() {
    WebApp.requestWriteAccess((isGranted) => {
      if (isGranted) return;

      WebApp.showAlert(
        "Для корректной работы приложения необходимо разрешить боту отправлять сообщения."
      );
      setTimeout(requestAccessLoop, 500);
    });
  }

  if (isInsideTelegram) {
    requestAccessLoop();
  }
}

initializeApp().catch((e) => {
  console.error("[main.js] ошибка инициализации приложения:", e);
});
