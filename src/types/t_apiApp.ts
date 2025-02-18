import { i_appConfig_renderer } from './i_appConfig_renderer';

const c_channelApp = 'app:';

export enum e_apiApp {
	loadPrefs = c_channelApp + 'load-prefs',
	getWeather = c_channelApp + 'get-weather',
	ping = c_channelApp + 'ping',
	// ipcRenderer = c_channelApp + 'ipcRenderer',
}

export interface i_apiApp {
	/*
	ipcRenderer: {
		sendMessage(channel: e_apiApp, ...args: unknown[]);
		on(channel: e_apiApp, func: (...args: unknown[]) => void);
		once(channel: e_apiApp, func: (...args: unknown[]) => void);
	};
  */
	getWeather: (data: Object, callback: Function) => Object;
	loadPreferences: () => Promise<i_appConfig_renderer>;
	ping: (data: any) => void;
}
