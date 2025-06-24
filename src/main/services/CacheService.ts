import { promises as fs } from 'fs';
import JSON5 from 'json5';
import * as path from 'path';

/** Интерфейс конфигурации сервиса кэширования
 *
 * @interface i_cacheConfig
 * @property {string} [cachePath] - Путь к директории кэша
 * @property {number} [cacheMaxSize] - Максимальный размер кэша в МБ
 * @property {number} [cacheRetentionDays] - Количество дней хранения кэша
 * @property {boolean} [cacheCleanupOnStart] - Флаг автоматической очистки при запуске
 */
export interface i_cacheConfig {
	cachePath?: string;
	cacheMaxSize?: number;
	cacheRetentionDays?: number;
	cacheCleanupOnStart?: boolean;
}

/** Сервис кэширования данных с поддержкой файлового хранения
 *
 * @description Обеспечивает управление кэшем:
 * - Создание и инициализацию директории кэша
 * - Сохранение и загрузку данных
 * - Автоматическую очистку устаревших файлов
 * - Контроль размера и срока хранения кэша
 *
 * @class
 */
export class CacheService {
	// Путь к кэшу
	private cachePath: string;

	// Настройки кэша
	private cacheMaxSize: number;
	private cacheRetentionDays: number;
	private cacheCleanupOnStart: boolean;

	/** Создает экземпляр сервиса кэширования с настройками по умолчанию
	 *
	 * @description Инициализирует параметры кэша из переданной конфигурации
	 * - Устанавливает путь к директории кэша
	 * - Определяет максимальный размер кэша в МБ
	 * - Устанавливает период хранения кэша в днях
	 * - Настраивает автоматическую очистку кэша при старте
	 *
	 * @param {i_cacheConfig} [options={}] - Объект конфигурации для настройки параметров кэша
	 * @param {string} [options.cachePath='./cache'] - Путь к директории кэша
	 * @param {number} [options.cacheMaxSize=100] - Максимальный размер кэша в МБ
	 * @param {number} [options.cacheRetentionDays=30] - Количество дней хранения кэша
	 * @param {boolean} [options.cacheCleanupOnStart=true] - Флаг автоматической очистки устаревшего кэша при запуске
	 */
	constructor({
		cachePath = './cache', // Путь к кэшу (по умолчанию './cache')
		cacheMaxSize = 100, // Максимальный размер кэша в МБ
		cacheRetentionDays = 30, // Сколько дней хранить кэш
		cacheCleanupOnStart = true, // Очищать устаревший кэш при запуске
	}: i_cacheConfig = {}) {
		// Инициализация настроек кэша
		this.cachePath = cachePath;
		this.cacheMaxSize = cacheMaxSize; // МБ
		this.cacheRetentionDays = cacheRetentionDays;
		this.cacheCleanupOnStart = cacheCleanupOnStart;
	}

	/** Инициализирует сервис кэширования
	 *
	 * @description Метод выполняет следующие действия:
	 * - Создает директорию кэша, если она не существует
	 * - При необходимости очищает устаревший кэш
	 * - Выводит информационные логи о конфигурации кэша
	 *
	 * @throws {Error} Если не удалось создать директорию кэша
	 * @returns {Promise<void>} Промис, завершающийся после полной инициализации сервиса кэша
	 */
	public async initialize(): Promise<void> {
		await this.initializeCacheDirectory();

		if (this.cacheCleanupOnStart) {
			await this.cleanupExpiredCache();
		}

		console.log(`CacheService инициализирован:`);
		console.log(`  Кэш: ${this.cachePath}`);
		console.log(`  Срок хранения кэша: ${this.cacheRetentionDays} дней`);
		console.log(`  Максимальный размер кэша: ${this.cacheMaxSize} МБ`);
	}

	/** Создает директорию кэша, если она не существует
	 *
	 * @description Метод рекурсивно создает директорию для хранения кэша
	 * - Использует флаг { recursive: true } для создания вложенных директорий
	 * - В случае ошибки выводит сообщение в консоль и генерирует исключение
	 *
	 * @returns {Promise<void>} Промис, завершающийся после создания директории
	 */
	private async initializeCacheDirectory(): Promise<void> {
		try {
			await fs.mkdir(this.cachePath, { recursive: true });
		} catch (error) {
			console.error('Ошибка инициализации директории кэша:', error);
			throw error;
		}
	}

	/** Очищает устаревший кэш, удаляя файлы старше установленного срока хранения
	 *
	 * @description Метод выполняет следующие действия:
	 * - Рекурсивно обходит директорию кэша
	 * - Удаляет файлы, которые старше допустимого периода хранения
	 * - Отслеживает количество удаленных файлов и общий размер кэша
	 * - Выводит статистику по очистке кэша
	 *
	 * @returns {Promise<void>} Промис, завершающийся после очистки кэша
	 */
	public async cleanupExpiredCache(): Promise<void> {
		try {
			const now = Math.floor(Date.now() / 1000);
			const maxAge = this.cacheRetentionDays * 24 * 60 * 60;
			let cleanedFiles = 0;
			let totalSize = 0;

			await this.walkCacheDirectory(this.cachePath, async (filePath: string) => {
				try {
					const stats = await fs.stat(filePath);
					const fileAge = now - Math.floor(stats.mtime.getTime() / 1000);

					if (fileAge > maxAge) {
						await fs.unlink(filePath);
						cleanedFiles += 1;
					} else {
						totalSize += stats.size;
					}
				} catch (error) {
					console.warn(`Ошибка при проверке файла ${filePath}:`, error);
				}
			});

			// Проверяем общий размер кэша
			const totalSizeMB = totalSize / (1024 * 1024);

			if (totalSizeMB > this.cacheMaxSize) {
				console.warn(`Размер кэша превышает лимит (${this.cacheMaxSize} МБ)`);
				// TODO: Реализовать логику удаления файлов для соответствия максимальному размеру кэша
			}

			console.log(`Очистка кэша завершена:`);
			console.log(`  Удалено устаревших файлов: ${cleanedFiles}`);
			console.log(`  Текущий размер кэша: ${totalSizeMB.toFixed(2)} МБ`);
		} catch (error) {
			console.error('Ошибка очистки кэша:', error);
			throw error;
		}
	}

	/** Рекурсивно обходит директорию кэша и выполняет указанный колбэк для каждого JSON5 файла
	 *
	 * @param {string} dir Путь к директории для обхода
	 * @param {(filePath: string) => Promise<void>} callback Функция, вызываемая для каждого найденного JSON5 файла
	 * @returns {Promise<void>} Промис, завершающийся после обработки всех файлов
	 * @private
	 */
	private async walkCacheDirectory(
		dir: string,
		callback: (filePath: string) => Promise<void>
	): Promise<void> {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);

				if (entry.isDirectory()) {
					await this.walkCacheDirectory(fullPath, callback);
				} else if (entry.isFile() && entry.name.endsWith('.json5')) {
					await callback(fullPath);
				}
			}
		} catch (error) {
			// Директория может не существовать - это нормально
			if ((error as any).code !== 'ENOENT') {
				console.warn(`Ошибка обхода директории ${dir}:`, error);
			}
		}
	}

	/** Сохраняет данные в кэш по указанному ключу
	 *
	 * @async
	 * @template T Тип данных, которые будут сохранены в кэш
	 * @param {string} key - Ключ файла кэша для сохранения
	 * @param {T} data - Данные для сохранения в кэш
	 * @returns {Promise<void>}
	 * @description Безопасно сохраняет данные в кэш, создавая необходимые директории
	 * @throws {Error} Если возникает ошибка при сохранении файла кэша
	 */
	public async saveToCache<T>(key: string, data: T): Promise<void> {
		try {
			const filePath = path.join(this.cachePath, `${key}.json5`);
			const dir = path.dirname(filePath);

			// Создаем директорию если не существует
			await fs.mkdir(dir, { recursive: true });

			// Сохраняем данные
			const content = JSON5.stringify(data, null, 2);
			await fs.writeFile(filePath, content, 'utf-8');
		} catch (error) {
			console.error(`Ошибка сохранения в кэш (${key}):`, error);
			throw error;
		}
	}

	/** Загружает данные из кэша по указанному ключу
	 *
	 * @async
	 * @template T Тип данных, которые будут загружены из кэша
	 * @param {string} key - Ключ файла кэша для загрузки
	 * @returns {Promise<T | null>} Загруженные данные или null, если файл кэша не найден
	 * @description Безопасно загружает данные из кэша, возвращая null при отсутствии файла
	 * @throws {Error} Если содержимое файла не соответствует типу T, будет выброшено исключение при попытке приведения типов
	 */
	public async loadFromCache<T>(key: string): Promise<T | null> {
		try {
			if (!(await this.isCached(key))) {
				return null;
			}
			const filePath = path.join(this.cachePath, `${key}.json5`);
			const content = await fs.readFile(filePath, 'utf-8');
			return JSON5.parse(content) as T;
		} catch (error) {
			console.error(`Ошибка загрузки из кэша (${key}):`, error);
			throw error;
		}
	}

	/** Проверяет наличие файла кэша по указанному ключу
	 *
	 * @async
	 * @param {string} key - Ключ файла кэша для проверки
	 * @returns {Promise<boolean>} Возвращает true, если файл кэша существует, иначе false
	 * @description Безопасно проверяет существование файла кэша, не вызывая исключений
	 */
	public async isCached(key: string): Promise<boolean> {
		try {
			const filePath = path.join(this.cachePath, `${key}.json5`);
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	/** Удаляет файл кэша по указанному ключу
	 *
	 * @async
	 * @param {string} key - Ключ файла кэша для удаления
	 * @returns {Promise<void>}
	 * @description Безопасно удаляет файл кэша, игнорируя ошибку если файл не существует
	 */
	public async removeFromCache(key: string): Promise<void> {
		try {
			const filePath = path.join(this.cachePath, `${key}.json5`);
			await fs.unlink(filePath);
		} catch (error) {
			// Файл не найден - это нормально
			if ((error as any).code !== 'ENOENT') {
				console.error(`Ошибка удаления из кэша (${key}):`, error);
				throw error;
			}
		}
	}

	/** Получает статистическую информацию о текущем состоянии кэша
	 *
	 * @async
	 * @returns {Promise<{
	 *   totalFiles: number,
	 *   totalSizeMB: number,
	 *   oldestFile: Date | null,
	 *   newestFile: Date | null
	 * }>} Объект с информацией о кэше:
	 * - Общее количество файлов
	 * - Общий размер кэша в мегабайтах
	 * - Дата самого старого файла
	 * - Дата самого нового файла
	 * @description Анализирует содержимое директории кэша и собирает статистические метаданные
	 */
	public async getCacheInfo(): Promise<{
		totalFiles: number;
		totalSizeMB: number;
		oldestFile: Date | null;
		newestFile: Date | null;
	}> {
		let totalFiles = 0;
		let totalSize = 0;
		let oldestTime = Number.MAX_SAFE_INTEGER;
		let newestTime = 0;

		await this.walkCacheDirectory(this.cachePath, async (filePath: string) => {
			try {
				const stats = await fs.stat(filePath);
				totalFiles += 1;
				totalSize += stats.size;

				const mtime = stats.mtime.getTime();
				if (mtime < oldestTime) oldestTime = mtime;
				if (mtime > newestTime) newestTime = mtime;
			} catch (error) {
				console.warn(`Ошибка получения информации о файле ${filePath}:`, error);
			}
		});

		return {
			totalFiles,
			totalSizeMB: totalSize / (1024 * 1024),
			oldestFile: oldestTime === Number.MAX_SAFE_INTEGER ? null : new Date(oldestTime),
			newestFile: newestTime === 0 ? null : new Date(newestTime),
		};
	}

	/** Полностью очищает кэш, удаляя все файлы в директории кэша
	 *
	 * @async
	 * @throws {Error} Если возникает ошибка при удалении файлов кэша
	 * @returns {Promise<void>}
	 * @description Метод перебирает все файлы в директории кэша и удаляет их,
	 * логируя количество удаленных файлов или возможные ошибки
	 */
	public async clearCache(): Promise<void> {
		try {
			let deletedFiles = 0;

			await this.walkCacheDirectory(this.cachePath, async (filePath: string) => {
				try {
					await fs.unlink(filePath);
					deletedFiles += 1;
				} catch (error) {
					console.warn(`Ошибка удаления файла ${filePath}:`, error);
				}
			});

			console.log(`Кэш очищен. Удалено файлов: ${deletedFiles}`);
		} catch (error) {
			console.error('Ошибка очистки кэша:', error);
			throw error;
		}
	}
}
