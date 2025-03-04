import { e_appState } from './e_appState';

export interface i_appConfig_renderer {
	lastLocation?: {
		// name?: string;
		center?: [number, number];
		zoom?: number;
	};
	cities?: string[];
	lastState?: e_appState;
}
