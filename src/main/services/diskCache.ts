import fs from 'fs/promises';
import path from 'path';
import { i_cacheEntry, i_locationKey } from '~types/cacheServiceTypes';
import { i_weatherForecast, i_weatherLocation } from '~types/weatherServiceTypes';

export class DiskCache {
	private readonly cacheDir: string;
	private ttl: number;

	constructor(cacheDir: string, ttlMinutes: number = 0) {
		if (!cacheDir || typeof cacheDir !== 'string') {
			throw new Error('Cache directory must be a valid string');
		}
		if (ttlMinutes < 0) {
			throw new Error('TTL minutes cannot be negative');
		}

		this.cacheDir = cacheDir;
		this.ttl = ttlMinutes * 60 * 1000;
	}

	private async ensureCacheDir(): Promise<void> {
		try {
			await fs.mkdir(this.cacheDir, { recursive: true });
		} catch (error) {
			throw new Error(`Failed to create cache directory: ${error}`);
		}
	}

	private getLocationKey({ latitude, longitude }: i_locationKey): string {
		if (typeof latitude !== 'number' || typeof longitude !== 'number') {
			throw new Error('Latitude and longitude must be numbers');
		}
		if (latitude < -90 || latitude > 90) {
			throw new Error('Latitude must be between -90 and 90');
		}
		if (longitude < -180 || longitude > 180) {
			throw new Error('Longitude must be between -180 and 180');
		}

		return `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
	}

	private getCacheFilePath(key: string): string {
		return path.join(this.cacheDir, `${key}.json`);
	}

	async set<T>(location: i_locationKey, value: T): Promise<void> {
		if (!location || value === undefined) {
			throw new Error('Location and value are required');
		}

		await this.ensureCacheDir();
		const key = this.getLocationKey(location);
		const cacheEntry: i_cacheEntry<T> = {
			data: value,
			timestamp: Date.now(),
		};

		try {
			await fs.writeFile(this.getCacheFilePath(key), JSON.stringify(cacheEntry, null, 2), 'utf-8');
		} catch (error) {
			throw new Error(`Failed to write cache file: ${error}`);
		}
	}

	async get<T>(location: i_locationKey): Promise<T | null> {
		if (!location) {
			return null;
		}

		try {
			const key = this.getLocationKey(location);
			const filePath = this.getCacheFilePath(key);
			const content = await fs.readFile(filePath, 'utf-8');
			const entry: i_cacheEntry<T> = JSON.parse(content);

			// Проверка структуры кэш-записи
			if (!entry || typeof entry.timestamp !== 'number' || entry.data === undefined) {
				await fs.unlink(filePath).catch(() => {}); // Удаляем поврежденный файл
				return null;
			}

			if (this.ttl > 0 && Date.now() - entry.timestamp > this.ttl) {
				await fs.unlink(filePath).catch(() => {}); // Игнорируем ошибки удаления
				return null;
			}

			return entry.data;
		} catch (error) {
			// Логирование ошибки может быть полезным для отладки
			console.warn('Cache read error:', error);
			return null;
		}
	}

	async saveWeatherHistory(forecast: i_weatherForecast): Promise<void> {
		if (!forecast || !forecast.location) {
			throw new Error('Valid forecast with location is required');
		}

		// Убедимся, что location соответствует i_locationKey
		const location: i_locationKey = {
			latitude: forecast.location.latitude,
			longitude: forecast.location.longitude,
		};

		await this.set(location, forecast);
	}

	async getWeatherHistory(location: i_weatherLocation): Promise<i_weatherForecast | null> {
		if (!location) {
			return null;
		}

		// Преобразуем i_weatherLocation в i_locationKey
		const locationKey: i_locationKey = {
			latitude: location.latitude,
			longitude: location.longitude,
		};

		return await this.get<i_weatherForecast>(locationKey);
	}

	// Дополнительный метод для очистки кэша
	async clearCache(): Promise<void> {
		try {
			const files = await fs.readdir(this.cacheDir);
			const jsonFiles = files.filter((file) => file.endsWith('.json'));

			await Promise.all(
				jsonFiles.map((file) => fs.unlink(path.join(this.cacheDir, file)).catch(() => {}))
			);
		} catch (error) {
			// Директория может не существовать
		}
	}
}
