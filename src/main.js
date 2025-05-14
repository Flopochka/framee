import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import WebApp from "@twa-dev/sdk";

async function initApp() {
  console.log("[App Init] Запуск приложения…");
  WebApp.ready();
  console.log("[WebApp] WebApp.ready() вызван");

  if (import.meta.env.PROD) {
    console.log("[Env] Режим: PROD");

    const initDataRaw = window.Telegram?.WebApp?.initData;
    console.log("[InitData] Сырые данные:", initDataRaw);

    if (!initDataRaw) {
      console.warn("[InitData] initData отсутствует! Перенаправляем в бота…");
      window.location.href = "https://t.me/Framestars_bot";
      return;
    }

    const alreadyRedirected = sessionStorage.getItem("start_param_processed");
    console.log("[StartParam] Уже обрабатывался?", alreadyRedirected);

    if (!alreadyRedirected) {
      const unsafe = window.Telegram.WebApp.initDataUnsafe;
      console.log("[InitDataUnsafe]", unsafe);

      const rawBase64 = unsafe?.start_param;
      console.log("[StartParam] Получен параметр:", rawBase64);

      if (rawBase64) {
        try {
          const jsonStr = atob(rawBase64);
          console.log("[StartParam] Декодированная строка JSON:", jsonStr);

          const parsed = JSON.parse(jsonStr);
          console.log("[StartParam] Распарсенные данные:", parsed);

          if (parsed.path) {
            sessionStorage.setItem("start_param_processed", "1");
            console.log(`[Router] Обнаружен путь: ${parsed.path} — перенаправление до монтирования`);
            window.location.replace(parsed.path);
            return;
          }
        } catch (err) {
          console.error("[StartParam] Ошибка при разборе start_param:", err);
        }
      }
    }
  } else {
    console.log("[Env] Режим: DEV. Пропускаем обработку initData.");
  }

  console.log("[Vue] Монтирование Vue-приложения…");
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount("#app");
  console.log("[Vue] Приложение смонтировано.");
}

initApp();
