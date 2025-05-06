import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
const tg = window.Telegram.WebApp;
tg.ready(); // уведомляем Telegram, что WebApp готов
tg.expand(); // разворачиваем на весь экран
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");