const prettierPath = require.resolve('prettier/bin-prettier');
const eslintPath = require.resolve('eslint/bin/eslint');
const sassLintPath = require.resolve('sass-lint/bin/sass-lint');

module.exports = {
  linters: {
    '*.{js,json,md,scss}': [`${prettierPath} --write`, 'git add'],
    '*.js': [`${eslintPath} --fix`, 'git add'],
    '*.scss': `${sassLintPath} -vq`,
    '*': 'ember adde-lint --file-names',
  },
};
