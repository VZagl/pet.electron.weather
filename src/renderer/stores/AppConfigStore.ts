import { makeAutoObservable } from 'mobx';
import { i_appConfig_renderer } from '~types/i_appConfig_renderer';

class t_appConfigStore {
	// count: number = 0;
	config: i_appConfig_renderer = {};

	constructor() {
		makeAutoObservable(this);
	}
}

export const appConfig_Store = new t_appConfigStore();
