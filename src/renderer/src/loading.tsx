import React from 'react';
import ReactDOM from 'react-dom/client';

// import { App } from './App';
import './assets/loading.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<div style={{ backgroundColor: 'red', padding: '20px' }}>this is loading package</div>
	</React.StrictMode>
);
