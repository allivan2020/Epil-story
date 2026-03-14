export function layoutGallery() {
  const section = document.querySelector('.vibe-section');
  const grid = document.querySelector('.vibe-grid');
  const items = document.querySelectorAll('.vibe-item');
  if (!grid || !section || items.length === 0) return;

  const isMobile = window.innerWidth <= 768;
  const containerWidth = grid.offsetWidth;
  const cols = isMobile ? 2 : 3;
  const rows = Math.ceil(items.length / cols);

  const cellHeight = isMobile ? 240 : 380; // Чуть уменьшили высоту ячейки для мобилки
  const itemW = isMobile ? 140 : 280; // Синхронизируем с CSS

  const topOffset = isMobile ? 40 : 120;
  const bottomBuffer = isMobile ? 50 : 80;

  grid.style.height = `${rows * cellHeight + topOffset + bottomBuffer}px`;

  items.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const cellWidth = containerWidth / cols;

    // Считаем позиции
    const xPos =
      col * cellWidth + (cellWidth - itemW) / 2 + (Math.random() - 0.5) * 20; // Уменьшили разброс по X
    const yPos = row * cellHeight + topOffset + (Math.random() - 0.5) * 30;

    const rotate = (Math.random() - 0.5) * 10;
    const depth = Math.random() * 0.12 + 0.05;

    item.style.setProperty('--base-x', `${Math.round(xPos)}px`);
    item.style.setProperty('--base-y', `${Math.round(yPos)}px`);
    item.style.setProperty('--base-rotate', `${rotate}deg`);
    item.style.setProperty('--depth', depth.toString());
  });

  // Мобильный параллакс: считаем скролл относительно самой секции!
  if (isMobile) {
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      // Начинаем считать скролл, только когда секция появляется на экране
      const scrollDelta = window.innerHeight - rect.top;

      // Если секция еще ниже экрана, сбрасываем смещение
      if (scrollDelta < 0) {
        items.forEach(item => item.style.setProperty('--scroll-offset', `0px`));
        return;
      }

      items.forEach(item => {
        const depth = parseFloat(item.style.getPropertyValue('--depth'));
        // Смягчаем эффект на 0.5, чтобы карточки не улетали в космос
        const moveY = scrollDelta * (depth * 0.5);
        item.style.setProperty('--scroll-offset', `${moveY}px`);
      });
    };

    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Вызываем сразу, чтобы расставить картинки при загрузке
  }
}
