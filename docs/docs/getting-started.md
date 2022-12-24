---
title: Getting Started
---

## Installation


With [npm](https://www.npmjs.com/package/canvas-datagrid)

```console
npm install canvas-datagrid
```

Place the single source file `./dist/canvas-datagrid.js` in your web page using a script tag that points to the source or use a bundler.

```html
<script src="dist/canvas-datagrid.js"></script>
```

Alternatively, instead of downloading and installing, you can link directly to an NPM CDN like [unpkg.com](https://unpkg.com).

```html
<script src="https://unpkg.com/canvas-datagrid"></script>
```

A function will be added to the global scope of the web page called `canvasDatagrid` as well as module loader definitions.


## Basic Usage

Works [with webpack](https://canvas-datagrid.js.org/amdDemo.html), [without webpack](https://canvas-datagrid.js.org/demo.html) or as a [web component](https://canvas-datagrid.js.org/webcomponentDemo.html).
No matter how you load it, `canvasDatagrid` is declared in the global scope.

Canvas-datagrid is a [Web Component](https://www.webcomponents.org/element/TonyGermaneri/canvas-datagrid) when
in a compatible browser, otherwise it is a `<canvas>` tag.


### Using pure Javascript

```js
var grid = canvasDatagrid();

document.body.appendChild(grid);

grid.data = [
  { col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3' },
  { col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3' },
];
```

### Using as a web component

```html
<canvas-datagrid class="myGridStyle" data="data can go here too">
  [
    {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
    {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
  ]
</canvas-datagrid>
```

or

```js
const grid = document.createElement('canvas-datagrid');

grid.data = [
  { col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3' },
  { col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3' },
];
```
### Using Vue

```vue
<canvas-datagrid :data.prop="[{"col1": "row 1 column 1"}]"></canvas-datagrid>
```

### More demos

- [Using Vue](https://canvas-datagrid.js.org/vueExample.html)

- [Using Webpack3: AMD](https://canvas-datagrid.js.org/amdDemo.html)

- [Using React](https://canvas-datagrid.js.org/reactExample.html)

- [Web component example](https://canvas-datagrid.js.org/webcomponentDemo.html)

- [Loading data with XHR](https://canvas-datagrid.js.org/demo.html)

- [Sparkline example](https://canvas-datagrid.js.org/sparklineDemo.html)

- [XHR data paging demo Jeopardy Questions API](https://canvas-datagrid.js.org/xhrPagingDemo.html)

Note about XHR paging demo: Thanks to [jservice](http://jservice.io/) for the use of the free paging API. You must "load unsafe scripts" or relevant command to allow HTTPS (github) to make XHR requests to HTTP (Jeopardy Questions API). There is nothing unsafe about this.

