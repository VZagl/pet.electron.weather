export interface i_appConfig_main {
	weatherCache?: {
		directory: string; // путь к директории кэша
		ttlMinutes: number; // время жизни кэша в минутах
	};
}
