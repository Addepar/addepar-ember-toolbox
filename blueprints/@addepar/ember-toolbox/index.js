const fs = require('fs-extra');
const { formatAll } = require('../../../lib/format');

function updatePackageJson(root) {
  let packageJson = fs.readJsonSync(`${root}/package.json`);

  packageJson.scripts = packageJson.scripts || {};

  packageJson.scripts.precommit = 'ember adde-pre-commit';

  packageJson.scripts.lint = 'ember adde-lint';
  packageJson.scripts['lint:js'] = 'ember adde-lint --javascript';
  packageJson.scripts['lint:sass'] = 'ember adde-lint --sass';
  packageJson.scripts['lint:files'] = 'ember adde-lint --file-names';

  fs.writeJsonSync(`${root}/package.json`, packageJson);
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

    updatePackageJson(root);
    updateTravisYml(root);

    return this.addPackagesToProject([
      { name: 'husky' },
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
