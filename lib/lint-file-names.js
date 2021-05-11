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
        message: `${invalid.length} invalid filenames found: ${invalid.join('\n')}`,
      };
    } else {
      return { success: true };
    }
  });
}

module.exports = {
  lintFileNames,
};
