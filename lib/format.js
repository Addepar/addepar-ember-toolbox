const execa = require('execa');

const lint = require('./lint');

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
const STANDARD_JS_PATHS = [...STANDARD_APP_PATHS, 'blueprints'];

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

  let prettierPath = require.resolve('prettier/bin-prettier');
  let eslintPath = require.resolve('eslint/bin/eslint');

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
  let lintStagedPath = require.resolve('lint-staged');
  let lintStagedConfigPath = require.resolve('../.lint-staged.config.js');

  ui.startProgress('running formatting and linting on changed files...');

  return execa(lintStagedPath, ['--config', lintStagedConfigPath], { cwd: process.cwd() })
    .then(() => {
      ui.stopProgress();
      ui.writeLine('pre-commit successful! 🚀');
    })
    .catch(err => {
      ui.stopProgress();
      ui.writeError(err.stderr);

      return Promise.reject();
    });
}

module.exports = { formatAll, formatChanged };
