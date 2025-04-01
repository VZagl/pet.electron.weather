import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '~/components/errorBoundary/ErrorBoundary';
import { App } from '~/windows/main/features/App/App';
import { Init } from '~main/features/Init';
import '~main/types/t_global.ts';
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
