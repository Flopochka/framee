<script setup>
import MenuModule from "./components/MenuModule.vue";
import MainStars from "./components/MainStars.vue";
import Tasks from "./components/Tasks.vue";
import AboutUs from "./components/AboutUs.vue";
import Profile from "./components/Profile.vue";
import MadalScreens from "./components/MadalScreens.vue";
import WithdrawScreen from "./components/WithdrawScreen.vue";
import { useScreenStore } from "./stores/screen";

const { getCurrentScreen } = useScreenStore();
</script>

<template>
  <span class="smosh">
    <div class="smosh1"></div>
    <div class="smosh2"></div>
    <div class="smosh3"></div>
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
  <MadalScreens />
</template>

<style scoped>
.screen {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: calc(100vw * 5);
  transition: transform 0.3s;
  position: relative;
  height: 100vh;
  backdrop-filter: blur(165.10000610351562px);
}
.screen-item {
  overflow-x: hidden;
  overflow-y: visible;
  height: calc(100vh - 84px);
  transition: max-height 0.3s;
  width: 100%;
  position: relative;
}
.smosh {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -1;
  /* backdrop-filter: blur(165.10000610351562px) */
}
.smosh1 {
  position: absolute;
  width: 534px;
  height: 470px;
  top: -290px;
  left: -71px;
  background: #d9d9d94d;
}
.smosh2 {
  position: absolute;
  width: 207px;
  height: 182px;
  top: 401px;
  left: 252px;
  background: #d9d9d94d;
  backdrop-filter: blur(300px);
}
.smosh3 {
  position: absolute;
  width: 207px;
  height: 182px;
  top: 692px;
  left: -59px;
  background: #d9d9d94d;
}
</style>
