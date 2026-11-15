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

Works [with a bundler](/examples/Webpack3-AMD), without one, or as a [web component](#using-as-a-web-component).
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

See [Using with Vue](/examples/vue-demo) for a complete Vue 3 component, including how to register the custom element with the template compiler.

### Using React

See [Using with React](/examples/react-demo) for a function component that creates the grid once, updates it from props and disposes it on unmount.

### Using Angular

Import the library once so the custom element is registered, allow custom elements in the module or standalone component, and bind objects with property binding:

```ts
import 'canvas-datagrid';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<canvas-datagrid #grid [data]="rows" style="height: 300px; width: 100%"></canvas-datagrid>`,
})
export class GridComponent {
  rows = [{ col1: 'a', col2: 1 }];
  @ViewChild('grid') grid!: ElementRef<any>;
  ngAfterViewInit() {
    this.grid.nativeElement.addEventListener('endedit', (e: any) => console.log(e.cell.data));
  }
}
```

Do not create the grid with `canvasDatagrid()` *and* place a `<canvas-datagrid>` tag for the same instance; pick one. The "already been used with this registry" error means the library was loaded twice (for example once via `scripts` in `angular.json` and once via `import`).

## Using with TypeScript

Type declarations ship in the package. ES module importers get `dist/types.d.mts` and CommonJS importers get `dist/types.d.cts`, through the `"types"` condition in package.json `"exports"`. `moduleResolution: node10` uses `dist/types.d.ts`.

```ts
import canvasDatagrid, {
  type canvasDatagrid as CanvasDatagrid,
  type CanvasDatagridArgs,
} from 'canvas-datagrid';

const args: CanvasDatagridArgs = { parentNode: document.body, data: [] };
const grid: CanvasDatagrid = canvasDatagrid(args);
```

The declarations are generated from the JSDoc comments and are not yet strict-clean, so keep `skipLibCheck: true` in `tsconfig.json` (the default in most templates). In CommonJS code `require('canvas-datagrid')` returns the factory itself, so use `import canvasDatagrid = require('canvas-datagrid')`, or the default import with `esModuleInterop`.

0.27.1 and older have no `"types"` condition, so `moduleResolution` `bundler`, `node16` and `nodenext` (and the TypeScript 7 default) report `TS7016` for `'canvas-datagrid'`. With those versions and `bundler` (or the TypeScript 7 default), map the module to the declarations in `compilerOptions`: `"paths": { "canvas-datagrid": ["./node_modules/canvas-datagrid/dist/types.d.ts"] }`. That mapping does not help under `node16`/`nodenext`, where the file counts as CommonJS; upgrade instead. With 0.4.7 or older, add `declare module 'canvas-datagrid';` to a `.d.ts` file in your project.

### More demos

- [Using with React](/examples/react-demo)
- [Using with Vue](/examples/vue-demo)
- [Using with a bundler or module loader](/examples/Webpack3-AMD)
- [Create a web component grid](/examples/create-a-web-component-grid)
- [Load data on demand with fetch](/examples/xhr-demo)
- [Sparkline charts in cells](/examples/sparkline)
- [Large arrays](/examples/largeArrays)
- [Use a custom editor for a cell](/examples/custom-cell-editor)
- [All examples](/examples)

