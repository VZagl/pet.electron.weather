# После инициализации клонированного проекта не выполняется `pnpm dev`

Ошибка:

```bash
dev server running for the electron renderer process at:

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
error during start dev server and electron app:
Error: Electron uninstall
    at getElectronPath (file: ... .mjs:129:19)
    at startElectron (file: ... .mjs:198:26)
    at createServer (file: ... .mjs:74:14)
    at async CAC.<anonymous> (file: ... .mjs:67:9)
 ELIFECYCLE  Command failed with exit code 1.
```

Это значит, что необходимо инициализировать Electron. Нужно из корня проекта в консоли выполнить:

```bash
node node_modules/electron/install.js
```
