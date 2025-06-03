export interface i_weatherLocation {
	latitude: number;
	longitude: number;
	elevation?: number;
	timezone?: string;
	start_date?: string;
	end_date?: string;
}

export interface i_weatherForecast {
	location: i_weatherLocation;
	temperature: number[];
	time: string[];
	precipitation: number[];
}

export interface i_geocodingResult {
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	timezone: string;
}
