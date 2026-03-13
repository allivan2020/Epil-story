export function initReviews() {
  const carousel = document.querySelector('.reviews-carousel');
  const cards = document.querySelectorAll('.review-glass-card');
  const prevBtn = document.querySelector('.reviews-prev');
  const nextBtn = document.querySelector('.reviews-next');

  if (!carousel || cards.length === 0) return;

  // --- 1. Фокус через индекс ---
  let currentIndex = 0;

  const setFocus = index => {
    cards.forEach(c => c.classList.remove('is-focused'));
    cards[index].classList.add('is-focused');
    currentIndex = index;
  };

  setFocus(0); // начальный фокус на первой карточке

  // --- 2. Кнопки ---
  if (prevBtn && nextBtn) {
    const scrollToIndex = direction => {
      if (direction === 'next') {
        currentIndex = Math.min(currentIndex + 1, cards.length - 1);
      } else {
        currentIndex = Math.max(currentIndex - 1, 0);
      }

      setFocus(currentIndex);

      cards[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    };

    nextBtn.addEventListener('click', () => scrollToIndex('next'));
    prevBtn.addEventListener('click', () => scrollToIndex('prev'));
  }

  // --- 3. Drag to scroll ---
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', e => {
    isDown = true;
    carousel.classList.add('is-dragging');
    carousel.style.scrollSnapType = 'none';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  const stopDragging = () => {
    if (!isDown) return;
    isDown = false;
    carousel.classList.remove('is-dragging');
    carousel.style.scrollSnapType = 'x mandatory';
  };

  carousel.addEventListener('mouseleave', stopDragging);
  carousel.addEventListener('mouseup', stopDragging);

  carousel.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // --- 4. Lightbox ---
  const proofButtons = document.querySelectorAll('.proof-btn');
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  proofButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const src = btn.getAttribute('data-img');
      if (src && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('is-open');
      }
    });
  });
}
