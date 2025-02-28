// import { runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { JSX, useEffect } from 'react';
// import electronLogo from '~/assets/electron.svg';
// import { Versions } from '~/components/Versions';
import { appConfig_Store } from '~/stores/AppConfigStore';
import { mobxToJSON } from '~/utils/mobxToJSON';
import { e_appState } from '~types/e_appState';
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
	/*
	const ipcHandle_Ping = (): void => {
		window.api.app.ping('ping - test data');
		runInAction(() => {
			store.count += 1;
			store.config?.cities?.push('ping - ' + store.count);
		});
		console.log('#App.ipcHandle_Ping config = ', toJS(store));
	};
	*/
	const renderContent = () => {
		if (store.config?.lastState === e_appState.HISTORY) {
			return <History />;
		} else {
			return <WeatherForecast />;
		}
	};

	console.log('#App.render');
	return (
		<div id='app'>
			{renderContent()}
			{/* <h1>Hello Vite + Electron + React + MobX!</h1>
			<img alt='logo' className='logo' src={electronLogo} />
			<div className='creator'>Powered by electron-vite</div>
			<div className='text'>
				Build an Electron app with <span className='react'>React</span>
				&nbsp;and <span className='ts'>TypeScript</span>
			</div>
			<p className='tip'>
				Please try pressing <code>F12</code> to open the devTool
			</p>
			<div className='actions'>
				<div className='action'>
					<a href='https://electron-vite.org/' target='_blank' rel='noreferrer'>
						Documentation
					</a>
				</div>
				<div className='action'>
					<a target='_blank' rel='noreferrer' onClick={ipcHandle_Ping}>
						Send IPC
					</a>
				</div>
			</div>
			<Versions /> */}
		</div>
	);
});

App.displayName = 'App';

export { App };
