import WebApp from '@twa-dev/sdk'

/**
 * Утилиты для работы с Telegram WebApp
 */

/**
 * Показывает popup с заданными параметрами
 * @param {object} options - Опции popup
 * @param {string} options.title - Заголовок
 * @param {string} options.message - Сообщение
 * @param {Array} options.buttons - Кнопки
 * @param {Function} callback - Callback функция
 */
export function showPopup(options, callback) {
  WebApp.showPopup(options, callback)
}

/**
 * Показывает alert с сообщением
 * @param {string} message - Сообщение для показа
 */
export function showAlert(message) {
  WebApp.showAlert(message)
}

/**
 * Запрашивает права на запись сообщений
 * @param {Function} callback - Callback функция
 */
export function requestWriteAccess(callback) {
  WebApp.requestWriteAccess(callback)
}

/**
 * Выходит из полноэкранного режима
 */
export function exitFullscreen() {
  WebApp.exitFullscreen()
}

/**
 * Запрашивает полноэкранный режим
 */
export function requestFullscreen() {
  WebApp.requestFullscreen()
}

/**
 * Готовит WebApp к работе
 */
export function ready() {
  WebApp.ready()
}

/**
 * Получает start_param из Telegram WebApp
 * @returns {object|null}
 */
export function getStartParam() {
  const unsafe = WebApp.initDataUnsafe
  if (!unsafe?.start_param) return null

  try {
    return JSON.parse(atob(unsafe.start_param))
  } catch (e) {
    console.warn('[telegram] Неверный start_param:', e)
    return null
  }
}
