# В дереве компонент отображается как `Anonymous`

## Причины отображения как `Anonymous`

1. Компонент может не иметь имени.
2. Использование анонимных функций или стрелочных функций.
3. Отсутствие `displayName` у компонента.

## Решения

- Убедитесь, что компонент имеет имя.
- Используйте именованные функции вместо анонимных.

  ```javascript
  export function NamedComponent() {
  	return <div>Hello, world!</div>;
  }
  ```

- Задайте `displayName` явно:

  ```javascript
  export const MyComponent = () => {
  	/* ... */
  };

  MyComponent.displayName = 'MyComponent';
  ```
