import { BrowserWindow } from 'electron';
import path from 'path';
// import { join } from 'path/posix';

export function createLoadingWindow(): BrowserWindow {
	const loadingWindow = new BrowserWindow({
		width: 400,
		height: 300,
		frame: false,
		alwaysOnTop: true,
		transparent: true,
		webPreferences: {
			// preload: join(__dirname, '../preload/loadingPreload.js'),
			sandbox: false,
			contextIsolation: true,
		},
	});

	loadingWindow.loadFile(path.join(__dirname, '../renderer/loading.html'));

	return loadingWindow;
}
