import * as fs from 'fs';
import JSON5 from 'json5';
import * as path from 'path';

import packageJson from '../../package.json';
import { i_appConfig } from '../types/i_appConfig';

const pathDefault = path.resolve(process.cwd(), 'config.json5');

export class t_configLoader {
	private _config: i_appConfig;
	private configFilePath: string;

	constructor(configFilePath: string = pathDefault) {
		this.configFilePath = configFilePath;
		this._config = { version: `${packageJson.version}` };
		// this._config = this.loadConfig(configFilePath);
	}

	get config() {
		return this._config;
	}

	public async loadConfig(): Promise<i_appConfig> {
		try {
			const fileContent = await fs.promises.readFile(this.configFilePath, 'utf-8');
			this._config = JSON5.parse(fileContent);
		} catch (error) {
			console.error(`[WARN] Failed to load configuration [${this.configFilePath}]`);
			this._config = { version: `${packageJson.version}` };
		}
		if (!this._config.main) this._config.main = {};
		if (!this._config.renderer) this._config.renderer = {};
		return this._config;
	}

	/*
	private loadConfig(configFilePath: string): i_appConfig {
		let config: i_appConfig;
		try {
			const fileContent = fs.readFileSync(configFilePath, 'utf-8');
			config = JSON5.parse(fileContent); // as i_appConfig;
		} catch (error) {
			console.error(`[WARN] Failed to load configuration [${configFilePath}]`);
			config = {
				version: `${packageJson.version}`,
			};
		}
		if (!config.main) config.main = {};
		if (!config.renderer) config.renderer = {};
		return config;
	}
  */

	public saveConfig(configFilePath: string = pathDefault): void {
		try {
			const jsonString = JSON5.stringify(this._config, null, '\t');
			// const jsonString = JSON5.stringify(this.config, null, 2);
			fs.writeFileSync(configFilePath, jsonString, 'utf-8');
			console.log(`[INFO] Configuration saved to [${configFilePath}] = `, jsonString);
		} catch (error) {
			console.error(`[ERROR] Failed to save configuration [${configFilePath}]`, error);
			throw new Error('Failed to save configuration');
		}
	}

	public get(key: keyof i_appConfig): any {
		return this._config[key];
	}

	public getAll(): i_appConfig {
		return this._config;
	}
}

// Пример использования
// const configLoader = new ConfigLoader();
// const someValue = configLoader.get('someKey');
