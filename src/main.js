import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import telegramAnalytics from "@telegram-apps/analytics";

createApp(App).use(createPinia()).mount("#app");

// TGWebApp
window.onload = () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  //   tg.setHeaderColor("#000000");
  //   tg.setBackgroundColor("#000000");
  //   tg.setBottomBarColor("#000000");
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
