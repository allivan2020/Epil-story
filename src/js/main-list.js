import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== Меню =====
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

    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);

    section.scrollIntoView({ behavior: 'smooth' });

    menuLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    hiddenMenu.classList.remove('is-open');
    menuBtn.classList.remove('active');
  });
});

// ===== GSAP Parallax (ОДИН раз, без дубликатов) =====
document.querySelectorAll('.parallax').forEach(section => {
  gsap.to(section, {
    backgroundPositionY: '+=80',
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
    },
  });

  const container = section.querySelector('.container');
  if (container) {
    gsap.from(container, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  }
});
