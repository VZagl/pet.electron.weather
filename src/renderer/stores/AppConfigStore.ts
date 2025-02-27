import { makeAutoObservable } from 'mobx';
import { i_appConfig_renderer } from '~types/i_appConfig_renderer';

class T_AppConfigStore {
	count: number = 0;
	config: i_appConfig_renderer = {};

	constructor() {
		makeAutoObservable(this);
	}
}

export const appConfig_Store = new T_AppConfigStore();
