import { JSX } from 'react';
import electronLogo from '~/assets/electron.svg';
import { Versions } from '~/components/Versions';

const HelloVite = (): JSX.Element => {
	const ipcHandle_Ping = (): void => {
		window.api.app.ping('ping - test data');
		console.log('#HelloVite.ipcHandle_Ping');
	};

	console.log('#HelloVite.render');
	return (
		<div className='helloVite'>
			<h1>Hello Vite + Electron + React + MobX!</h1>
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
			<Versions />
		</div>
	);
};

HelloVite.displayName = 'HelloVite';

export { HelloVite };
