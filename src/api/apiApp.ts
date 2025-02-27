import { ipcRenderer } from 'electron';
import { e_apiApp } from '../types/e_apiApp';
import { i_apiApp } from '../types/i_apiApp';
import { i_appConfig_renderer } from '../types/i_appConfig_renderer';

export const apiApp: i_apiApp = {
	/** /
   * https://www.electronjs.org/ru/docs/latest/tutorial/context-isolation#security-considerations
   * так делать нельзя, т.к. это нарушает изоляцию контекста
   * Просто включение contextIsolationи использование contextBridgeне означает автоматически, что все, что вы делаете, безопасно.
   * Например, этот код небезопасен:
   * ```js
   *  contextBridge.exposeInMainWorld('myAPI', {
   *    send: ipcRenderer.send
   *  });
   *  ```
   * Это позволит злоумышленнику отправлять сообщения в основной процесс, что может привести к серьезным проблемам безопасности.
   * Вместо этого вы должны использовать contextBridge.exposeInMainWorldдля предоставления доступа к API,
   * которое вы контролируете, и не предоставлять доступ к API, которое может быть использовано для злоумышленных целей.
   * /
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
	/**/

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

	savePreferences: function (config: i_appConfig_renderer): void {
		ipcRenderer.send(e_apiApp.savePrefs, config);
	},

	ping: (data): void => {
		ipcRenderer.send(e_apiApp.ping, data);
	},
};
