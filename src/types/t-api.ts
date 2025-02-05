import { ElectronAPI as i_electronAPI } from '@electron-toolkit/preload';
import { e_apiApp, i_apiApp } from './t-api-app';
import { e_actionsWin, i_apiWin } from './t-api-win';

class te_api {
	app = e_apiApp;
	win = e_actionsWin;
}
const e_api = new te_api();

interface i_api {
	app: i_apiApp;
	win: i_apiWin;
}

export { e_api };
export type { i_api, i_electronAPI };
