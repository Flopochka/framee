import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from './router';
import telegramAnalytics from "@telegram-apps/analytics";

const app = createApp(App);
app.use(createPinia()); // Подключаем Pinia
app.use(router); // Подключаем Vue Router
app.mount('#app');

// TGWebApp
window.onload = () => {
  const tg = window.Telegram.WebApp;
  // tg.expand();

  tg.setHeaderColor("#000000"); // Цвет заголовка
  tg.setBackgroundColor("#000000"); // Цвет фона
  tg.disableVerticalSwipes();

  tg.ready();

  if (
    window.innerWidth <= 768 &&
    !window.Telegram.WebApp.initDataUnsafe
    // &&
    // !window.location.pathname.includes("about")
  ) {
    // window.location.href = "https://t.me/Framestars_bot/start";
    // window.location.href = "https://t.me/fremeetstbot/start";
  }
};

// TGAnalytics
// telegramAnalytics.init({
//   token: "",
//   appName: "FRAME",
// });
