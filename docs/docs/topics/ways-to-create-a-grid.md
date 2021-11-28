---
title: Ways to create a grid
---

- Web component by using the tag `<canvas-datagrid></canvas-datagrid>` anywhere in your document.
- Web component by running `var foo = document.createElement('canvas-datagrid')`.
- Webpack3 universal module loader by adding one of many module loaders to your application code. See example: {@link https://canvas-datagrid.js.org/amdDemo.html}.
- You can also load the grid by invoking the global method `var foo = canvasDatagrid(<args>);` See example: {@link https://canvas-datagrid.js.org/demo.html}

If you create the grid using the non-web component model, you can attach the grid to an existing canvas by passing the canvas in as the `parentNode` when you instantiate the grid using the module loader or global versions. This is not possible when instantiating using `createElement` or markup.

With the exception of attaching to an existing canvas, the grid will attempt to create a Shadow DOM element and attach a canvas within.

- Support for attaching to existing canvas elements is experimental.

- In browsers that do not support custom tags, a `<canvas>` tag is used in place of the `<canvas-datagrid>` tag.

- In browsers that do not support Shadow DOM, no shadow root will be created. In this mode cascading CSS can alter the grid, altering behavior in potentially breaking ways. Careful application of CSS is required. This can effect the grid in-line editing and context menus.
