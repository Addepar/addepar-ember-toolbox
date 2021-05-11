/* eslint-env node */

const path = require('path');

const prettierPath = require.resolve('prettier/bin-prettier');
const parentNodePath = path.resolve(path.join(path.basename(__filename), '../node_modules/'));
const eslintPath = require.resolve('eslint/bin/eslint', { paths: [parentNodePath] });
const sassLintPath = require.resolve('sass-lint/bin/sass-lint');
const addeLintPath = path.resolve(__dirname, './bin/adde-lint-file-names.js');

module.exports = {
  '*.{js,json,md,scss}': [`${prettierPath} --write`],
  '*.js': [`${eslintPath} --fix`],
  '*.scss': `${sassLintPath} -vq`,
  '*': addeLintPath,
};
