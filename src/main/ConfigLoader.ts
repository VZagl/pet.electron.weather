import * as fs from 'fs';
import JSON5 from 'json5';
import * as path from 'path';

import packageJson from '../../package.json';
import { i_appConfig } from '../types/i_appConfig';

const pathDefault = path.resolve(process.cwd(), 'config.json5');

export class t_configLoader {
	private _config: i_appConfig;

	constructor(configFilePath: string = pathDefault) {
		this._config = this.loadConfig(configFilePath);
	}

	get config() {
		return this._config;
	}

	private loadConfig(configFilePath: string): i_appConfig {
		try {
			const fileContent = fs.readFileSync(configFilePath, 'utf-8');
			const config = JSON5.parse(fileContent) as i_appConfig;
			return config;
		} catch (error) {
			console.error(`[WARN] Failed to load configuration [${configFilePath}]`);
			const AppConfig: i_appConfig = {
				version: `${packageJson.version}`,
			};
			return AppConfig;
		}
	}

	public saveConfig(configFilePath: string = pathDefault): void {
		try {
			const jsonString = JSON5.stringify(this._config, null, '\t');
			// const jsonString = JSON5.stringify(this.config, null, 2);
			fs.writeFileSync(configFilePath, jsonString, 'utf-8');
			console.log(`[INFO] Configuration saved to [${configFilePath}]`);
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
