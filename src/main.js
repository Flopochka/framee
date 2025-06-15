import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import WebApp from "@twa-dev/sdk";
import { sendToBackend } from "./modules/fetch.js";
import "./style.css";

console.log("[main.js] инициализация приложения...");

// Функция для проверки мобильного устройства
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Инициализация приложения
async function initializeApp() {
  const app = createApp(App);
  const pinia = createPinia();
  
  app.use(pinia);
  app.use(router);
  
  app.mount("#app");
  WebApp.ready();

  // Инициализация хранилищ
  const screenStore = pinia.state.value.screen;
  const modalStore = pinia.state.value.modal;

  // Выход из полноэкранного режима для десктопов
  try {
    if (!isMobileDevice()) {
      console.log("[main.js] не мобильное устройство");
      WebApp.exitFullscreen();
    }
  } catch (e) {
    console.warn("[main.js] ошибка при выходе из полноэкранного режима", e);
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
        const [path, queryString] = parsed.path.split('?');
        const queryParams = new URLSearchParams(queryString);
        const modalName = queryParams.get('modal');
        
        // Навигация к нужному экрану
        const screenMap = {
          "/": 0,
          "/tasks": 1,
          "/about": 2,
          "/profile": 3,
          "/withdraw": 4,
        };
        
        const screenIndex = screenMap[path] ?? 0;
        await screenStore.switchScreen(screenIndex);
        
        // Открытие модального окна, если указано
        if (modalName) {
          modalStore.toggleModal(modalName);
        }
      }
    } catch (e) {
      console.warn("[main.js] неверный start_param", e);
    }
  }

  // Синхронизация с текущим URL после загрузки
  const syncWithCurrentRoute = () => {
    const currentPath = router.currentRoute.value.path;
    const modalName = router.currentRoute.value.query.modal;
    
    screenStore.syncWithRoute(currentPath);
    
    if (modalName) {
      modalStore.toggleModal(modalName);
    } else if (modalStore.activeModal) {
      modalStore.toggleModal(modalStore.activeModal); // Закрыть если нет в URL
    }
  };

  // Первоначальная синхронизация
  syncWithCurrentRoute();
  
  // Следим за изменениями маршрута
  router.afterEach((to) => {
    screenStore.syncWithRoute(to.path);
    
    if (to.query.modal) {
      modalStore.toggleModal(to.query.modal);
    } else if (modalStore.activeModal) {
      modalStore.toggleModal(modalStore.activeModal); // Закрыть если нет в URL
    }
  });

  // Отправка информации о пользователе
  const user = unsafe?.user;
  let start = {};
  try {
    start = JSON.parse(atob(unsafe?.start_param || ""));
  } catch {}

  sendToBackend("/update_user_info", {
    user_id: user?.id,
    referral: start.referal ? JSON.stringify(start.referal) : "0",
    lang: user?.language_code,
    username: user?.username,
    photo_url: user?.photo_url,
    name: user?.first_name,
  });

  // Запрос прав на запись
  function requestAccessLoop() {
    WebApp.requestWriteAccess((isGranted) => {
      if (isGranted) return;

      WebApp.showAlert(
        "Разрешение необходимо, чтобы бот мог отправлять вам сообщения."
      );
      setTimeout(requestAccessLoop, 500);
    });
  }

  requestAccessLoop();
}

initializeApp().catch((e) => {
  console.error("[main.js] ошибка инициализации приложения:", e);
});