# Vite workshop

TODO: Describe what this is, why it exists and how it should be used.

## 0 - NPM package

- Initialize the package

```shell
npm init -y
```

- Open `package.json`

- Remove every property except `name`, `version`, `scripts`

- Add these properties after the `version` property

```
"type": "module",
"private": true,
```

- Remove all scripts from the `scripts` property

## 1 - Vite

- Install the packages

```shell
npm i -D vite typescript
```

- Install a package that you want to use in your project

```shell
npm i date-fns
```

- Reorder the properties in `package.json` in order to put `dependencies` above `devDependencies`

- Copy the contents of the `extra/01-vite` directory to the root directory of this workshop
- Add the `start`, `build` and `preview` npm scripts to `package.json`

```
"start": "vite",
"build": "vite build",
"preview": "vite preview",
```

- Run the `build` npm script and examine the output in the `dist` directory

```shell
npm run build
```

- Run the `preview` npm script to serve the production build in your local environment

```shell
npm run preview
```

- Don't forget to stop the npm script before you proceed with the workshop

- Run the `start` npm script to start the application in development mode

```shell
npm run start
```

- Don't forget to stop the npm script before you proceed with the workshop

## 2 - TypeScript

- Install the packages

```shell
npm i -D typescript @total-typescript/ts-reset
```

- Copy the contents of the `extra/02-typescript` directory to the root directory of this workshop

- Rename `src/main.js` to `src/main.ts`
- Rename `src/helpers.js` to `src/helpers.ts`
- In `src/helpers.ts`, add a type to the first parameter of the `formatDate` function

- Rename `vite.config.js` to `vite.config.ts`

- In `index.html` change the value of the `src` attribute of the `script` tag to `/src/main.ts`.

- Add the `typecheck` npm script to `package.json`

```
"typecheck": "tsc",
```

- Run the `typecheck` npm script

```shell
npm run typecheck
```

- Run the `build` npm script and examine the output in the `dist` directory

```shell
npm run build
```

## 3 - Transforming Imports

- Install the package

```shell
npm i -D vite-tsconfig-paths
```

- Change `tsconfig.json` to define the import transforms

```
"baseUrl": "./",
"paths": {
  "~*": ["src/*"],
  "src/*": ["src/*"]
}
```

- Add the `vite-tsconfig-paths` plugin in `vite.config.ts`

```
import tsconfigPaths from 'vite-tsconfig-paths';
```

```
tsconfigPaths()
```

- Change the imports in `src/main.ts`

```
import logoUrl from 'src/logo.png';
import { formatDate } from '~helpers';
```

- Run the `build` npm script and examine the output in the `dist` directory

```shell
npm run build
```

## 4 - Bundle Analyzer

- Install the package

```shell
npm i -D source-map-explorer
```

- Add the `profile` npm script to `package.json`

```
"profile": "npm run build && source-map-explorer dist/**/*.js"
```

- Run the `profile` npm script and examine the visualization.

```shell
npm run profile
```

- Don't forget to stop the npm script before you proceed with the workshop.

## 5 - React

- Install the packages

```shell
npm i react react-dom
npm i -D @types/react @types/react-dom
npm i -D @vitejs/plugin-react
```

- Add the `jsx` typescript setting in `tsconfig.json`

```
"jsx": "react-jsx",
```

- Delete `src/main.ts`

- Copy the contents of the `extra/05-react` directory to the root directory of this workshop

- In `index.html` add the `#root` div element to the `body` tag

```html
<div id="root"></div>
```

- In `index.html` change the value of the `src` attribute of the `script` tag to `/src/main.tsx`

- Add the `@vitejs/plugin-react` plugin in `vite.config.ts`

```
import react from '@vitejs/plugin-react';
```

```
react()
```

- Run the `build` npm script and examine the output in the `dist` directory.

```shell
npm run build
```

- Run the `profile` npm script and examine the visualization.

```shell
npm run profile
```

- Don't forget to stop the npm script before you proceed with the workshop.

## 6 - Vitest

- Install the packages

```shell
npm i -D vitest @vitest/coverage-istanbul
npm i -D @testing-library/dom @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npm i -D msw
```

- Copy the contents of the `extra/06-vitest` directory to the root directory of this workshop

- Add the testing configuration to `vite.config.ts`

```
import { configDefaults } from 'vitest/config';
```

```
test: {
  environment: 'jsdom',
  setupFiles: ['./setupTests.ts'],
  exclude: [...configDefaults.exclude, 'extra'],
  coverage: {
    enabled: true,
    provider: 'istanbul',
    all: true,
    include: ['**/src/**'],
    exclude: [
      ...(configDefaults.coverage.exclude || []),
      'extra',
      'src/main.tsx',
    ],
    thresholds: {
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 90,
    },
  },
},
```

- Change `tsconfig.json` to include `setupTests.ts`

```
"include": ["src", "setupTests.ts"],
```

- Change `tsconfig.node.json` to include `setupTests.ts`

```
"include": ["vite.config.ts", "setupTests.ts"]
```

- Add the `test` and `test:watch` npm scripts to `package.json`

```
 "test": "vitest run",
 "test:watch": "vitest watch",
```

- Add the code coverage output directory to `.gitignore`

```
coverage/
```

- Run the `test` npm script to verify that the tests pass.

```shell
npm run test
```

## 7 - Prettier

- Install the package

```shell
npm i -D prettier
```

- Copy the contents of the `extra/07-prettier` directory to the root directory of this workshop.

- Add the `format` and `format-check` npm scripts to `package.json`

```
"format": "prettier --cache --write .",
"format-check": "prettier --cache --check .",
```

- Run the `format` npm script

```shell
npm run format
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

## 8 - ESLint

- Install the packages

```shell
npm i -D eslint
npm i -D @eslint/eslintrc
npm i -D @eslint/js
npm i -D eslint-config-prettier
npm i -D eslint-import-resolver-alias
npm i -D eslint-import-resolver-typescript
npm i -D eslint-plugin-deprecation
npm i -D eslint-plugin-es
npm i -D eslint-plugin-import
npm i -D eslint-plugin-jsx-a11y
npm i -D eslint-plugin-new-with-error
npm i -D eslint-plugin-react
npm i -D eslint-plugin-react-hooks
npm i -D eslint-plugin-react-refresh
npm i -D eslint-plugin-testing-library
npm i -D eslint-plugin-unused-imports
npm i -D eslint-plugin-vitest
npm i -D @arabasta/eslint-plugin-no-destructuring-arrays-as-objects
npm i -D @arabasta/eslint-plugin-no-testing-library-without-cleanup
npm i -D @arabasta/eslint-plugin-redux-use-app-functions
npm i -D @arabasta/eslint-plugin-report-caught-error
npm i -D @arabasta/eslint-plugin-require-useeffect-dependency-array
npm i -D @eslint-community/eslint-plugin-eslint-comments
npm i -D confusing-browser-globals
npm i -D rimraf
```

- Copy the contents of the `extra/08-eslint` directory to the root directory of this workshop.

- Add the npm scripts to `package.json`

```
"lint": "eslint ./ --max-warnings 0",
"lint:fix": "npm run lint -- --fix",
"generate-eslint-resolved-configs": "rimraf ./eslint-resolved-configs && node generate-eslint-resolved-configs.js && npm run format"
```

- Run the `lint:fix` npm script

```shell
npm run lint:fix
```

- Run the `generate-eslint-resolved-configs` npm script

```shell
npm run generate-eslint-resolved-configs
```

- Doesn't work for test files. Why?

- Demonstrate WebStorm config
- Demonstrate VSCode config
  - https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

```
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
},
"eslint.validate": ["typescript", "typescriptreact"]
```

## 09 - SCSS (OPTIONAL)

- Install the packages

```shell
npm i -D sass
```

- Copy the contents of the `extra/10-tailwind` directory to the root directory of this workshop.

- Import the `src\styles.scss` file in `src/main.tsx`.

```js
import './styles.scss';
```

- Run the `build` npm script to verify that everything works.

```shell
npm run build
```

## 10 - Tailwind (OPTIONAL)

- Install the packages

```shell
npm i -D tailwindcss
```

- Copy the contents of the `extra/10-tailwind` directory to the root directory of this workshop.

- Add the tailwind directives at the start of `main.css`

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Use some tailwind utility in your source file. Example: `text-center`.

- Run the `build` npm script to verify that everything works.

```shell
npm run build
```
