import { i_cacheEntry } from '~types/cacheServiceTypes';

export class MemoryCache {
	private storage: Map<string, i_cacheEntry<any>> = new Map();
	private ttl: number;

	constructor(ttlMinutes: number = 30) {
		this.ttl = ttlMinutes * 60 * 1000;
	}

	set<T>(key: string, value: T): void {
		this.storage.set(key, {
			data: value,
			timestamp: Date.now(),
		});
	}

	get<T>(key: string): T | null {
		const entry = this.storage.get(key);
		if (!entry) return null;

		if (Date.now() - entry.timestamp > this.ttl) {
			this.storage.delete(key);
			return null;
		}

		return entry.data;
	}

	generateKey(params: Record<string, any>): string {
		return JSON.stringify(params);
	}
}
