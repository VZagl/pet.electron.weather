import { createContext, useContext } from 'react';
import { appConfig_Store } from './AppConfig_Store';

export const AppConfig_StoreContext = createContext<typeof appConfig_Store | null>(null);

export const useAppConfig_Store = () => {
	const store = useContext(AppConfig_StoreContext);
	if (!store) {
		throw new Error('useStore должен использоваться внутри StoreProvider');
	}
	return store;
};
