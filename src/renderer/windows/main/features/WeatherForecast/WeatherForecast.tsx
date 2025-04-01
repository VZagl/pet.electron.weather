import { observer } from 'mobx-react-lite';
import { useAppConfig_Store } from '~/stores/AppConfig_StoreContext';
import './WeatherForecast.scss';

export const WeatherForecast = observer(() => {
	const store = useAppConfig_Store();

	return (
		<div className='weatherForecast'>
			<h2>Прогноз погоды</h2>
			<div className='spinner' />
			{/* Добавьте здесь логику для отображения прогноза погоды */}
			<div className='text'>
				cities = <span>{store?.config.cities}</span>
			</div>
		</div>
	);
});
