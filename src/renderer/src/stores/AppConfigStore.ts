import { makeAutoObservable } from 'mobx';

import { I_AppConfig } from 'src/types/i-app-config';

export class T_AppConfigStore {
	constructor() {
		makeAutoObservable(this);
	}

	private _config: I_AppConfig | undefined;

	get config() {
		return this._config;
	}

	set config(value) {
		this._config = value;
	}
}

const appConfigStore = new T_AppConfigStore();
export { appConfigStore };
