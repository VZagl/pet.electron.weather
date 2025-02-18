import { ipcRenderer } from 'electron';

import { e_apiApp, i_apiApp } from '../types/t_apiApp';

export const apiApp: i_apiApp = {
	/*
	ipcRenderer: {
		sendMessage(channel: e_apiApp, ...args: unknown[]) {
			ipcRenderer.send(channel, ...args);
		},
		on(channel: e_apiApp, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: e_apiApp, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
  */
	getWeather: async (data, callback) => {
		console.log('#preload/index#api.getWeather data=', data);
		try {
			const result = await ipcRenderer.invoke(e_apiApp.getWeather, data);
			callback(result);
		} catch (error) {
			console.log('#preload/index#api.getWeather ERROR', error);
			callback({});
		}
	},
	// демо из https://www.electronjs.org/ru/docs/latest/tutorial/context-isolation#usage-with-typescript
	loadPreferences: async () => {
		console.log('#preload/index#api.loadPreferences... start');
		const result = await ipcRenderer.invoke(e_apiApp.loadPrefs);
		console.log('#preload/index#api.loadPreferences result =', result);
		return result;
	},
	ping: (data): void => {
		ipcRenderer.send(e_apiApp.ping, data);
	},
};
