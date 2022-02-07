const path = require('path');
const execa = require('execa');
const lint = require('./lint');
const fs = require('fs-extra');

const STANDARD_APP_FILES = ['index.js', 'ember-cli-build.js', 'testem.js'];
const STANDARD_APP_PATHS = [
  'addon-test-support',
  'addon',
  'app',
  'blueprints',
  'config',
  'lib',
  'server',
  'styles',
  'test-support',
  'tests',
];

function formatAll(ui, paths = []) {
  let prettierPaths = paths.slice();
  let eslintPaths = paths.slice();

  if (paths.length === 0) {
    prettierPaths.push(...STANDARD_APP_FILES);
    prettierPaths.push(...STANDARD_APP_PATHS.map(p => `${p}/**/*.js`));
    prettierPaths.push(...STANDARD_APP_PATHS.map(p => `${p}/**/*.scss`));

    eslintPaths.push(...STANDARD_APP_FILES);
    eslintPaths.push(...STANDARD_APP_PATHS);
  }

  eslintPaths = eslintPaths.filter(path => fs.existsSync(path));

  let prettierPath = require.resolve('prettier/bin-prettier');
  let parentNodePath = path.resolve(path.join(path.basename(__filename), '../node_modules'));
  /**
   * There are several consumers of this package that still rely on ESLint 7.
   *
   * After bumping ESLint to 8 in `ember-toolbox` proper, ESLint 7 no longer
   * resolves.
   *
   * The code below ensures that `ember-toolbox` can work for both ESLint 7 and 8,
   * and gives us time to upgrade ESLint 7 users, as well.
   */
  let eslintPath;
  try {
    // ESLint 8
    eslintPath = require.resolve('.bin/eslint', { paths: [parentNodePath] });
  } catch (err) {
    // assuming legacy ESLint 7
    console.log('\n');
    console.warn(err);
    console.log('\nTrying alternative path to eslint (assuming version 7) ..');
    eslintPath = require.resolve('eslint/bin/eslint', { paths: [parentNodePath] });
  }

  ui.startProgress('formatting all files, this could take a while...');

  return execa(prettierPath, ['--write'].concat(prettierPaths))
    .then(() => {
      return execa(`${eslintPath} --fix ${eslintPaths.join(' ')}`).catch(() => {
        // Swallow this error, we lint up ahead
      });
    })
    .then(() => {
      ui.startProgress();
      ui.writeLine('automatic formatting successful! 🚀');
    })
    .catch(err => {
      ui.startProgress();
      ui.writeError(`automatic formatting failed:\n${err.stdout}\n${err.stderr}`);

      return Promise.reject();
    })
    .then(() => lint(ui));
}

function formatChanged(ui) {
  let lintStaged = require('lint-staged');
  let lintStagedConfigPath = require.resolve('../.lint-staged.config.js');

  ui.writeLine('running formatting and linting on changed files...');

  // lintStaged will throw (and print to console) if there is a
  // configuration error.
  // If there is a linting error, we hit the ".then" but `success` is false.
  // In both cases, the commit will be rejected.
  return lintStaged({
    configPath: lintStagedConfigPath,
  }).then(success => {
    if (success) {
      ui.writeLine('pre-commit successful! 🚀');
    } else {
      ui.writeError('pre-commit linting failed');

      // Return a rejection to prevent the commit from being accepted
      return Promise.reject();
    }
  });
}

module.exports = { formatAll, formatChanged };
