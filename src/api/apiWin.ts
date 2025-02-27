import { ipcRenderer } from 'electron';
import { c_channelWin_SendAction, i_apiWin } from '~types/i_apiWin';

export const apiWin: i_apiWin = {
	sendAction: (action) => {
		ipcRenderer.send(c_channelWin_SendAction, action);
	},
};
