import { createApp } from "vue";
import { createPinia } from "pinia";
import { sendToBackend } from "./modules/fetch";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import WebApp from "@twa-dev/sdk";

async function initApp() {
  console.log("[App Init] Запуск приложения…");

  let redirectPath = null;
  let referal = 0;

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
            redirectPath = parsed.path;
          }
          if (parsed.referal) {
            referal = parsed.referal;
          }
        } catch (err) {
          console.error("[StartParam] Ошибка при разборе start_param:", err);
        }
      }
    }
  } else {
    console.log("[Env] Режим: DEV. Пропускаем обработку initData.");
  }
  console.log("[WebApp] WebApp.ready() вызван");
  WebApp.ready();
  console.log("[Vue] Монтирование Vue-приложения…");
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  await router.isReady();
  app.mount("#app");
  console.log("[Vue] Приложение смонтировано.");

  const user = WebApp.initDataUnsafe?.user;
  const payload = {
    user_id: user?.id,
    referral:
      typeof referral === "object"
        ? JSON.stringify(referral)
        : String(referal ?? ""),
    lang: user?.language_code,
    username: user?.username,
    photo_url: user?.photo_url,
    name: user?.first_name,
  };

  sendToBackend("/update_user_info", payload);

  // Перенаправление через роутер
  if (redirectPath && router.currentRoute.value.path !== redirectPath) {
    console.log(`[Router] Переход на: ${redirectPath}`);
    router.push(redirectPath);
  }
}

initApp();
