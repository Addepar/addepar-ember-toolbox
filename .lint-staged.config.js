/* eslint-env node */

/**
 * This file is used by lint-staged to determine the commands that are run,
 * and which files they are run for.
 *
 * See https://github.com/okonet/lint-staged
 */

const path = require('path');

const prettierPath = require.resolve('prettier/bin-prettier');
const parentNodePath = path.resolve(path.join(path.basename(__filename), '../node_modules/'));

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
const sassLintPath = require.resolve('sass-lint/bin/sass-lint');
const sassLintConfig = require.resolve('@addepar/sass-lint-config/config.yml');
const addeLintFileNamesPath = path.resolve(__dirname, './bin/adde-lint-file-names.js');

module.exports = {
  // Use prettier to reformat all these file types
  '*.{js,json,md,scss}': `${prettierPath} --write`,

  // Use eslint to fix all fixable errors in JS files
  '*.js': `${eslintPath} --fix`,

  // Run sass-lint
  '*.scss': `${sassLintPath} --config ${sassLintConfig} --verbose`,

  // Check the file-name for all changed files
  // [WEBCORE-784] temporarily disable filename linting
  '*': addeLintFileNamesPath,
};
