import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { JSX, useEffect } from 'react';
import { useAppConfig_Store } from '~/stores/AppConfig_StoreContext';
import { AppConfig_StoreProvider } from '~/stores/AppConfig_StoreProvider';
import { mobxToJSON } from '~/utils/mobxToJSON';
import { e_appState } from '~types/e_appState';
import { History } from '../History/History';
import { WeatherForecast } from '../WeatherForecast/WeatherForecast';
import './App.scss';

const AppContent = observer((): JSX.Element => {
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

	const renderContent = () => {
		if (!appConfig_Store.config) return <div className='spinner' />;
		if (appConfig_Store.config?.lastState === e_appState.HISTORY) {
			return <History />;
		} else {
			return <WeatherForecast />;
		}
	};

	return renderContent();
});

const App = () => {
	console.log('#App.render');
	return (
		<AppConfig_StoreProvider>
			<div className='app'>
				<AppContent />
			</div>
		</AppConfig_StoreProvider>
	);
};

App.displayName = 'App';

export { App };
