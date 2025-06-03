import {
	i_geocodingResult,
	i_weatherForecast,
	i_weatherLocation,
} from '~types/weatherServiceTypes';

export async function getWeatherForecast(
	locations: i_weatherLocation[]
): Promise<i_weatherForecast[]> {
	const forecasts: i_weatherForecast[] = [];

	for (const location of locations) {
		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m,precipitation_probability`
		);
		const data = await response.json();

		forecasts.push({
			location,
			temperature: data.hourly.temperature_2m,
			time: data.hourly.time,
			precipitation: data.hourly.precipitation_probability,
		});
	}

	return forecasts;
}

export async function geocodeCity(cityName: string): Promise<i_geocodingResult[]> {
	const response = await fetch(
		`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5`
	);
	const data = await response.json();
	return data.results || [];
}
