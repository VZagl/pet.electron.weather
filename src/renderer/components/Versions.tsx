import { JSX, useState } from 'react';
import { withDescription } from './withDescription';

function Versions(): JSX.Element {
	const [versions] = useState(window.electron.process.versions);

	return (
		<ul className='versions'>
			<li className='electron-version'>Electron v{versions.electron}</li>
			<li className='chrome-version'>Chromium v{versions.chrome}</li>
			<li className='node-version'>Node v{versions.node}</li>
		</ul>
	);
}

const component = withDescription(Versions);

export { component as Versions };
