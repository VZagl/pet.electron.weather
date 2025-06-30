// Типы для географических данных

// Интерфейс для страны
export interface i_country {
	id: string; // ISO код страны (UA, US, DE)
	name_key: string; // Ключ для локализации названия
	timezone: string; // Основная временная зона
}

// Интерфейс для города
export interface i_city {
	id: string; // Уникальный ID города
	id_country: string; // Код страны
	name_key: string; // Ключ для локализации
	location: i_location;
	is_capital?: boolean; // Столица ли
}

export interface i_location {
	latitude: number; // Широта
	longitude: number; // Долгота
	elevation?: number; // Высота над уровнем моря
	timezone?: string; // Временная зона
}
