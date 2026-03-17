export function initPhotoLightbox() {
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const vibeImages = document.querySelectorAll('.vibe-item img');

  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;
  const imagesArray = [];

  // 1. Открытие и сбор массива картинок
  vibeImages.forEach((img, index) => {
    // Берем большую картинку из data-src, а если ее нет — берем обычный src
    const fullImageUrl = img.getAttribute('data-src') || img.src;
    imagesArray.push(fullImageUrl);

    img.style.cursor = 'zoom-in';

    // Создаем отдельную функцию для открытия, чтобы вызывать её и по клику, и по кнопке
    const openThisImage = () => {
      currentIndex = index;
      lightboxImg.src = imagesArray[currentIndex];
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    // Открытие по клику мыши
    img.addEventListener('click', openThisImage);

    // Открытие с клавиатуры (Enter, Return Mac, Пробел)
    img.addEventListener('keydown', e => {
      if (
        e.key === 'Enter' ||
        e.keyCode === 13 ||
        e.key === ' ' ||
        e.code === 'Space'
      ) {
        e.preventDefault(); // Предотвращаем прокрутку страницы вниз при нажатии пробела
        openThisImage();
      }
    });
  });

  // 2. Логика перелистывания ВПЕРЕД
  nextBtn?.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= imagesArray.length) {
      currentIndex = 0;
    }
    lightboxImg.src = imagesArray[currentIndex];
  });

  // 3. Логика перелистывания НАЗАД
  prevBtn?.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = imagesArray.length - 1;
    }
    lightboxImg.src = imagesArray[currentIndex];
  });

  // 4. Закрытие лайтбокса
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300); // Очищаем src после завершения CSS-анимации
  };

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    // Закрываем, только если кликнули по темному фону, а не по самой картинке
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // 5. Управление с клавиатуры (Esc + стрелочки)
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'ArrowLeft') prevBtn?.click();
  });
}
