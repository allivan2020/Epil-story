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
    // Закрываем меню, если оно открыто
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
