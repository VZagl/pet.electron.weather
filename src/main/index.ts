import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow } from 'electron';
import { App } from '~/app';
import { t_configLoader } from '~/configLoader';
import { createAppWindow } from '~/windows/AppWindow';
import { createLoadingWindow } from '~/windows/LoadingWindow';

const configLoader = new t_configLoader();
console.log('[INFO] config = ', configLoader);

function loadConfigAndCreateMainWindow(loadingWindow: BrowserWindow): void {
	// Загрузка конфигурации
	configLoader
		.loadConfig()
		.then(async (config) => {
			console.log('[INFO] Конфигурация загружена:', config);
			loadingWindow.webContents.send('loading-progress', 'Конфигурация загружена');
			await createAppWindow();
			App({ config });
			loadingWindow.close();
		})
		.catch((error) => {
			console.error('[ERROR] Ошибка при загрузке конфигурации:', error);
			loadingWindow.webContents.send('loading-progress', 'Ошибка при загрузке конфигурации');
		});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron');

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	const loadingWindow = createLoadingWindow();
	loadingWindow.on('ready-to-show', () => {
		loadConfigAndCreateMainWindow(loadingWindow);
	});

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createAppWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Сохранение конфигурации при закрытии приложения
app.on('before-quit', () => {
	try {
		configLoader.saveConfig();
		console.log('[INFO] Конфигурация успешно сохранена.');
	} catch (error) {
		console.error('[ERROR] Ошибка при сохранении конфигурации:', error);
	}
});
