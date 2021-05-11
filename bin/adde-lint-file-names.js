#!/usr/bin/env node
/* eslint-env node */

const { lintFileNames } = require('../lib/lint-file-names');

(async () => {
  let absolutePaths = process.argv.slice(2);
  let result = await lintFileNames(absolutePaths);
  if (!result.success) {
    // eslint-disable-next-line
    console.error(result.message);
    process.exit(1);
  }
})();
