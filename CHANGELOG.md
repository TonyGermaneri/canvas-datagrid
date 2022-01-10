CHANGELOG.md

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.4.0 - 2022-01-10

## Added

- Feature: Add column/row grouping for tables (xianzhi3, #453)
- Feature: Add support for grouped columns (hangxingliu, #443)

## Fixed

- Update ESLint config for incorrect errors. (hangxingliu, #465)
- Fix: Columns are hidden when there are frozen columns and hidden columns simultaneously (hangxingliu, #462)
- Fix: null values are cast to strings ('null') on copy (mdebrauw, #461)

## 0.3.25 - 2021-12-22

### Fixed

- Fix null value bug when copying value (ndrsn)
- Fix setting property `dragOffset` of undefined (Lie Yue, #457)
- Fix cell editing in the inner grid (Liu Yue, #456)

## 0.3.24 - 2021-12-22

### Changed

- Prevent default when handling cut event and cleanup utility functions (mdebrauw, #454)

## 0.3.23 - 2021-12-16

### Fixed

- Slight refactor and set minimum width when resizing (mdebrauw, #452)

## 0.3.22 - 2021-12-15

### Changed

- Resize selected columns simultaneously (mdebrauw, #451)
- Refactor `cut` and `copy` event handlers (mdebrauw, #450)

## 0.3.21 - 2021-12-08

### Added

- Add `afterdelete` event and `deleteSelectedData()` public method (mdebrauw, #446)

### Fixed

- Remove mousemove at body when dispose (faimaklg, #449)
- Fire event when resizing column by double clicking column border (mdebrauw, #447)
- Fix filter button active/hover states, remove inline grid button after menu item click (xianzhi3, #445)

## 0.3.20 - 2021-12-04

### Added

- Add option for dropdown button when filtering (xianzhi3, #442)

## 0.3.19 - 2021-11-24

### Fixed

- Fix copy when column name or cell value is number (faimaklg, #402)
- Fix moving multiple columns or rows (xianzhi3, #390)
- Fix position of scroll bar with frozen pane xianzhi3, (#393)

## 0.3.18 - 2021-11-18

No changes; had to bump version number because race condition caused 0.3.16 to be published instead of 0.3.17.

## 0.3.17 - 2021-11-18

### Fixed

- Do not render row gaps when sorting (ndrsn, #391)

## 0.3.16 - 2021-11-18

### Fixed

- Fix string sort when value is null/undefined (faimaklg, #388)

## 0.3.15 - 2021-11-18

### Fixed

- Fix highlighting incorrect column after repositioning column (xianzhi3, #399)
- Reverse sort order icon (faimaklg, #387)
- Fix link in tutorials (slominskir, #386)

## 0.3.14 - 2021-10-20

### Added

- Emit affected cells in `cut` event (mdebrauw, #383)

## 0.3.13 - 2021-10-18

### Changed

- `afterpaste` event now includes bound row/column index (mdebrauw, #381)
- Adds selectedCells to selectionchanged event (mdebrauw, #380)
- Add keepFocusOnMouseOut attribute (mdebrauw, #379)
- Better pasting of clipboard data (mdebrauw, #378)

## 0.3.12 - 2021-10-11

### Changed

- New options to exclude frozen rows when filtering and sorting (mdebrauw, #377)

## 0.3.11 - 2021-10-04

### Fixed

- Fix inconsistent selection behavior between touch and mouse (tmaroschik, #376)

## 0.3.10 - 2021-10-04

### Changed

- Allow shrinking selections with keyboard (mdebrauw, #375)

## 0.3.9 - 2021-09-22

### Fixed

- Fix buggy paste behavior introduced in #371 (mdebrauw, #373)

## 0.3.8 - 2021-09-09

### Fixed

- Fix autoscroll issue when selecting a cell on top or bottom row (mdebrauw, #369)
- Make copy and pasting more like Excel (faimaklg, #371)

## 0.3.7 - 2021-08-30

### Fixed

- Fix paste in filter mode (mdebrauw, #370)

## 0.3.6 - 2021-08-16

Same as previous release but bumped version to get package to publish to NPM.

## 0.3.5 - 2021-08-13

### Fixed

- Fix missing text where value has multiple '-' (faimaklg, #363)

## 0.3.4 - 2021-03-11

### Added

- Adds option 'hoverMode' (twojtylak, #350)

## 0.3.3 - 2021-02-08

### Fixed

- Fixes situation where undefined `data` breaks drawing (ndrsn, #344)

## 0.3.2 - 2021-02-05

### Added

- Now shows row gaps when filtering data

### Removed

- Remove unused currentFilter
- Drop support for IE11

### Fixed

- Ctrl+click to select also emits selectionchanged event (ndrsn, #342)
- Pass row index to defaultValue function (ndrsn, #265)
- Rename getColummnWidth -> getColumnWidth (ndrsn, #281)

## 0.3.1 - 2021-02-01

Nothing changed here, it was a failed attempt to get the type definitions
file automatically included in the NPM release.

## 0.3.0 - 2021-02-01

### Added

- Adds TypeScript type definitions (josh-hemphill, #333)

### Changed

- Make distinction between original data and view data (ndrsn, #334)
- Fixes typo and possible bug (voderl, #339)
- Split up tests into separate files (ndrsn)

## 0.25.4 - 2020-11-26

### Changed

- Hitting `Esc` to deselect now emits a `selectionchanged` event (twojtylak, #331)
- Upgrade and cleanup of dependencies, tests (josh-hemphill)

## 0.25.3 - 2020-11-26

### Changed

- Add missing parameter in function constructor (josh-hemphill)

## 0.25.2 - 2020-11-26

### Changed

- Fixes faulty ES module build (josh-hemphill, #318)
- Replaces eval call with function constructor (josh-hemphill, #322, #311)

### Removed

- Got rid unused test files (josh-hemphill, #323)

## 0.25.1 - 2020-11-19

### Added

- Build and export ES module version (josh-hemphill, #316, #317)
- Added linting (ndrsn)

### Changed

- Reformatted codebase with prettier, added `.prettierc` (ndrsn)
- Moved from AMD to ES6 modules (ndrsn, #310)

### Removed

- Got rid unused files `bower.json`, `build.txt`

## 0.24.4 - 2020-09-29

### Fixed

- Pasting no longer works when editable is set to `false` (ndrsn)
- When enabling `autoResizeRows`, total grid was not computed correctly (mdebrauw, #309)

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
