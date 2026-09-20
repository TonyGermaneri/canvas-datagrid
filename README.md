# canvas-datagrid

[Demo](https://canvas-datagrid.js.org/examples/create-new-grid)

![canvas-datagrid](https://canvas-datagrid.js.org/assets/images/datagrid1-a4d23a352c39919c40450d272a1cd4bd.png)

[![NPM](https://img.shields.io/npm/v/canvas-datagrid.svg)](https://www.npmjs.com/package/canvas-datagrid)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/TonyGermaneri/canvas-datagrid)

- Works with Firefox, Edge, Safari and Chrome.
- Native support for touch devices (phones and tablets).
- Rich [documentation](https://canvas-datagrid.js.org/), [examples](https://canvas-datagrid.js.org/examples), and [slack support](https://canvas-datagrid.slack.com/).
- Single canvas element, drawn in immediate mode, data size does not impact performance.
- Support for unlimited rows and columns without paging or loading.
- Rich API of events, methods and properties using the familiar W3C DOM interface.
- Extensible styling, filtering, formatting, resizing, selecting, and ordering.
- Support for hierarchal drill in style row level inner grids as well grids in cells.
- Customizable hierarchal context menu.
- Built in and custom styles.
- W3C Web Component. Works in all frameworks.
- Per-user styles, column sizes, row sizes, view preferences and settings using localStorage.
- Small file size

[Documentation](https://canvas-datagrid.js.org/)

[Examples](https://canvas-datagrid.js.org/examples)

[Slack Support](https://canvas-datagrid.slack.com/) (message author for invite)

[Style reference](https://canvas-datagrid.js.org/reference/styling)

[Download latest version (minified)](https://canvas-datagrid.js.org/canvas-datagrid.js)

[Source Code](https://github.com/TonyGermaneri/canvas-datagrid)

## Installation

With [npm](https://www.npmjs.com/package/canvas-datagrid)

```console
npm install canvas-datagrid
```

Place the single source file `./dist/canvas-datagrid.js` in your web page using a script tag that points to the source or use webpack.

```html
<script src="dist/canvas-datagrid.js"></script>
```

Alternatively, instead of downloading and installing, you can link directly to an NPM CDN like [unpkg.com](https://unpkg.com).

```html
<script src="https://unpkg.com/canvas-datagrid"></script>
```

A function will be added to the global scope of the web page called `canvasDatagrid` as well as module loader definitions.

## Getting started

Works [with a bundler](https://canvas-datagrid.js.org/examples/Webpack3-AMD), [without one](https://canvas-datagrid.js.org/getting-started#using-pure-javascript) or as a [web component](https://canvas-datagrid.js.org/getting-started#using-as-a-web-component).
No matter how you load it, `canvasDatagrid` is declared in the global scope.

Canvas-datagrid is a [Web Component](https://www.webcomponents.org/element/TonyGermaneri/canvas-datagrid) when
in a compatible browser, otherwise it is a `<canvas>` tag.

## Using pure JavaScript

```js
var grid = canvasDatagrid();
document.body.appendChild(grid);
grid.data = [
  { col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3' },
  { col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3' },
];
```

## Using Web Component

<!--
```
<custom-element-demo>
  <template>
    <script src="https://canvas-datagrid.js.org/canvas-datagrid.debug.js"></script>
    <div style="height: 300px;"><next-code-block></next-code-block></div>
  </template>
</custom-element-demo>
```
-->

```html
<canvas-datagrid class="myGridStyle" data="data can go here too"
  >[ {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column
  3"}, {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2
  column 3"} ]</canvas-datagrid
>
```

or

```js
var grid = document.createElement('canvas-datagrid');
grid.data = [
  { col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3' },
  { col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3' },
];
```

## Using Vue

```vue
<canvas-datagrid :data.prop="[{"col1": "row 1 column 1"}]"></canvas-datagrid>
```

See [Using with Vue](https://canvas-datagrid.js.org/examples/vue-demo) for a full component, and [Using with React](https://canvas-datagrid.js.org/examples/react-demo) for React.

## Using TypeScript

Type declarations are included. Import the factory and, when you need them, the instance and argument types:

```ts
import canvasDatagrid, {
  type canvasDatagrid as CanvasDatagrid,
  type CanvasDatagridArgs,
} from 'canvas-datagrid';
```

The declarations are generated from JSDoc and are not strict-clean yet, so keep `skipLibCheck: true` in your `tsconfig.json`.

## More Demos

- [Using with React](https://canvas-datagrid.js.org/examples/react-demo)
- [Using with Vue](https://canvas-datagrid.js.org/examples/vue-demo)
- [Using with a bundler or module loader](https://canvas-datagrid.js.org/examples/Webpack3-AMD)
- [Create a web component grid](https://canvas-datagrid.js.org/examples/create-a-web-component-grid)
- [Load data on demand with fetch](https://canvas-datagrid.js.org/examples/xhr-demo)
- [Sparkline charts in cells](https://canvas-datagrid.js.org/examples/sparkline)
- [Large arrays](https://canvas-datagrid.js.org/examples/largeArrays)
- [Use a custom editor for a cell](https://canvas-datagrid.js.org/examples/custom-cell-editor)
- [All examples](https://canvas-datagrid.js.org/examples)

## Building & Testing

To install development dependencies. Required to build or test.

    npm install

To build production and debug versions:

    npm run build

To build documentation:

    npm run build:docs

To build types:

    npm run build:types

To run tests. Note: Headless tests will mostly fail due to lack of headless canvas pixel detection support. Use VM testing or your browser.

    npm test

### Windows 10 WSL Testing
*This is info for wsl version 1. v2 seems to be [different](https://dev.to/davelsan/comment/nnf5).*

- `CHROME_BIN` needs to be set to the location of your Google Chrome exe in Windows. (e.g. `/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe`)
   *in WSL, `export CHROME_BIN='path/to/chrome'`*
- Chrome needs access to [karma's temp folder](https://stackoverflow.com/a/56204265/292067).
  - Create a `tmp` folder on the same Windows drive as your repo.
  - set `TEMP` to a folder that exists on the same Windows drive as your repo. (matching capitalization probably matters)
    *in WSL, `export TEMP='/Temp/karma'`, if your repo is on drive C, then create folder C:\Temp\karma*
- karma.conf.js needs to be edited
  - Change the browser from `ChromeHeadless` to `Chrome`
  - Modify to run ChromeHeadless without sandboxing. This is not ideal, but it seems to be necessary in [WSL](https://github.com/microsoft/WSL/issues/3282) and [Linux containers](https://docs.travis-ci.com/user/chrome#sandboxing) ([see also](https://github.com/karma-runner/karma-chrome-launcher/issues/158#issuecomment-339265457))
    - Add a custom launcher
      ```
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
        }
      }
      ```
    - Change the browser from `ChromeHeadless` to `ChromeHeadlessNoSandbox`
