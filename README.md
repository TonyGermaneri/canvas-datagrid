canvas-datagrid
---------------

[Demo](https://tonygermaneri.github.io/canvas-datagrid/tutorials/demo.html) - City of Chicago government employee list.  Thanks to [data.gov](https://www.data.gov/).

![canvas-datagrid](https://tonygermaneri.github.io/canvas-datagrid/images/datagrid1.png)

[![Coverage Status](https://coveralls.io/repos/github/TonyGermaneri/canvas-datagrid/badge.svg?branch=master&build=1640)](https://coveralls.io/github/TonyGermaneri/canvas-datagrid?branch=master)
[![NPM](https://img.shields.io/npm/v/canvas-datagrid.svg)](https://www.npmjs.com/package/canvas-datagrid)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/TonyGermaneri/canvas-datagrid)


* Works with Firefox, IE11, Edge, Safari and Chrome.
* Native support for touch devices (phones and tablets).
* Rich [documentation](https://tonygermaneri.github.io/canvas-datagrid/docs/), [tutorials](https://tonygermaneri.github.io/canvas-datagrid/docs/index.html#tutorials), and [slack support](https://canvas-datagrid.slack.com/).
* Single canvas element, drawn in immediate mode, data size does not impact performance.
* Support for unlimited rows and columns without paging or loading.
* Rich API of events, methods and properties using the familiar W3C DOM interface.
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Support for hierarchal drill in style row level inner grids as well grids in cells.
* Customizable hierarchal context menu.
* Built in and custom styles.
* W3C Web Component.  Works in all frameworks.
* Per-user styles, column sizes, row sizes, view preferences and settings using localStorage.
* Very small file size, no dependencies.

[Documentation](https://tonygermaneri.github.io/canvas-datagrid/docs/)

[Tutorials](https://tonygermaneri.github.io/canvas-datagrid/docs/index.html#tutorials)

[Slack Support](https://canvas-datagrid.slack.com/) (message author for invite)

[Style Builder](https://tonygermaneri.github.io/canvas-datagrid/tutorials/styleBuilder.html)

[Download latest version (minified)](https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js)

[Tests](https://tonygermaneri.github.io/canvas-datagrid/test/tests.html)

[Source Code](https://github.com/TonyGermaneri/canvas-datagrid)

[Latest Test Coverage](https://tonygermaneri.github.io/canvas-datagrid/build/report/lcov-report/index.html)

[Coveralls](https://coveralls.io/github/TonyGermaneri/canvas-datagrid)

Installation
------------

With [npm](https://www.npmjs.com/package/canvas-datagrid)

    npm install canvas-datagrid


Place the single source file `./dist/canvas-datagrid.js` in your web page using a script tag that points to the source or use webpack.

    <script src="dist/canvas-datagrid.js"></script>

Alternatively, instead of downloading and installing, you can link directly to an NPM CDN like [unpkg.com](https://unpkg.com).

    <script src="https://unpkg.com/canvas-datagrid"></script>


A function will be added to the global scope of the web page called `canvasDatagrid` as well as module loader definitions.

Getting started
---------------

Works [with webpack](https://tonygermaneri.github.io/canvas-datagrid/tutorials/amdDemo.html), [without webpack](https://tonygermaneri.github.io/canvas-datagrid/tutorials/demo.html) or as a [web component](https://tonygermaneri.github.io/canvas-datagrid/tutorials/webcomponentDemo.html).
No matter how you load it, `canvasDatagrid` is declared in the global scope.

Canvas-datagrid is a [Web Component](https://www.webcomponents.org/element/TonyGermaneri/canvas-datagrid) when
in a compatible browser, otherwise it is a `<canvas>` tag.

Using pure JavaScript
---------------------

    var grid = canvasDatagrid();
    document.body.appendChild(grid);
    grid.data = [
        {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
        {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
    ];


Using Web Component
-------------------

<!--
```
<custom-element-demo>
  <template>
    <script src="https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.debug.js"></script>
    <div style="height: 300px;"><next-code-block></next-code-block></div>
  </template>
</custom-element-demo>
```
-->

    <canvas-datagrid class="myGridStyle" data="data can go here too">[
        {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
        {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
    ]</canvas-datagrid>


or

    var grid = document.createElement('canvas-datagrid');
    grid.data = [
        {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
        {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
    ];


Using Vue
---------

    <canvas-datagrid :data.prop="[{"col1": "row 1 column 1"}]"></canvas-datagrid>


More Demos
----------

* [Using Vue](https://tonygermaneri.github.io/canvas-datagrid/tutorials/vueExample.html)

* [Using Webpack3: AMD](https://tonygermaneri.github.io/canvas-datagrid/tutorials/amdDemo.html)

* [Using React](https://tonygermaneri.github.io/canvas-datagrid/tutorials/reactExample.html)

* [Web component example](https://tonygermaneri.github.io/canvas-datagrid/tutorials/webcomponentDemo.html)

* [Loading data with XHR](https://tonygermaneri.github.io/canvas-datagrid/tutorials/demo.html)

* [Sparkline example](https://tonygermaneri.github.io/canvas-datagrid/tutorials/sparklineDemo.html)

* [XHR data paging demo Jeopardy Questions API](https://tonygermaneri.github.io/canvas-datagrid/tutorials/xhrPagingDemo.html)

Note about XHR paging demo: Thanks to [jservice](http://jservice.io/) for the use of the free paging API.  You must "load unsafe scripts" or relevant command to allow HTTPS (github) to make XHR requests to HTTP (Jeopardy Questions API).  There is nothing unsafe about this.

Building & Testing
------------------

To install development dependencies.  Required to build or test.

    npm install

To build production and debug versions.

    npm run build-all

To build production version.

    npm run build-prd

To build debug version.

    npm run build-dev

To build debug version anytime a file in ./lib changes.

    npm run build-watch

To build documentation.

    npm run build-docs

To run tests. Note: Headless tests will mostly fail due to lack of headless canvas pixel detection support.  Use VM testing or your browser.

    npm test


