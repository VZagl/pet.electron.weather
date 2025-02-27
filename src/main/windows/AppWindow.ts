import { is, platform } from '@electron-toolkit/utils';
import { BrowserWindow, shell } from 'electron';
import path, { join } from 'path';
import { installExtensions } from '~/installExtensions';
import { e_api } from '~types/t_api';
import icon from '/resources/icon.png?asset';

export async function createAppWindow(): Promise<BrowserWindow> {
	console.log('#app.createAppWindow');
	await installExtensions();

	// Create the main window.
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
		show: false,
		// autoHideMenuBar: true,
		...(platform.isLinux ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/appPreload.js'),
			sandbox: false,
			contextIsolation: true,
			// ...(is.dev ? { contextIsolation: false } : {contextIsolation: true}),
		},
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	mainWindow.on('ready-to-show', () => {
		console.log('#app/mainWindow.on(ready-to-show)');
		// Not show the traffic light buttons in MacOS
		if (platform.isMacOS) mainWindow.setWindowButtonVisibility(false);
		mainWindow.show();
	});

	mainWindow.webContents.on('dom-ready', () => {
		if (!is.dev) return;
		console.log('#app/mainWindow.webContents.on(dom-ready)');
		// win.webContents.openDevTools();
		mainWindow.webContents.openDevTools({ mode: 'bottom' });
		// createView(win, url);
	});

	mainWindow.on(e_api.win.close, () => {
		console.log(`#app/mainWindow.on( ${e_api.win.close} )`);
		// const views = win.getBrowserViews();
		// views.forEach((v) => win.removeBrowserView(v));
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
	}

	return mainWindow;
}
