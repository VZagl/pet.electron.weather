import { makeAutoObservable } from 'mobx';

import { i_appConfig_renderer } from 'src/types/i_appConfig_renderer';

export class T_AppConfigStore {
	constructor() {
		makeAutoObservable(this);
	}

	private _config: i_appConfig_renderer | undefined;

	get config() {
		return this._config;
	}

	set config(value) {
		this._config = value;
	}
}

const appConfigStore = new T_AppConfigStore();
export { appConfigStore };
