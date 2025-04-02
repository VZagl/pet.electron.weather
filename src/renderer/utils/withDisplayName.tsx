import React from 'react';

/**
 * Компонент высшего порядка (HOC), который оборачивает переданный React-компонент и присваивает ему пользовательское имя.
 *
 * @template T - Тип React-компонента, который будет обернут.
 * @param name - Пользовательское имя, которое будет присвоено обернутому компоненту.
 * @param Component - React-компонент для обертки.
 * @returns Обернутый компонент с присвоенным именем.
 *
 * @example
 * ```tsx
 * const MyComponent = () => <div>Привет</div>;
 * const NamedComponent = withName("CustomName", MyComponent);
 * console.log(NamedComponent.displayName); // "CustomName"
 * ```
 */
export function withName<T extends React.ComponentType<any>>(name: string, Component: T): T {
	const WrappedComponent = (props: React.ComponentProps<T>) => <Component {...props} />;
	WrappedComponent.displayName = name;
	return WrappedComponent as T;
}

/**
 * Присваивает пользовательское имя переданному React-компоненту.
 * В отличие от withName, не создает обертку, а напрямую изменяет displayName компонента.
 *
 * @template T - Тип React-компонента.
 * @param name - Пользовательское имя для компонента.
 * @param Component - React-компонент, которому нужно присвоить имя.
 * @returns Исходный компонент с обновленным displayName.
 *
 * @example
 * ```tsx
 * const MyComponent = () => <div>Привет</div>;
 * const NamedComponent = setName("CustomName", MyComponent);
 * console.log(NamedComponent.displayName); // "CustomName"
 * ```
 */
export function setName<T extends React.ComponentType<any>>(name: string, Component: T): T {
	Component.displayName = name;
	return Component;
}
