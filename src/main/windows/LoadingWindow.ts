import { is } from '@electron-toolkit/utils';
import { BrowserWindow } from 'electron';
import path from 'path';
// import { join } from 'path/posix';

export function createLoadingWindow(): BrowserWindow {
	console.log('#LoadingWindow.createLoadingWindow');

	const loadingWindow = new BrowserWindow({
		width: 400,
		height: 300,
		frame: false,
		// alwaysOnTop: true,
		// transparent: true,
		webPreferences: {
			// preload: join(__dirname, '../preload/loadingPreload.js'),
			sandbox: false,
			contextIsolation: true,
		},
	});

	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		loadingWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/loading.html');
	} else {
		loadingWindow.loadFile(path.join(__dirname, '../renderer/loading.html'));
	}

	return loadingWindow;
}
