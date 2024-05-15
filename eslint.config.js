import path from 'path';
import { fileURLToPath } from 'url';

import noDestructuringArraysAsObjects from '@arabasta/eslint-plugin-no-destructuring-arrays-as-objects';
import noTestingLibraryWithoutCleanup from '@arabasta/eslint-plugin-no-testing-library-without-cleanup';
import reduxUseAppFunctions from '@arabasta/eslint-plugin-redux-use-app-functions';
import reportCaughtError from '@arabasta/eslint-plugin-report-caught-error';
import requireUseeffectDependencyArray from '@arabasta/eslint-plugin-require-useeffect-dependency-array';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import prettier from 'eslint-config-prettier';
import deprecation from 'eslint-plugin-deprecation';
import es from 'eslint-plugin-es';
import newWithError from 'eslint-plugin-new-with-error';
import reactLint from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

// The tseslint.config function is a variadic identity function which is a fancy way of saying
// that it's a function with a spread argument that accepts any number flat config objects
// and returns the objects unchanged. It exists as a way to quickly and easily provide
// types for your flat config file without the need for JSDoc type comments.
export default tseslint.config(
  eslint.configs.recommended,
  requireUseeffectDependencyArray.configs.recommended,
  reportCaughtError.configs.recommended,
  reduxUseAppFunctions.configs.recommended,
  noTestingLibraryWithoutCleanup.configs.recommended,
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  ...compat.extends('airbnb'),
  eslintComments.recommended,
  ...compat.extends('plugin:import/errors'),
  prettier,
  {
    // This configuration object matches all files that other configuration objects
    // match, because config objects that don’t specify files or ignores apply to
    // all files that have been matched by any other configuration object.
    // https://eslint.org/docs/latest/use/configure/configuration-files#:~:text=You%20can%20use,default.%20For%20example%3A
    name: 'All files',
    settings: {
      'import/internal-regex': '^(~|src)',
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        generators: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      'react-refresh': reactRefresh,
      react: reactLint,
      'unused-imports': unusedImports,
      'new-with-error': newWithError,
      es,
    },
    rules: {
      'no-void': 'off',
      'no-undefined': 'off',
      'linebreak-style': ['error', 'unix'],
      'no-console': 'error',
      'no-func-assign': 'error',
      'no-class-assign': 'error',
      'no-await-in-loop': 'off',
      'max-classes-per-file': 'off',
      'no-return-await': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      'no-param-reassign': 'off',
      'lines-between-class-members': 'off',
      'new-with-error/new-with-error': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Usage of relative parent imports is not allowed.',
            },
          ],
        },
      ],
      'import/prefer-default-export': 'off',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          pattern: {
            js: 'never',
            jsx: 'never',
          },
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            ['external'],
            'internal',
            ['sibling', 'parent', 'index'],
            'unknown',
            'object',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
            },
            {
              pattern: 'src/**',
              group: 'internal',
            },
            {
              pattern: '**/*.+(css|scss)',
              patternOptions: { dot: true, nocomment: true },
              group: 'unknown',
              position: 'after',
            },
            {
              pattern: '{.,..}/**/*.+(css|scss)',
              patternOptions: { dot: true, nocomment: true },
              group: 'unknown',
              position: 'after',
            },
          ],
          warnOnUnassignedImports: true,
          pathGroupsExcludedImportTypes: ['builtin', 'external'],
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
          },
        },
      ],
      'import/no-default-export': 'error',
      'import/no-deprecated': 'error',
      'import/no-commonjs': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-nodejs-modules': 'error',
      'import/no-unresolved': 'error',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './',
              from: './src/**/+(*.)+(spec|test).+(ts|js)?(x)',
              message: 'Importing test files in non-test files is not allowed.',
            },
            {
              target: './',
              from: './src/testing',
              message:
                'Importing testing utilities in non-test files is not allowed.',
            },
          ],
        },
      ],
      'react-hooks/exhaustive-deps': 'error',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-refresh/only-export-components': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/function-component-definition': 'off',
      'react/no-array-index-key': 'off',
      '@arabasta/report-caught-error/report-caught-error': [
        'error',
        'reportUnknownError',
      ],
      'es/no-optional-catch-binding': 'error',
      // This rule can be used just fine with Prettier as long as
      // you don’t use the "multi-line" or "multi-or-nest" option.
      // https://github.com/prettier/eslint-config-prettier/?tab=readme-ov-file#curly
      curly: ['error', 'all'],
    },
  },
  {
    name: 'All TypeScript files',
    files: ['**/*.+(ts|tsx)'],
    // This syntactic sugar comes from typescript-eslint's Flat config helper,
    // it allows you to more easily extend shared configs for specific file
    // patterns whilst also overriding rules/options provided by those configs.
    // IT HAS NOTHING TO DO WITH .ESLINTRC's EXTENDS KEY!
    // https://typescript-eslint.io/packages/typescript-eslint#flat-config-extends
    extends: [
      noDestructuringArraysAsObjects.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...compat.extends('plugin:import/typescript'),
      prettier,
    ],
    plugins: { '@typescript-eslint': tseslint.plugin, deprecation },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ['tsconfig.json'],
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      'deprecation/deprecation': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/prefer-ts-expect-error': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          classes: true,
          functions: true,
          variables: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTaggedTemplates: false,
          allowTernary: false,
          enforceForJSX: false,
        },
      ],
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'import/no-empty-named-blocks': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-unresolved': 'error',
      'import/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          pattern: {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        },
      ],
      'linebreak-style': ['error', 'unix'],
      'no-func-assign': 'error',
      'constructor-super': 'error',
      'getter-return': ['error', { allowImplicit: true }],
      'import/named': 'error',
      'no-const-assign': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-import-assign': 'error',
      'no-new-func': 'error',
      'no-new-symbol': 'error',
      'no-obj-calls': 'error',
      'no-this-before-super': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'valid-typeof': ['error', { requireStringLiterals: true }],
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.jsx', '.tsx'],
        },
      ],
      curly: ['error', 'all'],
    },
  },
  {
    name: 'Test files and test related infrastructure',
    files: ['**/+(*.)+(spec|test).+(ts|js)?(x)', 'src/testing/**'],
    extends: [...compat.extends('plugin:testing-library/react')],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'testing-library/no-manual-cleanup': 'off',
      'testing-library/no-wait-for-multiple-assertions': 'off',
      'vitest/expect-expect': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      'import/no-restricted-paths': ['off', { zones: [] }],
      'import/no-nodejs-modules': 'off',
    },
  },
  {
    name: 'Root level .js/.ts configuration files',
    files: ['*.js', '*.ts', '__mocks__/**/*.[j|t]s?(x)'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'import/no-default-export': 'off',
      'import/no-commonjs': 'off',
      'import/no-nodejs-modules': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
  {
    name: 'Root level .ts configuration files',
    files: ['*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.node.json'],
      },
    },
  },
  {
    name: 'Type definition files',
    files: ['**/*.d.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    ignores: ['package-lock.json', 'dist', 'coverage', 'extra'],
  }
);
