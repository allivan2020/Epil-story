// 1. Функция открытия/закрытия модалки (ЕЁ СЕЙЧАС НЕ ВИДИТ БРАУЗЕР)
export function initModalBooking() {
  const modal = document.getElementById('booking-modal');
  const menuList = document.querySelector('.menu-list');
  const menuBtn = document.querySelector('.menu-btn');
  const openButtons = document.querySelectorAll(
    'a[href="#booking-modal"], .btn-primary, .btn-secondary'
  );

  if (!modal) return;

  const openModal = e => {
    e.preventDefault();
    if (menuList?.classList.contains('is-open')) {
      menuList.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
    }
    modal.showModal();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.close();
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
  });
}

// 2. Твоя функция формы (с логами)
export function initBookingForm() {
  console.log('🛠 Функция initBookingForm запущенa');
  const bookingForm = document.getElementById('booking-form');
  const modal = document.getElementById('booking-modal');

  if (!bookingForm) return;

  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log('🚀 Кнопка нажата!');

    const submitBtn = bookingForm.querySelector('.btn-submit');
    const nameField = bookingForm.querySelector('[name="name"]');
    const phoneField = bookingForm.querySelector('[name="phone"]');
    const serviceField = bookingForm.querySelector('[name="service"]');

    const formData = {
      name: nameField.value,
      phone: phoneField.value,
      message: `Послуга: ${serviceField ? serviceField.value : 'Не выбрана'}`,
    };

    try {
      submitBtn.disabled = true;
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Дякуємо! Заявка успішно відправлена.');
        bookingForm.reset();
        modal.close();
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      submitBtn.disabled = false;
    }
  });
}
