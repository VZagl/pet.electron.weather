export interface i_cacheEntry<T> {
	data: T;
	timestamp: number;
}

export interface i_locationKey {
	latitude: number;
	longitude: number;
}
