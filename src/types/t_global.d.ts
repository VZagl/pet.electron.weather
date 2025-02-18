import { i_api, i_electronAPI } from './t_api';

declare global {
	interface Window {
		electron: i_electronAPI;
		api: i_api;
	}
}
