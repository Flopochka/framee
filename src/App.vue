<script setup>
import MainStars from './components/screens/MainStars.vue'
import Tasks from './components/screens/Tasks.vue'
import AboutUs from './components/screens/AboutUs.vue'
import Profile from './components/screens/Profile.vue'
import WithdrawScreen from './components/screens/WithdrawScreen.vue'
import ModalScreens from './components/ModalScreens.vue'
import MenuModule from './components/MenuModule.vue'
import telegramAnalytics from '@telegram-apps/analytics'
import { useRoute } from 'vue-router'
import { useScreenStore } from './stores/screen'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import lozad from 'lozad'
import { isMobileDevice, isInsideTelegram } from './utils/device.js'
import { useKeyboard } from './composables/useKeyboard.js'
import { CSS_CLASSES, ERROR_MESSAGES } from './constants/index.js'

const { getCurrentScreen, syncWithRoute } = useScreenStore()
const route = useRoute()

// Синхронизация маршрута со стором
watch(
  () => route.path,
  (newPath) => {
    syncWithRoute(newPath)
  },
  { immediate: true }
)

let observer

const { isKeyboardOpen } = useKeyboard()

const telegramInside = isInsideTelegram()

onMounted(() => {
  // Инициализация аналитики (раскомментируй и укажи токен)
  if (telegramInside) {
    telegramAnalytics.init({
      token:
        'eyJhcHBfbmFtZSI6IkZSQU1FIiwiYXBwX3VybCI6Imh0dHBzOi8vdC5tZS9GcmFtZXN0YXJzX2JvdCIsImFwcF9kb21haW4iOiJodHRwczovL2ZyYW1lLXN0YXJzLmNvbSJ9!I+r7Qr8f0c2CpNQMdsvYo4B7ukow0dpw3pFoavLDtB0=',
      appName: 'FRAME'
    })
  }

  // Инициализация lazy-loading
  try {
    observer = lozad(`.${CSS_CLASSES.LAZY_IMG}, .${CSS_CLASSES.LAZY_BG}`, {
      error: (el) => {
        console.error(ERROR_MESSAGES.LAZY_LOAD_FAILED, el)
      }
    })
    observer.observe()
  } catch (error) {
    console.error(ERROR_MESSAGES.LOZAD_INIT_FAILED, error)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.observer.disconnect()
    observer = null
  }
})
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
    <div
      class="screen-item"
      :style="{
        height: isKeyboardOpen ? '100vh' : 'calc(100vh - 84px)',
        paddingTop: isMobileDevice() ? '84px' : '',
      }"
    >
      <MainStars />
    </div>
    <div
      class="screen-item"
      :style="{
        height: isKeyboardOpen ? '100vh' : 'calc(100vh - 84px)',
        paddingTop: isMobileDevice() ? '84px' : '',
      }"
    >
      <Tasks />
    </div>
    <div
      class="screen-item"
      :style="{
        height: isKeyboardOpen ? '100vh' : 'calc(100vh - 84px)',
        paddingTop: isMobileDevice() ? '84px' : '',
      }"
    >
      <AboutUs />
    </div>
    <div
      class="screen-item"
      :style="{
        height: isKeyboardOpen ? '100vh' : 'calc(100vh - 84px)',
        paddingTop: isMobileDevice() ? '84px' : '',
      }"
    >
      <Profile />
    </div>
    <div
      class="screen-item"
      :style="{
        height: isKeyboardOpen ? '100vh' : 'calc(100vh - 84px)',
        paddingTop: isMobileDevice() ? '84px' : '',
      }"
    >
      <WithdrawScreen />
    </div>
  </div>
  <MenuModule v-show="!isKeyboardOpen" />
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
