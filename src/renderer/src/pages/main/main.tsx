import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'src/renderer/src/components/errorBoundary/ErrorBoundary';
import { Init } from '~/Init';
import { App } from './App';
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
