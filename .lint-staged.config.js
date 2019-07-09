const path = require('path');
const prettierPath = require.resolve('prettier/bin-prettier');
const parentNodePath = path.resolve(path.join(path.basename(__filename), '../node_modules/'));
const eslintPath = require.resolve('eslint/bin/eslint', { paths: [parentNodePath] });
const sassLintPath = require.resolve('sass-lint/bin/sass-lint');

module.exports = {
  linters: {
    '*.{js,json,md,scss}': [`${prettierPath} --write`, 'git add'],
    '*.js': [`${eslintPath} --fix`, 'git add'],
    '*.scss': `${sassLintPath} -vq`,
    '*': 'ember adde-lint --file-names',
  },
};
