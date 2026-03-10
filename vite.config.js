import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    // 1. ИСПРАВЛЕНИЕ: Убрали 'src'. Теперь корень — это папка, где лежит сам конфиг и index.html
    root: './',
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      // 2. ИСПРАВЛЕНИЕ: Готовый проект будет собираться в папку dist в корне
      outDir: './dist',
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      // 3. ИСПРАВЛЕНИЕ: Учим Vite следить за изменениями в твоей новой папке partials
      FullReload(['./*.html', './partials/**/*.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});
