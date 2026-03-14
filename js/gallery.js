export function layoutGallery() {
  const section = document.querySelector('.vibe-section');
  const grid = document.querySelector('.vibe-grid');
  const items = document.querySelectorAll('.vibe-item');
  if (!grid || !section || items.length === 0) return;

  const isMobile = window.innerWidth <= 768;
  const containerWidth = grid.offsetWidth;
  const cols = isMobile ? 2 : 3;
  const rows = Math.ceil(items.length / cols);

  const cellHeight = isMobile ? 240 : 380;
  const itemW = isMobile ? 140 : 280;

  const topOffset = isMobile ? 40 : 120;
  const bottomBuffer = isMobile ? 50 : 80;

  grid.style.height = `${rows * cellHeight + topOffset + bottomBuffer}px`;

  items.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const cellWidth = containerWidth / cols;

    const xPos =
      col * cellWidth + (cellWidth - itemW) / 2 + (Math.random() - 0.5) * 20;
    const yPos = row * cellHeight + topOffset + (Math.random() - 0.5) * 30;

    const rotate = (Math.random() - 0.5) * 10;

    // Глубина параллакса. Чем больше разброс, тем сильнее разница в скорости
    const depth = Math.random() * 0.15 + 0.05;

    item.style.setProperty('--base-x', `${Math.round(xPos)}px`);
    item.style.setProperty('--base-y', `${Math.round(yPos)}px`);
    item.style.setProperty('--base-rotate', `${rotate}deg`);
    item.style.setProperty('--depth', depth.toString());
  });

  // --- ПРАВКА: ТЕПЕРЬ ПАРАЛЛАКС РАБОТАЕТ ВЕЗДЕ, А НЕ ТОЛЬКО НА МОБИЛКЕ ---
  const handleScroll = () => {
    const rect = section.getBoundingClientRect();
    const scrollDelta = window.innerHeight - rect.top;

    if (scrollDelta < 0) {
      items.forEach(item => item.style.setProperty('--scroll-offset', `0px`));
      return;
    }

    items.forEach(item => {
      const depth = parseFloat(item.style.getPropertyValue('--depth'));
      // Множитель 0.6 делает движение мягким и приятным
      const moveY = scrollDelta * (depth * 0.6);
      item.style.setProperty('--scroll-offset', `${moveY}px`);
    });
  };

  // Если у нас подключен Lenis, вешаем на него для максимальной плавности
  if (typeof lenis !== 'undefined') {
    lenis.on('scroll', handleScroll);
  } else {
    // Резервный вариант, если Lenis вдруг не загрузился
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  handleScroll(); // Вызов при старте
}
