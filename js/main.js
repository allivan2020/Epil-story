// ---------- APP INIT ----------
function initApp() {
  // 1. Инициализируем Lenis В ПЕРВУЮ ОЧЕРЕДЬ
  window.lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // На телефонах нативный скролл лучше
    touchMultiplier: 1.5,
  });

  function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Стандартные инициализации
  initHeaderScroll();
  initMobileMenu();
  initModalBooking();
  initBookingForm();
  initStoryAnimations();
  initReviews();
  initPhotoLightbox();
  inject();
  initVibeTitles();

  // 3. Раставляем карточки (теперь lenis уже существует в window)
  layoutGallery();

  // 4. Оптимизированный Параллакс для картинок .parallax-image
  const parallaxImages = document.querySelectorAll('.parallax-image');

  // Кэшируем начальные позиции, чтобы не лезть в DOM при скролле
  const imgData = Array.from(parallaxImages).map(img => ({
    el: img,
    parent: img.parentElement,
    // Считаем позицию один раз
    top: img.parentElement.getBoundingClientRect().top + window.scrollY,
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.dataset.visible = entry.isIntersecting;
    });
  });

  imgData.forEach(data => observer.observe(data.parent));

  // Используем данные скролла из Lenis (аргумент e)
  window.lenis.on('scroll', ({ scroll }) => {
    const vh = window.innerHeight;

    imgData.forEach(data => {
      if (data.parent.dataset.visible === 'true') {
        // Вычисляем прогресс без getBoundingClientRect
        const relativeScroll = scroll - data.top + vh;
        const totalDist = vh + data.parent.offsetHeight;
        const progress = relativeScroll / totalDist - 1; // от -1 до 0

        data.el.style.transform = `translate3d(0, ${progress * 20}%, 0)`;
      }
    });
  });
}
