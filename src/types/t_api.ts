import { ElectronAPI as i_electronAPI } from '@electron-toolkit/preload';

import { e_apiApp, i_apiApp } from './t_apiApp';
import { e_actionsWin, i_apiWin } from './t_apiWin';

class te_api {
	readonly app = e_apiApp;
	readonly win = e_actionsWin;
}
const e_api = new te_api();

interface i_api {
	app: i_apiApp;
	win: i_apiWin;
}

export { e_api };
export type { i_api, i_electronAPI };
