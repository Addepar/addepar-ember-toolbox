[![Build Status](https://travis-ci.org/Addepar/addepar-ember-toolbox.svg?branch=master)](https://travis-ci.org/Addepar/addepar-ember-toolbox)

# Archived

**This repository is no longer actively maintained.**

To migrate away from it:
  - replace "adde-pre-commit" with [lint-staged](https://github.com/lint-staged/lint-staged)
  - replace "adde-lint --file-names" with [ls-lint](https://ls-lint.org/) (example PR: https://github.com/Addepar/ember-table/pull/1165)
  - replace "adde-lint --javascript" with direct usage of eslint (example PR: https://github.com/Addepar/ember-table/pull/1163)
  - replace "adde-lint --sass" with direct usage of sass-lint and prettier (example PR: https://github.com/Addepar/ember-table/pull/1164)

# @addepar/ember-toolbox

Addepar Ember Toolbox provides a number of commands for linting and ensuring
consistent style of Ember projects.

- `ember adde-lint --javascript --sass --file-names`: Runs our linting checks against
  the specified files. If no files are specified, runs them against the entire repo. Using adde-lint to line filenames is deprecated, use `adde-lint-file-names` instead.
- `ember adde-format`: Formats the files specified, or if none are specified formats
  the entire repo.
- `ember adde-pre-commit`: Deprecated, use adde-pre-commit bin script instead.
- `adde-pre-commit`: [bin script](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin) that Runs our formatting and linting checks against staged
  changes
- `adde-lint-file-names`: [bin script](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin) provided by this package that lints the passed (via command line) filepaths
-

Installing this addon will also add styleguides as dependencies, set up a pre-commit
hook to format/lint changed files before commits using [Husky](https://github.com/typicode/husky/),
and automatically format the repo its installed in.

## Installation

```
ember install @addepar/ember-toolbox
```

## Running

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

- `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
- `ember test`
- `ember test --server`

## Building

- `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Linting File Names

`adde-lint-file-names` lints the file names that are passed on the command line. File names must be passed as absolute paths.

The file name linting:

- first strips off the `process.cwd()`, which is assumed to be the ember app root directory
- excludes files that are not in typical Ember-app directory-layout spots (see below)
- Checks each remaining filepath against a regex

### Lint Filename Regex

See the `lib/lint-file-names.js` file for full details.
The rules regarding filename linting are:

- directories must start with lowercase alphanumeric (with optional starting "@"),
- filenames must start with either lowercase alphanumeric or "\_","-" or "."
- filenames cannot include "\_" except for the first character

```
Bad examples:
_badDir/xyz.js (dir doesn't start with alphanumeric)
BadDir/xyz.js (dir starts with capital)
okDir/Bad.js (file starts with capital)
okDir/Bad.js (file starts with capital)
okDir/bad_file.js (file includes _ after first character)
```

```
Good examples:
ok/.file.js
ok/-file.js
ok/ok-file.js
ok/\_file.js
ok/file.js
@ok/file.js
```

To try the regex interactively, visit https://regexr.com/5tn2c.
