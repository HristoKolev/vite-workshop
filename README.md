# Vite workshop

TODO: Describe what this is, why it exists and how it should be used.

## 0 - NPM package

- Initialize the package

```shell
npm init -y
```

- Open `package.json`.

- Remove every property except `name`, `version`, `scripts`.

- Insert the `private` property with value `true` after the `version` property.

## 1 - Vite

- Install the packages

```shell
npm i -D vite typescript
```

- Install a package that you want to use in your project.

```shell
npm i date-fns
```

- Reorder the properties in `package.json` in order to put `dependencies` above `devDependencies`.

- Copy the contents of the `extra/01-vite` directory to the root directory of this workshop.
- Add the `start`, `build` and `preview` npm scripts to `package.json`

```
"start": "vite",
"build": "vite build",
"preview": "vite preview",
```

- Run the `build` npm script and examine the output in the `dist` directory.

```shell
npm run build
```

- Run the `preview` npm script to serve the production build in your local environment.

```shell
npm run preview
```

- Don't forget to stop the npm script before you proceed with the workshop.

- Run the `start` npm script to start the application in development mode.

```shell
npm run start
```

- Don't forget to stop the npm script before you proceed with the workshop.





















































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
"noImplicitAny": true,
"pretty": true,
```

- Remove from the typescript configuration

`allowImportingTsExtensions`

- Change the `dev` script to `start`:

```
  "start": "vite",
```

- Add the `typecheck` script

```
  "typecheck": "tsc",
```

- Change the `build` script to use it

```
  "build": "npm run typecheck && vite build",
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

## 2 - ts-reset

- Install the package

```shell
npm i -D @total-typescript/ts-reset
```

- Copy the files from the `extra` directory

## 3 - Bundle Analyzer

```shell
npm i -D source-map-explorer
```

- Add the npm script

```
"profile": "npm run build && source-map-explorer dist/**/*.js"
```

## 4 - Vitest

```shell
npm i -D vitest @vitest/coverage-istanbul
npm i -D @testing-library/dom @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom 
npm i -D msw
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
    provider: 'istanbul',
    all: true,
    include: ['**/src/**'],
    exclude: [...configDefaults.coverage.exclude, 'src/main.tsx'],
    lines: 90,
    statements: 90,
    functions: 90,
    branches: 90,
  },
},
```

- Copy the test setup file and the tests from the `extra` directory 

- Change `tsconfig.node.json` to include `setupTests.ts` and set `strict` to `true`

```
"include": ["vite.config.ts", "setupTests.ts"]
```

```
"strict": true
```

- Add the npm scripts

```
 "test": "vitest run",
 "test:watch": "vitest watch",
```

## 5 - Prettier

- Install the package

```shell
npm i -D prettier
```

- Add the config files

- Add the npm scripts

```
"format": "prettier --write .",
"format-check": "prettier --check .",
```

- Run the format script

```shell
npm run format
```

- Modify the build npm script

```
"build": "npm run format-check && npm run typecheck && vite build",
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

## 6 - ESLint

- Install the extra packages

```shell
npm i -D eslint-config-airbnb
npm i -D eslint-plugin-deprecation
npm i -D eslint-config-prettier
npm i -D eslint-import-resolver-alias
npm i -D eslint-plugin-import
npm i -D eslint-import-resolver-typescript
npm i -D eslint-plugin-new-with-error
npm i -D eslint-plugin-unused-imports
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

- Add the npm scripts

```
"lint": "eslint ./ --max-warnings 0",
"lint:fix": "npm run lint -- --fix"
```

- Modify the build npm script

```
"build": "npm run format-check && npm run lint && npm run typecheck && vite build",
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

## 7 - Tailwind (OPTIONAL)

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

## 8 - MUI (OPTIONAL)

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
