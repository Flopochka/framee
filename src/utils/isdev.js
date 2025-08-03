/**
 * Утилита для проверки, является ли пользователь разработчиком
 */

// Список ID разработчиков
const DEVELOPER_IDS = [227363776, 1341978600];

/**
 * Проверяет, является ли текущий пользователь разработчиком
 * @returns {boolean} true если пользователь разработчик, false в противном случае
 */
export function isDev() {
  try {
    // Проверяем режим разработки
    if (import.meta.env.DEV) {
      return true;
    }

    // Получаем пользователя из Telegram WebApp
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!user || !user.id) {
      return false;
    }

    // Проверяем, есть ли ID пользователя в списке разработчиков
    return DEVELOPER_IDS.includes(user.id);
  } catch (error) {
    console.error("Ошибка при проверке статуса разработчика:", error);
    return false;
  }
}
