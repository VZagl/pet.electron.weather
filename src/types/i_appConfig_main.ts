export interface i_appConfig_main {
	// Настройки данных
	data?: {
		path?: string; // Путь к основным данным (по умолчанию './data')
	};

	// Настройки кэша
	cache?: {
		path?: string; // Путь к кэшу (по умолчанию './cache')
		maxSize?: number; // Максимальный размер кэша в МБ
		retentionDays?: number; // Сколько дней хранить кэш
		cleanupOnStart?: boolean; // Очищать устаревший кэш при запуске
	};

	// Настройки API
	apiTimeout?: number; // Таймаут запросов к API в секундах
	maxConcurrentRequests?: number; // Максимальное количество одновременных запросов
}
