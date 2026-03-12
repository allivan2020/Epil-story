// 1. Функция управления модальным окном
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

// 2. Функция обработки формы и отправки в Telegram
export function initBookingForm() {
  const bookingForm = document.getElementById('booking-form');
  const modal = document.getElementById('booking-modal');

  if (!bookingForm) return;

  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;

    // СОБИРАЕМ ДАННЫЕ (с токеном капчи!)
    const formData = {
      name: bookingForm.querySelector('[name="name"]').value,
      phone: bookingForm.querySelector('[name="phone"]').value,
      // Cloudflare автоматически создает скрытое поле с этим именем
      captcha: bookingForm.querySelector('[name="cf-turnstile-response"]')
        ?.value,
      message: `Послуга: ${bookingForm.querySelector('[name="service"]')?.value || 'Не обрана'}`,
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Надсилаємо...';

      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // УСПЕХ
        bookingForm.style.display = 'none';

        const successHtml = `
          <div id="success-message" style="text-align: center; padding: 40px 20px;">
            <h2 style="color: #d4a373; margin-bottom: 15px;">Дякуємо, ${formData.name}!</h2>
            <p style="font-size: 18px; margin-bottom: 25px;">Ваша заявка успішно надіслана. <br> Ми зателефонуємо вам найближчим часом.</p>
            <button type="button" class="btn-primary" id="close-success">Зрозуміло</button>
          </div>
        `;
        bookingForm.insertAdjacentHTML('afterend', successHtml);

        document
          .getElementById('close-success')
          .addEventListener('click', () => {
            modal.close();
            setTimeout(() => {
              bookingForm.reset();
              bookingForm.style.display = 'block';
              document.getElementById('success-message')?.remove();
              submitBtn.disabled = false;
              submitBtn.textContent = originalBtnText;
              // Перезагружаем капчу для следующего раза (если нужно)
              if (window.turnstile) window.turnstile.reset();
            }, 500);
          });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Помилка: ${error.message}. Спробуйте ще раз.`);
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}
