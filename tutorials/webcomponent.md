Web Component
=============

The grid can be instantiated as a web component.

```html
    <canvas-datagrid></canvas-datagrid>
```

To set data, add a data attribute.


```html
    <canvas-datagrid data="[{&quot;a&quot;: 0, &quot;b&quot;: 1}]"></canvas-datagrid>
```

To set attributes add attributes.

```html
    <canvas-datagrid selectionmode='row'></canvas-datagrid>
```

Styles are declared as custom css properties prefixed with --cdg- and hyphenated rather than camelCase.
For example, the style "backgroundColor" is set with "--cdg-background-color".  The web component
works with classes, css cascading, and in-line styles just like any other HTML element.

When instantiating the grid using the Webpack loader or the global function canvasDatagrid, class support will not work.

```html
    <canvas-datagrid data='[{"a": 0, "b": 1}]' style='--cdg-cell-background-color: tan;'></canvas-datagrid>
```

You can still access the grid as you would expect and the interface for the web component instance is the same as the module loaded or globally scoped version.  The web component version has additional properties that come from inheriting the base HTTPElement class.

For further reading about web components see: https://www.webcomponents.org/
