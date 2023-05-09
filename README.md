# Vite

## 0 - Create project

- Create the project using the vite generator

```shell
npm create vite@latest vite-app -- -- --template react-ts
```

- Add to the vite config 

```
build: {
  sourcemap: true,
},
server: {
  cors: true,
  port: 3000,
  strictPort: true,
  host: true,
},
preview: {
  cors: true,
  port: 3000,
  strictPort: true,
  host: true,
},
```

- Install some library from npm that you want to use.

```shell
npm i date-fns
```

- Add to the typescript configuration

```
"noImplicitAny": true
```

- Change the `dev` script to `start`:

```
  "start": "vite",
```

## 1 - Prettier


- Install the package

```shell
npm i -D prettier
```

- Add the config files

- Demonstrate WebStorm config
- Demonstrate VSCode config
    - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

```
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.useEditorConfig": true,
  "prettier.configPath": ".prettierrc"
```

## 2 - Tailwind

* install the package

```shell
npm i -D tailwindcss
```

* copy the tailwind, postcss configs

* add the tailwind directives on top of your css file
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3 - Vitest

```shell
npm i -D vitest
npm i -D @testing-library/dom @testing-library/react jsdom
npm i -D @testing-library/user-event @testing-library/jest-dom
npm i -D node-fetch@2 msw
```

- Change the vite config

```
/// <reference types="vitest" />
```

```
test: {
  environment: 'jsdom',
  setupFiles: ['./setupTests.ts'],
},
```

- Add the test setup file

- Add the npm script

```
 "test": "vitest",
```

## 4 - ESLint

- Install the extra packages

```shell
npm i -D eslint-config-airbnb
npm i -D eslint-plugin-import
npm i -D eslint-plugin-react
npm i -D eslint-plugin-jsx-a11y
npm i -D eslint-config-airbnb-typescript
npm i -D eslint-plugin-eslint-comments
npm i -D eslint-import-resolver-alias
npm i -D eslint-config-prettier
npm i -D eslint-plugin-prettier
npm i -D eslint-plugin-vitest
npm i -D eslint-plugin-testing-library
```

- Remove the existing eslint config

- Add the eslint config files

- Add the npm script

```
"lint": "eslint ./ --max-warnings 0",
```

- Demonstrate WebStorm config
- Demonstrate VSCode config
  - https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

```
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript", "typescriptreact"]
```

## 5 - Transform Imports

- Install the package


```shell
npm i -D vite-tsconfig-paths
```

- Add it to vite 

```
tsconfigPaths()
```
- Add to the typescript config

```
"baseUrl": "./",
"paths": {
  "~*": ["src/*"],
  "src/*": ["src/*"]
}
```

- Change the imports in `App.tsx`

```
import { formatDate } from '~helpers';
import logoUrl from 'src/logo.png';
```

## 6 - Bundle Analyzer

```shell
npm i -D source-map-explorer
```

- Add the npm script

```
"profile": "npm run build && source-map-explorer dist/**/*.js"
```
