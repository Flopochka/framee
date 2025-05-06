<script setup>
import MenuModule from "./components/MenuModule.vue";
import MainStars from "./components/MainStars.vue";
import Tasks from "./components/Tasks.vue";
import AboutUs from "./components/AboutUs.vue";
import Profile from "./components/Profile.vue";
import ModalScreens from "./components/ModalScreens.vue";
import WithdrawScreen from "./components/WithdrawScreen.vue";
import telegramAnalytics from "@telegram-apps/analytics";
import { useRoute } from "vue-router";
import { useScreenStore } from "./stores/screen";
import { initInputNumberHandler } from "./modules/inputNumber";
import { initInputTextHandler } from "./modules/inputText";
import { onMounted, onBeforeUnmount, watch } from "vue";
import lozad from "lozad";

const { getCurrentScreen, syncWithRoute } = useScreenStore();
const route = useRoute();

// Синхронизация маршрута со стором
watch(
  () => route.path,
  (newPath) => {
    syncWithRoute(newPath);
  },
  { immediate: true }
);

// Инициализация Telegram Web App
let telegramApp;
let observer;

onMounted(() => {
  // Инициализация аналитики (раскомментируй и укажи токен)
  // telegramAnalytics.init({
  //   token: "",
  //   appName: "FRAME",
  // });

  // Инициализация lazy-loading
  try {
    observer = lozad(".lazy-img, .lazy-bg", {
      loaded: (el) => {
        console.log("Lazy loaded:", el);
      },
      error: (el) => {
        console.error("Lazy load failed:", el);
      },
    });
    observer.observe();
  } catch (error) {
    console.error("Lozad init failed:", error);
  }

  // Инициализация обработчиков ввода
  initInputNumberHandler();
  initInputTextHandler();
});

onBeforeUnmount(() => {
  if (observer) {
    observer.observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <span class="blur-box">
    <span class="land-fill"></span>
    <span class="smosh">
      <div class="smosh1"></div>
      <div class="smosh2"></div>
      <div class="smosh3"></div>
    </span>
  </span>
  <div
    class="screen"
    :style="{ transform: `translateX(-${getCurrentScreen() * 100}vw)` }"
  >
    <div class="screen-item">
      <MainStars />
    </div>
    <div class="screen-item">
      <Tasks />
    </div>
    <div class="screen-item">
      <AboutUs />
    </div>
    <div class="screen-item">
      <Profile />
    </div>
    <div class="screen-item">
      <WithdrawScreen />
    </div>
  </div>
  <MenuModule />
  <ModalScreens />
</template>

<style scoped>
.screen {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: calc(100vw * 5);
  transition: transform 0.3s;
  position: relative;
  height: 100vh;
}
.screen-item {
  overflow-x: hidden;
  overflow-y: visible;
  height: calc(100vh - 84px);
  transition: max-height 0.3s;
  width: 100%;
  position: relative;
}
.blur-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
  filter: blur(225.8px);
}
.land-fill {
  width: 100%;
  height: 100vh;
  background: var(--blue-950);
}
.smosh {
  position: absolute;
  width: 133%;
  height: 133vh;
  bottom: 0;
  left: -16.5%;
  filter: blur(165.1px);
}
.smosh1,
.smosh2,
.smosh3 {
  width: 39%;
  height: 15.6%;
  position: absolute;
  border-radius: 50%;
  background: #d9d9d94d;
}
.smosh1 {
  width: 100%;
  height: 40%;
  top: 0;
  left: 0;
}
.smosh2 {
  bottom: 0;
  left: 0;
}
.smosh3 {
  bottom: 25%;
  right: 0;
}
</style>
