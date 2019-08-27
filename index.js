/* eslint-env node */
'use strict';

module.exports = {
  name: '@addepar/ember-toolbox',

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
