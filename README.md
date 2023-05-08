# Vite

## 0 - Create project with vite

```shell
npm create vite@latest vite-app -- -- --template react-ts
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

## 1 - Install `prettier`


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

# 2 - tailwind

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

# 3 - Vitest

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