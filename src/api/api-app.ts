import { ipcRenderer } from 'electron';
import { e_api } from '../types/t-api';
import { i_apiApp } from '../types/t-api-app';

export const apiApp: i_apiApp = {
	getWeather: async (data, callback) => {
		console.log('#preload/index#api.getWeather data=', data);
		try {
			const result = await ipcRenderer.invoke('app:get-weather', data);
			callback(result);
		} catch (error) {
			console.log('#preload/index#api.getWeather ERROR', error);
			callback({});
		}
	},
	// демо из https://www.electronjs.org/ru/docs/latest/tutorial/context-isolation#usage-with-typescript
	loadPreferences: async () => {
		console.log('#preload/index#api.loadPreferences... start');
		const result = await ipcRenderer.invoke(e_api.app.loadPrefs);
		console.log('#preload/index#api.loadPreferences result =', result);
		return result;
	},
	ping: (data): void => {
		ipcRenderer.send(e_api.app.ping, data);
	},
};
