CHANGELOG.md

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.5.0 - 2026-09-19

### Added

- `activecellchanged` event (Tomasz Pędraszewski, #582)
- `fillLastColumn` attribute: the last visible column fills the remaining grid width and its outer edge cannot be resized (Cauho, #589, fixes #474)
- `allowGridExpandOnPaste` attribute: pasted data larger than the grid adds rows and columns (Roman Stetsyk, #553, fixes #552); the expansion happens in one pass
- `allowColumnSelection` attribute: when false, header clicks sort without selecting the column (#473)
- `maxCanvasSize` attribute: auto-sized grids stop growing at the browser canvas limit and scroll for the rest (#254)
- `datachanged` fires for every data mutation with `e.source` (`edit`, `paste`, `cut`, `delete`, `fill`, `addrow`, ...); `afterpaste` cell tuples carry the pasted value (#250, #512, #549)
- A `ResizeObserver` on the host and its parent keeps auto/percentage-sized grids in sync with layout changes without calling `resize()` (#289, #239)
- `getColumnWidth` and `getRowHeight` are public (#448)
- `dist/types.d.ts` is a real module with a default-exported factory, `canvasDatagrid` class/namespace and `CanvasDatagridArgs`; `npm test` type-checks it (#567)
- CSS font shorthand support: weights/styles are kept, pt/em/rem/% sizes are converted (#157)
- Docs: "Using with React/Vue/Angular", "Using with TypeScript", "Use a custom editor for a cell", "Load data on demand with fetch", "Sparkline charts", "Large arrays"; demo scripts moved into the docs (evanbenjamin, #570)

### Changed

- `resizerow` always carries `rowIndex`, `height`, `width`, `x`, `y`, `draggingItem`; `cellHeight` and `row` remain as aliases (#503)
- `grid.changes` is keyed by the bound row index instead of the view row index (#418)
- `singleSelectionMode` now also limits drag, shift and ctrl selection to one row/cell (#472)
- Column reordering no longer requires `allowRowReordering`; the right part of each header is a reorder grab zone (`columnGrabZoneSize`) and a plain header click still sorts (#514)
- A mouseup anywhere ends a selection drag, not only a mouseup over the canvas
- `touchstart` is a passive listener (#328)
- `treeHorizontalScroll` is documented as reserved/not implemented (#314)
- CI runs on Node 20/22 with current GitHub Actions; the docs build works on Node 23+ (#574 build)

### Fixed

- Delete/Backspace, cut and the fill handle respect `editable: false` (#587, #458)
- Deleting the edited row in `beforeendedit` no longer re-adds it (#583)
- `treeGridAttributes` are applied to child grids (#444)
- `fitColumnToValues()` without a name fits every column and unknown names no longer throw (#193)
- Setting `columnOrder` redraws (#160)
- `verticalAlignment: 'bottom'` is no longer one line too high (#530)
- The number filter matches numeric cell values (#431)
- `rendertext` handlers may supply lines without a width; right/center alignment no longer blanks the column (#460)
- Assigning a new array to `e.items` in the `contextmenu` event replaces the menu (#263)
- `scrollIndexRect` is initialised before the first draw (#226)
- Touch handlers tolerate a missing starting cell (#554)
- Copy with an active cell but no selection no longer throws (#566)
- The string sorter coerces values so numbers and blanks sort consistently (#256)
- The enum editor opens its picker immediately where supported (#230)
- The web component's MutationObserver is disconnected on dispose/disconnect and never stacked; dispose is idempotent and removes every listener (#237, #338, #455)
- No `eval` in the bundles; the grid works under a CSP without `unsafe-eval` (#311)
- The context menu survives the click macOS Safari sends after a ctrl-click (#521)
- Docs: `{@link}` tags render as links (#574); broken demo links (#540, #562, #563, #568); the format-data example no longer throws on invalid dates (#576); the rendertext example uses `formattext` (#262)

## 0.4.7 - 2023-05-22

- Ensure only cells from selection get copied onto clipboard (mdebrauw, #556)
- Fix clearing of data when filter applied (mdebrauw, #560)
- Fixes 'paste into wrong cell when columns are reordered' (romanstetsyk, #518)

## 0.4.6 - 2023-04-03

## Added

- Add class name to allow targeting context menu by CSS (ilyaem, #526)

## Changed

- Add more tests for properties `selections` and `selectionList` (hangxingliu, #505)
- Improve row/column resizing (velitasali, #502)
- Re-implement(Optimize) select function (hangxingliu, #498)

## Fixed

- Fix sorting on header click (romanstetsyk, #550)
- Fix activeColumnHeaderCell docs (HitomiTenshi, #513)
- Fix some small bugs (hangxingliu, #504)

## 0.4.5 - 2022-03-16

## Added

- Added support for filling cells using a user-passed fill function (velitasali, #500)

## 0.4.4 - 2022-02-23

## Added

- Introduce frozen style markers (like Google Sheets) (xianzhi3, hangxingliu, #483)
- Dispatch column hide/unhide events (mdebrauw, #491)
- Allow cell editor overflow with long content (xianzhi3, #492)

## Fixed

- Fix bug that cleared the canvas under a certain unusual refresh flow (hangxingliu, #494)

## 0.4.3 - 2022-02-16

## Added

- Ability to hide rows/cols with UI toggle (hangxingliu, #480)
- Add Vue setup instructions (Bouke Versteegh, #482)

## Fixed

- Update column resizing including header (xianzhi3, #486)

## 0.4.2 - 2022-01-22

## Fixed

- Cancel moving when cursor exits grid (xianzhi3 #476)
- Fix clearing cells when grid is filtered (mdebrauw, #478)

## 0.4.1 - 2022-01-19

## Fixed

- Update row/column selection (xianzhi3, #467)
- Fix the behavior of the conext menu item used to hide column (hangxingliu, #470)

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
