import { action, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { appConfig_Store } from '~/stores/AppConfig_Store';
import { mobxToJSON } from '~/utils/mobxToJSON';
import { e_api } from '~src/types/t_api';
import { i_appConfig_renderer } from '~types/i_appConfig_renderer';

export const Init = observer(() => {
	const handleBeforeUnload = () => {
		const newConfig = toJS(appConfig_Store.config);
		console.log('#Init/handleBeforeUnload ', mobxToJSON(newConfig));
		window.api.app.savePreferences(newConfig);
	};

	const handleOnConfigLoaded = (_event, config: i_appConfig_renderer) => {
		console.log('#Init/handleOnConfigLoaded', config);
		updateConfig(config);
	};

	const updateConfig = action((newConfig: i_appConfig_renderer) => {
		/*
			`runInAction` в этом коде используется для выполнения изменений состояния в MobX в рамках действия.
			В данном случае, он используется внутри функции `updateConfig`, чтобы обновить конфигурацию `appConfig_Store.config` новым значением `newConfig`.

			`runInAction` гарантирует, что все изменения состояния, выполненные внутри его блока,
			будут рассматриваться как одно действие. Это помогает MobX отслеживать изменения состояния и оптимизировать обновления наблюдателей.
			В данном случае это означает, что обновление `appConfig_Store.config` будет выполнено атомарно и MobX сможет правильно обработать это изменение.
		*/
		runInAction(() => {
			appConfig_Store.config = newConfig;
		});
	});

	useEffect(() => {
		console.log('#Init.useEffect.loadPreferences');

		window.addEventListener('beforeunload', handleBeforeUnload);

		/**
		 * Регистрирует слушатель IPC для события `configLoaded` от основного процесса.
		 *
		 * @constant {Function} removeConfigLoadedListener - Функция для удаления зарегистрированного слушателя IPC.
		 *
		 * Слушатель срабатывает, когда основным процессом испускается событие `${e_api.app.configLoaded}`,
		 * вызывая функцию обратного вызова `handleOnConfigLoaded`.
		 */
		const removeConfigLoadedListener = window.electron.ipcRenderer.on(
			e_api.app.configLoaded,
			handleOnConfigLoaded
		);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			removeConfigLoadedListener();
		};
	}, []);

	console.log('#Init.render');
	return '';
});

Init.displayName = 'Init';
