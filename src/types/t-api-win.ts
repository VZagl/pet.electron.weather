export const c_channelWin = 'win:send';

export enum e_actionsWin {
	show = 'show',
	showInactive = 'show-inactive',
	min = 'min',
	max = 'max',
	close = 'close',
}

export interface i_apiWin {
	send: (action: e_actionsWin) => void;
}
