export function initStoryAnimations() {
  const storySection = document.querySelector('.story');
  const card1 = document.querySelector('.card-1');
  const card2 = document.querySelector('.card-2');
  const storyScroll = document.querySelector('.story-content');
  const dots = document.querySelectorAll('.dot');

  // Проверка существования элементов перед работой
  if (!storySection || !card1 || !card2) {
    console.error('Story elements not found');
    return;
  }

  // --- ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЯ ---
  // Принудительно ставим активной только первую карточку при загрузке
  card1.classList.add('active');
  card2.classList.remove('active');
  if (dots.length > 0) dots[0].classList.add('active');

  // --- АНИМАЦИЯ STORY ---
  function updateStory() {
    // --- ДЕСКТОП ---
    if (window.innerWidth >= 1024) {
      const rect = storySection.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalDistance = storySection.offsetHeight - window.innerHeight;
      let progress = scrolled / totalDistance;

      if (progress >= 0 && progress <= 1) {
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
    } else {
      // На мобильных устройствах убираем классы active, чтобы IntersectionObserver работал корректно
      card1.classList.remove('active');
      card2.classList.remove('active');
    }
  }

  // --- МОБИЛЬНАЯ АНИМАЦИЯ (Датчик появления) ---
  if (window.innerWidth < 1024) {
    const observerOptions = {
      threshold: 0.5, // Увеличил порог для лучшего срабатывания
    };

    const storyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.story-card').forEach(card => {
      storyObserver.observe(card);
    });
  }

  // Скролл-индикаторы (точки)
  if (storyScroll && dots.length > 0) {
    storyScroll.addEventListener('scroll', () => {
      const index = Math.round(
        storyScroll.scrollLeft / storyScroll.offsetWidth
      );
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    });
  }

  // Слушатели событий
  window.addEventListener('scroll', updateStory);
  window.addEventListener('resize', updateStory); // Обновлять состояние при изменении размера экрана
  updateStory(); // Запуск при загрузке
}
