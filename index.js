/* eslint-env node */
'use strict';

const VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: '@addepar/ice-box',

  included(app) {
    const emberChecker = new VersionChecker(app).forEmber();

    if (emberChecker.lt('1.13.0')) {
      app.import('vendor/ice-box/register-legacy-helpers.js');
    }
  }
};
