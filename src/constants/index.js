/**
 * Константы приложения
 */

// Лимиты для ввода
export const INPUT_LIMITS = {
  MAX_USERNAME_LENGTH: 45,
  MAX_STARS_AMOUNT: 1000000,
  MIN_STARS_TON: 50,
  MIN_STARS_OTHER: 100
}

// Задержки и таймауты
export const TIMEOUTS = {
  KEYBOARD_BLUR_DELAY: 100,
  PRELOADER_DURATION: 4000,
  PRELOADER_FADE_DURATION: 200,
  REQUEST_ACCESS_RETRY: 500,
  PAYMENT_CHECK_RETRY_DELAYS: [
    1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000,
    13000, 14000, 15000
  ]
}

// Настройки инкремента
export const INCREMENT_CONFIG = {
  INITIAL_DELAY: 1000,
  MIN_DELAY: 50,
  SPEED_FACTOR: 1.33,
  HOLD_DELAY: 500
}

// Маршруты приложения
export const ROUTES = {
  MAIN: '/',
  TASKS: '/tasks',
  ABOUT: '/about',
  PROFILE: '/profile',
  WITHDRAW: '/withdraw'
}

// Типы платежей
export const PAYMENT_TYPES = {
  TON: 'TON',
  USDT: 'USDT',
  SBP: 'SBP',
  VISA_MASTERCARD: 'VM'
}

// Типы контента
export const CONTENT_TYPES = {
  STARS: 0,
  PREMIUM: 1,
  WITHDRAW_STARS: 2,
  WITHDRAW_TON: 3
}

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NO_TELEGRAM_DATA:
    '[fetch] No Telegram initData — WebApp probably opened outside Telegram.',
  INVALID_START_PARAM: '[main.js] неверный start_param',
  LAZY_LOAD_FAILED: 'Lazy load failed:',
  LOZAD_INIT_FAILED: 'Lozad init failed:',
  PAYMENT_CHECK_FAILED: 'Initial payment check failed:',
  HISTORY_FETCH_FAILED: 'Failed to fetch user history:'
}

// Классы CSS
export const CSS_CLASSES = {
  LAZY_IMG: 'lazy-img',
  LAZY_BG: 'lazy-bg',
  INCORRECT: 'incorrect',
  ACTIVE: 'active'
}
