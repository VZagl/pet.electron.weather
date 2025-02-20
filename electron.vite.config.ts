import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	main: {
		/* Условное использование плагина:
      Плагин externalizeDepsPlugin используется только в продакшн-среде,
      что упрощает процесс сборки и снижает нагрузку в режиме разработки.
    */
		plugins: process.env.NODE_ENV === 'production' ? [externalizeDepsPlugin()] : [],
	},
	preload: {
		plugins: process.env.NODE_ENV === 'production' ? [externalizeDepsPlugin()] : [],
	},
	renderer: {
		plugins: [tsconfigPaths(), react()],
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
	},
});
