Canvas Data Grid
================

* High performance hierarchal canvas based data grid.
* Support for millions of rows and columns.
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Support for touch based devices.
* Full documentation with live sample code.
* Style builder with built in styles.
* Per user styles, settings using localStorage.
* Single canvas element supporting multiple nested tree or cell grids.
* Rich API of events, methods and properties optimized for CRUD, reporting and work flow applications.
* Zero dependencies, very small code base, distributed as a single ~80k (~20k gziped) file.

[Demo](https://tonygermaneri.github.io/canvas-datagrid/docs/tutorial-sample.html)

[Download](https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js)

[Documentation](https://tonygermaneri.github.io/canvas-datagrid/docs/index.html)

[Style Builder](https://tonygermaneri.github.io/canvas-datagrid/tutorials/styleBuilder.html)

[GitHub](https://github.com/TonyGermaneri/canvas-datagrid)

[npm](https://www.npmjs.com/package/canvas-datagrid)

Installation
============
You can install canvas-datagrid one of three ways:

1. Download the [source](https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js) file from github.
2. Use npm

    npm install canvas-datagrid

3. Use bower

    bower install canvas-datagrid

Place the single source file `./dist/canvas-datagrid.js` in your web page using
a script tag that points to the source or use webpack.

If you do not use a webpack a function will
be added to the global scope of the web page called `canvasDatagrid`.

Getting started
===============

Works with webpack or without.
If used without webpack, `canvasDataGrid` is declared in the global scope.

    var grid = canvasDataGrid({
        parentNode: document.getElementById('myHtmlElement'),
        data: [
            {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
            {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
        ]
    });

Building
========

To build production version.

    npm install

To build debug version

    npm run-script build-dev

To build documentation

    npm run-script build-docs
