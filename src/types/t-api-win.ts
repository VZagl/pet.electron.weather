export const c_channelWin = 'win:';
export const c_channelWinSendAction = c_channelWin + 'send-action';
// export const c_channelWinInvoke = c_channelWin + 'invoke';

export enum e_actionsWin {
	show = 'show',
	showInactive = 'show-inactive',
	min = 'min',
	max = 'max',
	close = 'close',
}

export interface i_apiWin {
	sendAction: (action: e_actionsWin) => void;
	// invoke: () => Promise<void>;
}
