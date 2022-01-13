const fs = require('fs-extra');
const execa = require('execa');
const walkSync = require('walk-sync');
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
const STANDARD_JS_PATHS = [...STANDARD_APP_PATHS, 'blueprints'];
const STANDARD_STYLE_PATHS = ['styles', 'addon/styles', 'app/styles', 'tests/dummy/app/styles'];

function runLint(name, options) {
  let { command, args, allowedFailures } = options;

  return execa(command, args)
    .then(() => [true, `🎉 ${name} lint passed!`])
    .catch(e => {
      let errorMessage = e.stderr || e.stdout;

      if (allowedFailures && errorMessage.match(allowedFailures)) {
        return [true, `🎉 ${name} lint passed!`];
      }

      return [false, `❌ ${name} lint failed:\n${e.stderr || e.stdout}`];
    });
}

// This function is deprecated.
// Filename linting is now handled by lint-file-names.js.
// This function still exists (for the time being) to handle
// the `ember adde-lint --file-names` invocation, which calls this
// function.
function lintFileNames(paths = []) {
  let root = process.cwd();

  if (paths.length === 0) {
    for (let path of STANDARD_APP_PATHS) {
      if (fs.existsSync(`${root}/${path}`)) {
        paths.push(...walkSync(`${root}/${path}`).map(p => `${path}/${p}`));
      }
    }
  } else {
    paths = paths
      .map(p => p.replace(`${root}/`, ''))
      .filter(p => {
        let appPathsPrefix = new RegExp(`^(${STANDARD_APP_PATHS.join('|')})`);

        return p.match(appPathsPrefix) || STANDARD_APP_FILES.includes(p);
      });
  }

  // Accepts dasherized folder and file names. Files may begin with _ (to accommodate
  // SASS partials) and folders may begin with @ to account for scopes
  let dasherizedNamesOnly = /^(@?[a-z0-9][a-zA-Z0-9-]+\/)*(_?[a-z0-9-.][a-zA-Z0-9-.]+)?$/;

  let matches = paths.filter(path => !path.match(dasherizedNamesOnly) && path !== '.DS_Store');

  if (matches.length > 0) {
    return [
      false,
      `❌ filename lint failed, found malformed file names. All files must be kebab case: \n${matches.join(
        '\n'
      )}`,
    ];
  } else {
    return [true, '🎉 filename lint passed!'];
  }
}

function lintJavascript(paths = []) {
  if (paths.length === 0) {
    paths = STANDARD_JS_PATHS.concat(STANDARD_APP_FILES);
  }

  paths = paths.filter(path => fs.existsSync(path));

  let parentNodePath = path.resolve(path.join(path.basename(__filename), '../node_modules'));

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

  return runLint('javascript', {
    command: eslintPath,
    args: paths,
  });
}

function lintSass(paths = []) {
  if (paths.length === 0) {
    paths = STANDARD_STYLE_PATHS;
  }

  let sassLintPath = require.resolve('sass-lint/bin/sass-lint');

  return runLint('sass', {
    command: sassLintPath,
    args: ['-vq'],
  });
}

function lintPrettierSass(paths = []) {
  if (paths.length === 0) {
    paths = STANDARD_STYLE_PATHS.map(p => `${p}/**/*.scss`);
  }

  let prettierPath = require.resolve('prettier/bin-prettier');

  return runLint('sass prettier', {
    command: prettierPath,
    args: ['-l'].concat(paths),
    allowedFailures: 'No matching files',
  });
}

module.exports = function lint(
  ui,
  paths = [],
  { fileNames = true, javascript = true, sass = true } = {}
) {
  if (paths.length === 0) {
    ui.startProgress('linting all files, this could take a while...');
  } else {
    ui.startProgress('linting...');
  }

  let promises = [];

  if (fileNames) {
    promises.push(lintFileNames(paths.slice()));
  }

  if (javascript) {
    promises.push(lintJavascript(paths.slice()));
  }

  if (sass) {
    promises.push(lintSass(paths.slice()));
    promises.push(lintPrettierSass(paths.slice()));
  }

  return Promise.all(promises).then(results => {
    let allPassed = true;

    ui.stopProgress();

    for (let [passed, message] of results) {
      if (passed) {
        ui.writeLine(`${message}`);
      } else {
        allPassed = false;
        ui.writeError(`${message}\n`);
      }
    }

    return allPassed ? Promise.resolve() : Promise.reject();
  });
};
