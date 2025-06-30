import { promises as fs } from 'fs';
import JSON5 from 'json5';
import * as path from 'path';
import { i_city, i_country } from '~types/geography';
import { i_appConfig_main } from '~types/i_appConfig_main';

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

	constructor(config: i_appConfig_main) {
		this.dataPath = config.data?.path || './data';
	}

	// Инициализация сервиса
	public async initialize(): Promise<void> {
		try {
			console.log('🌍 Инициализация сервиса географических данных...');
			console.log(`  Данные: ${this.dataPath}`);

			// Создаем необходимые директории
			try {
				await fs.mkdir(this.dataPath, { recursive: true });
				await fs.mkdir(path.join(this.dataPath, 'cities'), { recursive: true });
				await fs.mkdir(path.join(this.dataPath, 'locales'), { recursive: true });
			} catch (error) {
				console.error('❌ Ошибка при создании директорий:', error);
				throw error;
			}

			console.log('✅ Сервис географических данных инициализирован');
		} catch (error) {
			console.error('❌ Ошибка инициализации сервиса географических данных:', error);
			throw error;
		}
	}

	/** Загружает список стран из файла countries.json5
	 * Кэширует загруженные страны в Map для предотвращения повторной загрузки
	 *
	 * @async
	 * @throws {Error} В случае ошибки чтения или парсинга файла стран
	 */
	public async loadCountries(): Promise<void> {
		if (this.countries.size > 0) return;

		try {
			const filePath = path.join(this.dataPath, 'countries.json5');
			const content = await fs.readFile(filePath, 'utf-8');
			const data = JSON5.parse(content);

			data.countries.forEach((country: i_country) => {
				this.countries.set(country.id, country);
			});

			console.log(`Загружено ${this.countries.size} стран из ${filePath}`);
		} catch (error) {
			console.error('Ошибка загрузки стран:', error);
			throw error;
		}
	}

	/** Загружает города для указанной страны из JSON5-файла
	 * Парсит файл городов, сохраняет города в кэш-карту this.cities
	 *
	 * @async
	 * @param {string} idCountry - Идентификатор страны (в нижнем регистре)
	 * @throws {Error} В случае ошибки чтения или парсинга файла городов
	 */
	public async loadCitiesByCountry(idCountry: string): Promise<void> {
		try {
			const filePath = path.join(this.dataPath, 'cities', `${idCountry.toLowerCase()}.json5`);
			const content = await fs.readFile(filePath, 'utf-8');
			const data = JSON5.parse(content);

			data.cities.forEach((city: i_city) => {
				this.cities.set(city.id, city);
			});

			console.log(`Загружено ${data.cities.length} городов для ${idCountry}`);
		} catch (error) {
			console.error(`Ошибка загрузки городов для ${idCountry}:`, error);
			throw error;
		}
	}

	/** Загружает локализацию для указанного языка из JSON5-файла
	 * Кэширует загруженную локализацию в Map для предотвращения повторной загрузки
	 * Загруженная локализация устанавливается как текущая локализация
	 *
	 * @async
	 * @param {string} locale - Код языка локализации
	 * @throws {Error} В случае ошибки чтения или парсинга файла локализации
	 */
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

	/** Сохраняет локализацию для указанного языка в JSON5-файл
	 * Записывает переданные данные локализации в файл с использованием JSON5-формата
	 *
	 * @async
	 * @param {string} locale - Код языка локализации
	 * @param {any} data - Объект с переводами для сохранения
	 * @throws {Error} В случае ошибки записи файла локализации
	 */
	public async saveLocale(locale: string, data: any): Promise<void> {
		try {
			const filePath = path.join(this.dataPath, 'locales', `${locale}.json5`);
			const content = JSON5.stringify(data, null, 2);
			await fs.writeFile(filePath, content, 'utf-8');

			console.log(`Сохранена локализация: ${locale}`);
		} catch (error) {
			console.error(`Ошибка сохранения локализации ${locale}:`, error);
			throw error;
		}
	}

	/** Получает локализованное название по ключу с учетом текущей или указанной локали
	 *
	 * @param {string} key - Ключ для перевода
	 * @param {string} [locale] - Код языка локализации (необязательный, по умолчанию используется текущая локаль)
	 * @returns {string} Локализованное название или исходный ключ, если перевод не найден
	 */
	public getLocalizedName(key: string, locale?: string): string {
		const targetLocale = locale || this.currentLocale;
		const translations = this.locales.get(targetLocale);

		return translations?.[key] || key;
	}

	/** Получает список городов с локализованными названиями, опционально отфильтрованных по стране
	 *
	 * @param {string} [idCountry] - Код страны для фильтрации городов (необязательный)
	 * @returns {Array<i_city & { localizedName: string }>} Массив городов с добавленным локализованным названием
	 */
	public getLocalizedCities(idCountry?: string): Array<i_city & { localizedName: string }> {
		let cities = Array.from(this.cities.values());

		if (idCountry) {
			cities = cities.filter((city) => city.id_country === idCountry.toLowerCase());
		}

		return cities.map((city) => ({
			...city,
			localizedName: this.getLocalizedName(city.name_key),
		}));
	}

	/** Получает массив всех стран из внутреннего хранилища
	 *
	 * @returns {i_country[]} Массив объектов стран
	 */
	public getCountries(): i_country[] {
		return Array.from(this.countries.values());
	}

	/** Получает страну по её идентификатору
	 *
	 * @param {string} idCountry - Идентификатор страны (нечувствительный к регистру)
	 * @returns {i_country | undefined} Объект страны или undefined, если страна не найдена
	 */
	public getCountry(idCountry: string): i_country | undefined {
		return this.countries.get(idCountry.toLowerCase());
	}

	/** Получает город по его идентификатору
	 *
	 * @param {string} idCity - Идентификатор города
	 * @returns {i_city | undefined} Объект города или undefined, если город не найден
	 */
	public getCity(idCity: string): i_city | undefined {
		return this.cities.get(idCity);
	}

	/** Возвращает текущую установленную локаль
	 *
	 * @returns {string} Текущая локаль приложения
	 */
	public getCurrentLocale(): string {
		return this.currentLocale;
	}

	/** Устанавливает текущую локаль приложения с автоматической загрузкой данных для указанной локали
	 *
	 * @param {string} locale - Код локали для установки
	 * @throws {Error} Если не удается загрузить данные для указанной локали
	 * @returns {Promise<void>} Промис, завершающийся после успешной смены локали
	 */
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

	/** Проверяет доступность локали по её идентификатору
	 *
	 * @param {string} locale - Код локали для проверки
	 * @returns {Promise<boolean>} Промис, возвращающий true, если локаль доступна, иначе false
	 */
	public async isLocaleAvailable(locale: string): Promise<boolean> {
		try {
			const filePath = path.join(this.dataPath, 'locales', `${locale}.json5`);
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	/** Возвращает список доступных локалей приложения
	 *
	 * @returns {Promise<string[]>} Промис, возвращающий массив кодов доступных локалей
	 * @throws {Error} В случае ошибки чтения директории локалей
	 */
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
