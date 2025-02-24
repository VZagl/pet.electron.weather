import React from 'react';
import './errorMessage.scss';

type ErrorMessageProps = {
	error: string | { message: string };
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
	const errorMessage = typeof error === 'string' ? error : error.message;

	return (
		<div className='error-message-container'>
			<div className='error-message-content'>
				<div className='error-message-header'>
					<span className='error-symbol'>⚠️</span>
					<span className='error-text'>ERROR:</span>
				</div>
				<div className='error-text'>{errorMessage}</div>
			</div>
		</div>
	);
};
