import { IpcRendererEvent } from 'electron';
import { action, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { appConfig_Store } from '~/stores/AppConfig_Store';
import { mobxToJSON } from '~/utils/mobxToJSON';
import { e_api } from '~src/types/t_api';
import { i_appConfig_renderer } from '~types/i_appConfig_renderer';

/**
 * Компонент инициализации, отвечающий за загрузку и сохранение конфигурации.
 * Использует MobX для управления состоянием и observer для отслеживания изменений.
 */
export const Init = observer(() => {
	/**
	 * Обработчик события beforeunload.
	 * Сохраняет текущую конфигурацию перед закрытием окна.
	 */
	const handleBeforeUnload = action(() => {
		const newConfig = toJS(appConfig_Store.config);
		console.log('#Init/handleBeforeUnload ', mobxToJSON(newConfig));
		window.api.app.savePreferences(newConfig);
	});

	/**
	 * Обработчик загрузки конфигурации.
	 * @param {Event} _event - Событие IPC
	 * @param {i_appConfig_renderer} config - Загруженная конфигурация
	 */
	const handleOnConfigLoaded = action((_event: IpcRendererEvent, config: i_appConfig_renderer) => {
		console.log('#Init/handleOnConfigLoaded', config);
		runInAction(() => {
			appConfig_Store.config = config;
		});
	});

	useEffect(() => {
		console.log('#Init.useEffect.loadPreferences');

		window.addEventListener('beforeunload', handleBeforeUnload);
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
	return null;
});

Init.displayName = 'Init';
