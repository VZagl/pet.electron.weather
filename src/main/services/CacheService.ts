import { promises as fs } from 'fs';
import JSON5 from 'json5';
import * as path from 'path';
import { i_appConfig_main } from '~src/types/i_appConfig_main';

// TODO: Переписать на использование класса DiskCache

/**
 * Сервис кэширования данных
 * Обеспечивает хранение и управление кэшем данных
 */

export class CacheService {
	// Путь к кэшу
	private cachePath: string;

	// Настройки кэша
	private cacheMaxSize: number;
	private cacheRetentionDays: number;
	private cacheCleanupOnStart: boolean;

	constructor(config: i_appConfig_main = {}) {
		// Инициализация пути к кэшу
		this.cachePath = config.cachePath || './cache';

		// Инициализация настроек кэша
		this.cacheMaxSize = config.cacheMaxSize || 100; // МБ
		this.cacheRetentionDays = config.cacheRetentionDays || 30;
		this.cacheCleanupOnStart = config.cacheCleanupOnStart !== false; // по умолчанию true
	}

	// Инициализация с очисткой кэша при необходимости
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

	// Инициализация директории кэша
	private async initializeCacheDirectory(): Promise<void> {
		try {
			await fs.mkdir(this.cachePath, { recursive: true });
		} catch (error) {
			console.error('Ошибка инициализации директории кэша:', error);
			throw error;
		}
	}

	// Очистка устаревшего кэша
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
						cleanedFiles++;
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
			}

			console.log(`Очистка кэша завершена:`);
			console.log(`  Удалено устаревших файлов: ${cleanedFiles}`);
			console.log(`  Текущий размер кэша: ${totalSizeMB.toFixed(2)} МБ`);
		} catch (error) {
			console.error('Ошибка очистки кэша:', error);
		}
	}

	// Рекурсивный обход директории кэша
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

	// Получение пути к файлу кэша
	private getCacheFilePath(cityId: string, date: Date, parameter: string): string {
		const [countryCode, cityCode] = cityId.split('.');
		const year = date.getFullYear().toString();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return path.join(
			this.cachePath,
			countryCode,
			cityCode,
			year,
			month,
			`${day}_${parameter}.json5`
		);
	}

	// Сохранение данных в кэш
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

	// Загрузка данных из кэша
	public async loadFromCache<T>(key: string): Promise<T | null> {
		try {
			const filePath = path.join(this.cachePath, `${key}.json5`);
			const content = await fs.readFile(filePath, 'utf-8');
			return JSON5.parse(content) as T;
		} catch (error) {
			// Файл не найден - это нормально для кэша
			if ((error as any).code === 'ENOENT') {
				return null;
			}
			console.error(`Ошибка загрузки из кэша (${key}):`, error);
			throw error;
		}
	}

	// Проверка существования данных в кэше
	public async isCached(key: string): Promise<boolean> {
		try {
			const filePath = path.join(this.cachePath, `${key}.json5`);
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	// Удаление данных из кэша
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

	// Получение информации о кэше
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
				totalFiles++;
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

	// Полная очистка кэша
	public async clearCache(): Promise<void> {
		try {
			let deletedFiles = 0;

			await this.walkCacheDirectory(this.cachePath, async (filePath: string) => {
				try {
					await fs.unlink(filePath);
					deletedFiles++;
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
