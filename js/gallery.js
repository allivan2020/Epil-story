export function layoutGallery() {
  const grid = document.querySelector('.vibe-grid');
  const items = document.querySelectorAll('.vibe-item');
  if (!grid || items.length === 0) return;

  const isMobile = window.innerWidth <= 768;
  const containerWidth = grid.offsetWidth;

  // Настройки сетки
  const cols = isMobile ? 2 : 3;
  const rows = Math.ceil(items.length / cols);

  // Высота ячейки (можно чуть увеличить, если фото длинные)
  const cellHeight = isMobile ? 280 : 380;

  // Устанавливаем высоту контейнера
  grid.style.height = `${rows * cellHeight}px`;

  items.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    const cellWidth = containerWidth / cols;

    // --- МАГИЯ ХАОСА ---
    // Случайное смещение (jitter)
    const randomX = (Math.random() - 0.5) * (cellWidth * 0.4);
    const randomY = (Math.random() - 0.5) * (cellHeight * 0.3);

    // Случайный поворот
    const randomRotate = (Math.random() - 0.5) * 15;

    // Вычисляем координаты
    // Используем фиксированную ширину из CSS (280px или 160px), чтобы не ждать загрузки картинок
    const itemWidth = item.offsetWidth || (isMobile ? 160 : 280);
    const itemHeight = item.offsetHeight || (isMobile ? 220 : 320);

    const xPos = col * cellWidth + cellWidth / 2 - itemWidth / 2 + randomX;
    const yPos = row * cellHeight + cellHeight / 2 - itemHeight / 2 + randomY;

    // Ограничиваем, чтобы не вылетало за края слева/справа
    const safeX = Math.max(0, Math.min(xPos, containerWidth - itemWidth));

    // Применяем стили
    item.style.left = `${safeX}px`;
    item.style.top = `${yPos}px`;
    item.style.transform = `rotate(${randomRotate}deg)`;
    item.style.zIndex = Math.floor(Math.random() * 10);
  });
}
