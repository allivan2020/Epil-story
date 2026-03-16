import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// У тебя папка assets лежит в корне, поэтому путь такой:
const inputDir = './assets/raw-images';
const outputDir = './public/images/optimized';

// 1. Проверяем и создаем папки, если их нет
if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
  console.log(
    '📁 Создал папку: ./assets/raw-images. Положи туда свои картинки!'
  );
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 2. Читаем файлы
const files = fs
  .readdirSync(inputDir)
  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

if (files.length === 0) {
  console.log(
    '⚠️  В папке ./assets/raw-images нет картинок. Добавь их и запусти скрипт снова.'
  );
  process.exit(0);
}

const sizes = [
  { width: 480, suffix: 'small' },
  { width: 1024, suffix: 'medium' },
  { width: 1920, suffix: 'large' },
];

// 3. Обработка
files.forEach(file => {
  const filename = path.parse(file).name;
  const inputPath = path.join(inputDir, file);

  sizes.forEach(size => {
    const baseOutput = path.join(outputDir, `${filename}-${size.suffix}`);

    sharp(inputPath)
      .resize(size.width)
      .webp({ quality: 80 })
      .toFile(`${baseOutput}.webp`)
      .then(() => console.log(`✓ WebP: ${filename}-${size.suffix}`))
      .catch(err => console.error(`Ошибка WebP: ${err}`));

    sharp(inputPath)
      .resize(size.width)
      .avif({ quality: 60 })
      .toFile(`${baseOutput}.avif`)
      .then(() => console.log(`⚡ AVIF: ${filename}-${size.suffix}`))
      .catch(err => console.error(`Ошибка AVIF: ${err}`));
  });
});
