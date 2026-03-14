export function initStoryAnimations() {
  const storySection = document.querySelector('.story');
  const cards = document.querySelectorAll('.story-card');
  const dots = document.querySelectorAll('.dot');

  if (!storySection || cards.length === 0) return;

  let storyObserver = null;

  function handleDesktopScroll() {
    if (window.innerWidth < 1024) return;

    const rect = storySection.getBoundingClientRect();
    const totalDistance = storySection.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    let progress = Math.max(0, Math.min(1, scrolled / totalDistance));

    // Логика переключения (0.5 — экватор секции)
    if (progress <= 0.5) {
      cards[0].classList.add('active');
      cards[1].classList.remove('active');
      if (dots.length > 1) {
        dots[0].classList.add('active');
        dots[1].classList.remove('active');
      }
    } else {
      cards[0].classList.remove('active');
      cards[1].classList.add('active');
      if (dots.length > 1) {
        dots[0].classList.remove('active');
        dots[1].classList.add('active');
      }
    }
  }

  function setupMode() {
    const isDesktop = window.innerWidth >= 1024;

    // Сброс всех состояний перед переключением режима
    if (storyObserver) storyObserver.disconnect();
    window.removeEventListener('scroll', handleDesktopScroll);

    cards.forEach(card => {
      card.classList.remove('active', 'is-visible');
    });

    if (isDesktop) {
      // Десктопный режим
      window.addEventListener('scroll', handleDesktopScroll);
      handleDesktopScroll();
    } else {
      // Мобильный режим
      const observerOptions = { threshold: 0.1 };
      storyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, observerOptions);

      cards.forEach(card => storyObserver.observe(card));
    }
  }

  setupMode();
  window.addEventListener('resize', () => {
    clearTimeout(window.storyResizeTimer);
    window.storyResizeTimer = setTimeout(setupMode, 200);
  });
}
