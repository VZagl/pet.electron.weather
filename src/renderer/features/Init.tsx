import { action, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { appConfig_Store } from '~/stores/AppConfigStore';
import { mobxToJSON } from '~/utils/mobxToJSON';
import { i_appConfig_renderer } from '~types/i_appConfig_renderer';

export const Init = observer(() => {
	const [loaded, setLoaded] = useState(false);
	// const config = appConfig_Store.config;

	const handleBeforeUnload = () => {
		const newConfig = toJS(appConfig_Store.config);
		console.log('#Init.handleBeforeUnload.savePreferences =', mobxToJSON(newConfig));
		window.api.app.savePreferences(newConfig);
	};

	const updateConfig = action((newConfig: i_appConfig_renderer) => {
		/*
      `runInAction` в этом коде используется для выполнения изменений состояния в MobX в рамках действия.
      В данном случае, он используется внутри функции `updateConfig`, чтобы обновить конфигурацию `appConfig_Store.config` новым значением `newConfig`.

      `runInAction` гарантирует, что все изменения состояния, выполненные внутри его блока,
      будут рассматриваться как одно действие. Это помогает MobX отслеживать изменения состояния и оптимизировать обновления наблюдателей.
      В данном случае, это означает, что обновление `appConfig_Store.config` будет выполнено атомарно и MobX сможет правильно обработать это изменение.
    */
		runInAction(() => {
			appConfig_Store.config = newConfig;
		});
	});

	useEffect(() => {
		console.log('#Init.useEffect.loadPreferences');

		window.api.app
			.loadPreferences()
			.then((result: i_appConfig_renderer) => {
				console.log('#Init.useEffect.loadPreferences.then(result) =', result);
				updateConfig(result);
				if (!loaded) setLoaded(true);
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
	return '';
});
