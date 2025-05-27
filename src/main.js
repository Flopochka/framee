// main.ts
// НЕ импортируем Telegram SDK здесь — он должен быть использован ТОЛЬКО после проверки среды

async function precheckRedirect() {
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initData;
  const unsafe = tg?.initDataUnsafe;

  if (!initData || !unsafe) {
    // Не в Telegram, безопасно завершить — можно позволить dev запуск если нужно
    if (import.meta.env.DEV) return null;
    // В проде — уходим
    window.location.href = "https://t.me/your_bot";
    return "abort";
  }

  // Проверка на повторный редирект
  const alreadyRedirected = sessionStorage.getItem("start_param_processed");
  if (alreadyRedirected) return null;

  const rawStart = unsafe?.start_param;
  if (!rawStart) return null;

  try {
    const parsed = JSON.parse(atob(rawStart));
    if (parsed?.path && parsed.path !== window.location.pathname) {
      sessionStorage.setItem("start_param_processed", "1");
      window.location.replace(parsed.path);
      return "redirected";
    }
  } catch (err) {
    console.warn("[StartParam] Ошибка парсинга:", err);
  }

  return null;
}

(async () => {
  const result = await precheckRedirect();
  if (result === "redirected" || result === "abort") return;

  // Только теперь импортируем Telegram SDK и Vue
  const { default: WebApp } = await import("@twa-dev/sdk");
  import("./style.css");

  const { createApp } = await import("vue");
  const { createPinia } = await import("pinia");
  const App = (await import("./App.vue")).default;
  const router = (await import("./router")).default;
  const { sendToBackend } = await import("./modules/fetch");

  WebApp.ready();

  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  await router.isReady();
  app.mount("#app");

  // пример payload
  const user = window.Telegram.WebApp.initDataUnsafe?.user;
  const payload = {
    user_id: user?.id,
    lang: user?.language_code,
    username: user?.username,
    photo_url: user?.photo_url,
    name: user?.first_name,
  };

  sendToBackend("/update_user_info", payload);
})();
