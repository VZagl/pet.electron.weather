import { BrowserWindow, ipcMain } from 'electron';
import { i_appConfig } from '~types/i_appConfig';
import { i_appConfig_renderer } from '~types/i_appConfig_renderer';
import { e_api } from '~types/t_api';

type t_mainAppProps = {
	config: i_appConfig;
	mainWindow: BrowserWindow;
};

export const MainApp = (props: t_mainAppProps) => {
	/** /
	ipcMain.handle(e_api.app.loadPrefs, async () => {
		console.log(`#app/ipcMain.handle( ${e_api.app.loadPrefs} )`);
		const config = props.config.renderer;
		return config;
	});
	/**/
	ipcMain.on(e_api.app.savePrefs, (_event, config: i_appConfig_renderer) => {
		console.log(`#app/ipcMain.on( ${e_api.app.savePrefs} ) config = `, config);
		props.config.renderer = config;
	});

	// IPC test
	ipcMain.on(e_api.app.ping, (event, ...args) =>
		console.log(`#app/ipcMain.on( ${e_api.app.ping} )\n\tevent = ${event}\n\targs = `, args)
	);

	// Send config to renderer process after AppWindow is loaded
	props.mainWindow.webContents.on('did-finish-load', () => {
		props.mainWindow.webContents.send(e_api.app.configLoaded, props.config.renderer);
	});
};
