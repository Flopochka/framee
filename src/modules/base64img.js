export function getImageSrc(base64) {
  if (!base64 || typeof base64 !== 'string') {
    console.error('Base64 строка не передана или не является строкой');
    return '';
  }

  // Удалить префикс data:image/...;base64, если он есть
  let cleaned = base64.replace(/^data:image\/(png|svg\+xml);base64,/, '').trim();

  // Попробовать декодировать URL-кодированную строку
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (e) {
    console.warn('Не удалось декодировать URL-кодированную строку:', e);
  }

  // Удалить пробелы и лишние = в конце
  cleaned = cleaned.replace(/\s+/g, '').replace(/=+$/, '');

  // Проверка на валидные base64-символы
  if (!/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
    console.error('Строка содержит недопустимые символы для base64:', cleaned);
    return '';
  }

  // Проверка длины (должна быть кратна 4)
  if (cleaned.length % 4 !== 0) {
    console.warn('Некорректная длина base64-строки, добавляем padding');
    cleaned = cleaned.padEnd(cleaned.length + (4 - (cleaned.length % 4)), '=');
  }

  // Попробуем декодировать
  try {
    atob(cleaned);
  } catch (e) {
    console.error('Некорректная base64 строка:', e);
    return '';
  }

  // Определяем тип: SVG или PNG
  const mime = cleaned.startsWith('PHN2') ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,${cleaned}`;
}