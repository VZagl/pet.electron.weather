import { ElectronAPI as i_electronAPI } from '@electron-toolkit/preload';
import { deepFreeze } from '~src/utils/deepFreeze';
import { e_actionsWin } from './e_actionsWin';
import { e_apiApp } from './e_apiApp';
import { i_apiApp } from './i_apiApp';
import { i_apiWin } from './i_apiWin';

interface i_api {
	app: i_apiApp;
	win: i_apiWin;
}

class te_api {
	readonly app = e_apiApp;
	readonly win = e_actionsWin;
}

const e_api = deepFreeze(new te_api());

export { e_api };
export type { i_api, i_electronAPI };
