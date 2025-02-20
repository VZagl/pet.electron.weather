## [Multiple Windows App](https://electron-vite.org/guide/dev#multiple-windows-app)

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
