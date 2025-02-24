import { e_actionsWin } from './e_actionsWin';

export const c_channelWin = 'win:';
export const c_channelWinSendAction = c_channelWin + 'send-action';

export interface i_apiWin {
	sendAction: (action: e_actionsWin) => void;
	// invoke: () => Promise<void>;
}
