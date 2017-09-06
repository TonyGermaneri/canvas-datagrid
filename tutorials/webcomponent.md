Web Component
=============

The grid can be instantiated as a web component.

```html
    <canvas-datagrid></canvas-datagrid>
```

To set data, add a data attribute.


```html
    <canvas-datagrid data='[{"a": 0, "b": 1}]'></canvas-datagrid>
```

To set attributes add attributes.

```html
    <canvas-datagrid data='[{"a": 0, "b": 1}]' selectionmode='row'></canvas-datagrid>
```

To alter styles, add a style attribute.  To conform better to HTML conventions styles can be hyphenated, hyphenated with a custom `-cdg` prefix, or used in camelCase.
For example, all of these are valid for the style property `active-cell-color`: `activeCellColor`, `-cdg-active-cell-color`, and `active-cell-color`.
Your debugging tools might tell you that some of these style properties are unrecognized, but they will work none the less and are fully editable from within your debugging tool's element inspector.


```html
    <canvas-datagrid data='[{"a": 0, "b": 1}]' style='background-color: red; cell-background-color: tan;'></canvas-datagrid>
```

You can still access the grid as you would expect and the interface for the web component instance is the same as the module loaded or globally scoped version.  The web component version has additional properties that come from inheriting the base HTTPElement class.

For further reading about web components see: https://www.webcomponents.org/
