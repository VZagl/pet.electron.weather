// Интерфейс для описания структуры конфигурации
export interface I_AppConfig {
	readonly version: string;
	lastLocation?: {
		name?: string;
		center?: [number, number];
		zoom: number;
	};
	[key: string]: any; // Замените на конкретные ключи и типы, если структура известна
}
