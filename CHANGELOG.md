CHANGELOG.md

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.24.3 - 2020-09-25

### Fixed

- Pasting single values into one or more cells did not emit the affected cells in the `afterpaste` event (mdebrauw, #308)

## 0.24.2 - 2020-09-25

### Fixed

- Improved rendering of lines and strokes (tmaroschik, #307)

## 0.24.1 - 2020-09-24

### Fixed

- Fixed this CHANGELOG, headings were messed up (ndrsn)
- Fix `getHeaderWidth` return value (tmaroschik, #306)
- Fix web component data and schema attributes (tmaroschik, #305)

### Added

- New `autoResizeRows` attribute for wrapping text in cell (mdebrauw, #303)

### Changed

- Bring UX of editing and entering data in cells in line with Excel (ndrsn, #304)

## 0.23.1 - 2020-09-16

This release merits bumping the minor version, as it contains not only a couple fixes,
but some new behavior: editing a cell is starting by typing, instead of hitting `Enter`
first, bringing the behavior more in line with Excel and Google Sheets. It also allows
for filtering on blank/empty values in a column.

### Fixed

- Fixes scrolling behaviour in safari. (tim-vandecasteele, #286)
- Fix copy/paste of cells in canvas-datagrid on Windows (mdebrauw, #301)

### Added

- Fill paste values in multiple selected cells (ndrsn, #291)
- Enable filtering empty/blank column values (mdebrauw, #298)

### Changed

- Type to enter text in cell (ndrsn, #299)
- Skip flaky tests (ndrsn, #294)
- Bump lodash from 4.17.15 to 4.17.20 (dependabot, #302)
- Bump elliptic from 6.5.2 to 6.5.3 (dependabot, #284)
- Bump http-proxy from 1.18.0 to 1.18.1 (dependabot, #295)

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
