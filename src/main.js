import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import WebApp from "@twa-dev/sdk";
WebApp.ready();
// if (!window.Telegram.WebApp.initData) {window.location = "https://t.me/Framestars_bot"}
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
