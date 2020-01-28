const fs = require('fs-extra');
const { formatAll } = require('../../../lib/format');

function updatePackageJson(root, ui) {
  let packageJson = fs.readJsonSync(`${root}/package.json`);

  packageJson = updateHuskyInPackageJson(packageJson, ui);

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.lint = 'ember adde-lint';
  packageJson.scripts['lint:js'] = 'ember adde-lint --javascript';
  packageJson.scripts['lint:sass'] = 'ember adde-lint --sass';
  packageJson.scripts['lint:files'] = 'ember adde-lint --file-names';

  fs.writeJsonSync(`${root}/package.json`, packageJson);
}

function updateHuskyInPackageJson(packageJson, ui) {
  packageJson.husky = packageJson.husky || {};
  packageJson.husky.hooks = packageJson.husky.hooks || {};
  if (packageJson.husky.hooks['pre-commit']) {
    let existingHook = packageJson.husky.hooks['pre-commit'];
    ui.writeWarnLine(
      `Skipping addition of husky pre-commit hook because one is already present: "${existingHook}"`
    );
    ui.writeWarnLine(
      'You should manually modify the husky pre-commit hook to run "ember adde-pre-commit"'
    );
  } else {
    packageJson.husky.hooks['pre-commit'] = 'ember adde-pre-commit';
  }

  return packageJson;
}

function updateTravisYml(root) {
  if (!fs.existsSync(`${root}/.travis.yml`)) {
    return;
  }

  let travisYml = fs.readFileSync(`${root}/.travis.yml`, { encoding: 'utf8' });

  fs.writeFileSync(`${root}/.travis.yml`, travisYml.replace('lint:js', 'lint'));
}

module.exports = {
  name: '@addepar/ember-toolbox',

  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    let { ui, root } = this.project;

    updatePackageJson(root, ui);
    updateTravisYml(root);

    return this.addPackagesToProject([
      { name: 'husky', target: '^4.2.1' },
      { name: '@addepar/eslint-config' },
      { name: '@addepar/prettier-config' },
      { name: '@addepar/sass-lint-config' },
    ])
      .then(() => {
        return this.addAddonsToProject({
          packages: ['@addepar/style-toolbox'],
        });
      })
      .then(() => formatAll(ui));
  },
};
