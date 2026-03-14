// ВЕРХ ФАЙЛА main.js
import { inject } from '@vercel/analytics';
import { layoutGallery } from '/js/gallery.js'; // Добавили точку перед слешем
import { initVibeTitles } from '/js/animations.js';
import { initHeaderScroll } from '/js/header.js';
import { initMobileMenu } from '/js/menu.js';
import { initStoryAnimations } from '/js/story.js';
import { initPhotoLightbox } from '/js/lightbox.js';
import { initReviews } from '/js/reviews.js';
import { initModalBooking, initBookingForm } from '/js/modal.js';

// Дальше идет ваш код initApp...

// ---------- БЕЗОПАСНЫЙ ЗАПУСК ----------

async function initApp() {
  console.log('🚀 Инициализация началась...');

  // ФУНКЦИЯ-СПАСАТЕЛЬ: Если JS упадет, эта функция покажет скрытые блоки через 2 секунды
  const backupReveal = setTimeout(() => {
    document
      .querySelectorAll(
        '.vibe-title, .vibe-item, .story-section, .reviews-section'
      )
      .forEach(el => (el.style.opacity = '1'));
    console.warn(
      '⚠️ Анимации не запустились вовремя, применен принудительный показ элементов.'
    );
  }, 2000);

  // 1. Инициализация Lenis
  try {
    if (typeof Lenis !== 'undefined') {
      window.lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        smoothTouch: false,
      });
      function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      console.log('✅ Lenis готов');
    }
  } catch (e) {
    console.error('❌ Ошибка Lenis:', e);
  }

  // 2. Запуск модулей с индивидуальной защитой
  const modules = [
    { name: 'Header', func: initHeaderScroll },
    { name: 'Menu', func: initMobileMenu },
    { name: 'Modal', func: initModalBooking },
    { name: 'Booking', func: initBookingForm },
    { name: 'Titles', func: initVibeTitles },
    { name: 'Reviews', func: initReviews },
    { name: 'Story', func: initStoryAnimations },
    { name: 'Gallery', func: layoutGallery },
  ];

  modules.forEach(m => {
    try {
      if (typeof m.func === 'function') {
        m.func();
        console.log(`✅ ${m.name} ок`);
      }
    } catch (e) {
      console.error(`❌ Ошибка в модуле ${m.name}:`, e);
    }
  });

  // Если всё ок, отменяем принудительный показ
  clearTimeout(backupReveal);
}

document.addEventListener('DOMContentLoaded', initApp);
