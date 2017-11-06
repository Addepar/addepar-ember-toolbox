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

    app.options = app.options || {};
    app.options.sassOptions = app.options.sassOptions || {};

    const sass = require('node-sass');
    const importOnce = require('node-sass-import-once');

    if (!app.options.sassOptions.nodeSass) {

      const sassRender = sass.render;

      sass.render = function(options, callBack) {
        options.importer = importOnce;
        options.importOnce = {
          index: false,
          css: false,
          bower: false
        };

        sassRender(options, callBack);
      }
    }

    app.options.sassOptions.nodeSass = sass;
  }
};
