import router from "./router/index.js";

(async () => {
  const unsafe = window.Telegram?.WebApp?.initDataUnsafe;
  const already = sessionStorage.getItem("start_param_processed");

  if (!already && unsafe?.start_param) {
    try {
      const parsed = JSON.parse(atob(unsafe.start_param));
      if (parsed?.path && parsed.path !== window.location.pathname) {
        sessionStorage.setItem("start_param_processed", "1");
        await router.push(parsed.path);
      }
    } catch (e) {
      console.warn("[main.js] invalid start_param", e);
    }
  }

  // временно: загружаем сразу без isReady
  import("./load-app.js");
})();