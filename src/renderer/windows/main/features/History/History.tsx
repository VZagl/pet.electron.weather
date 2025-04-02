import { observer } from 'mobx-react-lite';
import { JSX } from 'react';
import { useAppConfig_Store } from '~/stores/AppConfig_StoreContext';
import { mobxToJSON } from '~/utils/mobxToJSON';
import './History.scss';

export const History = observer((): JSX.Element => {
	const store = useAppConfig_Store();

	console.log('#History.render');
	return (
		<div className='history'>
			<h2>История</h2>
			<div className='text'>
				store.config = <span>{mobxToJSON(store)}</span>
			</div>
		</div>
	);
});

History.displayName = 'History';
