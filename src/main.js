import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import WebApp from "@twa-dev/sdk";
import { sendToBackend } from "./modules/fetch";
import "./style.css";

async function handleRedirect(router) {
  const unsafe = window.Telegram?.WebApp?.initDataUnsafe;
  if (!unsafe || !unsafe.start_param) return;

  const alreadyProcessed = sessionStorage.getItem("start_param_processed");
  if (alreadyProcessed) return;

  try {
    const parsed = JSON.parse(atob(unsafe.start_param));
    if (parsed?.path && parsed.path !== window.location.pathname) {
      sessionStorage.setItem("start_param_processed", "1");
      console.log("[Router Redirect]", parsed.path);
      await router.push(parsed.path); // без сброса JS-контекста
    }
  } catch (err) {
    console.warn("[StartParam] Ошибка парсинга start_param:", err);
  }
}

async function bootstrap() {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);

  // Выполняем возможный редирект до mount()
  await handleRedirect(router);
  await router.isReady();

  app.mount("#app");

  // Теперь безопасно: Telegram SDK готов
  WebApp.ready();

  const user = WebApp.initDataUnsafe?.user;
  const parsed = (() => {
    try {
      return JSON.parse(atob(WebApp.initDataUnsafe?.start_param || ""));
    } catch {
      return {};
    }
  })();

  const payload = {
    user_id: user?.id,
    referral: parsed?.referal ? JSON.stringify(parsed.referal) : "0",
    lang: user?.language_code,
    username: user?.username,
    photo_url: user?.photo_url,
    name: user?.first_name,
  };

  sendToBackend("/update_user_info", payload);

  WebApp.requestWriteAccess((granted) => {
    if (!granted) {
      WebApp.showAlert("Пожалуйста, разрешите доступ к сообщениям.");
    }
  });
}

bootstrap();