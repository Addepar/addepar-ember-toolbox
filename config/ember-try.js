/* eslint-env node */
module.exports = {
  useYarn: true,
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
        },
        resolutions: {
          'ember': 'lts-2-4',
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
        },
        resolutions: {
          'ember': 'lts-2-8',
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
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
