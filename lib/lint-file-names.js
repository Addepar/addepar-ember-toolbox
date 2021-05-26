const execa = require('execa');
const path = require('path');

function getProjectRoot() {
  let cmd = 'git rev-parse --show-toplevel';
  return execa.command(cmd).then(({ stdout }) => {
    return stdout.toString().trim();
  });
}

function absoluteToRelative(root, absPath) {
  if (!absPath.startsWith('/')) {
    throw new Error(`Unexpected non-absolute path: ${absPath}`);
  }
  return path.relative(root, absPath);
}

// directories must start with lowercase alphanumeric (with optional starting "@"),
// filenames must start with either lowercase alphanumeric or "_","-" or "."
// Bad examples:
//   _bad/xyz.js (dir doesn't start with alphanumeric)
//   Bad/xyz.js (dir starts with capital)
//   ok/Bad.js (file starts with capital)
//
// Good examples:
//   ok/.file.js
//   ok/-file.js
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
  return getProjectRoot().then(root => {
    paths = paths.map(absPath => absoluteToRelative(root, absPath));

    let invalid = paths.filter(path => !lintFileName(path));

    if (invalid.length > 0) {
      return {
        success: false,
        message: `Found ${invalid.length} invalid filenames:\n${invalid
          .map(name => `  - ${name}`)
          .join('\n  ')}`,
      };
    } else {
      return { success: true };
    }
  });
}

module.exports = {
  lintFileNames,
};
