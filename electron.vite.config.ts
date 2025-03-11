import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Конфигурация для Vite в проекте Electron.
 *
 * Эта конфигурация разделена на три основные части: `main`, `preload` и `renderer`.
 *
 * @module electron.vite.config
 */

/**
 * Конфигурация для основного процесса `main`.
 *
 * @property {Object} main - Конфигурация для основного процесса.
 * @property {Array} main.plugins - Плагины, используемые в основном процессе. Плагин `externalizeDepsPlugin` используется только в продакшн-среде для упрощения процесса сборки и снижения нагрузки в режиме разработки.
 * @property {Object} main.resolve - Опции разрешения модулей.
 * @property {Object} main.resolve.alias - Псевдонимы для путей модулей.
 * @property {string} main.resolve.alias['~'] - Псевдоним для директории 'src/main'.
 * @property {string} main.resolve.alias['~src'] - Псевдоним для директории 'src'.
 * @property {string} main.resolve.alias['~types'] - Псевдоним для директории 'src/types'.
 */

/**
 * Конфигурация для скриптов `preload`.
 *
 * @property {Object} preload - Конфигурация для скриптов preload.
 * @property {Array} preload.plugins - Плагины, используемые в скриптах preload. Плагин `externalizeDepsPlugin` используется только в продакшн-среде.
 * @property {Object} preload.build - Опции сборки для скриптов preload.
 * @property {Object} preload.build.rollupOptions - Опции Rollup для скриптов preload.
 * @property {Object} preload.build.rollupOptions.input - Входные файлы для скриптов preload, генерируемые из `src/preload/*Preload.ts`.
 * @property {Object} preload.resolve - Опции разрешения модулей.
 * @property {Object} preload.resolve.alias - Псевдонимы для путей модулей.
 * @property {string} preload.resolve.alias['~'] - Псевдоним для директории 'src/preload'.
 * @property {string} preload.resolve.alias['~src'] - Псевдоним для директории 'src'.
 * @property {string} preload.resolve.alias['~types'] - Псевдоним для директории 'src/types'.
 */

/**
 * Конфигурация для процесса `renderer`.
 *
 * @property {Object} renderer - Конфигурация для процесса renderer.
 * @property {Array} renderer.plugins - Плагины, используемые в процессе renderer. Используется плагин `react`.
 * @property {Object} renderer.build - Опции сборки для процесса renderer.
 * @property {Object} renderer.build.rollupOptions - Опции Rollup для процесса renderer.
 * @property {Object} renderer.build.rollupOptions.input - Входные файлы для процесса renderer, генерируемые из `src/renderer/*.html`.
 * @property {Object} renderer.resolve - Опции разрешения модулей.
 * @property {Object} renderer.resolve.alias - Псевдонимы для путей модулей.
 * @property {string} renderer.resolve.alias['~'] - Псевдоним для директории 'src/renderer'.
 * @property {string} renderer.resolve.alias['~src'] - Псевдоним для директории 'src'.
 * @property {string} renderer.resolve.alias['~types'] - Псевдоним для директории 'src/types'.
 * @property {Object} renderer.css - Опции CSS для процесса renderer.
 * @property {Object} renderer.css.preprocessorOptions - Опции препроцессора для CSS.
 * @property {Object} renderer.css.preprocessorOptions.scss - Опции препроцессора SCSS.
 * @property {string} renderer.css.preprocessorOptions.scss.api - Версия API SCSS, установлена на 'modern-compiler'.
 */

export default defineConfig({
	main: {
		/* Условное использование плагина:
      Плагин externalizeDepsPlugin используется только в продакшн-среде,
      что упрощает процесс сборки и снижает нагрузку в режиме разработки.
    */
		plugins: process.env.NODE_ENV === 'production' ? [externalizeDepsPlugin()] : [],
		resolve: {
			alias: {
				'~': path.resolve(__dirname, 'src/main'),
				'~src': path.resolve(__dirname, 'src'),
				'~main': path.resolve(__dirname, 'src/renderer/windows/main'),
				'~types': path.resolve(__dirname, 'src/types'),
			},
		},
	},
	preload: {
		plugins: process.env.NODE_ENV === 'production' ? [externalizeDepsPlugin()] : [],
		build: {
			rollupOptions: {
				input: Object.fromEntries(
					globSync('src/preload/*Preload.ts').map((file) => [
						path.basename(file, path.extname(file)),
						fileURLToPath(new URL(file, import.meta.url)),
					])
				),
			},
		},
		resolve: {
			alias: {
				'~': path.resolve(__dirname, 'src/preload'),
				'~src': path.resolve(__dirname, 'src'),
				'~main': path.resolve(__dirname, 'src/renderer/windows/main'),
				'~types': path.resolve(__dirname, 'src/types'),
			},
		},
	},
	renderer: {
		plugins: [react()],
		build: {
			rollupOptions: {
				input:
					/** /
					{
						main: resolve(__dirname, 'src/renderer/index.html'),
						loading: resolve(__dirname, 'src/renderer/loading.html'),
					},
				/**/
					Object.fromEntries(
						globSync('src/renderer/*.html').map((file) => [
							// path.relative('src/renderer', file.slice(0, file.length - path.extname(file).length)),
							path.basename(file, path.extname(file)),
							fileURLToPath(new URL(file, import.meta.url)),
						])
					),
				/**/
			},
		},
		resolve: {
			alias: {
				'~': path.resolve(__dirname, 'src/renderer'),
				'~src': path.resolve(__dirname, 'src'),
				'~main': path.resolve(__dirname, 'src/renderer/windows/main'),
				'~types': path.resolve(__dirname, 'src/types'),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
				},
			},
		},
	},
});
