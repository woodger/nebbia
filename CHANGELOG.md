# Changelog

## 3.0.6

- Updated the `fwa` development dependency range.
- Switched the repository package metadata to the HTTPS URL format.
- Simplified the lint script target.

## 3.0.5

- Refined npm package metadata.
- Updated npm package ignore rules.

## 3.0.3

- Lowered the runtime Node.js engine requirement to `>=18.6.0`.
- Updated the test runner dependency range.

## 3.0.2

- Aligned ESLint package versions.
- Added coverage for unsupported template delimiters inside JavaScript fragments.

## 3.0.1

- Migrated test execution to `fwa`.
- Removed the local compiled test suite runner from the package.
- Added npm package ignore rules for source and test files.
- Normalized `main` and `types` package paths.

## 3.0.0

- Migrated the codebase to TypeScript.
- Added compiled `dist` output with declaration files.
- Moved tests next to the source code.
- Replaced Mocha with the native Node.js test runner.
- Added `else if` statement support.
- Added `do...while` statement support.
- Added `break` and `continue` statement support inside iteration blocks.
- Added quote-aware parsing for JavaScript strings and template literals.
- Moved the AST model to `src/ast`.
- Renamed AST node `childs` collection to `children`.
- Removed historical deep-import compatibility wrappers.
- Added ESLint configuration.

## 2.0.3

- Removed compiled test files from the final npm package.
- Ignored coverage and compiled test artifacts.
- Fixed the Travis badge reference in the README.

## 2.0.1

- Moved compiled output from `lib` to `dist`.
- Updated the TypeScript, Mocha, and Node.js development dependency line.
- Raised the runtime Node.js engine requirement to `>=13.2.0`.
- Updated package `main` and `types` paths to the `dist` output.
- Reworked the public TypeScript entry around the compiled `dist` layout.

## 1.0.9

- Added the npm package badge to the README.
- Bumped package metadata for the next published patch.

## 1.0.8

- Updated README usage examples from CommonJS `require` style to ECMAScript module imports.

## 1.0.7

- Fixed the public Nebbia interface typing.

## 1.0.6

- Renamed the callable compiler interface for clearer TypeScript declarations.

## 1.0.5

- Improved the callable compiler signature typing.

## 1.0.4

- Added backwards compatibility for CommonJS `require('nebbia')`.
- Split the callable compiler facade from the parser implementation.
- Published compiled `lib` output and declaration files.

## 1.0.3

- Improved test coverage for expressions, statements, text, and the public compiler entry.

## 1.0.2

- Moved shared node behavior into the base `Node` abstraction.

## 1.0.1

- Migrated the library source from JavaScript to TypeScript.
- Added TypeScript configuration.
- Converted tests to TypeScript spec files.
- Adapted Travis CI for the TypeScript build.

## 0.0.7

- Fixed parsing of statements without spaces before parentheses or braces.
- Added coverage for compact statement syntax such as `for(...) { ... }`.

## 0.0.6

- Expanded test coverage for expression, node, statement, text, and compiler behavior.
- Refactored the JavaScript implementation around smaller compiler model files.
- Updated documentation examples and diagrams.

## 0.0.5

- Split the original compiler implementation into `src/expression`, `src/node`, `src/statement`, and `src/text`.
- Added npm ignore rules for the package.
- Fixed bugs found during the JavaScript source refactor.

## 0.0.4

- Increased parser and compiler test coverage.

## 0.0.3

- Fixed and expanded README documentation.

## 0.0.2

- Evolved the parser toward a more declarative statement-handling approach.
- Updated README examples for the revised parser behavior.

## 0.0.1

- Added the initial JavaScript template literal compiler implementation.
- Added parser support for expressions and JavaScript statement blocks.
- Added the first README, Travis CI configuration, and test suite.
