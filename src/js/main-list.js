import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ================= Меню =================
const menuBtn = document.querySelector('.menu-btn');
const hiddenMenu = document.querySelector('.hiden-menu');
const menuLinks = document.querySelectorAll('.menu-link');

menuBtn.addEventListener('click', () => {
  hiddenMenu.classList.toggle('is-open');
  menuBtn.classList.toggle('active');
});

menuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Плавный скролл к секции
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Активный пункт меню
    menuLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Закрытие overlay
    hiddenMenu.classList.remove('is-open');
    menuBtn.classList.remove('active');
  });
});

// ================= GSAP параллакс =================
document.querySelectorAll('.parallax').forEach(section => {
  // Параллакс фона
  gsap.to(section, {
    backgroundPositionY: '+=200', // смещение фона
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true, // плавная привязка к скроллу
    },
  });

  // Анимация содержимого
  const container = section.querySelector('.container');
  if (container) {
    gsap.from(container, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }
});

// ================= Меню при скролле =================
gsap.to('.header', {
  backgroundColor: 'rgba(255, 248, 244, 1)',
  boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
  scrollTrigger: {
    trigger: 'main',
    start: 'top top',
    end: '+=200',
    scrub: true,
  },
});
