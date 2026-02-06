// 1. Глобальные переменные
const storySection = document.querySelector('.story');
const card1 = document.querySelector('.card-1');
const card2 = document.querySelector('.card-2');
const storyTitle = document.querySelector('.story-header h2');
const blob1 = document.querySelector('.blob-1');
const blob2 = document.querySelector('.blob-2');

// 2. Функция анимации (ЕДИНАЯ)
function updateStory() {
  const storySection = document.querySelector('.story');
  const card1 = document.querySelector('.card-1');
  const card2 = document.querySelector('.card-2');
  const title = document.querySelector('.story-header h2');

  if (!storySection || !card1 || !card2) return;

  const rect = storySection.getBoundingClientRect();
  const scrolled = -rect.top;
  const totalDistance = rect.height - window.innerHeight;

  // Если мы еще не дошли до секции или уже пролетели её — выходим
  if (rect.top > window.innerHeight || rect.bottom < 0) return;

  let progress = Math.max(0, Math.min(1, scrolled / totalDistance));

  // ЗАГОЛОВОК: виден всегда, пока мы в секции
  if (title) {
    title.style.opacity = progress > 0 && progress < 0.98 ? '1' : '0';
  }

  // КАРТОЧКИ: делим прогресс пополам
  // Первая карточка активна от 0 до 0.5 (сразу при входе!)
  if (progress >= 0 && progress <= 0.5) {
    card1.classList.add('active');
    card2.classList.remove('active');
  }
  // Вторая карточка активна от 0.5 до 1
  else if (progress > 0.5 && progress <= 1) {
    card2.classList.add('active');
    card1.classList.remove('active');
  }
}

// 3. Основные события
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.menu-btn');
  const hiddenMenu = document.querySelector('.hidden-menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  // Шапка при скролле
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  if (!menuBtn || !hiddenMenu) return;

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
      if (hiddenMenu.classList.contains('is-open')) {
        toggleMenu();
      }
      setTimeout(updateStory, 700);
    });
  });

  // Запуск логики
  window.addEventListener('scroll', updateStory);
  updateStory(); // Обязательный вызов при загрузке
});
