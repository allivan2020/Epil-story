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
}

// ---------- EVENTS ----------
document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('resize', layoutGallery);
