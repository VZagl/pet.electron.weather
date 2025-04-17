'use strict';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '~/components/errorBoundary/ErrorBoundary';
import { App } from '~/windows/main/features/App/App';
import { Init } from '~main/features/Init';
import '~main/types/t_global.ts';
import './main.scss';

const container = document.getElementById('root');
if (!container) {
	throw new Error('Failed to find root element');
}

const root = createRoot(container);
root.render(
	<ErrorBoundary>
		<Init />
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ErrorBoundary>
);
