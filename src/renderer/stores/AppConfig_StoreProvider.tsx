import { PropsWithChildren } from 'react';
import { appConfig_Store } from './AppConfig_Store';
import { AppConfig_StoreContext } from './AppConfig_StoreContext';

/**
 * Провайдер для предоставления доступа к конфигурации приложения для процесса рендеринга через React Context
 * @component
 * @param {PropsWithChildren} props - Пропсы компонента
 * @param {React.ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element} Провайдер контекста с конфигурацией
 */
export const AppConfig_StoreProvider = ({ children }: PropsWithChildren) => {
	return (
		<AppConfig_StoreContext.Provider value={appConfig_Store}>
			{children}
		</AppConfig_StoreContext.Provider>
	);
};
