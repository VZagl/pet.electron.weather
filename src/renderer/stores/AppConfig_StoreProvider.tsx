import { PropsWithChildren } from 'react';
import { appConfig_Store } from './AppConfig_Store';
import { AppConfig_StoreContext } from './AppConfig_StoreContext';

export const AppConfig_StoreProvider = ({ children }: PropsWithChildren) => {
	return (
		<AppConfig_StoreContext.Provider value={appConfig_Store}>
			{children}
		</AppConfig_StoreContext.Provider>
	);
};
