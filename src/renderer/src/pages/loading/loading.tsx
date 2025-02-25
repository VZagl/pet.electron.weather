import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '~/components/errorBoundary/ErrorBoundary';
import './loading.scss';

const Loading = () => {
	return (
		<div className='loading-container'>
			<div className='spinner'></div>
			<h1>Loading...</h1>
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
