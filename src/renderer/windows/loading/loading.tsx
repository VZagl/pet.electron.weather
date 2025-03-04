import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '~/components/errorBoundary/ErrorBoundary';
import packageJson from '../../../../package.json';
import './loading.scss';

const Loading = () => {
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ErrorBoundary>
			<Loading />
		</ErrorBoundary>
	</React.StrictMode>
);
