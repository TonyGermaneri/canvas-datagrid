Canvas Data Grid
================

[![NPM](https://nodei.co/npm/canvas-datagrid.png?downloads=true)](https://nodei.co/npm/canvas-datagrid/)

* High performance lightweight hierarchal canvas based data grid.
* Support for millions of rows and columns.
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Rich API of events, methods and properties optimized for CRUD, reporting and work flow applications.
* Zero dependencies, very small code base, distributed as a single 77k (19k gziped) file.

[Demo](https://tonygermaneri.github.io/canvas-datagrid/docs/tutorial-sample.html)

[Download](https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js)

[Documentation](https://tonygermaneri.github.io/canvas-datagrid/docs/index.html)

[GitHub](https://github.com/TonyGermaneri/canvas-datagrid)

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
