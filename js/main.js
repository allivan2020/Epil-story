// ---------- IMPORTS ----------
import { inject } from '@vercel/analytics';
import { layoutGallery } from '/js/gallery.js';
import { initVibeTitles } from '/js/animations.js';
import { initHeaderScroll } from '/js/header.js';
import { initMobileMenu } from '/js/menu.js';
import { initStoryAnimations } from '/js/story.js';
import { initPhotoLightbox } from '/js/lightbox.js';
import { initReviews } from '/js/reviews.js';
import { initModalBooking, initBookingForm } from '/js/modal.js';

// ---------- APP INIT ----------
function initApp() {
  // 1. Стандартні ініціалізації
  initHeaderScroll();
  initMobileMenu();
  initModalBooking();
  initBookingForm();
  initStoryAnimations();
  initReviews();
  initPhotoLightbox();
  inject();
  initVibeTitles();
  // 3. Розставляємо картки Moodboard
  layoutGallery();

  // Инициализация плавного скролла Lenis
  const lenis = new Lenis({
    duration: 1.2, // Длительность скольжения (чем больше, тем плавнее)
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Формула смягчения
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, // На телефонах оставляем родной скролл (так привычнее)
    touchMultiplier: 2,
  });

  // Петля анимации, чтобы скролл работал синхронно с частотой обновления монитора
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  // Находим все картинки, которым нужен параллакс
  const parallaxImages = document.querySelectorAll('.parallax-image');

  // Вешаем слушатель прямо на событие скролла Lenis (это дает максимальную плавность)
  lenis.on('scroll', e => {
    parallaxImages.forEach(img => {
      // Получаем контейнер картинки
      const wrapper = img.parentElement;
      const rect = wrapper.getBoundingClientRect();

      // Проверяем, виден ли элемент на экране
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Вычисляем процент прокрутки относительно этого элемента (от -1 до 1)
        const progress =
          (rect.top - window.innerHeight) / (window.innerHeight + rect.height);

        // Сдвигаем картинку. Множитель 20 — это сила параллакса (в процентах)
        const yMove = progress * 20;

        // Применяем сдвиг
        img.style.transform = `translate3d(0, ${yMove}%, 0)`;
      }
    });
  });

  requestAnimationFrame(raf);
}

// ---------- EVENTS ----------
document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('resize', layoutGallery);
