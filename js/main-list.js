document.addEventListener('DOMContentLoaded', () => {
  // Элементы
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.menu-btn');
  const menuList = document.querySelector('.menu-list');
  const menuLinks = document.querySelectorAll('.menu-link');
  const modal = document.getElementById('booking-modal');
  const openButtons = document.querySelectorAll(
    'a[href="#booking-modal"], .btn-primary, .btn-secondary'
  );

  // --- 1. АНИМАЦИЯ STORY ---
  function updateStory() {
    const card1 = document.querySelector('.card-1');
    const card2 = document.querySelector('.card-2');
    const storySection = document.querySelector('.story');

    if (!storySection || !card1 || !card2) return;

    // Если мобилка — сбрасываем все стили анимации
    if (window.innerWidth < 1024) {
      [card1, card2].forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'none';
        card.style.position = 'relative'; // Возвращаем в поток
      });
      return;
    }

    // Логика для десктопа (оставляем твою "дорогую" анимацию)
    const rect = storySection.getBoundingClientRect();
    const scrolled = -rect.top;
    const totalDistance = storySection.offsetHeight - window.innerHeight;
    let progress = scrolled / totalDistance;

    if (progress >= 0 && progress <= 1) {
      if (progress <= 0.5) {
        card1.classList.add('active');
        card2.classList.remove('active');
      } else {
        card1.classList.remove('active');
        card2.classList.add('active');
      }
    }
  }

  const storyScroll = document.querySelector('.story-content');
  const dots = document.querySelectorAll('.dot');

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

  // --- 2. СКРОЛЛ И ШАПКА ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }
    updateStory();
  });

  // --- 3. МОБИЛЬНОЕ МЕНЮ ---
  if (menuBtn && menuList) {
    const toggleMenu = () => {
      const isOpen = menuList.classList.toggle('is-open');
      menuBtn.classList.toggle('is-active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (menuList.classList.contains('is-open')) toggleMenu();
      });
    });
  }

  // --- 4. МОДАЛЬНОЕ ОКНО ---
  if (modal) {
    openButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        // Закрываем меню, если оно открыто
        if (menuList?.classList.contains('is-open')) {
          menuList.classList.remove('is-open');
          menuBtn.classList.remove('is-active');
        }
        modal.showModal();
        document.body.style.overflow = 'hidden';
      });
    });

    modal
      .querySelector('.modal-close')
      ?.addEventListener('click', () => modal.close());

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.close();
    });

    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  }

  // Запуск при загрузке
  updateStory();
});

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const vibeImages = document.querySelectorAll('.vibe-item img');

  // Открытие
  vibeImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden'; // Блокируем скролл сайта
    });
  });

  // Закрытие
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = ''; // Возвращаем скролл
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300); // Очистка после анимации
  };

  closeBtn.addEventListener('click', closeLightbox);

  // Закрытие по клику на пустую область
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Закрытие по кнопке Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
});
