function initInputTextHandler() {
    const inputs = document.querySelectorAll('input[type="text"]');
  
    inputs.forEach(input => {
      const maxLength = input.hasAttribute('maxlength') ? parseInt(input.maxLength) : undefined;
  
      // Обработчик ввода
      input.addEventListener('input', (e) => {
        let value = e.target.value;
  
        // Если пустая строка
        if (value === '') {
          e.target.value = '';
          e.target.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
  
        // Проверяем максимальную длину
        if (maxLength !== undefined && value.length > maxLength) {
          // Обрезаем до максимальной длины
          e.target.value = value.slice(0, maxLength);
          e.target.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
  
        // Обновляем значение и синхронизируем с v-model
        e.target.value = value;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
      });
  
      // Обработчик при потере фокуса
      input.addEventListener('blur', (e) => {
        let value = e.target.value;
  
        // Проверяем максимальную длину при потере фокуса
        if (maxLength !== undefined && value.length > maxLength) {
          e.target.value = value.slice(0, maxLength);
          e.target.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
  }
  
  // Выполняем инициализацию при загрузке DOM
  document.addEventListener('DOMContentLoaded', initInputTextHandler);
  
  // Экспортируем для использования в модулях
  export { initInputTextHandler };