# Определение политики безопасности контента (CSP)

- [Define a Content Security Policy](https://www.electronjs.org/docs/latest/tutorial/security#7-define-a-content-security-policy)

Политика безопасности контента (CSP) представляет собой дополнительный уровень защиты от атак по пересечению перекрестной зоны и атак в инъекциях данных. Мы рекомендуем, чтобы они были включены на любой веб-сайт, который вы загружаете в Electron.

## Почему это важно?

CSP позволяет серверу, обслуживающему контент, ограничивать и управлять ресурсами, которые может загружать Electron для данной веб-страницы. Например, `https://example.com` должно быть разрешено загружать сценарии из источников, которые вы определили, тогда как сценарии с `https://evil.attacker.com` не должны быть разрешены к запуску. Определение CSP - это простой способ повысить безопасность вашего приложения.

## Как настроить CSP

1. **Создайте политику безопасности контента**: Определите, какие ресурсы (скрипты, стили, изображения и т.д.) могут быть загружены и выполнены на вашем сайте.
2. **Добавьте заголовок CSP на ваш сервер**: Настройте ваш веб-сервер для отправки заголовка `Content-Security-Policy` с вашей политикой.
3. **Тестируйте и обновляйте**: Регулярно проверяйте и обновляйте вашу политику безопасности, чтобы она соответствовала текущим требованиям вашего приложения.

Пример заголовка CSP:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; object-src 'none'; style-src 'self' 'unsafe-inline';
```

Этот заголовок позволяет загружать скрипты только с вашего домена и доверенного CDN, запрещает загрузку объектов и позволяет стили только с вашего домена и встроенные стили.

## Как отладить CSP

1. **Используйте инструменты разработчика**: В большинстве современных браузеров есть инструменты разработчика, которые могут помочь вам отладить CSP. Например, в Chrome вы можете найти ошибки CSP на вкладке "Консоль".
2. **Включите режим отчета**: Вместо того чтобы блокировать ресурсы, вы можете настроить CSP для отправки отчетов о нарушениях. Это поможет вам понять, какие ресурсы нарушают вашу политику, без прерывания работы вашего сайта.

Пример заголовка CSP для режима отчета:

```
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' https://trusted.cdn.com; report-uri /csp-report-endpoint;
```

## Использование отчетов о нарушениях CSP

1. **Настройте конечную точку для отчетов**: Создайте конечную точку на вашем сервере для получения отчетов о нарушениях CSP.
2. **Анализируйте отчеты**: Используйте полученные отчеты для анализа и улучшения вашей политики безопасности.

Пример обработки отчетов на сервере:

```javascript
// Пример на Node.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/csp-report-endpoint', (req, res) => {
	console.log('CSP Violation:', req.body);
	res.status(204).end();
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
```

## Заключение

Использование CSP - это важный шаг в обеспечении безопасности вашего приложения на Electron. Это помогает предотвратить выполнение вредоносного кода и защищает ваших пользователей от различных атак.

<hr>

## Сообщение в консоли:

```bash
Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
  Policy set or a policy with "unsafe-eval" enabled. This exposes users of
  this app to unnecessary security risks.

For more information and help, consult
https://electronjs.org/docs/tutorial/security.
This warning will not show up
once the app is packaged.
```

## Ответ Copilot:

Это предупреждение Electron о безопасности связано с настройками Content Security Policy (CSP). CSP - это механизм безопасности, который помогает предотвратить атаки, такие как межсайтовый скриптинг (XSS). Предупреждение указывает на то, что в вашем приложении либо отсутствует CSP, либо он настроен небезопасно, с использованием `unsafe-eval`.

Чтобы устранить это предупреждение, выполните следующие действия:

1.  **Настройка CSP в [`electron-vite.config.ts`](src/renderer/windows/main/types/t_global.ts):**

    В файле `electron-vite.config.ts` вы можете настроить CSP для вашего приложения, добавив соответствующие заголовки. Пример настройки CSP в `electron-vite.config.ts` для проекта с React:

    ```typescript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
    	plugins: [react()],
    	server: {
    		headers: {
    			'Content-Security-Policy':
    				"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';",
    		},
    	},
    });
    ```

    В этом примере CSP:

    - `default-src 'self'` - разрешает загрузку контента только из того же источника (домена).
    - `script-src 'self' 'unsafe-inline'` - разрешает выполнение скриптов из того же источника и встроенных скриптов. `'unsafe-inline'` следует использовать с осторожностью и только если это необходимо.
    - `style-src 'self' 'unsafe-inline'` - разрешает стили из того же источника и встроенные стили. `'unsafe-inline'` следует использовать с осторожностью.
    - `img-src 'self' data:` - разрешает загрузку изображений из того же источника и data URL.
    - `connect-src 'self'` - разрешает запросы XMLHttpRequest и WebSocket только к тому же источнику.

    Убедитесь, что вы протестировали ваше приложение после настройки CSP, чтобы убедиться, что все ресурсы загружаются и выполняются корректно.

2.  **Определите Content Security Policy:**

    Вам нужно определить CSP для каждого из ваших HTML-файлов (в данном случае, [`src/renderer/index.html`](src/renderer/index.html) и [`src/renderer/loading.html`](src/renderer/loading.html)). CSP определяет, какие источники контента разрешены для загрузки и выполнения в вашем приложении.

    Vite может внедрять CSP в ваши HTML-файлы во время сборки. Добавьте или измените мета-тег CSP в ваших HTML-файлах.

    ```html
    <!-- src/renderer/index.html -->
    <!DOCTYPE html>
    <html>
    	<head>
    		<meta charset="UTF-8" />
    		<title>Main Window</title>
    		<!-- Добавьте CSP здесь -->
    		<meta
    			http-equiv="Content-Security-Policy"
    			content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
    		/>
    	</head>
    	<body>
    		<div id="root"></div>
    	</body>
    </html>
    ```

    ```html
    <!-- src/renderer/loading.html -->
    <!DOCTYPE html>
    <html>
    	<head>
    		<meta charset="UTF-8" />
    		<title>Loading Window</title>
    		<!-- Добавьте CSP здесь -->
    		<meta
    			http-equiv="Content-Security-Policy"
    			content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
    		/>
    	</head>
    	<body>
    		<div id="root"></div>
    	</body>
    </html>
    ```

    В этих примерах CSP:

    - `default-src 'self'` - разрешает загрузку контента только из того же источника (домена).
    - `script-src 'self' 'unsafe-inline'` - разрешает выполнение скриптов из того же источника и встроенных скриптов. `'unsafe-inline'` следует использовать с осторожностью и только если это необходимо.
    - `style-src 'self' 'unsafe-inline'` - разрешает стили из того же источника и встроенные стили. `'unsafe-inline'` следует использовать с осторожностью.
    - `img-src 'self' data:` - разрешает загрузку изображений из того же источника и data URL.
    - `connect-src 'self'` - разрешает запросы XMLHttpRequest и WebSocket только к тому же источнику.

3.  **Удалите `unsafe-eval` (если возможно):**

    `unsafe-eval` позволяет выполнение кода, полученного во время выполнения, что является риском безопасности. Если возможно, избегайте использования `eval()` и функций, которые его используют (например, `new Function()`). Если вы используете библиотеки, которые требуют `unsafe-eval`, рассмотрите возможность поиска альтернатив.

4.  **Использование `unsafe-inline`:**

    `unsafe-inline` разрешает использование встроенных скриптов и стилей. В большинстве случаев лучше избегать `unsafe-inline` и использовать внешние файлы скриптов и стилей. Если вам необходимо использовать встроенные скрипты или стили, убедитесь, что вы понимаете риски безопасности.

5.  **Проверка CSP:**

    После настройки CSP, проверьте, что ваше приложение работает правильно и что никакие ресурсы не блокируются. Вы можете использовать инструменты разработчика в Electron, чтобы проверить, какие ресурсы блокируются CSP.

6.  **Настройка CSP в Electron:**

    Вы также можете настроить CSP непосредственно в основном процессе Electron:

    ```typescript
    // src/main/index.ts
    import { app, BrowserWindow, session } from 'electron';
    // ...

    app.whenReady().then(() => {
    	// ...

    	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    		callback({
    			responseHeaders: {
    				...details.responseHeaders,
    				'Content-Security-Policy': [
    					"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'",
    				],
    			},
    		});
    	});

    	// ...
    });
    ```

    Этот код устанавливает CSP для всех сессий в вашем приложении.

**Важно:**

- CSP должен быть максимально строгим, чтобы обеспечить максимальную безопасность.
- Тщательно протестируйте ваше приложение после настройки CSP, чтобы убедиться, что все работает правильно.
- Рассмотрите возможность использования nonce или hash для встроенных скриптов и стилей, чтобы повысить безопасность.

Следуя этим шагам, вы сможете устранить предупреждение Electron о безопасности и повысить безопасность вашего приложения.

<hr>
