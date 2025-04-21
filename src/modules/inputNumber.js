function initInputNumberHandler() {
  const inputs = document.querySelectorAll('input[type="number"]');

  inputs.forEach(input => {
    const min = input.hasAttribute('min') ? parseFloat(input.min) : undefined;
    const max = input.hasAttribute('max') ? parseFloat(input.max) : undefined;
    let isProgrammatic = false; // Flag to prevent recursive event handling

    // Обработчик ввода
    input.addEventListener('input', (e) => {
      if (isProgrammatic) return; // Skip if event is programmatic

      let value = e.target.value;

      // Удаляем нечисловые символы (кроме точки для дробных)
      value = value.replace(/[^0-9.]/g, '');

      // Если пустая строка
      if (value === '') {
        e.target.value = '';
        isProgrammatic = true;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
        isProgrammatic = false;
        return;
      }

      const numValue = parseFloat(value);

      // Проверяем максимум
      if (max !== undefined && numValue > max) {
        e.target.value = max;
        isProgrammatic = true;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
        isProgrammatic = false;
        return;
      }

      // Обновляем значение и синхронизируем с v-model
      e.target.value = value;
      isProgrammatic = true;
      e.target.dispatchEvent(new Event('input', { bubbles: true }));
      isProgrammatic = false;
    });

    // Обработчик при потере фокуса
    input.addEventListener('blur', (e) => {
      const value = parseFloat(e.target.value);

      // Проверяем минимум
      if (min !== undefined && (isNaN(value) || value < min)) {
        e.target.value = min;
        isProgrammatic = true;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
        isProgrammatic = false;
      }
    });
  });
}

// Выполняем инициализацию при загрузке DOM
document.addEventListener('DOMContentLoaded', initInputNumberHandler);

// Экспортируем для использования в модулях
export { initInputNumberHandler };