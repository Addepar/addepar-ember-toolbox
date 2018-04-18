[![Build Status](https://travis-ci.org/Addepar/addepar-ember-toolbox.svg?branch=master)](https://travis-ci.org/Addepar/addepar-ember-toolbox)

# @addepar/ember-toolbox

This is the official Addepar Ember Toolbox! It provides a number of things for Addepar
Ember projects, including:

* Useful polyfills of Ember functionality for older versions of Ember
  * The `(hash)` helper
  * The `(concat)` helper
  * `Ember.assign`
* Ember commands to run Addepar's automated linting and formatting
  * `ember adde-lint --javascript --sass --file-names`: Runs our linting checks against
    the specified files. If no files are specified, runs them against the entire repo.
  * `ember adde-format`: Formats the files specified, or if none are specified formats
    the entire repo.
  * `ember adde-pre-commit`: Runs our formatting and linting checks against staged
    changes

Installing this addon will also add our styleguides as dependencies, set up a pre-commit
hook to format/lint changed files before commits using [Husky](https://github.com/typicode/husky/),
and automatically format the repo its installed in.

## Installation

```
ember install @addepar/ember-toolbox
```

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
