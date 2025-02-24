import { c_channelApp } from './i_apiApp';

export enum e_apiApp {
	loadPrefs = c_channelApp + 'load-prefs',
	savePrefs = c_channelApp + 'save-prefs',
	getWeather = c_channelApp + 'get-weather',
	ping = c_channelApp + 'ping',
}
