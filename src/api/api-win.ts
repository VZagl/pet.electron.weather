import { ipcRenderer } from 'electron';
import { c_channelWin, i_apiWin } from '../types/t-api-win';

export const apiWin: i_apiWin = {
	send: (action) => {
		ipcRenderer.send(c_channelWin, action);
	},
};
