# pet.electron.weather

## Критически важные особенности дерева каталогов и файлов проекта:

- `src/renderer/*.html`
  - содержатся `html`-файлы, являющиеся точками входа для отдельных окон. Компилируются в отдельные `React`-приложения.
  - здесь не должно содержаться других `*.html`-файлов
- `src/preload/*Preload.ts`
  - содержатся `preload`-скрипты для отдельных окон
  - здесь не должно содержаться других `*Preload.ts`-файлов

<hr>

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## [Project Init](https://electron-vite.org/guide/#scaffolding-your-first-electron-vite-project)

```bash
$ yarn create @quick-start/electron my-app --template react-ts
```

Then follow the prompts!

```bash
✔ Add Electron updater plugin? … No / Yes
✔ Enable Electron download mirror proxy? … No / Yes
```

## Project Setup

### Install

```bash
$ yarn
```

### Development

```bash
$ yarn dev
```

### Build

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```
