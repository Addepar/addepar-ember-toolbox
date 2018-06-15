/* eslint-env node */
'use strict';

const VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: '@addepar/ember-toolbox',

  included(app) {
    this._super.included.apply(this, arguments);
    let emberChecker = new VersionChecker(app).forEmber();

    if (emberChecker.lt('1.13.0')) {
      app.import('vendor/addepar-ember-toolbox/register-legacy-helpers.js');
    }
  },

  includedCommands() {
    let lint = require('./lib/lint');
    let { formatAll, formatChanged } = require('./lib/format');

    let { ui } = this.project;

    return {
      addePreCommit: {
        name: 'adde-pre-commit',
        description: 'Addepar Ember Precommit hook command',
        run(options, files) {
          return formatChanged(ui, files);
        },
      },

      addeFormat: {
        name: 'adde-format',
        description: 'Addepar Ember automatic formatting command',
        run() {
          return formatAll(ui);
        },
      },

      addeLint: {
        name: 'adde-lint',
        description: 'Addepar Ember Lint command',
        availableOptions: [
          { name: 'file-names', type: Boolean, default: false, aliases: ['f'] },
          { name: 'javascript', type: Boolean, default: false, aliases: ['j'] },
          { name: 'sass', type: Boolean, default: false, aliases: ['s'] },
        ],
        run(options, files) {
          if (options.fileNames || options.javascript || options.sass) {
            return lint(ui, files, options);
          }

          return lint(ui, files);
        },
      },
    };
  },
};
