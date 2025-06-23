import { promises as fs } from 'fs';
import JSON5 from 'json5';
import * as path from 'path';
import { i_city, i_country } from '~src/types/geography';
import { i_appConfig_main } from '~src/types/i_appConfig_main';

/**
 * Сервис данных для управления географической информацией и локализацией
 * Обеспечивает загрузку и хранение данных о странах, городах и переводах
 *
 * @class
 * @description Централизованный класс для работы с географическими данными
 */
export class GeographyDataService {
	private countries: Map<string, i_country> = new Map();
	private cities: Map<string, i_city> = new Map();
	private locales: Map<string, Record<string, string>> = new Map();
	private currentLocale: string = 'ru';

	// Путь к данным
	private dataPath: string;

	constructor(config: i_appConfig_main = {}) {
		// Инициализация пути к данным
		this.dataPath = config.dataPath || './data';
	}

	// Инициализация сервиса
	public async initialize(): Promise<void> {
		await this.initializeDirectories();

		console.log(`GeographyDataService инициализирован:`);
		console.log(`  Данные: ${this.dataPath}`);
	}

	// Инициализация директорий
	private async initializeDirectories(): Promise<void> {
		try {
			await fs.mkdir(this.dataPath, { recursive: true });
			await fs.mkdir(path.join(this.dataPath, 'cities'), { recursive: true });
			await fs.mkdir(path.join(this.dataPath, 'locales'), { recursive: true });
		} catch (error) {
			console.error('Ошибка инициализации директорий:', error);
			throw error;
		}
	}

	// Загрузка основных данных стран
	public async loadCountries(): Promise<void> {
		if (this.countries.size > 0) return;

		try {
			const filePath = path.join(this.dataPath, 'countries.json5');
			const content = await fs.readFile(filePath, 'utf-8');
			const data = JSON5.parse(content);

			data.countries.forEach((country: i_country) => {
				this.countries.set(country.code, country);
			});

			console.log(`Загружено ${this.countries.size} стран из ${filePath}`);
		} catch (error) {
			console.error('Ошибка загрузки стран:', error);
			throw error;
		}
	}

	// Загрузка городов конкретной страны
	public async loadCitiesByCountry(countryCode: string): Promise<void> {
		try {
			const filePath = path.join(this.dataPath, 'cities', `${countryCode.toLowerCase()}.json5`);
			const content = await fs.readFile(filePath, 'utf-8');
			const data = JSON5.parse(content);

			data.cities.forEach((city: any) => {
				const cityInfo: i_city = {
					...city,
					id: `${countryCode.toLowerCase()}.${city.city_code}`,
					country_code: countryCode.toLowerCase(),
				};
				this.cities.set(cityInfo.id, cityInfo);
			});

			console.log(`Загружено ${data.cities.length} городов для ${countryCode}`);
		} catch (error) {
			console.error(`Ошибка загрузки городов для ${countryCode}:`, error);
			throw error;
		}
	}

	// Загрузка локализации
	public async loadLocale(locale: string): Promise<void> {
		if (this.locales.has(locale)) return;

		try {
			const filePath = path.join(this.dataPath, 'locales', `${locale}.json5`);
			const content = await fs.readFile(filePath, 'utf-8');
			const translations = JSON5.parse(content);

			this.locales.set(locale, translations);
			this.currentLocale = locale;

			console.log(`Загружена локализация: ${locale}`);
		} catch (error) {
			console.error(`Ошибка загрузки локализации ${locale}:`, error);
			throw error;
		}
	}

	// Получение локализованного названия
	public getLocalizedName(key: string, locale?: string): string {
		const targetLocale = locale || this.currentLocale;
		const translations = this.locales.get(targetLocale);

		return translations?.[key] || key;
	}

	// Получение городов с локализованными названиями
	public getLocalizedCities(countryCode?: string): Array<i_city & { localizedName: string }> {
		let cities = Array.from(this.cities.values());

		if (countryCode) {
			cities = cities.filter((city) => city.country_code === countryCode.toLowerCase());
		}

		return cities.map((city) => ({
			...city,
			localizedName: this.getLocalizedName(city.name_key),
		}));
	}

	// Получение всех стран
	public getCountries(): i_country[] {
		return Array.from(this.countries.values());
	}

	// Получение страны по коду
	public getCountry(countryCode: string): i_country | undefined {
		return this.countries.get(countryCode.toLowerCase());
	}

	// Получение города по ID
	public getCity(cityId: string): i_city | undefined {
		return this.cities.get(cityId);
	}

	// Получение текущей локали
	public getCurrentLocale(): string {
		return this.currentLocale;
	}

	// Установка текущей локали с автоматической загрузкой данных
	public async setCurrentLocale(locale: string): Promise<void> {
		try {
			// Загружаем данные локализации для новой локали
			await this.loadLocale(locale);

			// Устанавливаем новую локаль как текущую
			this.currentLocale = locale;

			console.log(`Локаль изменена на: ${locale}`);
		} catch (error) {
			console.error(`Ошибка установки локали ${locale}:`, error);
			throw error;
		}
	}

	// Проверка доступности локали
	public async isLocaleAvailable(locale: string): Promise<boolean> {
		try {
			const filePath = path.join(this.dataPath, 'locales', `${locale}.json5`);
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	// Получение списка доступных локалей
	public async getAvailableLocales(): Promise<string[]> {
		try {
			const localesDir = path.join(this.dataPath, 'locales');
			const files = await fs.readdir(localesDir);

			return files
				.filter((file) => file.endsWith('.json5'))
				.map((file) => file.replace('.json5', ''));
		} catch (error) {
			console.error('Ошибка получения списка локалей:', error);
			return [];
		}
	}
}
