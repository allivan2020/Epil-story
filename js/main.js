// 1. Все импорты в начале файла
import { inject } from '@vercel/analytics';
inject();
import { initHeaderScroll } from './header.js';
import { initMobileMenu } from './menu.js';
import { initStoryAnimations } from './story.js';
import { initPhotoLightbox } from './lightbox.js';
// Подключаем и модалку, и форму из файла modal.js
import { initModalBooking, initBookingForm } from './modal.js';

// 2. Одна общая функция запуска
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initModalBooking();
  initBookingForm(); // Запускаем обработчик формы
  initStoryAnimations();
  initPhotoLightbox();
});
