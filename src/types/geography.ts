// Типы для географических данных
export interface i_country {
	code: string; // ISO код страны (UA, US, DE)
	name_key: string; // Ключ для локализации названия
	timezone: string; // Основная временная зона
	currency?: string; // Валюта (опционально)
}

export interface i_city {
	id: string; // Уникальный ID города
	country_code: string; // Код страны
	name_key: string; // Ключ для локализации
	latitude: number; // Широта
	longitude: number; // Долгота
	elevation: number; // Высота над уровнем моря
	timezone: string; // Временная зона города
	population?: number; // Население (опционально)
	is_capital?: boolean; // Столица ли
}

export interface i_cityInfo {
	id: string; // ua.kiev
	country_code: string; // ua
	city_code: string; // kiev
	name_key: string; // city.ua.kiev
	latitude: number;
	longitude: number;
	elevation: number;
	timezone: string;
	population?: number;
	is_capital?: boolean;
}
