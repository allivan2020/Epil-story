document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const hiddenMenu = document.querySelector('.hiden-menu');
  const menuLinks = document.querySelectorAll('.hiden-menu .menu-link');

  if (!menuBtn || !hiddenMenu) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    hiddenMenu.classList.toggle('is-open');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      hiddenMenu.classList.remove('is-open');
    });
  });
});
