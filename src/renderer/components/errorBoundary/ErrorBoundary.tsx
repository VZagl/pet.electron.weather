/*
	https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
*/
import { ErrorMessage } from '@/components/errorMessage/ErrorMessage';
import React from 'react';

type ErrorBoundaryProps = {
	children: React.ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
	errorMessage: string | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, errorMessage: null };
	}

	static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
		// Обновляем состояние, чтобы следующий рендер показал запасной UI
		return { hasError: true, errorMessage: _error.message };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		// Логируем ошибку
		console.error('>> ErrorBoundary > componentDidCatch:\n', error, info);
		this.setState({ errorMessage: error.message });
	}

	render() {
		if (this.state.hasError) {
			// Рендерим запасной UI с сообщением об ошибке
			return <ErrorMessage error={this.state.errorMessage || 'Произошла ошибка.'} />;
		}

		return this.props.children;
	}
}
