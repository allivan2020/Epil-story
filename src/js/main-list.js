// Функция анимации секции Story
function updateStory() {
  const storySection = document.querySelector('.story');
  const card1 = document.querySelector('.card-1');
  const card2 = document.querySelector('.card-2');
  const title = document.querySelector('.story-header h2');

  if (!storySection || !card1 || !card2) return;

  const rect = storySection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // 1. Сколько пикселей верхушка секции уже прошла выше верхнего края экрана
  const scrolled = -rect.top;

  // 2. Общая дистанция, которую можно проскроллить внутри секции (высота 350vh - 100vh экрана)
  const totalDistance = storySection.offsetHeight - windowHeight;

  // 3. Рассчитываем чистый прогресс от 0 до 1
  let progress = scrolled / totalDistance;

  // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ---

  // Если мы еще не доскроллили ДО секции (она внизу или только появилась)
  if (rect.top > 0) {
    card1.classList.add('active');
    card2.classList.remove('active');
    if (title) title.style.opacity = '1';
    return;
  }

  // Если мы ВНУТРИ секции
  if (progress >= 0 && progress <= 1) {
    if (progress <= 0.5) {
      card1.classList.add('active');
      card2.classList.remove('active');
    } else {
      card1.classList.remove('active');
      card2.classList.add('active');
    }

    // Заголовок плавно исчезает только в самом конце секции
    if (title) {
      title.style.opacity = progress > 0.9 ? (1 - progress) * 10 : 1;
    }
  }

  // Если мы уже ПРОШЛИ секцию (ушла вверх)
  else if (progress > 1) {
    card1.classList.remove('active');
    card2.classList.add('active');
    if (title) title.style.opacity = '0';
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.menu-btn');
  const hiddenMenu = document.querySelector('.hidden-menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  // Обработка прозрачности шапки
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }
    // Запускаем расчет карточек при каждом скролле
    updateStory();
  });

  // Логика меню (мобильная версия)
  if (menuBtn && hiddenMenu) {
    const toggleMenu = () => {
      const isOpen = hiddenMenu.classList.toggle('is-open');
      menuBtn.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu();
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (hiddenMenu.classList.contains('is-open')) toggleMenu();
      });
    });
  }

  // ОБЯЗАТЕЛЬНО: Проверяем положение при первой загрузке
  updateStory();
});
