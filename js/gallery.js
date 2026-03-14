export function layoutGallery() {
  const section = document.querySelector('.vibe-section');
  const grid = document.querySelector('.vibe-grid');
  const items = document.querySelectorAll('.vibe-item');

  // Если хоть одного элемента нет — выходим, чтобы не сломать сайт
  if (!grid || !section || items.length === 0) {
    console.log('Галерея vibe не найдена на этой странице.');
    return;
  }

  const isMobile = window.innerWidth <= 768;
  const containerWidth = grid.offsetWidth;
  const cols = isMobile ? 2 : 3;
  const cellHeight = isMobile ? 240 : 380;
  const itemW = isMobile ? 140 : 280;
  const topOffset = isMobile ? 40 : 120;

  const itemsData = [];
  grid.style.height = `${Math.ceil(items.length / cols) * cellHeight + topOffset + 100}px`;

  // Считаем позицию секции один раз
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;

  items.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const cellWidth = containerWidth / cols;

    const xPos =
      col * cellWidth + (cellWidth - itemW) / 2 + (Math.random() - 0.5) * 20;
    const yPos = row * cellHeight + topOffset + (Math.random() - 0.5) * 30;
    const rotate = (Math.random() - 0.5) * 10;
    const depth = Math.random() * 0.12 + 0.04;

    item.style.transform = `translate3d(${Math.round(xPos)}px, ${Math.round(yPos)}px, 0) rotate(${rotate}deg)`;

    itemsData.push({
      el: item,
      baseX: Math.round(xPos),
      baseY: Math.round(yPos),
      rotate: rotate,
      depth: depth,
    });
  });

  // Флаг видимости секции
  let isVisible = false;
  const obs = new IntersectionObserver(
    ([entry]) => (isVisible = entry.isIntersecting)
  );
  obs.observe(section);

  const handleScroll = ({ scroll }) => {
    if (!isVisible) return;

    const vh = window.innerHeight;
    const scrollDelta = scroll - sectionTop + vh;

    if (scrollDelta < 0) return;

    for (let i = 0; i < itemsData.length; i++) {
      const item = itemsData[i];
      const moveY = scrollDelta * item.depth;
      // Используем translate3d для GPU ускорения
      item.el.style.transform = `translate3d(${item.baseX}px, ${item.baseY + moveY}px, 0) rotate(${item.rotate}deg)`;
    }
  };

  // Подключаемся к Lenis
  if (window.lenis) {
    window.lenis.on('scroll', handleScroll);
  }
}
