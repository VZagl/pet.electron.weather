import {
	i_geocodingResult,
	i_weatherForecast,
	i_weatherLocation,
} from '~types/weatherServiceTypes';
import { i_appConfig_renderer } from './i_appConfig_renderer';

export const c_channelApp = 'app:';

export interface i_apiApp {
	/*
	ipcRenderer: {
		sendMessage(channel: e_apiApp, ...args: unknown[]);
		on(channel: e_apiApp, func: (...args: unknown[]) => void);
		once(channel: e_apiApp, func: (...args: unknown[]) => void);
	};
  */
	getWeather(locations: i_weatherLocation[]): Promise<i_weatherForecast[]>;
	getGeocodeCity(cityName: string): Promise<i_geocodingResult[]>;
	// loadPreferences: () => Promise<i_appConfig_renderer>;
	savePreferences: (config: i_appConfig_renderer) => void;
	ping: (data: any) => void;
}
