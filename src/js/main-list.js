const menuBtn = document.querySelector('.menu-btn');
const hiddenMenu = document.querySelector('.hiden-menu');
const menuBtnClose = document.querySelector('.menu-btn-close');

// Открытие/закрытие меню
menuBtn.addEventListener('click', () => hiddenMenu.classList.toggle('is-open'));
menuBtnClose.addEventListener('click', () =>
  hiddenMenu.classList.remove('is-open')
);

// Плавный скролл по ссылкам
const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    hiddenMenu.classList.remove('is-open');
  });
});

// Параллакс
const parallaxSections = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  parallaxSections.forEach(section => {
    const speed = parseFloat(section.dataset.speed);
    const offset = window.scrollY * speed;
    section.style.backgroundPositionY = `${offset}px`;
  });
});
