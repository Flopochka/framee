function initInputNumberHandler() {
  const inputs = document.querySelectorAll('input[type="number"]');

  inputs.forEach(input => {
    const max = input.hasAttribute('max') ? parseFloat(input.max) : undefined;
    let isProgrammatic = false;

    input.addEventListener('input', (e) => {
      console.log('--- Input Event Start ---');
      console.log('Input value:', e.target.value);

      if (isProgrammatic) {
        console.log('Skipping: Programmatic event');
        return;
      }

      let value = e.target.value;
      console.log('Processed value:', value);

      // Если значение пустое, не обрабатываем, чтобы не сбросить
      if (value === '') {
        console.log('Empty value, keeping as is');
        return;
      }

      const numValue = parseFloat(value);
      console.log('Parsed number:', numValue);

      // Проверяем превышение max
      if (!isNaN(numValue) && max !== undefined && numValue > max) {
        console.log(`Number ${numValue} exceeds max ${max}`);
        // Если число целое и на 1 больше max, удаляем последнюю цифру
        if (Number.isInteger(numValue) && numValue === max + 1) {
          console.log('Condition: Integer and exceeds max by 1');
          value = value.slice(0, -1);
          console.log('New value (removed last digit):', value);
        } else {
          console.log('Condition: Setting to max');
          value = max;
          console.log('New value (set to max):', value);
        }
      } else {
        console.log('No max violation, keeping value');
      }

      // Разрешаем точку в конце (например, "1.")
      if (/^\d+\.$/.test(value)) {
        console.log('Value ends with dot, keeping as is');
      }

      e.target.value = value;
      console.log('Final value:', e.target.value);
      isProgrammatic = true;
      console.log('Dispatching programmatic input event');
      e.target.dispatchEvent(new Event('input', { bubbles: true }));
      isProgrammatic = false;
      console.log('--- Input Event End ---');
    });
  });
}

document.addEventListener('DOMContentLoaded', initInputNumberHandler);
export { initInputNumberHandler };