export function initStoryAnimations() {
  const storySection = document.querySelector('.story');
  const card1 = document.querySelector('.card-1');
  const card2 = document.querySelector('.card-2');
  const dots = document.querySelectorAll('.dot');

  if (!storySection || !card1 || !card2) {
    console.error('Story elements not found');
    return;
  }

  // Переменная для хранения observer, чтобы его можно было отключать
  let storyObserver = null;

  function handleDesktopScroll() {
    if (window.innerWidth < 1024) return; // На мобилке не выполняем скролл-логику

    const rect = storySection.getBoundingClientRect();
    const scrolled = -rect.top;
    const totalDistance = storySection.offsetHeight - window.innerHeight;

    // progress от 0 до 1 внутри секции
    let progress = Math.max(0, Math.min(1, scrolled / totalDistance));

    if (progress <= 0.5) {
      card1.classList.add('active');
      card2.classList.remove('active');
      if (dots.length > 0) {
        dots[0].classList.add('active');
        dots[1].classList.remove('active');
      }
    } else {
      card1.classList.remove('active');
      card2.classList.add('active');
      if (dots.length > 0) {
        dots[0].classList.remove('active');
        dots[1].classList.add('active');
      }
    }
  }

  function initMobileObserver() {
    if (window.innerWidth >= 1024) return;

    // Очищаем десктопные классы перед запуском мобильной логики
    card1.classList.remove('active');
    card2.classList.remove('active');

    const observerOptions = {
      threshold: 0.2, // Снизил порог, чтобы карточка появлялась раньше
      rootMargin: '0px 0px -100px 0px', // Начинать анимацию чуть до того, как карточка дойдет до центра
    };

    storyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Как только карточка появилась, прекращаем за ней следить (чтобы не моргала туда-сюда)
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.story-card').forEach(card => {
      // Сбрасываем видимость перед обзервером (если крутим туда-сюда)
      card.classList.remove('is-visible');
      storyObserver.observe(card);
    });
  }

  // --- УПРАВЛЕНИЕ РЕЖИМАМИ ---
  function setupMode() {
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop) {
      // Отключаем мобильный observer, если перешли на десктоп
      if (storyObserver) {
        storyObserver.disconnect();
      }
      // Инициализируем стартовое состояние десктопа
      card1.classList.add('active');
      if (dots.length > 0) dots[0].classList.add('active');
      // Привязываем скролл
      window.addEventListener('scroll', handleDesktopScroll);
      handleDesktopScroll(); // Вызываем сразу для правильного позиционирования
    } else {
      // Отвязываем десктопный скролл
      window.removeEventListener('scroll', handleDesktopScroll);
      // Запускаем мобильный observer
      initMobileObserver();
    }
  }

  // Инициализация при загрузке
  setupMode();

  // Перестройка при ресайзе окна (например, повернули планшет)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupMode, 250); // Debounce для оптимизации
  });
}
