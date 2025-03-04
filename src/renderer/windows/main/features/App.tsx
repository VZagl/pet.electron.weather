import { observer } from 'mobx-react-lite';
import { JSX, useEffect } from 'react';
import { appConfig_Store } from '~/stores/AppConfigStore';
import { mobxToJSON } from '~/utils/mobxToJSON';
import { e_appState } from '~types/e_appState';
// import { HelloVite } from './HelloVite';
import './App.scss';
import { History } from './History';
import { WeatherForecast } from './WeatherForecast';

const App = observer((): JSX.Element => {
	const store = appConfig_Store;

	useEffect(() => {
		console.log('#App.useEffect[] config old = ', mobxToJSON(store));
		if (!store.config) return;
		store.config.cities = ['test city from App'];
		console.log('#App.useEffect[] config = ', mobxToJSON(store));
	}, []);

	useEffect(() => {
		console.log('#App.useEffect[store.config] config = ', mobxToJSON(store.config));
	}, [store.config]);

	const renderContent = () => {
		if (!store.config) return <div className='spinner' />;
		if (store.config?.lastState === e_appState.HISTORY) {
			return <History />;
		} else {
			return <WeatherForecast />;
		}
	};

	console.log('#App.render');
	return (
		<div className='app'>
			{renderContent()}
			{/* <HelloVite /> */}
		</div>
	);
});

App.displayName = 'App';

export { App };
