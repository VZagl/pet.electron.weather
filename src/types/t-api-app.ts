const c_channelApp = 'app:';

export enum e_apiApp {
	loadPrefs = c_channelApp + 'load-prefs',
	getWeather = c_channelApp + 'get-weather',
	ping = c_channelApp + 'ping',
}

export interface i_apiApp {
	getWeather: (data: Object, callback: Function) => Object;
	loadPreferences: () => Promise<void>;
	ping: (data: any) => void;
}
