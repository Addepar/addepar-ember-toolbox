/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'ember-1.11',
      bower: {
        dependencies: {
          'ember': '~1.11.0',
          'ember-cli-shims': 'ember-cli/ember-cli-shims#0.0.3'
        },
        resolutions: {
          'ember': '~1.11.0',
          'ember-cli-shims': '0.0.3'
        }
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-1.13',
      bower: {
        dependencies: {
          'ember': '~1.13.0',
          'ember-cli-shims': '0.0.6'
        },
        resolutions: {
          'ember': '~1.13.0',
          'ember-cli-shims': '0.0.6'
        }
      },
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.4',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-4',
          'ember-cli-shims': null
        },
        resolutions: {
          'ember': 'lts-2-4',
          'ember-cli-shims': null
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.8',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-8',
          'ember-cli-shims': null
        },
        resolutions: {
          'ember': 'lts-2-8',
          'ember-cli-shims': null
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-default',
      bower: {
        dependencies: {
          'ember-cli-shims': null
        },
        resolutions: {
          'ember-cli-shims': null
        }
      },
      npm: {
        devDependencies: {}
      }
    }
  ]
};
