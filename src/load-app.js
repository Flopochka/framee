import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import WebApp from "@twa-dev/sdk";
import { sendToBackend } from "./modules/fetch.js";
import "./style.css";

console.log("[load-app] загрузка приложения...");

// Функция для проверки, что это не мобильное устройство
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
    navigator.userAgent
  );
}

// Если это не мобильное устройство, выходим из полноэкранного режима
if (!isMobileDevice()) {
  console.log("[load-app] не мобильное устройство");
  WebApp.exitFullscreen().catch((error) => {
    console.error(
      "[load-app] Не удалось выйти из полноэкранного режима:",
      error
    );
  });
} else {
  console.log("[load-app] мобильное устройство");
}

WebApp.ready();

console.log("[load-app] загрузка приложения...");

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.mount("#app");

WebApp.ready();

const user = WebApp.initDataUnsafe?.user;

let start = {};
try {
  start = JSON.parse(atob(WebApp.initDataUnsafe?.start_param || ""));
} catch {}

sendToBackend("/update_user_info", {
  user_id: user?.id,
  referral: start.referal ? JSON.stringify(start.referal) : "0",
  lang: user?.language_code,
  username: user?.username,
  photo_url: user?.photo_url,
  name: user?.first_name,
});

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
