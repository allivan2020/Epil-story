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

  // Вспомогательная функция открытия
  const openLightbox = index => {
    currentIndex = index;
    lightboxImg.src = imagesArray[currentIndex];
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  // 1. Сбор массива и привязка событий
  vibeImages.forEach((img, index) => {
    // Берем большое фото из data-src, если нет — обычный src
    const fullImageUrl = img.getAttribute('data-src') || img.src;
    imagesArray.push(fullImageUrl);

    img.style.cursor = 'zoom-in';

    // Открытие по клику мыши
    img.addEventListener('click', () => openLightbox(index));

    // Открытие с клавиатуры (доступность)
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter') openLightbox(index);
    });
  });

  // 2. Логика перелистывания ВПЕРЕД
  nextBtn?.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= imagesArray.length) currentIndex = 0;
    lightboxImg.src = imagesArray[currentIndex];
  });

  // 3. Логика перелистывания НАЗАД
  prevBtn?.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = imagesArray.length - 1;
    lightboxImg.src = imagesArray[currentIndex];
  });

  // 4. Закрытие лайтбокса
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  };

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // 5. Управление с клавиатуры
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'ArrowLeft') prevBtn?.click();
  });
}

export function layoutGallery() {
  const section = document.querySelector('.vibe-section');
  const grid = document.querySelector('.vibe-grid');
  const items = document.querySelectorAll('.vibe-item');

  if (!grid || !section || items.length === 0) {
    console.log('Галерея vibe не найдена на этой странице.');
    return;
  }

  let itemsData = [];
  let sectionTop = 0;
  let isVisible = false;

  // Выносим просчет позиций в отдельную функцию
  const calculateLayout = () => {
    const isMobile = window.innerWidth <= 768;
    const containerWidth = grid.offsetWidth;
    const cols = isMobile ? 2 : 3;
    const cellHeight = isMobile ? 240 : 380;
    const itemW = isMobile ? 140 : 280;
    const topOffset = isMobile ? 40 : 120;

    itemsData = []; // Очищаем массив при перерасчете
    grid.style.height = `${Math.ceil(items.length / cols) * cellHeight + topOffset + 100}px`;
    sectionTop = section.getBoundingClientRect().top + window.scrollY;

    items.forEach((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const cellWidth = containerWidth / cols;

      const xPos =
        col * cellWidth + (cellWidth - itemW) / 2 + (Math.random() - 0.5) * 20;
      const yPos = row * cellHeight + topOffset + (Math.random() - 0.5) * 30;
      const rotate = (Math.random() - 0.5) * 10;
      const depth = Math.random() * 0.12 + 0.04;

      item.style.transform = `translate3d(${Math.round(xPos)}px, ${Math.round(yPos)}px, 0) rotate(${rotate}deg)`;

      itemsData.push({
        el: item,
        baseX: Math.round(xPos),
        baseY: Math.round(yPos),
        rotate: rotate,
        depth: depth,
      });
    });
  };

  // Первичный расчет при загрузке
  calculateLayout();

  // Флаг видимости секции
  const obs = new IntersectionObserver(
    ([entry]) => (isVisible = entry.isIntersecting)
  );
  obs.observe(section);

  const handleScroll = ({ scroll }) => {
    if (!isVisible) return;

    // Если это телефон — не делаем тяжелую математику параллакса при скролле
    if (window.innerWidth <= 768) return;

    const vh = window.innerHeight;
    const scrollDelta = scroll - sectionTop + vh;

    if (scrollDelta < 0) return;

    for (let i = 0; i < itemsData.length; i++) {
      const item = itemsData[i];
      const moveY = scrollDelta * item.depth;
      item.el.style.transform = `translate3d(${item.baseX}px, ${item.baseY + moveY}px, 0) rotate(${item.rotate}deg)`;
    }
  };

  // Подключаемся к Lenis
  if (window.lenis) {
    window.lenis.on('scroll', handleScroll);
  }

  // ОБНОВЛЕНИЕ: Пересчет сетки при изменении размера окна или повороте экрана
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      calculateLayout();
    }, 250); // Ждем четверть секунды после окончания ресайза
  });
}
