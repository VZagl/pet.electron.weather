import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Configuration for Vite in an Electron project.
 *
 * This configuration is divided into three main parts: `main`, `preload`, and `renderer`.
 *
 * @module electron.vite.config
 */

/**
 * Main process configuration.
 *
 * @property {Object} main - Configuration for the main process.
 * @property {Array} main.plugins - Plugins used in the main process. The `externalizeDepsPlugin` is used only in production to simplify the build process and reduce load during development.
 * @property {Object} main.resolve - Module resolution options.
 * @property {Object} main.resolve.alias - Aliases for module paths.
 * @property {string} main.resolve.alias['~'] - Alias for 'src/main' directory.
 * @property {string} main.resolve.alias['~src'] - Alias for 'src' directory.
 * @property {string} main.resolve.alias['~types'] - Alias for 'src/types' directory.
 */

/**
 * Preload script configuration.
 *
 * @property {Object} preload - Configuration for the preload scripts.
 * @property {Array} preload.plugins - Plugins used in the preload scripts. The `externalizeDepsPlugin` is used only in production.
 * @property {Object} preload.build - Build options for the preload scripts.
 * @property {Object} preload.build.rollupOptions - Rollup options for the preload scripts.
 * @property {Object} preload.build.rollupOptions.input - Input files for the preload scripts, generated from `src/preload/*Preload.ts`.
 */

/**
 * Renderer process configuration.
 *
 * @property {Object} renderer - Configuration for the renderer process.
 * @property {Array} renderer.plugins - Plugins used in the renderer process. The `react` plugin is used.
 * @property {Object} renderer.build - Build options for the renderer process.
 * @property {Object} renderer.build.rollupOptions - Rollup options for the renderer process.
 * @property {Object} renderer.build.rollupOptions.input - Input files for the renderer process, generated from `src/renderer/*.html`.
 * @property {Object} renderer.resolve - Module resolution options.
 * @property {Object} renderer.resolve.alias - Aliases for module paths.
 * @property {string} renderer.resolve.alias['~'] - Alias for 'src/renderer' directory.
 * @property {string} renderer.resolve.alias['~src'] - Alias for 'src' directory.
 * @property {string} renderer.resolve.alias['~types'] - Alias for 'src/types' directory.
 * @property {Object} renderer.css - CSS options for the renderer process.
 * @property {Object} renderer.css.preprocessorOptions - Preprocessor options for CSS.
 * @property {Object} renderer.css.preprocessorOptions.scss - SCSS preprocessor options.
 * @property {string} renderer.css.preprocessorOptions.scss.api - SCSS API version, set to 'modern-compiler'.
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
