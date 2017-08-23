Canvas Data Grid
================

[Demo](https://tonygermaneri.github.io/canvas-datagrid/tutorials/demo.html)

![canvas-datagrid](https://tonygermaneri.github.io/canvas-datagrid/images/datagrid1.png)

[![Coverage Status](https://coveralls.io/repos/github/TonyGermaneri/canvas-datagrid/badge.svg?branch=master&build=1540)](https://coveralls.io/github/TonyGermaneri/canvas-datagrid?branch=master)

* Support for millions of contiguous rows and columns without paging or loading.
* Support for touch devices (phones and tablets).
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Built in and custom styles.
* Per-user styles, settings using localStorage.
* Single canvas element supporting multiple nested tree or cell grids.
* Rich API of events, methods and properties optimized for CRUD, reporting and work flow applications.
* Zero dependencies, very small code base, distributed as a single ~80k (~20k gziped) file.
* Hierarchal context menu.

[Make your own custom styles](https://tonygermaneri.github.io/canvas-datagrid/tutorials/styleBuilder.html)

[Documentation](https://tonygermaneri.github.io/canvas-datagrid/docs/canvasDataGrid.html)

[Tutorials](https://tonygermaneri.github.io/canvas-datagrid/docs/tutorial-sample.html)

[Download latest version (minified)](https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js)

[Tests](https://tonygermaneri.github.io/canvas-datagrid/test/tests.html)

[Source Code](https://github.com/TonyGermaneri/canvas-datagrid)

[Latest Test Coverage](https://tonygermaneri.github.io/canvas-datagrid/build/report/lcov-report/index.html)

[Coveralls](https://coveralls.io/github/TonyGermaneri/canvas-datagrid)

Installation
============

```html
<script src="dist/canvas-datagrid.js"></script>
```

With [npm](https://www.npmjs.com/package/canvas-datagrid)


```shell
npm install canvas-datagrid
```

With [bower](https://libraries.io/bower/canvas-datagrid)

```shell
bower install canvas-datagrid
```

Place the single source file `./dist/canvas-datagrid.js` in your web page using
a script tag that points to the source or use webpack.

If you do not use a webpack a function will
be added to the global scope of the web page called `canvasDatagrid`.

Getting started
===============

Works with webpack or without.
If used without webpack, `canvasDatagrid` is declared in the global scope.
The container can be any block element.  `canvasDatagrid` generates its own canvas element.

```javascript
var grid = canvasDatagrid({
    parentNode: document.getElementById('container'),
    data: [
        {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
        {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
    ]
});
```

Building & Testing
==================
<details>
To build production version.

```shell
npm install
```

To build debug version

```shell
npm run build-dev
```

To build documentation

```shell
npm run build-docs
```

To run tests

```shell
npm test
```
</details>
