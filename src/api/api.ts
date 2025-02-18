import { i_api } from '../types/t_api';
import { apiApp } from './apiApp';
import { apiWin } from './apiWin';

// Custom APIs for renderer
export const api: i_api = {
	app: apiApp,
	win: apiWin,
};
