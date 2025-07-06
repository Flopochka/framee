/**
 * Утилиты для определения типа устройства
 */

/**
 * Проверяет, является ли устройство мобильным
 * @returns {boolean}
 */
export function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
    navigator.userAgent
  )
}

/**
 * Проверяет, находится ли приложение внутри Telegram
 * @returns {boolean}
 */
export function isInsideTelegram() {
  return window.Telegram?.WebApp?.platform !== 'unknown'
}

/**
 * Получает информацию о пользователе из Telegram WebApp
 * @returns {object|null}
 */
export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null
}

/**
 * Получает initData из Telegram WebApp
 * @returns {string|null}
 */
export function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || null
}
