export function initBookingForm() {
  console.log('🛠 Функция initBookingForm запущенa'); // Лог 1

  const bookingForm = document.getElementById('booking-form');
  const modal = document.getElementById('booking-modal');

  if (!bookingForm) {
    console.error("❌ ОШИБКА: Форма с id='booking-form' не найдена в HTML!");
    return;
  }

  console.log('✅ Форма найдена, вешаю обработчик событий'); // Лог 2

  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log('🚀 Кнопка нажата! Начинаю сбор данных...'); // Лог 3

    const submitBtn = bookingForm.querySelector('.btn-submit');

    // Проверка наличия полей (чтобы не упасть с ошибкой)
    const nameField = bookingForm.querySelector('[name="name"]');
    const phoneField = bookingForm.querySelector('[name="phone"]');
    const serviceField = bookingForm.querySelector('[name="service"]');

    if (!nameField || !phoneField) {
      console.error(
        '❌ ОШИБКА: Не найдены поля name или phone. Проверь атрибут name в HTML!'
      );
      return;
    }

    const formData = {
      name: nameField.value,
      phone: phoneField.value,
      message: `Послуга: ${serviceField ? serviceField.value : 'Не выбрана'}`,
    };

    console.log('отправляю данные:', formData); // Лог 4

    try {
      submitBtn.disabled = true;
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Статус ответа сервера:', response.status); // Лог 5

      if (response.ok) {
        alert('Дякуємо! Заявка успішно відправлена.');
        bookingForm.reset();
        modal.close();
      } else {
        const errorData = await response.json();
        console.error('Сервер вернул ошибку:', errorData);
      }
    } catch (error) {
      console.error('🔥 КРИТИЧЕСКАЯ ОШИБКА при отправке:', error);
    } finally {
      submitBtn.disabled = false;
    }
  });
}
