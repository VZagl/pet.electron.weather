import React from 'react';

export const WeatherForecast: React.FC = () => {
	return (
		<div className='weatherForecast'>
			<h2>Прогноз погоды</h2>
			<div className='spinner' />
			{/* Добавьте здесь логику для отображения прогноза погоды */}
		</div>
	);
};
