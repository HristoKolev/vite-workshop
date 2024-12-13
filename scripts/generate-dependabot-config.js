import semver from 'semver';
import packageJson from '../package.json' with { type: 'json' };
import yaml from 'yaml';
import fs from 'node:fs/promises';
import path from 'node:path';

const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const dependabotIgnoredDependencyVersions = [];

for (const dependencyName in allDependencies) {
  const semverRange = allDependencies[dependencyName];

  const currentVersionFromRange = semver.coerce(semverRange);

  const nextPatch = `${currentVersionFromRange.major}.${currentVersionFromRange.minor}.${currentVersionFromRange.patch + 1}`;

  const nextMinor = `${currentVersionFromRange.major}.${currentVersionFromRange.minor + 1}.0`;

  const allowPatch = semver.satisfies(nextPatch, semverRange);

  const allowMinor = semver.satisfies(nextMinor, semverRange);

  const ignoredUpdateTypes = [];

  if (!allowPatch) {
    ignoredUpdateTypes.push('version-update:semver-patch');
  }

  if (!allowMinor) {
    ignoredUpdateTypes.push('version-update:semver-minor');
  }

  if (ignoredUpdateTypes.length > 0) {
    dependabotIgnoredDependencyVersions.push({
      'dependency-name': dependencyName,
      'update-types': ignoredUpdateTypes,
    });
  }
}

const dependabotConfig = {
  version: 2,
  updates: [
    {
      'package-ecosystem': 'npm',
      labels: ['dependencies', 'auto-merge-from-default'],
      directory: '/',
      schedule: { interval: 'weekly' },
      'versioning-strategy': 'increase',
      groups: {
        'production-dependencies': {
          'applies-to': 'version-updates',
          'dependency-type': 'production',
          'update-types': ['minor', 'patch'],
        },
        'development-dependencies': {
          'applies-to': 'version-updates',
          'dependency-type': 'development',
          'update-types': ['minor', 'patch'],
        },
      },
      ignore: [
        ...dependabotIgnoredDependencyVersions,
        {
          'dependency-name': '*',
          'update-types': ['version-update:semver-major'],
        },
      ],
    },
  ],
};

const yamlSerializerOptions = {
  singleQuote: true,
};

const dependabotConfigYaml = yaml.stringify(
  dependabotConfig,
  yamlSerializerOptions
);

await fs.mkdir(path.resolve('.github'), { recursive: true });
await fs.writeFile(
  path.join('.github', 'dependabot.yml'),
  dependabotConfigYaml,
  { encoding: 'utf8' }
);
