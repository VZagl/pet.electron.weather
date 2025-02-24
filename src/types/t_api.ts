import { ElectronAPI as i_electronAPI } from '@electron-toolkit/preload';

import { e_actionsWin } from './e_actionsWin';
import { e_apiApp } from './e_apiApp';
import { i_apiApp } from './i_apiApp';
import { i_apiWin } from './i_apiWin';

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
