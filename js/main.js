import { initHeaderScroll } from './header.js';
import { initMobileMenu } from './menu.js';
import { initModalBooking } from './modal.js';
import { initStoryAnimations } from './story.js';
import { initPhotoLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initModalBooking();
  initStoryAnimations();
  initPhotoLightbox();
});
