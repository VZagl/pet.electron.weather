import { createContext, useContext } from 'react';
import { appConfig_Store } from './AppConfig_Store';

/**
 * Контекст для хранения конфигурации приложения для процесса рендеринга.
 * @type {React.Context<typeof appConfig_Store | null>}
 */
export const AppConfig_StoreContext = createContext<typeof appConfig_Store | null>(null);

/**
 * Хук для доступа к store конфигурации приложения для процесса рендеринга.
 * @returns {typeof appConfig_Store} Инстанс store с конфигурацией
 * @throws {Error} Если хук используется вне провайдера AppConfig_StoreContext
 */
export const useAppConfig_Store = (): typeof appConfig_Store => {
	const store = useContext(AppConfig_StoreContext);
	if (!store) {
		throw new Error('useAppConfig_Store должен использоваться внутри StoreProvider');
	}
	return store;
};
