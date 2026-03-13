// ---------- IMPORTS ----------
import { inject } from '@vercel/analytics';
import { layoutGallery } from '/js/gallery.js'; // Убедись, что путь и расширение .js указаны верно
import { initHeaderScroll } from '/js/header.js';
import { initMobileMenu } from '/js/menu.js';
import { initStoryAnimations } from '/js/story.js';
import { initPhotoLightbox } from '/js/lightbox.js';
import { initReviews } from '/js/reviews.js';
import { initModalBooking, initBookingForm } from '/js/modal.js';

// ---------- APP INIT ----------
function initApp() {
  initHeaderScroll();
  initMobileMenu();
  initModalBooking();
  initBookingForm();
  initStoryAnimations();
  initReviews();
  initPhotoLightbox();
  inject();

  // Вызываем функцию расстановки
  layoutGallery();
}

document.addEventListener('DOMContentLoaded', initApp);

// Пересчитываем при изменении размера окна
window.addEventListener('resize', layoutGallery);
