import { is, platform } from '@electron-toolkit/utils';
import { BrowserWindow, ipcMain, shell } from 'electron';
import path, { join } from 'path';

import icon from '../../resources/icon.png?asset';
import { e_api } from '../types/t-api';

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	console.log(`Extensions loading... START`);
	const listExtensions = [
		installer.REACT_DEVELOPER_TOOLS,
		installer.REDUX_DEVTOOLS,
		installer.MOBX_DEVTOOLS,
	];
	installer
		.installExtension(listExtensions, {
			loadExtensionOptions: { allowFileAccess: true },
			forceDownload: !!process.env.UPGRADE_EXTENSIONS,
		})
		.then(([...addedExtensions]) => {
			console.log(`[INFO] Added Extensions:`);
			addedExtensions.forEach((item) => {
				console.log(`> ${item.name}, id = ${item.id}`);
				console.log(`\t${item.path}`);
				console.log(`\t${item.url}`);
			});
		})
		.catch((err) => console.info('[WARN] An error occurred while trying to add extensions:\n', err))
		.finally(() => console.log(`Extensions loading... END`));
};

export async function createAppWindow(): Promise<void> {
	console.log('#app.createAppWindow');
	if (is.dev) {
		await installExtensions();
	}

	// Create the browser window.
	const win = new BrowserWindow({
		width: 1200,
		height: 900,
		show: false,
		// autoHideMenuBar: true,
		...(platform.isLinux ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			// ...(is.dev ? { contextIsolation: false } : {contextIsolation: true}),
		},
	});

	win.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	win.on('ready-to-show', () => {
		console.log('#app/win.on(ready-to-show)');
		// Not show the traffic light buttons in MacOS
		if (platform.isMacOS) win.setWindowButtonVisibility(false);
		win.show();
	});

	win.webContents.on('dom-ready', () => {
		console.log('#app/win.webContents.on(dom-ready)');
		win.webContents.openDevTools();
		// win.webContents.openDevTools({ mode: 'bottom' });
		// createView(win, url);
	});

	win.on(e_api.win.close, () => {
		console.log(`#app/win.on( ${e_api.win.close} )`);
		// const views = win.getBrowserViews();
		// views.forEach((v) => win.removeBrowserView(v));
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		win.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		win.loadFile(path.join(__dirname, '../renderer/index.html'));
	}
	//
	ipcMain.handle(e_api.app.loadPrefs, async () => {
		console.log(`#app.createAppWindow/ipcMain.handle( ${e_api.app.loadPrefs} )`);
		return { data: `#app.createAppWindow/ipcMain.handle( ${e_api.app.loadPrefs} )` };
	});
	// IPC test
	ipcMain.on(e_api.app.ping, (event, ...args) =>
		console.log(`#app/ipcMain.on( ${e_api.app.ping} )\n\tevent = ${event}\n\targs = `, args)
	);
}
