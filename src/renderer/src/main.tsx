import React from 'react';
import ReactDOM from 'react-dom/client';

import { i_appConfig_renderer } from 'src/types/i_appConfig_renderer';
import { appConfigStore } from '~/stores/AppConfigStore';
import { App } from './App';
import './assets/main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

window.api.app
	.loadPreferences()
	// .then(result=>{return result as I_AppConfig})
	.then((result: i_appConfig_renderer) => {
		console.log('#main window.app.loadPreferences().then(result) =', result);
		appConfigStore.config = result;
	})
	.catch((reason) => {
		console.log('#main window.app.loadPreferences().catch(reason) =', reason);
	});
