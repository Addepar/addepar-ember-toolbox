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
const eslintPath = require.resolve('eslint/bin/eslint', { paths: [parentNodePath] });
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
