import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import WebApp from "@twa-dev/sdk";
import { sendToBackend } from "./modules/fetch.js";
import "./style.css";

console.log("[load-app] загрузка приложения...");

// Проверяем, если на ПК — выходим из полноэкранного режима
if (window.innerWidth > 1024) {
  if (document.fullscreenElement) {
    document.exitFullscreen().then(() => {
      console.log("[load-app] Выход из полноэкранного режима.");
    }).catch((error) => {
      console.error("[load-app] Не удалось выйти из полноэкранного режима:", error);
    });
  }
}

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

WebApp.requestWriteAccess((granted) => {
  if (!granted) {
    WebApp.showAlert("Пожалуйста, разрешите доступ к сообщениям.");
  }
});
