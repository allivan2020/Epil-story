export function initVibeTitles() {
  const titles = document.querySelectorAll('.vibe-title');

  // 1. Создаем наблюдателя
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Когда заголовок попадает в зону видимости экрана
        if (entry.isIntersecting) {
          // Даем небольшую задержку для плавности и добавляем класс
          requestAnimationFrame(() => {
            entry.target.classList.add('revealed');
          });

          // Отключаем слежку, чтобы анимация проигралась один раз (опционально)
          // Если хочешь, чтобы при скролле туда-сюда анимация повторялась, удали строчку ниже:
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // Анимация стартует, когда 15% заголовка покажется на экране
      rootMargin: '0px 0px -50px 0px', // Легкий отступ снизу
    }
  );

  titles.forEach(title => {
    if (title.classList.contains('split-done')) return;

    const text = title.textContent.trim();
    title.innerHTML = '';
    const words = text.split(/\s+/);

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'vibe-word';

      const chars = word.split('');
      chars.forEach((char, charIndex) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'vibe-char';
        charSpan.textContent = char;

        // Каскадная задержка: сначала слово, потом буквы внутри него
        const delay = wordIndex * 0.15 + charIndex * 0.04;

        // Применяем задержку только к transition (появление), но не к animation (блик)
        charSpan.style.transitionDelay = `${delay}s`;

        wordSpan.appendChild(charSpan);
      });

      title.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        title.appendChild(document.createTextNode(' '));
      }
    });

    title.classList.add('split-done');

    // 2. Отдаем готовый заголовок нашему наблюдателю
    observer.observe(title);
  });
}
