import { makeAutoObservable } from 'mobx';
import { i_appConfig_renderer } from '~types/i_appConfig_renderer';

/**
 * Представляет хранилище конфигурации приложения для процесса рендеринга.
 * Это хранилище отвечает за управление состоянием конфигурации приложения.
 *
 * @замечания
 * Этот класс использует `makeAutoObservable` из MobX для автоматического создания наблюдаемых свойств.
 *
 * @пример
 * ```typescript
 * const appConfigStore = new t_appConfig_Store();
 * appConfigStore.config = { lastLocation:{zoom: 10} };
 * ```
 */
class t_appConfig_Store {
	// count: number = 0;
	config: i_appConfig_renderer = {};

	constructor() {
		makeAutoObservable(this);
	}
}

export const appConfig_Store = new t_appConfig_Store();
