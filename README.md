Canvas Data Grid
================

[![NPM](https://nodei.co/npm/canvas-datagrid.png?downloads=true)](https://nodei.co/npm/canvas-datagrid/)

* High performance lightweight hierarchal canvas based data grid.
* Support for millions of rows and columns.
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Rich API of events, methods and properties optimized for CRUD, reporting and work flow applications.
* Zero dependencies, very small code base, a single 94k (16k gziped) file.

[Demo](https://tonygermaneri.github.io/canvas-datagrid/docs/tutorial-sample.html)

[Documentation](https://tonygermaneri.github.io/canvas-datagrid/docs/index.html)

[GitHub](https://github.com/TonyGermaneri/canvas-datagrid)

Installation
============
You can install canvas-datagrid one of three ways:

1. Download the [source](https://raw.githubusercontent.com/TonyGermaneri/canvas-datagrid/master/lib/main.js) file from github.
2. Use bower

    bower install canvas-datagrid

3. Use npm

    npm install canvas-datagrid

Place the single source file `./lib/main.js` in your web page using
a script tag that points to the source or use a require framework.

If you do not use a require framework a function will
be added to the global scope of the web page called `canvasDatagrid`.

Getting started
===============

Works with require framework or without.
If used without require, `canvasDataGrid` is declared in the global scope.

    var grid = canvasDataGrid({
        parentNode: document.getElementById('myHtmlElement'),
        data: [
            {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
            {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
        ]
    });

Building documentation
======================

Although canvas-datagrid itself does not need to be built, if you are intrested in building
the documentation for the project, you will need to run the following commands.


Run npm install to get jsdoc and ink-docstrap.

    npm install

Build the docs (Unix)

    jsdoc -u ./tutorials -d ./docs -c ./jsdoc.json -t ./node_modules/ink-docstrap/template -R README.md -r ./lib; cp ./tutorials/*.js ./docs/

