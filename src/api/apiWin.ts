import { ipcRenderer } from 'electron';
import { c_channelWinSendAction, i_apiWin } from '../types/t_apiWin';

export const apiWin: i_apiWin = {
	sendAction: (action) => {
		ipcRenderer.send(c_channelWinSendAction, action);
	},
};
