// ВЕРХ ФАЙЛА main.js
import { inject } from '@vercel/analytics';
import { layoutGallery } from '/js/gallery.js';
import { initVibeTitles } from '/js/animations.js';
import { initHeaderScroll } from '/js/header.js';
import { initMobileMenu } from '/js/menu.js';
import { initStoryAnimations } from '/js/story.js';
import { initPhotoLightbox } from '/js/lightbox.js';
import { initReviews } from '/js/reviews.js';
import { initModalBooking, initBookingForm } from '/js/modal.js';

// ---------- ОТДЕЛЬНЫЙ МОДУЛЬ ДЛЯ УМНОЙ КАРТЫ ----------
// Вынесли функцию отдельно, чтобы она не "засоряла" initApp
function initSmartMap() {
  const mapContainer = document.getElementById('map-container');
  // Используем ссылку для вставки (embed) из Google Maps
  const mapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1851.6309781930136!2d35.1573668889818!3d47.82725073798807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dc60aab8b82aab%3A0x2095f293e4eef4c6!2z0LLRg9C7LiDQo9C60YDQsNGX0L3RgdGM0LrQsCwgNDMsINCX0LDQv9C-0YDRltC20LbRjywg0JfQsNC_0L7RgNGW0LfRjNC60LAg0L7QsdC70LDRgdGC0YwsIDY5MDAw!5e0!3m2!1suk!2sua!4v1773690906002!5m2!1suk!2sua';

  if (!mapContainer) return;

  const loadMap = () => {
    mapContainer.innerHTML = `
            <iframe 
                src="${mapUrl}" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>`;
    console.log('🗺️ Карта загружена');
  };

  // Загружаем при клике на контейнер. { once: true } — чтобы сработало только один раз
  mapContainer.addEventListener('click', loadMap, { once: true });
}

// ---------- БЕЗОПАСНЫЙ ЗАПУСК ----------
async function initApp() {
  console.log('🚀 Инициализация началась...');
  inject(); // Запуск аналитики Vercel

  // ФУНКЦИЯ-СПАСАТЕЛЬ
  const backupReveal = setTimeout(() => {
    document
      .querySelectorAll('.vibe-title, .vibe-item, .story-section')
      .forEach(el => (el.style.opacity = '1'));
    console.warn('⚠️ Принудительный показ элементов.');
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

  // 2. Список модулей для запуска (ДОБАВИЛИ СЮДА ТВОЮ КАРТУ)
  const modules = [
    { name: 'Header', func: initHeaderScroll },
    { name: 'Menu', func: initMobileMenu },
    { name: 'Modal', func: initModalBooking },
    { name: 'Booking', func: initBookingForm },
    { name: 'Titles', func: initVibeTitles },
    { name: 'Reviews', func: initReviews },
    { name: 'Story', func: initStoryAnimations },
    { name: 'Gallery', func: layoutGallery },
    { name: 'PhotoLightbox', func: initPhotoLightbox },
    // ВОТ ОН, ГЛАВНЫЙ ФИКС! Добавили карту в общий список
    { name: 'SmartMap', func: initSmartMap },
  ];

  // Проходим циклом и запускаем всё по очереди
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
