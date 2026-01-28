const menuBtn = document.querySelector('.menu-btn');
const hiddenMenu = document.querySelector('.hiden-menu');
const menuBtnClose = document.querySelector('.menu-btn-close');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active'); // превращаем кнопку в крестик
  hiddenMenu.classList.toggle('is-open'); // открываем/закрываем overlay
});

menuBtnClose.addEventListener('click', () => {
  menuBtn.classList.remove('active'); // вернуть кнопку в исходное состояние
  hiddenMenu.classList.remove('is-open'); // закрыть меню
});
