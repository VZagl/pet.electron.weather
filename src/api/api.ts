import { i_api } from '../types/t-api';
import { apiApp } from './api-app';
import { apiWin } from './api-win';

// Custom APIs for renderer
export const api: i_api = {
	app: apiApp,
	win: apiWin,
};
