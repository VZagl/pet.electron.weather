import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { memo, useEffect } from 'react';
import { useAppConfig_Store } from '~/stores/AppConfig_StoreContext';
import { AppConfig_StoreProvider } from '~/stores/AppConfig_StoreProvider';
import { mobxToJSON } from '~/utils/mobxToJSON';
import { e_appState } from '~types/e_appState';
import { History } from '../History/History';
import { WeatherForecast } from '../WeatherForecast/WeatherForecast';
import './App.scss';

/**
 * Рендерит контент приложения в зависимости от текущего состояния
 */
const AppContent = observer(() => {
	const appConfig_Store = useAppConfig_Store();

	useEffect(() => {
		console.log('#App.useEffect[] config old = ', mobxToJSON(appConfig_Store));
		if (!appConfig_Store.config) return;

		runInAction(() => {
			appConfig_Store.config.cities = ['test city from App'];
		});

		console.log('#App.useEffect[] config = ', mobxToJSON(appConfig_Store));
	}, []);

	useEffect(() => {
		console.log('#App.useEffect[store.config] config = ', mobxToJSON(appConfig_Store.config));
	}, [appConfig_Store.config]);

	if (!appConfig_Store.config) {
		return <div className='spinner' />;
	}

	return appConfig_Store.config?.lastState === e_appState.HISTORY ? (
		<History />
	) : (
		<WeatherForecast />
	);
});

AppContent.displayName = 'AppContent';

/**
 * Корневой компонент приложения
 */
export const App = memo(() => {
	console.log('#App.render');

	return (
		<AppConfig_StoreProvider>
			<div className='app'>
				<AppContent />
			</div>
		</AppConfig_StoreProvider>
	);
});

App.displayName = 'App';
