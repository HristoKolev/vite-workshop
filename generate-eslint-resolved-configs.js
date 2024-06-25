import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function sortObjectKeysAlphabetically(obj) {
  const entries = Object.entries(obj);

  entries.sort((a, b) => a[0].localeCompare(b[0]));

  const sortedObject = entries.reduce((acc, currentValue) => {
    const [key, value] = currentValue;
    acc[key] = value;
    return acc;
  }, {});

  return sortedObject;
}

function sortArrayAlphabetically(array) {
  const clonedArray = [...array];
  clonedArray.sort((a, b) => a.localeCompare(b));

  return clonedArray;
}

function preprocessConfig(configContent) {
  const config = JSON.parse(configContent);

  config.languageOptions.globals = sortObjectKeysAlphabetically(
    config.languageOptions.globals
  );

  config.plugins = sortArrayAlphabetically(config.plugins);

  const rules = Object.entries(config.rules);

  rules.sort((a, b) => a[0].localeCompare(b[0]));

  const sortedRules = rules.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue;

    if (Array.isArray(value)) {
      const severity = value[0];

      if (severity === 'off') {
        value[0] = 0;
      } else if (severity === 'warn') {
        value[0] = 1;
      } else if (severity === 'error') {
        value[0] = 2;
      }
    }

    accumulator[key] = value;
    return accumulator;
  }, {});

  config.rules = sortedRules;

  return JSON.stringify(config, null, 2);
}

async function getResolvedConfig(filepath) {
  return new Promise((resolve, reject) => {
    exec(`npx eslint --print-config ${filepath}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      resolve(stdout);
    });
  });
}

const ESLINT_RESOLVED_CONFIGS_FOLDER = 'eslint-resolved-configs';

(async () => {
  const eslintPaths = [
    { filename: 'file-js.json', lintPath: 'file.js' },
    { filename: 'src-file-js.json', lintPath: 'src/file.js' },
    { filename: 'file-ts.json', lintPath: 'file.ts' },
    { filename: 'src-file-ts.json', lintPath: 'src/file.ts' },
    { filename: 'file-d-ts.json', lintPath: 'file.d.ts' },
  ];

  const resolvedConfigs = await Promise.all(
    eslintPaths.map((eslintPath) => getResolvedConfig(eslintPath.lintPath))
  );

  if (!fs.existsSync(ESLINT_RESOLVED_CONFIGS_FOLDER)) {
    fs.mkdirSync(ESLINT_RESOLVED_CONFIGS_FOLDER);
  }

  for (let i = 0; i < resolvedConfigs.length; i += 1) {
    const { filename } = eslintPaths[i];
    const resolvedProcessedConfig = preprocessConfig(resolvedConfigs[i]);

    fs.writeFileSync(
      path.join(ESLINT_RESOLVED_CONFIGS_FOLDER, filename),
      resolvedProcessedConfig
    );
  }
})();
