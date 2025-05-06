import { createApp } from "vue";
import { createPinia } from "pinia";
import { init, WebApp } from "@telegram-apps/sdk-vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
init().then(() => {
  WebApp.expand(); // разворачиваем на весь экран
});
const app = createApp(App);
app.use(createPinia()); // Подключаем Pinia
app.use(router); // Подключаем Vue Router
app.mount("#app");
