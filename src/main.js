import { createApp } from "vue";
import { createPinia } from "pinia";
import { sendToBackend } from "./modules/fetch";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import WebApp from "@twa-dev/sdk";

async function precheckRedirect() {
  if (!import.meta.env.PROD) {
    console.log("[Env] Режим: DEV. Пропускаем обработку initData.");
    return null;
  }

  const initDataRaw = window.Telegram?.WebApp?.initData;
  if (!initDataRaw) {
    console.warn("[InitData] initData отсутствует! Перенаправляем в бота…");
    window.location.href = "https://t.me/Framestars_bot";
    return "redirected";
  }

  const alreadyRedirected = sessionStorage.getItem("start_param_processed");
  if (alreadyRedirected) return null;

  const unsafe = window.Telegram.WebApp.initDataUnsafe;
  const rawBase64 = unsafe?.start_param;

  if (rawBase64) {
    try {
      const jsonStr = atob(rawBase64);
      const parsed = JSON.parse(jsonStr);

      if (parsed.path && parsed.path !== window.location.pathname) {
        sessionStorage.setItem("start_param_processed", "1");
        console.log(`[Redirect] Перенаправление на ${parsed.path}`);
        window.location.replace(parsed.path); // мгновенный переход
        return "redirected";
      }
    } catch (err) {
      console.error("[StartParam] Ошибка при разборе start_param:", err);
    }
  }

  return null;
}

async function initApp() {
  console.log("[App Init] Запуск приложения…");

  const precheck = await precheckRedirect();
  if (precheck === "redirected") return;

  WebApp.ready();
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  await router.isReady();
  app.mount("#app");
  console.log("[Vue] Приложение смонтировано.");

  const user = WebApp.initDataUnsafe?.user;
  const referal = (() => {
    try {
      const jsonStr = atob(WebApp.initDataUnsafe?.start_param || "");
      const parsed = JSON.parse(jsonStr);
      return parsed?.referal ?? 0;
    } catch {
      return 0;
    }
  })();

  const payload = {
    user_id: user?.id,
    referral:
      typeof referal === "object"
        ? JSON.stringify(referal)
        : String(referal ?? ""),
    lang: user?.language_code,
    username: user?.username,
    photo_url: user?.photo_url,
    name: user?.first_name,
  };

  function requestAccessLoop() {
    Telegram.WebApp.requestWriteAccess((isGranted) => {
      if (isGranted) return;

      Telegram.WebApp.showAlert(
        "Разрешение необходимо, чтобы бот мог отправлять вам сообщения."
      );
      setTimeout(requestAccessLoop, 500);
    });
  }

  requestAccessLoop();
  sendToBackend("/update_user_info", payload);
}

initApp();
