import { createApp } from "vue";
import { createPinia } from "pinia";
import { init } from "@telegram-apps/sdk-vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

init();
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
