import { JSX, useEffect } from 'react';

import { i_appConfig_renderer } from 'src/types/i_appConfig_renderer';
import { appConfigStore } from '~/stores/AppConfigStore';

export const Init = (): JSX.Element => {
	const config = appConfigStore.getConfig();

	useEffect(() => {
		console.log('#Init.useEffect.loadPreferences');

		const handleBeforeUnload = () => {
			const newConfig = { ...config };
			newConfig.cities = ['test city'];
			console.log('#Init.useEffect.loadPreferences.return() =', newConfig);
			window.api.app.savePreferences(newConfig);
		};

		window.api.app
			.loadPreferences()
			.then((result: i_appConfig_renderer) => {
				console.log('#Init.useEffect.loadPreferences.then(result) =', result);
				appConfigStore.config = result;
			})
			.catch((reason) => {
				console.log('#Init.useEffect.loadPreferences.catch(reason) =', reason);
			});
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	console.log('#Init.render');
	return <div id='init'> </div>;
};
