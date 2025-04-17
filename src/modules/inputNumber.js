function initInputNumberHandler() {
  const inputs = document.querySelectorAll('input[type="number"]');

  inputs.forEach(input => {
    const min = input.hasAttribute('min') ? parseFloat(input.min) : undefined;
    const max = input.hasAttribute('max') ? parseFloat(input.max) : undefined;

    // Обработчик ввода
    input.addEventListener('input', (e) => {
      let value = e.target.value;

      // Удаляем нечисловые символы (кроме точки для дробных)
      value = value.replace(/[^0-9.]/g, '');

      // Если пустая строка
      if (value === '') {
        // Вызываем событие input для синхронизации с v-model
        e.target.value = '';
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      const numValue = parseFloat(value);

      // Проверяем максимум
      if (max !== undefined && numValue > max) {
        // Вместо удаления цифры устанавливаем максимум
        e.target.value = max;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      // Обновляем значение и синхронизируем с v-model
      e.target.value = value;
      e.target.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Обработчик при потере фокуса
    input.addEventListener('blur', (e) => {
      const value = parseFloat(e.target.value);

      // Проверяем минимум
      if (min !== undefined && (isNaN(value) || value < min)) {
        e.target.value = min;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });
}

// Выполняем инициализацию при загрузке DOM
document.addEventListener('DOMContentLoaded', initInputNumberHandler);

// Экспортируем для использования в модулях
export { initInputNumberHandler };