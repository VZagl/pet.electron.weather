import { ComponentType } from 'react';
import { JSX } from 'react/jsx-runtime';

// Функция для получения displayName оборачиваемого компонента
function getDisplayName<WCP>(WrappedComponent: ComponentType<WCP>): string {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// Компонент высшего порядка
function withDescription<WCP>(WrappedComponent: ComponentType<WCP>) {
	const EnhancedComponent = (props: JSX.IntrinsicAttributes & WCP) => {
		return <WrappedComponent {...props} />;
	};

	// Устанавливаем displayName для HOC
	EnhancedComponent.displayName = `withDescription(${getDisplayName(WrappedComponent)})`;

	return EnhancedComponent;
}

export { withDescription };
