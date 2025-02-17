import { I_AppConfig } from './i-app-config';

const c_channelApp = 'app:';

export enum e_apiApp {
	loadPrefs = c_channelApp + 'load-prefs',
	getWeather = c_channelApp + 'get-weather',
	ping = c_channelApp + 'ping',
}

export interface i_apiApp {
	getWeather: (data: Object, callback: Function) => Object;
	loadPreferences: () => Promise<I_AppConfig>;
	ping: (data: any) => void;
}
