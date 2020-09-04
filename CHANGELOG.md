CHANGELOG.md

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.22.17 - 2020-09-03

### Fixed

- Improper truncating of text in custom formatter (yuanliwei, #287)
- Pasting non-HTML values from clipboard
- Attempting to paste beyond grid bounds resulted in error

### Added

- Adds beforepaste / afterpaste events (ndrsn, #288)

## 0.22.16 - 2020-07-25

This release is (also) of no substance, it was merely to get the CI system
to publish to NPM.

## 0.22.15 - 2020-07-25

This release is of no substance, it was merely to get the CI system
to publish to NPM.

### Changed
- Bump version from 0.22.13 to 0.22.15 in package.json in order to release NPM

## 0.22.14 - 2020-07-25

This release includes a bunch of changes and bugfixes collected of the span
of a year, since version 0.22.12.

### Changed
- Improvements to filtering data (jswolf19)

### Fixed
- Resolve flickering cells (amjha)
- Add singleSelectionMode setting (jtsymon)
- Resolve Safari isColumnVisible bug (cthurston)
- Add tests and fixes for sorting data (jswolf19)
- Various minor bugs
