import React from 'react';

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
