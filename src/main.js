import App from './App.vue'
import router from './router/index.js'
import WebApp from '@twa-dev/sdk'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { sendToBackend } from './modules/fetch.js'
import { useScreenStore } from './stores/screen'
import { useModalStore } from './stores/modal'
import './style.css'

console.log('[main.js] инициализация приложения...')

import { isMobileDevice, isInsideTelegram, getTelegramUser, getTelegramInitData } from './utils/device.js'
import { ready, exitFullscreen, requestFullscreen, showAlert, getStartParam } from './utils/telegram.js'
import { TIMEOUTS, ERROR_MESSAGES } from './constants/index.js'

// Инициализация приложения
async function initializeApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  app.mount('#app')
  ready()

  // Ждём длительность видео, затем плавно скрываем прелоадер
  const preloader = document.getElementById('preloader-wrapper')
  const video = preloader?.querySelector('.preloader-video')
  const duration = TIMEOUTS.PRELOADER_DURATION
  setTimeout(() => {
    if (preloader) {
      preloader.style.transition = `opacity ${TIMEOUTS.PRELOADER_FADE_DURATION}ms`
      preloader.style.opacity = '0'
      setTimeout(() => preloader.remove(), TIMEOUTS.PRELOADER_FADE_DURATION + 20)
    }
  }, duration)

  const telegramInside = isInsideTelegram()

  // Выход из полноэкранного режима для десктопов
  if (telegramInside) {
    try {
      if (!isMobileDevice()) {
        console.log('[main.js] не мобильное устройство')
        exitFullscreen()
      } else {
        requestFullscreen()
      }
    } catch (e) {
      console.error('[main.js] ошибка при выходе из полноэкранного режима', e)
    }
  }

  // Обработка start_param
  const startParamProcessed = sessionStorage.getItem('start_param_processed')
  const startParam = getStartParam()

  if (!startParamProcessed && startParam?.path) {
    try {
      sessionStorage.setItem('start_param_processed', '1')

      // Разбираем путь и параметры
      const [path, queryString] = startParam.path.split('?')
      const queryParams = new URLSearchParams(queryString)
      const modalName = queryParams.get('modal')

      // Навигация к нужному экрану
      useScreenStore.syncWithRoute(path)

      // Открытие модального окна, если указано
      if (modalName) {
        useModalStore.toggleModal(modalName)
      }
    } catch (e) {
      console.warn(ERROR_MESSAGES.INVALID_START_PARAM, e)
    }
  }

  // Отправка информации о пользователе
  const user = getTelegramUser()
  const start = startParam || {}

  if (telegramInside) {
    sendToBackend('/update_user_info', {
      user_id: user?.id,
      referral: start.referal ? JSON.stringify(start.referal) : '0',
      lang: user?.language_code,
      username: user?.username,
      photo_url: user?.photo_url,
      name: user?.first_name
    })
  }

  // Запрос прав на запись
  function requestAccessLoop() {
    WebApp.requestWriteAccess((isGranted) => {
      if (isGranted) return

      showAlert(
        'Для корректной работы приложения необходимо разрешить боту отправлять сообщения.'
      )
      setTimeout(requestAccessLoop, TIMEOUTS.REQUEST_ACCESS_RETRY)
    })
  }

  if (telegramInside) {
    requestAccessLoop()
  }
}

initializeApp().catch((e) => {
  console.error('[main.js] ошибка инициализации приложения:', e)
})
