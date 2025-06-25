import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { TE_Weather_RequestState, useWeatherService } from '~/services/WeatherServiceHook';
import { useAppConfig_Store } from '~/stores/AppConfig_StoreContext';
import './WeatherForecast.scss';

export const WeatherForecast = observer(() => {
	const store = useAppConfig_Store();
	const weatherService = useWeatherService();
	const [requestState, setRequestState] = useState<TE_Weather_RequestState>(
		TE_Weather_RequestState.READY
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchWeather = async () => {
			if (!store.config?.cities?.length) return;

			setRequestState(TE_Weather_RequestState.LOADING);
			setError(null);

			try {
				const result = await weatherService.getWeather({
					cities: store.config.cities,
				});

				if (result.error) {
					setError(result.error);
					setRequestState(TE_Weather_RequestState.ERROR);
				} else {
					setRequestState(TE_Weather_RequestState.READY);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
				setRequestState(TE_Weather_RequestState.ERROR);
			}
		};

		fetchWeather();
	}, [store.config?.cities]);

	if (requestState === TE_Weather_RequestState.LOADING) {
		return (
			<div className='weatherForecast'>
				<h2>Загрузка прогноза погоды...</h2>
				<div className='spinner' />
			</div>
		);
	}

	if (requestState === TE_Weather_RequestState.ERROR) {
		return (
			<div className='weatherForecast'>
				<h2>Ошибка загрузки прогноза</h2>
				{error && <div className='error'>{error}</div>}
			</div>
		);
	}

	return (
		<div className='weatherForecast'>
			<h2>Прогноз погоды</h2>
			<div className='cities'>
				{store.config?.cities?.map((city, index) => (
					<div key={index} className='city'>
						{city}
					</div>
				))}
			</div>
		</div>
	);
});

WeatherForecast.displayName = 'WeatherForecast';
