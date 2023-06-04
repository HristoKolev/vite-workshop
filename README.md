# Vite

## 0 - Create project

- Create the project using the vite generator

```shell
npm create vite@latest vite-app -- -- --template react-ts
```

- Navigate into the app directory

```shell
cd vite-app
```

- Restore packages

```shell
npm i
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

- Add to the typescript configuration

```
"noImplicitAny": true
```

- Change the `dev` script to `start`:

```
  "start": "vite",
```

- Install some library from npm that you want to use

```shell
npm i date-fns
```

- Remove everything except `vite-env.d.ts` from the `src` directory

- Remove the `public` directory and edit the `index.html` to remove the icon.

- Copy the app code from the `extra` directory

## 1 - Transform Imports

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

## 2 - Bundle Analyzer

```shell
npm i -D source-map-explorer
```

- Add the npm script

```
"profile": "npm run build && source-map-explorer dist/**/*.js"
```

## 3 - Vitest

```shell
npm i -D vitest @vitest/coverage-c8
npm i -D @testing-library/dom @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom 
npm i -D msw node-fetch@2
```

- Add this import to the vite config

```
import { configDefaults } from 'vitest/config';
```

This also happens to import the vitest types for the vite config. if you don't need the default config you can use `/// <reference types="vitest" />` to import just the types.

```
test: {
  environment: 'jsdom',
  setupFiles: ['./setupTests.ts'],
  coverage: {
    enabled: true,
    provider: 'c8',
    all: true,
    src: ['src'],
    exclude: [...configDefaults.coverage.exclude, 'main.tsx'],
    lines: 90,
    statements: 90,
    functions: 90,
    branches: 90,
  },
},
```

- Copy the test setup file and the tests from the `extra` directory 

- Add the npm script

```
 "test": "vitest run",
```

## 4 - Tailwind

- Install the package

```shell
npm i -D tailwindcss
```

- Copy the tailwind, postcss configs from the `extra` directory

- Add the tailwind directives on top of your css file

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Use tailwind somewhere in the application

## 5 - MUI

```shell
npm i @mui/material @emotion/react @emotion/styled @fontsource/roboto @mui/icons-material
```

* import the fonts

```
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
```

* add the MUI baseline component

```jsx
<CssBaseline />
```

## 6 - Prettier

- Install the package

```shell
npm i -D prettier
```

- Add the config files

- Add the npm script

```
"fmt": "prettier --write .",
```

- Run the format script

```shell
npm run fmt
```

- Demonstrate WebStorm config
- Demonstrate VSCode config
  - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

```
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.useEditorConfig": true,
  "prettier.configPath": ".prettierrc"
```

## 7 - ESLint

- Install the extra packages

```shell
npm i -D eslint-config-airbnb
npm i -D eslint-config-airbnb-typescript
npm i -D eslint-config-prettier
npm i -D eslint-import-resolver-alias
npm i -D eslint-plugin-import
npm i -D eslint-plugin-react
npm i -D eslint-plugin-jsx-a11y
npm i -D eslint-plugin-eslint-comments
npm i -D eslint-plugin-prettier
npm i -D eslint-plugin-vitest
npm i -D eslint-plugin-testing-library
```

- Remove the existing eslint config

- Add the eslint config files from the `extra` directory

- Remove the existing `lint` script

- Add the npm script

```
"lint": "eslint ./ --max-warnings 0",
```

- Modify the build npm script
 
```
"build": "npm run lint && tsc && vite build",
```

- Run the lint script with `--fix`

```shell
npm run lint -- -- --fix
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

