export function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const menuList = document.querySelector('.menu-list');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (!menuBtn || !menuList) return;

  const toggleMenu = () => {
    const isOpen = menuList.classList.toggle('is-open');
    menuBtn.classList.toggle('is-active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  menuBtn.addEventListener('click', toggleMenu);
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuList.classList.contains('is-open')) toggleMenu();
    });
  });
}
