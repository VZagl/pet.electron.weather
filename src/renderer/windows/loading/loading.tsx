'use strict';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '~/components/errorBoundary/ErrorBoundary';
import packageJson from '../../../../package.json';
import './loading.scss';

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
	return (
		<div className='loading'>
			<h1>{packageJson.name}</h1>
			<h2>
				version: <span className='version'>{packageJson.version}</span>
			</h2>
			<div className='spinner'></div>
			<h2>Loading...</h2>
		</div>
	);
};

const container = document.getElementById('root');
if (!container) {
	throw new Error('Failed to find root element');
}

const root = createRoot(container);
root.render(
	<React.StrictMode>
		<ErrorBoundary>
			<Loading />
		</ErrorBoundary>
	</React.StrictMode>
);
