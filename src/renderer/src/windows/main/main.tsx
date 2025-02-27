import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '~/components/errorBoundary/ErrorBoundary';
import { App } from '~/features/App';
import { Init } from '~/features/Init';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<>
		<ErrorBoundary>
			<Init />
		</ErrorBoundary>
		<React.StrictMode>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</React.StrictMode>
	</>
);
