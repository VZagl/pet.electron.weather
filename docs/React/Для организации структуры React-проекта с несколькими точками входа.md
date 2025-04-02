# `Copilot` рекомендует: Для организации структуры React-проекта с несколькими точками входа...

Для организации структуры React-проекта с несколькими точками входа, где каждое приложение может использовать общие и индивидуальные ресурсы, рекомендуется использовать следующую структуру каталогов. Эта структура позволяет легко управлять общими и индивидуальными ресурсами, а также поддерживать чистоту и организованность проекта.

### Пример структуры проекта

```
src/
  assets/               // Общие ресурсы (изображения, стили и т.д.)
    images/
    styles/
  components/           // Общие компоненты
  utils/                // Общие утилиты и функции
  apps/                 // Каталог для отдельных приложений
    app1/               // Приложение 1
      index.html        // Точка входа для приложения 1
      App.tsx           // Главный компонент приложения 1
      components/       // Компоненты, специфичные для приложения 1
      styles/           // Стили, специфичные для приложения 1
    app2/               // Приложение 2
      index.html        // Точка входа для приложения 2
      App.tsx           // Главный компонент приложения 2
      components/       // Компоненты, специфичные для приложения 2
      styles/           // Стили, специфичные для приложения 2
  preload/              // Preload-скрипты для отдельных окон
    app1Preload.ts
    app2Preload.ts
  types/                // Общие типы TypeScript
  index.ts              // Основной файл для запуска приложения
```

### Пример конфигурации Vite

Для настройки Vite с несколькими точками входа, можно использовать следующую конфигурацию:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				app1: path.resolve(__dirname, 'src/apps/app1/index.html'),
				app2: path.resolve(__dirname, 'src/apps/app2/index.html'),
			},
		},
	},
	resolve: {
		alias: {
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@app1': path.resolve(__dirname, 'src/apps/app1'),
			'@app2': path.resolve(__dirname, 'src/apps/app2'),
		},
	},
});
```

### Пример использования общих и индивидуальных ресурсов

#### Общий компонент

```typescript
// src/components/Header.tsx
import React from 'react';

const Header = () => {
  return <header>Общий заголовок</header>;
};

export default Header;
```

#### Индивидуальный компонент для приложения 1

```typescript
// src/apps/app1/components/App1Component.tsx
import React from 'react';

const App1Component = () => {
  return <div>Компонент для приложения 1</div>;
};

export default App1Component;
```

#### Главный компонент приложения 1

```typescript
// src/apps/app1/App.tsx
import React from 'react';
import Header from '@components/Header';
import App1Component from './components/App1Component';

const App = () => {
  return (
    <div>
      <Header />
      <App1Component />
    </div>
  );
};

export default App;
```

#### Главный компонент приложения 2

```typescript
// src/apps/app2/App.tsx
import React from 'react';
import Header from '@components/Header';

const App = () => {
  return (
    <div>
      <Header />
      <div>Компонент для приложения 2</div>
    </div>
  );
};

export default App;
```

### Заключение

Эта структура позволяет легко управлять общими и индивидуальными ресурсами для каждого приложения, поддерживая чистоту и организованность проекта. Вы можете добавлять новые приложения в каталог `apps` и настраивать их точки входа в конфигурации Vite.

<hr>

## Ещё информация:

### [Multiple Windows App](https://electron-vite.org/guide/dev#multiple-windows-app)

Когда в вашем электронном приложении есть несколько Windows, это означает, что существует несколько файлов HTML или файлов предварительной загрузки. Вы можете изменить свой файл конфигурации так:

```javascript
// electron.vite.config.js
export default {
	main: {},
	preload: {
		build: {
			rollupOptions: {
				input: {
					browser: resolve(__dirname, 'src/preload/browser.js'),
					webview: resolve(__dirname, 'src/preload/webview.js'),
				},
			},
		},
	},
	renderer: {
		build: {
			rollupOptions: {
				input: {
					browser: resolve(__dirname, 'src/renderer/browser.html'),
					webview: resolve(__dirname, 'src/renderer/webview.html'),
				},
			},
		},
	},
};
```

- [How do I setup a multi page app using vite?](https://stackoverflow.com/questions/77498366/how-do-i-setup-a-multi-page-app-using-vite)

<hr>
