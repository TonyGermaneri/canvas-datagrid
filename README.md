Canvas Data Grid
================

* High performance hierarchal canvas based data grid.
* Support for millions of rows and columns.
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Support for touch based devices.
* Style builder with built in styles.
* Per user styles, settings using localStorage.
* Single canvas element supporting multiple nested tree or cell grids.
* Rich API of events, methods and properties optimized for CRUD, reporting and work flow applications.
* Zero dependencies, very small code base, distributed as a single ~80k (~20k gziped) file.

[Demo](https://tonygermaneri.github.io/canvas-datagrid/tutorials/demo.html)

[Style Builder](https://tonygermaneri.github.io/canvas-datagrid/tutorials/styleBuilder.html)

[Documentation](https://tonygermaneri.github.io/canvas-datagrid/docs/canvasDataGrid.html)

[Tutorials](https://tonygermaneri.github.io/canvas-datagrid/docs/tutorial-sample.html)

[Download latest version (minified)](https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js)

[Source Code](https://github.com/TonyGermaneri/canvas-datagrid)

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
<details>
Building
========

To build production version.

```shell
npm install
```

To build debug version

```shell
npm run-script build-dev
```

To build documentation

```shell
npm run-script build-docs
```
</details>