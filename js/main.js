// ---------- IMPORTS ----------
import { inject } from '@vercel/analytics';

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
}

document.addEventListener('DOMContentLoaded', initApp);
