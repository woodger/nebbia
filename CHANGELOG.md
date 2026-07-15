# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and this project adheres to
[Semantic Versioning].

## [Unreleased]

## [3.0.7] - 2026-07-14

### Changed

- Updated the lint script to use the ESLint configuration defaults.
- Kept CommonJS compatibility checks explicit under the ESLint `no-require-imports` rule.

## [3.0.6] - 2026-07-03

### Changed

- Updated the `fwa` development dependency range.
- Switched the repository package metadata to the HTTPS URL format.
- Simplified the lint script target.

### Removed

- Removed tracked compiled `dist` output from the repository.
- Removed source map generation from compiled output.

## [3.0.5] - 2026-07-02

### Changed

- Refined npm package metadata.
- Updated npm package ignore rules.

## [3.0.3] - 2026-06-30

### Changed

- Lowered the runtime Node.js engine requirement to `>=18.6.0`.
- Updated the test runner dependency range.

## [3.0.2] - 2026-06-29

### Added

- Added coverage for unsupported template delimiters inside JavaScript fragments.

### Changed

- Aligned ESLint package versions.

## [3.0.1] - 2026-06-29

### Added

- Added npm package ignore rules for source and test files.

### Changed

- Migrated test execution to `fwa`.
- Normalized `main` and `types` package paths.

### Removed

- Removed the local compiled test suite runner from the package.

## [3.0.0] - 2026-06-24

### Added

- Added compiled `dist` output with declaration files.
- Added `else if` statement support.
- Added `do...while` statement support.
- Added `break` and `continue` statement support inside iteration blocks.
- Added quote-aware parsing for JavaScript strings and template literals.
- Added ESLint configuration.

### Changed

- Migrated the codebase to TypeScript.
- Moved tests next to the source code.
- Replaced Mocha with the native Node.js test runner.
- Moved the AST model to `src/ast`.
- Renamed AST node `childs` collection to `children`.

### Removed

- Removed historical deep-import compatibility wrappers.

## [2.0.3] - 2024-06-16

### Changed

- Ignored coverage and compiled test artifacts.

### Removed

- Removed compiled test files from the final npm package.

### Fixed

- Fixed the Travis badge reference in the README.

## [2.0.1] - 2024-06-16

### Changed

- Moved compiled output from `lib` to `dist`.
- Updated the TypeScript, Mocha, and Node.js development dependency line.
- Raised the runtime Node.js engine requirement to `>=13.2.0`.
- Updated package `main` and `types` paths to the `dist` output.
- Reworked the public TypeScript entry around the compiled `dist` layout.

## [1.0.9] - 2021-03-07

### Added

- Added the npm package badge to the README.

### Changed

- Bumped package metadata for the next published patch.

## [1.0.8] - 2021-03-07

### Changed

- Updated README usage examples from CommonJS `require` style to ECMAScript module imports.

## [1.0.7] - 2021-03-02

### Fixed

- Fixed the public Nebbia interface typing.

## [1.0.6] - 2021-03-01

### Changed

- Renamed the callable compiler interface for clearer TypeScript declarations.

## [1.0.5] - 2021-02-28

### Changed

- Improved the callable compiler signature typing.

## [1.0.4] - 2021-02-22

### Added

- Added backwards compatibility for CommonJS `require('nebbia')`.
- Published compiled `lib` output and declaration files.

### Changed

- Split the callable compiler facade from the parser implementation.

## [1.0.3] - 2021-02-16

### Added

- Improved test coverage for expressions, statements, text, and the public compiler entry.

## [1.0.2] - 2021-02-16

### Changed

- Moved shared node behavior into the base `Node` abstraction.

## [1.0.1] - 2021-02-16

### Added

- Added TypeScript configuration.

### Changed

- Migrated the library source from JavaScript to TypeScript.
- Converted tests to TypeScript spec files.
- Adapted Travis CI for the TypeScript build.

## [0.0.7] - 2019-12-03

### Added

- Added coverage for compact statement syntax such as `for(...) { ... }`.

### Fixed

- Fixed parsing of statements without spaces before parentheses or braces.

## [0.0.6] - 2019-07-20

### Changed

- Expanded test coverage for expression, node, statement, text, and compiler behavior.
- Refactored the JavaScript implementation around smaller compiler model files.
- Updated documentation examples and diagrams.

## [0.0.5] - 2019-04-26

### Added

- Added npm ignore rules for the package.

### Changed

- Split the original compiler implementation into `src/expression`, `src/node`, `src/statement`, and `src/text`.

### Fixed

- Fixed bugs found during the JavaScript source refactor.

## [0.0.4] - 2019-03-03

### Added

- Increased parser and compiler test coverage.

## [0.0.3] - 2018-11-06

### Fixed

- Fixed and expanded README documentation.

## [0.0.2] - 2018-11-05

### Changed

- Evolved the parser toward a more declarative statement-handling approach.
- Updated README examples for the revised parser behavior.

## [0.0.1] - 2018-11-05

### Added

- Added the initial JavaScript template literal compiler implementation.
- Added parser support for expressions and JavaScript statement blocks.
- Added the first README, Travis CI configuration, and test suite.

[Keep a Changelog]: https://keepachangelog.com/en/1.1.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html
