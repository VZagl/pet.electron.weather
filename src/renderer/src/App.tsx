import { observer } from 'mobx-react-lite';
import { JSX, useEffect } from 'react';
import electronLogo from './assets/electron.svg';
import Versions from './components/Versions';

import { appConfigStore } from '~/stores/AppConfigStore';

export const App = observer((): JSX.Element => {
	const { config } = appConfigStore;

	useEffect(() => {
		console.log('#App.useEffect[config] config = ', JSON.stringify(config));
	}, [config]);

	const ipcHandle = (): void => {
		// window.apiElectron.ipcRenderer.send(E_apiApp.ping);
		window.api.app.ping('ping - test data');
	};

	console.log('#App.render');
	return (
		<>
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
					<a target='_blank' rel='noreferrer' onClick={ipcHandle}>
						Send IPC
					</a>
				</div>
			</div>
			<Versions></Versions>
		</>
	);
});
