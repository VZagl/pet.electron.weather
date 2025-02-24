export interface i_appConfig_renderer {
	lastLocation?: {
		// name?: string;
		center?: [number, number];
		zoom?: number;
	};
	cities?: string[];
}
