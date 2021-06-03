const path = require('path');

const STANDARD_APP_FILES = ['index.js', 'ember-cli-build.js', 'testem.js'];
const STANDARD_APP_PATHS = [
  'addon',
  'addon-test-support',
  'app',
  'config',
  'lib',
  'server',
  'test-support',
  'tests',
];

function getLintRoot() {
  // filename linting behavior prior to v0.8.0 was to consider only filenames that were
  // in an Ember-app directory (or were an Ember-app file) in the Ember-app root.
  // v0.8.0 broke that behavior by looking at the *git repository* root instead (as well as
  // skipping the Ember-app-only path filtering).
  // When Husky runs lint-file-names, Husky will change directories to the Husky "root", which
  // will be the Ember-app root (specifically: the Husky root is wherever the package.json with the husky.hooks
  // exists).
  // See [WEBCORE-784] for more
  return Promise.resolve(process.cwd());
}

function filepathIsEmberAppPath(filepath) {
  return (
    STANDARD_APP_FILES.includes(filepath) ||
    STANDARD_APP_PATHS.some(standardPath => filepath.startsWith(standardPath))
  );
}

function absoluteToRelative(root, absPath) {
  if (!absPath.startsWith('/')) {
    throw new Error(`Unexpected non-absolute path: ${absPath}`);
  }
  return path.relative(root, absPath);
}

// directories must start with lowercase alphanumeric (with optional starting "@"),
// filenames must start with either lowercase alphanumeric or "_","-" or "."
// filenames cannot include "_" except for the first character
// Bad examples:
//   _badDir/xyz.js (dir doesn't start with alphanumeric)
//   BadDir/xyz.js (dir starts with capital)
//   okDir/Bad.js (file starts with capital)
//   okDir/Bad.js (file starts with capital)
//   okDir/bad_file.js (file includes _ after first character)
//
// Good examples:
//   ok/.file.js
//   ok/-file.js
//   ok/ok-file.js
//   ok/_file.js
//   ok/file.js
//   @ok/file.js
//
// See https://regexr.com/5tn2c
const dasherizedNamesOnly = /^(@?[a-z0-9][a-zA-Z0-9-]+\/)*(_?[a-z0-9-.][a-zA-Z0-9-.]+)?$/;

function lintFileName(relativePath) {
  return dasherizedNamesOnly.test(relativePath);
}

function lintFileNames(paths) {
  let root = getLintRoot();
  paths = paths.map(absPath => absoluteToRelative(root, absPath));
  paths = paths.filter(path => filepathIsEmberAppPath(path));

  let invalid = paths.filter(path => !lintFileName(path));

  if (invalid.length > 0) {
    return Promise.resolve({
      success: false,
      message: `Found ${invalid.length} invalid filenames:\n${invalid
        .map(name => `  - ${name}`)
        .join('\n  ')}`,
    });
  } else {
    return Promise.resolve({ success: true });
  }
}

module.exports = {
  lintFileNames,
};
